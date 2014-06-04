 angular.module('app', ['ngRoute','firebase'])
.directive( "highcharts", function() {
    return function (scope, element, attr) {
      element.highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: scope.addup.name,
            },
            subtitle: {
                text: 'Source: addup'
            },
            xAxis: {
                categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Population (millions)',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                valueSuffix: ' millions'
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -40,
                y: 100,
                floating: true,
                borderWidth: 1,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor || '#FFFFFF'),
                shadow: true
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Year 1800',
                data: [107, 31, 635, 203, 2]
            }, {
                name: 'Year 1900',
                data: [133, 156, 947, 408, 6]
            }, {
                name: 'Year 2008',
                data: [973, 914, 4054, 732, 34]
            }]
        });
    }
})
.controller('Addup', ['$route','$document','$location','$scope', '$firebase',
function($route,$document, $location,$scope, $firebase) {
  $scope.isOpen = false;
  $scope.changeIsOpen = function(){
    $scope.isOpen = $scope.isOpen?false:true;
  }
  $scope.showChart = false;
  $scope.changeShowChart = function(){
    $scope.showChart = $scope.showChart?false:true;
  }
  

  var baseURI = 'https://addup.firebaseio.com/';
  var ref = new Firebase(baseURI);
  $scope.addups = $firebase(ref.limit(15));
  // var addupName = $routeParams.addupName;
  var lastRoute = $route.current;
  var addupkey = "";
  $scope.$on('$locationChangeSuccess', function(event) {
      var path = $location.path(); 
      addupkey= path.replace("/","");
      $scope.isOpen = addupkey?false:true;
      $scope.addup = addupkey?$scope.addups.$child(addupkey):null;
  });

  $scope.addAddup = function(name) {
    $scope.addups.$add({name:name});
    $scope.addupForm.name=''
  }
  $scope.addCategory = function(name) {
    $scope.addup.$add({name:name});
    $scope.categoryForm.name=''
  }
  $scope.add1=function(categoryKey){
    var countURI = baseURI+addupkey+"/"+categoryKey+"/count";
    var countRef = new Firebase(countURI);
    countRef.transaction(function(current_value) {
      if(!current_value){
        current_value = 0;
      }
      return current_value + 1;
    });
  }
}]);