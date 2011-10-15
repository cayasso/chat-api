/*
 * Author: Jonathan Brumley
 * Date: 11/04/05
 * Time: 11:30PM MT
 */
(function($){

	$.chat = function(options){
		
		var 
		
		// Default options, will be overwriting if user input options
		defaults = {
			form : '.chat-form',	
			popin : '.user-id-pop',
			startLink : '.start-link',
			releaseLink : '.release-link',
			recordsLink : '.records-link',
			chatArea: '.chat-area',
			domain : 'http://localhost/chat',
			widget: '.chat-widget',
			message : '.chat-message'
		},
				
		api = {
		
			// THESE ARE THE CHAT GENERAL FUNCTIONS
			
			// API form fields
			fields : {
				userid : '#userid',
				message: '#message'
			},
			
			action : null,
			
			userId : '',
			
			// Get the user input
			getInput : function(key, $form){
				
				if (api.fields[key] && $form.find(api.fields[key]).length) {
					return $form.find(api.fields[key])[0].value;
				}
				
				return null;				
			},
						
			onSuccess : function(res){						
				
				// Call the success function for the specific action		
				var qs = api[api.action][(res.status) ? 'success' : 'error'](res);
				
				$(o.message)					
				
				// Remove message classes if any
				.removeClass('error success')

				// Set the api message error class					
				.addClass(res.status ? 'success': 'error')
				
				// Set the message comming from api
				.html(res.message);								
			},
			
			// On error handling function
			onError : function(){
				$(o.message).html('Sorry, unable to load chat :( try again.').addClass('error');
			},
		  			  	
			// Send the request to api
			send : function($obj) {
				
				if (typeof $obj.attr('action') !== 'undefined') {
					// Get the action from form
					api.action = $obj.attr('action');
				} else if (typeof $obj.attr('href') !== 'undefined') {
					// Get the action from link
					api.action = $obj.attr('href');
				} else {
					return false;
				}
				
				api.action = api.action.replace('/chat/', '').replace(/\?js=no-js|js=no-js/g, '');
						
				// If action is valid and also is found in api action array proceed
				if (api.action && api[api.action]) {
					
					// Get the query string object
					var qs = api[api.action]['run']($obj);
				
					// Call the api
					api.request(qs);
				}
				return false;
			},
			
			request : function(qs){
							
				var 
				
				// Get the url from the object
				url = qs.url || null,
				
				// Get the data
				data = qs.data || '';				
				
				// Submit the request on if the url is set
				if (url) {
				
					$.ajax({
						type: "GET",
						dataType: 'json',
					  	url: o.domain + url,
					  	data: data+'&js=true', // This is to know we submitting the form with javascript
					  	success: api.onSuccess,
					  	error: api.onError,				  	
					  	statusCode: api.onStatus				  	
					});
				} else {
					return false;
				}			
			},
			 
			// THESE ARE THE API ACTIONS
			
			// Change the user id
			'change-id.php' : {
			
				success : function(res){
					$(o.widget+', '+ o.releaseLink +', '+ o.recordsLink).show();
				},
				
				error : function(){	},
				
				run: function($form){
			
					// Get the field value				
					api.userId = api.getInput('userid', $form);				
				
					// Return the ajax get string
					return { url : '/' + api.action, data: 'id=' + api.userId };
				}
			},
			
			// Release the user id
			'release-id.php' : {
			
				success : function(res){
					api.userId = '';					
				},
				
				error : function(){	},
				
				run: function(){							
					// Return the ajax get string
					return { url : '/' + api.action, data: 'id=' + api.userId };
				}
			},
			
			// Send a message
			'message.php' : {
			
				success : function(res){
					$(o.chatArea).append('<br>' + res.time + '<hr /><strong>' + api.userId + ': </strong>'+res.user_message+'<br>');
				},
				
				error : function(){	},
				
				run: function($form){
			
					// Get the field value				
					var message = api.getInput('message', $form);				

					// Return the ajax get string
					return { url : '/' + api.action, data: 'message=' + message+'&id='+api.userId };
				}
			},
			
			// Send a message
			'chat-records.php' : {
			
				success : function(res){
					$(o.chatArea).html(res.data);
				},
				
				error : function(){	},
				
				run: function($form){			
					// Return the ajax get string
					return { url : '/' + api.action, data: ''};
				}
			}
		},
		
		user = {
	
			// Will trigger the get id form
			showForm : function() {		
				var $e = $(o.popin);
				
				// Create and add overlay to DOM
				var $overlay = $('.overlay');
								
				// add the popup content class
				$e.addClass('pp-content');
				
				if ($('.pp-wrap').length < 1) {
				
					// Wrap target div with popip wrapper
					$e.wrap('<div class="pp-wrap" />');
							
					var $pp = $e.parent('.pp-wrap').css({'display': 'block'});
					
					// Add close button wrapper
					var $close_icon = $('<span />', { 'class': 'pp-close-icon'});					
			
					// Add close button and set event	
					$('<a />', {
					  	'class': 'pp-close-button', click: function(){ user.hideForm(); }
				
					}).html('X').appendTo($close_icon);
			
					// Show the target element
					$e.prepend($close_icon);
				}
				
				$e.show();
				
				$('.pp-wrap').css('display', 'block');	
				
				if ($overlay.length < 1) {
					$overlay = $('<div/>', { 'class': 'overlay', 'css': {'overflow-y': 'hidden'} })
					.prependTo('body').animate({"opacity":"0.6"}, 200, "linear");
				}											
			},
			
			hideForm: function () {
				// Allow closing the overlay and the popup with a click
				$(".overlay").animate({"opacity":"0"}, 200, "linear", function(){
					$('.pp-wrap').css('display', 'none');
					$(this).detach();	
				});
			}
		},
	
		// Options
		o = {};
		
		// Execute function
		function execute(){
			// Set the user options
			setOptions();
			
			// Set the app events
			setEvents();
		}
				
		// Set the options	
		function setOptions () {	
			o = $.extend({}, defaults, options);		
		}
		
		// Set all javascript events
		function setEvents () {
		
			// Start link event
			$(o.startLink).click(function(){
				user.showForm();													
				return false;
			});
			
			// Start popin form event
			$(o.form).submit(function(){
				user.hideForm();
				return api.send($(this));			
			});
			
			// Set release and records link event
			$(o.releaseLink+', '+o.recordsLink).click(function(){
				api.send($(this));
				return false;
			});			
		}					
		
		// Application starts to run here
		execute();
	}
		
})(jQuery);


