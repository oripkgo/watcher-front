import $ from 'jquery';
import "./globalVar"
import CATEGORY from "@/resources/task/js/common/utils/category"
import DATE from "@/resources/task/js/common/utils/date"
import MESSAGE from "@/resources/task/js/common/utils/message"
import REQUEST from "@/resources/task/js/common/utils/request"
import AVAILABILITY from "@/resources/task/js/common/utils/availability"
import TAGS from "@/resources/task/js/common/utils/tags"
import LIKE from "@/resources/task/js/common/utils/like"
import COMMENT from "@/resources/task/js/common/utils/comment/comment"
import PAGING from "@/resources/task/js/common/utils/paging"
import SIGN from "@/resources/task/js/common/utils/sign/sign"
import MOBILE from "@/resources/task/js/common/utils/mobile"
import VISITOR from "@/resources/task/js/common/utils/visitor"
import TOKEN from "@/resources/task/js/common/utils/token"
import DOM from "@/resources/task/js/common/utils/dom"
import NAVIGATION from "@/resources/task/js/common/utils/navigation"

let comm = function () {
    // const privateObj = {};

    const publicObj = {
        category: CATEGORY,

        date: DATE,

        message: MESSAGE,

        paging: PAGING,

        mobile: MOBILE,

        visitor: VISITOR,

        token: TOKEN,

        dom : DOM,

        navigation : NAVIGATION,

        validation: function (target) {
            return AVAILABILITY.check(target);
        },

        generateUUID: function () {
            const array = new Uint32Array(4);
            window.crypto.getRandomValues(array);
            let uuid = '';
            array.forEach(function (number, index) {
                if (index === 2) {
                    uuid += '4';
                } else if (index === 3) {
                    uuid += (number & 0x3 | 0x8).toString(16);
                } else {
                    uuid += number.toString(16);
                }
            });
            return uuid;
        },

        request: function (opt, succCall, errCall) {
            if (window['requestDissabled']) {
                return;
            }

            if (opt.form) {
                opt.data = comm.dom.serializeJson($(opt.form).serializeArray());
            }

            if (!opt.headers) {
                opt.headers = {};
            }

            //opt.headers['Authorization'] = 'Bearer '+ localStorage.getItem("apiToken");

            if (opt['contentType'] != false) {
                opt.headers['Content-type'] = "application/json";
            }

            REQUEST.send(window.apiHost + opt.url, opt.method || 'POST', opt.data, function (result) {
                if (succCall) {
                    succCall(result);
                }
            }, function (result) {
                if (errCall) {
                    errCall(result);
                } else {
                    if( result && result.message ){
                        comm.message.alert(result.message);
                    }
                }
            }, opt.headers, opt['async'])
        },

        boardView: {
            init: function (id, type) {
                const notLoginCallback = function () {
                    comm.message.confirm("해당 콘텐츠가 마음에 드시나요? 로그인 후 의견을 알려주세요.\n\n로그인 하시겠습니까?", function (Yn) {
                        if (Yn) {
                            comm.sign.in();
                        }
                    });
                }

                const confirmDeleteMsg = function (callback) {
                    comm.message.confirm("댓글을 삭제하시겠습니까?", callback);
                }

                this.loginYn = window.loginYn ? "Y" : "N";
                this.tags = TAGS;
                this.like = LIKE;
                this.comment = COMMENT;

                this.tags.init(id, type);
                this.like.init(id, type, this.loginYn, notLoginCallback);
                this.comment.init(id, type, this.loginYn, notLoginCallback, confirmDeleteMsg);
            },
            renderTag: function (tagId) {
                this.tags.render(tagId);
            },
            renderLike: function (tagId) {
                this.like.render(tagId);
            },
            renderComment: function (tagId) {
                this.comment.render(tagId);
            },
        },

        sign: SIGN,
    };

    return publicObj
}()

window.comm = comm;
export default comm;
