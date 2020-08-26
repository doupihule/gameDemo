import UserModel from "../model/UserModel";
import Client from "../../../framework/common/kakura/Client";
import SingleCommonServer from "../../../framework/server/SingleCommonServer";
import BigNumUtils from "../../../framework/utils/BigNumUtils";
import CountsModel from "../model/CountsModel";
import GameUtils from "../../../utils/GameUtils";
import PiecesModel from "../model/PiecesModel";
import TaskServer from "./TaskServer";
import TaskConditionTrigger from "../trigger/TaskConditionTrigger";



export default class PieceServer {
    //领取碎片
    static getPieces(data, callBack = null, thisObj = null) {
        var upData = {};
        var deData = {};
        var countData = {};
        var type = data.type;
        if (type == "gold") {
            upData["giftGold"] = BigNumUtils.substract(UserModel.instance.getGiftGold(), data.gold);
        } else if (type == "free") {
            var count = CountsModel.instance.getCountsById(CountsModel.equipPieceFreeGet);
            //如果次数为0并且有宝箱领取纪录就先清掉领取纪录
            if (count == 0) {
                countData["expireTime"] = GameUtils.getNextRefreshTByTime(4);
            }
            countData["id"] = CountsModel.equipPieceFreeGet;
            countData["count"] = count + 1;
            upData["counts"] = {
                [CountsModel.equipPieceFreeGet]: countData
            }

        } else if (type == "ad") {
            var count = CountsModel.instance.getCountsById(CountsModel.equipPieceAdCount);
            //如果次数为0并且有宝箱领取纪录就先清掉领取纪录
            if (count == 0) {
                countData["expireTime"] = GameUtils.getNextRefreshTByTime(4);
            }
            countData["id"] = CountsModel.equipPieceAdCount;
            countData["count"] = count + 1;
            upData["counts"] = {
                [CountsModel.equipPieceAdCount]: countData
            }
        }
        var piece = {};
        var reward = data.reward;
        piece[reward[1]] = {
            count: PiecesModel.instance.getPieceCount(reward[1]) + Number(reward[2])
        }
        upData["pieces"] = piece;
        var backData = Client.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        TaskServer.updateTaskProcess({ logicType: TaskConditionTrigger.taskCondition_equipCount }, null, null, false)
        SingleCommonServer.startSaveClientData();

    }
    //单纯领取碎片
    static onlyGetPiece(data, callBack = null, thisObj = null) {
        var upData = {};
        var piece = {};
        var reward = data.reward;
        piece[reward[1]] = {
            count: PiecesModel.instance.getPieceCount(reward[1]) + Number(reward[2])
        }
        upData["pieces"] = piece;
        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData();

    }

}