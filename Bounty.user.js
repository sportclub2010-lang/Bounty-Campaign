// ==UserScript==
// @name        Bounty Campaign
// @version     1
// @namespace   1
// @author      sportclub2010
// @include     https://x.com*
// @include     https://www.facebook.com*
// @include     https://www.instagram.com*
// @include     https://discord.com*
// @include     https://www.reddit.com*
// @include     https://www.youtube.com*
// @include     https://web.telegram.org*
// @include     https://bitcointalk.org/index.php*
// @include     https://docs.google.com/spreadsheets*
// @exclude     https://docs.google.com/spreadsheets/d/1_roxeszNBcesK_b-cWtA57dd-aTiSGsTGtre1Mvc5Gc*
// @grant       GM_deleteValue
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_setClipboard
// @updateURL   https://raw.githubusercontent.com/sportclub2010-lang/Bounty-Campaign/main/Bounty.user.js
// @downloadURL https://raw.githubusercontent.com/sportclub2010-lang/Bounty-Campaign/main/Bounty.user.js
// ==/UserScript==
alert("test2");
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
// about:config dom.allow_scripts_to_close_windows = true

var SomeTweet = 'репост'; // В профілі кампанії є чужий твіт, ретрвіт... в коді є слово 'репост'

var sleep = 2000;
var url = document.location.href;
var _url = '';
var url2 = '';
var hashtag = '';
var text = '';
var intervals;
var article;

var index = 0;
var _index = 0;
var current = 1;
var _current = 0;
var tweetAll = '';
var correction = 50;

var str = '';
var backgroundColor_01 = 'silver';
var backgroundColor_02 = 'gold';
var backgroundColor_03 = 'magenta';

var copy = '';
var error = false;

if(GM_getValue("AllNumber") == undefined) GM_setValue("AllNumber", 1);
if(GM_getValue("TweetNumber") == undefined) GM_setValue("TweetNumber", 1);
if(GM_getValue("PostNumber") == undefined) GM_setValue("PostNumber", 1);
if(GM_getValue("InstagramNumber") == undefined) GM_setValue("InstagramNumber", 1);
if(GM_getValue("RedditNumber") == undefined) GM_setValue("RedditNumber", 1);
if(GM_getValue("Double") == undefined) GM_setValue("Double", '');
if(GM_getValue("url") == undefined) GM_setValue("url", '');
if(GM_getValue("getClipboard") == undefined) GM_setValue("getClipboard", 'false');
if(GM_getValue("RepeatDay") == undefined) GM_setValue("RepeatDay", ''); // Повтори сьогодня
if(GM_getValue("Girls") == undefined) GM_setValue("Girls", 1); // Розкрутка в інстаграм

if(GM_getValue("text") == undefined){
    GM_setValue("text", '');
    alert('Треба ввести тексти постів... Це тут https://x.com/i/bookmarks'); // Тексти постів
}

//GM_deleteValue("Account");
if(GM_getValue("Account") == undefined) Account();
function Account(){
    var div = document.createElement("div");
    div.style.width='250px';
    div.style.height='100px';
    div.style.position='absolute';
    div.style.left='30px';
    div.style.top='10px';
    document.body.appendChild(div);

    var textarea = document.createElement("textarea");
    textarea.cols = "35";
    textarea.rows = "2";
    div.appendChild(textarea);

    var btn = document.createElement('button');
    btn.style.width = '300px';
    btn.style.height = '30px';
    btn.innerHTML = 'Сохранить';
    div.appendChild(btn);
    btn.onclick = function(event){
        GM_setValue("Account", textarea.value); // 1, 2, 3, 4, ... порядковый номер
        location.reload();
    }
}

var date = new Date();
const days = ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П’ятниця", "Субота"];
const today = new Date().getDay(); // Отримуємо номер дня (0 - неділя, 1 - понеділок ...)
//console.log("Сьогодні:", days[today]);

//date.setDate(date.getDate() + 1); // Додаємо 1 день, імітуючи "завтра" (для тестування)
var accountShift = parseInt(GM_getValue("Account"), 10); // Отримуємо номер акаунта (1-7)
// Визначаємо день тижня для кожного акаунта зі зміщенням
var shiftedDate = new Date();
shiftedDate.setDate(date.getDate() - accountShift + 1); // Зміщуємо дату назад відповідно до акаунта
var day = 8 - (shiftedDate.getDay() + 1); // Реверсуємо порядок днів (7 → 1, 6 → 2, ...)
/*alert('Сьогодні ' + days[today] +
      ' | Account ' + accountShift +
      ' | Модифікована дата ' + shiftedDate.toDateString() +
      ' | День кліків: ' + day);
*/

if (document.location.href.indexOf('https://docs.google.com/spreadsheets') != -1){ // https://docs.google.com/spreadsheets ---------------------------------
    var _boolean = false;
    function Start(){
        var mymenu = document.querySelectorAll('[role="button"]');
        if(mymenu.length == 0) setTimeout(Start, sleep);
        else {
            for (i=0;i<mymenu.length;i++){
                if(mymenu[i].textContent == 'Меню'){
                    _boolean = true;
                    mymenu[i].style.backgroundColor = 'MediumAquamarine';
                }
            }
            if(_boolean == false) setTimeout(Start, sleep);
        }
    }
    setTimeout(Start, sleep);

}

// ----------------------------------------------------------------------------------------------------------------

