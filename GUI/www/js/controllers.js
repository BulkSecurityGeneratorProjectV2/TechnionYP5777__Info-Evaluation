/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])


.constant('ApiEndpoint', {
    url: 'http://132.68.206.107:8080'
})


.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
})

.controller('LoginCtrl', function($scope, $timeout, $stateParams, ionicMaterialInk) {
    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();
})


.controller('ShowResultsButtonCtrl', function($scope, $state, DataQ, $ionicPopup, CheckQuery2Input) {

    $scope.showSecondQueryResults = function(place, year) {
        console.log('show results button was clicked-query 2');
        CheckQuery2Input.validateInput(place, year)
            .then(
                function(response) {
                    if (response == 'OK') {

                        DataQ.setYear(year);
                        DataQ.setPlace(place);
                        $state.go('app.Query2Results');
                    }
                },
                function(error) {
                    if (error == 'MISSING') {
                        //don't allow the user search unless he enters all inputs
                        var InputErrorAlert = $ionicPopup.alert({
                            title: 'Input error!',
                            template: 'Missing Input. Please insert valid Place and Year',
                        });
                    } else if (error == 'INVALIDYEAR') {
                        var InputErrorAlert = $ionicPopup.alert({
                            title: 'Input error!',
                            template: 'Illegal Input. Please insert a valid Year',
                        });
                    }

                }
            );
    }
})


.controller('QueryEntry', function($scope, $http, $ionicPopup, DataQ, Query1ExtraInfo, $state) {
    console.log('show entered fields from button clicked-query 2');
    console.log(DataQ.getYear());
    console.log(DataQ.getPlace());
    $scope.persons = [];
    $scope.loading = true;
    $http({
        method: 'GET',
        url: 'http://132.68.206.107:8080/Queries/Query2',
        params: {
            place: DataQ.getPlace(),
            year: DataQ.getYear()
        }
    }).then(function successCallback(response) {
        console.log('success');
        $scope.persons = [];
        for (var r in response.data) {
            console.log(r);
            var person = response.data[r];
            console.log('url is ' + person.photoLink);
            if (person.photoLink == "No Photo") {
                person.photoLink = "http://www.freeiconspng.com/uploads/profile-icon-9.png";
            }
            var photoUrl = "url('" + person.photoLink + "')";
            person.photoLink = photoUrl;

            $scope.persons.push(person);
            console.log(person.name);
            console.log(person.wikiPageID);
            console.log(person);
            console.log(person.photoLink);

        }
        $scope.loading = false;
        console.log('end of success');
    }, function errorCallback(response) {
        alert(JSON.stringify(response))
        var FetchErrorAlert = $ionicPopup.alert({
            title: 'Fetch error!',
            template: 'Unable to get data',
        });

        console.log(response.data);
    });
    $scope.numberOfItemsToDisplay = 6; // Use it with limit to in ng-repeat
    $scope.addMoreItem = function(done) {
        if ($scope.persons.length > $scope.numberOfItemsToDisplay)
            $scope.numberOfItemsToDisplay += 6; // load number of more items
        $scope.$broadcast('scroll.infiniteScrollComplete')
    }

    $scope.showExtraInfo = function(per) {
        Query1ExtraInfo.setPerson(per);
        $state.go('app.extraInfo');
    };

})

.controller('Query1Entry', function($scope, $http, $ionicPopup, Query1ExtraInfo, $state) {
    console.log('show entered fields from button clicked-query 1');
    $scope.persons = [];
    $scope.numberOfItemsToDisplay = 6; // Use it with limit to in ng-repeat

    $scope.loading = true;

    console.log('started loading screen');

    $http({
        method: 'GET',
        url: 'http://132.68.206.107:8080/Queries/Query1',
    }).then(function successCallback(response) {
        console.log('success');
        $scope.persons = [];
        for (var r in response.data) {
            var person = response.data[r];
            console.log('url is ' + person.photoLink);
            if (person.photoLink == "No Photo") {
                person.photoLink = "http://www.freeiconspng.com/uploads/profile-icon-9.png";
            }
            var photoUrl = "url('" + person.photoLink + "')";
            person.photoLink = photoUrl;

            $scope.persons.push(person);
            console.log(person.name);
            console.log(person.birthPlace);
            console.log(person.deathPlace);
            console.log(person.photoLink);
        }
        $scope.loading = false;

    }, function errorCallback(response) {
        alert(JSON.stringify(response))
        var FetchErrorAlert = $ionicPopup.alert({
            title: 'Fetch error!',
            template: 'Unable to get data',
        });
        console.log(response.data);
    });


    $scope.addMoreItem = function(done) {
        if ($scope.persons.length > $scope.numberOfItemsToDisplay)
            $scope.numberOfItemsToDisplay += 6; // load number of more items
        $scope.$broadcast('scroll.infiniteScrollComplete')
    }

    $scope.showExtraInfo = function(per) {
        console.log('217 name is ' + per.name);
        Query1ExtraInfo.setPerson(per);
        $state.go('app.extraInfo');
    };


})

