
var isPrime = (function fn(){
	var cache = {};


	return function isPrime(n){
		if (typeof cache[n] !== 'undefined')
			return cache[n];
		console.log('processing ', n);
		cache[n] = true;
		for(var index = 2, count = (n/2); index <= count; index++){
			if (n % index === 0){
				cache[n]=false;
				break;
			}
		}
		return cache[n];
	}
})();