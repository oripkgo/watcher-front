/*const refererUrl = '${header.referer}';
const origin    = location.origin;
const loginYn   = '${loginInfo.LOGIN_ID}'    ?   true    :   false;
const loginId   = '${loginInfo.LOGIN_ID}';
const loginType = '${loginInfo.MEM_TYPE}' == '00' ? "naver" : "kakao";
const memberId  = '${loginInfo.ID}';
const storyUrlList = '${globalVar.storyUrlList}';
const storyUrlView = '${globalVar.storyUrlView}';
const storyUrlWrite = '${globalVar.storyUrlWrite}';
const noticeUrlView = '${globalVar.noticeUrlView}';
const noticeUrlWrite = '${globalVar.noticeUrlWrite}';
const managementNotice = '${globalVar.managementNotice}';
const nowStoryMemId = '${memId}';
const apiToken = '${apiToken}';


 globalVar.put(     "managementMain"         , "/management/main"      );
    globalVar.put(  "managementBoard"        , "/management/board"     );
    globalVar.put(  "managementCategory"     , "/management/category"  );
    globalVar.put(  "managementNotice"       , "/management/notice"    );
//    globalVar.put("managementComment"      , "/management/comment"   );
    globalVar.put(  "managementSetting"      , "/management/setting"   );
    globalVar.put(  "managementStatistics"   , "/management/statistics");

    // 메뉴 리스트
    globalVar.put("storyUrlList"           , "/story/list"           );
    globalVar.put("storyUrlView"           , "/story/view"           );
    globalVar.put("storyUrlWrite"          , "/story/write"          );
    globalVar.put("noticeUrlView"          , "/notice/view"          );
    globalVar.put("noticeUrlWrite"         , "/notice/write"         );
    globalVar.put("noticeUrlUpdate"        , "/notice/update"         );

refererUrl = '${header.referer}';
const origin    = location.origin;
*/


const globalObj = {
    LOGIN_BTN_IMG_NAVER     : "@/resources/img/login_naver.png",
    LOGIN_BTN_IMG_KAKAO     : "@/resources/img/login_kakao.png",
    refererUrl              : document.referrer,
    origin                  : location.origin,
    storyUrlList            : "/story/list",
    storyUrlView            : "/story/view",
    storyUrlWrite           : "/story/write" ,
    noticeUrlView           : "/notice/view",
    noticeUrlWrite          : "/notice/write" ,
    managementMain          : "/management/main",
    managementBoard         : "/management/board",
    managementCategory      : "/management/category",
    managementNotice        : "/management/notice",
    managementComment       : "/management/comment",
    managementSetting       : "/management/setting",
    managementStatistics    : "/management/statistics",
    loginId                 : sessionStorage.getItem("loginId"),
    loginType               : (sessionStorage.getItem("loginType") == '00' ? "naver" : "kakao"),
    memberId                : sessionStorage.getItem("memberId"),
    nowStoryMemId           : sessionStorage.getItem("memberId"),
    apiToken                : sessionStorage.getItem("apiToken"),
}

Object.assign(window, globalObj);