.controller('ExtraInfo1', function($scope, $http, $ionicPopup, Query1ExtraInfo) {
    console.log('229 in extra info');
    $scope.loading = true;
    $scope.stateShow = true;
	$scope.titleOverview=false;
    $scope.personalInformation = Query1ExtraInfo.getPerson();
	
	var photoLink = $scope.personalInformation.photoLink;
	/*$scope.personalInformation.photoLink=photoLink.replace("url('", "");
	photoLink = $scope.personalInformation.photoLink;
	$scope.personalInformation.photoLink=photoLink.replace("')", "");*/
	console.log('url is ' + $scope.personalInformation.photoLink);
	console.log('259 name is ' + $scope.personalInformation.name);
    $scope.showMoreInfo = function() {
        $scope.stateShow = false;
        console.log('281 in on click more info');
        $http({
            method: 'GET',
            url: 'http://132.68.206.107:8080/Queries/PersonalInformation',
            params: {
                name: $scope.personalInformation.name
            }
        }).then(function successCallback(response) {
            console.log('personal data - success');
            $scope.moreInfo = response.data;
            console.log('url is ' + $scope.moreInfo.photoLink);
            console.log('birthPlace is:' + $scope.moreInfo.birthPlace);
            if ($scope.moreInfo.photoLink == "No Photo") {
                $scope.moreInfo.photoLink = "http://www.freeiconspng.com/uploads/profile-icon-9.png";
            }
            $scope.loading = false;
			$scope.titleOverview=true;

        }, function errorCallback(response) {
            //alert(JSON.stringify(response))
            console.log('loading is ' + $scope.loading);
            console.log('stateShow is ' + $scope.stateShow);
            $scope.loading = false;
            var FetchErrorAlert = $ionicPopup.alert({
                title: 'Fetch error!',
                template: 'Unable to get more personal',
            });
            console.log(response.data);
            //$state.go('app.InteractiveSearch');
        });
    };
})

.controller('SameOccupationQuery', function($scope, $http, $ionicPopup) {
    console.log('show entered fields from button SameOccupationQuery');
    $scope.persons = [];
    $scope.numberOfItemsToDisplay = 6; // Use it with limit to in ng-repeat

    $scope.loading = true;

    console.log('started loading screen');

    $http({
        method: 'GET',
        url: 'http://132.68.206.107:8080/Queries/SameOccupationCouples',
    }).then(function successCallback(response) {
        console.log('success');
        $scope.persons = [];
        for (var r in response.data) {
            var person = response.data[r];
            console.log('url is ' + person.photoLink);
            if (person.photoLink == "No Photo") {
                person.photoLink = "http://www.freeiconspng.com/uploads/profile-icon-9.png";
            }
            var photoUrl = "url('" + person.photoLink + "')";
            person.photoLink = photoUrl;

            $scope.persons.push(person);
            console.log(person.name);
            console.log(person.birthPlace);
            console.log('the spouse of '+ person.name+' is ' + person.SpouseName);
            console.log(person.photoLink);
        }
        $scope.loading = false;

    }, function errorCallback(response) {
        var FetchErrorAlert = $ionicPopup.alert({
            title: 'Fetch error!',
            template: 'Unable to get data',
        });
        console.log(response.data);
    });


    $scope.addMoreItem = function(done) {
        if ($scope.persons.length > $scope.numberOfItemsToDisplay)
            $scope.numberOfItemsToDisplay += 6; // load number of more items
        $scope.$broadcast('scroll.infiniteScrollComplete')
    }


})

