var products = [
	{id : 6, name : 'Pen', cost : 50, units : 20, category : 'stationary'},
	{id : 9, name : 'Ten', cost : 70, units : 70, category : 'stationary'},
	{id : 3, name : 'Len', cost : 60, units : 60, category : 'grocery'},
	{id : 5, name : 'Zen', cost : 30, units : 30, category : 'grocery'},
	{id : 1, name : 'Ken', cost : 20, units : 80, category : 'utencil'},
];

//sort, filter, groupBy

function describe(title, fn){
	console.group(title);
	fn();
	console.groupEnd();
}

describe('Initial Products', function(){
	console.table(products);
});

describe('Sort', function(){
	
	describe('Default sort [ products by id ]', function(){
		function sort(){
			for(var i=0; i < products.length-1; i++)
				for(var j=i+1; j < products.length; j++)
					if (products[i].id > products[j].id){
						var temp = products[i];
						products[i] = products[j];
						products[j] = temp;
					}
		}
		sort();
		console.table(products);	
	});

	describe('Any list by any attribute', function(){
		function sort(list, attrName){
			for(var i=0; i < list.length-1; i++)
				for(var j=i+1; j < list.length; j++)
					if (list[i][attrName] > list[j][attrName]){
						var temp = list[i];
						list[i] = list[j];
						list[j] = temp;
					}
		}
		describe('Products by cost', function(){
			sort(products, 'cost');
			console.table(products);
		});
		describe('Products by units', function(){
			sort(products, 'units');
			console.table(products);
		})
	});

	describe('Any list by any comparer', function(){
		function sort(list, comparerFn){
			for(var i=0; i < list.length-1; i++)
				for(var j=i+1; j < list.length; j++)
					if (comparerFn(list[i], list[j]) > 0){
						var temp = list[i];
						list[i] = list[j];
						list[j] = temp;
					}
		}
		describe('Products by value [cost * units]', function(){
			function productComparerByValue(p1, p2){
				var p1Value = p1.cost * p1.units,
					p2Value = p2.cost * p2.units;
				if (p1Value < p2Value) return -1;
				if (p1Value > p2Value) return 1;
				return 0;
			}
			sort(products, productComparerByValue);
			console.table(products);
		});
	});

	describe('Any list by anything', function(){
		function sort(list, comparer){
			var comparerFn = comparer;
			if (typeof comparer === 'string'){
				comparerFn = function(item1, item2){
					if (item1[comparer] < item2[comparer]) return -1;
					if (item1[comparer] > item2[comparer]) return 1;
					return 0;
				}
			}
			for(var i=0; i < list.length-1; i++)
				for(var j=i+1; j < list.length; j++)
					if (comparerFn(list[i], list[j]) > 0){
						var temp = list[i];
						list[i] = list[j];
						list[j] = temp;
					}
		}
		describe('Products by category', function(){
			sort(products, 'category');
			console.table(products);
		});
		describe('Products by value [cost * units]', function(){
			function productComparerByValue(p1, p2){
				var p1Value = p1.cost * p1.units,
					p2Value = p2.cost * p2.units;
				if (p1Value < p2Value) return -1;
				if (p1Value > p2Value) return 1;
				return 0;
			}
			sort(products, productComparerByValue);
			console.table(products);
		});
	});

	
});

describe('Filter', function(){
	describe('Filter stationary products', function(){
		function filterStationaryProducts(){
			var result = [];
			for(var index = 0, count = products.length; index < count; index++){
				if (products[index].category === 'stationary')
					result.push(products[index]);
			}
			return result;
		}
		var stationaryProducts = filterStationaryProducts();
		console.table(stationaryProducts);
	})
	describe('Filter any list by any criteria', function(){
		function filter(list, criteriaFn){
			var result = [];
			for(var index = 0, count = list.length; index < count; index++){
				if (criteriaFn(list[index]))
					result.push(list[index]);
			}
			return result;
		}
		function negate(criteriaFn){
			return function(){
				return !criteriaFn.apply(undefined, arguments);
			}
		}
		describe('Products By cost', function(){
			var costlyProductCriteria = function(product){
				return product.cost > 50;
			}
			describe('Costly products [cost > 50]', function(){
				
				var costlyProducts = filter(products, costlyProductCriteria);
				console.table(costlyProducts);
			});
			describe('Affordable products [cost <= 50]', function(){
				/*var affordableProductCriteria = function(product){
					return !costlyProductCriteria(product);
				}*/
				var affordableProductCriteria = negate(costlyProductCriteria);
				var affordableProducts = filter(products, affordableProductCriteria);
				console.table(affordableProducts);
			});
		})
		describe('Products by units', function(){
			var understockedProductCriteria = function(product){
				return product.units < 50;
			}
			describe('Understocked products [units < 50]', function(){
				var understockedProducts = filter(products, understockedProductCriteria);
				console.table(understockedProducts);
			});
			describe('Overstocked products [units >= 50]', function(){
				var overstockedProductCriteria = negate(understockedProductCriteria);
				var overstockedProducts = filter(products, overstockedProductCriteria);
				console.table(overstockedProducts);
			});
		})
	})
});

describe('GroupBy', function(){
	function describeGroup(groupedObj){
		for(var key in groupedObj){
			describe('Key - [' + key + ']', function(){
				console.table(groupedObj[key]);
			});
		}
	}
	describe('products by category', function(){
		function groupProductsByCategory(){
			var result = {};
			for(var index = 0, count = products.length; index < count; index++){
				var key = products[index].category;
				if (typeof result[key] === 'undefined')
					result[key] = [];
				result[key].push(products[index]);
			}
			return result;
		}
		var productsByCategory = groupProductsByCategory();
		describeGroup(productsByCategory);
	});
	describe('Any list by any key', function(){
		function groupBy(list, keySelectorFn){
			var result = {};
			for(var index = 0, count = list.length; index < count; index++){
				var key = keySelectorFn(list[index]);
				if (typeof result[key] === 'undefined')
					result[key] = [];
				result[key].push(list[index]);
			}
			return result;
		}
		
		describe('Products by cost', function(){
			function costKeySelector(product){
				return product.cost < 50 ? 'affordable' : 'costly';
			};
			var productsByCost = groupBy(products, costKeySelector);
			describeGroup(productsByCost);
		});
	});
});
