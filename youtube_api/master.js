(function($){

  var slider = $('.slider');
  var iframes = slider.find('.slide iframe');
  var slides = slider.find('.slide');

  function setSlidesDimensions(slide) {

    var slideWidth = $('.slide').width();
    var aspectRatio = 16 / 9;
    var slideHeight = slideWidth / aspectRatio;

    slide.css({width: slideWidth, height: slideHeight});

  }

  function checkSlideType(index) {

    var slide = slides.eq(index);
    return slide.children().first().prop('tagName');

  }

  $.each(slides, function(){

    setSlidesDimensions($(this));

  });

  slider.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    infinite: true,
    dots: false,
    arrows: false,
    fade: true,
    swipe: true,
    pauseOnHover: false
  });

  slider.slick('slickPause');

  slider.on('beforeChange', function(event, slick, currentSlide, nextSlide){

    if (checkSlideType(currentSlide) == 'IFRAME') {

      playerResponse('stopVideo', slides.eq(currentSlide).find('iframe'));
      slider.slick('slickNext');

      if (checkSlideType(nextSlide) == 'IFRAME') {
        slider.slick('slickPause');
        playerResponse('playVideo', slides.eq(nextSlide).find('iframe'));
      } else {
        slider.slick('slickPlay');
      }

    } else {

      if (checkSlideType(nextSlide) == 'IFRAME') {
        slider.slick('slickPause');
        playerResponse('playVideo', slides.eq(nextSlide).find('iframe'));
      } else {
        slider.slick('slickPlay');
      }

    }

  });

  slider.on('swipe', function(event, slick, direction){

    console.log(direction);

    if (direction == 'left') slider.slick('slickNext');
    else slider.slick('slickPrev');

  });

  // automatically play first video
  (function(){

    var firstVideo = slider.find('iframe')[0];
    $(firstVideo).on('load', function(){
      playerResponse('playVideo', $(this));
    });

  })(jQuery);

})(jQuery);

var videos = ['youtube1', 'youtube2', 'youtube3'];

function playerResponse(func, iframe) {

  iframe.get(0).contentWindow.postMessage(JSON.stringify({
    "event": "command",
    "func": func,
  }), "*");

}

function onYouTubeIframeAPIReady() {

  for (var i = 0; i < videos.length; i++) {
    player = createPlayer(videos[i]);
  }

  function createPlayer(id) {
    return new YT.Player(id, {
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }

}

function onPlayerReady() {
  return true;
}

function onPlayerStateChange(event) {

  if (event.data == YT.PlayerState.ENDED) {

    event.target.stopVideo();
    $('.slider').slick('slickNext');

  }

}
