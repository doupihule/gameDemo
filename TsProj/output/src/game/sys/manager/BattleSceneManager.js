"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BattleLogicalControler_1 = require("../../battle/controler/BattleLogicalControler");
const TimerManager_1 = require("../../../framework/manager/TimerManager");
const LogsManager_1 = require("../../../framework/manager/LogsManager");
const ShareOrTvManager_1 = require("../../../framework/manager/ShareOrTvManager");
const UserInfo_1 = require("../../../framework/common/UserInfo");
class BattleSceneManager {
    //挂机游戏可以有2个战斗控制器 
    constructor() {
        //战斗状态 0 非战斗.1 战斗中 这个针对副本战斗
        this._battestate = 0;
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new BattleSceneManager();
        }
        return this._instance;
    }
    /*进入战斗
        @param data 根据游戏自己定义 比如 levelid
    */
    //进入战斗
    enterBattle(data, ctn, ui) {
        this._battestate = 1;
        this.autoBattleControler = new BattleLogicalControler_1.default(ctn, ui);
        this.autoBattleControler.setData(data);
        if (ShareOrTvManager_1.default.instance.canShareVideo()) {
            UserInfo_1.default.platform.recordStart();
        }
    }
    //重玩 
    replayBattle(inBattle = false) {
        var battleui = this.autoBattleControler.battleUI;
        var helpRole;
        if (inBattle) {
            helpRole = this.autoBattleControler.helpRoleId;
        }
        if (this.autoBattleControler) {
            this.autoBattleControler.exitBattle();
        }
        // 重玩开始录屏时还没有结束录屏的回调，延迟加开始录屏
        if (ShareOrTvManager_1.default.instance.canShareVideo()) {
            TimerManager_1.default.instance.setTimeout(() => {
                LogsManager_1.default.echo("whn replay recordStart----------");
                UserInfo_1.default.platform.recordStart();
            }, this, 200);
        }
        battleui.setData({ "isShowTalk": 2, levelId: battleui.levelId, name: battleui.levelName, helpRole: helpRole });
    }
    //触发角色节能
    onClickRoleSkill(rid) {
        var control = this.getCurrentBattleControler();
        control.onClickRole(rid);
    }
    //使用战斗中的道具
    useProp(propId) {
    }
    getCurrentBattleControler() {
        if (this.bossBattleControler) {
            return this.bossBattleControler;
        }
        return this.autoBattleControler;
    }
    //设置游戏播放或者暂停
    setGamePlayOrPause(value) {
        this.getCurrentBattleControler().setGamePlayOrPause(value);
    }
    //当触发点击
    onTouchClick(e = null) {
    }
    //退出战斗之后
    exitBattle() {
        this._battestate = 0;
        if (this.autoBattleControler) {
            //恢复游戏暂停
            this.autoBattleControler.exitBattle();
            this.autoBattleControler = null;
        }
    }
    /**获取本关所需要的所有模型arr */
    getCurModelArrByLevel() {
        //monsterList  根据ai车辆去判断加载哪些模型
        return [];
    }
    recvMsg(e) {
    }
}
exports.default = BattleSceneManager;
//# sourceMappingURL=BattleSceneManager.js.map