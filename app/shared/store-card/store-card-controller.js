angular.module('app')
.directive("storeCard", function(){
	return {
		templateUrl:'app/shared/store-card/store-card-view.html',
		controller:'storeCardController'
	}
})
.controller('storeCardController', ['$scope','$sce', function($scope,$sce){
	$scope.doSearch = function(keywords) {
		// Regex above is used lead and trail whitespaces
		keywords = keywords.replace(/^[ ]+|[ ]+$/g,'');
		$scope.search(keywords);
	};
	$scope.showProducts = [];

	$scope.obtenerUrlMaps = function(cliente, location) {
		var url = "https://www.google.com/maps/embed/v1/search?q="+cliente.direccion+",%20"+location+"&key=AIzaSyDGf_4ig29aL62lTzp-TNIqw0mGZb_GPrc";
		return $sce.trustAsResourceUrl(url);
	};
}]);