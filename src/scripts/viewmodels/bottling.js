define(['knockout', 'brewmath', 'viewmodels/settings'], function (ko, BrewMath, settings) {
    var BottlingView = function () {
        var self = this;

        self.co2_volume = ko.observable(20);
        self.co2_temp = ko.observable(22);
        self.co2_target = ko.observable(2.5);
        self.co2_sugar = ko.computed(function () {
            var gallons = settings.inputToGallons(parseFloat(self.co2_volume()));
            var fahrenheit = settings.inputToFahrenheit(parseFloat(self.co2_temp()));
            var target = parseFloat(self.co2_target());
            return Math.round(settings.outputFromOz(
                BrewMath.carbonationCalculation(gallons, fahrenheit, target)
            ));
        });
    };

    return new BottlingView();
});
