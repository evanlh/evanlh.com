(function() {
    var pagecache = {};
    var pageload = function() {
        var w, h;
        if ($('.process').length) {
            w = h = 600;
        } else {
            w = h = 935;
        }
        console.log(w);
        $('#slides').slidesjs({
            width: w,
            height: h,
            callback: {
                loaded: function(number) {
                    // Show start slide in log
                    $('#slidesjs-log .slidesjs-slide-number').text(number);
                },
                start: function(number) {
                },
                complete: function(number) {
                    // Change slide number on animation complete
                    $('#slidesjs-log .slidesjs-slide-number').text(number);
                }
            }
        });
    };

    $(window).bind('statechange', function() {
        var $content = $('.content'),
            State = History.getState(),
            href = State.url;

        $content.animate({'opacity': 0}, function() {
            // if (typeof pagecache[State.hash] != 'undefined') {
            //     $('.content').empty().append(pagecache[State.hash]);
            // } else {
                $content.load(href + " .content >*", function(responseText) {
                    pagecache[href] = responseText;
                    History.pushState(null, null, href);
                    $content.animate({'opacity': 1});
                    pageload();
                });
            // }
        });
    });

    $('.navbar a').click(function(event) {
        var $this = $(this),
            href = $this.attr('href');
        if (event.which == 2 || event.metaKey) { return true; }
        History.pushState(null, null, href);
        $('.navbar a').removeClass('active');
        $this.addClass('active');
        return false;
    });


    pageload();

})();
