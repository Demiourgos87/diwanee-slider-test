(function($){

  var slider = $('.slider');
  var slides = slider.find('.slide');

  function setSlideDimensions(slide) {
    var slideWidth = $('.slide').width();
    var aspectRatio = 16 / 9;
    var slideHeight = slideWidth / aspectRatio;

    slide.css({width: slideWidth, height: slideHeight});
  }

  function checkSlideType(index) {
    var slide = slides.eq(index);
    return slide.children().first().prop('tagName');
  }

  function stopAllVideos() {
    $('video').each(function(){
      $(this).get(0).pause();
      $(this).get(0).currentTime = 0;
    });
  }

  $.each(slides, function(){
    setSlideDimensions($(this));
  });

  slider.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    dots: false,
    arrows: false,
    fade: true,
    swipe: true,
    pauseOnHover: false
  });

  slider.slick('slickPause');

  (function(){

    var firstVideo = $(slides[0]).find('video');
    firstVideo.get(0).play();
    firstVideo.on('ended', function(){
      slider.slick('slickNext');
      slider.slick('slickPlay');
    });

  })();

  slider.on('afterChange', function(event, slick, currentSlide){

    if (checkSlideType(currentSlide) == 'VIDEO') {

      var video = slides.eq(currentSlide).find('video');

      slider.slick('slickPause');

      video.get(0).play();
      video.on('ended', function(){
        slider.slick('slickNext');
        slider.slick('slickPlay');
      });

    } else slider.slick('slickPlay');

  });

  slider.on('swipe', function(event, slick, direction){

    if (direction == 'left') {
      stopAllVideos();
      slider.slick('slickNext');
    } else {
      stopAllVideos();
      slider.slick('slickPrev');
    }

  });

})(jQuery);
