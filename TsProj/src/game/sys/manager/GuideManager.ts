import IMessage from "../interfaces/IMessage";
import WindowManager from "../../../framework/manager/WindowManager";
import StatisticsManager from "./StatisticsManager";
import LogsManager from "../../../framework/manager/LogsManager";
import UserModel from "../model/UserModel";
import GuideFunc from "../func/GuideFunc";
import { WindowCfgs } from "../consts/WindowCfgs";
import GuideServer from "../server/GuideServer";
import GuideConst from "../consts/GuideConst";

export default class GuideManager implements IMessage {

    static GuideType: any = {
        Auto: 1,
        Static: 2,
        None: 3
    }

    public constructor() {
    }

    public noMask = false;

    private static _ins: GuideManager;
    private point = new Laya.Point(0, 0);

    public recentGuideId;//上一步引导Id
    public nowGuideId;//当前引导Id
    public nowGuideSkip;//引导跳过打点

    static maxGuide = 10;

    static get ins(): GuideManager {
        if (!GuideManager._ins) {
            GuideManager._ins = new GuideManager();
        }
        return GuideManager._ins;
    }

    /*
    {
        1001:{
            type: 10,//显示类型
            bottom: 265,
            top: NaN,
            x: 0,
            y: ScreenAdapterTools.height - 108 - 30,
            width: 107,
            height: 108,
            statisticsIndex: StatisticsManager.GUIDE_EQUIPSHOP_3,//完成打点
            guideSkip: StatisticsManager.GUIDE_EQUIPSHOP_SKIP,//跳过打点
        }
    }
    */
    public guideData = {
        101: {
            type: GuideConst.GUIDE_TYPE_M,
            statisticsIndex: StatisticsManager.GUIDE_1_1,
            centerY: 0,
        },
        102: {
            type: GuideConst.GUIDE_TYPE_M,
            statisticsIndex: StatisticsManager.GUIDE_1_2,
            centerY: 0,
            direction: "right"
        },
        103: {
            type: GuideConst.GUIDE_TYPE_M,
            statisticsIndex: StatisticsManager.GUIDE_1_3,
            centerY: 0,
        },
        104: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_1_4,
            bottom: 440,
        },
        105: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_1_5,
            bottom: 440,
        },
        106: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_1_6,
            bottom: 480,
        },
        107: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_1_7,
            bottom: 200,
        },
        108: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_1_8,
            bottom: 600,
        },
        109: {
            type: 1,
            statisticsIndex: StatisticsManager.GUIDE_1_9,
            centerY: -200,
        },
        201: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_2_1,
            centerY: -50,
        },
        202: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_2_2,
        },
        203: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_2_3,
        },
        204: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_2_4,
            bottom: 300,
        },
        205: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_2_5,
        },
        206: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_2_6,
        },
        207: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_2_7,
        },
        301: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_3_1,
            bottom: 250,

        },
        302: {
            type: GuideConst.GUIDE_TYPE_NONE,
            statisticsIndex: StatisticsManager.GUIDE_3_2,
            centerY: 0,
        },
        401: {
            type: GuideConst.GUIDE_TYPE_M_RF,
            statisticsIndex: StatisticsManager.GUIDE_4_1,
            bottom: 300,
        },
        402: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_4_2,
            centerY: 0,
        },
        403: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_4_3,
            bottom: 600,
        },
        404: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_4_4,
            bottom: 400,
        },
        405: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_4_5,
            centerY: 0,
        },
        406: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_4_6,
            centerY: -200,
        },
        407: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_4_7,
            centerY: 0,
        },
        408: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_4_8,
            centerY: 0,
        },
        409: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_4_9,
            centerY: -100,
        },
        501: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_5_1,
            centerY: 0,
        },
        601: {
            type: GuideConst.GUIDE_TYPE_M,
            statisticsIndex: StatisticsManager.GUIDE_6_1,
            centerY: 0,
            noSkip: 1,
            direction: "right"
        },
        602: {
            type: GuideConst.GUIDE_TYPE_M,
            statisticsIndex: StatisticsManager.GUIDE_6_2,
            centerY: 0,
            noSkip: 1
        },
        603: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_6_3,
            centerY: -200,
            noSkip: 1
        },
        701: {
            type: GuideConst.GUIDE_TYPE_M,
            statisticsIndex: StatisticsManager.GUIDE_7_1,
            centerY: 0,
            noSkip: 1
        },
        702: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_7_2,
            centerY: -200,
            noSkip: 1,
            direction: "right"
        },
        801: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_8_1,
            centerY: 0,
            noSkip: 1
        },
        802: {
            type: GuideConst.GUIDE_TYPE_M,
            statisticsIndex: StatisticsManager.GUIDE_8_2,
            bottom: 100,
            noSkip: 1
        },
        803: {
            type: GuideConst.GUIDE_TYPE_M,
            statisticsIndex: StatisticsManager.GUIDE_8_3,
            centerY: 0,
            noSkip: 1
        },
        901: {
            type: GuideConst.GUIDE_TYPE_M,
            statisticsIndex: StatisticsManager.GUIDE_9_1,
            centerY: 0,
            noSkip: 1,
            direction: "right"
        },
        902: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_9_2,
            centerY: -200,
            noSkip: 1
        },
        1001: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_10_1,
            centerY: 0,
            noSkip: 1
        },
        1002: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_10_2,
            bottom: 100,
            noSkip: 1
        },
        1003: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_10_3,
            centerY: 0,
            noSkip: 1
        },
        1004: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_10_4,
            centerY: 0,
            noSkip: 1,
            direction: "right"
        },
        1101: {
            type: GuideConst.GUIDE_TYPE_M_RF,
            statisticsIndex: StatisticsManager.GUIDE_11_1,
            centerY: 0,
            noSkip: 1
        },
        1102: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_11_2,
            centerY: 0,
            noSkip: 1
        },
        1103: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_11_3,
            centerY: 0,
            noSkip: 1
        },
        1201: {
            type: GuideConst.GUIDE_TYPE_M_F,
            statisticsIndex: StatisticsManager.GUIDE_12_1,
            // bottom: 100,
            noSkip: 1
        },
        1301: {
            type: GuideConst.GUIDE_TYPE_M,
            statisticsIndex: StatisticsManager.GUIDE_13_1,
            statisticsIndexExtra: StatisticsManager.GUIDE_FINISH,
            centerY: 0,
            noSkip: 1
        },
        10001: {
            type: GuideConst.GUIDE_TYPE_M_F,
        },
        10002: {
            type: GuideConst.GUIDE_TYPE_F,
            noSkip: 1
        },
        10003: {
            type: GuideConst.GUIDE_TYPE_M_RIGHTF,
            noSkip: 1,
            autoClose: 1
        }
    };

    /**
    *   初始化引导位置
    */
    public setGuideData(guideId, type, object = null, parentUI = null, width = null, height = null, x = null, y = null, extra = null) {
        var button = object as Laya.UIComponent;
        var data = this.guideData[guideId] || {};
        var point;
        var pos;
        switch (type) {
            case GuideManager.GuideType.Auto:        //初始化仅储存组件，调用时再计算坐标及宽高
                data.sprite = button;
                break;
            case GuideManager.GuideType.Static:      //初始化将组件转换为坐标及宽高，不储存组件
                point = this.point;

                if (!width)
                    width = button.width;
                if (!height)
                    height = button.height;

                point.x = 0;
                point.y = 0;

                pos = button.localToGlobal(point, false, parentUI);
                data.x = pos.x;
                data.y = pos.y;
                data.width = width;
                data.height = height;
                break;
            case GuideManager.GuideType.None:      //初始化时无组件，设定位置和宽高
                if (button) {
                    point = this.point;
                    point.x = x;
                    point.y = y;
                    pos = button.localToGlobal(point, false, parentUI);
                    data.x = pos.x;
                    data.y = pos.y;
                }
                else {
                    data.x = x;
                    data.y = y;
                }
                data.width = width;
                data.height = height;
                break;
        }
        if (extra) {
            if (extra.base) {
                button = extra.base;
            }
            var offsetX = extra.offsetX || 0;
            var offsetY = extra.offsetY || 0;
            if (extra.pos1) {
                point = this.point;
                point.x = extra.pos1.x + offsetX;
                point.y = extra.pos1.y + offsetY;
                if (button && parentUI) {
                    extra.pos1 = button.localToGlobal(point, true, parentUI);
                }
            }
            if (extra.pos2) {
                point = this.point;
                point.x = extra.pos2.x + offsetX;
                point.y = extra.pos2.y + offsetY;
                if (button && parentUI) {
                    extra.pos2 = button.localToGlobal(point, true, parentUI);
                }
            }
            data.extra = extra;
        }
        this.guideData[guideId] = data;
    }

    /**
    *   获取记录过的引导位置信息
    */
    public getGuideData(guideId) {
        var data = this.guideData[guideId];
        if (data) {
            var object = this.guideData[guideId].sprite;
            if (object) {
                var position = object.localToGlobal(new Laya.Point(0, 0));
                position = WindowManager.guideLayer.globalToLocal(position);
                data.x = position.x;
                data.y = position.y;
                data.width = position.width;
                data.height = position.height;
            }
            data.fin = true;
        }

        return data;
    }

    /**
    *   获取副引导是否完成
    */
    public isGuideFin(guideId) {
        var flag = UserModel.instance.getSubGuide()[String(guideId)];
        if (flag) {
            return true;
        }
        return false;
    }

    public enterGuideRoom(uiName) {
    }


    public checkMainGuide() {
        if (UserModel.instance.getMainGuide() == 0) {
            return true;
        }
        return false;
    }

    public isMainGuideNeed(guideId, lastGuideId?, lastGuideId2?) {
    }

    public clearGuide() {
        WindowManager.CloseGuideUI(WindowCfgs.TalkFrameUI);
    }

    recvMsg() { }

    //打开引导界面（遮罩）
    openGuideUI(id, callBack = null, thisObj = null, skipCall = null) {
        this.nowGuideId = id;
        // if (WindowManager.isUIOpened(WindowCfgs.SevenDaysUI)) {
        //     WindowManager.CloseUI(WindowCfgs.SevenDaysUI);
        // }
        var guideData = GuideFunc.instance.getGuideInfo(id);
        Laya.timer.callLater(this, () => {
            // Message.instance.send(BannerEvent.BANNER_EVENT_SHOWLEADBANNER);
            // Message.instance.send(BannerEvent.BANNER_EVENT_SHOWQUICKBANNER);
        })
        this.nowGuideId = id;
        LogsManager.echo("krma. GameData.nowGuideId = " + this.nowGuideId);
        var x = 0;
        var y = 0;
        var width = 0;
        var height = 0;
        var type = 7;

        var position = null;

        var guideId = id;

        position = GuideManager.ins.getGuideData(guideId);

        if (position) {
            if (position.statisticsIndex)
                StatisticsManager.ins.onEvent(position.statisticsIndex);
            if (position.statisticsIndexExtra)
                StatisticsManager.ins.onEvent(position.statisticsIndexExtra);
            this.nowGuideSkip = position.guideSkip;
            type = position.type;

            x = position.x || x;
            y = position.y || y;
            width = position.width || width;
            height = position.height || height;
        }
        if (guideData.style != null) {
            type = guideData.style;
        }


        // if (this.guideUI || this.guideUI == 0) {
        WindowManager.OpenGuideUI(WindowCfgs.GuideUI, [guideId, x, y, width, height, type, guideData.maskTransparency * 0.01, position, callBack, thisObj, skipCall]);
        // }

        // Message.instance.send(GuideEvent.GUIDE_EVENT_OPENGUIDE);
    }

    //单步引导完成
    guideFin(guideId, callBack, thisObj, needSync = false) {
        this.recentGuideId = guideId;
        this.nowGuideId = null;
        if (needSync) {
            GuideServer.setMainGuide(guideId, callBack, thisObj);
        }
        else {
            if (callBack) {
                callBack.call(thisObj);
            }
        }
    }
}