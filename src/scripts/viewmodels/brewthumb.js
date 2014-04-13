define([
        'knockout',
        'viewmodels/mashing',
        'viewmodels/fermentation',
        'viewmodels/bottling',
        'viewmodels/settings'
    ], function (
        ko,
        mashingView,
        fermentationView,
        bottlingView,
        settingsView
    ) {
    var ViewModel = function() {
        var self = this;
        self.tabs = ['Mashing', 'Fermentation', 'Bottling'];

        self.mashingView = mashingView;
        self.fermentationView = fermentationView;
        self.bottlingView = bottlingView;
        self.settings = settingsView;

        self.selectedTab = ko.observable('Mashing');
        self.selectTab = function(tab) { self.selectedTab(tab); };

    };
    return new ViewModel();
});
