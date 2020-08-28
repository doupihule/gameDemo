"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = require("./BaseModel");
const GlobalParamsFunc_1 = require("../func/GlobalParamsFunc");
const CountsModel_1 = require("./CountsModel");
const ShareOrTvManager_1 = require("../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../func/ShareTvOrderFunc");
class TurnableModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new TurnableModel();
        }
        return this._instance;
    }
    //初始化数据
    initData(d) {
        super.initData(d);
    }
    //更新数据
    updateData(d) {
        super.updateData(d);
    }
    //删除数据
    deleteData(d) {
        super.deleteData(d);
    }
    //判断是否弹出转盘界面
    checkTurnable() {
        //判断是否有免费次数
        var maxFreeCount = GlobalParamsFunc_1.default.instance.getDataNum("luckyPlateFreeNub");
        var nowCount = CountsModel_1.default.instance.getCountsById(CountsModel_1.default.freeTurnableCount);
        if (nowCount < maxFreeCount) {
            return true;
        }
        //判断是否有视频或者分享
        var freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_TURNABLE);
        if (freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
            return false;
        }
        return true;
    }
}
exports.default = TurnableModel;
//# sourceMappingURL=TurnableModel.js.map