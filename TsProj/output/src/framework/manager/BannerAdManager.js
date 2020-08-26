"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GameUtils_1 = require("../../utils/GameUtils");
const LogsManager_1 = require("./LogsManager");
const GlobalParamsFunc_1 = require("../../game/sys/func/GlobalParamsFunc");
const SceneReference_1 = require("../consts/SceneReference");
const GameSwitch_1 = require("../common/GameSwitch");
const BannerComp_1 = require("../platform/comp/BannerComp");
const RecommendationBannerComp_1 = require("../platform/comp/RecommendationBannerComp");
const UserInfo_1 = require("../common/UserInfo");
const BannerOrRecommendServer_1 = require("../server/BannerOrRecommendServer");
const UserModel_1 = require("../../game/sys/model/UserModel");
const TopViewAutoComp_1 = require("../platform/comp/TopViewAutoComp");
const CommonEvent_1 = require("../event/CommonEvent");
const Message_1 = require("../common/Message");
const KariqiShareManager_1 = require("./KariqiShareManager");
const BannerStyleJumpComp_1 = require("../platform/comp/BannerStyleJumpComp");
/**banner */
class BannerAdManager {
    static get instance() {
        if (!this._instance) {
            this._instance = new BannerAdManager();
        }
        return this._instance;
    }
    recvMsg(cmd, data) {
        if (cmd == CommonEvent_1.default.WHITE_LIST_CHANGE) {
            // 原来不是黑名单，返回收到IP在黑名单之内。设置黑名单字段。并通知黑名单更新
            GameUtils_1.default.canGift = false;
            GameUtils_1.default.canLeadBanner = false;
        }
    }
    /**设置开关值 */
    static setBannerSwitch() {
        if (UserInfo_1.default.isWX()) {
            Message_1.default.instance.add(CommonEvent_1.default.WHITE_LIST_CHANGE, BannerAdManager.instance);
        }
        GameUtils_1.default.canQuickBanner = !GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_QUICKBANNER);
        if (!SceneReference_1.default.isInBannerScene()) {
            GameUtils_1.default.canGift = false;
            GameUtils_1.default.canLeadBanner = false;
            LogsManager_1.default.echo(" GameUtils.banner false");
            return;
        }
        else {
            GameUtils_1.default.canLeadBanner = !GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_LEADBANNER);
            GameUtils_1.default.canGift = !GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_MYSTERIOUSGIFT);
        }
        if (!BannerAdManager.isPlatformSupport()) {
            LogsManager_1.default.echo("平台不支持banner banner开关关闭");
            GameUtils_1.default.canQuickBanner = false;
            GameUtils_1.default.canGift = false;
            GameUtils_1.default.canLeadBanner = false;
        }
        LogsManager_1.default.echo(" GameUtils.canQuickBanner:", GameUtils_1.default.canQuickBanner);
        LogsManager_1.default.echo(" GameUtils.canLeadBanner:", GameUtils_1.default.canLeadBanner);
        LogsManager_1.default.echo(" GameUtils.canGift:", GameUtils_1.default.canGift);
    }
    static isPlatformSupport() {
        if (UserInfo_1.default.isTT()) {
            LogsManager_1.default.echo("krma. UserInfo.platform.getSystemInfo().appName " + UserInfo_1.default.platform.getSystemInfo().appName);
            if (UserInfo_1.default.platform.getSystemInfo().appName == "Douyin" || UserInfo_1.default.platform.getSystemInfo().appName == "PPX") {
                LogsManager_1.default.echo("krma. 该渠道不支持banner", UserInfo_1.default.platform.getSystemInfo().appName);
                return false;
            }
        }
        return true;
    }
    /**
     * 预加载 banner
     */
    static registerBanner() {
        // 广告banner预加载
        BannerComp_1.BannerComp.register();
        // 推荐banner预加载
        RecommendationBannerComp_1.RecommendationBannerComp.register();
    }
    /**
     * 添加普通banner
     * style:width 定宽 retio定比例
     */
    static addBannerQuick(parent, onErrorCallback = null, callbackObj = null, hideType = TopViewAutoComp_1.TopViewAutoComp.HIDE_TYPE_DESTROY, quickBannerType = null, style = null) {
        if (!parent.windowName) {
            LogsManager_1.default.errorTag("bannerParamsError", "传入的对象没有windowName");
            return;
        }
        var jumpBannerState = KariqiShareManager_1.default.getOneUIBannerJumpState(parent.windowName);
        //如果状态是1 表示优先显示单列互推
        if (jumpBannerState == 1) {
            BannerStyleJumpComp_1.default.instance.showJump(parent, onErrorCallback, callbackObj);
            return;
        }
        LogsManager_1.default.echo("zm.addBannerParent-----------", parent.windowName);
        if (GameUtils_1.default.canQuickBanner) {
            // 没有传失败回调，默认banner失败加载推荐组件
            if (UserInfo_1.default.isWX()) {
                var thisObj = this;
                if (!quickBannerType) {
                    quickBannerType = Number(GameSwitch_1.default.getSwitchState(GameSwitch_1.default.SWITCH_QUICKBANNER_TYPE));
                }
                //banner加载失败回调
                var bannerErrorBack = function () {
                    BannerComp_1.BannerComp.cancleOneView(parent.windowName);
                    //如果banner加载失败  那么
                    if (jumpBannerState == 0) {
                        BannerStyleJumpComp_1.default.instance.showJump(parent, onErrorCallback, callbackObj);
                        return;
                    }
                    //如果是banner>推荐
                    if (quickBannerType == BannerAdManager.QUICK_BANNER_TYPE_AD_COMMEND) {
                        RecommendationBannerComp_1.RecommendationBannerComp.create(parent, onErrorCallback, callbackObj, hideType);
                        return;
                    }
                    //直接做错误回调
                    if (onErrorCallback) {
                        onErrorCallback.call(callbackObj);
                    }
                };
                switch (quickBannerType) {
                    case BannerAdManager.QUICK_BANNER_TYPE_AD:
                        // banner
                        BannerComp_1.BannerComp.create(parent, bannerErrorBack, this, hideType, style);
                        break;
                    case BannerAdManager.QUICK_BANNER_TYPE_AD_COMMEND:
                        // banner>推荐
                        BannerComp_1.BannerComp.create(parent, bannerErrorBack, this, hideType, style);
                        break;
                    case BannerAdManager.QUICK_BANNER_TYPE_COMMEND:
                        // 推荐
                        RecommendationBannerComp_1.RecommendationBannerComp.create(parent, onErrorCallback, callbackObj, hideType);
                        break;
                    case BannerAdManager.QUICK_BANNER_TYPE_COMMEND_AD:
                        BannerComp_1.BannerComp.cancleOneView(parent.windowName);
                        // 推荐>banner
                        RecommendationBannerComp_1.RecommendationBannerComp.create(parent, () => {
                            BannerComp_1.BannerComp.create(parent, bannerErrorBack, this, hideType, style);
                        }, thisObj, hideType);
                        break;
                }
            }
            else {
                BannerComp_1.BannerComp.create(parent, onErrorCallback, callbackObj, hideType, style);
            }
        }
        return null;
    }
    static turnToShowUIJump(parent) {
    }
    /**隐藏直接添加的banner */
    static hideQuickBanner() {
        if (GameUtils_1.default.canQuickBanner) {
            // AdVideoManager.instance.hideBanner();
        }
    }
    /**添加诱导性banner */
    static addLeadBanner(obj, pos1, pos2) {
        // var times = FuncGlobalParams.getInstance().getDataByTwoId("bannerPopupTimeDelay", "num");
        // obj.bottom = 62;
        // if (GameUtils.canLeadBanner) {
        //     Laya.timer.once(times, this, () => {
        //         AdVideoManager.instance.showBanner();
        //         obj.bottom = pos2;
        //         LogsManager.echo("openBanner----------")
        //     });
        // }
    }
    /**隐藏诱导性banner */
    static hideLeadBanner() {
        // if (GameUtils.canLeadBanner) {
        //     AdVideoManager.instance.hideBanner();
        //     Laya.timer.clearAll(this);
        //     LogsManager.echo("closeBanner----------")
        // }
    }
    /**
     * 神秘礼包banner
     */
    static addGiftBanner(parent, onErrorCallback = null, callbackObj = null, hideType = TopViewAutoComp_1.TopViewAutoComp.HIDE_TYPE_DESTROY, orderType = null, style = null) {
        if (GameUtils_1.default.canGift) {
            if (UserInfo_1.default.isWX()) {
                var thisObj = this;
                if (orderType == null) {
                    orderType = Number(GameSwitch_1.default.getSwitchState(GameSwitch_1.default.SWITCH_MYSTERIOUSGIFT_TYPE));
                }
                switch (orderType) {
                    case BannerAdManager.BANNER_ORDER_TYPE_AD:
                        // banner>推荐
                        BannerComp_1.BannerComp.create(parent, () => {
                            RecommendationBannerComp_1.RecommendationBannerComp.create(parent, onErrorCallback, callbackObj, hideType);
                        }, thisObj, hideType, style);
                        break;
                    case BannerAdManager.BANNER_ORDER_TYPE_RECOMMEND:
                        // 推荐>banner
                        RecommendationBannerComp_1.RecommendationBannerComp.create(parent, () => {
                            BannerComp_1.BannerComp.create(parent, onErrorCallback, callbackObj, hideType, style);
                        }, thisObj, hideType);
                        break;
                    case BannerAdManager.BANNER_ORDER_TYPE_ORDER:
                        // 按序列显示
                        var type = BannerAdManager.BANNER_TYPE_AD;
                        var orderCfg = GlobalParamsFunc_1.default.instance.getDataArray("selectBannerList");
                        var bannerOrder = UserModel_1.default.instance.getBannerOrder();
                        if (orderCfg) {
                            bannerOrder = bannerOrder % (orderCfg.length);
                            type = Number(orderCfg[bannerOrder]);
                        }
                        if (type == BannerAdManager.BANNER_TYPE_AD) {
                            // banner>推荐
                            LogsManager_1.default.echo('banner order type: banner>推荐', type);
                            BannerComp_1.BannerComp.create(parent, () => {
                                RecommendationBannerComp_1.RecommendationBannerComp.create(parent, onErrorCallback, callbackObj, hideType);
                            }, thisObj, hideType, style);
                        }
                        else if (type == BannerAdManager.BANNER_TYPE_RECOMMEND) {
                            // 推荐>banner
                            LogsManager_1.default.echo('banner order type: 推荐>banner', type);
                            RecommendationBannerComp_1.RecommendationBannerComp.create(parent, () => {
                                BannerComp_1.BannerComp.create(parent, onErrorCallback, callbackObj, hideType, style);
                            }, thisObj, hideType);
                        }
                        else {
                            LogsManager_1.default.errorTag('banner_type_error', 'banner_type_error:' + type);
                        }
                        // 更新序列
                        BannerOrRecommendServer_1.BannerOrRecommendServer.BannerOrRecommendSend();
                        break;
                    case BannerAdManager.BANNER_ORDER_TYPE_JUST_BANNER:
                        // banner
                        BannerComp_1.BannerComp.create(parent, onErrorCallback, callbackObj, hideType, style);
                        break;
                }
            }
            else {
                BannerComp_1.BannerComp.create(parent, onErrorCallback, callbackObj, hideType, style);
            }
        }
        return null;
    }
    /**
         * 隐藏某个页面的banner
         */
    static hideBanner(windowName) {
        BannerComp_1.BannerComp.cancleOneView(windowName);
    }
    //给某个界面添加顶部互推
    static addTopBannerStyleJump(parent) {
        //如果没有显示顶部导量条  return
        if (!KariqiShareManager_1.default.checkIsShowTopJump()) {
            return;
        }
        BannerStyleJumpComp_1.default.instance.showShowTopJump(parent);
    }
    /**隐藏神秘礼包banner */
    static hideGiftBanner() {
        if (GameUtils_1.default.canGift) {
            // AdVideoManager.instance.hideBanner();
        }
    }
}
exports.default = BannerAdManager;
/** banner类型：广告banner */
BannerAdManager.BANNER_TYPE_AD = 1;
/** banner类型：推荐banner */
BannerAdManager.BANNER_TYPE_RECOMMEND = 2;
/***************** BANNER类型*******************/
/** BANNER类型：banner>推荐 */
BannerAdManager.QUICK_BANNER_TYPE_AD = 1;
/** BANNER类型：banner>推荐 */
BannerAdManager.QUICK_BANNER_TYPE_AD_COMMEND = 2;
/** BANNER类型：推荐 */
BannerAdManager.QUICK_BANNER_TYPE_COMMEND = 3;
/** BANNER类型：推荐>banner */
BannerAdManager.QUICK_BANNER_TYPE_COMMEND_AD = 4;
/***************** BANNER序列类型*******************/
/** BANNER序列类型：banner>推荐 */
BannerAdManager.BANNER_ORDER_TYPE_AD = 1;
/** BANNER序列类型：推荐>banner */
BannerAdManager.BANNER_ORDER_TYPE_RECOMMEND = 2;
/** BANNER序列类型：按照序列 */
BannerAdManager.BANNER_ORDER_TYPE_ORDER = 3;
/** BANNER序列类型：只有Banner */
BannerAdManager.BANNER_ORDER_TYPE_JUST_BANNER = 4;
//# sourceMappingURL=BannerAdManager.js.map