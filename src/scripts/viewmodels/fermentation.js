define(['knockout', 'brewmath', 'viewmodels/settings'], function (ko, BrewMath, settings) {
    var FermentationView = function () {
        var self = this;

        self.btg_brix = ko.observable(10);
        self.btg_gravity = ko.computed(function () {
            return BrewMath.displayGravity(BrewMath.brixToGravity(parseFloat(self.btg_brix())));
        }, self);

        self.cb_brix = ko.observable(10);
        self.cb_og = ko.observable("1.050");
        self.cb_sg = ko.computed(function () {
            return BrewMath.displayGravity(BrewMath.brixToSg(parseFloat(self.cb_brix()), parseFloat(self.cb_og())));
        }, self);

        self.cb_abv = ko.computed(function () {
            return BrewMath.displayABV(
                BrewMath.estimateABV(
                    parseFloat(self.cb_og()),
                    parseFloat(self.cb_sg())
                )
            );
        });

        self.sgtc_temp = ko.observable(22);
        self.sgtc_sg = ko.observable('1.010');
        self.sgtc_asg = ko.computed(function () {
            var temp = settings.inputToCelsius(parseFloat(self.sgtc_temp()));
            return BrewMath.displayGravity(
                BrewMath.specificGravityTemperatureCorrection(
                    parseFloat(self.sgtc_sg()),
                    temp
                )
            );
        });

        self.sgtc_og = ko.observable('1.050');
        self.sgtc_abv = ko.computed(function () {
            return BrewMath.displayABV(
                BrewMath.estimateABV(
                    parseFloat(self.sgtc_og()),
                    parseFloat(self.sgtc_asg())
                )
            );
        });
    };

    return new FermentationView();
});
