(function() {
  angular.module('piperka', ['ionic', 'piperka.services', 'piperka.controllers']).config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    }).state('tab.updates', {
      url: '/updates',
      views: {
        'updates-tab': {
          templateUrl: 'templates/updates.html',
          controller: 'UpdatesCtrl'
        }
      }
    }).state('tab.login', {
      url: '/login',
      views: {
        'login-tab': {
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
        }
      }
    });
    return $urlRouterProvider.otherwise('/tab/updates');
  });

}).call(this);
