<template>
  <headerPage/>
  <router-view></router-view>
  <footerPage/>
</template>

<script>
  import $ from 'jquery';
  import headerPage from '@/components/common/include/Header';
  import footerPage from '@/components/common/include/Footer';

  let animateQueue = new Array();
  let ready = true;

  export default {
    name: 'App',
    components: {
      headerPage,
      footerPage,
    },

    mounted() {
      console.log(process.env)
      let $this = this;

      $.fn.anchorAnimate = function (settings) {
        settings = $.extend({
          speed: 1000
        }, settings);
        return this.each(function () {
          var caller = this
          $(caller).click(function (event) {
            event.preventDefault()
            // var locationHref = window.location.href
            var elementClick = $(caller).attr("href")

            var destination = $(elementClick).offset().top - 0;
            $("html:not(:animated),body:not(:animated)").animate({scrollTop: destination}, settings.speed, function () {
              // window.location.hash = elementClick
            });
            return false;
          })
        })
      }

      //스크롤 페이드인
      $(document).ready(function () {
        $this.triggerJqueryFadeIn()
        $(window).scroll($this.triggerJqueryFadeIn);

        $("#to_top").on("click", function () {
          $("html, body").animate({scrollTop: 0}, '500');
          return false;
        });
      });
    },

    methods: {
      triggerJqueryFadeIn : function(){
        $('.ani-in').each(function () {
          var object_top = $(this).offset().top;
          var window_bottom = $(window).scrollTop() + $(window).height() - 200;
          if (window_bottom > object_top) {
            $(this).addClass('action');
          }
        });
        this.triggerJqueryFadeInQueue();
      },

      triggerJqueryFadeInQueue : function(){
        if (animateQueue.length != 0 && ready) {
          ready = false;
          // $this = animateQueue.shift();
          // $($this).addClass('action');
        }
      },
    }
  }
</script>

<style>
  @import "resources/css/style.css";
  @import "resources/css/swiper.css";
</style>
