(function() {
  angular.module("piperka.controllers", []).controller("UpdatesCtrl", [
    '$scope', '$rootScope', '$timeout', '$location', '$ionicScrollDelegate', 'UpdateService', function($scope, $rootScope, $timeout, $location, $ionicScrollDelegate, UpdateService) {
      $scope.search = {};
      $scope.$watch('search.title', function() {
        return $ionicScrollDelegate.scrollTop(true);
      });
      $scope.abort = function() {
        $rootScope.isLoading = false;
        return null;
      };
      $scope.refreshUpdates = function() {
        $rootScope.isLoading = true;
        $scope.updates = UpdateService.cached();
        return UpdateService.all().then(function(updates) {
          var titledUpdates, titles;
          if (!updates) {
            $scope.failed = true;
            return $scope.abort();
          }
          if (updates.length === 0) {
            $scope.noUpdates = true;
            return $scope.abort();
          }
          titles = UpdateService.cachedTitles();
          titledUpdates = UpdateService.mergeTitles(updates, titles);
          if (titledUpdates) {
            $scope.setUpdates(titledUpdates);
            return $scope.abort();
          } else {
            $rootScope.isLoading = true;
            return UpdateService.titles().then(function(titles) {
              titledUpdates = UpdateService.mergeTitles(updates, titles);
              $scope.setUpdates(titledUpdates);
              return $scope.abort();
            });
          }
        });
      };
      $scope.setUpdates = function(updates) {
        $scope.updates = updates;
        return UpdateService.cache(updates);
      };
      $scope.refreshUpdates();
      $scope.redirectTo = function(update) {
        var u;
        $scope.url = UpdateService.location(update);
        $scope.updates = (function() {
          var _i, _len, _ref, _results;
          _ref = $scope.updates;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            u = _ref[_i];
            if (u.id !== update.id) {
              _results.push(u);
            }
          }
          return _results;
        })();
        return $timeout(function() {
          if (navigator.platform === 'android') {
            navigator.app.loadUrl($scope.url, {
              openExternal: true,
              showLocationBar: false
            });
          } else {
            window.open($scope.url, '_system', 'location=no');
          }
          return false;
        });
      };
      return $scope.countFilter = function(update) {
        return update.count > 0;
      };
    }
  ]).controller("LoginCtrl", [
    '$scope', '$rootScope', 'LoginService', function($scope, $rootScope, LoginService) {
      var _ref;
      _ref = LoginService.get(), $scope.name = _ref[0], $scope.token = _ref[1];
      $scope.credentials = {};
      $rootScope.isLoading = false;
      return $scope.login = function() {
        $rootScope.isLoading = true;
        return LoginService.login($scope.credentials).success(function(data) {
          var _ref1;
          $rootScope.isLoading = false;
          if (data.csrf_ham) {
            return _ref1 = [data.name, data.csrf_ham], $scope.name = _ref1[0], $scope.token = _ref1[1], _ref1;
          }
        });
      };
    }
  ]);

}).call(this);