.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('InteractiveSearchCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('AddQueryCtrl', function($scope, $state,$http,$q ,$ionicPopup, DynamicParams,ambiguousNames) {
	
	//$state.go('app.dynamicInput');
	
    // Triggered on a button click, or some other target
   $scope.searchPopUp = function() {
    $scope.dynamicData = {};
	$scope.checked=false;
	   $state.go('app.dynamicInput');
        // An elaborate, custom popup
	   /*
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="dynamicData.query" placeholder="Your Query here"; white-space:normal; >' +
                '</br> <input type="text" ng-model="dynamicData.personName"  placeholder="Person\'s name ; white-space:normal;">',
            title: 'Enter the Query name you wish to look for',
            subTitle: 'Please describe in one word',
            scope: $scope,
			async: false,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Search</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!($scope.dynamicData.query && $scope.dynamicData.personName)) {
                            //don't allow the user search unless he enters all inputs
                            e.preventDefault();
                        } else {
                            return $scope.dynamicData;
                        }
                    }
                }
            ]
        });

		myPopup.then(function(res) {
			$http({
								method: 'GET',
								url: '/Queries/checkAmbiguities',
								params: {
									name: res.personName
								}
							}).then(function successCallback(response) {
								$scope.listOfPersons = [];
								console.log(response);
								if (!response.data) {
									console.log('No ambiguities');
									console.log('Query was added: ' + res.query);
									console.log('Person to look for in query: ' + res.personName);
									DynamicParams.setName(res.personName);
									DynamicParams.setQuery(res.query);
									$state.go('app.dynamicQueryResults');
									
								} else {
									
									for (var r in response.data) {
										var info = response.data[r];

										$scope.listOfPersons.push(info);
										console.log(info);
									}
									$scope.loading = false;
									ambiguousNames.setNames($scope.listOfPersons);
									DynamicParams.setQuery(res.query);
									$state.go('app.solveAmbiguity');
								}
							}, function errorCallback(response) {
								res.ambiguitiesSolved=false;
								alret('problem');
							});
			});
        */
   }
})

.controller('Dynamicparameters', function($scope, $http, $ionicPopup, DynamicParams, $state,ambiguousNames, CheckDynamicParams) {
    $scope.showDynamicResults = function(query,person) {
		CheckDynamicParams.validateInput(query,person)
            .then(
                function(response) {
                    if (response == 'OK') {
						console.log('Input ok');
                       $http({
							method: 'GET',
							url: 'http://132.68.206.107:8080/Queries/checkAmbiguities',
							params: {
								name: person
							}
						}).then(function successCallback(response) {
							$scope.listOfPersons = [];
							console.log(response);
							if (!response.data) {
								console.log('No ambiguities');
								console.log('Query was added: ' + query);
								console.log('Person to look for in query: ' + person);
								DynamicParams.setName(person);
								DynamicParams.setQuery(query);
								$state.go('app.dynamicQueryResults');

							} else {

								for (var r in response.data) {
									var info = response.data[r];

									$scope.listOfPersons.push(info);
									console.log(info);
								}
								$scope.loading = false;
								ambiguousNames.setNames($scope.listOfPersons);
								DynamicParams.setQuery(query);
								$state.go('app.solveAmbiguity');
							}
						}, function errorCallback(response) {
							res.ambiguitiesSolved=false;
							alret('problem');
						});
                    }
                },
                function(error) {
                    if (error == 'MISSING') {
                        //don't allow the user search unless he enters all inputs
                        var InputErrorAlert = $ionicPopup.alert({
                            title: 'Input error!',
                            template: 'Missing Input. Please insert valid query and name',
                        });
                    } /*else if (error == 'INVALIDSPACE' ) {
                        var InputErrorAlert = $ionicPopup.alert({
                            title: 'Input error!',
                            template: 'Illegal Input. Please insert a query which contains only one word',
                        });
                    } */else if (error == 'INVALIDQUERY' || error == 'INVALIDSPACE') {
                        var InputErrorAlert = $ionicPopup.alert({
                            title: 'Input error!',
                            template: 'Illegal Input. Please insert a one word query which contains only letters',
                        });
                    } else if (error == 'INVALIDNAME') {
                        var InputErrorAlert = $ionicPopup.alert({
                            title: 'Input error!',
                            template: 'Illegal Input. Please insert a valid person\'s name',
                        });
                    }
					

                }
        );
	}


})

.controller('ambiguitySolver', function($scope, $state,$http,$q ,$ionicPopup, DynamicParams,ambiguousNames) {
	console.log('Start to solve ambiguous names');
	$scope.persons = [];
	$scope.persons = ambiguousNames.getNames();
	console.log($scope.persons[0].toString());
	$scope.query = DynamicParams.getQuery();
	var FetchErrorAlert = $ionicPopup.alert({
                title: 'Ambiguity !',
                template: 'There are many entities with the same name. <br> Please choose the person you are referring to.',
            });
	$scope.RetryQuery = function(name){
			console.log('No ambiguities');
			console.log('Query was added: ' + DynamicParams.getQuery().toString());
			console.log('Person to look for in query: ' + name);
			DynamicParams.setName(name.toString());
			DynamicParams.setQuery(DynamicParams.getQuery().toString());
			$state.go('app.dynamicQueryResults');
		
	};
})

