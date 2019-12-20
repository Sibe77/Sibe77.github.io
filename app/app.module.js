angular.module('app',['ionic','ui.router'])
.run(function($ionicPlatform, $state) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  // Back button behavior
  $ionicPlatform.registerBackButtonAction(function(event) {
    if ($state.current.name === 'selectedLocation.home') {
		ionic.Platform.exitApp();
	} else if ($state.current.name !== 'selectedLocation.products' && $state.current.name !== 'selectedLocation.stores') {
		$state.go('selectedLocation.home');
	}
  }, 100);
})
.config(["configurationServiceProvider",function(configurationServiceProvider){
	var config = {
		'general' : {
			'appType' : 'mobile'
		},
		'searchBarService' : {
			'productsRelated' : [
				//Used to retrieve results even if the user mispell the product name	
				['lomo','lomito'],
				['whiskey', 'whiski', 'wisky', 'whisky', 'wiskey', 'wiski'],
				['sandwich','sanguche','sanguich', 'baguette'],
				['cerveza', 'birra', 'cervesa'],
				['pizza', 'piza', 'pisa'],
				['muzzarella', 'muzarella', 'musarella', 'musarela']
			],
			'suggestionsRelated' : [
				// For suggestions
				['cafeteria','cafe','te','desayuno','merienda','mate cocido','submarino','coffee'],
				['carnes','bife','cordero','milanesa','bondiola','cabrito','entrecot'],
				['pescados','mariscos','salmon'],
				['postres','tortas'],
				['gastronomia internacional','chow','chop','mexicana:','mexicana','peru:','orientales','arabe']
			],
			'articles' : ["de","la","que","el","en","y","a","los","del","las","con"]
		},
		'fieldbookService' : {
			'locationsUrl' : "https://api.fieldbook.com/v1/5a3cef32657cf103002038a0/"
		}
	};

	configurationServiceProvider.config(config);
}])
.provider("configurationService",[function() {
	var configurations = {};
	this.config = function(data){
		configurations = data;
	};

	this.$get = function(){
		return configurations;
	}
}]);