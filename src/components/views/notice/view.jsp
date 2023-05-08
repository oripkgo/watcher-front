<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:set var="vo" value="${result.view}"/>

<script>
    let type    = 'NOTICE';
    let id      = '${vo.ID}';
    let regDate = '${vo.REG_DATE}'

    $(document).ready(function(){
        // 지난 시간 세팅
        $("#last_time").html( comm.last_time_cal(regDate) );

        comm.initBoardView(type, id, function(resp){


        },{"likeTarget":".like", "tagsTarget":".conts_tag", "commentTarget":".conts_review"});
    })
</script>

<div class="section">
    <div class="ani-in sub_layout">

        <div class="detail_top ani_y delay1">
            <div class="detail_kind">공지사항</div>
            <strong>${vo.TITLE}</strong>
            <div class="detail_memo">
                <em>by ${vo.NICKNAME}</em>
                <img src="/resources/img/line.png">
                <span id="last_time"></span>
            </div>
        </div>

    </div>
</div>


<form id="noticeForm" name="noticeForm" method="get">
    <div class="section uline2">
        <div class="ani-in sub_layout rline">
            <div class="conts_wrap ani_y delay2">

                ${vo.CONTENTS}

                <div class="conts_sns">
                    <a href="javascript:;" class="zimm like" data-likecnt="${vo.LIKE_CNT}">공감 ${vo.LIKE_CNT}</a>

                </div>
                <script>
                    $(".sns_btn").click(function () {
                        $(".sns_view").slideToggle("fast");
                    });
                </script>

                <div class="conts_tag" style="display: none;">
                    <strong class="conts_tit">태그</strong>
                </div>

                <div class="conts_review"></div>

            </div>
        </div>
    </div>
</form>