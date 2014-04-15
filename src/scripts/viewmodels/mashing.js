define(['knockout', 'brewmath', 'viewmodels/settings'], function (ko, BrewMath, settings) {

    var MashStepViewModel = function (mashingViewModel) {
        var self = this,
            mvm = mashingViewModel;

        self.getPrevius = function () {
            var currentMashCelsius = settings.inputToCelsius(parseFloat(mvm.cst_target()) || 0), //TODO: convert this if imperial units is selected
                kgGrain = settings.inputToKg(parseFloat(mvm.cst_grainAmount()) || 0),
                litersWater = settings.inputToLiters(parseFloat(mvm.cst_waterAmount()) || 0),
                p = null;
            for (var i = 0; i < mvm.steps().length; i++) {
                if (mvm.steps()[i] === self) {
                    break;
                } else {
                    p = mvm.steps()[i];
                    litersWater += settings.inputToLiters(parseFloat(p.water()) || 0);
                    currentMashCelsius = settings.inputToCelsius(parseFloat(p.target()) || 0);
                }
            }
            return {
                litersWater:litersWater,
                currentMashCelsius:currentMashCelsius,
                kgGrain:kgGrain
            };
        };

        self.grain = function () {
            return settings.inputToKg(parseFloat(mvm.cst_grainAmount()) || 0);
        };

        self.target = ko.observable(70);
        self.temperature = ko.observable(100);

        self.water = ko.computed(function () {
            var targetCelsius = settings.inputToCelsius(parseFloat(self.target()) || 0);
            var p = self.getPrevius();
            var infusionCelsius = settings.inputToCelsius(parseFloat(self.temperature()) || 0);
            var result = BrewMath.infusionAmount(p.currentMashCelsius, targetCelsius, p.kgGrain, p.litersWater, infusionCelsius);
            return Math.round(settings.outputFromLiters(result) * 100) / 100;
        });

    };

    var Equipment = function(name, celsius) {
        this.name = name;
        this.celsius = celsius;
    };

    var MashingView = function () {
        var self = this;

        self.cst_target = ko.observable(65);
        self.cst_grainTemp = ko.observable(22);
        self.cst_waterAmount = ko.observable(15);
        self.cst_grainAmount = ko.observable(5.5);

        self.selectedEquipment = ko.observable(2);
        self.equipment = ko.observableArray([
            new Equipment('No compensation', 0),
            new Equipment('2000W electric', 2),
            new Equipment('20 gal Igloo', 3)
        ]);

        self.selectedEquipmentName = ko.computed(function () {
            for (var i=0; i<self.equipment().length; i++) {
                var e = self.equipment()[i];
                if (e.celsius == self.selectedEquipment()) {
                    return e.name;
                }
            }
            return "No compensation";
        });

        self.cst_strikeTemp = ko.computed(function () {
            var target = settings.inputToCelsius(parseFloat(self.cst_target()) || 0),
                grainTemp = settings.inputToCelsius(parseFloat(self.cst_grainTemp()) || 0),
                waterAmount = settings.inputToLiters(parseFloat(self.cst_waterAmount()) || 0),
                grainAmount = settings.inputToKg(parseFloat(self.cst_grainAmount()) || 0);
            var strike = settings.outputFromCelsius(BrewMath.strikeTemperature(grainTemp, grainAmount, waterAmount, target));


            var compensation = 0;
            if (self.selectedEquipment()) {
                compensation = settings.outputFromCelsius(self.selectedEquipment());
            }

            return Math.round((strike+compensation) * 10) / 10;
        }, self);

        self.steps = ko.observableArray();

        self.addStep = function () {
            var s = new MashStepViewModel(self);
            self.steps.push(s);
            return s;
        };
        self.removeStep = function (step) {
            self.steps.remove(step);
        };
    };
    return new MashingView();
});
