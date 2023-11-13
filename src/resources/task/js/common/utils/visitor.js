import REQUEST from "@/resources/task/js/common/utils/request";

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

        REQUEST.send(insertApiUrl,"POST", param,null,null,{'Content-type': "application/json"});
    }
}


export default visitor;