import FogLogicalControler from "./FogLogicalControler";
import FogInstanceCell from "../instance/FogInstanceCell";
import LogsManager from "../../../framework/manager/LogsManager";
import FogFunc from "../../sys/func/FogFunc";
import GlobalParamsFunc from "../../sys/func/GlobalParamsFunc";
import GameUtils from "../../../utils/GameUtils";
import FogModel from "../../sys/model/FogModel";
import FogServer from "../../sys/server/FogServer";
import TableUtils from "../../../framework/utils/TableUtils";
import FogConst from "../../sys/consts/FogConst";
import UserModel from "../../sys/model/UserModel";

/**迷雾格子事件管理器 */
export default class FogCellEventControler {

    private fogControler: FogLogicalControler;
    private tempCellData;

    /**事件随机类型：全部显示*/
    public static Event_ShowType_All = 1;
    /**事件随机类型：随机事件*/
    public static Event_ShowType_RandomEvent = 2;
    /**事件随机类型：随机事件组*/
    public static Event_ShowType_RandomEventGroup = 3;
    constructor(fogControler) {
        this.fogControler = fogControler;
        this.tempCellData = {};
    }
    setData() {
        this.initGlobalEvent();
    }
    /**初始化全局事件 */
    initGlobalEvent() {
        //已经初始化过全局事件 直接退出
        if (FogModel.instance.getGlobalEvent()) return;
        var globalEvent = {};
        var cfg = FogFunc.instance.getAllCfgData("GlobalEvents");
        var tempArr;
        for (var id in cfg) {
            var item = cfg[id];
            var event = item.eventList;
            tempArr = [];
            tempArr = GameUtils.createArrBetweenTwo(item.layerRange[0], item.layerRange[1]);
            for (var i = 0; i < event.length; i++) {
                var eventItem = event[i];
                //判断这个事件是否出 不出 直接下一个
                if (GameUtils.getRandomInt(1, 10000) > Number(eventItem[1])) continue;
                var layer;
                if (tempArr.length > 0) {
                    //优先没有全局事件的层
                    var info = GameUtils.getRandomInArr(tempArr);
                    tempArr.splice(info.index, 1);
                    layer = info.result;
                } else {
                    //这些层全有全局事件了，直接随机
                    layer = GameUtils.getRandomInt(item.layerRange[0], item.layerRange[1]);
                }
                var eventInfo = globalEvent[layer];
                if (!eventInfo) {
                    eventInfo = {};
                }
                eventInfo[eventItem[0]] = eventItem[0];
                globalEvent[layer] = eventInfo;
            }
        }
        FogServer.setGlobalEvent({ event: globalEvent });

    }
    /**初始化格子上的所有事件 */
    initEvent() {
        //先初始化出入口事件组
        this.initStartAndEndEvent();
        //初始化全局事件
        this.setGlobalEventOnItem();
        //初始化本层必出事件
        this.setLayerSureEvent();
        //初始化本层随机事件
        this.setLayerRandomEvent();
        //同步格子的事件
        FogServer.initCellEvent({ cell: this.tempCellData });

    }
    /**初始化起点和终点周围的事件组 */
    initStartAndEndEvent() {
        var cfg = this.fogControler.layerCfg;
        var enterId = GameUtils.getWeightItem(cfg.enterEvent)[0];
        var start = FogModel.instance.getCellIdByType(FogConst.cellType_Start);
        this.setEventGroup(enterId, this.fogControler.getCellData(start), FogConst.cellType_StartAround);
        var end = FogModel.instance.getCellIdByType(FogConst.cellType_End);
        var exitId = GameUtils.getWeightItem(cfg.exitEvent)[0];
        this.setEventGroup(exitId, this.fogControler.getCellData(end), FogConst.cellType_EndAround);
        //把开始我正前方的格子强制设置成3001
        if (UserModel.instance.getMainGuide() == 9 && this.fogControler._allCellId.indexOf("3_2") != -1) {
            this.setEventData("3_2", "3001", 3);
        }

    }
    /**给格子设置全局事件 */
    setGlobalEventOnItem() {
        var global = FogModel.instance.getGlobalEvent();
        var info = global && global[this.fogControler.layer]
        //如果这层有全局事件
        if (info) {
            var random;
            for (var id in info) {
                this.setEventGroup(id);
            }
        }
    }
    /**设置本层必出事件 */
    setLayerSureEvent() {
        var cfg = this.fogControler.layerCfg;
        var id = GameUtils.getWeightItem(cfg.sureEvents)[0];
        this.setEventGroup(id);
    }
    /**设置本层随机事件 */
    setLayerRandomEvent() {
        var cfg = this.fogControler.layerCfg;
        var num = Number(GameUtils.getWeightItem(cfg.randomEventsNum)[0]);
        var random = [];
        var eventTab = {};
        TableUtils.copyOneArr(cfg.randomEvents, random);
        for (var i = 0; i < num; i++) {
            var info = GameUtils.getWeightItem(random);
            var id = info[0]
            //随出一个事件组
            this.setEventGroup(id);
            if (!eventTab[id]) {
                eventTab[id] = 0;
            }
            eventTab[id] += 1
            var item = info[0] + "," + info[1] + "," + info[2];
            var index = random.indexOf(item);
            if (eventTab[id] >= Number(info[1])) {
                var item = info[0] + "," + info[1] + "," + info[2];
                var index = random.indexOf(item);
                //把随出的事件组删掉
                random.splice(index, 1);
            }

        }
    }
    /**
     * 根据事件组，设置某个item 的事件信息
     * @param eventId  事件id
     * @param referCell  相关格子  基于他做偏移
     * @param type  格子类型
     */
    setEventGroup(eventGroupId, referCell = null, type = null) {
        var event = FogFunc.instance.getCfgDatas("EventsGroup", eventGroupId);
        var eventList = event.eventList
        var eventType = event.type;
        if (eventType == FogCellEventControler.Event_ShowType_RandomEvent) {
            //如果是随机事件类型
            eventList = [GameUtils.getWeightItem(eventList)]
        } else if (eventType == FogCellEventControler.Event_ShowType_RandomEventGroup) {
            //如果是随机事件组类型，随出一个事件组id，然后再取这个事件组的事件信息
            var randomGroup = GameUtils.getWeightItem(eventList)[0];
            this.setEventGroup(randomGroup, referCell,type);
            return;
        }
        for (var i = 0; i < eventList.length; i++) {
            var itemEvent = eventList[i];
            var eventId = itemEvent[0];
            var id;
            //如果存在坐标偏移
            if (referCell && (itemEvent[1] || itemEvent[2])) {
                //获取偏移的格子id
                id = referCell.getOffestCellId(Number(itemEvent[1]), Number(itemEvent[2]));
            } else {
                id = GameUtils.getRandomInArr(this.fogControler._allCellId).result;
            }
            if (id) {
                if (id == "3_2" && referCell && UserModel.instance.getMainGuide() == 9) {
                    eventId = "3001"
                }
                this.setEventData(id, eventId, type);
            }
        }

    }
    //暂存事件信息
    setEventData(id, eventId, cellType = null) {
        //将这个id从可随机事件列表删除
        this.fogControler.delCellId(id);
        this.tempCellData[id] = {};
        if (cellType) {
            this.tempCellData[id]["type"] = cellType
        }
        this.tempCellData[id]["evt"] = {
            id: eventId
        };
    }

    dispose() {
        this.fogControler = null;
        this.tempCellData = null;

    }

}
