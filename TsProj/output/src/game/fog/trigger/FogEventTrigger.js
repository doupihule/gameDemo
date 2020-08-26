"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FogFunc_1 = require("../../sys/func/FogFunc");
const FogModel_1 = require("../../sys/model/FogModel");
const WindowManager_1 = require("../../../framework/manager/WindowManager");
const LogsManager_1 = require("../../../framework/manager/LogsManager");
const WindowCfgs_1 = require("../../sys/consts/WindowCfgs");
const GameUtils_1 = require("../../../utils/GameUtils");
const FogConst_1 = require("../../sys/consts/FogConst");
const FogPropTrigger_1 = require("./FogPropTrigger");
const FogServer_1 = require("../../sys/server/FogServer");
const StatisticsManager_1 = require("../../sys/manager/StatisticsManager");
const GuideManager_1 = require("../../sys/manager/GuideManager");
const GuideConst_1 = require("../../sys/consts/GuideConst");
/**
 *事件触发器
 *
 */
class FogEventTrigger {
    /**
     * 检测事件触发
     * @param triggerMode 触发方式
     * @param cell 被检测的格子
     */
    static checkEventTriggerOnInstance(triggerMode, cell) {
        var eventData = cell.eventData;
        //被检测的格子没有事件，直接返回
        if (!eventData)
            return false;
        //当前触发的方式和这个格子上的事件触发方式匹配上了
        if (triggerMode == eventData.triggerMode) {
            if (this.checkOneEvent(eventData, cell)) {
                //停止当前运动
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.FOG_EVENT_TRIGGER, { eventId: eventData.eventId });
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    }
    static checkOneEvent(eventData, cell) {
        var logicType = eventData.logicType;
        //无逻辑事件 继续往前走
        if (logicType == FogEventTrigger.Event_logical_None)
            return false;
        if (eventData.forcePass) {
            eventData.forcePass = false;
            return false;
        }
        //判断是否结束前置事件
        var isOverFront = this.checkFrontEvent(eventData);
        if (isOverFront) {
            //检测当前事件
            var func = this["runEvent_" + logicType];
            if (!func) {
                LogsManager_1.default.errorTag("fogEventError", "没有对应的FogEvent类型:", logicType);
            }
            else {
                func.call(this, eventData, cell);
            }
            return true;
        }
        return true;
    }
    /**检测前置事件 */
    static checkFrontEvent(eventData) {
        var front = eventData.cfgData.frontEvents;
        var isOver = true;
        var cellInfo = FogModel_1.default.instance.getCellInfo();
        if (front) {
            for (var key in cellInfo) {
                if (cellInfo.hasOwnProperty(key)) {
                    var item = cellInfo[key];
                    //如果这个格子有事件并且事件在被检测事件的前置事件中
                    if (item.evt && front.indexOf(Number(item.evt.id)) != -1) {
                        isOver = false;
                        break;
                    }
                }
            }
        }
        //没有结束前置事件
        if (!isOver) {
            //@zm  后续换成界面
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogTipUI, { "type": FogConst_1.default.FOG_VIEW_TYPE_FRONTEVENT, "tip": eventData.cfgData.frontEventsTips });
        }
        return isOver;
    }
    /**获取npc Id */
    static getNpcEnemyEvent(cell) {
        var event = cell.eventData;
        //如果有事件
        if (event) {
            //如果这个格子的事件逻辑类型是敌人
            if (event.logicType == FogEventTrigger.Event_logical_Enemy) {
                var params = event.params;
                var array = FogFunc_1.default.instance.getCfgDatasByKey("Enemy", params[0], "array");
                //array==-1 表示是读取玩家数据
                return array;
            }
        }
        return null;
    }
    //执行第一个事件 无逻辑表现
    static runEvent_1(event, cell) {
    }
    //执行第二个事件 敌人
    static runEvent_2(event, cell) {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.BattleDetailUI, { event: event, cell: cell });
    }
    //执行第三个事件 本方角色
    static runEvent_3(event, cell) {
        cell.fogControler.checkGuide_1201_finish();
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogUserRoleUI, {
            event: event, callBack: FogEventTrigger.freshCellByType.bind(this, { cell: cell, behind: 1, type: FogEventTrigger.Event_logical_Role }), thisObj: this
        });
    }
    //执行第四个事件 拾取奖励
    static runEvent_4(event, cell) {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogMultiRewardUI, {
            event: event, cell: cell, viewType: FogConst_1.default.VIEW_TYPE_REWARD_EVENT, callBack: FogEventTrigger.freshCellByType.bind(this, { cell: cell, behind: 1 }), thisObj: this
        });
    }
    //执行第五个事件 宝箱
    static runEvent_5(event, cell) {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogBoxUI, { event: event, cell: cell });
    }
    //执行第六个事件 Npc对话
    static runEvent_6(event, cell) {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogNpcTalkUI, {
            event: event, callBack: FogEventTrigger.freshCellByType.bind(this, { cell: cell, behind: 1 }), thisObj: this
        });
    }
    //执行第七个事件 奖励选择
    static runEvent_7(event, cell) {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogChooseUI, { event: event, cell: cell });
    }
    //执行第八个事件 黑市商人
    static runEvent_8(event, cell) {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogBusinessmanUI, { event: event, cell: cell });
    }
    //执行第九个事件 局内商店
    static runEvent_9(event, cell) {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogShopUI, { event: event, cell: cell, type: FogConst_1.default.FOG_SHOP_TYPE_INNER });
    }
    //执行第十个事件 障碍物
    static runEvent_10(event, cell) {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogObstacleUI, {
            event: event, callBack: FogEventTrigger.freshCellByType.bind(this, { cell: cell, behind: 1 }), thisObj: this
        });
    }
    //执行第十一个事件 门
    static runEvent_11(event, cell) {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogDoorUI, {
            event: event, callBack: FogEventTrigger.freshCellByType.bind(this, { cell: cell, behind: 1 }), thisObj: this
        });
    }
    //执行第十二个事件 坏掉的路
    static runEvent_12(event, cell) {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogObstacleUI, {
            event: event, callBack: FogEventTrigger.freshCellByType.bind(this, { cell: cell, behind: 1 }), noPathCallBack: FogEventTrigger.noFinishEvent.bind(this, { cell: cell }), thisObj: this
        });
    }
    //执行第十三个事件 答题
    static runEvent_13(event, cell) {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogAnswerUI, { event: event, cell: cell, callBack: FogEventTrigger.freshCellByType.bind(this, { cell: cell, behind: 1 }), thisObj: this });
    }
    //执行第十四个事件 上交东西
    static runEvent_14(event, cell) {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogHandinUI, { event: event, callBack: FogEventTrigger.freshCellByType.bind(this, { cell: cell, behind: 1 }), thisObj: this });
    }
    /**当前事件完成后刷新格子 */
    static freshCellByType(data) {
        var cell = data.cell;
        //不需要单独处理的事件 不需要传type
        var type = data.type;
        var event = cell.eventData;
        //有些类型的事件需要单独处理一些事
        if (type) {
            if (type == FogEventTrigger.Event_logical_Enemy) {
                //清掉敌人周围的锁定标志
                cell.fogControler.cellMapControler.addNoPathSign(cell.xIndex, cell.yIndex, false);
                if (event.enemyType == FogConst_1.default.FOG_EVENT_ENEMY_TYPE_PLAYER) {
                    //如果是玩家类型的敌人，更新敌人的状态为已攻击
                    FogServer_1.default.updateEnemyState({ enemyId: event.enemyId });
                }
            }
            else if (type == FogEventTrigger.Event_logical_Role) {
                //清掉和我有相同解救角色的事件
                var arr = cell.fogControler._cellInstanceArr;
                for (var i = 0; i < arr.length; i++) {
                    var item = arr[i];
                    //如果被检测的格子已经有解救角色的事件
                    if (item != cell && item.eventData && item.eventData.roleId) {
                        //如果当前被检测格子上的角色id等于我刚解救的角色，就把当前格子上的事件删除
                        if (Number(cell.eventData.roleId) == Number(item.eventData.roleId)) {
                            item.delEventData();
                        }
                    }
                }
            }
        }
        //检测是否有后置事件  behind为true说明需要立刻检测后置是否弹
        FogEventTrigger.finishThisEvent(cell, data.behind, type);
    }
    /**完成当前格子的事件 */
    static finishThisEvent(cell, isQuickShow = false, type = null) {
        this.curBehindEvent = null;
        var event = cell.eventData;
        //检测完成事件的奖励
        FogPropTrigger_1.default.checkPropTriggerOnInstance(FogPropTrigger_1.default.Prop_type_AddExtraRewardByEvent, cell);
        //更新事件完成次数
        FogServer_1.default.updateFogCount({ type: FogConst_1.default.FOG_COUNT_EVENTFINISH });
        //更新积分
        FogServer_1.default.updateFogCount({ type: FogConst_1.default.fog_finish_event_score, count: event.cfgData.marks });
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.FOG_EVENT_COMPLETE);
        var recentEventId = event.eventId;
        var roleName = event.roleName;
        var back = event && event.cfgData.backEvent;
        //先把旧的格子事件删了
        cell.delEventData();
        var isMove = false;
        //检测后置
        if (back) {
            var isShow = GameUtils_1.default.getRandomInt(0, 10000) < back[2];
            if (isShow) {
                this.curBehindEvent = back[1];
                cell.addEventData(back[0]);
                //是否立刻检测是否弹后置事件
                if (isQuickShow) {
                    LogsManager_1.default.echo("开始检测------------", cell.mySign);
                    this.showBehindEvent({ cell: cell });
                }
            }
            else {
                isMove = true;
            }
        }
        else {
            isMove = true;
        }
        if (isMove) {
            cell.fogControler.myBus.continePath();
        }
        if (recentEventId == "3001" && GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_6_602) {
            //完成第一个npc事件后展示进入战斗的引导
            GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_6_603, cell.fogControler.showGuide_701, cell.fogControler, true);
        }
        else if (recentEventId == "3002" && GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_8_803) {
            //显示拾取零件引导
            cell.fogControler.showGuide_901();
        }
        else if (recentEventId == "3003" && GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_9_901) {
            //完成零件引导后显示升级大巴车引导
            cell.fogControler.checkGuide_902_finish();
        }
        else if (type == FogEventTrigger.Event_logical_Role) {
            //展示完成己方角色事件引导
            cell.fogControler.showGuide_1301(roleName);
        }
    }
    //显示后置事件
    static showBehindEvent(data) {
        var cell = data.cell;
        LogsManager_1.default.echo("检测后置------------", cell.mySign);
        if (this.curBehindEvent == FogEventTrigger.Behind_event_Quick) {
            //直接触发
            FogEventTrigger.checkOneEvent(cell.eventData, cell);
        }
    }
    /**没有完成事件，强制通过的回调 */
    static noFinishEvent(data) {
        var cell = data.cell;
        //不需要单独处理的事件 不需要传type
        var type = data.type;
        //没有完成这个事件，小车往前走，针对强制通行的事件
        var event = cell.eventData;
        event.forcePass = true;
        cell.fogControler.myBus.continePath();
    }
}
exports.default = FogEventTrigger;
/**事件触发方式：到达前一个格子触发 */
FogEventTrigger.FogEvent_trigger_Previous = 1;
/**事件触发方式：到达格子中心触发 */
FogEventTrigger.FogEvent_trigger_EnterCell = 2;
/**事件触发方式：直接触发 */
FogEventTrigger.FogEvent_trigger_Quick = 3;
//剩余的暂时不列举了 暂时用不到
/**事件逻辑类型：无逻辑类型 */
FogEventTrigger.Event_logical_None = 1;
/**事件逻辑类型：敌人 */
FogEventTrigger.Event_logical_Enemy = 2;
/**事件逻辑类型：本方角色 */
FogEventTrigger.Event_logical_Role = 3;
/**事件逻辑类型：拾取事件 */
FogEventTrigger.Event_logical_Reward = 4;
/**事件逻辑类型：障碍物事件 */
FogEventTrigger.Event_logical_Obstacle = 10;
/**事件逻辑类型：坏掉的路事件 */
FogEventTrigger.Event_logical_Brokenroad = 12;
/**后置事件类型：立刻触发 */
FogEventTrigger.Behind_event_Quick = 1;
/**后置事件类型：非直接触发 */
FogEventTrigger.Behind_event_Noquick = 2;
//# sourceMappingURL=FogEventTrigger.js.map