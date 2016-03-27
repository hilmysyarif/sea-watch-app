angular.module('sw_spotter.controllers', [])

.controller('AppCtrl', function($scope, $controller, $ionicModal, $cordovaGeolocation, $timeout) {
   var watchOptions = {
    timeout : 10000,
    enableHighAccuracy: true // may cause errors if true
  };

  var watch = $cordovaGeolocation.watchPosition(watchOptions);
  watch.then(
    null,
    function(err) {
      // error
    },
    function(position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude
      console.log('position tracked:');
      console.log(position.coords);
      $scope.position = position;
  });

  $controller('VehicleCtrl', {$scope: $scope}); //This works
  
  
  
  $scope.updateVehiclePosition(function(){
  });

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  $scope.position = {};

  $scope.apiURL = 'https://app.sea-watch.org/admin/public/';

  $scope.updatePosition = function(){

  }

  $scope.initModal = function(cb){

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      cb();
    });
  }

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.initModal(function(){


      $scope.modal.show();

    });
  };


  $scope.init = function(){
    if($scope.loginData === {}){
      console.log('not logged in');
      $scope.login();
    }else{
      console.log('logged in');
    }
  };


  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

/*.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})*/


.controller('CasesCtrl',['$scope', 'dataService', function ($scope, dataFactory) {

  $scope.cases;

  //check if cases still need to be loaded
  //so that the request isnt sent several times
  if(typeof $scope.loadCases == 'undefined')
    $scope.loadCases = true;

  console.log('type '+typeof $scope.loadCases);

  $scope.getCases = function(cb) {

        $scope.loadCases = false; 
        dataFactory.getCases()
            .success(function (result) {
                $scope.cases = result.data.emergency_cases;
                console.log($scope.cases);
                if(typeof cb === 'function'){
                  cb();
                }
            })
            .error(function (error) {
              if(error !== null)
                $scope.status = 'Unable to load customer data: ' + error.message;
            });
  };
  if($scope.loadCases){
    console.log('init Loading')
    $scope.getCases();
  }
}]).

controller('CreateCaseCtr',function($scope, $controller, Camera, dataService){


  $scope.createCase = function(){


        $controller('AppCtrl', {$scope: $scope});
        console.log('');
        $scope.case = {};
        //add source type to scope
        $scope.case.source_type = 'spotter_app';
        $scope.case.location_data = {accuracy:$scope.position.coords.accuracy,altitude:$scope.position.coords.altitude,latitude:$scope.position.coords.latitude, longitude:$scope.position.coords.longitude};
        dataService.createCase({params:$scope.case})
            .success(function (result) {

                //push result
                console.log(result);
                if(typeof cb === 'function'){
                  cb();
                }
            })
            .error(function (error) {
              if(error !== null)
                $scope.status = 'Unable to load customer data: ' + error.message;
            });

          console.log($scope.case);
  }
})

.controller('CaseCtrl', function($scope, $stateParams,$controller, Camera, dataService) {

  $controller('CasesCtrl', {$scope: $scope});


  $scope.getlastLocation = function(case_id){

    var case_data = {};
    angular.forEach($scope.cases, function(case_values, key) {
      if(case_values.id == case_id){
        case_data = case_values;
      }
    });
    return case_data.locations[case_data.locations.length-1];
  };



  //there must be a better way...
  if(typeof $stateParams.caseId !== 'undefined')
    var case_id = $stateParams.caseId;
  else
    var case_id = 4;


      //$scope.cases[case_id].lastLocation = $scope.getlastLocation(case_id);
      angular.forEach($scope.cases, function(case_values, key) {
        if(case_values.id == case_id){
           $scope.case = case_values;
        }
      });
      $scope.case.lastLocation = $scope.getlastLocation(case_id+1);








  $scope.takePicture = function() {

    console.log('asdasdasd');

    Camera.getPicture().then(function(imageURI) {
      console.log(imageURI);
    }, function(err) {
      console.err(err);
    });
  }

  $scope.createCase = function(){

        //add source type to scope
        $scope.case.source_type = 'spotter_app';
        $scope.case.location_data = {accuracy:$scope.position.coords.accuracy,altitude:$scope.position.coords.altitude,latitude:$scope.position.coords.latitude, longitude:$scope.position.coords.longitude};
        dataService.createCase({params:$scope.case})
            .success(function (result) {

                //push result
                console.log(result);
                if(typeof cb === 'function'){
                  cb();
                }
            })
            .error(function (error) {
              if(error !== null)
                $scope.status = 'Unable to load customer data: ' + error.message;
            });

    console.log($scope.case);
  }
});
//if I do this code the app is not working anymore...

/*.controller('TrackLoc', function($scope, $stateParams,$controller) {

  $controller('TrackLoc', {$scope: $scope});


  $scope.bound = function(track_id){

    //I know that track_id === IsChecked is wrong, but I dont know what else I can equal it to
      if(track_id === IsChecked) {
        return true; 
      }
      else {
          return false; 
      }
    });*/
   


