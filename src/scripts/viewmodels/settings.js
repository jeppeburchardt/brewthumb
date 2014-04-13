define(['knockout'], function (ko) {
    var Settings = function () {
        var self = this;

        function selectedSystem(metric, imperial) {
            return self.units()=='metric'?metric:imperial;
        }

        self.units = ko.observable('metric');
        self.saveLocal = ko.observable(true);

        self.smallWeightUnit = ko.computed(function() {
            return self.units()=='metric'?'g':'oz';
        });
        self.fluidUnit = ko.computed(function () {
            return self.units()=='metric'?'L':'gal';
        });
        self.largeWeightUnit = ko.computed(function () {
            return self.units()=='metric'?'kg':'lb';
        });
        self.temperatureUnit = ko.computed(function () {
            return self.units()=='metric'?'&deg;C':'&deg;F';
        });

        //converts a value of the selected system to liters
        self.inputToLiters = function (value) {
            return selectedSystem(value, value*3.7854118);
        };
        //converts a value of the selected system to gallons
        self.inputToGallons = function (value) {
            return selectedSystem(value/3.7854118, value);
        };
        //converts a value of the selected system to kg
        self.inputToKg = function (value) {
            return selectedSystem(value, value*0.45359237);
        };
        //converts a value of the selected system to lb
        self.inputToLb = function (value) {
            return selectedSystem(value/0.45359237, value);
        };
        //converts a value of the selected system to celsius
        self.inputToCelsius = function (value) {
            return selectedSystem(value, (5.0/9.0) * (value - 32));
        };
        //converts a value of the selected system to fahrenheit
        self.inputToFahrenheit = function (value) {
            return selectedSystem((value + 32) / (5.0/9.0), value);
        };
        //converts a value of the selected system to oz
        self.inputToOz = function (value) {
            return selectedSystem(value/28.349523125, value);
        };
        //converts a value of the selected system to grams
        self.inputToGrams = function (value) {
            return selectedSystem(value, value/0.0352739619496);
        };
        //converts a celsius value to the selected system
        self.outputFromCelsius = function (value) {
            return selectedSystem(value, (value + 32) / (5.0/9.0));
        };
        //converts a fahrenheit value to the selected system
        self.outputFromFahrenheit = function (value) {
            return selectedSystem((5.0/9.0) * (value - 32), value);
        };
        //converts a gram value to the selected system
        self.outputFromGrams = function (value) {
            return selectedSystem(value, value/28.349523125);
        };
        //converts an oz value to the selected system
        self.outputFromOz = function (value) {
            return selectedSystem(value/0.0352739619496, value);
        };
        //converts Liters to the selected system
        self.outputFromLiters = function (value) {
            return selectedSystem(value, value/3.7854118);
        };
    };
    return new Settings();
})