if (document.location.href.indexOf('https://x.com') != -1){ // https://x.com

    var div = document.createElement("div");
    div.style.width='10px';
    div.style.height='10px';
    div.style.position='fixed';
    div.style.right='400px';
    div.style.top='10px';
    document.body.appendChild(div);

    var info = document.createElement("textarea");
    info.cols = "45";
    info.rows = "1";
    div.appendChild(info);

    function Info(_info){
        info.value += _info + '\n';
		if (info.value.length > 10){
			info.cols = "45";
			info.rows = "40";
		}
    }

    // Tweet
    if (document.location.href.indexOf('Tweet') != -1){
        Info('Tweet');
        function Start(){
            Info('Start()');
            var array = url.split('Tweet');
            array = array[1].split('%20');
            var hashtag = '';
            for (i=0;i<array.length;i++){
                hashtag += array[i] + ' ';
                hashtag = hashtag.replace('`', "'"); // замена символа
            }

            text = GM_getValue("text").split('\n');
            if(parseFloat(GM_getValue("TweetNumber")) > text.length-2) GM_setValue("TweetNumber", 0);
            else GM_setValue("TweetNumber", parseFloat(GM_getValue("TweetNumber"))+1);

            text = GM_getValue("text").split('\n');
            str = text[parseFloat(GM_getValue("TweetNumber"))] + ' ' + hashtag;

            setTimeout(ButtonTweet, sleep);
        }
        setTimeout(Start, sleep);

        function ButtonTweet(){
            Info('Button New Tweet()');
            var button = document.querySelectorAll('[data-testid="SideNav_NewTweet_Button"]');
            if(button.length == 0) setTimeout(ButtonTweet, sleep);
            else {
                Info('  button: ' + button.length);
                button[0].click();
                Info('  button click');
                setTimeout(Modal, sleep);
            }
        }

        function Modal(){
            Info('Modal()');
            var booleans = false;
            function Load(){
                var modal = document.querySelectorAll('[role="dialog"]');
                if(modal.length == 0) setTimeout(Modal, sleep);
                else{
                    Info('  modal: ' + modal.length);
                    booleans = true;
                    var textbox = modal[0].querySelectorAll('[role="textbox"]');
                    Info('  textbox: ' + textbox.length);
                    var interval = setInterval(Interval, sleep);
                    function Interval(){
                        if(textbox[0].textContent.length < 50){
                            str = str.slice(0, 280-textbox[0].textContent.length);
                            var new_arr = str.split(' ');
                            var new_str = '';
                            for (var i=0;i<new_arr.length-1;i++){
                                new_str += new_arr[i]+ ' ';
                            }
                            GM_setClipboard(new_str);
                            document.getElementsByTagName('title')[0].innerHTML = 'Вставляем текст';
                            Info('  Вставляем текст');
                        }
                        else {
                            document.getElementsByTagName('title')[0].innerHTML = 'Текст вставлен';
                            Info('  Текст вставлен');
                            clearInterval(interval);

                            function Pause(){
                                var button = modal[0].querySelectorAll('[data-testid="tweetButton"]');
                                Info('  button: ' + button.length);
                                button[0].style.backgroundColor = 'gold';
                                button[0].scrollIntoView();
                                scrollTo(0, scrollY - correction);
                                error = true;
                                button[0].click();
                                Info('  button click');
                                setTimeout(Look, sleep);
                            }
                            setTimeout(Pause, sleep);
                        }
                    }
                }
                if(booleans == false) setTimeout(Load, sleep);
            }
            setTimeout(Load, sleep);
        }
    }

	// Text і Text#
    if (document.location.href.indexOf('Text') != -1){ // Text і Text# це коли хештегів в тексті немає...
        Info('Text');
        function Start(){
            Info('Start()');

            var arrayURL = document.location.href.split('Text');
            array = arrayURL[1].split('%20');
            var text = '';
            for (i=1;i<array.length;i++){
                text += array[i] + ' ';
            }

            GM_setClipboard("");
            var decodedText = decodeURIComponent(text);
            array = decodedText.split('~');
            text = '';
            for (i=0;i<array.length;i++){
                text += array[i] + '\n';
            }

            if (text.indexOf('#') != -1 || arrayURL[1].indexOf('#') != -1){
                GM_setClipboard(text);
                //Info(text);

                var button = document.querySelectorAll('[data-testid="SideNav_NewTweet_Button"]');
                if(button.length == 0) setTimeout(Start, sleep);
                else {
                    Info('  button: ' + button.length);
                    button[0].click();
                    Info('  button click');
                    setTimeout(Modal, sleep);
                }
            }
            else alert("Буфер обміну порожній! \nХештеги відсутні!");
        }
        setTimeout(Start, sleep);

        function Modal(){
            Info('Modal()');
            var booleans = false;
            function Load(){
                var modal = document.querySelectorAll('[role="dialog"]');
                if(modal.length == 0) setTimeout(Modal, sleep);
                else{
                    Info('  modal: ' + modal.length);
                    booleans = true;
                    var textbox = modal[0].querySelectorAll('[role="textbox"]');
                    Info('  textbox: ' + textbox.length);
                    var interval = setInterval(Interval, sleep);

                    function Interval(){
                        if(!textbox[0].textContent){
                            document.getElementsByTagName('title')[0].innerHTML = 'Вставляем текст';
                            Info('  Вставляем текст');
                        }
                        else {
                            document.getElementsByTagName('title')[0].innerHTML = 'Текст вставлен';
                            Info('  Текст вставлен');
                            clearInterval(interval);

                            function Pause(){
                                var button = modal[0].querySelectorAll('[data-testid="tweetButton"]');
                                Info('  button: ' + button.length);
                                button[0].style.backgroundColor = 'gold';
                                button[0].scrollIntoView();
                                scrollTo(0, scrollY - correction);
                                error = true;
                                button[0].click();
                                Info('  button click');
                                setTimeout(Look, sleep);
                            }
                            setTimeout(Pause, sleep);
                        }
                    }
                }
                if(booleans == false) setTimeout(Load, sleep);
            }
            setTimeout(Load, sleep);
        }
    }

    // Image
    if (document.location.href.indexOf('Image') != -1){
        var title = ''
        Info('Image');
        function Start(){
            Info('Start()');
            title = document.location.href.split('Image');
            title = title[1].split('%20');

            array = url.split('Image');
            array = array[1].split('%20');
            text = '';
            for (i=1;i<array.length;i++){
                text += array[i] + ' ';
            }

            GM_setClipboard("");
            var decodedText = decodeURIComponent(text);
            array = decodedText.split('~');
            text = '';
            for (i=0;i<array.length;i++){
                text += array[i];
                //text += array[i] + '\n\n';
            }

            if (text.indexOf('#') != -1){
                GM_setClipboard(text);
                //Info(text);

                var button = document.querySelectorAll('[data-testid="SideNav_NewTweet_Button"]');
                if(button.length == 0) setTimeout(Start, sleep);
                else {
                    Info('  button: ' + button.length);
                    button[0].click();
                    Info('  button click');
                    setTimeout(Modal, sleep);
                }
            }
            else alert("Буфер обміну порожній! \nХештеги відсутні!");
        }
        setTimeout(Start, sleep);

        function Modal(){
            Info('Modal()');
            var booleans = false;
            function Load(){
                document.getElementsByTagName('title')[0].innerHTML = 'Open ' + title[0];
                var modal = document.querySelectorAll('[role="dialog"]');
                if(modal.length == 0) setTimeout(Modal, sleep);
                else{
                    Info('  modal: ' + modal.length);
                    booleans = true;
                    var textbox = modal[0].querySelectorAll('[role="textbox"]');
                    Info('  textbox: ' + textbox.length);
                    var interval = setInterval(Interval, sleep);

                    function Interval(){
                        if(!textbox[0].textContent){
                            document.getElementsByTagName('title')[0].innerHTML = 'Вставляем текст';
                            Info('  Вставляем текст');
                        }
                        else {
                            document.getElementsByTagName('title')[0].innerHTML = 'Текст вставлен';
                            clearInterval(interval);
                            Info('  Текст вставлен');

                            var button = modal[0].querySelectorAll('[aria-label="Добавить фото или видео"]');
                            button[0].style.backgroundColor = 'MediumAquamarine';
                            button[0].click();
                            Info('  button click');
                            setTimeout(OpenImage, sleep);

                            function OpenImage(){
                                Info('OpenImage()');
                                var image = document.querySelectorAll('[aria-label="Медиа"]');
                                if(image.length == 0) setTimeout(OpenImage, sleep);
                                else{

                                    function Pause(){
                                        var button = modal[0].querySelectorAll('[data-testid="tweetButton"]');
                                        Info('  button: ' + button.length);
                                        button[0].style.backgroundColor = 'gold';
                                        button[0].scrollIntoView();
                                        scrollTo(0, scrollY - correction);
                                        error = true;
                                        button[0].click();
                                        Info('  button click');
                                        setTimeout(Look, sleep);
                                    }
                                    setTimeout(Pause, sleep);
                                }
                            }
                        }
                    }
                }
                if(booleans == false) setTimeout(Load, sleep);
            }
            setTimeout(Load, sleep);
        }
    }

    // Retweet
    if (document.location.href.indexOf('Retweet') != -1){
		Info('Retweet');
        function Start(){
            article = document.querySelectorAll('[role="article"]');
            if(article.length == 0) setTimeout(Start, sleep);
            else{
				Info('  article: ' + article.length);
                for (var i=0; i<article.length; i++){
                    if(!article[i].name){
                        index = i;
                        break;
                    }
                }

				// якщо кількість твітів у стрічці менше чим day
				if(!article[index]){
					Info('  кількість твітів у стрічці менше чим day');
					var r = Math.floor(Math.random() * article.length);
					Info('  random ' + r);
					index = r;
                    current = r;
                    day = r;
				}

                article[index].name = 'show';

                var array = url.split('Retweet');
                var autors = array[0].split('/');
                var autor = autors[3].split('?');
                array = array[1].split('%20');
                var hashtag = '';
                for (i=0;i<array.length;i++){
                    hashtag += array[i] + ' ';
                }
                GM_setClipboard(hashtag);

                article[index].style.backgroundColor = backgroundColor_01;
                article[index].scrollIntoView();
                scrollTo(0, scrollY - correction);

                // Перевіряємо, це чужий твіт, чи ретвіт (SomeTweet)
				// Якщо так, то ховаємо його, і повертаємося назад Start
				// Якщо це потрібний твіт, то перевіряємо current == day
				// Якщо current == day НЕ збігається, то повертаємося назад Start
				// Якщо current == day збігається, то переходимо на CopyLink

				if ((article[index].textContent.toLowerCase().indexOf(autor[0].toLowerCase()) == -1) || (article[index].textContent.toLowerCase().indexOf(SomeTweet) != -1)){
                    Info('  чужий твіт, чи ретвіт');
                    article[index].innerHTML = '';
                    setTimeout(Start, sleep);
                }
                else{
					Info('  current ' + current + ' day ' + day);
					document.getElementsByTagName('title')[0].innerHTML = 'Твіт: ' + (current);

                    var retweet = article[index].querySelectorAll('[data-testid="retweet"]');
					Info('retweet.length ' + retweet.length);
                    if(retweet[0]){
                        retweet[0].style.backgroundColor = 'silver';
                        retweet[0].scrollIntoView();
                        scrollTo(0, scrollY - 500);
                        retweet[0].click();

                        setTimeout(Like, sleep);
                        setTimeout(Menu, sleep);
                    }
                    else{
                        if(current == 10){
                            url = document.location.href.split('?');
                            document.location.href = url[0] + '?Quote ' + hashtag;
                        }
                        else {
                            current++;
                            setTimeout(Start, sleep);
                        }
                    }
                }
            }
        }
        setTimeout(Start, sleep*3);

        function Like(){
			Info('Like()');
            var like = article[index].querySelectorAll('[data-testid="like"]');
            if(like[0]){
				Info('  like: ' + like.length);
                like[0].style.backgroundColor = 'silver';
                like[0].click();
				Info('like.click()');
				Menu
            }
        }

        function Menu(){
			Info('Menu()');
            var menu = document.querySelectorAll('[role="menu"]');
			Info('  menu.length ' + menu.length);
            if(menu.length == 0) setTimeout(Menu, sleep);
            else{
                var button = menu[0].querySelectorAll('[role="menuitem"]');
				Info('  button.length ' + button.length);
                button[0].style.backgroundColor = 'DodgerBlue';
                function Pause(){
                    button[0].click();
					Info('  button.click()');
                    setTimeout(CopyLink, sleep);
                }
                setTimeout(Pause, sleep);
            }
        }

        function CopyLink(){
			Info('CopyLink()');
            article[index].click();
            function Pause(){
                intervals = setInterval(End, sleep); // Переход на твит
            }
            setTimeout(Pause, sleep);
        }
    }


    // Like
    if (document.location.href.indexOf('Like') != -1){
        Info('Like');
        function Start(){
			Info('Start()');
            article = document.querySelectorAll('[role="article"]');
            Info('  article: ' + article.length);
            if(article.length == 0) setTimeout(Start, sleep);
            else{
                for (var i=0; i<article.length; i++){
                    if(!article[i].name){
                        index = i;
                        break;
                    }
                }

				// якщо кількість твітів у стрічці менше чим day
				if(!article[index]){
					Info('  кількість твітів у стрічці менше чим day');
					var r = Math.floor(Math.random() * article.length);
					Info('  random ' + r);
					index = r;
                    current = r;
                    day = r;
				}

                article[index].name = 'show';

                var array = url.split('Like');
                var autors = array[0].split('/');
                var autor = autors[3].split('?');

                article[index].style.backgroundColor = backgroundColor_01;
                article[index].scrollIntoView();
                scrollTo(0, scrollY - correction);

				// Перевіряємо, це чужий твіт, чи ретвіт (SomeTweet)
				// Якщо так, то ховаємо його, і повертаємося назад Start
				// Якщо це потрібний твіт, то перевіряємо current == day
				// Якщо current == day НЕ збігається, то повертаємося назад Start current++
				// Якщо current == day збігається, то переходимо на CopyLink

                if ((article[index].textContent.toLowerCase().indexOf(autor[0].toLowerCase()) == -1) || (article[index].textContent.toLowerCase().indexOf(SomeTweet) != -1)){
                    Info('  чужий твіт, чи ретвіт');
					article[index].innerHTML = '';
                    setTimeout(Start, sleep);
                }
				else{
					Info('  current ' + current + ' day ' + day);
					document.getElementsByTagName('title')[0].innerHTML = 'Твіт: ' + (current);

					var like = article[index].querySelectorAll('[data-testid="like"]');
					Info('  like ' + like.length);
					if(like[0]){
						like[0].style.backgroundColor = 'silver';
						like[0].scrollIntoView();
						scrollTo(0, scrollY - 500);
						like[0].click();

						setTimeout(CopyLink, sleep);
					}
					else{
						if(current == day){
							setTimeout(CopyLink, sleep);
						}
						else {
							current++;
							setTimeout(Start, sleep);
						}
					}
				}
            }
        }
        setTimeout(Start, sleep*3);

        function CopyLink(){
            Info('CopyLink()');
            article[index].click();
            function Pause(){
				document.getElementsByTagName('title')[0].innerHTML = 'Копіюємо посилання';
                intervals = setInterval(End, sleep); // Перехід на твіт
            }
            setTimeout(Pause, sleep);
        }
    }

    //Quote
    if (document.location.href.indexOf('Quote') != -1){
        Info('Quote');

        var first_week = url.split("Quote"); // шукаємо номер неділі
        first_week = first_week[1].split('%20')[0];
        if(first_week == 1) Info("Номер неділі " + first_week);
        else Info('Сьогодні ' + days[today] +' День кліків: ' + day);

        var array = url.split("Quote" + first_week); // шукаємо "Quote" з цифрами після нього
        var autors = array[0].split('/');
        var autor = autors[3].split('?');

        array = array[1].split('%20');
        hashtag = '';
        for (i=0;i<array.length;i++){
            hashtag += array[i] + ' ';
        }

        GM_setClipboard("");
        var decodedText = decodeURIComponent(hashtag);
        if (decodedText.indexOf('#') != -1){
            GM_setClipboard(decodedText);
            //Info(decodedText);

            setTimeout(Start, sleep*3);
        }
        else alert("Буфер обміну порожній! \nХештеги відсутні!");

        function Start(){
            Info('Start');
            article = document.querySelectorAll('[role="article"]');
            if(article.length == 0) setTimeout(Start, sleep);
            else{
                //Info('  article: ' + article.length);
                for (var i=0; i<article.length; i++){
                    if(!article[i].name){
                        index = i;
                        break;
                    }
                }

                article[index].name = 'show';
                //Info(index);

                const startScrollY = window.scrollY; // Збереження початкової позиції скролу
                article[index].scrollIntoView({
                    behavior: 'smooth', // Плавне переміщення
                    block: 'center' // Вирівнювання по центру
                });

                // Перевіряємо, чи змістився скрол
                setTimeout(() => {
                    const endScrollY = window.scrollY;
                    if (endScrollY > startScrollY) {
                        //Info(" cкрол перемістився вниз.");
                    } else if (endScrollY < startScrollY) {
                        //Info(" cкрол перемістився вгору.");
                    } else {
                        //Info(" cкрол не змінився.");
                        article[index].style.backgroundColor = backgroundColor_03;
                        Info('  кількість твітів у стрічці менше чим day');
                        var r = Math.floor(Math.random() * article.length);
                        Info('  random ' + r);
                        index = r;
                        current = r;
                        day = r;
                    }
                }, 500); // Час очікування залежить від тривалості анімації

                article[index].style.backgroundColor = backgroundColor_01;

                // Перевіряємо, це чужий твіт, чи ретвіт (SomeTweet)
                // Якщо так, то ховаємо його, і повертаємося назад Start
                // Якщо це потрібний твіт, то йдемо далі...

                if ((article[index].textContent.toLowerCase().indexOf(autor[0].toLowerCase()) == -1) || (article[index].textContent.toLowerCase().indexOf(SomeTweet) != -1)){
                    Info('  чужий твіт, чи ретвіт');
                    article[index].style.backgroundColor = backgroundColor_02;
                    setTimeout(Start, sleep);
                }
                else{
                    Info('  current ' + current);
                    document.getElementsByTagName('title')[0].innerHTML = 'Твіт: ' + (current);

                    // Якщо це перший тиждень, то йдемо по черзі з першого вниз
                    // Якщо не перший тиждень, то вибераємо логіку
                    if (
                        first_week == 1 ||
                        (day == 7 && current >= 1 && current <= 4) ||
                        (day == 6 && current >= 1 && current <= 3) ||
                        (day == 5 && current >= 1 && current <= 2) ||
                        (day > 4 && current == 1)
                    ) {
                        var like = article[index].querySelectorAll('[data-testid="like"]');
                        Info('  like ' + like.length);
                        if(like[0]){
                            like[0].style.backgroundColor = 'silver';
                            like[0].scrollIntoView();
                            scrollTo(0, scrollY - 500);
                            like[0].click();

                            setTimeout(Retweet, sleep);
                        }
                        else{
                            current++;
                            setTimeout(Start, sleep);
                        }
                    }
                    else{
                        if(current == day) {
                            setTimeout(Retweet, sleep);
                        }
                        else{
                            current++;
                            setTimeout(Start, sleep);
                        }
                    }
                }
            }
        }

        function Retweet(){
            Info('Retweet');
            // Якщо є лайк, то ставимо
            var like = article[index].querySelectorAll('[data-testid="like"]');
            Info('  like ' + like.length);
            if(like[0]){
                like[0].style.backgroundColor = 'silver';
                like[0].scrollIntoView();
                scrollTo(0, scrollY - 500);
                like[0].click();
            }

			// Якщо ретвіту немає, то нажимаємо ретвіт, і відкриваємо спадаюче меню з Quote
			// Якщо ретвіт є, то також нажимаємо ретвіт, і теж відкриваємо спадаюче меню з Quote
            var retweet = article[index].querySelectorAll('[data-testid="retweet"]');
            if(retweet[0]){
                Info('  retweet: ' + retweet.length);
                retweet[0].style.backgroundColor = 'silver';
                retweet[0].scrollIntoView();
                scrollTo(0, scrollY - 500);
                retweet[0].click();
                Info('  retweet click');
                setTimeout(Menu, sleep);
            }

            var unretweet = article[index].querySelectorAll('[data-testid="unretweet"]');
            if(unretweet[0]){
                Info('  unretweet: ' + unretweet.length);
                unretweet[0].style.backgroundColor = 'silver';
                unretweet[0].scrollIntoView();
                scrollTo(0, scrollY - 500);
                unretweet[0].click();
                Info('  unretweet click');
                setTimeout(Menu, sleep);
            }
        }

        function Menu(){
            Info('Menu');
            var menu = document.querySelectorAll('[role="menu"]');
            if(menu.length == 0) setTimeout(Menu, sleep);
            else{
                Info('  menu: ' + menu.length);
                var button = menu[0].querySelectorAll('[role="menuitem"]');
                Info('  button: ' + button.length);
                button[1].style.backgroundColor = 'DodgerBlue';
                function Pause(){
                    button[1].click();
                    Info('  button click');
                    setTimeout(Modal, sleep);
                }
                setTimeout(Pause, sleep);
            }
        }

        function Modal(){
            Info('Modal');
            var textbox = document.querySelectorAll('[role="textbox"]');
            Info('  textbox: ' + textbox.length);

            var interval = setInterval(Interval, sleep);
            function Interval(){
                if(!textbox[0].textContent){
                    document.getElementsByTagName('title')[0].innerHTML = 'Вставляем текст';
                    Info('  Вставляем текст');
                }
                else {
                    document.getElementsByTagName('title')[0].innerHTML = 'Текст вставлен';
                    Info('  Текст вставлен');
                    clearInterval(interval);

                    function Pause(){
                        var button = document.querySelectorAll('[data-testid="tweetButton"]');
                        Info('  button: ' + button.length);
                        button[0].style.backgroundColor = 'MediumAquamarine';

                        function Click(){
                            error = true;
                            button[0].click();
                            Info('  button click');
                            setTimeout(Look, sleep);
                        }
                        setTimeout(Click, sleep);
                    }
                    setTimeout(Pause, sleep);
                }
            }
        }
    }

    //Comment
    if (document.location.href.indexOf('Comment') != -1){
        Info('Comment');
        Info('Сьогодні ' + days[today] +' День кліків: ' + day);
        function Start(){
            Info('Start');
            article = document.querySelectorAll('[role="article"]');
            if(article.length == 0) setTimeout(Start, sleep);
            else{
                //Info('  article: ' + article.length);
                for (var i=0; i<article.length; i++){
                    if(!article[i].name){
                        index = i;
                        break;
                    }
                }

                article[index].name = 'show';
                Info(index);

                var array = url.split("Comment");
                var autors = array[0].split('/');
                var autor = autors[3].split('?');

                text = GM_getValue("text").split('\n');
                if(parseFloat(GM_getValue("TweetNumber")) > text.length-2) GM_setValue("TweetNumber", 0);
                else GM_setValue("TweetNumber", parseFloat(GM_getValue("TweetNumber"))+1);

                GM_setClipboard("");
                var str = text[parseFloat(GM_getValue("TweetNumber"))]
                str = str.slice(0, 280);
                GM_setClipboard(str);
                //Info(str);

                const startScrollY = window.scrollY; // Збереження початкової позиції скролу
                article[index].scrollIntoView({
                        behavior: 'smooth', // Плавне переміщення
                        block: 'center' // Вирівнювання по центру
                    });

                // Перевіряємо, чи змістився скрол
                setTimeout(() => {
                    const endScrollY = window.scrollY;
                    if (endScrollY > startScrollY) {
                        //Info(" cкрол перемістився вниз.");
                    } else if (endScrollY < startScrollY) {
                        //Info(" cкрол перемістився вгору.");
                    } else {
                        //Info(" cкрол не змінився.");
                        article[index].style.backgroundColor = backgroundColor_03;
                        Info('  кількість твітів у стрічці менше чим day');
                        var r = Math.floor(Math.random() * article.length);
                        Info('  random ' + r);
                        index = r;
                        current = r;
                        day = r;
                    }
                }, 500); // Час очікування залежить від тривалості анімації

                article[index].style.backgroundColor = backgroundColor_01;

                // Перевіряємо, це чужий твіт, чи ретвіт (SomeTweet)
				// Якщо так, то ховаємо його, і повертаємося назад Start
				// Якщо це потрібний твіт, то йдемо далі...

                if ((article[index].textContent.toLowerCase().indexOf(autor[0].toLowerCase()) == -1) || (article[index].textContent.toLowerCase().indexOf(SomeTweet) != -1)){
                    Info('  чужий твіт, чи ретвіт');
                    article[index].style.backgroundColor = backgroundColor_02;
                    setTimeout(Start, sleep);
                }
                else{
                    Info('  current ' + current + ' day ' + day);
                    document.getElementsByTagName('title')[0].innerHTML = 'Твіт: ' + (current);

                    if(current == day) {
                        setTimeout(Comment, sleep);
                    }
                    else{
                        current++;
                        setTimeout(Start, sleep);
                    }
                }
            }
        }
        setTimeout(Start, sleep*3);

        function Comment(){
            Info('Comment()');
            var reply = article[index].querySelectorAll('[data-testid="reply"]');
            Info('  reply: ' + reply.length);
            reply[0].style.backgroundColor = 'silver';
            reply[0].scrollIntoView();
            scrollTo(0, scrollY - 500);
            reply[0].click();
            Info('  reply click');
            setTimeout(Modal, sleep);
        }

        function Modal(){
            Info('Modal()');
            var textbox = document.querySelectorAll('[role="textbox"]');
            Info('  textbox: ' + textbox.length);
            var interval = setInterval(Interval, sleep);
            function Interval(){
                if(textbox[0].textContent.length == 0){
                    document.getElementsByTagName('title')[0].innerHTML = 'Вставляем текст';
                    Info('  Вставляем текст');
                }
                else {
                    document.getElementsByTagName('title')[0].innerHTML = 'Текст вставлен';
                    Info('  Текст вставлен');
                    clearInterval(interval);

                    function Pause(){
                        var button = document.querySelectorAll('[data-testid="tweetButton"]');
                        Info('  button: ' + button.length);
                        button[0].style.backgroundColor = 'gold';

                        function Click(){
                            error = true;
                            button[0].click();
                            Info('  button click');
                            setTimeout(Look, sleep);
                        }
                        setTimeout(Click, sleep);
                    }
                    setTimeout(Pause, sleep);
                }
            }
        }
    }

	function Look(){
		// Модальное окошко - Посмотреть твит - Опис для налаштування в самому низу
		Info('Look()');
		var _boolean = false;
		//var look = document.getElementsByClassName('css-175oi2r r-1awozwy r-l5o3uw r-18u37iz');
        var look = document.querySelectorAll('[role="alert"]');
        Info("look " + look.length);
        look[0].style.backgroundColor = 'red';
        var link = look[0].querySelectorAll('[role="link"]');
        Info("link " + link.length);
        if(link.length !=0){
            Info(link[0].textContent);
            for (var i=0;i<look.length;i++){
                if (link[0].textContent.indexOf('Посмотреть') != -1){
                    link[0].click();
                    Info('  Переход на твит');
                    _boolean = true;
                    intervals = setInterval(End, sleep); // Переход на твит
                    break;
                }
            }
        }
		if(_boolean == false) setTimeout(Look, sleep);
	}

    function End(){
        Info('End()');
        if (document.location.href.indexOf('status') != -1){
            Info("  Шукаємо /status/ в URL");
            clearInterval(intervals);
            GM_setClipboard(document.location.href);
            Info('  Копіюємо посилання');
            document.getElementsByTagName('title')[0].innerHTML = 'Копіюємо URL. Закриваємо вікно';

            article = document.querySelectorAll('[role="article"]');
            var like = article[0].querySelectorAll('[data-testid="like"]');
            Info('  like ' + like.length);
            if(like[0]){
                //like[0].style.backgroundColor = 'silver';
                like[0].click();
            }
            setTimeout(Close, sleep);
        }
    }

    function Error(){
        if (document.location.href.indexOf('compose') != -1){
            GM_setClipboard('Твит не создан');
            setTimeout(Close, sleep);
        }
        if (document.location.href.indexOf('Tweet') != -1){
            if(error == false){
                location.reload();
            }
            else{
                GM_setClipboard('Твит создан');
                setTimeout(Close, sleep);
            }
        }
        if (document.location.href.indexOf('Text') != -1){
            if(error == false){
                location.reload();
            }
            else{
                GM_setClipboard('Твит создан');
                setTimeout(Close, sleep);
            }
        }
        if (document.location.href.indexOf('Quote') != -1){
            if(error == false){
                location.reload();
            }
            else{
                GM_setClipboard('Твит создан');
                setTimeout(Close, sleep);
            }
        }
        if (document.location.href.indexOf('Comment') != -1){
            if(error == false){
                location.reload();
            }
            else{
                GM_setClipboard('Твит создан');
                setTimeout(Close, sleep);
            }
        }
    }
    //setTimeout(Error, sleep*60);
}

