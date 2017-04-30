angular.module('app.directives', [])

.directive('feeds', function() {
	return {
		restrict: 'AE',
		templateUrl: 'templates/_feeds.html',
		scope: {
			isBrand: '=isBrand',
			activities : '=activities'
		},
		link: function(scope,elem, attr) {

			console.log("scope", scope.isBrand)
		}
	}
})

.filter('readableTime', function() {
    return function(seconds) {
        var day, format, hour, minute, month, week, year;
        var currentTime = Math.floor(Date.now() / 1000);
        seconds = parseInt((currentTime - seconds));
        minute = 60;
        hour = minute * 60;
        day = hour * 24;
        week = day * 7;
        year = day * 365;
        month = year / 12;
        format = function(number, string) {
            if (string == 'day' || string == 'week' || string == 'hr') {
                string = number === 1 ? string : "" + string + "s";
            }
            //string = number === 1 ? string : "" + string + "s";
            return "" + number + " " + string;
        };
        switch (false) {
            case !(seconds < minute):
                return 'few seconds ago';
            case !(seconds < hour):
                return format(Math.floor(seconds / minute), 'min');
            case !(seconds < day):
                return format(Math.floor(seconds / hour), 'hr');
            case !(seconds < week):
                return format(Math.floor(seconds / day), 'day');
            case !(seconds < month):
                return format(Math.floor(seconds / week), 'week');
            case !(seconds < year):
                return format(Math.floor(seconds / month), 'mon');
            default:
                return format(Math.floor(seconds / year), 'yr');
        }
    };
})
