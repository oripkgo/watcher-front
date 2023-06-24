<script>
  import $ from 'jquery';
  import naverLoginSuccess from "@/resources/task/js/business/login/naverLoginSuccess.js";
  const token = process.env.VUE_APP_LOGIN_TOKEN_NAVER;
  const callbackUrl = process.env.VUE_APP_LOGIN_CALLBACK_NAVER;

  export default {
    name : "naverLoginSuccessPage",
    mounted() {
      window["$"] = $
      naverLoginSuccess.init(window['naver_id_login'], token, callbackUrl);
    },
  }
</script>