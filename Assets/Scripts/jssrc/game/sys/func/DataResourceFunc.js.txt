"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataResourceType = void 0;
const BaseFunc_1 = require("../../../framework/func/BaseFunc");
const ResourceConst_1 = require("../consts/ResourceConst");
const WindowManager_1 = require("../../../framework/manager/WindowManager");
const RolesFunc_1 = require("./RolesFunc");
var DataResourceType;
(function (DataResourceType) {
    DataResourceType[DataResourceType["COIN"] = 2] = "COIN";
    DataResourceType[DataResourceType["GOLD"] = 3] = "GOLD";
    DataResourceType[DataResourceType["SP"] = 4] = "SP";
    DataResourceType[DataResourceType["PIECE"] = 5] = "PIECE";
    DataResourceType[DataResourceType["ACT"] = 6] = "ACT";
    DataResourceType[DataResourceType["COMP"] = 7] = "COMP";
    DataResourceType[DataResourceType["FOGITEM"] = 8] = "FOGITEM";
    DataResourceType[DataResourceType["FOGCOIN"] = 9] = "FOGCOIN";
    DataResourceType[DataResourceType["TASKPOINT"] = 10] = "TASKPOINT";
    DataResourceType[DataResourceType["REPUTE"] = 11] = "REPUTE"; //声望
})(DataResourceType = exports.DataResourceType || (exports.DataResourceType = {}));
class DataResourceFunc extends BaseFunc_1.default {
    static get instance() {
        if (!this._instance) {
            this._instance = new DataResourceFunc();
        }
        return this._instance;
    }
    getCfgsPathArr() {
        return [
            { name: "DataResource_json" },
        ];
    }
    /**根据id获取resource数据*/
    getIconById(id) {
        var icon = this.getCfgDatasByKey("DataResource_json", id, "icon");
        icon = "native/main/main/" + icon + ".png";
        return icon;
    }
    //根据资源字符串返回资源图片和数量
    getDataResourceInfo(dataArr) {
        var result = {};
        if (dataArr[0]) {
            switch (Number(dataArr[0])) {
                //金币
                case DataResourceType.COIN:
                    result = {
                        img: ResourceConst_1.default.COIN_PNG,
                        num: dataArr[1],
                    };
                    break;
                //钻石
                case DataResourceType.GOLD:
                    result = {
                        img: ResourceConst_1.default.GOLD_PNG,
                        num: dataArr[1],
                    };
                    break;
                //体力
                case DataResourceType.SP:
                    result = {
                        img: ResourceConst_1.default.SP_PNG,
                        num: dataArr[1],
                    };
                    break;
                //碎片
                case DataResourceType.PIECE:
                    result = {
                        img: RolesFunc_1.default.instance.getEquipIcon(RolesFunc_1.default.instance.getCfgDatasByKey("EquipMaterial", dataArr[1], "icon")),
                        id: dataArr[1],
                        num: dataArr[2],
                    };
                    break;
                //零件
                case DataResourceType.COMP:
                    result = {
                        img: ResourceConst_1.default.COMP_PNG,
                        num: dataArr[1],
                    };
                    break;
                //迷雾币
                case DataResourceType.FOGCOIN:
                    result = {
                        img: ResourceConst_1.default.FOGCOIN_PNG,
                        num: dataArr[1],
                    };
                    break;
                //行动力
                case DataResourceType.ACT:
                    result = {
                        img: ResourceConst_1.default.ACT_PNG,
                        num: dataArr[1],
                    };
                    break;
                //迷雾道具
                case DataResourceType.FOGITEM:
                    result = {
                        img: RolesFunc_1.default.instance.getEquipIcon(RolesFunc_1.default.instance.getCfgDatasByKey("EquipMaterial", dataArr[1], "icon")),
                        id: dataArr[1],
                        num: dataArr[2],
                    };
                    break;
            }
        }
        return result;
    }
    showTip(reward) {
        if (Number(reward[0]) == DataResourceType.COIN) {
            WindowManager_1.default.ShowTip("获得金币 x" + reward[1]);
        }
        else if (Number(reward[0]) == DataResourceType.GOLD) {
            WindowManager_1.default.ShowTip("获得钻石 x" + reward[1]);
        }
    }
}
exports.default = DataResourceFunc;
//# sourceMappingURL=DataResourceFunc.js.map