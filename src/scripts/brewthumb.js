var BrewMath = {

	/**
	 * Converts a brix reading to specific gravity using original gravity
	 */
	brixToSg: function (brix, originalGravity) {
		var sg = 0;
		var og = (originalGravity - 1) * 1000;
		var ob = 0.02 + 0.25687 * og - 0.00019224 * og * og;
		ob = Math.round(ob*10)/10;
		sg = ((1.001843 - 0.002318474*ob - 0.000007775*ob*ob - 0.000000034*ob*ob*ob + 0.00574*brix + 0.00003344*brix*brix + 0.000000086*brix*brix*brix)-1)*1000;
		if (sg === 0) { return 1.000; }
		if (sg < 0) {
			sg = 1000 + sg;
			return sg / 1000;
		}
		return ((sg / 1000) + 1);
	},

	/**
	 * Converts brix &deg; to gravity
	 */
	brixToGravity: function (brix) {
		brix = brix || 0;
		return 1.000898 + 0.003859118 * brix + 0.00001370735 * brix * brix + 0.00000003742517 * brix * brix * brix;
	},

	/**
	 * Calculating strike temperature 
	 * (0.2 / R) (T2 - T1) + T2
	 * R: Grain to water ratio (L./Kg)
	 * T1: Dry grain temperature
	 * T2: Target temperature
	 */
	strikeTemperature: function (grainTemp, kgGrain, litersWater, targetTemp) {
		return (0.2 / (litersWater/kgGrain)) * (targetTemp - grainTemp) + targetTemp;
	},

	/**
	 * Formats a number as a readable gravity messure
	 */
	displayGravity: function (g) {
		g = Math.round(g * 1000) / 1000;
		while (g.toString().length < 5) {
			g = g + '0';
		}
		return g;
	},

	/**
	 * Formats a number as a readable ABV string
	 */
	displayABV: function (abv) {
		abv = Math.round( abv * 10 ) / 10;
		return abv + '%';
	},

	/**
	 * Estimate ABV
	 */
	estimateABV: function (og, sg) {
		return (og - sg) * 131;
	},

	/**
	 * Hydrometer Temperature Corrections
	 * http://hbd.org/brewery/library/HydromCorr0992.html
	 */
	specificGravityTemperatureCorrection: function (sg, tempC) {
		//Convert sg to a floating point number
		sg=parseFloat(sg);
		//Convert celsisus values to fahrenheit 
		var temp=(9/5)*tempC+32;
		//Calculates SG correction for 59F from HBD http://hbd.org/brewery/library/HydromCorr0992.html
		var correction=1.313454-(0.132674*temp)+(0.002057793*temp*temp)-(0.000002627634*temp*temp*temp);
		//Round off correction values and convert to SG scale
		correction=(Math.round(correction))/1000;
		//Adds SG correction to the measured SG
		var adjustedgravity=correction+sg;
		//Round off adjustedgravity
		adjustedgravity=Math.round(adjustedgravity * 1000)/1000;
		//sends the calculations back to a form named "entry"
		return adjustedgravity;
	}

};

(function (global, $) {
	$('#settings').on('click', function (e) {
		//e.preventDefault();
		e.stopPropagation();
		$('#settings ul').addClass('open');
	});
	$(document).on('click', function(e) {
		$('#settings ul').removeClass('open');
	});
})(window, jQuery);

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
	//converts a celsius value to the selected system
	self.outputFromCelsius = function (value) {
		return selectedSystem(value, (value + 32) / (5.0/9.0));
	};
	//converts a fahrenheit value to the selected system
	self.outputFromFahrenheit = function (value) {
		return selectedSystem((5.0/9.0) * (value - 32), value);
	};
};
var settings = new Settings();

var MashingView = function () {
	var self = this;

	self.cst_target = ko.observable(65);
	self.cst_grainTemp = ko.observable(22);
	self.cst_waterAmount = ko.observable(15);
	self.cst_grainAmount = ko.observable(5.5);
	self.cst_strikeTemp = ko.computed(function () {
		var target = settings.inputToCelsius(parseFloat(self.cst_target()) || 0),
			grainTemp = settings.inputToCelsius(parseFloat(self.cst_grainTemp()) || 0),
			waterAmount = settings.inputToLiters(parseFloat(self.cst_waterAmount()) || 0),
			grainAmount = settings.inputToKg(parseFloat(self.cst_grainAmount()) || 0);
		var strike = settings.outputFromCelsius(BrewMath.strikeTemperature(grainTemp, grainAmount, waterAmount, target));
		return Math.round(strike * 10) / 10;
	}, self);
};

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

var ViewModel = function() {
	var self = this;
	self.tabs = ['Mashing', 'Boiling', 'Fermentation'];

	self.mashingView = new MashingView();
	self.fermentationView = new FermentationView();
	self.settings = settings;

	self.selectedTab = ko.observable('Mashing');
	self.selectTab = function(tab) { self.selectedTab(tab); };

};



ko.applyBindings(new ViewModel());
