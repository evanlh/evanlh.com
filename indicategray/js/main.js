var pageload = function() {
    $('#slides').slidesjs({
        //    width: 940,
        //   height: 528,
        callback: {
            loaded: function(number) {
                // Use your browser console to view log
                console.log('SlidesJS: Loaded with slide #' + number);

                // Show start slide in log
                $('#slidesjs-log .slidesjs-slide-number').text(number);
            },
            start: function(number) {
                // Use your browser console to view log
                console.log('SlidesJS: Start Animation on slide #' + number);
            },
            complete: function(number) {
                // Use your browser console to view log
                console.log('SlidesJS: Animation Complete. Current slide is #' + number);

                // Change slide number on animation complete
                $('#slidesjs-log .slidesjs-slide-number').text(number);
            }
        }
    });
};

$('.navbar a').click(function() {
    var $this = $(this),
        $content = $('.content');
    $content.animate({'opacity': 0}, function() {
        $('.content').load($this.attr('href'), function() {
            pageload();
            $content.animate({'opacity': 1});
        });
    });
    return false;
});

