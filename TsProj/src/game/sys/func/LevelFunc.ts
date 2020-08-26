import BaseFunc from "../../../framework/func/BaseFunc";
import LogsManager from "../../../framework/manager/LogsManager";
import GameUtils from "../../../utils/GameUtils";
import ShareOrTvManager from "../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "./ShareTvOrderFunc";
import GlobalParamsFunc from "./GlobalParamsFunc";
import UserExtModel from "../model/UserExtModel";
import BattleConst from "../consts/BattleConst";
import BattleFunc from "./BattleFunc";

/**关卡等级相关 */
export default class LevelFunc extends BaseFunc {
    //处理用户配表相关接口.用静态方法
    //初始化 加载配表
    //存储所有配表
    getCfgsPathArr() {
        return [
            { name: "Level_json" },
            { name: "LevelWave_json" },
            { name: "TranslateGlobal_json" },
            { name: "Scene_json" },
            { name: "BattleAddition_json" },
        ];
    }
    static _instance: LevelFunc;
    static get instance() {
        if (!this._instance) {
            this._instance = new LevelFunc();
        }
        return this._instance;
    }
    private maxLevel;
    /**获取所有关卡信息 */
    getAllLevelInfo() {
        return this.getAllCfgData("Level_json");
    }
    /**获取指定关卡的指定信息 */
    getLevelInfoByTwoId(id1, id2) {
        return this.getCfgDatasByKey("Level_json", id1, id2);
    }
    /**获取指定关卡的所有信息 */
    getLevelInfoById(id1) {
        var level=Number(id1);
        if(level>this.getMaxLevel()){
            level=this.getMaxLevel();
        }
        return this.getCfgDatas("Level_json", level);
    }
    /**获取星级数量 */
    getCurStarCountByLevel(starInfo, score) {
        var count = 0;
        for (var i = 0; i < starInfo.length; i++) {
            if (Number(score) >= starInfo[i]) {
                count++;
            }
        }
        return count;
    }
    /**获取本次游戏的金币数 */
    getRewardCount(level, score) {
        var info = this.getLevelInfoById(level);
        var count = this.getCurStarCountByLevel(info.starScore, score);
        var coinReward = Math.ceil(Number(score) * (info.scoreCoin / 10000) + count * (info.starCoin / 10000));
        return coinReward;
    }

    getMaxLevel() {
        if (!this.maxLevel) {
            var levelList = this.getAllCfgData("Level_json");
            var maxLevel = 0;
            for (var index in levelList) {
                if (Number(index) > maxLevel) {
                    maxLevel = Number(index);
                }
            }
            this.maxLevel = maxLevel;
        }
        return this.maxLevel;
    }

    getSceneParam(id) {
        var sceneId = this.getCfgDatasByKey("Level_json", id, "scene");
        var info = this.getCfgDatas("Scene_json", sceneId);
        return info;
    }

    getWaveMonsterById(id) {
        return this.getCfgDatasByKey("LevelWave_json", id, "monster");
    }

    //判断是否出现空投宝箱
    checkAirDropShow(levelId) {
        var showRate = LevelFunc.instance.getLevelInfoById(levelId).secretBoxShowOdds || 0;
        if (Math.random() * 10000 < showRate) {
            //出现新空投    如果已经存在空投  则刷新当前空投最大持续时间
            return true;
        }

        return false;
    }
    getAirDropRewardIndex() {
        return 0;
    }

    getAllBattleAddtion() {
        return this.getAllCfgData("BattleAddition_json");
    }
    getBattleAddtionById(id) {
        return this.getCfgDatas("BattleAddition_json", id);
    }
    getBattleAddtionoByTwoId(id1, id2) {
        return this.getCfgDatasByKey("BattleAddition_json", id1, id2);
    }
    //判断是否出现豪华开局界面
    checkIsBattleAddtionInGame() {
        var showTVAddEnergyStartLevel = GlobalParamsFunc.instance.getDataNum("showTVAddEnergyStartLevel");
        var maxLevel = UserExtModel.instance.getMaxLevel();

        if (Number(maxLevel) + 1 >= showTVAddEnergyStartLevel) {
            var battleAddtionId = LevelFunc.instance.getBattleAddtionId();
            if (Number(battleAddtionId) == BattleConst.battle_start_none) {
                return [false];
            }
            var freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_BATTLE_START);
            if (freeType == ShareOrTvManager.TYPE_QUICKRECEIVE) {
                return [false];
            }
            return [true, battleAddtionId];
        }
        return [false];
    }
    //随机豪华开场效果
    getBattleAddtionId() {
        var battleAddtions = Object.keys(this.getAllBattleAddtion());
        var weightArr = [];
        for (var i = 0; i < battleAddtions.length; i++) {
            var battleAddtionInfo = this.getBattleAddtionById(battleAddtions[i]);
            weightArr.push(battleAddtions[i] + "," + battleAddtionInfo.weight);
        }
        var randResult = GameUtils.getWeightItem(weightArr);

        return randResult[0];
    }
    checkIsReduceSkillCd(camp, battleAdditionId, roleId) {
        var value = 0;
        if (camp == BattleConst.ROLEGROUP_MYSELF) {
            if (battleAdditionId && battleAdditionId == BattleConst.battle_start_homeCd) {
                var passiveSkillId = LevelFunc.instance.getBattleAddtionoByTwoId(battleAdditionId, "addtionNub");
                var passiveCfg = BattleFunc.instance.getCfgDatas("PassiveSkill", passiveSkillId);
                if (passiveCfg.effectType != BattleConst.passive_effect_skillcd) {
                    return;
                }
                var effectParams = passiveCfg.effectParams;
                for (var s = 0; s < effectParams.length; s++) {
                    var arr = effectParams[s];
                    var skillId = arr[0];
                    if (Number(roleId) == Number(skillId)) {
                        value = arr[1];
                        break;
                    }
                }
            }
        }
        return value;
    }

}
