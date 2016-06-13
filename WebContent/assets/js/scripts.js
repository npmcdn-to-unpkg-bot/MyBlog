
(function(){
	
	var app = angular.module('MyBlog',['ngRoute','angularUtils.directives.dirPagination','wu.masonry']);
	
	app.config(['$routeProvider', 
	    function($routeProvider){
			$routeProvider.
				when('/BlogPostInfo',{
					templateUrl:'BlogPostInfo.html',
					controller:'BlogPostController'
				}).
				when('/blogpost',{
					templateUrl:'blogpost.html',
					controller:'BlogPostController'
				}).
				otherwise({
					redirectTo:'/blogpost'
				});
		}
	]);
	
	app.run(function($rootScope) {
		$rootScope.posts = "";
		$rootScope.currentArticle = "";
		$rootScope.convertJSONDateToJavascriptDate = function(jsonDate){
			var monthNames = ["January", "February", "March", "April", "May", "June",
			  "July", "August", "September", "October", "November", "December"
			];

			var newdate;
			var dateObj = new Date(jsonDate);
			var month = dateObj.getUTCMonth() + 1; //months from 1-12
			var day = dateObj.getUTCDate();
			var year = dateObj.getUTCFullYear();

			newdate = day + " " + monthNames[month] + " " + year;
			return newdate;
		}
	});
	
	app.controller('TopWrapperController',function($http, $log, $scope, $window){
		var controller = this;
		$scope.categories=[{name:"Society", info:"Culture, Social Openion ...", urlPath: "assets/img/society.jpg"},
							{name:"Technology", info:"Networking, Cloud Computing, Internet of Things...",urlPath: "assets/img/technology.jpg"},
							{name:"Politics", info:"Issues, Analysis...",urlPath: "assets/img/ernesto_che_guevara_by_last_hope94.jpg"},
							{name:"Entertainment", info:"Cinemas, Sports ...",urlPath: "assets/img/entertainment.jpg"}];
							
	
		//Check whether the user is already autneticated
		$scope.signupText = "";
		$scope.showSignUpPage = false;
		
		$http.get('rest/signup').success(function(data, status, headers, config) {
			$scope.signupText = "Signout";
		}).error(function(data, status, headers, config) {
			
			$scope.signupText = "Signup";
		});
		
		$scope.toggleSignUpSignOut = function(data){
			
			if(data ==="Signup"){
				$scope.showSignUpPage = !$scope.showSignUpPage;
			}else{
				$scope.showSignUpPage = false;
				$http.get('rest/signup/user').success(function(data, status, headers, config) {
					$log.debug(data);
					$scope.signupText = "Signup";
				}).error(function(data, status, headers, config) {

					$log.debug("Issue in signout....");

				});

			}
		}

		
		$("#myCarousel").bind('slid.bs.carousel', function (e) {
			
			var urlpath = $scope.categories[$('#myCarousel .active').index()].urlPath;
			$(".top-wrapper-background").backstretch(urlpath);
			$(".top-wrapper-background").backstretch("resize");
		});
		
		$("#myCarousel").bind('slid.bs.carousel', function (e) {
			
			var urlpath = $scope.categories[$('#myCarousel .active').index()].urlPath;
			$(".top-wrapper-background").backstretch(urlpath);
			$(".top-wrapper-background").backstretch("resize");
		});
		
		
		// The "getFormData()" function retrieves the names and values of each input field in the form; 

		function getFormData(form) {
			var data = {};
			$(form).find('input, select').each(function() {
				if (this.tagName.toLowerCase() == 'input') {
					if (this.type.toLowerCase() == 'checkbox') {
						data[this.name] = this.checked;
					} else if (this.type.toLowerCase() != 'submit') {
						data[this.name] = this.value;
					}
				} else {
				data[this.name] = this.value;
				}
			});
			return data;
		}

		// The "addFormError()" function, when called, adds the "error" class to the form-group that wraps around the "formRow" attribute;
		function addFormError(formRow, errorMsg) {
			var errorMSG = '<span class="error-msg">' + errorMsg + '</span>';
			$(formRow).parents('.form-group').addClass('has-error');
			$(formRow).parents('.form-group').append(errorMSG);
			$('#dialog').removeClass('dialog-effect-in');
			$('#dialog').addClass('shakeit');
			setTimeout(function() {
				$('#dialog').removeClass('shakeit');
			}, 300);
		}

		// FORM HANDLER:

		// form_name - This attribute ties the form-handler function to the form you want to submit through ajax. Requires an ID (ex: #myfamousid)
		// custom_validation - 

		function form_handler(form_name, custom_validation, success_message, error_message, success_function, error_function) {
		  $(form_name).find('input[type="submit"]').on('click', function(e) { // if submit button is clicked

			window.onbeforeunload = null; // cancels the alert message for unsaved changes (if such function exists)

			$(form_name).find('.form-group .error-msg').remove();
			var submitButton = this;
			submitButton.disabled = true; // Disables the submit buttton until the rows pass validation or we get a response from the server.

			var form = $(form_name)[0];
			// The custom validation function must return true or false.
			if (custom_validation != null) {
			  if (!custom_validation(form, getFormData(form))) {
				submitButton.disabled = false;
				return false;
			  }
			}
			e.preventDefault(); //STOP default action
		  });
		  $(document).click(function(e) { // Whenever the user clicks inside the form, the error messages will be removed.
			if ($(e.target).closest(form_name).length) {
			  $(form_name).find('.form-group').removeClass('has-error');
			  setTimeout(function() {
				$(form_name).find('.form-group .error-msg').remove();
			  }, 300);
			} else {
			  return
			}
		  });
		}

		// LOGIN FORM: Validation function
		function validate_login_form(form, data) {
		  if (data.user_username == "") {
			// if username variable is empty
			addFormError(form["user_username"], 'The username is invalid');
			return false; // stop the script if validation is triggered
		  }

		  if (data.user_password == "") {
			// if password variable is empty
			addFormError(form["user_password"], 'The password is invalid');
			return false; // stop the script if validation is triggered
		  }

		 
		  
		  $log.debug("username = " + data.user_username);
		  $log.debug("password = " + data.user_password);

		  	$http.get('rest/signup', 
			{headers: {'Authorization': 'Basic ' + btoa(data.user_username + ":" + data.user_password)}}).success(function(data, status, headers, config) {
				$log.debug(data);
				$scope.signupText = "Signout";
				/*$('#dialog').removeClass('dialog-effect-in').removeClass('shakeit');
				$('#dialog').addClass('dialog-effect-out');*/
				$scope.showSignUpPage = false;
			}).error(function(data, status, headers, config) {
				$scope.signupText = "Signup";
				$log.debug("Invalid username or password..." + status +":"+ data+":" + headers +":"+ config);
				addFormError(form["user_password"], 'The username or password is invalid');
			});
			
		  //$('#successful_login').addClass('active');
		  //return true;
		}

		// REGISTRATION FORM: Validation function
		function validate_registration_form(form, data) {
		  if (data.user_username == "") {
			// if username variable is empty
			addFormError(form["user_username"], 'The username is invalid');
			return false; // stop the script if validation is triggered
		  }

		  if (data.user_password == "") {
			// if password variable is empty
			addFormError(form["user_password"], 'The password is invalid');
			return false; // stop the script if validation is triggered
		  }

		  if (data.user_cnf_password == "" || data.user_password != data.user_cnf_password) {
			// if password variable is empty
			addFormError(form["user_cnf_password"], "The passwords don't match");
			return false; // stop the script if validation is triggered
		  }

		  if (!data.user_terms) {
			// if password variable is empty
			addFormError(form["user_terms"], "You need to read and accept the Terms and Conditions before proceeding");
			return false; // stop the script if validation is triggered
		  }
		  
			 var userData = JSON.stringify({
					name: data.user_username,
					password:data.user_password
				})
				
		  	$http.post('rest/user',userData).success(function(data, status, headers, config) {
				$log.debug("Successfully created the user...");
				$scope.showSignUpPage = false;
			}).error(function(data, status, headers, config) {
				$log.debug("Failed to create user...");
				addFormError(form["user_cnf_password"], "Failed to create the user");
			});
			
		  /*$('#dialog').removeClass('dialog-effect-in').removeClass('shakeit');
		  $('#dialog').addClass('dialog-effect-out');
		  
		  $('#successful_registration').addClass('active');*/
		  //return true;
		}

		form_handler("#login_form", validate_login_form, null, null, null, null, null, null);
		form_handler("#register_form", validate_registration_form, null, null, null, null, null, null);

		var dialogBox = $('#dialog');

		dialogBox.on('click', 'a.user-actions', function() {
		  dialogBox.toggleClass('flip');
		});

		$('#successful_login,#successful_registration').on('click', 'a.dialog-reset', function() {
		  $('#successful_login,#successful_registration').removeClass('active');
		  dialogBox.removeClass('dialog-effect-out').addClass('dialog-effect-in');
		  document.getElementById('login_form').reset();
		  document.getElementById('register_form').reset();
		});		
		
	});
	
	
	app.controller('BlogPostController',function($http, $log, $scope,$rootScope,$location){
		$scope.currentPage = 0;
		$scope.itemsPerPage = 9;
		
		$scope.getPosts = function() {
			$log.debug("Getting all blog posts...");
			$http.get('rest/post').success(function(data, status, headers, config) {
				$rootScope.posts = data;
			}).error(function(data, status, headers, config) {
				$log.debug("Failed to get blog posts...");
			});
		}


		$scope.article = "";
		$scope.showArticle = function(index){
			$scope.article = $rootScope.posts[index];	
			$rootScope.currentArticle = $scope.currentPage* $scope.itemsPerPage+ index;
			
			var Indata = {'field': "currentArticle", 'value': $rootScope.currentArticle};
			
		  	$http.post('rest/session',Indata).success(function(data, status, headers, config) {
				$log.debug("Successfully saved the current article index in session object");
			}).error(function(data, status, headers, config) {
				$log.debug("Failed to save current article index in session object...");
			});

			$location.path("/BlogPostInfo");
		}
		
		
		$scope.pageChangeHandler = function(num) {
			console.log('Article page changed to ' + num);
			$scope.currentPage = num-1;
		};
  
		$scope.getPosts();

	});

	app.controller('BlogPostInfoController',function($http, $log, $scope,$rootScope,$window){
		/*if( $rootScope.posts === ""){
			$http.get('rest/session/currentArticle').success(function(data, status, headers, config) {
				$log.debug("Successfully got the currentArticle from session object...");
				$rootScope.currentArticle = data;
			}).error(function(data, status, headers, config) {
				$log.debug("Failed to get currentArticle from session object...");
			});
		}
		
		if( $rootScope.posts === ""){
			$log.debug("Getting all blog posts...");
			$http.get('rest/post').success(function(data, status, headers, config) {
				$rootScope.posts = data;
				$location.path("/BlogPostInfo");
			}).error(function(data, status, headers, config) {
				$log.debug("Failed to get blog posts...");
			});
		}*/
		
		
			

	});

	
})();
