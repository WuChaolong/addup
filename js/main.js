 angular.module('app', ['ngRoute','firebase'])
.directive( "highcharts", function() {
    return function (scope, element, attr) {
      function load(){
        var addup = scope.addup;
        var names = [];
        var data = [];
         for(var key in addup){
            var name = addup[key].name;
            if(!name){
              continue;
            }
            if(name.length>20){
              name = name.slice(0,19)+"…";
            }
            names.push(name);
            var y = addup[key].count;
            var o = {
              name:name,
              y:y?y:null
            }
            data.push(o);
         }
         var height = 400+names.length*10;
         element.height(height>400?height:400);


        element.highcharts({
              chart: {
                  type: 'bar'
              },
              title: {
                  text: addup.name,
              },
              xAxis: {
                  categories: names
              },
              tooltip: {
                  formatter: function() {
                      return '<b>'+ this.series.name +'</b><br/>'+
                          this.x +': '+ this.y;
                  }
              },
              legend: {
                  layout: 'vertical',
                  floating: true,
                  backgroundColor: '#FFFFFF',
                  align: 'right',
                  verticalAlign: 'top',
                  y: 60,
                  x: -60
              },
              series: [{
                  data: data
              }]
          });
      }
      scope.$watch("addup.name",function(){
        load();
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