"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserInfo_1 = require("../common/UserInfo");
const UserGlobalModel_1 = require("../model/UserGlobalModel");
const LogsManager_1 = require("./LogsManager");
const WindowManager_1 = require("./WindowManager");
const ResourceCommonConst_1 = require("../../game/sys/consts/ResourceCommonConst");
const ShareTvOrderFunc_1 = require("../../game/sys/func/ShareTvOrderFunc");
const ShareOrTvServer_1 = require("../server/ShareOrTvServer");
const TranslateFunc_1 = require("../func/TranslateFunc");
const KariqiShareManager_1 = require("./KariqiShareManager");
const KariquShareConst_1 = require("../consts/KariquShareConst");
const JumpManager_1 = require("./JumpManager");
const JumpConst_1 = require("../../game/sys/consts/JumpConst");
const GameSwitch_1 = require("../common/GameSwitch");
const Message_1 = require("../common/Message");
const VideoAdvEvent_1 = require("../event/VideoAdvEvent");
const BannerComp_1 = require("../platform/comp/BannerComp");
const TableUtils_1 = require("../utils/TableUtils");
const CountsCommonModel_1 = require("../model/CountsCommonModel");
const ResourceConst_1 = require("../../game/sys/consts/ResourceConst");
/**
 * 分享或视频广告序列管理类
 */
