<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!doctype html>
<html lang="ko">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="Expires" content="0"/>
    <meta http-equiv="Imagetoolbar" content="no">
    <meta http-equiv="Cache-Control" content="no-cache"/>
    <meta http-equiv="Pragma" content="no-cache"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width" />
    <title>MY스토리</title>
    <meta name="description" content="">
    <meta name="keywords" content="" />
    <meta property="og:type" content="website">
    <meta property="og:title" content="MY스토리">
    <meta property="og:description" content="">
    <meta property="og:keywords" content="">
    <meta property="og:image" content="/resources/img/main_visual01.png">
    <meta property="og:url" content="">
    <link rel="stylesheet" type="text/css" href="/resources/css/style.css" />
    <link rel="stylesheet" href="/resources/css/swiper.css">
    <script src="/resources/js/swiper.js"></script>
    <%--<script src="/resources/js/jquery-latest.js"></script>--%>
    <%--<script type="text/javascript" src="http://code.jquery.com/jquery-1.11.3.min.js"></script>--%>
    <script type="text/javascript" src="/resources/js/jquery-1.11.2.min.js"></script>
    <script type="text/javascript" src="/resources/js/tab.js"></script>

    <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
    <script type="text/javascript" src="https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js" charset="utf-8"></script>
    <%@include file="/WEB-INF/common/include/globalVariable.jsp"%>
    <script src="/resources/task/js/common/comm.js"></script>
</head>
<body>

<tiles:insertAttribute name="header"/>
<tiles:insertAttribute name="body"  />
<tiles:insertAttribute name="footer"/>


<script type="text/javascript">

    var animateQueue = new Array();
    var ready = true;

    jQuery.fn.anchorAnimate = function (settings) {
        settings = jQuery.extend({
            speed: 1000
        }, settings);
        return this.each(function () {
            var caller = this
            $(caller).click(function (event) {
                event.preventDefault()
                var locationHref = window.location.href
                var elementClick = $(caller).attr("href")

                var destination = $(elementClick).offset().top - 0;
                $("html:not(:animated),body:not(:animated)").animate({scrollTop: destination}, settings.speed, function () {
                    // window.location.hash = elementClick
                });
                return false;
            })
        })
    }

    function triggerJqueryFadeIn() {
        $('.ani-in').each(function () {
            var object_top = $(this).offset().top;
            var window_bottom = $(window).scrollTop() + $(window).height() - 200;
            if (window_bottom > object_top) {
                $(this).addClass('action');
            }
        });
        triggerJqueryFadeInQueue();
    }

    function triggerJqueryFadeInQueue() {
        if (animateQueue.length != 0 && ready) {
            ready = false;
            $this = animateQueue.shift();
            $($this).addClass('action');
        }
    }


    //스크롤 페이드인
    $(document).ready(function () {

        triggerJqueryFadeIn()
        $(window).scroll(triggerJqueryFadeIn);

        $("#to_top").on("click", function () {
            $("html, body").animate({scrollTop: 0}, '500');
            return false;
        });

    });

</script>
</body>
</html>