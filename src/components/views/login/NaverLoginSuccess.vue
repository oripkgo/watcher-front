<script>
  import $ from 'jquery';
  import naverLoginSuccess from "@/resources/task/js/business/login/naverLoginSuccess.js";
  const token = "ThouS3nsCEwGnhkMwI1I";
  const callbackUrl = "http://localhost:8080/naverLoginSuccess";

  export default {
    name : "naverLoginSuccessPage",
    mounted() {
      window["$"] = $
      naverLoginSuccess.init(window.naver_id_login, token, callbackUrl);
    },
  }
</script>