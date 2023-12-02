import REQUEST from "@/resources/task/js/common/utils/request";

const tokenApiUrl = "/comm/token";

const token = {
    init: function (callback) {

        REQUEST.send(tokenApiUrl, "GET", {
            token: (sessionStorage.getItem("apiToken") || "")
        }, function (resp) {
            if (resp.code == '0000') {
                console.log('token : ' + resp['apiToken'])
                sessionStorage.setItem("apiToken", resp['apiToken']);

                if( callback ){
                    callback();
                }
            }
        }, null, null, false)
    },
}

export default token;