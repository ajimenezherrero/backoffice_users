var app = angular.module('Examen',['ngDialog', 'ui.bootstrap']);

app.controller('headerController', function($scope, ngDialog){
    $scope.clickToOpenSignUp = function () {
        ngDialog.open({
            template: 'addUser'
        });
    };
});

app.controller('userController', ['$http', '$scope', 'ngDialog', 'filterFilter', function ($http, $scope, ngDialog,filterFilter){
    var Examen = this;
    var user = {};
    Examen.users = [];
    $scope.search = {};



    $http.get('http://localhost:3000/user').success(function (data) {
        Examen.users = data;
        console.log(Examen.users);
        $scope.currentPage = 1;
        $scope.totalItems = Examen.users.length;
        console.log($scope.totalItems);
        $scope.entryLimit = 3;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
    }).error(function(data) {
        window.alert("ERROR - Fallo al realizar el GET");
    });

    // pagination controls


    this.addUser = function(){
        Examen.users.push(this.user);
        $http({
            method: 'POST',
            url: "http://localhost:3000/user",
            data: this.user,
            headers: {'Content-Type': 'application/json'}
        }).success(function(data) {
            window.alert("Se ha realizado el POST");
        }).error(function(data) {
            window.alert("ERROR - Fallo al realizar el POST");
        });
        this.user = {};
    };

    this.updateUser = function(username, name, surname, email){
        user.Username = username;
        user.Name = name;
        user.Surname = surname;
        user.Email = email;
        var url = 'http://localhost:3000/user/'+username;
        console.log(url);
        $http({
            method: 'PUT',
            url: url,
            data: user,
            headers: {'Content-Type': 'application/json'}
        }).success(function(data) {
            console.log("put");
            window.alert(data);
        }).error(function(data) {
            window.alert("ERROR - Fallo al realizar el POST");
        });
        this.user = {};
    };

    $scope.clickToView = function (data) {
        window.alert("Se vera " + data);
        var url = 'http://localhost:3000/user/'+data;
        $http.get(url).success(function (data) {
        }).error(function(data) {
            window.alert("ERROR - Fallo al realizar el GET");
        });
        ngDialog.open({
            template: 'updateUser',
            scope: $scope
        });
        $scope.Username = this.user.Username;
        $scope.Name = this.user.Name;
        $scope.Surname = this.user.Surname;
        $scope.Email = this.user.Email;

    };

    $scope.clickToDelete = function (data) {
        window.alert("Se borrara " + data);
        var url = 'http://localhost:3000/user/'+data;
        $http.delete(url).success(function (data) {
            window.alert(data);
        }).error(function(data) {
            window.alert("ERROR - Fallo al realizar el DELETE");
        });
    };

    $scope.resetFilters = function () {
        $scope.search = {};
    };

    // $watch search to update pagination
    $scope.$watch('search', function (newVal, oldVal) {
        $scope.filtered = filterFilter(Examen.users, newVal);
        $scope.totalItems = $scope.filtered.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
        $scope.currentPage = 1;
    }, true);
}]);

app.config(['ngDialogProvider', function (ngDialogProvider) {
    ngDialogProvider.setDefaults({
        className: 'ngdialog-theme-default',
        plain: false,
        showClose: true,
        closeByDocument: true,
        closeByEscape: true,
        appendTo: false,
        preCloseCallback: function () {
            console.log('default pre-close callback');
        }
    });
}]);

app.controller('footerController', function($scope){});

app.filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
});