.controller('AwardsParameters', function($scope, $state, $ionicPopup, AwardsParams, CheckNameInput) {
	//TODO: add check of name param
    $scope.showAwardsResults = function(name) {
		console.log('Sending params for Awards query ');
        CheckNameInput.validateInput(name)
            .then(
                function(response) {
                    if (response == 'OK') {
						
						AwardsParams.setName(name)
						$state.go('app.AwardsResults');
                    }
                },
                function(error) {
                    if (error == 'MISSING') {
                        //don't allow the user search unless he enters all inputs
                        var InputErrorAlert = $ionicPopup.alert({
                            title: 'Input error!',
                            template: 'Missing Input. Please insert valid person\'s name',
                        });
                    } else if (error == 'INVALIDNAME') {
                        var InputErrorAlert = $ionicPopup.alert({
                            title: 'Input error!',
                            template: 'Illegal Input. Please insert a valid person\'s name',
                        });
                    }

                }
            );
        }
})

.controller('DynamicQueryCtrl', function($scope, $http, $state, $timeout, $ionicPopup, ionicMaterialMotion, ionicMaterialInk, DynamicParams) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $scope.loading = true;
    $scope.loadindPersonalInfo = true;
    $scope.failed = false;
    console.log('Show results of Get dynamic query was called');
    $scope.information = [];
    $scope.name = DynamicParams.getName();
    $scope.queryName = DynamicParams.getQuery();
    console.log($scope.name);
    $http({
        method: 'GET',
        url: 'http://132.68.206.107:8080/Queries/Dynamic',
        params: {
            name: DynamicParams.getName(),
            query: DynamicParams.getQuery()
        }
    }).then(function successCallback(response) {
        console.log('Dynamic query success');
        $scope.information = [];
        if (response.data == null) {
            $scope.loading = false;
        } else {
            for (var r in response.data) {
                var info = response.data[r];

                $scope.information.push(info);
                console.log(info);
            }
            $scope.loading = false;
        }

    }, function errorCallback(response) {
        alert('Unable to get data - Person does not exist.')
        $scope.failed = true;
        $state.go('app.InteractiveSearch');
    });

    //Get the personal data of the person:
    if ($scope.failed == false) {
        $http({
            method: 'GET',
            url: 'http://132.68.206.107:8080/Queries/PersonalInformation',
            params: {
                name: DynamicParams.getName()
            }
        }).then(function successCallback(response) {
            console.log('personal data - success');
            $scope.personalInformation = response.data;
            $scope.loadindPersonalInfo = false;
            console.log('url is ' + $scope.personalInformation.photoLink);
            console.log('name is' + name);
            $scope.name = $scope.personalInformation.name;
            console.log('birthPlace is:' + $scope.personalInformation.birthPlace);
            if ($scope.personalInformation.photoLink == "No Photo") {
                $scope.personalInformation.photoLink = "http://www.freeiconspng.com/uploads/profile-icon-9.png";
            }

        }, function errorCallback(response) {
            var FetchErrorAlert = $ionicPopup.alert({
                title: 'Fetch error!',
                template: 'Unable to get Extra personal Information',
            });
            console.log(response.data);
            $scope.loadindPersonalInfo = false;
        });
    }

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('AwardsCtrl', function($scope, $http, $state, $timeout, $ionicPopup, ionicMaterialMotion, ionicMaterialInk, AwardsParams) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $scope.loading = true;
    $scope.loadindPersonalInfo = true;
    $scope.failed = false;
    console.log('Show results of Get Awards was called');
    $scope.information = [];
    $scope.name = AwardsParams.getName();
    console.log($scope.name);
    $http({
        method: 'GET',
        url: 'http://132.68.206.107:8080/Queries/Awards',
        params: {
            name: AwardsParams.getName()
        }
    }).then(function successCallback(response) {
        console.log('awards success');
        $scope.information = [];
        for (var r in response.data) {
            var info = response.data[r];

            $scope.information.push(info);
            console.log(info);
        }
        $scope.loading = false;

    }, function errorCallback(response) {
        var FetchErrorAlert = $ionicPopup.alert({
            title: 'Fetch error!',
            template: 'Unable to get data - Person does not exist',
        });
        console.log(response.data);
        $scope.loading = false;
        $scope.failed = true;
        //$state.go('app.InteractiveSearch');	
    });

    //Get the personal data of the person:
    if ($scope.failed == false) {
        $http({
            method: 'GET',
            url: 'http://132.68.206.107:8080/Queries/PersonalInformation',
            params: {
                name: AwardsParams.getName()
            }
        }).then(function successCallback(response) {
            console.log('personal data - success');
            $scope.personalInformation = response.data;
            $scope.loadindPersonalInfo = false;
            console.log('url is ' + $scope.personalInformation.photoLink);
            console.log('name is' + name);
            $scope.name = $scope.personalInformation.name;
            console.log('birthPlace is:' + $scope.personalInformation.birthPlace);
            if ($scope.personalInformation.photoLink == "No Photo") {
                $scope.personalInformation.photoLink = "http://www.freeiconspng.com/uploads/profile-icon-9.png";
            }

        }, function errorCallback(response) {
            var FetchErrorAlert = $ionicPopup.alert({
                title: 'Fetch error!',
                template: 'Unable to get Extra personal Information',
            });
            console.log(response.data);
            $scope.loadindPersonalInfo = false;
        });
    }

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ArrestsParameters', function($scope, $state, $ionicPopup, ArrestsParams, CheckNameInput) {
	//TODO: add check of name param
    $scope.showArrestsResults = function(name) {
		console.log('Sending params for Arrests query ');
        CheckNameInput.validateInput(name)
            .then(
                function(response) {
                    if (response == 'OK') {
						
						ArrestsParams.setName(name)
            			$state.go('app.ArrestsResults');
                    }
                },
                function(error) {
                    if (error == 'MISSING') {
                        //don't allow the user search unless he enters all inputs
                        var InputErrorAlert = $ionicPopup.alert({
                            title: 'Input error!',
                            template: 'Missing Input. Please insert valid person\'s name',
                        });
                    } else if (error == 'INVALIDNAME') {
                        var InputErrorAlert = $ionicPopup.alert({
                            title: 'Input error!',
                            template: 'Illegal Input. Please insert a valid person\'s name',
                        });
                    }

                }
            );
    };
})




