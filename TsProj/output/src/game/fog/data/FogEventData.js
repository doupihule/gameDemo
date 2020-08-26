"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FogFunc_1 = require("../../sys/func/FogFunc");
const PoolTools_1 = require("../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../sys/consts/PoolCode");
const BattleRoleView_1 = require("../../battle/view/BattleRoleView");
const BattleFunc_1 = require("../../sys/func/BattleFunc");
const FogEventTrigger_1 = require("../trigger/FogEventTrigger");
const FogModel_1 = require("../../sys/model/FogModel");
const RolesFunc_1 = require("../../sys/func/RolesFunc");
const FogConst_1 = require("../../sys/consts/FogConst");
const GameUtils_1 = require("../../../utils/GameUtils");
const FogServer_1 = require("../../sys/server/FogServer");
const TranslateFunc_1 = require("../../../framework/func/TranslateFunc");
const FogPropTrigger_1 = require("../trigger/FogPropTrigger");
const StringUtils_1 = require("../../../framework/utils/StringUtils");
/**
 * 迷雾格子的事件
 */
class FogEventData {
    //初始化
    constructor(owner) {
        this.rewardArr = []; //拾取事件的奖励数组
        this.actReduce = 1;
        //强制通过
        this.forcePass = false;
        this.owner = owner;
    }
    addCtn() {
        this.iconCtn = new Laya.Image("");
        this.iconCtn.anchorX = 0.5;
        this.iconCtn.anchorY = 0.5;
        this.ctn.addChild(this.iconCtn);
        this.spineCtn = new Laya.Image("");
        this.ctn.addChild(this.spineCtn);
        this.spineCtn.anchorX = 0.5;
        this.spineCtn.anchorY = 1;
        this.spineCtn.y = 20;
        this.txtCtn = new Laya.Image("");
        this.txtCtn.x = -FogFunc_1.default.itemWidth / 2;
        this.txtCtn.y = -FogFunc_1.default.itemHeight / 2;
        this.ctn.addChild(this.txtCtn);
    }
    /**更新格子事件信息 */
    upDateEvent(event, ctn) {
        this.removeLastEvent();
        this.ctn = ctn;
        this.addCtn();
        if (event) {
            this.eventData = event;
            this.eventId = event.id;
            this.roleId = event.role;
            this.cfgData = FogFunc_1.default.instance.getCfgDatas("Event", this.eventId);
            this.logicType = this.cfgData.logicType;
            this.triggerMode = this.cfgData.triggerMode;
            this._mobilityCost = this.cfgData.mobilityCost;
            this.params = this.cfgData.params;
            this.pass = this.cfgData.pass;
            this.showUI();
        }
    }
    //获取行动力消耗
    get mobilityCost() {
        if (this._mobilityCost == 0)
            return 0;
        this.actReduce = 1;
        FogPropTrigger_1.default.checkPropTriggerOnInstance(FogPropTrigger_1.default.Prop_type_ReduceActCost, this);
        //最后要消耗的行动力=配置的行动力-减少的行动力
        var result = Math.ceil(this._mobilityCost * this.actReduce);
        return result;
    }
    /**界面显示 */
    showUI() {
        var icon = this.cfgData.mapIcon;
        if (icon) {
            var mapIcon = icon[0];
            //名字、缩放，x偏移，y偏移，层级
            if (icon.length > 1) {
                if (this.owner.myRotate == FogConst_1.default.FOG_CELL_TURNRIGHT) {
                    //出入口在左侧
                    mapIcon = icon[1];
                }
                else if (this.owner.myRotate == FogConst_1.default.FOG_CELL_TURNLEFT) {
                    //出入口在右侧
                    mapIcon = icon[2];
                }
                else if (this.owner.myRotate == FogConst_1.default.FOG_CELL_TURNUP) {
                    //出入口在下侧
                    mapIcon = icon[3];
                }
            }
            this.iconCtn.skin = FogFunc_1.default.instance.getMapIcon(mapIcon[0]);
            if (mapIcon[1]) {
                var scale = Number(mapIcon[1]) / 10000;
                this.iconCtn.scale(scale, scale);
            }
            else {
                this.iconCtn.scale(1, 1);
            }
            this.iconCtn.x = Number(mapIcon[2]);
            this.iconCtn.y = Number(mapIcon[3]);
            if (Number(mapIcon[4])) {
                var order = Number(mapIcon[4]);
                if (order == FogConst_1.default.FOG_CELLORDER_HIGH) {
                    this.owner.setOrder(100);
                }
                else if (order == FogConst_1.default.FOG_CELLORDER_LOW) {
                    this.owner.setOrder(-100);
                }
            }
            else {
                this.owner.setOrder(0);
            }
        }
        else {
            var result = this.showCellOtherUI();
            this.iconCtn.skin = result["icon"];
            this.iconCtn.scale(result["scale"], result["scale"]);
        }
        this.showSpine();
    }
    showSpine() {
        var spine = this.cfgData.spine;
        var aniName;
        var scale;
        var action;
        if (spine) {
            aniName = spine[0];
            scale = spine[2] && Number(spine[2]) / 10000;
            action = spine[1];
        }
        this.enemyData = null;
        if (this.logicType == FogEventTrigger_1.default.Event_logical_Enemy) {
            this.enemyType = FogConst_1.default.FOG_EVENT_ENEMY_TYPE_NPC;
            var enemyId = FogEventTrigger_1.default.getNpcEnemyEvent(this.owner);
            this.enemyData = FogFunc_1.default.instance.getCfgDatas("Enemy", this.params[0]);
            //名字
            var name;
            //战力
            var force;
            //如果是玩家类型的战斗事件
            if (enemyId == -1) {
                var id = FogModel_1.default.instance.getOneEnemyId(true);
                if (id) {
                    this.enemyId = id;
                    var userInfo = FogModel_1.default.instance.getEnemyInfoById(id);
                    var highRole = FogFunc_1.default.instance.getEnemyHighRole(userInfo.roles);
                    var info = RolesFunc_1.default.instance.getCfgDatas("Role", highRole);
                    aniName = info.spine[0];
                    scale = info.scale / 10000 * FogFunc_1.default.fogRoleScale;
                    action = "idle";
                    name = userInfo.name;
                    force = userInfo.userExt && userInfo.userExt.force || 0;
                    this.enemyType = FogConst_1.default.FOG_EVENT_ENEMY_TYPE_PLAYER;
                }
            }
            if (!this.enemyId) {
                var role;
                if (enemyId == -1) {
                    //随机一个和我战力差不多的npc
                    var myForce = RolesFunc_1.default.nowForce;
                    this.enemyId = FogFunc_1.default.instance.getNpcEnemyIdByForce(myForce);
                    role = FogFunc_1.default.instance.getCfgDatas("NpcArray", this.enemyId);
                    var roleId = role.waveMap[0][0];
                    var roleInfo = RolesFunc_1.default.instance.getCfgDatas("Role", roleId);
                    aniName = roleInfo.spine[0];
                    scale = roleInfo.scale / 10000 * FogFunc_1.default.fogRoleScale;
                    action = "idle";
                }
                else {
                    this.enemyId = enemyId;
                    role = FogFunc_1.default.instance.getCfgDatas("NpcArray", this.enemyId);
                }
                force = role.power;
            }
            //敌人事件还没有ai 的 随机确定一个ai
            if (!this.eventData.ai) {
                var ai = GameUtils_1.default.getWeightItem(this.enemyData.aiList)[0];
                this.eventData["ai"] = ai;
                //敌人类型为npc的确定一个名字
                if (this.enemyType == FogConst_1.default.FOG_EVENT_ENEMY_TYPE_NPC && !this.eventData.name) {
                    var tempName = FogFunc_1.default.instance.getEnemyName();
                    this.eventData["name"] = tempName;
                }
                FogServer_1.default.addCellEvent({ cellId: this.owner.mySign, ai: this.eventData.ai, name: this.eventData.name, id: this.eventId });
            }
            this.ai = this.eventData.ai;
            if (!name) {
                name = this.eventData.name;
            }
            if (this.cfgData.name) {
                name = TranslateFunc_1.default.instance.getTranslate(this.cfgData.name);
            }
            this.enemyName = name;
            var nameTxt = new Laya.Label(name);
            nameTxt.width = FogFunc_1.default.itemWidth;
            nameTxt.align = "center";
            nameTxt.fontSize = 20;
            nameTxt.color = "#ffffff";
            nameTxt.stroke = 1;
            this.txtCtn.addChild(nameTxt);
            //force=当前值*（1+加成值/10000*当前所在层）
            force = Math.floor(force * (1 + this.enemyData.powerShow / 10000 * (FogModel_1.default.instance.getCurLayer() + 1)));
            var forceTxt = new Laya.Label("战斗力：" + StringUtils_1.default.getCoinStr(force + ""));
            forceTxt.width = FogFunc_1.default.itemWidth;
            forceTxt.align = "center";
            forceTxt.fontSize = 20;
            forceTxt.color = "#feca50";
            forceTxt.stroke = 1;
            this.txtCtn.addChild(forceTxt);
            forceTxt.y = FogFunc_1.default.itemHeight - 20;
        }
        else if (this.logicType == FogEventTrigger_1.default.Event_logical_Role) {
            //解救本方角色
            if (this.roleId) {
                var roleInfo = RolesFunc_1.default.instance.getCfgDatas("Role", this.roleId);
                aniName = roleInfo.spine[0];
                scale = roleInfo.scale / 10000 * FogFunc_1.default.fogRoleScale;
                action = "idle";
                var nameTxt = new Laya.Label();
                nameTxt.width = FogFunc_1.default.itemWidth;
                nameTxt.align = "center";
                nameTxt.fontSize = 20;
                nameTxt.color = "#ffffff";
                nameTxt.stroke = 1;
                this.txtCtn.addChild(nameTxt);
                this.roleName = TranslateFunc_1.default.instance.getTranslate(this.cfgData.name, "TranslateEvent", TranslateFunc_1.default.instance.getTranslate(roleInfo.name));
                nameTxt.text = this.roleName;
            }
        }
        if (aniName) {
            var item = PoolTools_1.default.getItem(PoolCode_1.default.POOL_ROLE + aniName);
            var scaleRoleInfo = BattleFunc_1.default.defaultScale * scale;
            if (!item) {
                this.roleAnim = new BattleRoleView_1.default(aniName, scaleRoleInfo, 0, "FogEventData");
            }
            else {
                item.setItemViewScale(scaleRoleInfo);
                this.roleAnim = item;
            }
            this.spineCtn.addChild(this.roleAnim);
            this.roleAnim.play(action, true);
            this.spineName = aniName;
        }
    }
    //更新这个格子上的事件时，先清掉我的上个事件信息
    removeLastEvent() {
        if (this.iconCtn) {
            this.iconCtn.removeSelf();
            this.iconCtn = null;
        }
        if (this.spineCtn) {
            if (this.roleAnim) {
                this.spineCtn.removeChild(this.roleAnim);
                PoolTools_1.default.cacheItem(PoolCode_1.default.POOL_ROLE + this.spineName, this.roleAnim);
                this.roleAnim = null;
            }
            this.spineCtn.removeSelf();
            this.spineCtn = null;
        }
        if (this.txtCtn) {
            this.txtCtn.removeChildren();
            this.txtCtn.removeSelf();
            this.txtCtn = null;
        }
        this.forcePass = false;
        this.ctn = null;
        this.eventId = null;
        this.enemyId = null;
        this.roleId = null;
        this.cfgData = null;
        this.logicType = null;
        this.triggerMode = null;
        this._mobilityCost = null;
        this.actReduce = 1;
        this.params = null;
        this.enemyType = null;
        this.pass = null;
        this.roleId = null;
        this.enemyData = null;
        this.ai = null;
        this.eventData = null;
        this.enemyName = null;
        this.rewardArr = [];
    }
    //迷雾格子上事件显示其他图标
    showCellOtherUI() {
        var type = this.cfgData.logicType;
        var mapIcon = "";
        var mapIconScale = 1;
        //拾取事件：如果没有配置图标，则显示奖励对应的图标。多个奖励时，显示第1个奖励的图标
        if (type == FogEventTrigger_1.default.Event_logical_Reward) {
            if (this.eventData && this.eventData.reward && this.eventData.reward.length != 0) {
                this.rewardArr = FogFunc_1.default.instance.vertRewardTableToArr(this.eventData.reward);
            }
            else {
                var params = this.cfgData.params;
                var dropId;
                var dropArr;
                var itemArr = [];
                //随机奖励
                for (var i = 0; i < params.length; i++) {
                    dropId = params[i][0];
                    dropArr = FogFunc_1.default.instance.getDropGroupReward(dropId);
                    itemArr.push(GameUtils_1.default.getWeightItem(dropArr));
                }
                this.rewardArr = itemArr;
                //保存事件随机出的奖励
                FogServer_1.default.addCellEvent({ cellId: this.owner.mySign, rewardArr: this.rewardArr, id: this.eventId }, null, null);
            }
            var result = FogFunc_1.default.instance.getResourceShowInfo(this.rewardArr[0]);
            mapIcon = result["icon"];
            mapIconScale = result["scale"];
        }
        return { "icon": mapIcon, "scale": mapIconScale };
    }
}
exports.default = FogEventData;
//# sourceMappingURL=FogEventData.js.map