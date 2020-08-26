"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JumpCommonModel_1 = require("../model/JumpCommonModel");
const UserExtCommonModel_1 = require("../model/UserExtCommonModel");
const CountsCommonModel_1 = require("../model/CountsCommonModel");
const ModelToServerMap_1 = require("../../game/sys/consts/ModelToServerMap");
const UserModel_1 = require("../../game/sys/model/UserModel");
//通用本地模块和服务器数据映射表
class ModelToServerMapCommon {
    constructor() {
    }
    //所有model初始化
    static initModelToServerMap() {
        ModelToServerMap_1.default.initModelToServerMap();
        var modelMap = ModelToServerMap_1.default.modelToServerMap;
        var modelMapCommon = this.modelToServerMapCommon;
        var totalModelMap = [];
        if (modelMap.length && !modelMapCommon.length) {
            totalModelMap = modelMap;
        }
        else if (!modelMap.length && modelMapCommon.length) {
            totalModelMap.push({ key: "user", model: UserModel_1.default });
            for (var i = 0; i < modelMapCommon.length; i++) {
                totalModelMap.push(modelMapCommon[i]);
            }
        }
        else {
            for (var i = 0; i < modelMap.length; i++) {
                totalModelMap.push(modelMap[i]);
            }
            var map = this.revertToTable(modelMap);
            if (Object.keys(map).length != 0) {
                for (var i = 0; i < modelMapCommon.length; i++) {
                    if (!map.hasOwnProperty(modelMapCommon[i].key) || map[modelMapCommon[i].key] != modelMapCommon[i].model) {
                        totalModelMap.push(modelMapCommon[i]);
                    }
                }
            }
        }
        this.modelToServerMap = totalModelMap;
    }
    //将table数组转换成table
    static revertToTable(arr) {
        if (arr.length == 0) {
            return {};
        }
        var result = {};
        for (var i = 0; i < arr.length; i++) {
            result[arr[i].key] = arr[i].model;
        }
        return result;
    }
}
exports.default = ModelToServerMapCommon;
//所有的modelMap
ModelToServerMapCommon.modelToServerMap = [];
//框架公共的模块在此处填充
ModelToServerMapCommon.modelToServerMapCommon = [
    { key: "jumpCommon", model: JumpCommonModel_1.default },
    { key: "userExtCommon", model: UserExtCommonModel_1.default },
    { key: "countsCommon", model: CountsCommonModel_1.default },
];
//# sourceMappingURL=ModelToServerMapCommon.js.map