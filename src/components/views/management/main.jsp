<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>


<div class="section uline2">
    <div class="ani-in manage_layout">

        <div class="manage_conts">

            <%@include file="include/commMenu.jsp"%>

            <div class="manage_box_wrap">
                <%@include file="include/commVisitorInfo.jsp"%>

                <div  class="graph_wrap">
                    <%@include file="include/commCharts.jsp"%>
                </div>


                <%@include file="include/commPopularArticles.jsp"%>

            </div>

        </div>

    </div>
</div>