import request from "@/resources/task/js/common/utils/request";

const tokenApiUrl = "/comm/token";

const token = {
    init: function () {

        request.send(tokenApiUrl, "GET", {
            token: (sessionStorage.getItem("apiToken") || "")
        }, function (resp) {
            if (resp.code == '0000') {
                console.log('token : ' + resp['apiToken'])
                sessionStorage.setItem("apiToken", resp['apiToken']);
            }
        }, null, null, false)
    },
}

export default token;