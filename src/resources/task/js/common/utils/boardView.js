import request from "@/resources/task/js/common/utils/request";

const boardViewInitApiUrl = '/board/view/init';
const boardlikeModifyApiUrl = '/board/like/modify';
const commentListApiUrl = '/board/comment/select';
const commentInsertApiUrl = "/board/comment/insert";
const commentDeleteApiUrl = "/board/comment/delete";
const commentUpdateApiUrl = "/board/comment/update";

const likeYImgUrl = require("@/resources/img/icon_heart_on.png");
const likeNImgUrl = require("@/resources/img/zim_ico.png");
const profileEmptyImgUrl = require("@/resources/img/member_ico.png");
const commentButtonDivisionImgUrl = require("@/resources/img/line.png");

const getBoardInitDefaultData = function (id, type) {
    let result = {};
    request.send(boardViewInitApiUrl, "GET", {
        "contentsId": id,
        "contentsType": type,
    }, function (resp) {
        result = resp;
    }, null, null, false)

    return result
}

const updateBoardLike = function (contentsId, contentsType, likeId, likeYn) {
    let result = {};
    let param = {};

    if (contentsId) {
        param.contentsId = contentsId;
    }

    if (contentsType) {
        param.contentsType = contentsType;
    }

    if (likeId) {
        param.likeId = likeId;
    }

    if (likeYn) {
        param.likeYn = likeYn;
    }

    request.send(boardlikeModifyApiUrl, "POST", param, function (resp) {
        result = resp;
    }, null, {'Content-type': "application/json"}, false);

    return result;
}


