import FogFunc from "../../sys/func/FogFunc";
import PoolTools from "../../../framework/utils/PoolTools";
import PoolCode from "../../sys/consts/PoolCode";
import BattleRoleView from "../../battle/view/BattleRoleView";
import BattleFunc from "../../sys/func/BattleFunc";
import FogEventTrigger from "../trigger/FogEventTrigger";
import FogModel from "../../sys/model/FogModel";
import RolesFunc from "../../sys/func/RolesFunc";
import UserExtModel from "../../sys/model/UserExtModel";
import FogConst from "../../sys/consts/FogConst";
import GameUtils from "../../../utils/GameUtils";
import FogServer from "../../sys/server/FogServer";
import TranslateFunc from "../../../framework/func/TranslateFunc";
import FogInstanceCell from "../instance/FogInstanceCell";
import FogPropTrigger from "../trigger/FogPropTrigger";
import StringUtils from "../../../framework/utils/StringUtils";
import LogsManager from "../../../framework/manager/LogsManager";

/**
 * 迷雾格子的事件
 */
export default class FogEventData {

    public eventId;
    private ctn: Laya.Image;
    public owner: FogInstanceCell;
    public cfgData;
    //spineCtn
    public spineCtn: Laya.Image;
    //icon容器
    private iconCtn: Laya.Image;
    //文本容器
    private txtCtn: Laya.Image;
    //逻辑类型
    public logicType;
    //触发方式
    public triggerMode;
    //行动力消耗
    public _mobilityCost;
    //额外参数
    public params;
    private spineName;
    public enemyId;
    public enemyType;
    //是否可通行
    public pass;
    public roleAnim: BattleRoleView
    public roleId;
    public enemyData;
    /**敌人事件ai */
    public ai;
    public eventData: SCFogCellEventData;
    public enemyName;
    public rewardArr = [];//拾取事件的奖励数组
    public actReduce = 1;
    //强制通过
    public forcePass = false;
    public roleName;
    //初始化
    constructor(owner) {
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
        this.txtCtn.x = -FogFunc.itemWidth / 2;
        this.txtCtn.y = -FogFunc.itemHeight / 2;
        this.ctn.addChild(this.txtCtn);
    }
    /**更新格子事件信息 */
    public upDateEvent(event, ctn) {
        this.removeLastEvent();
        this.ctn = ctn;
        this.addCtn();
        if (event) {
            this.eventData = event;
            this.eventId = event.id;
            this.roleId = event.role;
            this.cfgData = FogFunc.instance.getCfgDatas("Event", this.eventId);
            this.logicType = this.cfgData.logicType;
            this.triggerMode = this.cfgData.triggerMode;
            this._mobilityCost = this.cfgData.mobilityCost;
            this.params = this.cfgData.params;
            this.pass = this.cfgData.pass;
            this.showUI();
        }
    }

    //获取行动力消耗
    public get mobilityCost() {
        if (this._mobilityCost == 0) return 0;
        this.actReduce = 1;
        FogPropTrigger.checkPropTriggerOnInstance(FogPropTrigger.Prop_type_ReduceActCost, this);
        //最后要消耗的行动力=配置的行动力-减少的行动力
        var result = Math.ceil(this._mobilityCost * this.actReduce);
        return result;
    }

