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
    window.addEventListener('load', function () {
        spinner();

        // Active State Logic for Sidebar
        const path = window.location.pathname;

        // Clear all active states first
        $('.sidebar .nav-link').removeClass('active');
        $('.sidebar .dropdown-item').removeClass('active');
        $('.sidebar .dropdown-menu').removeClass('show');
        $('.sidebar .dropdown-toggle').attr('aria-expanded', 'false');

        $('.sidebar .nav-link, .sidebar .dropdown-item').each(function () {
            const href = $(this).attr('href');
            if (path === href) {
                $(this).addClass('active');

                // If it's a dropdown item, highlight and expand parent
                if ($(this).hasClass('dropdown-item')) {
                    const $parentDropdown = $(this).closest('.nav-item.dropdown');
                    $parentDropdown.find('.nav-link.dropdown-toggle').addClass('active');
                    const $dropdownMenu = $(this).closest('.dropdown-menu');
                    $dropdownMenu.addClass('show'); // Keep it open
                    $parentDropdown.find('.dropdown-toggle').attr('aria-expanded', 'true');
                }
            }
        });
    });


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
    $('.sidebar-toggler').off('click').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if ($(window).width() < 992) {
            $('.sidebar').toggleClass("open");
            $('.sidebar-backdrop').toggleClass("show");
        } else {
            $('.sidebar, .content').toggleClass("collapsed");
        }
    });

    // Global toggle for legacy/visitor patterns
    window.toggleSidebar = function () {
        if ($(window).width() < 992) {
            $('.sidebar').toggleClass("open");
            $('.sidebar-backdrop').toggleClass("show");
            // Also handle visitor legacy side-nav if present
            $('.side-nav').toggleClass("active");
            $('.overlay').toggleClass("active");
        } else {
            $('.sidebar, .content').toggleClass("collapsed");
        }
    };

    // Handle Resize to clean up classes
    $(window).on('resize', function () {
        if ($(window).width() >= 992) {
            $('.sidebar').removeClass("open");
            $('.sidebar-backdrop').removeClass("show");
            $('.side-nav').removeClass("active");
            $('.overlay').removeClass("active");
        }
    });

    // Universal Outside Click / Backdrop Click
    $(document).on('click touchstart', function (e) {
        // If clicking backdrop or overlay
        if ($(e.target).closest('.sidebar-backdrop, .overlay').length) {
            $('.sidebar').removeClass("open");
            $('.sidebar-backdrop').removeClass("show");
            $('.side-nav').removeClass("active");
            $('.overlay').removeClass("active");
            return;
        }

        // Mobile outside click logic
        if ($(window).width() < 992) {
            const $sidebar = $('.sidebar, .side-nav');
            const $toggler = $('.sidebar-toggler, .hamburger, .navbar-toggler');

            if ($sidebar.hasClass('open') || $sidebar.hasClass('active')) {
                // Close if clicking outside sidebar AND toggler
                // OR if clicking on a map (Leaflet often eats regular clicks)
                if ((!$(e.target).closest($sidebar).length && !$(e.target).closest($toggler).length) ||
                    $(e.target).closest('.leaflet-container, #map, .content, main').length) {

                    // Small delay to ensure click events inside sidebar finish first
                    setTimeout(function () {
                        $('.sidebar').removeClass("open");
                        $('.sidebar-backdrop').removeClass("show");
                        $('.side-nav').removeClass("active");
                        $('.overlay').removeClass("active");
                    }, 50);
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