.controller('ArrestsCtrl', function($scope, $http, $state, $timeout, $ionicPopup, ionicMaterialMotion, ionicMaterialInk, ArrestsParams) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $scope.loading = true;
    $scope.loadindPersonalInfo = true;
    $scope.failed = false;
    console.log('Show results of Get Arrests was called');
    $scope.information = [];
    $scope.name = ArrestsParams.getName();
    console.log($scope.name);
    $http({
        method: 'GET',
        url: 'http://132.68.206.107:8080/Queries/Arrests',
        params: {
            name: ArrestsParams.getName()
        }
    }).then(function successCallback(response) {
        console.log('success');
        $scope.information = [];
        for (var r in response.data) {
            var info = response.data[r];

            $scope.information.push(info);
            console.log(info);
        }
        $scope.loading = false;

    }, function errorCallback(response) {

        var FetchErrorAlert = $ionicPopup.alert({
            title: 'Fetch error!',
            template: 'Unable to get data - Person does not exist',
        });
        console.log(response.data);
        $scope.failed = true;
        $state.go('app.InteractiveSearch');
    });

    //Get the personal data of the person:
    if ($scope.failed == false && $scope.loading == false) {
        $http({
            method: 'GET',
            url: 'http://132.68.206.107:8080/Queries/PersonalInformation',
            params: {
                name: ArrestsParams.getName()
            }
        }).then(function successCallback(response) {
            console.log('personal data - success');
            $scope.personalInformation = response.data;
            $scope.loadindPersonalInfo = false;
            console.log('url is ' + $scope.personalInformation.photoLink);
            console.log('name is' + name);
            console.log('birthPlace is:' + $scope.personalInformation.birthPlace);
            if ($scope.personalInformation.photoLink == "No Photo") {
                $scope.personalInformation.photoLink = "http://www.freeiconspng.com/uploads/profile-icon-9.png";
            }

        }, function errorCallback(response) {
            var FetchErrorAlert = $ionicPopup.alert({
                title: 'Fetch error!',
                template: 'Unable to get Extra personal Information',
            });
            console.log(response.data);
            $scope.loadindPersonalInfo = false;
        });
    }

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ActivityCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

})

;