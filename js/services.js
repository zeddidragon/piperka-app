(function() {
  angular.module('piperka.services', []).factory('UpdateService', [
    '$http', '$q', 'LoginService', function($http, $q, LoginService) {
      return {
        all: function(login) {
          var token, username, _ref;
          _ref = LoginService.get(), username = _ref[0], token = _ref[1];
          return $http.get("https://piperka.net/s/uprefs?token=" + token).then(function(response) {
            var comic, currentPage, id, offset, remainingPages, totalPages, updates;
            if (response.data.subscriptions) {
              updates = (function() {
                var _i, _len, _ref1, _results;
                _ref1 = response.data.subscriptions;
                _results = [];
                for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                  comic = _ref1[_i];
                  id = comic[0], currentPage = comic[1], totalPages = comic[2], offset = comic[3], remainingPages = comic[4];
                  _results.push({
                    id: id,
                    count: remainingPages
                  });
                }
                return _results;
              })();
              return updates;
            } else {
              return null;
            }
          });
        },
        cache: function(updates) {
          return localStorage.setItem('updates', angular.toJson(updates));
        },
        cached: function() {
          var updates;
          updates = localStorage.getItem('updates');
          return updates && angular.fromJson(updates);
        },
        location: function(comic) {
          var token, username, _ref;
          _ref = LoginService.get(), username = _ref[0], token = _ref[1];
          return "https://piperka.net/updates.html?redir=" + comic.id + "&csrf_ham=" + token;
        },
        titles: function() {
          return $http.get('https://piperka.net/d/comictitles').then(function(response) {
            localStorage.setItem('titles', angular.fromJson(response.data));
            return response.data;
          });
        },
        cachedTitles: function() {
          var titles;
          titles = localStorage.getItem('titles');
          return titles && angular.toJson(titles);
        },
        mergeTitles: function(updates, titles) {
          var update, _i, _len;
          if (!(updates && titles)) {
            return null;
          }
          for (_i = 0, _len = updates.length; _i < _len; _i++) {
            update = updates[_i];
            if (titles[update.id]) {
              update.title = titles[update.id];
            } else {
              return null;
            }
          }
          return updates;
        }
      };
    }
  ]).factory('LoginService', [
    '$http', function($http) {
      return {
        get: function() {
          return [localStorage.getItem('username'), localStorage.getItem('token')];
        },
        login: function(login) {
          return $http.post("https://piperka.net/s/login?user=" + login.username + "&passwd=" + login.password).success(function(data) {
            var name, token;
            token = data.csrf_ham;
            name = data.name;
            localStorage.setItem('token', token);
            localStorage.setItem('username', name);
            return data;
          });
        }
      };
    }
  ]);

}).call(this);
