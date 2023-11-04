import request from "@/resources/task/js/common/utils/request";

const boardViewInitApiUrl = '/board/view/init';


const boardView = {
    init: function (id, type) {
        let boardViewThis = this;
        boardViewThis.id = id;
        boardViewThis.type = type;

        request.send(boardViewInitApiUrl, "GET", {
            "contentsType": boardViewThis.type,
            "contentsId": boardViewThis.id,
        }, function (result) {
            boardViewThis.viewInitResult = result;
        }, null, null, false)
    },

    renderTags : function(tagId){
        let result = "<strong class=\"conts_tit\">태그</strong>";
        let targetElement = document.getElementById(tagId);

        let tags = this.viewInitResult['tags'] || this.viewInitResult['TAGS'];

        if( !tags ){
            targetElement.style.display = 'none';
            return;
        }

        let tags_arr = tags.split(",");

        for( let i=0;i<tags_arr.length;i++ ){
            result += '<a href="javascript:;">#'+tags_arr[i]+'</a>';
        }

        targetElement.innerHTML = result;
        targetElement.style.display = 'block';
    },

    renderLike : function(tagId, callbackNotLogin){
        const boardViewThis = this;
        let targetElement = document.getElementById(tagId);

        targetElement.setAttribute("data-contentsId", boardViewThis.id);
        targetElement.setAttribute("data-contentsType", boardViewThis.type);
        targetElement.setAttribute("data-likeId", boardViewThis.viewInitResult['LIKE_ID']);
        targetElement.setAttribute("data-likeYn", boardViewThis.viewInitResult['LIKE_YN']);
        targetElement.setAttribute("data-likeType", '01');

        if( boardViewThis.viewInitResult['LIKE_YN'] == 'N' ){
            targetElement.style.background = "url('"+require("@/resources/img/zim_ico.png")+"') no-repeat left center";
        }else{
            targetElement.style.background = "url('"+require("@/resources/img/icon_heart_on.png")+"') no-repeat left center";
        }

        targetElement.addEventListener("click", function() {
            // const $this = $(this);
            // const data = targetElement.dataset;

            // if( boardViewThis.viewInitResult['loginYn'] == 'Y' ){
            //
            // }else{
            //     console.log('비로그인 상태에서 좋아요 클릭');
            //     if( callbackNotLogin ){
            //         callbackNotLogin();
            //     }
            // }

            if( callbackNotLogin ){
                callbackNotLogin();
            }
        });

        //targetElement.innerHTML = result;
    },

    renderComment : function(tagId){
        let result = "";
        let targetElement = document.getElementById(tagId);




        targetElement.innerHTML = result;
    },
}


export default boardView;