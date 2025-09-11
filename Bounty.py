import requests
from bs4 import BeautifulSoup
import time, os, json, re, csv
from io import StringIO
from datetime import datetime, timedelta
import winsound

# ================== Налаштування ==================
URLS = [
    ("https://bitcointalk.org/index.php?topic=5556102", "TPUMPTOGETHER"),
    ("https://bitcointalk.org/index.php?topic=5557056", "PALLADIUM"),
    ("https://bitcointalk.org/index.php?topic=5557738", "VCC"),
    ("https://bitcointalk.org/index.php?topic=5558465", "Etarn"),
]

SHEETS = [
    ("1HKmuJ9H37lJzdiAnRouiOKbtVVfpK--Br5AZ1t63DXM", "1895529244", "TPUMPTOGETHER", "1,3,4,5,6"),
    ("1FxK58HZzwV9CEbeUAvbea-AavkBk5wbL9Le7qVZDNSA", "1752623785", "PALLADIUM", "1,3,4,5,6,7"),
    ("1mul75vjw5bi1nCnj2yAKnm3KAbDBxL5_4OUtX-JxwVk", "1772775340", "VCC Twitter", "1,3,4,5,6,7"),
    ("1mul75vjw5bi1nCnj2yAKnm3KAbDBxL5_4OUtX-JxwVk", "1286581302", "VCC Telegram", "1,3,4,5,6"),

]

BOUNTY_URLS = [
    ("https://bitcointalk.org/index.php?board=238.0", "Bounties"),
]

MY_ACCOUNTS = ["rozewsee", "Burlay", "shuryaeol", "dementnin", "shpovain", "zagorrus", "timoshrus"]

LAST_ID_FILE = "last_msgid.txt"
LAST_BOUNTY_FILE = "last_bounty.txt"
CHECK_INTERVAL = 300  # 5 хв

GREEN, BLUE, YELLOW, RESET, MAGENTA = "\033[92m", "\033[94m", "\033[93m", "\033[0m", "\033[95m"

# ================== Функції ==================
def beep():
    winsound.Beep(800, 200)
    winsound.Beep(1200, 200)
    winsound.Beep(1000, 400)

def get_time():
    return datetime.now().strftime("%H:%M:%S")

def wait_next(interval_minutes=5):
    next_time = datetime.now() + timedelta(minutes=interval_minutes)
    next_time = next_time.replace(second=0, microsecond=0)
    sleep_seconds = (next_time - datetime.now()).total_seconds()
    print(f"Перевірка завершена, наступна через {interval_minutes} хвилин | {next_time.strftime('%H:%M:%S')}")
    if sleep_seconds > 0:
        time.sleep(sleep_seconds)

# ================== Класи ==================
class BitcointalkWatcher:
    def __init__(self, urls, last_id_file):
        self.urls, self.last_id_file = urls, last_id_file
        self.last_ids = self.load()

    def load(self):
        if os.path.exists(self.last_id_file):
            with open(self.last_id_file, "r") as f:
                return json.load(f)
        return {}

    def save(self):
        with open(self.last_id_file, "w") as f:
            json.dump(self.last_ids, f)

    def get_last(self, url):
        try:
            r = requests.get(url + ".new#new", timeout=15)
            soup = BeautifulSoup(r.text, "html.parser")
            anchors = soup.select("a[name^='msg']")
            if not anchors:
                return None, None
            last = anchors[-1]
            msg_id = int(last["name"].replace("msg", ""))
            post = last.find_next("div", class_="post")
            snippet = ""
            if post:
                snippet = re.sub(r"\s+", " ", post.get_text(separator=" ", strip=True))
                snippet = snippet.replace("https:", "").replace("http:", "").replace("www.", "").replace("#", "").replace("@", "")
                if len(snippet) > 120:
                    snippet = snippet[:120] + "..."
            return msg_id, snippet
        except:
            return None, None

    def check(self):
        for url, name in self.urls:
            current, snippet = self.get_last(url)
            if current:
                prev = self.last_ids.get(url)
                if not prev or current > prev:
                    print(f"{GREEN}{name} | Bitcointalk | {get_time()} | {snippet} | {url}.new#new{RESET}")
                    beep()
                self.last_ids[url] = current
        self.save()


class GoogleSheetsWatcher:
    def __init__(self, sheets):
        self.sheets, self.last_rows = sheets, {}

    def check(self):
        for sid, gid, name, *_ in self.sheets:
            try:
                url = f"https://docs.google.com/spreadsheets/d/{sid}/export?format=csv&gid={gid}"
                r = requests.get(url, timeout=15); r.raise_for_status()
                data = list(csv.reader(StringIO(r.text)))
                if not data:
                    continue

                last = re.sub(r"\s+", " ", " | ".join(data[-1])
                              .replace("https:", "")
                              .replace("http:", "")
                              .replace("#", "")
                              .replace("@", "")).strip()
                if len(last) > 130:
                    last = last[:130] + "..."

                key = f"{sid}_{gid}"  # унікальний ключ для кожної вкладки
                prev = self.last_rows.get(key)

                if prev and last != prev:
                    print(f"{BLUE}{name} | Google Sheets | {get_time()} | {last} | https://docs.google.com/spreadsheets/d/{sid}{RESET}")
                    beep()

                self.last_rows[key] = last

            except Exception as e:
                print(f"? GoogleSheetsWatcher error: {e}")


