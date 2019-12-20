angular.module('app')
.controller('resultsController',['$scope', function($scope) {
	$scope.localShown;

	var getLocalSolo = function() {

		var cantidadDeLocales = 0;
		var local = [];

		if ($scope.clientsShown != undefined) {

			if ($scope.clientsShown.open != undefined)
			{
				cantidadDeLocales += $scope.clientsShown.open.length;
				if ($scope.clientsShown.open[0] != undefined) {
					local.push($scope.clientsShown.open[0])
				}
			}
			
			if ($scope.clientsShown.openLater != undefined)
			{
				cantidadDeLocales += $scope.clientsShown.openLater.length;

				if ($scope.clientsShown.openLater[0] != undefined) {
					local.push($scope.clientsShown.openLater[0])
				}
			}
			
			if ($scope.clientsShown.closed != undefined)
			{
				cantidadDeLocales += $scope.clientsShown.closed.length;

				if ($scope.clientsShown.closed[0] != undefined) {
					local.push($scope.clientsShown.closed[0]);
				}
			}

			if (cantidadDeLocales == 1) {
				return local[0].client;
			} else {
				return false;
			}

		}
	}

	$scope.updateResultsData = function() {
		$scope.localShown = getLocalSolo();
	}

	$scope.updateResultsData();

}]);