"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("../../../framework/func/BaseFunc");
const GameUtils_1 = require("../../../utils/GameUtils");
const TranslateFunc_1 = require("../../../framework/func/TranslateFunc");
const UserInfo_1 = require("../../../framework/common/UserInfo");
const UserModel_1 = require("../model/UserModel");
const SubPackageManager_1 = require("../../../framework/manager/SubPackageManager");
const GameSwitch_1 = require("../../../framework/common/GameSwitch");
const SubPackageConst_1 = require("../consts/SubPackageConst");
class ShareFunc extends BaseFunc_1.default {
    static get instance() {
        if (!this._instance) {
            this._instance = new ShareFunc();
        }
        return this._instance;
    }
    getCfgsPathArr() {
        return [
            { name: "Share_json" },
            { name: "TranslateShare_json" }
        ];
    }
    /**根据分享id和平台id获取分享数据 */
    getShareData(id, platformId = null) {
        if (!id)
            return;
        if (!platformId) {
            platformId = UserInfo_1.default.platformId;
        }
        var shareCfg = this.getAllCfgData("Share_json");
        var shareData = {};
        var myShare = [];
        for (const cfgId in shareCfg) {
            if (cfgId == id) {
                var data = shareCfg[cfgId];
                for (const arrData in data) {
                    if (data.hasOwnProperty(arrData)) {
                        const element2 = data[arrData];
                        myShare.push(element2);
                    }
                }
            }
        }
        if (myShare.length > 0) {
            var result = this.getShareByWeight(myShare);
            var desStr;
            if (platformId == "qqgame") {
                desStr = result["descQq"];
            }
            else if (platformId == "wxgame") {
                desStr = result["descWx"];
                if (this.isUseLocalShareImg()) {
                    if (result["separateDescWx"]) {
                        desStr = result["separateDescWx"];
                    }
                    else if (result["descWx"]) {
                        desStr = result["descWx"];
                    }
                }
                else {
                    if (result["descWx"]) {
                        desStr = result["descWx"];
                    }
                    else if (result["separateDescWx"]) {
                        desStr = result["separateDescWx"];
                    }
                }
            }
            else if (platformId == "tt") {
                desStr = result["descWx"];
            }
            else {
                desStr = result["descWx"];
            }
            if (desStr) {
                var desArr = desStr.split(",");
                var desId = desArr[0];
                shareData["desc"] = TranslateFunc_1.default.instance.getTranslate(desId, "TranslateShare");
                shareData["imgUrl"] = desArr[1];
                if (id == "1" || id == "2") {
                    shareData["desc"] = shareData["desc"].replace("#v1#", UserModel_1.default.instance.getUserName());
                }
            }
        }
        return shareData;
    }
    /**是否优先使用本地分享路径 */
    isUseLocalShareImg() {
        var isOpen = GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_SHARE_LOCAL);
        var isLoad = SubPackageManager_1.default.getLoadStatus(SubPackageConst_1.default.packName_share);
        return isOpen && isLoad;
    }
    /**分享，根据权重获取数据 */
    getShareByWeight(datas) {
        var weightSum = 0;
        for (var i = 0; i < datas.length; i++) {
            weightSum += Number(datas[i]["weight"]);
        }
        var randomNum = GameUtils_1.default.getRandomInt(0, weightSum - 1);
        var curWeight = 0;
        for (var i = 0; i < datas.length; i++) {
            curWeight += Number(datas[i]["weight"]);
            if (randomNum < curWeight) {
                return datas[i];
            }
        }
    }
}
exports.default = ShareFunc;
//# sourceMappingURL=ShareFunc.js.map