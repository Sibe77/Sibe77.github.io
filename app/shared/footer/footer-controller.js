angular.module('app')
.directive("footer", function(){
	return {
		templateUrl:'app/shared/footer/footer-view.html',
		controller:'footerController'
	}
})
.controller('footerController',['$scope','$log','$state', function($scope, $log, $state) {
	$scope.stateToReturnOnClose = '';

	var hideInterface = function() {
		var navBar = document.getElementById("searchBox");
		navBar.style.display = "none";
		navBar.className = "nav-up";
		$scope.showStores = false;
		$scope.showProducts = false;
	}

	$scope.goHome = function() {
		hideInterface();
		$state.go('selectedLocation.home');
	}

	$scope.close = function() {
		hideInterface();
		$state.go($scope.stateToReturnOnClose);
	};

	$scope.select = function(selection) {
		if (selection === 'sugerencias') {
			$scope.showStores = false;
			$scope.showProducts = !$scope.showProducts;
		}
		else if (selection === 'locales') {
			$scope.showProducts = false;
			$scope.showStores = !$scope.showStores;
		}
		else {
			$log.warn('Invalid parameter for "select" function');
		}

		//Navigation
		var contenido = document.getElementById('content');
		contenido.scrollTop = 0;

		var navBar = document.getElementById("searchBox");
		var navBarTextToReturnOnClose = document.getElementsByClassName("field")[0].value;
		document.getElementsByClassName("field")[0].value = '';
		$scope.searchText = '';

		if ($state.current.name !== 'selectedLocation.stores' && $state.current.name !== 'selectedLocation.products') {
			$scope.stateToReturnOnClose = $state.current.name;
			var navBar = document.getElementById("searchBox");
			navBar.style.display = "none";
		}

		if ($scope.showStores) {
			$state.go('selectedLocation.stores');
			navBar.className = "nav-down";
			navBar.style.display = "flex";
		}
		else if ($scope.showProducts) {
			$state.go('selectedLocation.products');
			navBar.className = "nav-down";
			navBar.style.display = "flex";
		}
		else {

		}
	};

	$scope.doSearch = function(keywords, suggestionSearched) {
		suggestionSearched = suggestionSearched || true;
		$scope.showProducts = false;
		$scope.showStores = false;
		$scope.searchText = keywords;
		// Regex above is used to remove lead and trail whitespaces
		keywords = keywords.replace(/^[ ]+|[ ]+$/g,'');
		$scope.search(keywords, suggestionSearched);
		var navBar = document.getElementById("searchBox");
		navBar.style.display = "none";
	};

	/*
		$ionicPlatform.registerBackButtonAction(function(event) {
			if ($state.current.name === 'selectedLocation.products' || $state.current.name === 'selectedLocation.stores') {
				$scope.close();
			}
			if ($state.current.name === 'selectedLocation.home') {
				ionic.Platform.exitApp();
			} else if ($state.current.name !== 'selectedLocation.products' && $state.current.name !== 'selectedLocation.stores') {
				$state.go('selectedLocation.home');
			}
		}, 100);
	*/

	// Estas 3 lineas de codigo sirven para que la barra de busquedas se muestre (por alguna razon aparece oculta) cuando mostramos la busqueda como primera pantalla y no la home
	var navBar = document.getElementById("searchBox");
	navBar.className = "nav-down";
	navBar.style.display = "flex";

}]);