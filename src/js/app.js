;
$(document).foundation();

(function ($) {
    "use strict";
    $(function () {

        //begin of choose city in .cities block
            const pathToJson = './json/ajax.json';
            /* links */
            $('#cities-main-window-list').on('click', 'a', function (e) {
                e.preventDefault();

                const link = $(this).attr('href');

                $.ajax({
                    method: 'GET',
                    url: pathToJson,
                    data: {
                        action: 'setCity',
                        link: link
                    },
                    success: function (response) {
                        let res;
                        typeof response == 'string' ? res = $.parseJSON(response) : res = response;
                        if (res.success) {
                            document.location = link;

                        }
                    }
                });
            });
            const staticCities = $('#cities-main-window-list').html();
            const container = $('#cities-main-window-list');

            $('#searchCities').on('keyup', function () {
                const data = $(this)[0].value;
                const name = $(this).attr('name');
                if (data != '') {
                    $.ajax({
                        method: 'GET',
                        url: pathToJson,
                        data: {
                            action: name,
                            data: data,
                            count: 16,
                        },
                        success: function (response) {
                            let res;
                            typeof response == 'string' ? res = $.parseJSON(response) : res = response;
                            if(res.success) { 
                                container.empty();
                                    for (var i = 0; i < res.rows.length; i++) {
                                        container.append("<a href=" + res.rows[i].link + " class='cities-main-window-list-link'>" + res.rows[i].name + "</a>");
                                    }
                                }else {
                                    container.empty();
                                    container.append("<p class='callout warning cities-message'>Ничего не найдено</p>");
                                }
                    }
                    });
                }else {
                    container.empty();
                    container.append(staticCities);
                }
            });
            /* popup of the region */
            const modalRegion = $('#cities-container-region');
            const overlay = $('.overlay');
            /* Ajax окна региона  */
            $.ajax({
                method: 'GET',
                url: pathToJson,
                data: {
                    action: 'checkIp',
                },
                success: function (response) {
                    let res;
                    typeof response == 'string' ? res = $.parseJSON(response) : res = response;
                    if(res.success) { 
                        overlay.addClass('body-overlay');
                        modalRegion.fadeIn();
                    }
                }

            });


            const modalCities = $('#cities-container');

            /* choose buttons */
            $('#button-ok').on('click', function (e) {
                e.preventDefault();
                $.ajax({
                    method: 'GET',
                    url: pathToJson,
                    data: {
                        action: 'saveCity',
                    },
                    success: function (response) {
                    
                    let res;
                    typeof response == 'string' ? res = $.parseJSON(response) : res = response;
                        if(res.success) { 
                            modalRegion.fadeOut();
                            overlay.removeClass('body-overlay');
                        }
                    }
                });
            });
            $('#button-another').on('click', function (e) {
                e.preventDefault();
                modalRegion.fadeOut();
                modalCities.fadeIn();
                $("#searchCities").focus();
            });

            $('#main-window-close').on('click', function () {
                modalCities.fadeOut();
                overlay.removeClass('body-overlay');
            });

            $('#cities-select').on('click', function () {
                modalCities.fadeIn();
                $("#searchCities").focus();
            });

            $(document).on('keyup', function (e) {
                if (e.keyCode === 27 && modalCities.is(':visible')) {
                    modalCities.fadeOut();
                    overlay.removeClass('body-overlay');
                }
            });



        /** fix bug equalizer */
        if ($('[data-equalizer]').length) {
            Foundation.reInit('equalizer');
        }

        /** .quant input activity */
        $('.quant').each(function () {
            const $input = $(this).find('.quant__input');
            let currentNum = Math.max(+$input.val(), 0);
            $(this).find('.quant__plus').on('click', function () {
                $input.val(++currentNum);
            });

            $(this).find('.quant__minus').on('click', function () {
                if (currentNum >= 2) {
                    $input.val(--currentNum);
                }
            });
        });

        /** close .dd when click outside, when using Foundation Toggler */
        $(document).on('mouseup', function (e) {
            const $popup = $('.dd_show[data-toggler]');
            if ($popup.length === 0) {
                return;
            }
            const $button = $('[data-toggle="' + $popup.prop('id') + '"]');
            if (
                !$popup.is(e.target) && $popup.has(e.target).length === 0 &&
                !$button.is(e.target) && $button.has(e.target).length === 0
            ) {
                $popup.removeClass('dd_show');
            }
        });

        /** Разные карусели */
        $(".carousel-main").slick({
            infinite: true,
            dots: false,
            arrows: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            autoplayHoverPause: true,
            fade: true,
            swipeToSlide: true,
            prevArrow: '<span><svg class="svg-inline--fa fa-angle-left fa-w-8 slick-prev fa-4x" aria-hidden="true" data-prefix="fas" data-icon="angle-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" data-fa-i2svg=""><path fill="currentColor" d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"></path></svg></span>',
            nextArrow: '<span><svg class="svg-inline--fa fa-angle-right fa-w-8 slick-next fa-4x" aria-hidden="true" data-prefix="fas" data-icon="angle-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" data-fa-i2svg=""><path fill="currentColor" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path></svg></span>'
        });

        $(".carousel-services").slick({
            infinite: true,
            dots: true,
            arrows: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            autoplayHoverPause: true
        });

        $(".carousel-news").slick({
            infinite: true,
            arrows: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            fade: true,
            swipeToSlide: true,
            autoplay: true,
            autoplaySpeed: 7000,
            autoplayHoverPause: true
        });
        $('.carousel-news-anchor').on('click', function (e) {
            e.preventDefault();
            const $this = $(this),
                index = $this.closest('.carousel-news-links').find('.carousel-news-anchor').index($this);
            $('.carousel-news').slick('slickGoTo', index);
        });

        /** Показ любого блока по наведению на другой */
        let toggleLeaveTimer;
        $('[data-toggle-hover-dd]').on('mouseenter mouseleave', function (e) {
            const $toggler = $('#' + $(this).data('toggle-hover-dd'));
            if ($toggler.length > 0) {
                const className = $toggler.data('toggler-hover-dd');
                if (e.type === 'mouseenter' && !$toggler.hasClass(className)) {
                    $toggler.addClass(className);
                }
                if (e.type === 'mouseleave' && $toggler.hasClass(className)) {
                    toggleLeaveTimer = setTimeout(() => {
                        $toggler.removeClass(className);
                    }, 300);
                }
            }
        });
        $('[data-toggler-hover-dd]').on('mouseenter', function () {
            clearTimeout(toggleLeaveTimer);
        }).on('mouseleave', function () {
            const $toggler = $(this);
            const className = $toggler.data('toggler-hover-dd');
            if ($toggler.hasClass(className)) {
                toggleLeaveTimer = setTimeout(() => {
                    $toggler.removeClass(className);
                }, 300);
            }
        });
    });
})(jQuery);
