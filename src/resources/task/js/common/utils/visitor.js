import request from "@/resources/task/js/common/utils/request";

const insertApiUrl = '/visitor/insert';

const visitor = {
    save: function (memId, refererUrl) {
        const callUrl = location.href;
        const callSvc = location.pathname;
        const param = {
            accessPath: refererUrl,
            accPageUrl: callUrl,
            callService: callSvc,
            visitStoryMemId: memId,
        };

        request.send(insertApiUrl,"POST", param,null,null,{'Content-type': "application/json"});
    }
}


export default visitor;