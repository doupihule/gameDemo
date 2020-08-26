"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OriginalInterstitialAdComp = void 0;
const OriginalAdBaseComp_1 = require("./OriginalAdBaseComp");
const ChannelConst_1 = require("../../../game/sys/consts/ChannelConst");
const UserInfo_1 = require("../../common/UserInfo");
const GameSwitch_1 = require("../../common/GameSwitch");
const LogsManager_1 = require("../../manager/LogsManager");
const WindowCommonCfgs_1 = require("../../consts/WindowCommonCfgs");
const WindowManager_1 = require("../../manager/WindowManager");
const AdVideoManager_1 = require("../AdVideoManager");
class OriginalInterstitialAdComp extends OriginalAdBaseComp_1.default {
    constructor() {
        super(...arguments);
        this.logName = 'original_interstitial';
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new OriginalInterstitialAdComp();
        }
        return this._instance;
    }
    get adOriginalIds() {
        if (!this._adOriginalIds) {
            if (ChannelConst_1.default.getChannelConst(UserInfo_1.default.platformId).adOriginalInterstitialIds) {
                this._adOriginalIds = (String(ChannelConst_1.default.getChannelConst(UserInfo_1.default.platformId).adOriginalInterstitialIds)).split("|");
            }
            if (GameSwitch_1.default.getSwitchState(GameSwitch_1.default.ORIGIN_ID)) {
                this._adOriginalIds = (String(GameSwitch_1.default.getSwitchState(GameSwitch_1.default.ORIGIN_ID))).split("|");
                ;
            }
        }
        return this._adOriginalIds;
    }
    /**
     * 打开原生广告弹窗
     */
    openOriginalView(params, adList) {
        if (adList) {
            LogsManager_1.default.echo("hlx 显示原生广告插屏广告1-----------", adList.adId);
            // 汇报点击
            this.reportShowOriginal(adList.adId);
            WindowManager_1.default.OpenUI(WindowCommonCfgs_1.default.ORIGINALVIEW, { info: adList, pos: params.pos });
            // Message.instance.send(MsgCMD.MODULE_SHOW, param);
            // 更新插屏数据
            AdVideoManager_1.default.instance.updateInterstitialLimit();
        }
        else {
            LogsManager_1.default.echo('hlx 原生广告插屏未加载到数据，不显示');
        }
    }
    /**
     * 显示原生广告：插屏
     */
    showOriginalAdView(onErrorCallback, callbackObj, params = { pos: -79 }) {
        this.registerOrigionAdv((result, params, adList) => {
            if (result && adList) {
                this.openOriginalView(params, adList);
            }
            else {
                // 失败走回调
                LogsManager_1.default.echo('hlx 原生广告插屏未加载到数据，不显示, 执行失败回调');
                onErrorCallback && onErrorCallback.call(callbackObj);
            }
        }, this, params);
    }
}
exports.OriginalInterstitialAdComp = OriginalInterstitialAdComp;
//# sourceMappingURL=OriginalInterstitialAdComp.js.map