angular.module('AirPod.filters', [])
    .filter('positive', function() {
    return function(input) {
        if (!input) {
            return 0;
        }

        return Math.abs(input);
    };
    })
    .filter('subString',function($filter){
        console.log("I am in subString filter")
        return function(input, limit) {
            if (! input) return;
            if (input.length <= limit) {
                return input;
            }

            return $filter('limitTo')(input, limit) + '...';
        }
    })
