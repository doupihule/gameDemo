import Client from "../../../framework/common/kakura/Client";
import RolesFunc from "../func/RolesFunc";
import WindowManager from "../../../framework/manager/WindowManager";
import RolesModel from "../model/RolesModel";
import SingleCommonServer from "../../../framework/server/SingleCommonServer";
import UserModel from "../model/UserModel";
import { DataResourceType } from "../func/DataResourceFunc";
import BigNumUtils from "../../../framework/utils/BigNumUtils";
import LogsManager from "../../../framework/manager/LogsManager";
import { SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER } from "constants";
import GlobalParamsFunc from "../func/GlobalParamsFunc";
import Message from "../../../framework/common/Message";
import GameMainEvent from "../event/GameMainEvent";
import UserExtModel from "../model/UserExtModel";
import TalentSkillsModel from "../model/TalentSkillsModel";
import CountsModel from "../model/CountsModel";
import GameUtils from "../../../utils/GameUtils";

/* 
天赋技能系统
 */
export default class TalentSkillServer {
    //天赋技能升级
    static upgrade(params: any, callBack: any, thisObj: any) {
        // var params = {
        //     "talentId": talentId,
        //     "cost": costMap
        // };

        var upData = {};
        var ext = {};

        if (!params || !params.talentId) {
            return;
        }

        var talentId = params.talentId;


        //更新天赋列表
        ext[talentId] = TalentSkillsModel.instance.getTalentSkillLevel(talentId) + 1;
        upData["talentSkills"] = ext;

        //更新货币
        upData["coin"] = BigNumUtils.substract(UserModel.instance.getCoin(), (params.cost['coin'] || 0));
        var golds = UserModel.instance.costGold(params.cost['gold'] || 0);
        upData["giftGold"] = golds[0];
        upData["gold"] = golds[1];

        //更新天赋升级次数
        upData["userExt"] = {
            "talentSkillUpgradeNum": UserExtModel.instance.getTalentSkillUpgradeNum() + 1
        };

        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData(true);

    } 

    //免费升级
    static freeUpgrade(params: any, callBack: any, thisObj: any){
        // var params = {
        //     "talentId": talentId,
        // };

        var upData = {};
        if (!params || !params.talentId) {
            return;
        }

        var talentId = params.talentId;
        var count = CountsModel.instance.getCountsById(CountsModel.talentFreeUpdateCount);

        var countData = {
            id: CountsModel.talentFreeUpdateCount,
            count: count + 1,
        };
        if (count == 0) {
            countData["expireTime"] = GameUtils.getNextRefreshTByTime(4);
        }
      
        upData = {
            "talentSkills": {
                [talentId]: TalentSkillsModel.instance.getTalentSkillLevel(talentId) + 1
            },
            //更新天赋技能升级次数
            "userExt": {
                "talentSkillUpgradeNum": UserExtModel.instance.getTalentSkillUpgradeNum() + 1
            },
            //更新免费升级次数
            "counts": {
                [CountsModel.talentFreeUpdateCount]: countData
            }
        };

        
        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData(true);

    }
}