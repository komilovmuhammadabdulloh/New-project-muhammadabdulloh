"use strict";

var app = angular.module('home',['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider

        // route for the Login page
        .when('/', {
            templateUrl : 'pages/login.html',
            controller  : 'index'
        })

        // route for the home page
        .when('/home', {
            templateUrl : 'pages/home.html',
            controller  : 'home'
        })
});
/*---------------------------------------------------------------------------------
    Making service to run ajax
---------------------------------------------------------------------------------*/
app.service('runajax', ['$http', function ($http) {
    this.runajax_function = function(request,callback){
        var url=request.url;
        var data=request.data;
        $http.post(url,data).success(function(data, status, headers, config) {
            callback(data);
        })
        .error(function(err){
            callback(err);
        });
    }
}]);

app.controller('index', function ($scope,$window,runajax) {
    /*---------------------------------------------------------------------------------
    Call to Login
    ---------------------------------------------------------------------------------*/
   $scope.login = function() {
        if (typeof $scope.emailLogin  == "undefined"  || $scope.emailLogin  == "" ) {

            alert(`Enter Login Email`);

        }else if(typeof $scope.passwordLogin == "undefined"  || $scope.passwordLogin  == "" ){ 

            alert(`Enter Login Password`);

        }else{
            var urlData={
                url:'/login',
                data:{
                    email:$scope.emailLogin,
                    password:$scope.passwordLogin
                }
            }
            runajax.runajax_function(urlData,function(userData){
                if(userData.isUserExists){
                    $window.location.href ="/#/home?id="+userData.id;                   
                }else{
                    alert(`Not Done Login Failed`);
                }
            });
        }
    };

    /*---------------------------------------------------------------------------------
        Call to Register
    ---------------------------------------------------------------------------------*/
    $scope.register = function() {
        if (typeof $scope.nameRegister  == "undefined"  || $scope.nameRegister  == "" ) {

            alert(`Enter Register Name`);

        }else if(typeof $scope.emailRegister == "undefined"  || $scope.emailRegister  == "" ){ 

            alert(`Enter Register Email`);

        }else if(typeof $scope.passwordRegister == "undefined"  || $scope.passwordRegister  == "" ){ 

            alert(`Enter Register Password`);

        }else if(typeof $scope.mobileRegister == "undefined"  || $scope.mobileRegister  == "" ){ 

            alert(`Enter Register Mobile `);

        }else{
            var urlData={
                url:'/register',
                data:{
                    name:$scope.nameRegister,
                    email:$scope.emailRegister,
                    password:$scope.passwordRegister,
                    mobile:$scope.mobileRegister
                }
            }
            runajax.runajax_function(urlData,function(userData){
                console.log(userData);
                if(userData.process){
                    if(userData.isUserExists){
                        alert(userData.message);
                    }else{
                        $window.location.href ="/#/home?id="+userData.id;
                    }
                }else{
                    alert(userData.message);
                }                
            });
        }        
    };
});

app.controller('home', function ($scope,$window,$routeParams,runajax) {
    
    $scope.username="";
    $scope.mobile = "";
    $scope.isVerified = "";
    const userId= $routeParams.id;

    /*---------------------------------------------------------------------------------
    Call to getUserInfo ( Getting user's info.)
    ---------------------------------------------------------------------------------*/
    if(typeof $routeParams.id != "undefined"){
        var urlData={
            url:'/getUserInfo',
            data:{
                id : userId
            }
        };
        runajax.runajax_function(urlData,function(userData){        
            if(userData.process == "failed"){

                $window.location.href ="/#/";                
            }else{

                userData=userData.data;
                $scope.username = userData.username;
                $scope.mobile = userData.mobile;
                $scope.isVerified = userData.isVerified;
                if( userData.isVerified == false){
                    document.querySelector( '#sendOtpSection' ).style.display="block";
                }
            }
        });
    }


    /*---------------------------------------------------------------------------------
    Call to sendOTP ( To send OTP.)
    ---------------------------------------------------------------------------------*/   
    $scope.sendOTP = function() {
        var urlData = {            
            url:'/sendOtp',
            data:{
                id : userId
            }
        };
        runajax.runajax_function(urlData,function(result){
            if(result.otpCreated === true){
                document.querySelector( '#sendOtpSection' ).style.display="none";
                document.querySelector( '#verifyOtpSection' ).style.display="block";
            }
            alert(result.message);
        });
    };

    /*---------------------------------------------------------------------------------
    Call to verifyOTP ( To verify OTP.)
    ---------------------------------------------------------------------------------*/
    $scope.verifyOTP = function() {

        if(typeof $scope.enteredOtp  == "undefined"  || $scope.enteredOtp  == ""){

            alert(`Enter OTP`);
        }else{
            var urlData = {            
                url:'/verifyOtp',
                data:{
                    otp : $scope.enteredOtp,
                    id : userId
                }
            };
            runajax.runajax_function(urlData,function(result){
                if(result.isVerified === true){
                    $scope.isVerified = true;
                    document.querySelector( '#sendOtpSection' ).style.display="none";
                    document.querySelector( '#verifyOtpSection' ).style.display="none";
                }else{
                    document.querySelector( '#verifyOtpSection' ).style.display="none";
                    document.querySelector( '#sendOtpSection' ).style.display="block";                    
                }
                alert(result.message);
            });
        }
    };

     /*---------------------------------------------------------------------------------
    Call to logout ( To logout user.)
    ---------------------------------------------------------------------------------*/
    $scope.logout = function(){
        var urlData = {
            url:'/logout',
            data:{
                id : userId
            }
        };
        runajax.runajax_function(urlData,function(result){
            $window.location.href ="/#/";
        });
    }
});