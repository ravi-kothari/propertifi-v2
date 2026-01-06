new WOW().init();


$(document).ready(function() {
  $('.promotions-sldier').owlCarousel({
    loop:false,
    margin:10,
    autoplay:false,
    nav:true,
    items:3,
    dots:false,
    responsive : {
      0 : {
          items:1.1,
      },

      480 : {
        items:1.3,
      },

      768 : {
        items:2,
      },
      992:{
        items:3,
      },
      1000:{
        items:3,
      },

      1400:{
        items:3,
      },
    }
  });

  
});




