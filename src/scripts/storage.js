define(['viewmodels/brewthumb', 'viewmodels/settings'], function (viewModel, settings) {

    function saveViewModel() {
        if (settings.saveLocal()) {
            localStorage.viewModel = ko.toJSON(viewModel);
        }
    }
    window.addEventListener('beforeunload', saveViewModel);
    window.addEventListener('unload', saveViewModel);

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
});