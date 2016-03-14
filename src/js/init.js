
(function ($) {
    $(function () {
        $('.datepicker').pickadate({

            selectMonths: true, // Creates a dropdown to control month
            selectYears: 4, // Creates a dropdown of 15 years to control year,
            onStart: function() {

            },
            onRender: function() {

            },
            onOpen: function() {

            },
            onClose: function() {

            },
            onStop: function() {

            },
            onSet: function(context) {

            }
        });
        $('.modal-trigger').leanModal();
        $('.collapsible').collapsible({
            accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });



         }); // end of document ready
})(jQuery); // end of jQuery name space
