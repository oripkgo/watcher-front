<script>
  import $ from 'jquery';
  import signNaverSuccess from "@/resources/task/js/common/utils/sign/signNaverSuccess";

  const token = process.env.VUE_APP_LOGIN_TOKEN_NAVER;
  const callbackUrl = process.env.VUE_APP_LOGIN_CALLBACK_NAVER;

  export default {
    name : "naverLoginSuccessPage",

    mounted() {
      const $this = this;
      window['naverLoginSuccess'] = $this;
      window["$"] = $;

      signNaverSuccess.init(window['naver_id_login'], token, callbackUrl);
    },
  }
</script>