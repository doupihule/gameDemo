"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = require("../model/UserModel");
const Client_1 = require("../../../framework/common/kakura/Client");
const SingleCommonServer_1 = require("../../../framework/server/SingleCommonServer");
const BigNumUtils_1 = require("../../../framework/utils/BigNumUtils");
const CountsModel_1 = require("../model/CountsModel");
const GameUtils_1 = require("../../../utils/GameUtils");
const PiecesModel_1 = require("../model/PiecesModel");
const TaskServer_1 = require("./TaskServer");
const TaskConditionTrigger_1 = require("../trigger/TaskConditionTrigger");
class PieceServer {
    //领取碎片
    static getPieces(data, callBack = null, thisObj = null) {
        var upData = {};
        var deData = {};
        var countData = {};
        var type = data.type;
        if (type == "gold") {
            upData["giftGold"] = BigNumUtils_1.default.substract(UserModel_1.default.instance.getGiftGold(), data.gold);
        }
        else if (type == "free") {
            var count = CountsModel_1.default.instance.getCountsById(CountsModel_1.default.equipPieceFreeGet);
            //如果次数为0并且有宝箱领取纪录就先清掉领取纪录
            if (count == 0) {
                countData["expireTime"] = GameUtils_1.default.getNextRefreshTByTime(4);
            }
            countData["id"] = CountsModel_1.default.equipPieceFreeGet;
            countData["count"] = count + 1;
            upData["counts"] = {
                [CountsModel_1.default.equipPieceFreeGet]: countData
            };
        }
        else if (type == "ad") {
            var count = CountsModel_1.default.instance.getCountsById(CountsModel_1.default.equipPieceAdCount);
            //如果次数为0并且有宝箱领取纪录就先清掉领取纪录
            if (count == 0) {
                countData["expireTime"] = GameUtils_1.default.getNextRefreshTByTime(4);
            }
            countData["id"] = CountsModel_1.default.equipPieceAdCount;
            countData["count"] = count + 1;
            upData["counts"] = {
                [CountsModel_1.default.equipPieceAdCount]: countData
            };
        }
        var piece = {};
        var reward = data.reward;
        piece[reward[1]] = {
            count: PiecesModel_1.default.instance.getPieceCount(reward[1]) + Number(reward[2])
        };
        upData["pieces"] = piece;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        TaskServer_1.default.updateTaskProcess({ logicType: TaskConditionTrigger_1.default.taskCondition_equipCount }, null, null, false);
        SingleCommonServer_1.default.startSaveClientData();
    }
    //单纯领取碎片
    static onlyGetPiece(data, callBack = null, thisObj = null) {
        var upData = {};
        var piece = {};
        var reward = data.reward;
        piece[reward[1]] = {
            count: PiecesModel_1.default.instance.getPieceCount(reward[1]) + Number(reward[2])
        };
        upData["pieces"] = piece;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
}
exports.default = PieceServer;
//# sourceMappingURL=PieceServer.js.map