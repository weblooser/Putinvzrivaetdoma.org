
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
				$(this).unbind('click').click(function() { return false; });
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

		$('#ys-input-submit').click(function(){ self.send.apply(self) });
		$('#ys-post-form').submit(function(){ return false });
	},

	initRefresh: function() {
		var self = this;
		if (this.refreshTimer) clearInterval(this.refreshTimer)
		this.refreshTimer = setInterval(function() {
			self.ajax(self.updates, { reqType: 'refresh' });
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
			
			var  postNickname = $('#ys-input-nickname').val(), postMessage = $('#ys-input-message').val().replace(/(.*:\S{1,3}:.*){6,20}/g, '$1');;
			
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
			$('#ys-posts').append('<div id="ys-banned"><span>You\'re banned. Click <a href="#" id="ys-unban-self">here</a> to unban yourself if you\'re an admin. If you\'re not, go <a href="' + this.options.yPath + 'cp/" id="ys-banned-cp-link">log in</a>!</span></div>');

			$('#ys-banned-cp-link').click(function() {
				self.openCP.apply(self);
				return false;
			});
			
			$('#ys-unban-self').click(function() {
				self.ajax(function(json) {
					if (!json.error)
						self.unbanned();
					 else if (json.error == 'admin')
						alert('You can only unban yourself if you\'re an admin.');
				}, { reqType: 'unbanself' });
				return false;
			});
		}		
	},

	unbanned: function() {
		var self = this;
		$('#ys-banned').fadeOut(function() { $(this).remove(); });
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
		var self = this;
	
		var pad = function(n) { return n > 9 ? n : '0' + n; };
		var date = function(ts) { return new Date(ts * 1000); };
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
		var postColor = "#" + post.uid.substr(0,6);
		post.id = id;
		
		post.message = this.links(post.message);
		post.message = this.smileys(post.message);
		post.message = this.bbcode(post.message);
		post.message = this.answer(post.message);
		var html = 
			'<div id="' + id + '" class="ys-post'+ (post.banned ? ' ys-banned-post' : '') + '">' +
				(this.prefs.timestamp> 0 ? '<span class="ys-post-timestamp" title="Ответить" style="color:' + postColor + ';">' + time(post.timestamp) + '</span> ' : '') +
//				'<span class="ys-post-nickname">' + post.nickname + this.prefs.nicknameSeparator + '</span> ' +
				'<span class="'+ (post.admin ? 'ys-admin-post' : 'ys-post-message') +'">' + post.message + '</span> ' +
//				'<span class="ys-post-info' + (this.prefs.info == 'overlay' ? ' ys-info-overlay' : ' ys-info-inline') + '">' + (post.adminInfo ? '<em>IP:</em> ' + post.adminInfo.ip + ', ' : '') + '<em>Posted:</em> ' + dateStr(post.timestamp) + ' at ' + time(post.timestamp)  + '.</span>' +
//				'<span class="ys-post-actions"><a title="Show post information" class="ys-info-link" href="#">Info</a>'  + (post.adminInfo ? ' | <a title="Delete post" class="ys-delete-link" href="#">Удалить</a> | ' + (post.banned ? '<a title="Unban user" class="ys-ban-link" href="#">Разбан</a>' : '<a title="Ban user" class="ys-ban-link" href="#">Бан</a>') : '') + '</span>' +
				(post.adminInfo ? ' <span class="ys-post-actions">'+post.adminInfo.ip+' <a title="Delete post" class="ys-delete-link" href="#">Delete</a> | ' + (post.banned ? '<a title="Unban user" class="ys-ban-link" href="#">Unban</a>' : '<a title="Ban user" class="ys-ban-link" href="#">Ban</a>') : '') + '</span>' +
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
				function() { self.showInfo.apply(self, [id, this]); return false; },
				function() { self.hideInfo.apply(self, [id, this]); return false; })
			.end()
			.find('.ys-ban-link').click(
				function() { self.ban.apply(self, [post, id]); return false; })
			.end()
			.find('.ys-delete-link').click(
				function() { self.del.apply(self, [post, id]); return false; })
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
		s = smile(s, ':coi:',  'coin.gif');
		s = smile(s, ':t:',  'tian.gif');
		s = smile(s, ':vl:',  'train.gif');
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
			this.ajax(function(json) { this.truncate(true); this.updates(json); this.initializing = false; }, {
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