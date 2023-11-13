import PAGING from "@/resources/task/js/common/utils/paging";

const commentListApiUrl = '/board/comment/select';
const commentList = {
    // init: function (id, type, target) {
    //
    // },

    get: function (form, callback) {
        PAGING.getList(form, commentListApiUrl, callback, 1, 10)
    },

    empty: function (target) {
        PAGING.emptyList(target)
    },

}


export default commentList;