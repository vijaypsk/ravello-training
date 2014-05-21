
'use strict';

angular.module('trng.login').factory('LoginModel', [
    '$state',
    '$cookieStore',
    'StatesNames',
    'LoginService',
    function($state, $cookieStore, StatesNames, LoginService) {
        var model = {
            user: null,

            login: function(username, password) {
                return LoginService.login(username, password).then(function(result) {
                    if (result.role) {
                        model.user = result;

                        $cookieStore.put('userAuthData', {username: username, password: password});

                        if (result.role === 'STUDENT') {
                            $state.go(StatesNames.student.studentClass.appsList.name);
                        } else if (result.role === 'TRAINER') {
                            $state.go(StatesNames.trainer.name);
                        } else if (result.role === 'ADMIN') {
                            $state.go(StatesNames.admin.name);
                        } else {
                            alert("User cannot be found, make sure you enter the correct username/password");
                        }
                    } else {
                        alert("User cannot be found, make sure you enter the correct username/password");
                    }
                });
            }
        };

        return model;
    }
]);
