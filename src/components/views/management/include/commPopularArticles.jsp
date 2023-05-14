<%--
  Created by IntelliJ IDEA.
  User: HAN
  Date: 2022-10-01
  Time: 오후 4:34
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>

<div class="manage_line">인기글</div>
<div class="conts_rel">
    <ul style="padding:20px 0px;" class="articleList">
    </ul>
</div>


<script>
    comm.request({url: "/management/board/popularity/storys", method: "GET"}, function (resp) {
        if (resp.code == '0000') {
            $(".articleList").empty();
            resp.list.forEach(function (obj) {
                let liObj = $("<li></li>");
                let liHtml = '';
                liHtml += '<a href="'+getStoryViewUrl(obj['ID'], obj['MEMBER_ID'])+'">                          ';
                liHtml += '    <img src="' + obj.THUMBNAIL_IMG_PATH + '">                  ';
                liHtml += '        <strong>[' + obj.CATEGORY_NM + '] ' + obj.TITLE + '</strong> ';
                liHtml += '        <span>' + obj.SUMMARY + '</span>                         ';
                liHtml += '</a>                                                         ';
                liHtml += '<p>                                                          ';
                liHtml += '    <em>댓글 ' + obj.COMMENT_CNT + '</em>                          ';
                liHtml += '    <img src="/resources/img/line.png">                      ';
                liHtml += '        <em>공감 ' + obj.LIKE_CNT + '</em>                         ';
                liHtml += '</p>                                                         ';

                $(liObj).html(liHtml);
                $(".articleList").append(liObj);
            });
        }
    })
</script>
