(function() {
	var app = angular.module('myApp', [ 'ui.router' ]);

	app.run(function($rootScope, $location, $state, LoginService) {
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams,
				fromState, fromParams) {
		});
		if (LoginService.Authenticated() == false) {
			$state.transitionTo('login');
		}
	});

	app.config([ '$stateProvider','$urlRouterProvider',
			function($stateProvider, $urlRouterProvider) {
				$urlRouterProvider.otherwise('/login');

				$stateProvider.state('login', {
					url : '/login',
					templateUrl : 'login.html',
					controller : 'LoginController'
				}).state('stock', {
					url : '/stock',
					templateUrl : 'stock.html',
					controller : 'StockController'
				});
			} ]);

	app.controller('LoginController', function($scope, $rootScope,
			$stateParams, $state, LoginService) {
		$rootScope.title = "Login";

		$scope.formSubmit = function() {
			if (LoginService.login($scope.username, $scope.password)) {
				$scope.error = '';
				$scope.username = '';
				$scope.password = '';
				$state.transitionTo('stock');
			} else {
				$scope.error = "Incorrect username/password !";
			}
		};

	});

	app.controller('StockController', function($scope, $rootScope,
			$stateParams, $state, LoginService) {
		$rootScope.title = " Stock Picker ";
		$rootScope.caps = [ "SmallCap", "MiddleCap", "LargeCap" ];
		
		$scope.showStockTable = false;
		$scope.stockList;
		$scope.savedStockList;
		
		//alert(isSuccess)
		//$scope.showStockTable = false;
		// $scope.stockList = stockDetails;
		// $scope.stockList = stockDetails.query.results.quote;
		// var hello;

		// alert(stockDetails);
		// alert(stockDetails.query.results.quote);
		
		$scope.showStockAsPerCap = function() {
			var requestedCap = $scope.selectedCap;
			var stockDetails = LoginService.getStockDetails(requestedCap);
			// $scope.stockList = stockDetails;
			// $scope.stockList = stockDetails.query.results.quote;
			// var hello;

			// alert(stockDetails);
			// alert(stockDetails.query.results.quote);
			if (undefined != stockDetails.query) {
				$scope.stockList = stockDetails.query.results.quote;
				$scope.showStockTable = true;
			}

		};
		$scope.saveStocks = function() {
			console.log('save stock button clicked');
			var isSuccess = LoginService.saveStockData($scope.stockList);
			//alert(isSuccess)
			//$scope.showStockTable = false;
			// $scope.stockList = stockDetails;
			// $scope.stockList = stockDetails.query.results.quote;
			// var hello;

			// alert(stockDetails);
			// alert(stockDetails.query.results.quote);

		};
		
		$scope.getSavedStocks = function() {
			console.log('fetch saved stock button clicked');
			var savedStocks = LoginService.fetchSavedStocks();
			//alert(isSuccess)
			//$scope.showStockTable = false;
			// $scope.stockList = stockDetails;
			// $scope.stockList = stockDetails.query.results.quote;
			// var hello;

			// alert(stockDetails);
			// alert(stockDetails.query.results.quote);
			
			if (undefined != savedStocks.stocks) {
				$scope.savedStockList = savedStocks.stocks;
				//$scope.showStockTable = true;
			}

		};
		

	});

	app.factory('LoginService', function($http) {
		var isAuthenticated = false;
		var stockDetailsAsPerCap = '';
		var myStocks = [];
		var savedStockList = '';
		var userDetails;

		return {
			login : function(username, password) {

				$http({
					method : 'POST',
					url : 'AuthenticationServlet',
					data : {
						user : username,
						pass : password
					}
				}).success(function(data, status, headers, config) {
					console.log("Login Success :"+data);
					userDetails = data;
					isAuthenticated = true;
				}).error(function(data, status, headers, config) {
					console.log("Login failure :"+data);
					isAuthenticated = false;
				});
				return isAuthenticated;
			},
			Authenticated : function() {
				console.log('value:' + isAuthenticated);
				return isAuthenticated;
			},
			getStockDetails : function(requestedCap) {
				$http({
					method : 'GET',
					url : 'RecommendedStockServlet?selectedCap='+requestedCap
				}).success(function(data, status, headers, config) {
					console.log("success at stock details:" + data);
					stockDetailsAsPerCap = data;
				}).error(function(data, status, headers, config) {
					console.log("failure at stock details:" + data);
					stockDetailsAsPerCap = data;
				});
				return stockDetailsAsPerCap;
			},
			saveStockData : function(totalStocks) {
				console.log('saveStockData service call is being made here');
				
				var selectedData = "";
				var selectedDataArr = [];
				for (i=0; i<totalStocks.length; i++) {
					if (totalStocks[i].selected == true) {
						//$scope.stockList[i].selected = false;
						quantity = document.getElementById("quantityField" + i).value;
						//document.getElementById("quantityField" + i).value = "";
						selectedData = selectedData + {stockName:totalStocks[i].Name, stockSymbol:totalStocks[i].symbol, stockPrice:totalStocks[i].Ask, stockQuantity:quantity} + ",";
						selectedDataArr.push({stockName:totalStocks[i].Name, stockSymbol:totalStocks[i].symbol, stockPrice:totalStocks[i].Ask, stockQuantity:quantity});
					}
				}
				console.log('selectedData:'+selectedData);
				console.log('selectedDataArr:'+selectedDataArr);
				$http({
					method : 'POST',
					url : 'SaveStockServlet',
					data : {
						selectedStocks : selectedDataArr
					}
				}).success(function(data, status, headers, config) {
					console.log("success at stock details:" + data);
					stockDetailsAsPerCap = data;
				}).error(function(data, status, headers, config) {
					console.log("failure at stock details:" + data);
					stockDetailsAsPerCap = data;
				});
				return stockDetailsAsPerCap;
				
			},
			fetchSavedStocks : function() {
				console.log('inside fetchSavedStocks1');
				$http({
					method : 'GET',
					url : 'FetchSavedStockServlet?userId=1'
				}).success(function(data, status, headers, config) {
					console.log("success at fetchSavedStocks:" + data);
					savedStockList = data;
				}).error(function(data, status, headers, config) {
					console.log("failure at fetchSavedStocks:" + data);
					savedStockList = data;
				});
				return savedStockList;
			}
				};

			});

})();