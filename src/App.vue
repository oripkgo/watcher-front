<template>
  <headerPage/>
  <router-view></router-view>
  <footerPage/>
</template>

<script>
  import $ from 'jquery';
  import headerPage from '@/components/common/include/Header';
  import footerPage from '@/components/common/include/Footer';

  export default {
    name: 'App',
    components: {
      headerPage,
      footerPage,
    },

    mounted() {

      /*$.fn.anchorAnimate = function (settings) {
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
      }*/

      $(window).scroll(function(){
        window.triggerJqueryFadeIn();
      });

      $("#to_top").on("click", function () {
        $("html, body").animate({scrollTop: 0}, '500');
        return false;
      });
    },

    methods: {

    }
  }
</script>

<style>
  @import "resources/css/style.css";
  @import "resources/css/swiper.css";
</style>
