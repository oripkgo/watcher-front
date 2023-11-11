import request from "@/resources/task/js/common/utils/request";

const tokenApiUrl = "/comm/token";
// const loginApiUrl = "";
// const logoutApiUrl = "";

const sign = {
    apiUrl: {
        in: "",
        out: "",
    },

    in: function () {

    },
    out: function () {

    },
    isLogin: function () {

    },

    getToken: function () {
        let result = "";

        request.send(tokenApiUrl, "GET", {
            token: (sessionStorage.getItem("apiToken") || "")
        }, function (resp) {
            if (resp.code == '0000') {
                result = resp.apiToken;
            }
        }, null, null, false)

        console.log('token : ' + result)
        return result;
    },
}


export default sign;