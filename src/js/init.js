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
        $('.button-collapse').sideNav({
                menuWidth: 240, // Default is 240
                edge: 'left', // Choose the horizontal origin
                closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
            }
        );

        $('.modal-trigger').leanModal();



    }); // end of document ready
})(jQuery); // end of jQuery name space
