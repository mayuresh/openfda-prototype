angular.module('openFDASvc')
	.factory('FoodEnforcement', function($http){
		var api = {}

		var URL = 'https://api.fda.gov/food/enforcement.json?';

		api.FIELDS = {
			recalling_firm: 'recalling_firm',
			classification: 'classification',
			status: 'status',
			distribution_pattern: 'distribution_pattern',
			product_description: 'product_description',
			code_info: 'code_info',
			reason_for_recall: 'reason_for_recall',
			product_quantity: 'product_quantity',
			voluntary_mandated: 'voluntary_mandated',
			report_date: 'report_date',
			recall_initiation_date: 'recall_initiation_date',
			initial_firm_notification: 'initial_firm_notification',
			recall_number: 'recall_number',
			event_id: 'event_id',
			product_type: 'product_type',
			city: 'city',
			state: 'state',
			country: 'country'
		};

		isEmpty = function(obj) {
			return Object.getOwnPropertyNames(obj).length === 0;
		}

		api.search = function(params, countParam) {
			var searchURL = URL;
			if (!isEmpty(params)) {
				searchURL += 'search=';
				for (p in params) {
					searchURL +=p + ":" + params[p] + '+AND+';
				}
				var index = searchURL.lastIndexOf('+AND+');
				searchURL = searchURL.slice(0, index);
			}

			if (countParam) {
				searchURL += '&count=' + countParam;
			}
			return $http.get(searchURL);
		}
		return api;
	});