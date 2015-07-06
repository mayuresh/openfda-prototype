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
					$scope.results = results;
					drawStates(results,totalCount, maxData, minData);
				});
		}
		var drawStates = function(data, totalCount, maxData, minData) {

			var states = StateMapData;
			var diff = maxData - minData;
			var ratio = 255/ diff;
			// console.log(data);
			var rootElement = angular.element(document.querySelector('#usstates'));
			var getColor = d3.interpolate("#ffccff", "#ff0000");
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
					fill = getColor(dataPoint/maxData);
				path.attr('style', 'fill: ' + fill + ';');

				g.append(title);
				g.append(path);
				rootElement.append(g);

				var tPath = document.querySelector("#" + state.id + " path");
				addText(tPath, state.id, dataPoint);
			}
		}

		var addText = function(path, name, count) {
			var t = document.createElementNS("http://www.w3.org/2000/svg", "text");
		    var b = path.getBBox();
		    t.setAttribute("transform", "translate(" + (b.x + b.width/2) + " " + (b.y + b.height/2) + ")");
		    t.textContent = name;
		    // if (count) t.textContent = count;
		    // t.setAttribute("fill", "red");
		    t.setAttribute("font-size", "10");
		    path.parentNode.insertBefore(t, path.nextSibling);
		}

		var showLegend = function() {
			var canvas = document.getElementById('myCanvas');
			var context = canvas.getContext('2d');
			context.rect(0, 0, canvas.width, canvas.height);

			// add linear gradient
			var grd = context.createLinearGradient(0, 0, canvas.width, canvas.height);
			// light blue
			grd.addColorStop(0, '#ffffff');
			grd.addColorStop(0.05, '#ffccff');
			// dark blue
			grd.addColorStop(1, '#ff0000');
			context.fillStyle = grd;
			context.fill();
		}
		$scope.reload();
		showLegend();
	});