if (document.location.href.indexOf('https://www.facebook.com') != -1){ // https://www.facebook.com ----------------------------------------------------------

    div = document.createElement("div");
    div.style.width='300px';
    div.style.height='10px';
    div.style.position='fixed';
    div.style.right='10px';
    div.style.top='60px';
    document.body.appendChild(div);

    info = document.createElement("textarea");
    info.cols = "60";
    info.rows = "1";
    div.appendChild(info);

    function Info(_info){
		info.value += _info + '\n';
        if (info.value.length > 10){
			info.cols = "60";
			info.rows = "35";
		}
    }

    // Post
    if (document.location.href.indexOf('Post') != -1) {
        Info('Post');
        function Start(){
            Info('Start()');
			var button = document.querySelectorAll('[aria-label="Меню"]');
			if(button.length == 0) setTimeout(Start, sleep);
			else{
				Info('  button Создать: ' + button.length);
				button[0].style.backgroundColor = 'MediumAquamarine';
				button[0].click();
				Info('  button click');
				setTimeout(Menu, sleep);
			}
        }
        setTimeout(Start, sleep);

        function Menu(){
            Info('Menu()');
			var panel = document.querySelectorAll('[data-visualcompletion="ignore-dynamic"]');
			if(panel.length == 0) setTimeout(Menu, sleep);
			else{
				Info('  panel: ' + panel.length);

				function Pause(){
					Info('  Pause()');
					var pause = false; // Если долго не открывается всплывающее окошко 'Опубликовать'
					for (i=0;i<panel.length;i++){
						//Info(panel[i].textContent);
						if(panel[i].textContent == 'Допис'){
							pause = true;
							Info('  panel[i].textContent == Допис ');
							var button = panel[i].querySelectorAll('[role="button"]');
							if(button.length == 0) setTimeout(Pause, sleep);
							else{
								Info('  button: ' + button.length);
								button[0].click();
								Info('  button click');
								setTimeout(Dialog, sleep);
								break;
							}
						}
					}
					if(pause == false) setTimeout(Menu, sleep);
				}
				setTimeout(Pause, sleep);
			}
        }

        function Dialog(){
            Info('Dialog()');
            var dialog = document.querySelectorAll('[role="dialog"]');
            if(dialog.length == 0) setTimeout(Dialog, sleep);
            else{
                Info('  dialog: ' + dialog.length);
                var textbox = dialog[parseFloat(dialog.length-2)].querySelectorAll('[role="textbox"]');
                if(textbox.length == 0) setTimeout(Dialog, sleep);
                else{
                    textbox[0].style.backgroundColor = "MediumAquamarine";
                    Info('  textbox: ' + textbox.length);
                    text = GM_getValue("text").split('\n');
                    if(parseFloat(GM_getValue("PostNumber")) > text.length-2) GM_setValue("PostNumber", 0);
                    else GM_setValue("PostNumber", parseFloat(GM_getValue("PostNumber"))+1);

                    var name = document.getElementsByTagName('h1');
					name = name[name.length-1].textContent;
					Info('  name ' + name);

                    var split = url.split("Post");
                    var array = split[1].split('%20');

                    hashtag = '';
                    for (i=0;i<array.length;i++){
                        hashtag += array[i] + ' ';
						hashtag = hashtag.replace("%40", "@");
                        hashtag = hashtag.replace("%24", "$");
                        hashtag = hashtag.replace(".", "");
                    }
					Info('  hashtag ' + hashtag);

                    var str = name + ' ' + text[parseFloat(GM_getValue("PostNumber"))] + ' ' + hashtag;
                    GM_setClipboard(str);
					Info('  name text hashtag ' + str);

                    var interval = setInterval(Interval, sleep);
                    function Interval(){
                        if(textbox[0].textContent.length == 0){
                            document.getElementsByTagName('title')[0].innerHTML = 'Вставляем текст';
                            Info('  Вставляем текст');
                        }
                        else {
                            document.getElementsByTagName('title')[0].innerHTML = 'Текст вставлен';
                            Info('  Текст вставлен');
                            clearInterval(interval);

                            function Pause(){
                                var publish = dialog[parseFloat(dialog.length-2)].querySelectorAll('[aria-label="Далі"]');
                                if(publish.length == 0) setTimeout(Pause2, sleep);
                                else{
                                    publish[0].click();
                                    Info('  Нажимаем Далі');
                                    setTimeout(Pause2, sleep);
                                }

                                function Pause2(){
                                    publish = dialog[parseFloat(dialog.length-2)].querySelectorAll('[aria-label="Опублікувати"]');
                                    publish[0].click();
                                    Info('  Нажимаем Опублікувати');
                                }

								var _publish = setInterval(Publish, sleep);

								function Publish(){
									if(document.body.textContent.indexOf('Публікування') != -1) Info('  Чекаємо публікування');
									else{
										setTimeout(Account, sleep);
										clearInterval(_publish);
									}
								}
                            }
                            setTimeout(Pause, sleep);
                        }
                    }
                }
            }
        }
    }

    // Text
    if (document.location.href.indexOf('Text') != -1) {
        Info('Text');

        array = url.split('Text');
        array = array[1].split('%20');
        text = '';
        for (i=0;i<array.length;i++){
            text += array[i] + ' ';
        }

        decodedText = decodeURIComponent(text);

        // Знаходимо всі URL і замінюємо їх на маркери
        var urls = [];
        decodedText = decodedText.replace(/https?:\/\/[^\s]+/g, function(match) {
            urls.push(match);
            return `__URL${urls.length - 1}__`;
        });

        // Розділяємо текст за крапками
        array = decodedText.split('~');
        text = '';

        // Відновлюємо URL і додаємо переноси рядків
        for (var i = 0; i < array.length; i++) {
            var line = array[i];
            // Замінюємо маркери на оригінальні URL
            line = line.replace(/__URL(\d+)__/g, function(_, index) {
                return urls[parseInt(index)];
            });
            text += line.trim() + '\n\n';
        }

        // Копіюємо текст у буфер обміну
        GM_setClipboard(text);


        function Start(){
            Info('Start()');
			var button = document.querySelectorAll('[aria-label="Меню"]');
			if(button.length == 0) setTimeout(Start, sleep);
			else{
				Info('  button Создать: ' + button.length);
				button[0].style.backgroundColor = 'MediumAquamarine';
				button[0].click();
				Info('  button click');
				setTimeout(Menu, sleep);
			}
        }
        setTimeout(Start, sleep);

        function Menu(){
            Info('Menu()');
			var panel = document.querySelectorAll('[data-visualcompletion="ignore-dynamic"]');
			if(panel.length == 0) setTimeout(Menu, sleep);
			else{
				Info('  panel: ' + panel.length);

				function Pause(){
					Info('  Pause()');
					var pause = false; // Если долго не открывается всплывающее окошко 'Опубликовать'
					for (i=0;i<panel.length;i++){
						//Info(panel[i].textContent);
						if(panel[i].textContent == 'Допис'){
							pause = true;
							Info('  panel[i].textContent == Допис ');
							var button = panel[i].querySelectorAll('[role="button"]');
							if(button.length == 0) setTimeout(Pause, sleep);
							else{
								Info('  button: ' + button.length);
								button[0].click();
								Info('  button click');
								setTimeout(Dialog, sleep);
								break;
							}
						}
					}
					if(pause == false) setTimeout(Menu, sleep);
				}
				setTimeout(Pause, sleep);
			}
        }

        function Dialog(){
            Info('Dialog()');
            var dialog = document.querySelectorAll('[role="dialog"]');
            if(dialog.length == 0) setTimeout(Dialog, sleep);
            else{
                Info('  dialog: ' + dialog.length);
                var textbox = dialog[parseFloat(dialog.length-2)].querySelectorAll('[role="textbox"]');
                if(textbox.length == 0) setTimeout(Dialog, sleep);
                else{
                    Info('  textbox: ' + textbox.length);

                    var interval = setInterval(Interval, sleep);
                    function Interval(){
                        if(textbox[0].textContent.length == 0){
                            document.getElementsByTagName('title')[0].innerHTML = 'Вставляем текст';
                            Info('  Вставляем текст');
                        }
                        else {
                            document.getElementsByTagName('title')[0].innerHTML = 'Текст вставлен';
                            Info('  Текст вставлен');
                            clearInterval(interval);

                            function Pause(){
								var publish = dialog[dialog.length-2].querySelectorAll('[aria-label="Далі"]');
                                if(publish.length == 1) publish[0].click();

								setTimeout(Pause2, sleep);

                                function Pause2(){
                                    var publish = dialog[dialog.length-2].querySelectorAll('[aria-label="Опублікувати"]');
                                    if(publish.length == 1) publish[0].click();
                                }

								var _publish = setInterval(Publish, sleep);

								function Publish(){
									if(document.body.textContent.indexOf('Публікування') != -1) Info('  Чекаємо публікування');
									else{
										//setTimeout(Account, sleep); // Потрібна перезагрузка сторінки ReLoad
										clearInterval(_publish);
                                        setTimeout(ReLoad, sleep*5);

                                        function ReLoad(){
                                            document.location.href = "https://www.facebook.com?Like";
                                        }
									}
								}
                            }
                            setTimeout(Pause, sleep);
                        }
                    }
                }
            }
        }
    }

    // Repost
    if (document.location.href.indexOf('Repost') != -1){
        index = 1;
        function Start(){
            article = document.querySelectorAll('[aria-posinset="'+index+'"]');
            if(article.length == 0) setTimeout(Start, sleep);
            else{
                article[0].scrollIntoView();
                scrollTo(0, scrollY - 130);

                if(index == day){

                    article[0].style.backgroundColor = 'black';
                    var like = article[0].querySelectorAll('[aria-label="Нравится"]');
                    if(like.length != 0){
                        like[0].style.backgroundColor = 'silver';
                        like[0].click();
                    }

                    var repost = article[0].querySelectorAll('[aria-label="Отправьте это друзьям или опубликуйте в своей Хронике."]');
                    if(repost.length != 0){
                        repost[0].style.backgroundColor = 'silver';
                        repost[0].scrollIntoView();
                        scrollTo(0, scrollY - 500);
                        repost[0].click();
                        setTimeout(Menu, sleep);
                    }
                }
                else {
                    index++;
                    setTimeout(Start, sleep);
                }
            }
        }
        setTimeout(Start, sleep);

        function Menu(){
            var menu = document.querySelectorAll('[role="dialog"]');
            if(menu.length == 0) setTimeout(Menu, sleep);
            else{
                function Panel(){
                    var panel = menu[menu.length-1].querySelectorAll('[data-visualcompletion="ignore-dynamic"]');
                    if(panel.length == 0) setTimeout(Menu, sleep);
                    else{
                        panel[0].style.backgroundColor = 'MediumAquamarine';
                        var button = panel[0].querySelectorAll('[role="button"]');
                        if(panel.length == 0) setTimeout(Menu, sleep);
                        else{
                            button[0].style.backgroundColor = 'MediumAquamarine';
                            function Pause(){
                                button[0].onclick = function(event){
                                    Account();
                                }
                                button[0].click();
                            }
                            setTimeout(Pause, sleep);
                        }
                    }
                }
                setTimeout(Panel, sleep);
            }
        }
    }

    // Quote
    if (document.location.href.indexOf('Quote') != -1){
        Info('Quote');
        Info('Сьогодні ' + days[today] +' День кліків: ' + day);
        index = 1;
        function Start(){
            Info('Start()');
            Info('  index ' + index);

            var first_week = url.split("Quote"); // шукаємо номер неділі
            first_week = first_week[1].split('%20')[0];

            var array = url.split("Quote" + first_week); // шукаємо "Quote" з цифрами після нього
            array = array[1].split('%20');
            var hashtag = '';
            for (i=0;i<array.length;i++){
                hashtag += array[i] + ' ';
            }
            var decodedText = decodeURIComponent(hashtag);
            GM_setClipboard(decodedText);
            //Info(decodedText);

            article = document.querySelectorAll('[aria-posinset="'+index+'"]');
            if(article.length == 0) setTimeout(Start, sleep);
            else{
                document.getElementsByTagName('title')[0].innerHTML = 'Post: ' + (index);

                const startScrollY = window.scrollY; // Збереження початкової позиції скролу
                article[0].scrollIntoView({
                    behavior: 'smooth', // Плавне переміщення
                    block: 'center' // Вирівнювання по центру
                });

                // Перевіряємо, чи змістився скрол
                setTimeout(() => {
                    const endScrollY = window.scrollY;
                    if (endScrollY > startScrollY) {
                        //Info(" cкрол перемістився вниз.");
                    } else if (endScrollY < startScrollY) {
                        //Info(" cкрол перемістився вгору.");
                    } else {
                        Info(" cкрол не змінився.");
                        article[index].style.backgroundColor = backgroundColor_03;
                        Info('  кількість твітів у стрічці менше чим day');
                        var r = Math.floor(Math.random() * article.length);
                        Info('  random ' + r);
                        index = r;
                        day = r;
                    }
                }, 500); // Час очікування залежить від тривалості анімації

                // Якщо це перший тиждень, то йдемо по черзі з першого вниз
                // Якщо не перший тиждень, то вибераємо логіку
                if (
                        first_week == 1 ||
                        (day == 7 && current >= 1 && current <= 4) ||
                        (day == 6 && current >= 1 && current <= 3) ||
                        (day == 5 && current >= 1 && current <= 2) ||
                        (day > 4 && current == 1)
                    ) {
                    article[0].style.backgroundColor = 'black';
                    var like = article[0].querySelectorAll('[aria-label="Подобається"]');
                    Info('  like ' + like.length);
                    if(like[0]){
                        like[0].click();
                        setTimeout(Menu, sleep);
                    }
                    else{
                        index++;
                        setTimeout(Start, sleep);
                    }
                }
                else{
                    if(index == day){
                        article[0].style.backgroundColor = 'black';
                        like = article[0].querySelectorAll('[aria-label="Подобається"]');
                        Info('  like ' + like.length);
                        if(like.length != 0){
                            like[0].style.backgroundColor = 'silver';
                            like[0].click();
                        }
                        setTimeout(Menu, sleep);
                    }
                    else {
                        index++;
                        setTimeout(Start, sleep);
                    }
                }
            }
        }
        setTimeout(Start, sleep);

        function Menu(){
            var repost = article[0].querySelectorAll('[aria-label="Надішліть це друзям або опублікуйте у своєму життєписі."]');
            if(repost.length != 0){
                repost[0].style.backgroundColor = 'silver';
                repost[0].scrollIntoView();
                scrollTo(0, scrollY - 500);
                repost[0].click();
                setTimeout(Dialog, sleep);
            }
        }

        function Dialog(){
            Info('Dialog()');
            var dialog = document.querySelectorAll('[role="dialog"]');
            Info('  dialog: ' + dialog.length);
            var textbox = dialog[dialog.length-1].querySelectorAll('[role="textbox"]'); // Нове меню на сайті
            if(textbox.length == 0) setTimeout(Dialog, sleep);
            else{
                Info('  textbox: ' + textbox.length);
                var interval = setInterval(Textbox, sleep);
                function Textbox(){
                    if(textbox[0].textContent.length == 0){
                        document.getElementsByTagName('title')[0].innerHTML = 'Вставляем текст';
                        Info('  Вставляем текст');
                    }
                    else {
                        document.getElementsByTagName('title')[0].innerHTML = 'Текст вставлен';
                        Info('  Текст вставлен');
                        clearInterval(interval);

                        //var publish = dialog[dialog.length-2].querySelectorAll('[aria-label="Поширити"]');
                        var publish = dialog[dialog.length-1].querySelectorAll('[aria-label="Share now"]'); // Нове меню на сайті
                        Info('  button Поширити: ' + textbox.length);
                        function Checkbox(){
                            var checkbox = dialog[0].querySelectorAll('[type="checkbox"]');
                            if(checkbox.length != 0) checkbox[0].click();

                            function Pause(){
                                publish[0].click();
                                Info('  Нажимаємо Поширити');

								var _publish = setInterval(Publish, sleep);
								function Publish(){
									if(document.body.textContent.indexOf('Переглянути допис') == -1) Info('  Чекаємо на розміщщення допису...');
									else{
										setTimeout(Account, sleep);
										clearInterval(_publish);
									}
								}
                            }
                            setTimeout(Pause, sleep);
                        }
                        setTimeout(Checkbox, sleep);
                    }
                }
            }
        }
    }

    // Comment
    if (document.location.href.indexOf('Comment') != -1) {
        Info('Comment');
        index = 1;
        function Start(){
            Info('Start()');
            Info('  index ' + index);
            text = GM_getValue("text").split('\n');
            if(parseFloat(GM_getValue("PostNumber")) > text.length-2) GM_setValue("PostNumber", 0);
            else GM_setValue("PostNumber", parseFloat(GM_getValue("PostNumber"))+1);
            var str = text[parseFloat(GM_getValue("PostNumber"))]
            GM_setClipboard(str);

            article = document.querySelectorAll('[aria-posinset="'+index+'"]');
            if(article.length == 0) setTimeout(Start, sleep);
            else{
                Info('  article: ' + article.length);
                article[0].scrollIntoView();
                scrollTo(0, scrollY - 130);
				document.getElementsByTagName('title')[0].innerHTML = 'Post: ' + (index);

                if(index == day){
                    article[0].style.backgroundColor = 'black';
                    var like = article[0].querySelectorAll('[aria-label="Подобається"]');
                    if(like.length != 0){
                        like[0].style.backgroundColor = 'silver';
                        like[0].click();
                    }

                    var repost = article[0].querySelectorAll('[aria-label="Залишити коментар"]');
                    if(repost.length != 0){
                        repost[0].style.backgroundColor = 'silver';
                        repost[0].scrollIntoView();
                        scrollTo(0, scrollY - 500);
                        repost[0].click();
                        setTimeout(Dialog, sleep);
                    }
                }
                else {
                    index++;
                    setTimeout(Start, sleep);
                }
            }
        }
        setTimeout(Start, sleep);

        function Dialog(){
            Info('Dialog()');
            var textbox = article[0].querySelectorAll('[role="textbox"]');
            if(textbox.length == 0) setTimeout(Dialog, sleep);
            else{
                Info('  textbox: ' + textbox.length);
                textbox[0].style.backgroundColor = 'MediumAquamarine';
                document.getElementsByTagName('title')[0].innerHTML = 'Вставляем текст';
                Info('  Вставляем текст');

                function Pause(){
                    document.getElementsByTagName('title')[0].innerHTML = 'Текст вставлен';
                    Info('  Текст вставлен');
                    function Pause2(){
                        document.getElementsByTagName('title')[0].innerHTML = "Нажимаем Ентер";
                        Info('  Нажимаем Ентер');
                        setTimeout(Link, sleep*5);
                    }
                    setTimeout(Pause2, sleep);
                }
                setTimeout(Pause, sleep);
            }
        }

        function Link(){
            Info('Link()');
            var article2 = article[0].querySelectorAll('[role="article"]');
            article2[article2.length-1].scrollIntoView();
            scrollTo(0, scrollY - 500);
            article2[article2.length-1].style.backgroundColor = 'silver';// Останній коментар
			Info('кількість коментарів ' + article2.length);

            if(article2.length == 0) setTimeout(Dialog, sleep);
            else{
                var link = article2[article2.length-1].querySelectorAll('[role="link"]');
                Info('кількість посилань в коментарі ' + link.length);
				link[2].style.backgroundColor = 'Yellow';// Посилання на новий коментар - 1 хв
                if (link[2].textContent.indexOf('1 хв') == -1) setTimeout(Link, sleep);
                else{
                    link[2].style.backgroundColor = 'MediumAquamarine';

                    function Pause(){
                        link[2].focus();
                        link[2].click();

                        function CopyLink(){
                            Info('CopyLink()');
                            if (document.location.href.indexOf('comment_id') != -1){
                                GM_setClipboard(document.location.href);
                                Info('  Скопійовано');
                                setTimeout(Close, sleep);
                            }
                        }
                        setTimeout(CopyLink, sleep);
                    }
                    setTimeout(Pause, sleep);
                }
            }
        }
    }

    if (document.location.href.indexOf('Like') != -1) {
        setTimeout(Account, sleep);
    }

    function Account(){
        Info('Account()');
        error = true;
        function Load(){
            Info('Load()');
            var account;
            var button = document.querySelectorAll('[role="button"]');
            if(button.length == 0) setTimeout(Load, sleep);
            else{
                for (var i=0;i<button.length;i++){
                    account = button[i].querySelectorAll('[aria-label="Ваш профіль"]'); // Ваш профіль Your profile
                    if(account.length != 0) {
                        button[i].style.backgroundColor = 'MediumAquamarine';
                        button[i].click();
                        setTimeout(Account2, sleep);
                    }
                }
            }
        }
        setTimeout(Load, sleep);
    }

    function Account2(){
        Info('Account2()');
        error = true;
        function Load(){
            var account = document.querySelectorAll('[href="/me/"]');
            account[0].style.backgroundColor = 'MediumAquamarine';
            account[0].click();
            Info('  account click');
            setTimeout(MyAccount, sleep);
        }
        setTimeout(Load, sleep);
    }

	var _booleanLink = false;
    function MyAccount(){
        Info('MyAccount()');
        var article = document.querySelectorAll('[role="article"]');
        if(article.length == 0) setTimeout(MyAccount, sleep);
        else{
            Info('  article: ' + article.length);
            article[0].style.backgroundColor = 'green';
            article[0].scrollIntoView();
            scrollTo(0, scrollY - 130);
            function Link(){
                Info('Link()');
                var link = article[0].querySelectorAll('[role="link"]');
                if(link.length == 0) setTimeout(MyAccount, sleep);
                else{
                    Info('  link: ' + link.length);
                    for (i=0;i<link.length;i++){
                        link[i].style.backgroundColor = 'gold';
                        if (link[i].textContent.indexOf('1 хв') != -1 || link[i].textContent.indexOf('Щойно') != -1){
                        //if (link[i].textContent.indexOf('1 мин') != -1){
                            Info('  В link есть 1 хв Щойно');
                            link[i].style.backgroundColor = 'MediumAquamarine';
                            link[i].focus();
                            Info('  link focus()');
							_booleanLink = true;

							setTimeout(Click, sleep);
							break;

                            function Click(){
                                link[i].click();
                                Info('  link click');

                                function CopyLink(){
                                    Info('CopyLink()');
                                    if (document.location.href.indexOf('posts') != -1){
                                        Info('  В URL є posts');
                                        GM_setClipboard(document.location.href);
                                        Info('  Скопійовано');

                                        var like = article[0].querySelectorAll('[aria-label="Подобається"]');
                                        Info('  like ' + like.length);
                                        if(like[0]){
                                            like[0].click();
                                        }

                                        setTimeout(Close, sleep);
                                    }
									else setTimeout(CopyLink, sleep);
                                }
                                setTimeout(CopyLink, sleep);
                            }
                        }
                    }
					if(_booleanLink == false) setTimeout(MyAccount, sleep);
                }
            }
            setTimeout(Link, sleep);
        }
    }

    function Error(){
        if (document.location.href.indexOf('Post') != -1){
            if(error == false){
                location.reload();
            }
            else{
                GM_setClipboard('Пост создан');
                setTimeout(Close, sleep);
            }
        }
        if (document.location.href.indexOf('Text') != -1){
            if(error == false){
                location.reload();
            }
            else{
                GM_setClipboard('Пост создан');
                setTimeout(Close, sleep);
            }
        }
        if (document.location.href.indexOf('Quote') != -1){
            if(error == false){
                location.reload();
            }
            else{
                GM_setClipboard('Пост создан');
                setTimeout(Close, sleep);
            }
        }
        if (document.location.href.indexOf('Comment') != -1){
            if(error == false){
                location.reload();
            }
            else{
                GM_setClipboard('Пост создан');
                setTimeout(Close, sleep);
            }
        }
    }
    //setTimeout(Error, sleep*60);
}