const boardView = {
    init: function (id, type) {
        this.viewInitResult = getBoardInitDefaultData(id, type);

        this.loginYn = this.viewInitResult.loginYn;
        this.tags = this.viewInitResult['tags'] || this.viewInitResult['TAGS'];
        this.likeId = this.viewInitResult['LIKE_ID'];
        this.likeYn = this.viewInitResult['LIKE_YN'];

        this.tag.init(id, type, this.tags);
        this.like.init(id, type, this.loginYn, this.likeId, this.likeYn);
        this.comment.init(id, type, this.loginYn);
    },

    tag: {
        init: function (id, type, tags) {
            this.id = id;
            this.type = type;
            this.tags = tags;
        },

        render: function (tagId) {
            let result = "<strong class=\"conts_tit\">태그</strong>";
            let targetElement = document.getElementById(tagId);

            let tags = this.tags;

            if (!tags) {
                targetElement.style.display = 'none';
                return;
            }

            let tags_arr = tags.split(",");

            for (let i = 0; i < tags_arr.length; i++) {
                result += '<a href="javascript:;">#' + tags_arr[i] + '</a>';
            }

            targetElement.innerHTML = result;
            targetElement.style.display = 'block';
        },
    },
    like: {
        init: function (id, type, loginYn, likeId, likeYn, notLoginStatusProcessingFunc) {
            this.id = id;
            this.type = type;
            this.likeId = likeId;
            this.likeYn = likeYn;
            this.loginYn = loginYn;
            this.notLoginStatusProcessingFunc = notLoginStatusProcessingFunc;
        },

        setLikeElementDataSet: function (targetObj, data) {
            if (data.id) {
                targetObj.dataset['contentsId'] = data.id;
            }
            if (data.type) {
                targetObj.dataset['contentsType'] = data.type;
            }
            if (data['likeId']) {
                targetObj.dataset['likeId'] = data['likeId'];
            }
            if (data['likeYn']) {
                targetObj.dataset['likeYn'] = data['likeYn'];
            }
        },

        changeLikeElementDataSet: function (targetObj, likeYn, likeId) {
            if (likeYn == 'Y') {
                let likecnt = (targetObj.dataset['likecnt'] * 1) + 1;
                targetObj.innerText = ('공감 ' + likecnt);
                targetObj.dataset['likecnt'] = likecnt;

                targetObj.dataset['likeId'] = likeId;
                targetObj.dataset['likeYn'] = 'Y';

            } else {
                let likecnt = (targetObj.dataset['likecnt'] * 1) - 1

                if (likecnt < 0) {
                    likecnt = 0;
                }

                targetObj.innerText = ('공감 ' + likecnt);
                targetObj.dataset['likecnt'] = likecnt;
                delete targetObj.dataset['likeId'];
            }

        },

        changeTheLikeImageWithLikeYnValue: function (targetObj, likeYn) {
            if (likeYn == 'N') {
                targetObj.style.background = "url('" + likeNImgUrl + "') no-repeat left center";
            } else {
                targetObj.style.background = "url('" + likeYImgUrl + "') no-repeat left center";
            }
        },

        render: function (tagId) {
            const likeThis = this;
            const targetElement = document.getElementById(tagId);

            likeThis.setLikeElementDataSet(targetElement, likeThis);

            likeThis.changeTheLikeImageWithLikeYnValue(targetElement, likeThis['likeYn']);

            targetElement.addEventListener("click", function () {
                // const $this = this;
                const data = targetElement.dataset;

                if (likeThis['loginYn'] == 'Y') {
                    const resp = updateBoardLike(data.contentsId, data.contentsType, data.likeId, data.likeYn);

                    targetElement.dataset['likeYn'] = (targetElement.dataset['likeYn'] == 'Y' ? 'N' : 'Y');

                    likeThis.changeLikeElementDataSet(targetElement, targetElement.dataset['likeYn'], resp['like_id']);
                    likeThis.changeTheLikeImageWithLikeYnValue(targetElement, targetElement.dataset['likeYn']);
                } else {
                    console.log('비로그인 상태에서 좋아요 클릭');
                    if (likeThis.notLoginStatusProcessingFunc) {
                        likeThis.notLoginStatusProcessingFunc();
                    }
                }
            });
        },
    },
    comment: {
        init: function (id, type, loginYn, notLoginStatusProcessingFunc) {
            this.deleteMsg = "해당 댓글을 삭제하시겠습니까?";
            this.id = id;
            this.type = type;
            this.loginYn = loginYn;
            this.notLoginStatusProcessingFunc = notLoginStatusProcessingFunc;

            this.elementIdRoot = 'commentRoot';
            this.elementIdForm = 'commentForm';
            this.elementIdCount = 'commentCount';

            this.elementIdInsertWriteArea = 'commentWriteArea';
            this.elementIdInsertTextArea = 'commentInputInsert';
            this.elementIdInsertButton = 'commentInsertButton';

            this.elementIdListArea = 'commentList';
            this.elementClassListData = 'commentListData';

            this.elementClassUpdateButton = 'update';
            this.elementClassDeleteButton = 'delete';
            this.elementClassDeclarationButton = 'declaration';

            this.elementClassUpdateContents = 'contents';
            this.elementClassUpdateWriteArea = 'commentWriteArea';
            this.elementClassUpdateTextArea = 'commentInputUpdate';
            this.elementClassUpdateConfirmButton = 'commentInputUpdateConfirm';
        },

        getHtmlModelElement : function(){
            const commentThis = this;

            let frameHtmlModelStr  = '<div class="conts_review" id="'+commentThis.elementIdRoot+'">';
            frameHtmlModelStr += '<form id="'+commentThis.elementIdForm+'">';
            frameHtmlModelStr += '<input type="hidden" name="contentsId" value="'+commentThis.id+'">';
            frameHtmlModelStr += '<input type="hidden" name="contentsType" value="'+commentThis.type+'">';
            frameHtmlModelStr += '</form>';
            frameHtmlModelStr += '<strong class="conts_tit" id="commentCount" data-cnt="0">댓글<em>0</em></strong>';
            frameHtmlModelStr += '<div class="write_wrap" id="'+commentThis.elementIdInsertWriteArea+'">';

            if( commentThis.loginYn == 'Y' ){
                frameHtmlModelStr += '<textarea placeholder="댓글 입력" name="comment" id="'+commentThis.elementIdInsertTextArea+'"></textarea>';
                frameHtmlModelStr += '<a href="javascript:;" id="'+commentThis.elementIdInsertButton+'">확인</a>';
            }else{
                frameHtmlModelStr += '<textarea placeholder="로그인하고 댓글을 입력해보세요!" disabled></textarea>';
                frameHtmlModelStr += '<a href="javascript:;">확인</a>';
            }

            frameHtmlModelStr += '</div>';
            frameHtmlModelStr += '<ul class="reviewList" id="'+commentThis.elementIdListArea+'"></ul>';
            frameHtmlModelStr += '<div class="pagging_wrap"></div>';
            frameHtmlModelStr += '</div>';

            return (new DOMParser().parseFromString(frameHtmlModelStr, 'text/html').getElementById(commentThis.elementIdRoot));
        },


        getListElementData : function(){
            const commentThis = this;
            let listElementHtml = '';

            listElementHtml += '<li class="'+commentThis.elementClassListData+'">';
            listElementHtml += '    <div class="member_re"><img class="profile" src="'+profileEmptyImgUrl+'"></div>';
            listElementHtml += '    <div class="review_info">';
            listElementHtml += '        <em class="writer"></em>';
            listElementHtml += '        <img src="'+commentButtonDivisionImgUrl+'">';
            listElementHtml += '            <span class="writer_time"></span>';
            listElementHtml += '            <img src="'+commentButtonDivisionImgUrl+'" class="declaration_line">';
            listElementHtml += '                <span class="accuse '+commentThis.elementClassDeclarationButton+'">신고</span>';
            listElementHtml += '            <img src="'+commentButtonDivisionImgUrl+'" class="update_line">';
            listElementHtml += '                 <span class="accuse '+commentThis.elementClassUpdateButton+'">수정</span>';
            listElementHtml += '            <img src="'+commentButtonDivisionImgUrl+'" class="delete_line">';
            listElementHtml += '                 <span class="accuse '+commentThis.elementClassDeleteButton+'">삭제</span>';
            listElementHtml += '                <strong class="'+commentThis.elementClassUpdateContents+'"></strong>';
            listElementHtml += '                <div class="write_wrap '+commentThis.elementClassUpdateWriteArea+'" style="display: none;">';
            listElementHtml += '                     <textarea placeholder="입력" name="comment_modify" class="'+commentThis.elementClassUpdateTextArea+'"></textarea>';
            listElementHtml += '                     <a href="javascript:;" class="'+commentThis.elementClassUpdateConfirmButton+'">확인</a>';
            listElementHtml += '                </div>';
            // listElementHtml += '                <a href="javascript:;" class="see_replies">답글보기</a>';
            // listElementHtml += '                <a href="javascript:;" class="Write_a_reply">답글달기</a>';
            listElementHtml += '    </div>';
            listElementHtml += '</li>';

            return (new DOMParser().parseFromString(listElementHtml, 'text/html').querySelector("." + commentThis.elementClassListData));
        },

        replaceLineBreakWithBrById : function(inputId){
            return  document.getElementById(inputId).value.replace(/[\n]/g,'<br>');
        },

        replaceLineBreakWithBrByElement : function(element){
            return  element.value.replace(/[\n]/g,'<br>');
        },


        replaceTargetWithCommentRoot : function(target){
            const commentThis = this;
            target.parentNode.replaceChild(commentThis.getHtmlModelElement(), target);
            return document.getElementById(commentThis.elementIdRoot);
        },


        setCount : function(cnt){
            const commentThis = this;
            document.getElementById(commentThis.elementIdCount).dataset['cnt'] = cnt;
        },

        getCount : function(){
            const commentThis = this;
            return ( (document.getElementById(commentThis.elementIdCount).dataset['cnt'] || 0) * 1 );
        },


        leadLogin : function(){
            const commentThis = this;

            if( commentThis.notLoginStatusProcessingFunc ){
                commentThis.notLoginStatusProcessingFunc();
            }
        },

        declaration : function(/*commentElement*/){
            // const commentThis = this;
            alert('댓글 신고');
        },

        update : function(id, regId){
            const commentThis = this;
            const commentElement = commentThis.getElementById(id);
            const target = commentElement.querySelector("."+commentThis.elementClassUpdateButton);
            const param = {
                commentId: id,
                regId: regId,
            }

            if (target.classList.contains("ing")) {
                target.classList.remove("ing");

                let parent = commentElement;
                let updateWriteArea = parent.querySelector('.'+commentThis.elementClassUpdateWriteArea);
                let textarea = parent.querySelector('.'+commentThis.elementClassUpdateTextArea);
                let contents = parent.querySelector('.'+commentThis.elementClassUpdateContents);

                textarea.value = contents.textContent;
                updateWriteArea.style.display = 'none';
                contents.style.display = 'block';

                target.textContent = "수정";
            }else{
                target.classList.add("ing");

                let parent = commentElement;
                let writeWrap = parent.querySelector('.'+commentThis.elementClassUpdateWriteArea);
                let contents = parent.querySelector('.'+commentThis.elementClassUpdateContents);
                let commentModifyButton = parent.querySelector('.'+commentThis.elementClassUpdateWriteArea+' .'+commentThis.elementClassUpdateConfirmButton);

                writeWrap.style.display = 'block';
                contents.style.display = 'none';
                target.textContent = "수정 취소";

                commentModifyButton.addEventListener("click", function(){
                    const thisObj = this;
                    param.comment = commentThis.replaceLineBreakWithBrByElement(thisObj.parentElement.querySelector('.'+commentThis.elementClassUpdateTextArea));

                    request.send(commentUpdateApiUrl,"PUT", param, function(resp){
                        if (resp.code === '0000') {
                            target.classList.remove("ing");
                            contents.innerHTML = resp.comment;
                            writeWrap.style.display = 'none';
                            contents.style.display = 'block';
                            target.textContent = "수정";
                        }
                    },null,{'Content-type': "application/json"})
                });
            }
        },


        delete: function (id, regId) {
            const commentThis = this;

            const param = {
                commentId: id,
                regId: regId,
            }

            request.send(commentDeleteApiUrl, "DELETE", param, function (resp) {
                // 삭제 성공
                if (resp.code == '0000') {
                    commentThis.getElementById(id).remove();

                    let cmtCnt = commentThis.getCount();

                    if (cmtCnt > 0) {
                        cmtCnt = cmtCnt - 1;
                    }

                    commentThis.setCount(cmtCnt);
                    commentThis.drawCount();
                }
            })
        },

        insertAndApplyEvents : function(){
            const commentThis = this;

            let commentInsertParam = {
                contentsId:commentThis.id,
                contentsType:commentThis.type,
                refContentsId:"0",
                comment : commentThis.replaceLineBreakWithBrById(commentThis.elementIdInsertTextArea),
            };

            request.send(commentInsertApiUrl,"POST", commentInsertParam, function(resp){
                let profile_img = profileEmptyImgUrl;

                if( resp.comment['profile'] ){
                    profile_img = resp.comment['profile'];
                }

                // 등록성공
                if( resp.code == '0000'){
                    let listElement = commentThis.getElement(
                        resp.comment['id'],
                        profile_img,
                        resp.comment['nickName'],
                        resp.comment['comment'],
                        resp.comment.regId,
                        "방금"
                    );

                    commentThis.addListBegin(listElement);
                    commentThis.resetInput();
                    commentThis.setCount(commentThis.getCount()+1);
                    commentThis.drawCount();

                    commentThis.setCommentDataInDataSet(listElement.querySelector("."+commentThis.elementClassUpdateConfirmButton), resp.comment);
                    commentThis.setCommentDataInDataSet(listElement.querySelector("."+commentThis.elementClassUpdateButton), resp.comment);
                    commentThis.setCommentDataInDataSet(listElement.querySelector("."+commentThis.elementClassDeclarationButton), resp.comment);
                    commentThis.setCommentDataInDataSet(listElement.querySelector("."+commentThis.elementClassDeleteButton), resp.comment);

                    // commentThis.crud(listElement);
                    commentThis.addEventToElement(document.getElementById('commentList').children[0])
                }
            },null,{'Content-type': "application/json"})
        },

        addListBegin : function(element){
            const commentThis = this;
            const listElement = document.getElementById(commentThis.elementIdListArea);
            listElement.insertBefore(element, listElement.firstChild);
        },

        resetInput : function(){
            const commentThis = this;

            document.getElementById(commentThis.elementIdInsertTextArea).value = '';
        },

        drawCount : function(){
            const commentThis = this;
            const nowCount = commentThis.getCount();

            document.getElementById(commentThis.elementIdCount).dataset['cnt'] = nowCount;
            document.getElementById(commentThis.elementIdCount).innerHTML = '댓글<em>'+nowCount+'</em>';
        },

        getElementById : function(commentId){
           return document.getElementById("comment-"+commentId);
        },

        getElement : function(id, profile, nickName, comment, regId, regDate){
            const commentThis = this;

            let commentElement = commentThis.getListElementData();

            commentElement.querySelector(".profile").setAttribute("src", (profile || profileEmptyImgUrl));
            commentElement.querySelector(".writer").innerHTML = nickName;
            commentElement.querySelector(".writer_time").innerHTML = regDate;
            commentElement.querySelector(".contents").innerHTML = comment;
            commentElement.querySelector("[name='comment_modify']").value = comment;

            commentElement.querySelector(".declaration_line").style.display = 'none';
            commentElement.querySelector(".declaration").style.display = 'none';
            commentElement.querySelector(".update_line").style.display = 'none';
            commentElement.querySelector(".update").style.display = 'none';
            commentElement.querySelector(".delete_line").style.display = 'none';
            commentElement.querySelector(".delete").style.display = 'none';

            if( window.loginId == regId ){
                commentElement.querySelector(".update_line").style.display = 'inline';
                commentElement.querySelector(".update").style.display = 'inline';
                commentElement.querySelector(".delete_line").style.display = 'inline';
                commentElement.querySelector(".delete").style.display = 'inline';
            }else{
                commentElement.querySelector(".declaration_line").style.display = 'inline';
                commentElement.querySelector(".declaration").style.display = 'inline';
            }

            commentElement.setAttribute("id", "comment-"+id);

            return commentElement;
        },

        setCommentDataInDataSet: function (target, oriData) {
            let changeData = {
                comment         : oriData.comment         || oriData['COMMENT'],
                confirmId       : oriData.confirmId       || oriData['CONFIRM_ID'],
                contentsId      : oriData.contentsId      || oriData['CONTENTS_ID'],
                contentsType    : oriData.contentsType    || oriData['CONTENTS_TYPE'],
                id              : oriData.id              || oriData['ID'],
                nickName        : oriData.nickName        || oriData['NICKNAME'],
                profile         : oriData.profile         || oriData['MEM_PROFILE_IMG'],
                refContentsId   : oriData.refContentsId   || oriData['REF_CONTENTS_ID'],
                regId           : oriData.regId           || oriData['REG_ID'],
            }

            Object.assign(target.dataset, changeData);
        },

        getCommentDataInDataSet: function (target, key) {
            return target.dataset[key];
        },


        drawList : function(list){
            const commentThis = this;
            if( list && list.length > 0 ){
                for(let i=0;i<list.length;i++){
                    let listObj = list[i];
                    let commentElement = commentThis.getElement(
                        listObj['ID'],
                        listObj['MEM_PROFILE_IMG'],
                        listObj['NICKNAME'],
                        (listObj['COMMENT']?listObj['COMMENT']:""),
                        listObj['REG_ID'],
                        listObj['REG_DATE']
                    );

                    commentThis.setCommentDataInDataSet(commentElement.querySelector("."+commentThis.elementClassUpdateConfirmButton), listObj);
                    commentThis.setCommentDataInDataSet(commentElement.querySelector("."+commentThis.elementClassUpdateButton), listObj);
                    commentThis.setCommentDataInDataSet(commentElement.querySelector("."+commentThis.elementClassDeclarationButton), listObj);
                    commentThis.setCommentDataInDataSet(commentElement.querySelector("."+commentThis.elementClassDeleteButton), listObj);

                    document.getElementById(commentThis.elementIdListArea).appendChild(commentElement);
                }
            }
        },

        addEventToElement : function(element){
            const commentThis = this;

            // 삭제 이벤트 적용
            element.
            querySelectorAll("."+commentThis.elementClassDeleteButton).forEach(function(obj){
                obj.addEventListener("click", function(){
                    commentThis.delete(
                        commentThis.getCommentDataInDataSet(this,"id"),
                        commentThis.getCommentDataInDataSet(this,"regId")
                    );
                })
            })

            // 수정 이벤트 적용
            element.
            querySelectorAll("."+commentThis.elementClassUpdateButton).forEach(function(obj){
                obj.addEventListener("click", function(){
                    commentThis.update(
                        commentThis.getCommentDataInDataSet(this,"id"),
                        commentThis.getCommentDataInDataSet(this,"regId")
                    );
                })
            })

            // 신고하기 이벤트 적용
            element.
            querySelectorAll("."+commentThis.elementClassDeclarationButton).forEach(function(obj){
                obj.addEventListener("click", function(){
                    commentThis.declaration(
                        commentThis.getCommentDataInDataSet(this,"id"),
                        commentThis.getCommentDataInDataSet(this,"regId")
                    );
                })
            })
        },

        render: function (tagId, listPagingFunc) {
            const commentThis = this;
            let targetElement = commentThis.replaceTargetWithCommentRoot(document.getElementById(tagId));

            if( commentThis.loginYn === 'Y' ){
                targetElement.querySelector('#'+commentThis.elementIdInsertButton).addEventListener("click", function () {
                    commentThis.insertAndApplyEvents();
                })
            }else{
                document.getElementById(commentThis.elementIdInsertWriteArea).addEventListener("click", function () {
                    commentThis.leadLogin();
                });
            }

            listPagingFunc(targetElement.querySelector("#" + commentThis.elementIdForm), commentListApiUrl, function (resp) {
                commentThis.setCount(resp.comment['cnt'])
                commentThis.drawCount();
                commentThis.drawList(resp.comment['list']);
                commentThis.addEventToElement(document.getElementById(commentThis.elementIdListArea));
            });
        },
    },
}


export default boardView;