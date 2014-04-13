define(['jquery'], function ($) {
    $('#settings a').on('click', function (e) {
        //e.preventDefault();
        e.stopPropagation();
        $('#settings').toggleClass('open');
    });
    //$(document).on('click', function(e) {
    //	$('#settings').removeClass('open');
    //});
});
