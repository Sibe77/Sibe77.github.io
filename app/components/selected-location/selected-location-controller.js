angular.module('app')
.controller('selectedLocationController', ['$scope','$http','$stateParams', 'configurationService', 'fieldbookService', 'searchBarService','$state', function($scope, $http, $stateParams, configurationService, fieldbookService, searchBarService, $state) {
	$scope.location = $stateParams.ubicacion;
	$scope.locationInfo;
	$scope.fieldBookData = {};

	function init () {
		var getLocationInfo = function (location) {
			$scope.locationInfo = location;
			if (location.sugerencias != null) {
				location.sugerencias = location.sugerencias.split(',');
			}
		};

		fieldbookService.getRegions(function(data){
			for (reg in data) {
				if (data[reg].nombre === $scope.location) {
					getLocationInfo(data[reg]);
					fieldbookService.getAllData(data[reg], function(data){
						$scope.fieldBookData = data;
						$scope.dataUtilities = generateUtilities(data);
						$scope.loadComplete = true;
					});
				}
			}
		});
	};

	$scope.isMobile = (window.innerWidth <= 600 || window.innerHeight <= 500) ? true : false;
	$scope.loadComplete = false;
	$scope.clientsShown;
	$scope.noResults;

	// Footer
	$scope.showProducts = false;
	$scope.showStores = false;

	$scope.callPerformed = function(clientName) {
		if (configurationService.general.appType === 'mobile') {
			ga_storage._trackEvent('Llamadas', clientName.toLowerCase(), $scope.searchText.toLowerCase());
		}
	}

	$scope.locationConsulted = function(clientName) {
		if (configurationService.general.appType === 'mobile') {
			ga_storage._trackEvent('Ubicaciones', clientName.toLowerCase(), $scope.searchText.toLowerCase());
		}
	}

	$scope.logoPressed = function () {
		document.getElementById('searchterm').focus();
	}

	$scope.search = function(searchedText, callingFromSuggestions) {
		var contenido = document.getElementById('content');
		contenido.scrollTop = 0;

		document.getElementById('searchterm').blur();
		$scope.clientsShown = searchBarService.getMatches($scope.fieldBookData, searchedText, callingFromSuggestions);
		$scope.noResults = searchBarService.noResults($scope.clientsShown);

		var navBar = document.getElementById("searchBox");
		var searchBox = document.getElementById("searchterm");
		navBar.style.display = "none";
		navBar.className = "nav-up";

		$scope.searchText = searchedText;
		$scope.currentSearch = searchedText;

		if ($scope.noResults) {
			if (configurationService.general.appType === 'web') {
				ga('send', 'pageview', 'search?searchText=' + searchedText.toLowerCase() + ' (Not Found)');
			} else if (configurationService.general.appType === 'mobile') {
				ga_storage._trackPageview('mobileSearch?searchText=' + searchedText.toLowerCase() + ' (Not Found)', 'No Results Mobile Search');
			}
			$state.go('selectedLocation.sinResultados');
		} else {
			if (configurationService.general.appType === 'web') {
				ga('send', 'pageview', 'search?searchText=' + searchedText.toLowerCase());
			} else if (configurationService.general.appType === 'mobile') {
				ga_storage._trackPageview('mobileSearch?searchText=' + searchedText.toLowerCase(), 'Mobile Search');
			}
			$state.go('selectedLocation.resultados');
		}
		if (configurationService.general.appType === 'mobile') {
			ga_storage._trackEvent('Busquedas', $scope.noResults ? 'Sin resultados' : 'Exitosas', searchedText.toLowerCase());
		}
	}

	var generateUtilities = function(inputData) {
		outputData = {};
		outputData.productos = {};
		outputData.clientes = {};

		outputData.productos.listaDeCategoriasSinRepetir = [];
		outputData.productos.categoriasConArticulos = [];

		for (var numero in inputData.allProducts) {
			var categoria = inputData.allProducts[numero].categoria[0].nombre;
			var articulo = inputData.allProducts[numero].producto;

			categoriaModificada = categoria.toLowerCase().trim().replace(new RegExp(/[àáâãäå]/g),"a").replace(new RegExp(/[èéêë]/g),"e").replace(new RegExp(/[ìíîï]/g),"i").replace(new RegExp(/[òóôõö]/g),"o").replace(new RegExp(/[ùúûü]/g),"u");
			categoriaModificada = categoriaModificada.charAt(0).toUpperCase() + categoriaModificada.slice(1);

			var posicion = outputData.productos.listaDeCategoriasSinRepetir.indexOf(categoriaModificada);
			if (posicion == -1)
			{
				outputData.productos.listaDeCategoriasSinRepetir.push(categoriaModificada);
				outputData.productos.categoriasConArticulos.push({nombre:categoriaModificada,articulos:[articulo]});
			} else {
				articuloModificado = articulo.toLowerCase().trim().replace(new RegExp(/[àáâãäå]/g),"a").replace(new RegExp(/[èéêë]/g),"e").replace(new RegExp(/[ìíîï]/g),"i").replace(new RegExp(/[òóôõö]/g),"o").replace(new RegExp(/[ùúûü]/g),"u");
				articuloModificado = articuloModificado.charAt(0).toUpperCase() + articuloModificado.slice(1);
				outputData.productos.categoriasConArticulos[posicion].articulos.push(articuloModificado);
			}
		}

		outputData.clientes.listaDeCategoriasSinRepetir = [];
		outputData.clientes.categoriasConArticulos = [];

		for (var numero in inputData.allClients) {
			inputData.allClients[numero].categoria = inputData.allClients[numero].categoria || 'Otros';
			var categoria = inputData.allClients[numero].categoria;
			var cliente = inputData.allClients[numero].cliente;

			categoriaModificada = categoria.toLowerCase().trim().replace(new RegExp(/[àáâãäå]/g),"a").replace(new RegExp(/[èéêë]/g),"e").replace(new RegExp(/[ìíîï]/g),"i").replace(new RegExp(/[òóôõö]/g),"o").replace(new RegExp(/[ùúûü]/g),"u");
			categoriaModificada = categoriaModificada.charAt(0).toUpperCase() + categoriaModificada.slice(1);

			var posicion = outputData.clientes.listaDeCategoriasSinRepetir.indexOf(categoriaModificada);
			if (posicion == -1)
			{
				outputData.clientes.listaDeCategoriasSinRepetir.push(categoriaModificada);
				outputData.clientes.categoriasConArticulos.push({nombre:categoriaModificada,articulos:[cliente]});
			} else {
				outputData.clientes.categoriasConArticulos[posicion].articulos.push(cliente);
			}
		}

		console.log(inputData);
		console.log(outputData);

		return outputData;
	};

	init();
}]);