    /**界面显示 */
    showUI() {
        var icon = this.cfgData.mapIcon;
        if (icon) {
            var mapIcon = icon[0]
            //名字、缩放，x偏移，y偏移，层级
            if (icon.length > 1) {
                if (this.owner.myRotate == FogConst.FOG_CELL_TURNRIGHT) {
                    //出入口在左侧
                    mapIcon = icon[1];
                } else if (this.owner.myRotate == FogConst.FOG_CELL_TURNLEFT) {
                    //出入口在右侧
                    mapIcon = icon[2];
                } else if (this.owner.myRotate == FogConst.FOG_CELL_TURNUP) {
                    //出入口在下侧
                    mapIcon = icon[3];
                }
            }
            this.iconCtn.skin = FogFunc.instance.getMapIcon(mapIcon[0]);
            if (mapIcon[1]) {
                var scale = Number(mapIcon[1]) / 10000;
                this.iconCtn.scale(scale, scale);
            } else {
                this.iconCtn.scale(1, 1);
            }
            this.iconCtn.x = Number(mapIcon[2]);
            this.iconCtn.y = Number(mapIcon[3]);
            if (Number(mapIcon[4])) {
                var order = Number(mapIcon[4]);
                if (order == FogConst.FOG_CELLORDER_HIGH) {
                    this.owner.setOrder(100)
                } else if (order == FogConst.FOG_CELLORDER_LOW) {
                    this.owner.setOrder(-100)
                }
            } else {
                this.owner.setOrder(0)
            }
        } else {
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
        if (this.logicType == FogEventTrigger.Event_logical_Enemy) {
            this.enemyType = FogConst.FOG_EVENT_ENEMY_TYPE_NPC;
            var enemyId = FogEventTrigger.getNpcEnemyEvent(this.owner);
            this.enemyData = FogFunc.instance.getCfgDatas("Enemy", this.params[0])
            //名字
            var name;
            //战力
            var force;
            //如果是玩家类型的战斗事件
            if (enemyId == -1) {
                var id = FogModel.instance.getOneEnemyId(true);
                if (id) {
                    this.enemyId = id;
                    var userInfo = FogModel.instance.getEnemyInfoById(id);
                    var highRole = FogFunc.instance.getEnemyHighRole(userInfo.roles);
                    var info = RolesFunc.instance.getCfgDatas("Role", highRole);
                    aniName = info.spine[0];
                    scale = info.scale / 10000 * FogFunc.fogRoleScale;
                    action = "idle"
                    name = userInfo.name;
                    force = userInfo.userExt && userInfo.userExt.force || 0;
                    this.enemyType = FogConst.FOG_EVENT_ENEMY_TYPE_PLAYER;
                }
            }
            if (!this.enemyId) {
                var role;
                if (enemyId == -1) {
                    //随机一个和我战力差不多的npc
                    var myForce = RolesFunc.nowForce;
                    this.enemyId = FogFunc.instance.getNpcEnemyIdByForce(myForce);
                    role = FogFunc.instance.getCfgDatas("NpcArray", this.enemyId);
                    var roleId = role.waveMap[0][0];
                    var roleInfo = RolesFunc.instance.getCfgDatas("Role", roleId);
                    aniName = roleInfo.spine[0];
                    scale = roleInfo.scale / 10000 * FogFunc.fogRoleScale;
                    action = "idle"

                } else {
                    this.enemyId = enemyId;
                    role = FogFunc.instance.getCfgDatas("NpcArray", this.enemyId);
                }
                force = role.power;
            }
            //敌人事件还没有ai 的 随机确定一个ai
            if (!this.eventData.ai) {
                var ai = GameUtils.getWeightItem(this.enemyData.aiList)[0];
                this.eventData["ai"] = ai
                //敌人类型为npc的确定一个名字
                if (this.enemyType == FogConst.FOG_EVENT_ENEMY_TYPE_NPC && !this.eventData.name) {
                    var tempName = FogFunc.instance.getEnemyName();
                    this.eventData["name"] = tempName
                }
                FogServer.addCellEvent({ cellId: this.owner.mySign, ai: this.eventData.ai, name: this.eventData.name, id: this.eventId });
            }
            this.ai = this.eventData.ai
            if (!name) {
                name = this.eventData.name
            }
            if (this.cfgData.name) {
                name = TranslateFunc.instance.getTranslate(this.cfgData.name)
            }
            this.enemyName = name;
            var nameTxt = new Laya.Label(name);
            nameTxt.width = FogFunc.itemWidth;
            nameTxt.align = "center";
            nameTxt.fontSize = 20;
            nameTxt.color = "#ffffff";
            nameTxt.stroke = 1;
            this.txtCtn.addChild(nameTxt);
            //force=当前值*（1+加成值/10000*当前所在层）
            force = Math.floor(force * (1 + this.enemyData.powerShow / 10000 * (FogModel.instance.getCurLayer() + 1)))
            var forceTxt = new Laya.Label("战斗力：" + StringUtils.getCoinStr(force + ""));
            forceTxt.width = FogFunc.itemWidth;
            forceTxt.align = "center";
            forceTxt.fontSize = 20;
            forceTxt.color = "#feca50";
            forceTxt.stroke = 1;
            this.txtCtn.addChild(forceTxt);
            forceTxt.y = FogFunc.itemHeight - 20;

        } else if (this.logicType == FogEventTrigger.Event_logical_Role) {
            //解救本方角色
            if (this.roleId) {
                var roleInfo = RolesFunc.instance.getCfgDatas("Role", this.roleId);
                aniName = roleInfo.spine[0];
                scale = roleInfo.scale / 10000 * FogFunc.fogRoleScale;
                action = "idle"
                var nameTxt = new Laya.Label();
                nameTxt.width = FogFunc.itemWidth;
                nameTxt.align = "center";
                nameTxt.fontSize = 20;
                nameTxt.color = "#ffffff";
                nameTxt.stroke = 1;
                this.txtCtn.addChild(nameTxt);
                this.roleName = TranslateFunc.instance.getTranslate(this.cfgData.name, "TranslateEvent", TranslateFunc.instance.getTranslate(roleInfo.name))
                nameTxt.text = this.roleName
            }
        }
        if (aniName) {
            var item = PoolTools.getItem(PoolCode.POOL_ROLE + aniName);
            var scaleRoleInfo = BattleFunc.defaultScale * scale;
            if (!item) {
                this.roleAnim = new BattleRoleView(aniName, scaleRoleInfo, 0,"FogEventData");
            } else {
                item.setItemViewScale(scaleRoleInfo);
                this.roleAnim = item
            }
            this.spineCtn.addChild(this.roleAnim);
            this.roleAnim.play(action, true);
            this.spineName = aniName;
        }

    }

    //更新这个格子上的事件时，先清掉我的上个事件信息
    public removeLastEvent() {
        if (this.iconCtn) {
            this.iconCtn.removeSelf();
            this.iconCtn = null;
        }
        if (this.spineCtn) {
            if (this.roleAnim) {
                this.spineCtn.removeChild(this.roleAnim);
                PoolTools.cacheItem(PoolCode.POOL_ROLE + this.spineName, this.roleAnim);
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
        this.roleId = null
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
        if (type == FogEventTrigger.Event_logical_Reward) {
            if (this.eventData && this.eventData.reward && this.eventData.reward.length != 0) {
                this.rewardArr = FogFunc.instance.vertRewardTableToArr(this.eventData.reward);
            } else {
                var params = this.cfgData.params;
                var dropId;
                var dropArr;
                var itemArr = [];
                //随机奖励
                for (var i = 0; i < params.length; i++) {
                    dropId = params[i][0];
                    dropArr = FogFunc.instance.getDropGroupReward(dropId);
                    itemArr.push(GameUtils.getWeightItem(dropArr));
                }
                this.rewardArr = itemArr;
                //保存事件随机出的奖励
                FogServer.addCellEvent({ cellId: this.owner.mySign, rewardArr: this.rewardArr, id: this.eventId }, null, null);

            }

            var result = FogFunc.instance.getResourceShowInfo(this.rewardArr[0]);
            mapIcon = result["icon"];
            mapIconScale = result["scale"];
        }

        return { "icon": mapIcon, "scale": mapIconScale };
    }


}