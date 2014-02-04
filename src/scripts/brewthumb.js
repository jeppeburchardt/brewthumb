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
	    if (sg == 0) { return 1.000 }
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
	}

}

var MashingView = function () {
	var self = this;

	self.cst_target = ko.observable(65);
	self.cst_grainTemp = ko.observable(22);
	self.cst_waterAmount = ko.observable(15);
	self.cst_grainAmount = ko.observable(5.5);

	self.cst_strikeTemp = ko.computed(function () {
		var target = parseFloat(self.cst_target()) || 0,
			grainTemp = parseFloat(self.cst_grainTemp()) || 0,
			waterAmount = parseFloat(self.cst_waterAmount()) || 0,
			grainAmount = parseFloat(self.cst_grainAmount()) || 0;
		var strike = BrewMath.strikeTemperature(grainTemp, grainAmount, waterAmount, target);
		return Math.round(strike * 10) / 10;
	}, self);
}

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
};

var ViewModel = function() {
	var self = this;
	self.tabs = ['Mashing', 'Boiling', 'Fermentation'];

	self.mashingView = new MashingView();
	self.fermentationView = new FermentationView();

	self.selectedTab = ko.observable('Fermentation');
	self.selectTab = function(tab) { self.selectedTab(tab); };

};



ko.applyBindings(new ViewModel());
