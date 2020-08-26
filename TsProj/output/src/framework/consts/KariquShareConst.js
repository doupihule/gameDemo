"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
  * 卡日曲分享相关常量
  */
class KariquShareConst {
    /**
     *  初始化卡日曲url
     * @param map 里面的key 和 上面的静态变量名一致. 做覆盖逻辑
     * {
     *    KARIQU_LOGIN_URL:...
     *    KARIQU_SAVELEVEL_URL:...
     *
     * }
     */
    static initKariquUrl(map) {
        for (var i in map) {
            this[i] = map[i];
        }
    }
}
exports.default = KariquShareConst;
//登录链接
KariquShareConst.KARIQU_LOGIN_URL = "https://wxxyx.17tcw.com:7851/fcqs/login/reqLogin";
//保存关卡
KariquShareConst.KARIQU_SAVELEVEL_URL = "https://wxxyx.17tcw.com:7851/fcqs/game/reqSaveUser";
//查询配置信息
KariquShareConst.KARIQU_CONFIG_URL = "https://wxxyx.17tcw.com:7851/fcqs/lobby/reqConfig";
//游戏埋点
KariquShareConst.KARIQU_GAMESTATIC_URL = "https://conglin.17tcw.com:8082/collect/pushEvents";
//分享图片信息
KariquShareConst.KARIQU_SHAREIMAGEINFO_URL = "https://xyx.17tcw.com:5267/xyx/basic/reqFenxiang";
KariquShareConst.KARIQU_SHAREBEGIN_URL = "https://xyx.17tcw.com:5201/xyx/statis/reqBeginShare";
//分享策略配置
KariquShareConst.KARIQU_SHAREMETHOD_URL = "https://wxxyx.17tcw.com:8500/zzzw/game/getShareStrategy";
//上报分享链接
KariquShareConst.KARIQU_POSTENTERGAME_URL = "https://wxxyx.17tcw.com:8500/zzzw/game/clickShare";
//
//卡日曲渠道标签  比如战争之王是 krq_zzzw, 飞车枪神是 krq_fcqs
KariquShareConst.KARIQU_CHANNEL_TITLE = "krq_zzzw";
//埋点内容
//获取openId
KariquShareConst.KARIQU_GETOPENID = "GotOpenId";
//获取场景值
KariquShareConst.KARIQU_GETLAUNCHSCENE = "LaunchScene";
//首页开始游戏
KariquShareConst.KARIQU_GAMEMAIN = "HomeStartGame";
//结算
KariquShareConst.KARIQU_RESULT = "GameEnd";
//开始战斗
KariquShareConst.KARIQU_STARTGAME = "PlayGame";
//通关成功 . extraNum 传关卡值
KariquShareConst.KARIQU_LEVELSTART = "GameStart";
//通关成功    detail 传{"时长":"20"}数值单位秒，extraNum 传关卡值
KariquShareConst.KARIQU_GAMESUCESS = "GameSuccess";
//通关失败 detail 传{"时长":"20"}数值单位秒，extraNum 传关卡值
KariquShareConst.KARIQU_GAMEFAIL = "GameFailed";
//尝试播放
KariquShareConst.KARIQU_TRYADV = "TryPlayVideoAd";
//播放成功
KariquShareConst.KARIQU_SHOWADV_SUCC = "VideoAdSuccess";
//播放失败
KariquShareConst.KARIQU_SHOWADV_FAIL = "VideoAdFailed";
//中途退出
KariquShareConst.KARIQU_CENTER_EXIT = "VideoAdClosed";
//看完退出
KariquShareConst.KARIQU_END = "VideoAdEnded";
//在线时长
KariquShareConst.KARIQU_ONLINETIME = "onlinetime";
//是否开启banner样式的互推 默认不开启.根据需要配置.  
//在GameConst.kariquUrlMap里面配置isOpenBannerStyleJump即可. 会把GameConst.kariquUrlMap里面的所有属性全部覆盖到 KariquShareConst里
KariquShareConst.isOpenBannerStyleJump = false;
//# sourceMappingURL=KariquShareConst.js.map