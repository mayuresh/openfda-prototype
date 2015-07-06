angular.module('adverseReactionApp')
    .controller("BarCtrl", ['$scope', '$http', function ($scope, $http) {

        $scope.selected_reaction = false;
        $scope.selected_product = false;
        var adverse_reaction_req = {
            method: 'GET',
            url: 'https://api.fda.gov/drug/event.json',
            params: {
                api_key: 'pwf1NjqoKDItYyTxb8FHoCft9J2sij1paFwLJOTN',
                count: 'patient.reaction.reactionmeddrapt.exact',
                limit: '10'
            }
        }

        $http(adverse_reaction_req).
            success(function (data, status, headers, config) {

                var reactions = [];
                var i;
                for (i = data.results.length - 1; i >= 0; i--) {
                    reactions.push(data.results[i].term);
                }

                var reactions_counts = [];
                for (i = data.results.length - 1; i >= 0; i--) {
                    reactions_counts.push(data.results[i].count);
                }

                $scope.arObj = {
                    height: 400,
                    width: 350,
                    type: 'hbar',
                    "title": {
                        "text": "Types of adverse reactions",
                        backgroundColor: "#3498db",
                        fontFamily: "Helvetica",
                        alpha: 0.8,
                        fontWeight: "none",
                        borderBottom: "2px solid #2980b9"
                    },
                    "subtitle": {
                        "text": "Click on a bar to get breakdown of drugs causing the reaction"
                    },
                    "plotarea": {
                        "margin-left": "110px",
                        "border": "none"
                    },
                    "plot": {
                        "value-box": {
                            "visible": true
                        },
                        "selection-mode": "plot",
                        "background-mode": "none",
                        "selected-state": {
                            "background-color": "#900 #f90",
                            "border-color": "#999",
                            "border-width": 1
                        },
                        "bar-width": "15px",
                        "bar-space": "10px"
                    },
                    "scale-x": {
                        "values": reactions,
                        "label": {
                            "text": "Adverse Reactions"
                        },
                        "max-items": reactions.length,
                        "items-overlap": true,
                        "auto-fit": true,

                        "guide": {
                            "visible": false
                        }


                    },

                    series: [
                        {
                            "values": reactions_counts,
                            "labels": reactions,
                            "tooltip": {
                                "text": "%kl - %v occurances"
                            }

                        },

                    ]
                };

            }).
            error(function (data, status, headers, config) {
                $scope.results = [];
                console.log("Error while retrieving data")
            });

        $scope.$watch(function (scope) {
                return scope.selected_reaction
            },
            function (newValue, oldValue) {
                console.log("newValue = " + newValue + " oldValue = " + oldValue);
                if (newValue) {
                    var adverse_reaction_product_req = {
                        method: 'GET',
                        url: 'https://api.fda.gov/drug/event.json',
                        params: {
                            api_key: 'pwf1NjqoKDItYyTxb8FHoCft9J2sij1paFwLJOTN',
                            count: 'patient.drug.medicinalproduct.exact',
                            limit: '10',
                            search: 'patient.reaction.reactionmeddrapt:"' + newValue + '"'
                        }
                    }

                    $http(adverse_reaction_product_req).
                        success(function (data, status, headers, config) {

                            var products = [];
                            var i;
                            for (i = 0; i < data.results.length; i++) {
                                products.push(data.results[i].term);
                            }

                            var products_counts = [];
                            for (i = 0; i < data.results.length; i++) {
                                products_counts.push(data.results[i].count);
                            }

                            $scope.productsObj = {
                                height: 400,
                                width: 350,
                                "type": 'bar',
                                "title": {
                                    "text": "Drugs causing " + $scope.selected_reaction,
                                    backgroundColor: "#3498db",
                                    fontFamily: "Helvetica",
                                    alpha: 0.8,
                                    fontWeight: "none",
                                    borderBottom: "2px solid #2980b9"
                                },
                                "subtitle": {
                                    "text": "Click on a bar to view gender distribution for reactions"
                                },
                                "plot": {
                                    "selection-mode": "plot",
                                    "background-mode": "none",
                                    "selected-state": {
                                        "background-color": "#900 #f90",
                                        "border-color": "#999",
                                        "border-width": 1
                                    },
                                    "bar-width": "15px",
                                    "bar-space": "10px"
                                },
                                "scale-x": {
                                    "values": products,
                                    "max-items": products.length,
                                    "items-overlap": true,
                                    "item": {
                                        "font-angle": -45,
                                        "auto-align": true
                                    },
                                    "guide": {
                                        "visible": false
                                    }


                                },

                                series: [
                                    {
                                        "values": products_counts,
                                        "labels": products,
                                        "tooltip": {
                                            "text": "%kl - %v occurances of " + $scope.selected_reaction
                                        }
                                    },

                                ]
                            };

                        }).
                        error(function (data, status, headers, config) {
                            $scope.results = [];
                            console.log("Error while retrieving data")
                        });
                }
            })
        $scope.$watch(function (scope) {
                return scope.selected_product
            },
            function (newValue, oldValue) {
                if (newValue) {
                    var gender_distribution_req = {
                        method: 'GET',
                        url: 'https://api.fda.gov/drug/event.json',
                        params: {
                            api_key: 'pwf1NjqoKDItYyTxb8FHoCft9J2sij1paFwLJOTN',
                            count: 'patient.patientsex',
                            search: '(patient.reaction.reactionmeddrapt:"' + $scope.selected_reaction + '") AND (patient.drug.medicinalproduct:"' + newValue + '")'
                        }
                    }

                    var gender = ["Unknown", "Male", "Female"];
                    var color = ["#55FF55", "#FF5555", "#5555FF"];

                    $http(gender_distribution_req).
                        success(function (data, status, headers, config) {

                            var i;
                            series_data = [];
                            for (i = 0; i < data.results.length; i++) {
                                series_data.push({
                                    "text": gender[data.results[i].term],
                                    "values": [data.results[i].count],
                                    "background-color": color[data.results[i].term]
                                });
                            }

                            $scope.genderObj = {
                                height: 400,
                                width: 350,
                                "type": "pie",
                                "title": {
                                    "text": "Gender distribution for " + $scope.selected_reaction + "\n caused by " + $scope.selected_product,
                                    backgroundColor: "#3498db",
                                    fontFamily: "Helvetica",
                                    alpha: 0.8,
                                    fontWeight: "none",
                                    borderBottom: "2px solid #2980b9"
                                },

                                "plot": {
                                    "value-box": {
                                        "visible": true
                                    },
                                    "slice": 40,
                                    "shadow": 0,

                                },
                                "series": series_data
                            };

                        }).
                        error(function (data, status, headers, config) {
                            $scope.results = [];
                            console.log("Error while retrieving data")
                        });
                }
            });


        zingchart.bind("adverse-reactions-chart", "node_click", function (p) {
            console.log(p);
            $scope.selected_reaction = p.scaletext;
            $scope.selected_product = false;
            $scope.$digest();
        });

        zingchart.bind("products-chart", "node_click", function (p) {
            console.log(p);
            $scope.selected_product = p.scaletext;
            $scope.$digest();
        });
    }])