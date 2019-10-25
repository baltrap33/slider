$(document).ready(function(){


    function getProto(city){
      let html ='<div class="currentSlide slide">';
          html +=   '<div style="display: flex; justify-content: space-between; height: 100%;">';
          html +=       '<div style="display: flex; flex-direction: column; justify-content: space-between;">';
          html +=           '<div style="margin: 20px;">'+city.toUpperCase()+'</div>';
          html +=           '<div style="margin: 20px;">';
          html +=               '<span class="tmp" style="font-size: 60px;"></span>°C';
          html +=           '</div>';
          html +=       '';
          html +=       '</div>';
          html +=       '<div class="bg-img">';
          html +=         '<div class="condition" style="margin: 20px;">';
          html +=         '';
          html +=         '</div>';
          html +=       '</div>';
          html +=   '</div>';
          html +='</div>';
      return $(html);
    }

    function getData(city){
      return $.ajax({
        url : "https://www.prevision-meteo.ch/services/json/"+city
      });
    }

    function populateData(parent, data){
      let current = data.current_condition;
      $(".tmp", parent).text(current.tmp);
      $(".condition", parent).text(current.condition);
      let style = "display: flex; flex-flow: column-reverse; width: 100%; height: 100%; background: url('"+current.icon_big+"'); background-size: contain; background-repeat: no-repeat;";
      $(".bg-img", parent).attr('style',style);
    }

    function createSlide(slideIndex, sens){
      let city = cities[slideIndex];
      return getData(city)
              .then(function(data){
                let newDiv = getProto(city);
                  populateData(newDiv, data);
                  newDiv.addClass(sens);
                $(".container").append(newDiv);
                return newDiv;
              })
              .catch(function(){
                slide(sens);
              });


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

    function promiseCurrentDivEnded(currentDiv, sens, time){
      return new Promise(function(resolve){
        currentDiv.animate({
          left : sens === 'next' ? "-300px":"300px"
        }, time, function(){
          currentDiv.remove();
          resolve();
        })
      });
    }

    function promiseNewDivEnded(newDiv, sens, time){
      return new Promise(function(resolve){
        newDiv.animate({
          left : "0px"
        }, time, function(){
          newDiv.removeClass(sens);
          resolve();
        });
      });
    }

    function moveSlides(currentDiv, newDiv, sens, time){

      var promiseCurrentDiv = promiseCurrentDivEnded(currentDiv, sens, time);
      var promiseNewDiv= promiseNewDivEnded(newDiv, sens, time);

      return Promise.all( [ promiseCurrentDiv, promiseNewDiv ]);
    }

    function slide(sens) {
      let currentSlide = $(".currentSlide");
      indexSlide = changeIndex(sens);
      $(".btn-slider").prop('disabled', true);
      createSlide(indexSlide, sens)
        .then(function(newDiv){
          moveSlides(currentSlide, newDiv, sens, 500).then(function(){
            $(".btn-slider").prop('disabled', false);
          });
        });
    }

    function launchInterval(){
      inter = setInterval(function(){
        slide('next');
      }, 15000);
    }

    function initSlider(){
      $(".btn-slider").prop('disabled', true);
      createSlide(indexSlide, null)
        .then(function(){
          launchInterval();
          $(".btn-slider").prop('disabled', false);
        });
    }

  var colors = ["red","green","blue","yellow","pink", "orange"];
  var cities = ["Bordeaux", "Marseille", "Paris", "Strasbourg", "Lille", "Lyon"];

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