class MyAccountsWatcher:
    def __init__(self, sheets, accounts):
        self.sheets, self.accounts = sheets, accounts
        self.last_found = {}  # щоб уникати повторів

    def run_once(self):
        for sid, gid, name, hide_cols in self.sheets:
            try:
                url = f"https://docs.google.com/spreadsheets/d/{sid}/export?format=csv&gid={gid}"
                r = requests.get(url, timeout=15); r.raise_for_status()
                data = list(csv.reader(StringIO(r.text)))
                if not data:
                    continue

                hide_indices = set(int(i) - 1 for i in hide_cols.split(",") if i.strip().isdigit())
                key = f"{sid}_{gid}"
                if key not in self.last_found:
                    self.last_found[key] = []

                found = []
                for row in data:
                    for acc in self.accounts:
                        if any(acc.lower() in (cell or "").lower() for cell in row):
                            filtered = [cell for i, cell in enumerate(row) if i not in hide_indices]
                            if filtered not in self.last_found[key]:
                                found.append(filtered)
                                self.last_found[key].append(filtered)
                            break

                if found:
                    print(f"\n{YELLOW}{name} | Google Sheets | https://docs.google.com/spreadsheets/d/{sid}{RESET}")

                    col_count = max(len(row) for row in found)
                    col_widths = [max(len(str(row[i])) if i < len(row) else 0 for row in found) for i in range(col_count)]

                    for row in found:
                        line = ""
                        for i, cell in enumerate(row):
                            if i == 0:
                                line += f"{cell:<{col_widths[i]}}  "
                            else:
                                line += f"{cell:>{col_widths[i]}}  "
                        print(f"{YELLOW}{line.strip()}{RESET}")

            except Exception as e:
                print(f"? MyAccountsWatcher error: {e}")


class NewBountyWatcher:
    def __init__(self, urls, last_file=LAST_BOUNTY_FILE):
        self.urls = urls
        self.last_file = last_file
        self.last = self.load()
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                          "AppleWebKit/537.36 (KHTML, like Gecko) "
                          "Chrome/127.0.0.1 Safari/537.36"
        }

    def load(self):
        if os.path.exists(self.last_file):
            with open(self.last_file, "r", encoding="utf-8") as f:
                return json.load(f)
        return {}

    def save(self):
        with open(self.last_file, "w", encoding="utf-8") as f:
            json.dump(self.last, f, ensure_ascii=False, indent=2)

    def fetch(self, url):
        try:
            r = requests.get(url, headers=self.headers, timeout=15)
            r.raise_for_status()
            soup = BeautifulSoup(r.text, "html.parser")

            topics = []
            for row in soup.select("tr"):
                title_tag = row.select_one('a[href*="topic="]')
                if not title_tag:
                    continue

                title = title_tag.get_text(strip=True)
                link = title_tag["href"]

                # шукаємо дату створення
                started = row.select_one("td:nth-of-type(2)")
                created_date = None
                if started:
                    txt = started.get_text(" ", strip=True)
                    # прибираємо час і залишаємо тільки дату
                    m = re.search(r"([A-Za-z]+ \d{1,2}, \d{4})", txt)
                    if m:
                        try:
                            created_date = datetime.strptime(m.group(1), "%B %d, %Y")
                        except:
                            created_date = None

                topics.append((link, title, created_date))
            return topics
        except Exception as e:
            print(f"? Помилка при fetch({url}): {e}")
            return []

    def get_page_count(self, url):
        try:
            r = requests.get(url, headers=self.headers, timeout=15)
            r.raise_for_status()
            soup = BeautifulSoup(r.text, "html.parser")
            nav = soup.select("td.navPages a")
            if nav:
                try:
                    return int(nav[-1].get_text(strip=True))
                except:
                    return 1
            return 1
        except:
            return 1

    def check(self):
        for url, name in self.urls:
            topics = self.fetch(url)
            if not topics:
                continue
            if url not in self.last:
                self.last[url] = []

            for link, title, created in topics:
                if "topic=" not in link:
                    continue
                clean_link = link.split(".msg")[0] + ".0"

                if clean_link not in self.last[url]:
                    pages = self.get_page_count(clean_link)
                    created_str = created.strftime("%Y-%m-%d") if created else "невідомо"

                    snippet = title[:130] + "..." if len(title) > 130 else title
                    print(f"{MAGENTA}New Bounty | {pages} | {created_str} | {snippet} | {clean_link}{RESET}")
                    beep()
                    self.last[url].append(clean_link)
        self.save()


# ================== Основна програма ==================
def main():
    bt = BitcointalkWatcher(URLS, LAST_ID_FILE)  # 🟢
    gs = GoogleSheetsWatcher(SHEETS)             # 🔵
    nb = NewBountyWatcher(BOUNTY_URLS)           # 🟣
    ma = MyAccountsWatcher(SHEETS, MY_ACCOUNTS)  # 🟡

    print("⏳ Перша перевірка...")
    time.sleep(1)

    ma.run_once()
    nb.check()
    bt.check()
    gs.check()
    wait_next(5)

    while True:
        bt.check()
        gs.check()
        nb.check()
        ma.run_once()
        wait_next(5)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n🔴 Програму зупинено користувачем.")
