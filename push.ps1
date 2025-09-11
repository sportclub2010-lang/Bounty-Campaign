# push.ps1 — автоматичний пуш всіх змін на GitHub

# Додаємо всі зміни
git add .

# Створюємо коміт із поточною датою та часом
$commitMessage = "auto update $(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss')"
git commit -m $commitMessage

# Відправляємо на GitHub
git push
