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
	 * Calculates the amount of water needed to add to a mash to raise the temperature
	 * and perform an infusion step
	 */
	infusionAmount: function (currentMashCelsius, targetCelsius, kgGrain, litersWater, infusionCelsius) {
		return (targetCelsius - currentMashCelsius) * (0.2 * kgGrain + litersWater) / (infusionCelsius - targetCelsius);
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
	},

	/**
	 * Calculates the amount (oz) of sugar needed to carbonate
	 * http://www.merrycuss.com/calc/bottlecarbonation.html
	 */
	carbonationCalculation: function (gallons, fahrenheit, targetCarbonation) {
		//Sets variables; data from form named "entry" 
		var precarbonation=0;
		var neededcarbonation=0;
		var anhydrousglucose=0;
		var anhydrousglucose2=0;
		var glucosemonohydrate=0;
		var glucosemonohydrate2=0;
		var sucrose=0;
		var sucrose2=0;
		var volume=gallons;
		var temp=fahrenheit;
		var targetcarbonation=targetCarbonation;
		
		//Convert gallons to liters
		volume=volume*3.78541178;
		//CO2 before bottling - Regression formula based on data from McGill (2006)
		precarbonation=-0.0153*temp + 1.9018;
		//CO2 needed to reach the target
		neededcarbonation=targetcarbonation-precarbonation;
		//Convert needed C02 to grams of C02 per liter
		neededcarbonation=neededcarbonation*2;
		//Total grams of CO2 required for the batch size
		neededcarbonation=neededcarbonation*volume;
		//Needed amount of various sugars
		anhydrousglucose=neededcarbonation/0.49;
		anhydrousglucose2=anhydrousglucose*0.0352739619;
		glucosemonohydrate=neededcarbonation/0.44;
		glucosemonohydrate2=glucosemonohydrate*0.0352739619;
		sucrose=neededcarbonation/0.54;
		sucrose2=sucrose*0.0352739619;
		//Round off values 
		anhydrousglucose=(Math.round(anhydrousglucose * 100))/100;
		anhydrousglucose2=(Math.round(anhydrousglucose2 * 100))/100;
		glucosemonohydrate=(Math.round(glucosemonohydrate * 100))/100;
		glucosemonohydrate2=(Math.round(glucosemonohydrate2 * 100))/100;
		sucrose=(Math.round(sucrose * 100))/100;
		sucrose2=(Math.round(sucrose2 * 100))/100;

		return sucrose2;
	}



};

(function (global, $) {
	$('#settings a').on('click', function (e) {
		//e.preventDefault();
		e.stopPropagation();
		$('#settings').toggleClass('open');
	});
	//$(document).on('click', function(e) {
	//	$('#settings').removeClass('open');
	//});
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

	self.steps = ko.observableArray();

	self.addStep = function () {
		self.steps.push(new MashStepViewModel(self));
	};
	self.removeStep = function (step) {
		self.steps.remove(step);
	};
};

var MashStepViewModel = function (mashingViewModel) {
	var self = this;
	self.mashingViewModel = mashingViewModel;

	self.getPrevius = function () {
		var currentMashCelsius = settings.inputToCelsius(parseFloat(self.mashingViewModel.cst_target()) || 0), //TODO: convert this if imperial units is selected
			kgGrain = settings.inputToKg(parseFloat(self.mashingViewModel.cst_grainAmount()) || 0), 
			litersWater = settings.inputToLiters(parseFloat(self.mashingViewModel.cst_waterAmount()) || 0),
			p = null;
		for (var i = 0; i < self.mashingViewModel.steps().length; i++) {
			if (self.mashingViewModel.steps()[i] === self) {
				break;
			} else {
				p = self.mashingViewModel.steps()[i];
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
		return settings.inputToKg(parseFloat(self.mashingViewModel.cst_grainAmount()) || 0);
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

var BottlingView = function () {
	var self = this;

	self.co2_volume = ko.observable(20);
	self.co2_temp = ko.observable(22);
	self.co2_target = ko.observable(2.5);	
	self.co2_sugar = ko.computed(function () {
		var gallons = settings.inputToGallons(parseFloat(self.co2_volume()));
		var fahrenheit = settings.inputToFahrenheit(parseFloat(self.co2_temp()));
		var target = parseFloat(self.co2_target());
		console.log(self.co2_temp(), parseFloat(self.co2_temp()), fahrenheit);
		return Math.round(settings.outputFromOz(
			BrewMath.carbonationCalculation(gallons, fahrenheit, target)
		));
	});
};

var ViewModel = function() {
	var self = this;
	self.tabs = ['Mashing', 'Fermentation', 'Bottling'];

	self.mashingView = new MashingView();
	self.fermentationView = new FermentationView();
	self.bottlingView = new BottlingView();
	self.settings = settings;

	self.selectedTab = ko.observable('Mashing');
	self.selectTab = function(tab) { self.selectedTab(tab); };

};

var viewModel = new ViewModel();

var storedViewModel = localStorage.getItem("viewModel");
if (storedViewModel) {
	data = JSON.parse(storedViewModel);
	console.log(settings.saveLocal());
	
	settings.saveLocal(data.settings.saveLocal);
	if (settings.saveLocal()) {
		viewModel.selectedTab(data.selectedTab);

		viewModel.mashingView.cst_grainAmount(data.mashingView.cst_grainAmount);
		viewModel.mashingView.cst_grainTemp(data.mashingView.cst_grainTemp);
		viewModel.mashingView.cst_waterAmount(data.mashingView.cst_waterAmount);
		viewModel.mashingView.cst_target(data.mashingView.cst_target);

		//TODO: Add the rest of the views...	
	}
} 


ko.applyBindings(viewModel);


function saveViewModel() {
	if (settings.saveLocal()) {
		localStorage.viewModel = ko.toJSON(viewModel);
	}
}
window.addEventListener('beforeunload', saveViewModel);
window.addEventListener('unload', saveViewModel);




