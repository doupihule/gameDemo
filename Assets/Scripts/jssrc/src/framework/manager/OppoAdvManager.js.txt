"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GameSwitch_1 = require("../common/GameSwitch");
const LogsManager_1 = require("./LogsManager");
const TimerManager_1 = require("./TimerManager");
const AdVideoManager_1 = require("../platform/AdVideoManager");
class OppoAdvManager {
    static get instance() {
        if (!this._instance) {
            this._instance = new OppoAdvManager();
        }
        return this._instance;
    }
    /**提示道具领取 */
    static tipItemType(parent, receiveType = null, successCall = null, thisObj = null, extraType = 0) {
        var type = null;
        var insertDelay = Number(GameSwitch_1.default.getSwitchState(GameSwitch_1.default.SCREEN_AD_DELAY)) * 1000;
        var originalDelay = Number(GameSwitch_1.default.getSwitchState(GameSwitch_1.default.ORIGIN_AD_DELAY)) * 1000;
        var tipType;
        tipType = Number(GameSwitch_1.default.getSwitchState(receiveType));
        LogsManager_1.default.echo("tipType------------------", tipType);
        if (tipType == 4) {
            type = this.rewardAdv;
        }
        if (tipType == 2 || tipType == 5) {
            if (tipType == 5) {
                type = this.rewardAdv;
            }
            //插屏>原生>直接
            TimerManager_1.default.instance.setTimeout(() => {
                AdVideoManager_1.default.instance.showInterstitialAd(parent, () => {
                    TimerManager_1.default.instance.setTimeout(() => {
                        AdVideoManager_1.default.instance.showOriginalAdView();
                    }, this, originalDelay);
                });
            }, this, insertDelay);
        }
        else if (tipType == 3 || tipType == 6) {
            //原生》直接
            if (tipType == 6) {
                type = this.rewardAdv;
            }
            TimerManager_1.default.instance.setTimeout(() => {
                AdVideoManager_1.default.instance.showOriginalAdView();
            }, this, originalDelay);
        }
        return type;
    }
}
exports.default = OppoAdvManager;
OppoAdvManager.fastReceive = 1; //立即领取
OppoAdvManager.origionAdv = 2; //原生广告
OppoAdvManager.intervalAdv = 3; //插屏广告
OppoAdvManager.rewardAdv = 4; //激励广告
OppoAdvManager.origionAndReward = 5; //先原生后激励
OppoAdvManager.intervalAndReward = 6; //先插屏后激励
//# sourceMappingURL=OppoAdvManager.js.map