class ShareOrTvManager {
    constructor() {
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new ShareOrTvManager();
        }
        return this._instance;
    }
    /**
     * 获取本次应该是视频还是分享
     * @param id
     * @param failIsShare 视频拉取失败是否转分享
     */
    getShareOrTvType(id = null, failType = ShareOrTvManager.TYPE_SHARE, firstType = ShareOrTvManager.TYPE_ADV) {
        if (UserInfo_1.default.isWeb()) {
            UserInfo_1.default.platform.loadAdvFailed = false;
        }
        var successType = ShareOrTvManager.TYPE_QUICKRECEIVE;
        var index = 0;
        if (id) {
            var orderCfg = ShareTvOrderFunc_1.default.instance.getOrder(id);
            index = CountsCommonModel_1.default.instance.getShareTvCountById(id);
            var info = KariqiShareManager_1.default.getShareOrTvType(id, index);
            //如果是走卡日曲的
            if (info) {
                LogsManager_1.default.echo("kariqu shareTvinfo", TableUtils_1.default.safelyJsonStringfy(info));
                successType = info.type;
            }
            else {
                var order;
                // 默认视频
                var types;
                var orderType = 0;
                if (orderCfg) {
                    if (orderCfg.manOrder) {
                        //判断是否男性授权用户
                        if (UserInfo_1.default.userSex == 1) {
                            order = orderCfg.manOrder;
                            // LogsManager.echo("sanmen        走了manOrder序列");
                        }
                        else {
                            order = orderCfg.order;
                            // LogsManager.echo("sanmen        走了order序列");
                        }
                    }
                    else {
                        order = orderCfg.order;
                    }
                    if (order && order.length) {
                        if (index >= order.length) {
                            index = index % order.length;
                        }
                        orderType = Number(order[index]);
                    }
                    switch (orderType) {
                        case ShareOrTvManager.ORDER_ID_SHARE:
                            successType = ShareOrTvManager.TYPE_SHARE;
                            break;
                        case ShareOrTvManager.ORDER_ID_VIDEO:
                            successType = ShareOrTvManager.TYPE_ADV;
                            break;
                        case ShareOrTvManager.ORDER_ID_SHAREVIDEO:
                            successType = ShareOrTvManager.TYPE_SHAREVIDEO;
                            break;
                    }
                }
            }
        }
        else {
            successType = firstType;
        }
        var isFail = false;
        switch (successType) {
            case ShareOrTvManager.TYPE_SHARE:
                if (this.canShare()) {
                    types = ShareOrTvManager.TYPE_SHARE;
                }
                else {
                    isFail = true;
                }
                break;
            case ShareOrTvManager.TYPE_ADV:
                // 视频
                if (this.canAdv()) {
                    types = ShareOrTvManager.TYPE_ADV;
                }
                else {
                    // 手动加载视频
                    UserInfo_1.default.platform.loadVideoAd();
                    isFail = true;
                }
                break;
            case ShareOrTvManager.TYPE_SHAREVIDEO:
                // 分享录屏
                if (this.canShareVideo()) {
                    types = ShareOrTvManager.TYPE_SHAREVIDEO;
                }
                else {
                    isFail = true;
                }
                break;
        }
        if (isFail) {
            // LogsManager.echo("shareOrder fail :", failType)
            // 失败后使用哪种类型
            switch (failType) {
                case ShareOrTvManager.TYPE_SHARE:
                    if (this.canShare()) {
                        types = ShareOrTvManager.TYPE_SHARE;
                    }
                    else if (this.canAdv()) {
                        types = ShareOrTvManager.TYPE_ADV;
                    }
                    else {
                        types = ShareOrTvManager.TYPE_QUICKRECEIVE;
                    }
                    break;
                case ShareOrTvManager.TYPE_ADV:
                    types = this.canAdv() ? ShareOrTvManager.TYPE_ADV : ShareOrTvManager.TYPE_QUICKRECEIVE;
                    break;
                case ShareOrTvManager.TYPE_SHAREVIDEO:
                    if (this.canShareVideo()) {
                        types = ShareOrTvManager.TYPE_SHAREVIDEO;
                    }
                    else if (this.canAdv()) {
                        types = ShareOrTvManager.TYPE_ADV;
                    }
                    else {
                        types = ShareOrTvManager.TYPE_QUICKRECEIVE;
                    }
                    break;
                case ShareOrTvManager.TYPE_QUICKRECEIVE:
                    types = ShareOrTvManager.TYPE_QUICKRECEIVE;
                    break;
            }
        }
        return types;
    }
    /**
    * 判断是否可以分享
    */
    canShare() {
        if (!UserInfo_1.default.platform.canShare()) {
            return false;
        }
        // 分享开关开启
        // 分享次数够
        var times = Number(UserGlobalModel_1.default.instance.getShareNum());
        if (times <= 0) {
            return false;
        }
        LogsManager_1.default.echo("shareOrTv 还有分享次数，走了分享");
        return true;
    }
    /**
     * 判断是否可以显示视频
     */
    canAdv() {
        // 开关开启 且 拉取成功
        if (!UserInfo_1.default.platform.canAdv()) {
            return false;
        }
        //如果拉取失败了,卡日曲埋点
        if (UserInfo_1.default.platform.loadAdvFailed) {
            // KariqiShareManager.addAdvPoint({ eventId: KariquShareConst.KARIQU_SHOWADV_FAIL, name: ShareOrTvManager.curOrderName }, true)
            return false;
        }
        return true;
    }
    /**
     * 判断是否可以分享录屏
     */
    canShareVideo() {
        return UserInfo_1.default.platform.canShareVideo();
    }
    /**设置分享或视频图标 */
    setShareOrTvImg(id, type) {
        if (id) {
            type = this.getShareOrTvType(id);
        }
        if (type == ShareOrTvManager.TYPE_SHARE || type == ShareOrTvManager.TYPE_SHAREVIDEO) {
            return ResourceCommonConst_1.default.SHARE_IMG;
        }
        else {
            return ResourceCommonConst_1.default.VIDEO_IMG;
        }
    }
    /**发送看视频或分享请求
     * id:是否是需要走序列的模块，id在GlobalFUnc中配置好了，shareLine_xxx
     * types：默认类型，为了让没有id的模块根据传入的类型决定本次是视频还是分享  ShareOrTvManager.TYPE_SHARE/adv
     * shareData:分享内容
     * successCall:成功回调
     * closeCall:失败或关闭回调
     * thisObj：谁监听的
     * failType: 看视频失败以后是否转分享 1 转分享 2 转录屏
     */
    shareOrTv(id, firstType, shareData, successCall, closeCall, thisObj, failType = ShareOrTvManager.TYPE_SHARE) {
        if (id) {
            ShareOrTvManager.leadTypeId = id;
        }
        var type = this.getShareOrTvType(id, failType, firstType);
        LogsManager_1.default.echo("krma. shareOrTv type " + type);
        shareData = shareData || {};
        var doFaillVedioCall = () => {
            closeCall && closeCall.call(thisObj, type);
            ShareOrTvManager.leadTypeId = null;
            //看视频失败
            // KariqiShareManager.addAdvPoint({ eventId: KariquShareConst.KARIQU_SHOWADV_FAIL, name: ShareOrTvManager.curOrderName }, true)
        };
        if (id) {
            var orderCfg = ShareTvOrderFunc_1.default.instance.getOrder(id);
            if (orderCfg.desc) {
                ShareOrTvManager.curOrderName = TranslateFunc_1.default.instance.getTranslate(orderCfg.desc);
            }
        }
        switch (type) {
            case ShareOrTvManager.TYPE_ADV:
                //尝试看视频
                KariqiShareManager_1.default.addAdvPoint({ eventId: KariquShareConst_1.default.KARIQU_TRYADV, name: ShareOrTvManager.curOrderName }, true);
                if (GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_ADV)) { //看视频
                    closeCall && closeCall.call(thisObj, type);
                    return;
                }
                //额外数据
                var extraData = {
                    callback: this.setVideoExtraCall,
                    thisObj: this
                };
                if (BannerComp_1.BannerComp.instance) {
                    BannerComp_1.BannerComp.instance.destroy(true);
                }
                ;
                UserInfo_1.default.platform.showVideoAd((res) => {
                    ShareOrTvServer_1.default.shareOrTvSend({ type: ShareOrTvManager.TYPE_ADV }, () => {
                        successCall && successCall.call(thisObj, type);
                        ShareOrTvManager.leadTypeId = null;
                        //看视频成功
                        Message_1.default.instance.send(VideoAdvEvent_1.default.VIDEOADV_EVENT_ADV_SUCCESS);
                        KariqiShareManager_1.default.addAdvPoint({ eventId: KariquShareConst_1.default.KARIQU_SHOWADV_SUCC, name: ShareOrTvManager.curOrderName }, true);
                    }, this);
                }, (res) => {
                    //卡日曲取消视频失败不走次数
                    if (KariqiShareManager_1.default.checkIsKariquChannel()) {
                        doFaillVedioCall();
                        return;
                    }
                    ShareOrTvServer_1.default.shareOrTvSend({ type: ShareOrTvManager.TYPE_ADV }, () => {
                        doFaillVedioCall();
                    }, this);
                }, this, extraData);
                break;
            case ShareOrTvManager.TYPE_SHARE:
                if (!this.canShare()) { //分享
                    closeCall && closeCall.call(thisObj, type);
                    return;
                }
                UserInfo_1.default.platform.share(shareData.id, shareData.extraData, (res) => {
                    var callback = null;
                    if (res) {
                        callback = successCall;
                    }
                    else {
                        callback = closeCall;
                    }
                    //如果是卡日曲渠道的
                    if (KariqiShareManager_1.default.checkIsKariquChannel()) {
                        //卡日曲分享失败不扣次数
                        if (!res) {
                            ShareOrTvManager.leadTypeId = null;
                            callback && callback.call(thisObj, type);
                            return;
                        }
                    }
                    ShareOrTvServer_1.default.shareOrTvSend({ type: ShareOrTvManager.TYPE_SHARE }, () => {
                        ShareOrTvManager.leadTypeId = null;
                        callback && callback.call(thisObj, type);
                    }, this);
                }, this);
                break;
            case ShareOrTvManager.TYPE_SHAREVIDEO:
                UserInfo_1.default.platform.shareVideo((res) => {
                    var callback = null;
                    if (res) {
                        callback = successCall;
                    }
                    else {
                        callback = closeCall;
                    }
                    if (!res) {
                        ShareOrTvManager.leadTypeId = null;
                        callback && callback.call(thisObj, type);
                        return;
                    }
                    ShareOrTvServer_1.default.shareOrTvSend({ type: ShareOrTvManager.TYPE_SHAREVIDEO }, () => {
                        ShareOrTvManager.leadTypeId = null;
                        callback && callback.call(thisObj, type);
                    }, this);
                }, this);
                break;
            case ShareOrTvManager.TYPE_QUICKRECEIVE:
                if (UserInfo_1.default.isWX() || UserInfo_1.default.isQQGame() || UserInfo_1.default.isTT()) {
                    UserInfo_1.default.platform.showPopTip(TranslateFunc_1.default.instance.getTranslate("#tid_share_or_tv_tishi", "localTranslateCommon"), TranslateFunc_1.default.instance.getTranslate("#tid_share_or_tv_error", "localTranslateCommon"), {
                        showCancel: false,
                        success(res) {
                            closeCall && closeCall.call(thisObj, type);
                        }
                    });
                }
                else {
                    // OPPO不支持模态弹窗
                    WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_share_or_tv_error", "localTranslateCommon"));
                    closeCall && closeCall.call(thisObj, type);
                }
        }
        return type;
    }
    //看视频额外参数中的回调操作
    setVideoExtraCall(result) {
        if (KariqiShareManager_1.default.checkIsKariquChannel()) {
            if (result) {
                //看完退出
                KariqiShareManager_1.default.addAdvPoint({ eventId: KariquShareConst_1.default.KARIQU_END, name: ShareOrTvManager.curOrderName }, true);
            }
            else {
                //中途退出
                KariqiShareManager_1.default.addAdvPoint({ eventId: KariquShareConst_1.default.KARIQU_CENTER_EXIT, name: ShareOrTvManager.curOrderName }, true);
            }
        }
    }
    //根据视频分享类型获取imageskin
    getFreeImgSkin(freeType) {
        var skin = "";
        if (freeType == ShareOrTvManager.TYPE_SHARE) {
            if (UserInfo_1.default.isWX()) {
                if (JumpManager_1.default.jumpChannel == JumpConst_1.default.JUMP_CHANNEL_KARIQU) {
                    skin = ResourceConst_1.default.SHARE_PNG;
                }
                else {
                    skin = ResourceConst_1.default.ADV_PNG;
                }
            }
            else {
                skin = ResourceConst_1.default.SHARE_PNG;
            }
        }
        else if (freeType == ShareOrTvManager.TYPE_ADV) {
            skin = ResourceConst_1.default.ADV_PNG;
        }
        else if (freeType == ShareOrTvManager.TYPE_SHAREVIDEO) {
            skin = ResourceConst_1.default.ADV_PNG;
        }
        return skin;
    }
}
exports.default = ShareOrTvManager;
ShareOrTvManager.TYPE_SHARE = 1;
ShareOrTvManager.TYPE_ADV = 2;
ShareOrTvManager.TYPE_QUICKRECEIVE = 3; //视屏和分享都不行
ShareOrTvManager.TYPE_SHAREVIDEO = 4; //分享视频
/** 配表序列意义：视频 */
ShareOrTvManager.ORDER_ID_VIDEO = 0;
/** 配表序列意义：分享 */
ShareOrTvManager.ORDER_ID_SHARE = 1;
/** 配表序列意义：分享录屏 */
ShareOrTvManager.ORDER_ID_SHAREVIDEO = 2;
ShareOrTvManager.leadTypeId = null; //当前诱导分享的序列id
//# sourceMappingURL=ShareOrTvManager.js.map