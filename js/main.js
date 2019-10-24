$(document).ready(function(){


    function getProto(color){
      let html = '<div class="currentSlide slide" style="background: '+color+'"></div>'
      return $(html);
    }


    function createSlide(slideIndex, sens){
      let color = colors[slideIndex];
      let newDiv = getProto(color);
      newDiv.addClass(sens);
      $(".container").append(newDiv);
      return newDiv;
    }

    function changeIndex(sens){
      switch(sens) {
        case 'next':
          indexSlide ++;
          break;
        case 'prev':
          indexSlide --;
          break;
      }
      if (indexSlide < 0) {
        indexSlide = colors.length -1;
      }
      if (indexSlide > colors.length - 1){
        indexSlide = 0;
      }
      return indexSlide;
    }

    function moveSlides(currentDiv, newDiv, sens, time){
      currentDiv.animate({
        left : sens === 'next' ? "-300px":"300px"
      }, time, function(){
        currentDiv.remove();
      });
      newDiv.animate({
        left : "0px"
      }, time, function(){
        newDiv.removeClass(sens);
      });
    }

    function slide(sens) {
      let currentSlide = $(".currentSlide");
      indexSlide = changeIndex(sens);
      let newDiv = createSlide(indexSlide, sens);
      moveSlides(currentSlide, newDiv, sens, 500);
    }

    function launchInterval(){
      inter = setInterval(function(){
        slide('next');
      }, 1000);
    }

    function initSlider(){
      createSlide(indexSlide, null);
      launchInterval();
    }

    var colors = ["red","green","blue","yellow","pink", "orange"];
    var indexSlide = 0;
    var inter = null;
    $(".btn-slider").click(function(){
        let sens = $(this).attr('data-sens');
        if (inter) {
          clearInterval(inter);
          launchInterval();
        }
        slide(sens);
    });
    initSlider();

});