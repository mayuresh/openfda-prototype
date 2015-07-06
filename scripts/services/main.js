angular.module('app',['openFDASvc','StateMap'])
	.controller('mainCtrl', function($scope, FoodEnforcement, StateMapData){
		console.log(FoodEnforcement.FIELDS);
		$scope.fields = FoodEnforcement.FIELDS;
		$scope.criteria = '';
		$scope.reload = function() {
			var searchTerm = {};
			if ($scope.criteria) {
				searchTerm = {reason_for_recall:$scope.criteria};
			}
			FoodEnforcement.search(searchTerm, FoodEnforcement.FIELDS.state)
				.then(function(data, status){
					// console.log(data);
					var results = {};
					var totalCount = 0;
					var maxData = Number.MIN_VALUE;
					var minData = Number.MAX_VALUE;
					for (index in data.data.results) {
						var entry = data.data.results[index];
						totalCount += entry.count;
						if (maxData === -1) {
							maxData = entry.count;
						}
						maxData = Math.max(maxData, entry.count);
						minData = Math.min(minData, entry.count);
						results[entry.term.toUpperCase()] = entry.count;
					}
					console.log(totalCount, maxData, minData);
					drawStates(results,totalCount, maxData, minData);
				});
		}
		var drawStates = function(data, totalCount, maxData, minData) {

			var states = StateMapData;
			var diff = maxData - minData;
			var ratio = 255/ diff;
			// console.log(data);
			var rootElement = angular.element(document.querySelector('#usstates'));
			rootElement.empty();
			for (s in states) {
				var state = states[s];
				var g = angular.element(document.createElementNS('http://www.w3.org/2000/svg','g'));
				g.attr('id',state.id);
				var title = angular.element(document.createElementNS('http://www.w3.org/2000/svg','title')); 
				var path = angular.element(document.createElementNS('http://www.w3.org/2000/svg','path'));
				path.attr('d', state.d);
				path.attr('class', 'state');
				var dataPoint = data[state.id];				
				if (dataPoint) {
					title.text(state.n + " : " + dataPoint);
				} else {
					title.text(state.n);
				}

				var fill = "#ffffff";
				if (dataPoint)
					fill = d3.interpolate("#ffccff", "#ff4499")(dataPoint/255);
				path.attr('style', 'fill: ' + fill + ';');

				g.append(title);
				g.append(path);
				rootElement.append(g);
			}

		}
		$scope.reload();
	});