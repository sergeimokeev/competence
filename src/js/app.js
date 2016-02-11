;$(document).foundation();

(function ($) {
    "use strict";
    $(function () {

        $(".x-carousel-main").owlCarousel({
            loop: true,
            dots: false,
            nav: true,
            items: 1,
            autoplay: true,
            autoplayTimeout: 5000,
            autoplayHoverPause: true,
            animateOut: 'fadeOut',
            navText: ['<i class="fa fa-angle-left fa-3x"></i>', '<i class="fa fa-angle-right fa-3x"></i>']
        });

        $(".x-carousel-services").owlCarousel({
            loop: true,
            dots: true,
            nav: false,
            items: 1,
            autoplay: true,
            autoplayTimeout: 5000,
            autoplayHoverPause: true,
            //animateOut: 'fadeOut',
            navText: ['<i class="fa fa-angle-left fa-3x"></i>', '<i class="fa fa-angle-right fa-3x"></i>']
        });

    });
})(jQuery);
