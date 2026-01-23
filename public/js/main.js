(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };

    // Use 'load' instead of simple execution to ensure all assets are ready
    window.addEventListener('load', spinner);


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').show();
        } else {
            $('.back-to-top').hide();
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').scrollTop(0);
        return false;
    });


    // Sidebar Toggler
    $('.sidebar-toggler').click(function () {
        if ($(window).width() < 992) {
            $('.sidebar').toggleClass("open");
            $('.sidebar-backdrop').toggleClass("show");
        } else {
            $('.sidebar, .content').toggleClass("collapsed");
        }
        return false;
    });

    // Handle Resize to clean up classes
    $(window).resize(function () {
        if ($(window).width() >= 992) {
            $('.sidebar').removeClass("open");
            $('.sidebar-backdrop').removeClass("show");
        } else {
            $('.sidebar, .content').removeClass("collapsed");
        }
    });

    // Sidebar Close on Click Outside or Backdrop (Mobile)
    $(document).on('click', '.sidebar-backdrop', function () {
        $('.sidebar').removeClass("open");
        $('.sidebar-backdrop').removeClass("show");
    });

    $(document).click(function (e) {
        if ($(window).width() < 992) {
            if ($('.sidebar').hasClass('open')) {
                if (!$(e.target).closest('.sidebar').length && !$(e.target).closest('.sidebar-toggler').length) {
                    $('.sidebar').removeClass("open");
                    $('.sidebar-backdrop').removeClass("show");
                }
            }
        }
    });


    // Progress Bar
    $('.pg-bar').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, { offset: '80%' });


    // Calender
    $('#calender').datetimepicker({
        inline: true,
        format: 'L'
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 0,
        animateIn: false,
        animateOut: false,
        items: 1,
        dots: true,
        loop: true,
        nav: false
    });


})(jQuery);