//--------------------------------------------------------------------------------

if (document.location.href.indexOf('https://web.telegram.org') != -1) {
    let div = document.createElement('div');
    div.style.width = '10px';
    div.style.position = 'fixed';
    div.style.right = '250px';
    div.style.top = '10px';
    div.style.color = 'gold';
    div.style.zIndex = '99999';
    document.body.appendChild(div);

    let info = document.createElement('textarea');
    info.cols = '28';
    info.rows = '1';
    div.appendChild(info);

    function Info(_info) {
        info.value += _info + '\n';
        if (info.value.length > 10) {
            info.cols = '28';
            info.rows = '20';
        }
    }

    if (document.location.href.indexOf('Text') != -1) {
        function Start() {
            Info('Start()');
            // Розбираємо текст із URL
            let arrayURL = document.location.href.split('Text');
            let array = arrayURL[1].split('%20');
            let text = '';
            for (let i = 1; i < array.length; i++) {
                text += array[i] + ' ';
            }

            GM_setClipboard('');
            let decodedText = decodeURIComponent(text);
            array = decodedText.split('~');
            text = '';
            for (let i = 0; i < array.length; i++) {
                text += array[i] + '\n';
            }
            GM_setClipboard(text);

            // Функція для пошуку і активації поля вводу
            function Dialog() {
                const textbox = document.querySelectorAll(
                    '[class="input-message-input is-empty scrollable scrollable-y no-scrollbar"]'
                );
                if (!textbox[0]) {
                    Info('Поле вводу НЕ знайдено...');
                    setTimeout(Dialog, sleep);
                    return;
                }

                textbox[0].click(); // Активуємо поле вводу

                // Відстежуємо появу тексту
                const interval = setInterval(() => {
                    if (textbox[0].textContent.length === 0) {
                        document.getElementsByTagName('title')[0].innerHTML = 'Вставляем текст';
                        Info('Вставляем текст');
                    } else {
                        document.getElementsByTagName('title')[0].innerHTML = 'Текст вставлен';
                        Info('Текст вставлен');
                        clearInterval(interval);

                        // Шукаємо кнопку - відправити
                        function Pause() {
                            const button = document.querySelectorAll('[class="btn-icon rp btn-circle btn-send animated-button-icon send"]');
                            if (button) {
                                Info('Відправляємо текст');
                                button[0].click();

                                //setTimeout(LastPost, sleep);
                                function LastPost() {
                                    let bubbles = document.querySelectorAll('[class="bubbles-group bubbles-group-last"]');
                                    if (bubbles.length != 0) {
                                        let _text = text.slice(0, 100);
                                        if (bubbles[0].textContent.indexOf(_text) != -1) {
                                            Info('Останній пост = text');
                                            setTimeout(ContexMenu, sleep);
                                        } else {
                                            Info('Останній пост != text');
                                            GM_setClipboard('Останній пост не мій');
                                            setTimeout(Close, sleep);
                                        }
                                    }
                                }

                                setTimeout(Button_go_down, sleep);
                                function Button_go_down() {
                                    let button_go_down = document.querySelectorAll('[class="btn-circle btn-corner z-depth-1 bubbles-corner-button chat-secondary-button bubbles-go-down rp"]');
                                    button_go_down[0].style.backgroundColor = 'MediumAquamarine';
									if (button_go_down[0]) {
                                        Info('Button_bubbles_go_down');
										button_go_down[0].style.backgroundColor = 'MediumAquamarine';
                                        button_go_down[0].click();
                                        setTimeout(ContexMenu, sleep);
                                    } else setTimeout(ContexMenu, sleep);
                                }

                                // Функція контекстного меню
                                function ContexMenu() {
                                    Info('ContexMenu()');
                                    document.getElementsByTagName('title')[0].innerHTML =
                                        'Чекаємо на відкриття контекстного меню'; // AutoHotkey відкриває контекстне меню
                                    let interval = setInterval(Interval, sleep);
                                    function Interval() {
                                        // тут ми шукаємо чи є контекстне меню в DOM
                                        let menu = document.querySelectorAll('[id="bubble-contextmenu"]');
                                        if (menu[0].length == 0) {
                                            document.getElementsByTagName('title')[0].innerHTML = 'Меню НЕ знайдено';
                                            Info('Меню НЕ знайдено');
                                        } else {
                                            document.getElementsByTagName('title')[0].innerHTML = 'Меню знайдено';
                                            Info('Меню знайдено');
                                            clearInterval(interval);

                                            // Шукаємо в меню кнопку з текстом: 🔗 Копіювати посилання
                                            let item = menu[0].querySelectorAll(
                                                '[class="btn-menu-item rp-overflow"]'
                                            );
                                            for (let i = 0; i < item.length; i++) {
                                                if (
                                                    item[i].textContent.indexOf('Копіювати посилання') != -1
                                                ) {
                                                    item[i].style.backgroundColor = 'MediumAquamarine';
                                                    Info('Копіювати посилання');
                                                    item[i].click();
                                                    Info('Скопійовано');
                                                    setTimeout(Close, sleep);
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        setTimeout(Pause, sleep);
                    }
                }, sleep);
            }
            setTimeout(Dialog, sleep);
        }
        Start();
    }
}


// ---------------------------------------------------------------------------------------------------------------------------------------------------

function Close(){
    GM_setValue("getClipboard", 'true');
    document.getElementsByTagName('title')[0].innerHTML = 'Сlose';
    setTimeout(Pause, sleep);
    function Pause(){
        window.close();
    }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

if (document.location.href.indexOf('https://www.instagram.com') != -1){ // https://www.instagram.com -----------------------------------------------------

	function ReLoad(){
        var reload = document.getElementById('reload-button');
        if(reload.length != 0) {
			alert(reload.length);
			reload.click();
		}
	}
	//setTimeout(ReLoad, sleep*10);

	div = document.createElement("div");
    div.style.width='200px';
    //div.style.height='10px';
    div.style.position='fixed';
    div.style.right='10px';
    div.style.top='10px';
    div.style.color = 'gold'
    //div.style.color = 'white'
    div.style.zIndex = "99999";
    document.body.appendChild(div);

    info = document.createElement("p");
    info.style.width = "250px"; // Ширина блоку
	info.style.height = "600px"; // Висота блоку
	info.style.overflowY = "scroll"; // Додаємо вертикальну прокрутку
	info.style.display = "flex"; // Використовуємо flexbox для центрування
    info.style.alignItems = "end"; // Вирівнюємо по вертикалі
    div.appendChild(info);

    function Info(_info){
        info.innerHTML += _info + '<br>';
    }

    if (document.location.href.indexOf('Post') != -1){
        Info('Post');
        text = GM_getValue("text").split('\n');
        if(parseFloat(GM_getValue("InstagramNumber")) > text.length-2) GM_setValue("InstagramNumber", 0);
        else GM_setValue("InstagramNumber", parseFloat(GM_getValue("InstagramNumber"))+1);

        url = document.location.href.split('Post%20');
        url = url[1];
        url = url.replace(/["%20"]/g, " ");
        url = url.replace(/["*"]/g, "#");

        array = url.split(' ');
        hashtag = '';
        var name = array[0];
        for (i=0;i<array.length;i++){
            if(i!=0) hashtag += array[i] + ' ';
        }

        str = name + ' ' + text[parseFloat(GM_getValue("InstagramNumber"))] + ' ' + hashtag
        GM_setClipboard(str);

        Button_new();
    }

    if (document.location.href.indexOf('Image') != -1){
        Info('Image');

        title = document.location.href.split('Image');
        title = title[1].split('%20');
        document.getElementsByTagName('title')[0].innerHTML = 'Open ' + title[0];
        if(title[0] == "Girls") GM_setValue("Girls", 1);
        else GM_setValue("Girls", 0);
        Info('Girls: ' + GM_getValue("Girls")); // Розкрутка в інстаграм

        array = url.split('Image');
        array = array[1].split('%20');
        text = '';
        for (i=1;i<array.length;i++){
            text += array[i] + ' ';
        }

        GM_setClipboard("");
        decodedText = decodeURIComponent(text);
        array = decodedText.split('~');
        text = '';
        for (i=0;i<array.length;i++){
            text += array[i] + '\n\n';
        }

        if (text.indexOf('#') != -1){
            GM_setClipboard(text);
            Info(text);
        }
        setTimeout(Button_new, sleep);
    }

	if (document.location.href.indexOf('End') != -1){
        Info('End');
		hashtag = 'End';
        Button_new();
    }


	if (document.location.href.indexOf('Share') != -1){
        Info('Share');
		hashtag = 'Share';
    }

    function Button_new(){
        Info('Button_new()');
        var button = document.querySelectorAll('[role="link"]');
        if(button.length == 0) setTimeout(Button_new, sleep);
        else{
            Info('  button: ' + button.length);
            for (var i=0;i<button.length;i++){
                if (button[i].innerHTML.indexOf('aria-label="Новий допис"') != -1){
                    Info('  button Новий допис');
                    button[i].click();
                    Info('  button click');
                    setTimeout(Modal, sleep);
                }
            }
        }
    }

    var modal;
    var modal_event;
    function Modal(){
        Info('Modal()');
        modal = document.querySelectorAll('[aria-label="Створити допис"]');
        if(modal.length == 0) setTimeout(Modal, sleep);
        else{
            modal[0].style.backgroundColor = 'MediumAquamarine';
            //modal[1].style.backgroundColor = 'gold';
            Info('  modal ' + modal.length);

            const buttons = Array.from(document.querySelectorAll('button'));
            const targetButton = buttons.find(btn => btn.textContent.includes('Вибрати з комп’ютера'));
            if (targetButton) {
                console.log('Кнопка знайдена:', targetButton);
                targetButton.style.backgroundColor = 'MediumAquamarine';
                targetButton.focus();
                //targetButton.click(); // Не працює, перебрав кучу варіантів...
                document.getElementsByTagName('title')[0].innerHTML = 'Нажимаем Ентер';
                modal_event = setInterval(Event, sleep*2);
            }
        }
    }

    function Event(){
        Info('Event()');
        document.getElementsByTagName('title')[0].innerHTML = 'Ok';

        modal = document.querySelectorAll('[aria-label="Обітнути"]');
        Info('  modal: ' + modal.length);
        if(modal.length == 0) {} //setTimeout(Event, sleep);
        else{
            const buttonContainer = document.querySelector('svg[aria-label="Вибрати тип обтинання"]');
            if (buttonContainer) {
                const parentElement = buttonContainer.closest('button, div, a'); // Знайти найближчий клікабельний контейнер
                if (parentElement) {
                    clearInterval(modal_event);
                    parentElement.click();
                    console.log('Клік виконано на батьківський елемент');
                    setTimeout(Event_2, sleep);
                } else {
                    console.log('Батьківський клікабельний елемент не знайдено');
                }
            } else {
                console.log('SVG не знайдено');
            }

        }
    }

        function Event_2(){
        Info('Event()');
        document.getElementsByTagName('title')[0].innerHTML = 'Ok';

        modal = document.querySelectorAll('[aria-label="Обітнути"]');
        Info('  modal: ' + modal.length);
        if(modal.length == 0) {} //setTimeout(Event, sleep);
        else{
            const buttonContainer = document.querySelector('svg[aria-label="Значок контуру світлини"]');
            if (buttonContainer) {
                const parentElement = buttonContainer.closest('button, div, a'); // Знайти найближчий клікабельний контейнер
                if (parentElement) {
                    parentElement.click();
                    console.log('Клік виконано на батьківський елемент');
                    setTimeout(Next, sleep);
                } else {
                    console.log('Батьківський клікабельний елемент не знайдено');
                }
            } else {
                console.log('SVG не знайдено');
            }

        }
    }

    function Next(){
        Info('Next()');
        var button = modal[0].querySelectorAll('[role="button"]');
        for (var i=0;i<button.length;i++){
            if (button[i].textContent.indexOf('Далі') != -1){
                button[i].style.backgroundColor = 'DarkSeaGreen';
                button[i].click();
                setTimeout(Next_2, sleep);
            }
        }
    }

    function Next_2(){
        Info('Next()');
        var button = modal[0].querySelectorAll('[role="button"]');
        for (var i=0;i<button.length;i++){
            if (button[i].textContent.indexOf('Далі') != -1){
                button[i].style.backgroundColor = 'DarkSeaGreen';
                button[i].click();
                setTimeout(TextArea, sleep);
            }
        }
    }

    function TextArea(){
        Info('TextArea()');
        var textarea = modal[0].querySelectorAll('[role="textbox"]');
        textarea[0].focus();

        var interval = setInterval(Interval, sleep);
        function Interval(){
            if(!textarea[0].textContent){
                textarea[0].style.backgroundColor = 'gold';
                document.getElementsByTagName('title')[0].innerHTML = 'Вставляем текст';
                Info('  Вставляем текст');
            }
            else {
                textarea[0].style.backgroundColor = 'DarkSeaGreen';
                document.getElementsByTagName('title')[0].innerHTML = 'Текст вставлен';
                Info('  Текст вставлен');
                clearInterval(interval);
                setTimeout(Share, sleep);
            }
        }
    }

    function Share(){
        Info('Share()');
        var button = modal[0].querySelectorAll('[role="button"]');
        for (var i=0;i<button.length;i++){
            //Info('button.length ' + button.length);
            if (button[i].textContent.indexOf('Поширити') != -1){
                button[i].style.backgroundColor = 'DarkSeaGreen';
                button[i].focus();
                button[i].click();
                clearInterval(modal_event);
                setTimeout(Share_Complect, sleep);
                break;
            }
        }
    }

    function Share_Complect(){
        Info('Share_Complect()');
        modal = document.querySelectorAll('[aria-label="Допис поширено"]');
        if(modal.length == 0) setTimeout(Share_Complect, sleep);
        else{
            var button = document.querySelectorAll('[role="button"]');
            for (var i=0;i<button.length;i++){
                if (button[i].innerHTML.indexOf('Закрити') != -1){
                    button[i].click();

                    if (document.location.href.indexOf('Post') != -1){
                        url = document.location.href.split('Post');
                        document.location.href = url[0] + 'Like';
                    }
                    if (document.location.href.indexOf('Image') != -1){
                        url = document.location.href.split('Image');
                        document.location.href = url[0] + 'Like';
                    }
					if (document.location.href.indexOf('End') != -1){
                        url = document.location.href.split('End');
                        document.location.href = url[0] + 'Like';
                    }
                }
            }
        }
    }


    if (document.location.href.indexOf('Like') != -1){
        Info('Like');
        function Start(){
            Info('Start()');
            var articles = document.querySelectorAll('[style="display: flex; flex-direction: column; padding-bottom: 0px; padding-top: 0px; position: relative;"]');
            if(articles.length == 0) setTimeout(Start, sleep);
            else{
                var article = articles[0].childNodes[0].getElementsByTagName('img');
				if(article.length == 0) setTimeout(Start, sleep);
				else{
					Info('  Пост №1');
					article[0].style.backgroundColor = 'DarkSeaGreen';
					article[0].click();

                    setTimeout(Like, sleep);
				}
			}
        }
        setTimeout(Start, sleep);

        function Like(){
            Info('Like()');
            var dialog = document.querySelectorAll('[role="dialog"]');
            Info('dialog.length ' + dialog.length);
            if(dialog.length == 0) setTimeout(Like, sleep);
            else{
                const likeIcon = dialog[0].querySelector('[aria-label="Подобається"]');

                if (likeIcon) {
                    // Знаходимо батьківський елемент із role="button"
                    const likeButton = likeIcon.closest('[role="button"]');

                    if (likeButton) {
                        // Клікаємо на кнопку
                        likeButton.click();
                        Info("Лайк");

                        var r = Math.floor(Math.random() * Replica.length); // Вибір коментаря, з масиву Replica
                        if(GM_getValue("Girls") == 1) GM_setClipboard("#Girls 💖💖💖");
                        else GM_setClipboard(Replica[r]);
                        setTimeout(Coment, sleep);
                    }
                }

                function Coment(){
                    const textarea = document.querySelector('textarea[aria-label="Додайте коментар..."]');
                    textarea.focus();

                    document.getElementsByTagName('title')[0].innerHTML = 'Вставляем текст';
                    setTimeout(ComentEnd, sleep);

                    function ComentEnd(){
                        textarea.blur();
                        document.getElementsByTagName('title')[0].innerHTML = 'Текст вставлен';

                        // Використання XPath для знаходження елемента за текстом "Опублікувати"
                        const xpath = "//div[@role='button' and text()='Опублікувати']";
                        const button = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                        // Перевірка та клік
                        if (button) {
                            Info("Елемент знайдено через XPath:", button);
                            button.click();
                            Info("Клік виконано через XPath!");
                            setTimeout(CopyLink, sleep);
                        } else {
                            Info("Елемент не знайдено через XPath!");
                        }
                    }
                }
            }

        }

        function CopyLink(){
            GM_setClipboard(document.location.href);
            Info('URL cкопійовано у Clipboard');
            setTimeout(Close, sleep);
        }
    }

// ------------------------------------------------------

    if (document.location.href.indexOf('Comment') != -1){
        var loader = 0;
        Info('Comment');
        function Start(){
            Info('Start()');
            Info('loader ' + loader);
            loader++;

            var articles = document.querySelectorAll('[style="display: flex; flex-direction: column; padding-bottom: 0px; padding-top: 0px; position: relative;"]'); // Всі articles
            if(articles.length == 0) setTimeout(Start, sleep);
            else{
                Info('articles.length ' + articles.length);
                article = articles[0].getElementsByTagName('img');
                if(article.length == 0) setTimeout(Start, sleep);
                else{
                    Info('article.length ' + article.length);
                    var r = Math.floor(Math.random() * article.length);
                    document.getElementsByTagName('title')[0].innerHTML = 'article '+ r; // article img
                    article[r].click();
                    Info('  index ' + r);
                    setTimeout(Like, sleep*3); // Підозра не автомат
                    setTimeout(Modal, sleep*5);

                    text = GM_getValue("text").split('\n');
                    if(parseFloat(GM_getValue("InstagramNumber")) > text.length-2) GM_setValue("InstagramNumber", 0);
                    else GM_setValue("InstagramNumber", parseFloat(GM_getValue("InstagramNumber"))+1);

                    str = text[parseFloat(GM_getValue("InstagramNumber"))]
                    GM_setClipboard(str);
                }
            }
        }
        setTimeout(Start, sleep);

        function Like(){
            Info('Like()');
            var button = document.querySelectorAll('[role="button"]');
            var like_number = 0;
            if(button.length == 0) setTimeout(Like, sleep);
            else{
                Info('button.length ' + button.length);
                for (var i=0; i<button.length; i++){
                    //button[i].style.backgroundColor = 'gold';
                    var like = button[i].querySelectorAll('[aria-label="Подобається"]');
                    if(like.length != 0 & like_number == 0){
                        Info('button "Подобається " ' + i);
                        button[i].style.backgroundColor = 'MediumAquamarine';
                        like_number = i;
                        button[like_number].click(); // Останній
                        Info('button "Подобається click()');
                        break;
                    }
                }
            }
        }

        function Modal(){
            Info('Modal()');

            var textbox = document.getElementsByTagName('textarea');
			if(textbox.length == 0) setTimeout(Modal, sleep);
            else{
				var interval = setInterval(Interval, sleep);
				function Interval(){
					textbox[0].focus();
					if(textbox[0].textContent.length == 0){
						document.getElementsByTagName('title')[0].innerHTML = 'Вставляем текст';
						Info('  Вставляем текст');
					}
					else {
						document.getElementsByTagName('title')[0].innerHTML = 'Текст вставлен';
						Info('  Текст вставлен');
						clearInterval(interval);
						setTimeout(ButtonClick, sleep);
					}
				}
			}
        }

        function ButtonClick(){
            Info('ButtonClick()');
			_boolean = false;
            var button = document.querySelectorAll('[role="button"]');
            if(button.length == 0) setTimeout(ButtonClick, sleep);
            else{
                Info('  button: ' + button.length);
                for (var i=0; i<button.length; i++){
                    if (button[i].textContent.indexOf('Опублікувати') != -1){
                        button[i].click();
                        Info('  button click');
                        setTimeout(Comment, sleep*5);
                        _boolean = true;
                        break;
                    }
                }
  /*              if(bag > 10) setTimeout(Close, sleep);
                else {
                    if(_boolean == false) setTimeout(ButtonClick, sleep);
                }*/
            }
        }

        function Comment(){
			_boolean = false;
            var dialog = document.querySelectorAll('[role="presentation"]');
            if(dialog.length == 0) setTimeout(Comment, sleep);
            else{
                Info('  dialog ' + dialog.length);
                var menuitem = dialog[dialog.length-1].querySelectorAll('[role="button"]');
                Info('  menuitem ' + menuitem.length);
                for (var i=0; i<menuitem.length; i++){
                    if (menuitem[i].textContent.indexOf('Щойно') != -1){
                        var link = menuitem[i].getElementsByTagName('a');
                        Info('  link: ' + link.length);
                        link[link.length-1].click();
                        Info('  link['+(link.length-1)+'] click');
                        setTimeout(CopyLink, sleep*3);
						_boolean = true;
                        break;
                    }
                }
                if(bag > 10) {
                    Info('  bag > 10 Error');
                    GM_setClipboard('Error ' + document.location.href);
					setTimeout(Close, sleep);
				}
				else {
					if(_boolean == false) setTimeout(Comment, sleep);
				}
            }
        }

        function CopyLink(){
            Info('CopyLink() Скопійовано у Clipboard');
            GM_setClipboard(document.location.href);
            setTimeout(Close, sleep);
        }
    }

	//--------------------------------------------------------------

    function Error(){
        Info('Error');
        if (document.location.href.indexOf('Post') != -1){
            if(error == false){
                location.reload();
            }
            else{
                GM_setClipboard('Пост создан');
                setTimeout(Close, sleep);
            }
        }
        if (document.location.href.indexOf('Text') != -1){
            if(error == false){
                location.reload();
            }
            else{
                GM_setClipboard('Пост создан');
                setTimeout(Close, sleep);
            }
        }
        if (document.location.href.indexOf('Quote') != -1){
            if(error == false){
                location.reload();
            }
            else{
                GM_setClipboard('Пост создан');
                setTimeout(Close, sleep);
            }
        }
        if (document.location.href.indexOf('Comment') != -1){
            if(error == false){
                location.reload();
            }
            else{
                GM_setClipboard('Пост создан');
                setTimeout(Close, sleep);
            }
        }
    }
    //setTimeout(Error, sleep*60);
}

// =========================================================================================================================================

if (document.location.href.indexOf('https://discord.com/channels') != -1){ // https://discord.com/channels
    if (document.location.href.indexOf('Comment') != -1){
        let array = document.location.href.split('Comment');
        array = array[1].split('%20'); // Розділяємо залишок
        let encodedUrl = array[1]; // Отримуємо закодоване посилання
        let newUrl = decodeURIComponent(encodedUrl); // Декодуємо посилання

        setTimeout(Start, sleep);

        // Вибираємо якийсь слушний коментар, і клікаємо по вводу тексту.
        // Відкривається нове вікно з таблицею відповіді, вибираємо відповідний, і копіюємо відповідь.
        // Через заданий час вікно закривається ClosePopup, а текст вставляється в поле вводу діскорда.

        let popupWindow = null; // Глобальна змінна для збереження посилання на вікно
		GM_setClipboard("");

        function Start() {
            document.onclick = function(event) {
                let target = event.target;

                while (target !== null) {
                    if (target.getAttribute && target.getAttribute('role') === 'textbox') {
                        if (popupWindow) {
                            popupWindow.close(); // Закриваємо попереднє вікно, якщо воно ще відкрите
                        }

                        //popupWindow = window.open(newUrl, '_blank', 'width=900,height=700,top=10,left=360');
                        popupWindow = window.open(newUrl, '_blank');

                        if (popupWindow) {
                            setTimeout(ClosePopup, 30000); // Закриваємо через 30 секунд
                            setTimeout(Warning, 25000); // Закриваємо через 30 секунд
                            function Warning() {
                                playBeep(1000, 1000); // 1000 Гц на 300 мс
                            }
                        }

                        // Перевіряємо зміни вмісту `textbox`
                        observeTextbox(target);

                        event.preventDefault(); // Запобігає виконанню інших дій
                        break;
                    }
                    target = target.parentElement;
                }
            };
        }

        function observeTextbox(textbox) {
            let observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (textbox.textContent.trim() !== "") {
                        // Виконуємо дію, коли текст змінюється та не є порожнім
                        document.getElementsByTagName('title')[0].innerHTML = 'Нажимаем Ентер';
                        textbox.style.color = 'MediumAquamarine';
                        observer.disconnect(); // Зупиняємо спостереження після виявлення змін
                    }
                });
            });

            observer.observe(textbox, { childList: true, subtree: true, characterData: true });
        }


        function ClosePopup() {
            if (popupWindow && !popupWindow.closed) {
                popupWindow.close();
                console.log("Вікно закрито автоматично через 15 секунд.");
                document.getElementsByTagName('title')[0].innerHTML = 'Сlose';
            }
        }

        let lastCopiedMessage = "";
        let isFirstRun = true; // Визначаємо, що це перший запуск

        let observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType !== 1 || !node.id.startsWith("chat-messages-")) return;

                    let messageId = node.id.replace(/^chat-messages-\d+-/, ""); // Видаляємо зайві частини ID
                    if (!messageId || messageId === lastCopiedMessage) return;

                    if (isFirstRun) {
                        // При першому запуску просто запам’ятовуємо ID останнього повідомлення
                        lastCopiedMessage = messageId;
                        isFirstRun = false;
                        console.log("Скрипт ініціалізовано. Очікуємо нове повідомлення...");
                        return;
                    }

                    let urlParts = window.location.pathname.split("/");
                    if (urlParts.length < 4) return;

                    let guildId = urlParts[2]; // ID сервера
                    let channelId = urlParts[3]; // ID каналу

                    let link = `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;

                    lastCopiedMessage = messageId; // Запам’ятовуємо, щоб не копіювати двічі

                    GM_setClipboard(link);
                    console.log("Посилання скопійовано:", link);
                    setTimeout(Close, sleep);
                });
            });
        });

        setTimeout(() => {
            // Даємо Discord трохи часу завантажити повідомлення перед початком відстеження
            observer.observe(document.body, { childList: true, subtree: true });
            console.log("Скрипт запущено. Очікуємо перше нове повідомлення...");
        }, 10000); // Запуск через 3 секунди, щоб уникнути копіювання при відкритті
    }
}

//==================================================================================================================================================

if (document.location.href.indexOf('https://www.reddit.com') != -1){ // https://www.reddit.com ----------------------------------------------------
    if (document.location.href.indexOf('Post') != -1){
        text = GM_getValue("text").split('\n');

        if(parseFloat(GM_getValue("RedditNumber")) > text.length-2) GM_setValue("RedditNumber", 0);
        else GM_setValue("RedditNumber", parseFloat(GM_getValue("RedditNumber"))+1);

        url = document.location.href.split('Post%20');
        array = url[1].split('%20');
        hashtag = '';
        name = array[0];
        for (i=0;i<array.length;i++){
            if(i!=0) hashtag += array[i] + ' ';
            hashtag = hashtag.replace("%2C", ",");
            hashtag = hashtag.replace("%24", "$");
        }

        hashtag = hashtag.replace(/["*"]/g, "#");

        str = name + ' ' + text[parseFloat(GM_getValue("RedditNumber"))];
        GM_setClipboard(str);

        function Start(){
            var input = document.querySelectorAll('[type="text"][placeholder="Create Post"]');
            if(input.length == 0) setTimeout(Start, sleep);
            else{
                input[0].click();

                var interval = setInterval(Interval, sleep);
                function Interval(){
                    if (document.location.href.indexOf('submit') != -1){
                        clearInterval(interval);
                        TextBox();
                    }
                }
            }
        }
        setTimeout(Start, sleep);

        function TextBox(){
            var textbox = document.querySelectorAll('[role="textbox"]');
            if(textbox.length == 0) setTimeout(TextBox, sleep);
            else{
                var interval = setInterval(Interval, sleep);
                function Interval(){
                    if(textbox[0].textContent.length == 0){
                        textbox[0].style.backgroundColor = 'gold';
                        textbox[0].focus();
                        document.getElementsByTagName('title')[0].innerHTML = 'Вставляем текст';
                    }
                    else {
                        textbox[0].style.backgroundColor = 'silver';
                        textbox[0].focus();
                        document.getElementsByTagName('title')[0].innerHTML = 'Нажимаем Ентер';
                        clearInterval(interval);
                        setTimeout(Hashtag, sleep*5);
                    }
                }
            }
        }

        function Hashtag(){
            str = hashtag.split('http');
            GM_setClipboard(str[0]);
            document.getElementsByTagName('title')[0].innerHTML = 'Вставляем текст';
            function Pause(){
                document.getElementsByTagName('title')[0].innerHTML = 'Нажимаем Ентер';
                setTimeout(SetLink, sleep*5);
            }
            setTimeout(Pause, sleep);
        }
        function SetLink(){
            str = hashtag.split('http');
            str = str[1].replace(/%3A/g,':')
            str = str.replace(/%2F/g,'/')
            str = str.replace(/=/g,'')
            if (str.indexOf('%') != -1) alert('Error %');

            GM_setClipboard('http' + str);
            document.getElementsByTagName('title')[0].innerHTML = 'Вставляем текст';
            function Pause(){
                document.getElementsByTagName('title')[0].innerHTML = 'Текст вставлен';
                setTimeout(Title, sleep*5); // Можно успеть вставить картинку
            }
            setTimeout(Pause, sleep);
        }

        function ImgOpen(){
            var imgButton = document.querySelectorAll('[aria-label="Add an image"]');
            if(imgButton.length == 0) setTimeout(ImgOpen, sleep);
            else{
                imgButton[0].click();
                setTimeout(ImgLoad, sleep);
            }
        }

        function ImgLoad(){
            var imgLoad = document.querySelectorAll('[class="DraftEditor-editorContainer"]');
            if(imgLoad.length == 0) setTimeout(ImgLoad, sleep);
            else{
                var img = imgLoad[0].getElementsByTagName('img');
                if(img.length == 0) setTimeout(ImgLoad, sleep);
                else{
                    setTimeout(Title, sleep);
                }
            }
        }

        function Title(){
            var textarea = document.getElementsByTagName('textarea');
            if(textarea.length == 0) setTimeout(Title, sleep);
            else{
                var title = text[parseFloat(GM_getValue("RedditNumber")+1)];
                title = title.split('.');
                GM_setClipboard(title[0]);

                var interval = setInterval(Interval, sleep);
                function Interval(){
                    if(textarea[0].textContent.length == 0){
                        textarea[0].style.backgroundColor = 'gold';
                        textarea[0].focus();
                        document.getElementsByTagName('title')[0].innerHTML = 'Вставляем текст';
                    }
                    else {
                        textarea[0].style.backgroundColor = 'MediumAquamarine';
                        document.getElementsByTagName('title')[0].innerHTML = 'Текст вставлен';
                        clearInterval(interval);
                        setTimeout(Post, sleep);
                    }
                }
            }
        }

        function Post(){
            var button = document.querySelectorAll('[role="button"]');
            if(button.length == 0) setTimeout(Post, sleep);
            else{
                for (var i=0;i<button.length;i++){
                    if(button[i].textContent == 'Post'){
                        button[i].style.backgroundColor = 'MediumAquamarine';
                        button[i].click();
                        setTimeout(CopyLink, sleep*3);
                    }
                }
            }
        }

        function Share(){
            var button = document.querySelectorAll('[data-click-id="share"]');
            if(button.length == 0) setTimeout(Share, sleep);
            else{
                button[0].click();
                setTimeout(CopyLink, sleep);
            }
        }
        //setTimeout(Share, sleep);

        function CopyLink(){
            if (document.location.href.indexOf('comments') != -1){
                GM_setClipboard(document.location.href);
                document.getElementsByTagName('title')[0].innerHTML = "Скопированно";
                setTimeout(Close, sleep);
            }
            else setTimeout(CopyLink, sleep);
        }
    }

    if (document.location.href.indexOf('Comment') != -1){
        document.getElementsByTagName('title')[0].innerHTML = 'Comment';

        text = GM_getValue("text").split('\n');

        if(parseFloat(GM_getValue("RedditNumber")) > text.length-2) GM_setValue("RedditNumber", 0);
        else GM_setValue("RedditNumber", parseFloat(GM_getValue("RedditNumber"))+1);

        str = text[parseFloat(GM_getValue("RedditNumber"))];
        GM_setClipboard(str);
    }

    function Error(){
        GM_setClipboard('Пост не создан');
        setTimeout(Close, sleep);

    }
    //setTimeout(Error, sleep*60);
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------

if (document.location.href.indexOf('https://x.com/i/bookmarks') != -1){ // https://x.com/i/bookmarks
    document.body.innerHTML = 'Введите текст для твитов и постов:';
    document.body.innerHTML += '<br><br>';

    var textarea = document.createElement("textarea");
    textarea.cols = "200";
    textarea.rows = "30";
    document.body.appendChild(textarea);
    textarea.value = GM_getValue("text");

    var btn = document.createElement('button');
    btn.style.border = "thick solid";
    btn.style.borderRadius = '4em';
    btn.style.width = '130px';
    btn.style.height = '40px';
    btn.innerHTML = 'Зберегти?';
    document.body.appendChild(btn);

    btn.onclick = function(event){
        GM_setValue("text", textarea.value);
        alert(textarea.value);
    }
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------

if (document.location.href.indexOf('https://bitcointalk.org/index.php?topic=') != -1){ // https://bitcointalk.org
    if (document.location.href.indexOf('msg') != -1){
        if(window.name == 'Report' || window.name == 'Authentication') {
            //document.body.style.backgroundColor = 'gold';

            GM_setClipboard(document.location.href);
            document.getElementsByTagName('title')[0].innerHTML = 'Скопировано';
            setTimeout(Close, sleep);
        }
    }
    else{
        if (document.location.href.indexOf('&report') != -1){
            window.name = 'Report';
            setTimeout(Start, sleep);
        }
        if (document.location.href.indexOf('&authentication') != -1){
            window.name = 'Authentication';
            setTimeout(Start, sleep);
        }

        function Start(){
            var panelRight = document.getElementsByClassName('reply_button');
            if(panelRight.length != 0){
                panelRight[0].click();
            }
            setTimeout(Start, sleep);
        }
    }
}

if (document.location.href.indexOf('https://bitcointalk.org/index.php?action=post;quote=') != -1){
    if(window.name == 'Report') {
        document.body.style.backgroundColor = 'DarkSeaGreen';

        function Start(){
            textarea = document.querySelector("textarea");
            if(textarea){
                textarea.scrollIntoView();
                scrollTo(0, scrollY -205);
                textarea.textContent = "";
                textarea.focus();

                var interval = setInterval(Interval, sleep);
                function Interval(){
                    if(textarea.value.length == 0){
                        document.getElementsByTagName('title')[0].innerHTML = 'Вставляем текст';
                    }
                    else {
                        document.getElementsByTagName('title')[0].innerHTML = 'Текст вставлен';
                        clearInterval(interval);
                        setTimeout(Report, sleep);
                    }
                }
            }
        }
        setTimeout(Start, sleep);

        function Report(){
            var split = textarea.value.split('\n');
            textarea.value = '';
            for(i=0;i<split.length;i++){
                if(i==0){
                    str = split[0].replace(/\s+/g, ' ');
                    str = str.split('Week');
                    str = str[1].split(' ');

                    var str_1 = str[3].split('.');
                    str_1 = str_1[0]+'.'+str_1[1];

                    var str_2 = str[4].split('.');
                    str_2 = str_2[0]+'.'+str_2[1];

                    if (split[0].indexOf('!') == -1){
                        var account = GM_getValue("Account");
                        if(account == 1) textarea.value = 'Week'+ str[0]+' '+str[1]+' '+str[2]+'  '+str_1+'-'+str_2+'\n';
                        if(account == 2) textarea.value = 'Week'+ str[0]+' '+str[1]+' '+str[2]+'  ('+str_1+'-'+str_2+')\n';
                        if(account == 3) textarea.value = 'Week'+ str[0]+' '+str[1]+' '+str[2]+' : ('+str_1+'-'+str_2+')\n';
                        if(account == 4) textarea.value = 'Week'+ str[0]+' '+str[1]+' '+str[2]+' : ('+str_1+'/'+str_2+')\n';
                        if(account == 5) textarea.value = 'Week'+ str[0]+' '+str[1]+' '+str[2]+'  ('+str_1+'/'+str_2+')\n';
                        if(account == 6) textarea.value = 'Week'+ str[0]+' '+str[1]+' '+str[2]+'  '+str_1+'-'+str_2+'\n';
                        if(account == 7) textarea.value = 'Week'+ str[0]+' '+str[1]+' '+str[2]+'  ('+str_1+'-'+str_2+')\n';
						if(account > 7) alert(GM_getValue("Account") + ' ' + GM_getValue("Account"));
                    }
                }
                else textarea.value += split[i].replace(/\s+/g, ' ') + '\n';
            }
            setTimeout(Click, sleep);
        }
        function Click(){
            var button = document.querySelectorAll('[name="post"]');
            if(button.length == 0) setTimeout(Click, sleep);
            else{
                button[0].click();
            }
        }
    }
}

if (document.location.href.indexOf('https://bitcointalk.org/index.php?action=post;quote=') != -1){
    if(window.name == 'Authentication') {
        document.body.style.backgroundColor = 'DarkSeaGreen';

        function Start(){
            textarea = document.querySelector("textarea");
            if(textarea){
                textarea.scrollIntoView();
                scrollTo(0, scrollY -205);
                textarea.textContent = "";
                textarea.focus();

                var interval = setInterval(Interval, sleep);
                function Interval(){
                    if(textarea.value.length == 0){
                        document.getElementsByTagName('title')[0].innerHTML = 'Вставляем текст';
                    }
                    else {
                        document.getElementsByTagName('title')[0].innerHTML = 'Текст вставлен';
                        clearInterval(interval);
                        //setTimeout(Authentication, sleep);
                    }
                }
            }
        }
        setTimeout(Start, sleep);

        function Authentication(){
            //var split = textarea.value.split('\n');

        }
    }
}

const Replica = [
  "Profitable project 💰💰",
  "Exciting campaign 🚀💎",
  "Fascinating opportunity 📈",
  "Inspiring idea 🪙🌕",
  "Outstanding investment 💵🐂",
  "Brilliant platform 🔗🚀",
  "Innovative crypto campaign 🛠️✨",
  "Rewarding venture 🌐💰",
  "Unmissable blockchain opportunity 🔥📉",
  "Top-notch crypto project 📈💎",
  "Astounding idea 💶🚀",
  "Highly recommended venture 🐂📈",
  "Game-changing project 🪙💡",
  "Reliable platform 🌕📉",
  "Amazing blockchain idea 🖐️💰",
  "Visionary crypto concept 💎💳",
  "Incredible investment 🌟💵",
  "A must-try project 🪙🌐",
  "Next-gen opportunity 🚀✨",
  "Lucrative blockchain venture 💰🐂",
  "Unique crypto platform 🔗📈",
  "Outstanding potential 💶💷",
  "Highly profitable campaign 🔥💰",
  "Extraordinary venture 🚀🪙",
  "Amazing blockchain opportunity 🌕🔗",
  "Inspiring platform 🖐️📉",
  "Intriguing crypto project 💎💹",
  "Valuable opportunity 📈💰",
  "Smart blockchain investment 🛠️💵",
  "Dynamic campaign 🌐🚀",
  "Attractive venture 💴💶",
  "Impressive concept 💎🐂",
  "Life-changing project 📈✨",
  "Solid investment 🪙📉",
  "Unbeatable opportunity 💰🔥",
  "Exceptional platform 🚀🔗",
  "Forward-thinking venture 💵🪙",
  "Top-tier blockchain idea 📉💡",
  "Trusted crypto opportunity 🐂🌐",
  "Incredible campaign 💎✨",
  "Engaging venture 🖐️🚀",
  "Futuristic blockchain platform 💴📈",
  "Unstoppable potential 🔗💹",
  "Worthwhile crypto idea 🌕🔥",
  "Stellar project 💵🚀",
  "Reliable campaign 🪙🐂",
  "Unmatched opportunity 📈✨",
  "Highly lucrative idea 🔥🔗",
  "Astounding blockchain project 🌐💎",
  "Groundbreaking platform 💶💰",
  "Evolving opportunity 💵🪙",
  "Top investment idea 🛠️🐂",
  "Promising crypto concept 📉💹",
  "Impressive campaign 🔗✨",
  "Mind-blowing blockchain opportunity 🚀🌕",
  "Smart investment venture 💴💶",
  "Fantastic crypto platform 💎🐂",
  "Consistent growth potential 📈💡",
  "Vibrant project 🔥🔗",
  "Profitable blockchain idea 🌐💰",
  "Rewarding opportunity 🚀📉",
  "Creative crypto concept 🖐️💎",
  "Fascinating investment venture 💵✨",
  "Next-level blockchain project 🪙🐂",
  "Reliable campaign 🔗📈",
  "Innovative venture 🌕💶",
  "Lucrative crypto opportunity 💴🚀",
  "Amazing blockchain platform 🔥💹",
  "Top-notch idea 💵🔗",
  "Incredible growth potential 💎✨",
  "Future-proof project 🪙🌐",
  "Fantastic campaign 📉💰",
  "Game-changing opportunity 🚀🐂",
  "Exciting blockchain venture 💴💡",
  "Highly rewarding idea 💶🔗",
  "A must-follow project 🌕🔥",
  "Groundbreaking concept 📈💎",
  "Profitable campaign 🔥🚀",
  "Visionary blockchain idea 💴🐂",
  "Dependable crypto opportunity 💰📉",
  "Astounding venture 🪙✨",
  "Impressive growth potential 💵🌐",
  "Unstoppable blockchain project 🔗📈",
  "Extraordinary opportunity 💶💹",
  "Trusted investment platform 🚀💰",
  "Dynamic blockchain concept 🐂💎",
  "Top-level venture 🔥📉",
  "Intriguing platform 🌐✨",
  "Sustainable growth project 💵🔗",
  "Rewarding campaign 🪙🌕",
  "Fascinating crypto idea 📉🚀"
];

// Генерація звуку через Web Audio API

function playBeep(frequency = 1000, duration = 300) {
    let context = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator = context.createOscillator();
    let gainNode = context.createGain();

    oscillator.type = "sine"; // Синусоїдальний звук
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
        context.close();
    }, duration);
}

/*
Настройка модального віконця у твітері:
Дивимося у Фаєрфоксі код віконця, відкривається консоль, поки віконце не закрилося, код швиденько копіюємо.
Там приблизно таке:
<div role="alert" class="css-175oi2r r-1awozwy r-l5o3uw r-18u37iz r-1wtj0ep r-xyw6el r-105ug2t r-yz1j6i r-1kihuf0 r-z2wwpe r-zd98yo" style="transition-property: opacity; transition-duration: 170ms; transition-timing-function: cubic-bezier(0, 0, 1, 1); opacity: 1;" data-testid="toast"><div dir="ltr" class="css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-1wbh5a2 r-3o4zer" style="text-overflow: unset; color: rgb(255, 255, 255);"><span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3" style="text-overflow: unset;">Пост отправлен.</span></div><div aria-hidden="true" class="css-175oi2r r-18u37iz"><a href="/panioli4ka/status/1790355737962520994" dir="ltr" role="link" class="css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-b88u0q r-1kihuf0 r-1a11zyx r-3s2u2q r-1loqt21" style="text-overflow: unset; color: rgb(255, 255, 255);"><span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3" style="text-overflow: unset;">Посмотреть</span></a></div></div>
*/