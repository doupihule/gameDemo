"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserInfo_1 = require("../common/UserInfo");
const Message_1 = require("../common/Message");
const WindowManager_1 = require("../manager/WindowManager");
const TranslateFunc_1 = require("../func/TranslateFunc");
const SingleCommonServer_1 = require("../server/SingleCommonServer");
const TimerManager_1 = require("../manager/TimerManager");
const DataResourceFunc_1 = require("../../game/sys/func/DataResourceFunc");
const StringUtils_1 = require("./StringUtils");
const NativeToJSEvent_1 = require("../event/NativeToJSEvent");
class ChargeUtils {
    constructor() {
        this.inCharge = false;
    }
    static get ins() {
        if (!this._ins) {
            this._ins = new ChargeUtils();
        }
        return this._ins;
    }
    inAppPurchase(productId) {
        if (!this.inCharge) {
            this.inCharge = true;
            Message_1.default.instance.add(NativeToJSEvent_1.default.NATIVE_INAPP_PURCHASE_BACK, this);
            UserInfo_1.default.platform.inAppPurchase(productId, 1, "order_id", "callback_uri");
        }
    }
    recvMsg(cmd, data) {
        switch (cmd) {
            case NativeToJSEvent_1.default.NATIVE_INAPP_PURCHASE_BACK:
                this.purchaseBack(data);
                break;
        }
    }
    purchaseBack(data) {
        switch (data.status) {
            case 1:
                this.purchaseSuccess(data.data);
                break;
            case 2:
                break;
            case 3:
                this.purchaseFail();
                break;
        }
        this.inCharge = false;
        Message_1.default.instance.remove(NativeToJSEvent_1.default.NATIVE_INAPP_PURCHASE_BACK, this);
    }
    purchaseSuccess(data) {
        var reward = []; //TODO改为读表
        switch (data.id) {
            case "qhmx.mergewar.game_gold_test_1":
                reward = ["3,1000"];
                break;
        }
        SingleCommonServer_1.default.getChargeReward(reward, () => {
            for (var index = 0; index < reward.length; index++) {
                var dataArr = reward[index].split(",");
                var type = dataArr[0];
                var num = DataResourceFunc_1.default.instance.getDataResourceInfo(dataArr)["num"];
                TimerManager_1.default.instance.setTimeout((num, type) => {
                    var text = "";
                    switch (Number(type)) {
                        case DataResourceFunc_1.DataResourceType.COIN:
                            text = TranslateFunc_1.default.instance.getTranslate("#tid_tip_getCoin", "localTranslate", StringUtils_1.default.getCoinStr(num));
                            break;
                        case DataResourceFunc_1.DataResourceType.GOLD:
                            text = TranslateFunc_1.default.instance.getTranslate("#tid_tip_getGold", "localTranslate", StringUtils_1.default.getCoinStr(num));
                            break;
                    }
                    if (text != "") {
                        WindowManager_1.default.ShowTip(text);
                    }
                }, this, index * 1000, num, type);
            }
        }, this);
    }
    purchaseFail() {
        WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_purchaseFail"));
    }
}
exports.default = ChargeUtils;
//# sourceMappingURL=ChargeUtils.js.map