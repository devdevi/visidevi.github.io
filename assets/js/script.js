
$(function() {
  $('.carousel').carousel();
  setInterval(function() {
    $('.carousel').carousel('prev');
  }, 1500);
  $('.carousel.carousel-slider').carousel({
    fullWidth: true
  });
  var container = $('#origiName');
  userText = $('#userText');

  container.shuffleLetters();

  // Bind events
  userText.click(function() {
    userText.val('');
  }).bind('keypress', function(e) {
    if (e.keyCode == 13) {
      // The return key was pressed

      container.shuffleLetters({
        'text': userText.val()
      });

      userText.val('');
    }
  }).hide();

  // Leave a 4 second pause

  setTimeout(function() {
    // Shuffle the container with custom text
    container.shuffleLetters({
      'text': ' VISAKA DEVI '
    });
  }, 3000);
  //  segundo NAVBAR

  var secondaryNav = $('.cd-secondary-nav'),
    secondaryNavTopPosition = secondaryNav.offset().top,
    taglineOffesetTop = $('#cd-intro-tagline').offset().top + $('#cd-intro-tagline').height() + parseInt($('#cd-intro-tagline').css('paddingTop').replace('px', '')),
    contentSections = $('.cd-section');

  $(window).on('scroll', function() {
    // on desktop - assign a position fixed to logo and action button and move them outside the viewport
    ($(window).scrollTop() > taglineOffesetTop) ? $('#cd-logo, .cd-btn').addClass('is-hidden') : $('#cd-logo, .cd-btn').removeClass('is-hidden');

    // on desktop - fix secondary navigation on scrolling
    if ($(window).scrollTop() > secondaryNavTopPosition) {
      // fix secondary navigation
      secondaryNav.addClass('is-fixed');
      // push the .cd-main-content giving it a top-margin
      $('.cd-main-content').addClass('has-top-margin');	
      // on Firefox CSS transition/animation fails when parent element changes position attribute
      // so we to change secondary navigation childrens attributes after having changed its position value
      setTimeout(function() {
        secondaryNav.addClass('animate-children');
        $('#cd-logo').addClass('slide-in');
        $('.cd-btn').addClass('slide-in');
      }, 50);
    } else {
      secondaryNav.removeClass('is-fixed');
      $('.cd-main-content').removeClass('has-top-margin');
      setTimeout(function() {
        secondaryNav.removeClass('animate-children');
        $('#cd-logo').removeClass('slide-in');
        $('.cd-btn').removeClass('slide-in');
      }, 50);
    }

    // on desktop - update the active link in the secondary fixed navigation
    updateSecondaryNavigation();
  });

  function updateSecondaryNavigation() {
    contentSections.each(function() {
      var actual = $(this),
        actualHeight = actual.height() + parseInt(actual.css('paddingTop').replace('px', '')) + parseInt(actual.css('paddingBottom').replace('px', '')),
        actualAnchor = secondaryNav.find('a[href="#' + actual.attr('id') + '"]');
      if ((actual.offset().top - secondaryNav.height() <= $(window).scrollTop()) && (actual.offset().top + actualHeight - secondaryNav.height() > $(window).scrollTop())) {
        actualAnchor.addClass('active');
      } else {
        actualAnchor.removeClass('active');
      }
    });
  }

  // on mobile - open/close secondary navigation clicking/tapping the .cd-secondary-nav-trigger
  $('.cd-secondary-nav-trigger').on('click', function(event) {
    event.preventDefault();
    $(this).toggleClass('menu-is-open');
    secondaryNav.find('ul').toggleClass('is-visible');
  });

  // smooth scrolling when clicking on the secondary navigation items
  secondaryNav.find('ul a').on('click', function(event) {
    event.preventDefault();
    var target = $(this.hash);
    $('body,html').animate({
      'scrollTop': target.offset().top - secondaryNav.height() + 1
    }, 400
    ); 
    // on mobile - close secondary navigation
    $('.cd-secondary-nav-trigger').removeClass('menu-is-open');
    secondaryNav.find('ul').removeClass('is-visible');
  });

  // on mobile - open/close primary navigation clicking/tapping the menu icon
  $('.cd-primary-nav').on('click', function(event) {
    if ($(event.target).is('.cd-primary-nav')) $(this).children('ul').toggleClass('is-visible');
  });
  // SEGUNDO NAV
  var sliderFinalWidth = 400,
    maxQuickWidth = 900;

  // open the quick view panel
  $('.cd-trigger').on('click', function(event) {
    var selectedImage = $(this).parent('.cd-item').children('img'),
      slectedImageUrl = selectedImage.attr('src');

    $('body').addClass('overlay-layer');
    animateQuickView(selectedImage, sliderFinalWidth, maxQuickWidth, 'open');

    // update the visible slider image in the quick view panel
    // you don't need to implement/use the updateQuickView if retrieving the quick view data with ajax
    updateQuickView(slectedImageUrl);
  });

  // close the quick view panel
  $('body').on('click', function(event) {
    if ($(event.target).is('.cd-close') || $(event.target).is('body.overlay-layer')) {
      closeQuickView(sliderFinalWidth, maxQuickWidth);
    }
  });
  $(document).keyup(function(event) {
    // check if user has pressed 'Esc'
    if (event.which == '27') {
      closeQuickView(sliderFinalWidth, maxQuickWidth);
    }
  });

  // quick view slider implementation
  $('.cd-quick-view').on('click', '.cd-slider-navigation a', function() {
    updateSlider($(this));
  });

  // center quick-view on window resize
  $(window).on('resize', function() {
    if ($('.cd-quick-view').hasClass('is-visible')) {
      window.requestAnimationFrame(resizeQuickView);
    }
  });

  function updateSlider(navigation) {
    var sliderConatiner = navigation.parents('.cd-slider-wrapper').find('.cd-slider'),
      activeSlider = sliderConatiner.children('.selected').removeClass('selected');
    if (navigation.hasClass('cd-next')) {
      (!activeSlider.is(':last-child')) ? activeSlider.next().addClass('selected') : sliderConatiner.children('li').eq(0).addClass('selected');
    } else {
      (!activeSlider.is(':first-child')) ? activeSlider.prev().addClass('selected') : sliderConatiner.children('li').last().addClass('selected');
    }
  }

  function updateQuickView(url) {
    $('.cd-quick-view .cd-slider li').removeClass('selected').find('img[src="' + url + '"]').parent('li').addClass('selected');
  }

  function resizeQuickView() {
    var quickViewLeft = ($(window).width() - $('.cd-quick-view').width()) / 2,
      quickViewTop = ($(window).height() - $('.cd-quick-view').height()) / 2;
    $('.cd-quick-view').css({
      'top': quickViewTop,
      'left': quickViewLeft,
    });
  }

  function closeQuickView(finalWidth, maxQuickWidth) {
    var close = $('.cd-close'),
      activeSliderUrl = close.siblings('.cd-slider-wrapper').find('.selected img').attr('src'),
      selectedImage = $('.empty-box').find('img');
    // update the image in the gallery
    if (!$('.cd-quick-view').hasClass('velocity-animating') && $('.cd-quick-view').hasClass('add-content')) {
      selectedImage.attr('src', activeSliderUrl);
      animateQuickView(selectedImage, finalWidth, maxQuickWidth, 'close');
    } else {
      closeNoAnimation(selectedImage, finalWidth, maxQuickWidth);
    }
  }

  function animateQuickView(image, finalWidth, maxQuickWidth, animationType) {
    // store some image data (width, top position, ...)
    // store window data to calculate quick view panel position
    var parentListItem = image.parent('.cd-item'),
      topSelected = image.offset().top - $(window).scrollTop(),
      leftSelected = image.offset().left,
      widthSelected = image.width(),
      heightSelected = image.height(),
      windowWidth = $(window).width(),
      windowHeight = $(window).height(),
      finalLeft = (windowWidth - finalWidth) / 2,
      finalHeight = finalWidth * heightSelected / widthSelected,
      finalTop = (windowHeight - finalHeight) / 2,
      quickViewWidth = (windowWidth * 0.8 < maxQuickWidth) ? windowWidth * 0.8 : maxQuickWidth,
      quickViewLeft = (windowWidth - quickViewWidth) / 2;

    if (animationType == 'open') {
      // hide the image in the gallery
      parentListItem.addClass('empty-box');
      // place the quick view over the image gallery and give it the dimension of the gallery image
      $('.cd-quick-view').css({
        'top': topSelected,
        'left': leftSelected,
        'width': widthSelected,
      }).velocity({
        // animate the quick view: animate its width and center it in the viewport
        // during this animation, only the slider image is visible
        'top': finalTop + 'px',
        'left': finalLeft + 'px',
        'width': finalWidth + 'px',
      }, 1000, [400, 20], function() {
        // animate the quick view: animate its width to the final value
        $('.cd-quick-view').addClass('animate-width').velocity({
          'left': quickViewLeft + 'px',
          'width': quickViewWidth + 'px',
        }, 300, 'ease', function() {
          // show quick view content
          $('.cd-quick-view').addClass('add-content');
        });
      }).addClass('is-visible');
    } else {
      // close the quick view reverting the animation
      $('.cd-quick-view').removeClass('add-content').velocity({
        'top': finalTop + 'px',
        'left': finalLeft + 'px',
        'width': finalWidth + 'px',
      }, 300, 'ease', function() {
        $('body').removeClass('overlay-layer');
        $('.cd-quick-view').removeClass('animate-width').velocity({
          'top': topSelected,
          'left': leftSelected,
          'width': widthSelected,
        }, 500, 'ease', function() {
          $('.cd-quick-view').removeClass('is-visible');
          parentListItem.removeClass('empty-box');
        });
      });
    }
  }
  function closeNoAnimation(image, finalWidth, maxQuickWidth) {
    var parentListItem = image.parent('.cd-item'),
      topSelected = image.offset().top - $(window).scrollTop(),
      leftSelected = image.offset().left,
      widthSelected = image.width();

    $('body').removeClass('overlay-layer');
    parentListItem.removeClass('empty-box');
    $('.cd-quick-view').velocity('stop').removeClass('add-content animate-width is-visible').css({
      'top': topSelected,
      'left': leftSelected,
      'width': widthSelected,
    });
  }
});

