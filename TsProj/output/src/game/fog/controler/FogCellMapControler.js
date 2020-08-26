"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogsManager_1 = require("../../../framework/manager/LogsManager");
const FogFunc_1 = require("../../sys/func/FogFunc");
const GlobalParamsFunc_1 = require("../../sys/func/GlobalParamsFunc");
const GameUtils_1 = require("../../../utils/GameUtils");
const FogModel_1 = require("../../sys/model/FogModel");
const FogServer_1 = require("../../sys/server/FogServer");
const FogEventTrigger_1 = require("../trigger/FogEventTrigger");
const FogConst_1 = require("../../sys/consts/FogConst");
const WindowManager_1 = require("../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../sys/consts/WindowCfgs");
const FogPropTrigger_1 = require("../trigger/FogPropTrigger");
const FogMistControler_1 = require("./FogMistControler");
const StatisticsManager_1 = require("../../sys/manager/StatisticsManager");
const TimerManager_1 = require("../../../framework/manager/TimerManager");
const TaskServer_1 = require("../../sys/server/TaskServer");
const TaskConditionTrigger_1 = require("../../sys/trigger/TaskConditionTrigger");
/**迷雾格子地图控制器 */
class FogCellMapControler {
    constructor(fogControler) {
        //不能生成格子的y位置
        this.delY = [1, 2, 6, 7];
        //不能生成格子的x位置
        this.delY2 = [2, 6];
        this.fogControler = fogControler;
    }
    setData() {
        this.layer = this.fogControler.layer;
        var allCount = FogFunc_1.default.row * FogFunc_1.default.line;
        //创建格子
        for (var i = 0; i < allCount; i++) {
            var xIndex = i % FogFunc_1.default.line + 1;
            var yIndex = FogFunc_1.default.row - Math.floor(i / FogFunc_1.default.line);
            this.fogControler.createCell({ xIndex: xIndex, yIndex: yIndex });
        }
        var cellData = FogModel_1.default.instance.getCellInfo();
        //如果没有格子信息 就创建起点和终点
        if (!cellData) {
            this.createStartAndEnd();
            //获取所需敌人数据
            this.getPlayerEnemy(this.freshAllInfo, this);
        }
        else {
            this.freshAllInfo();
        }
        LogsManager_1.default.echo("cell,,,,,,,,,,,,", FogModel_1.default.instance.getCellInfo());
    }
    freshAllInfo() {
        if (!this.fogControler)
            return;
        //刷新当前敌人信息
        FogModel_1.default.instance.freshEnemyArr();
        this.initCellData();
        this.initBusShow();
    }
    //格子数据显示
    initCellData() {
        //先初始化起始点 因为部分点的初始话要用到起始点的数据
        var start = FogModel_1.default.instance.getCellIdByType(FogConst_1.default.cellType_Start);
        var end = FogModel_1.default.instance.getCellIdByType(FogConst_1.default.cellType_End);
        this.fogControler.getCellData(start).initCellData();
        this.fogControler.getCellData(end).initCellData();
        var arr = this.fogControler._cellInstanceArr;
        for (var i = 0; i < arr.length; i++) {
            //跳过起始点的初始话
            if (arr[i].mySign == start || arr[i].mySign == end)
                continue;
            arr[i].initCellData();
        }
    }
    //车显示
    initBusShow() {
        this.setBusData();
        this.fogControler.myBus = this.fogControler.createBus(null);
    }
    /**创建起点和终点 */
    createStartAndEnd() {
        var lastEnd = FogFunc_1.default.fogEndCellSign;
        var start;
        var endx;
        var endy;
        if (lastEnd) {
            lastEnd = lastEnd.split("_");
            var startX = Number(lastEnd[0]);
            var startY = Number(lastEnd[1]);
            if (Number(lastEnd[0]) == 1) {
                startX = FogFunc_1.default.line;
            }
            else if (Number(lastEnd[0]) == FogFunc_1.default.line) {
                startX = 1;
            }
            else if (Number(lastEnd[1]) == 1) {
                startY = FogFunc_1.default.row;
            }
            else if (Number(lastEnd[1]) == FogFunc_1.default.row) {
                startY = 1;
            }
            start = startX + "_" + startY;
        }
        else {
            var startInfo = GlobalParamsFunc_1.default.instance.getDataArray("startEnter");
            start = startInfo[0] + "_" + startInfo[1];
        }
        var startStr = start.split("_");
        var x = Number(startStr[0]);
        var y = Number(startStr[1]);
        var xArr = [];
        for (var i = 1; i <= FogFunc_1.default.line; i++) {
            xArr.push(i);
        }
        var yArr = [];
        for (var i = 1; i <= FogFunc_1.default.row; i++) {
            yArr.push(i);
        }
        if (x == 1 || x == FogFunc_1.default.line) {
            //不能和起点同列  起点处于左右两端
            var index = xArr.indexOf(x);
            xArr.splice(index, 1);
            //上下两端的出口只能在中心位置
            endx = 3;
            // //如果在第一列或在最后一列，得去掉不可生成出口的行数
            // if (endx == 1 || endx == FogFunc.line) {
            //     for (var i = yArr.length; i >= 0; i--) {
            //         if (this.delY.indexOf(yArr[i]) != -1) {
            //             yArr.splice(i, 1);
            //         }
            //     }
            //     endy = GameUtils.getRandomInArr(yArr).result;
            // } else {
            //     //在中间列，y只能是第一行或者是最后一行
            endy = GameUtils_1.default.getRandomInArr([1, FogFunc_1.default.row]).result;
            // }
        }
        else if (y == 1 || y == FogFunc_1.default.row) {
            //不能和起点同行 起点处于上下
            var index = yArr.indexOf(y);
            yArr.splice(index, 1);
            //去掉不可生成的行数
            for (var i = yArr.length; i >= 0; i--) {
                if (this.delY2.indexOf(yArr[i]) != -1) {
                    yArr.splice(i, 1);
                }
            }
            endy = GameUtils_1.default.getRandomInArr(yArr).result;
            //如果出口的y在第一行或者最后一行，固定在第三列
            if (endy == 1 || endy == FogFunc_1.default.row) {
                endx = 3;
            }
            else {
                endx = GameUtils_1.default.getRandomInArr([1, FogFunc_1.default.line]).result;
            }
        }
        var end = endx + "_" + endy;
        LogsManager_1.default.echo("start-------------", start);
        LogsManager_1.default.echo("end-------------", end);
        this.fogControler.delCellId(start);
        this.fogControler.delCellId(end);
        FogServer_1.default.initCellInfo({ id: start, type: FogConst_1.default.cellType_Start, ste: 2 }, () => {
            var temp = {};
            temp[start] = { ste: 2 };
            this.freshTargetCell(temp);
        }, this);
        FogServer_1.default.initCellInfo({ id: end, type: FogConst_1.default.cellType_End }, this.createStartAround, this, true);
    }
    //开启起点上，下，左，右的点
    createStartAround() {
        var start = FogModel_1.default.instance.getCellIdByType(FogConst_1.default.cellType_Start);
        this.createAround(start, false);
        //初始化所有事件
        this.fogControler.fogCellEventControler.initEvent();
    }
    //初始化大巴车信息
    setBusData() {
        var start = FogModel_1.default.instance.getCellIdByType(FogConst_1.default.cellType_Start);
        var bus = FogModel_1.default.instance.getBusInfo();
        if (!bus || !bus.pos) {
            //放到起点
            FogServer_1.default.setBusPos({ pos: start });
        }
    }
    /**
     * 开启四周点
     * @param id 参照格子id
     * @param freshState 是否刷新格子ui
     * @param isAsyc 是否同步
     * @param ste 格子状态
     */
    createAround(id, freshState = false, ste = 1) {
        var item = this.fogControler.getCellData(id);
        var tempOpen = {};
        this.openAroundCell(item, "left", tempOpen);
        this.openAroundCell(item, "right", tempOpen);
        this.openAroundCell(item, "up", tempOpen);
        this.openAroundCell(item, "down", tempOpen);
        //有数据变化
        if (Object.keys(tempOpen).length > 0) {
            FogServer_1.default.openCell({ cell: tempOpen }, () => {
                if (freshState) {
                    this.freshTargetCell(tempOpen);
                }
            }, this, false);
        }
    }
    /**刷新指定格子的状态 */
    freshTargetCell(tempOpen) {
        for (var id in tempOpen) {
            var item = this.fogControler.getCellData(id);
            item.freshMyState();
            var state = tempOpen[id];
            if (state) {
                if (state.ste == FogConst_1.default.FOG_CELLSTATE_OPEN) {
                    this.fogControler.mistControler.onLockOneCell(item.xIndex, item.yIndex);
                    //遍历这个item
                    item.refreshFogMist();
                    var nearPosArr = FogMistControler_1.default.rectNearPoints;
                    for (var i = 0; i < nearPosArr.length; i++) {
                        var tempPos = nearPosArr[i];
                        var targetX = item.xIndex + tempPos[0];
                        var targetY = item.yIndex + tempPos[1];
                        var key = FogFunc_1.default.instance.getKeyByPos(targetX, targetY);
                        var nearItem = this.fogControler.getCellData(key);
                        if (nearItem) {
                            nearItem.refreshFogMist();
                        }
                    }
                }
            }
        }
    }
    /**开启点 */
    openAroundCell(item, pos, tempOpen, ste = 1) {
        var id = item.getAroundCell(pos);
        if (this.fogControler.getCellData(id)) {
            var data = FogModel_1.default.instance.getCellInfoById(id);
            if (!data || !data.ste) {
                tempOpen[id] = { ste: ste };
            }
        }
    }
    /**完全开启目标格子 */
    openTargetCell(id) {
        var newOpen = false;
        var data = FogModel_1.default.instance.getCellInfoById(id);
        var tempOpen = {};
        var cell = this.fogControler.getCellData(id);
        if (data && data.ste && Number(data.ste) != FogConst_1.default.FOG_CELLSTATE_OPEN) {
            tempOpen[id] = { ste: 2 };
            newOpen = true;
            FogServer_1.default.openCell({ cell: tempOpen }, () => {
                this.freshTargetCell(tempOpen);
            }, this, false);
            //
            if (FogModel_1.default.instance.getIsHavePropByType(FogPropTrigger_1.default.Prop_type_RecoverAct)) {
                FogServer_1.default.updateFogCount({ type: FogConst_1.default.FOG_COUNT_OPENCELL }, () => {
                    //判断是否恢复行动力
                    FogPropTrigger_1.default.checkPropTriggerOnInstance(FogPropTrigger_1.default.Prop_type_RecoverAct, this.fogControler.getCellData(id));
                }, this);
            }
        }
        //敌人类型 的格子，添加不能通行标志
        if (cell.eventData && cell.eventData.logicType == FogEventTrigger_1.default.Event_logical_Enemy) {
            this.addNoPathSign(cell.xIndex, cell.yIndex);
        }
        return newOpen;
    }
    /**获取玩家类型的敌人数据 */
    getPlayerEnemy(callBack, thisObj) {
        //需要在一层结束时，清掉未攻击的敌人，已攻击的敌人留下，用来排重
        var event = FogModel_1.default.instance.getCellInfo();
        var battleCount = 0;
        for (var key in event) {
            if (event.hasOwnProperty(key)) {
                var item = event[key];
                //这个格子上有事件
                if (item.evt) {
                    var eventInfo = FogFunc_1.default.instance.getCfgDatas("Event", item.evt.id);
                    if (Number(eventInfo.logicType) == FogEventTrigger_1.default.Event_logical_Enemy) {
                        var id = FogFunc_1.default.instance.getCfgDatasByKey("Enemy", eventInfo.params[0], "array");
                        //id为1说明是玩家类型的敌人
                        if (id == -1) {
                            battleCount += 1;
                        }
                    }
                }
            }
        }
        //需要获取的敌人数量不为0
        if (battleCount != 0) {
            var data = {
                randNum: battleCount,
                uidList: FogModel_1.default.instance.getUsedEnemyList()
            };
            var isShow = false;
            //防止两秒内未返回敌人数据，直接刷新格子数据
            var timeCode = TimerManager_1.default.instance.setTimeout(() => {
                callBack && callBack.call(thisObj);
                isShow = true;
            }, this, 2000);
            FogServer_1.default.getEnemyList(data, (result) => {
                if (result && !result.error) {
                    //存储到fogModel数据中
                    var list = result.data && result.data.randResult || {};
                    FogServer_1.default.savePlayerEnemyData(list);
                }
                TimerManager_1.default.instance.clearTimeout(timeCode);
                if (!isShow) {
                    callBack && callBack.call(thisObj);
                }
            }, this);
        }
        else {
            callBack && callBack.call(thisObj);
        }
    }
    /**添加标志: 不能通过 or 能通过 */
    addNoPathSign(xIndex, yIndex, add = true) {
        var startX = xIndex - 1 < 1 ? 1 : xIndex - 1;
        var endX = xIndex + 1 > FogFunc_1.default.line ? FogFunc_1.default.line : xIndex + 1;
        var startY = yIndex - 1 < 1 ? 1 : yIndex - 1;
        var endY = yIndex + 1 > FogFunc_1.default.row ? FogFunc_1.default.row : yIndex + 1;
        var item;
        var tempOpen = {};
        for (var i = startX; i <= endX; i++) {
            for (var j = startY; j <= endY; j++) {
                if (i == xIndex && j == yIndex)
                    continue;
                item = this.fogControler.getCellData(i + "_" + j);
                if (item && (!item.myData || !item.myData.ste || Number(item.myData.ste) != FogConst_1.default.FOG_CELLSTATE_OPEN)) {
                    //状态置为锁定
                    tempOpen[item.mySign] = { lock: 1 };
                }
            }
        }
        if (add) {
            FogServer_1.default.openCell({ cell: tempOpen }, () => {
                this.freshTargetCell(tempOpen);
            }, this, false);
        }
        else {
            FogServer_1.default.delCellInfo({ cell: tempOpen }, () => {
                this.freshTargetCell(tempOpen);
            }, this, false);
        }
    }
    /**显示出口 */
    showExit() {
        var curlayer = FogModel_1.default.instance.getCurLayer() + 1;
        var allLayer = FogFunc_1.default.instance.getAllLayer();
        //到达最后一层了，通关
        if (curlayer >= allLayer) {
            TaskServer_1.default.updateTaskProcess({ logicType: TaskConditionTrigger_1.default.taskCondition_fogHighLayer, count: allLayer }, null, null, false);
            FogServer_1.default.setMaxLayer();
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogTipUI, { type: FogConst_1.default.FOG_VIEW_TYPE_PASS_SUCCESS });
        }
        else {
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogTipUI, { type: FogConst_1.default.FOG_VIEW_TYPE_NEXTLAYER });
        }
    }
    //进入下一层
    enterNextLayer() {
        FogServer_1.default.enterNextLayer(null);
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.FOG_NEXTLEVEL, { layer: FogModel_1.default.instance.getCurLayer() + 1 });
        this.fogControler.exitBattle();
    }
    dispose() {
        this.fogControler = null;
        this.layer = null;
        TimerManager_1.default.instance.removeByObject(this);
    }
}
exports.default = FogCellMapControler;
//# sourceMappingURL=FogCellMapControler.js.map