import { ui } from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import BattleConst from "../../consts/BattleConst";
import BattleFunc from "../../func/BattleFunc";
import TimerManager from "../../../../framework/manager/TimerManager";
import { LoadManager } from "../../../../framework/manager/LoadManager";
import RolesModel from "../../model/RolesModel";
import RoleItemUI from "./RoleItemUI";
import RoleLineItemUI from "./RoleLineItemUI";
import GameUtils from "../../../../utils/GameUtils";
import RolesServer from "../../server/RolesServer";
import Message from "../../../../framework/common/Message";
import RoleEvent from "../../event/RoleEvent";
import UserModel from "../../model/UserModel";
import GuideManager from "../../manager/GuideManager";
import GuideConst from "../../consts/GuideConst";
import StatisticsManager from "../../manager/StatisticsManager";
import LogsManager from "../../../../framework/manager/LogsManager";
import GameMainEvent from "../../event/GameMainEvent";
import RedPointConst from "../../consts/RedPointConst";
import AdVideoManager from "../../../../framework/platform/AdVideoManager";
import PlaqueConst from "../../consts/PlaqueConst";

export default class RoleInLineUI extends ui.gameui.roleLine.RoleInLineUI implements IMessage {

    private timeCode = 0;
    private roleList = [];
    private lineList = [];
    public curData;
    //当前上阵数量
    public inLineCount = 0;
    private unlockCount = 0;
    //底部角色数组
    private roleItemArr = {};
    private isShowGuide = false;
    constructor() {
        super();
        new ButtonUtils(this.sureBtn, this.close, this)
        this.rolePanel.vScrollBarSkin = "";
    }

    public setData(data) {
        this.unlockCount = GlobalParamsFunc.instance.getUnlockLineCount();
        this.curData = RolesModel.instance.getData();
        this.isShowGuide = false;
        this.roleList = [];
        this.lineList = [];
        this.roleItemArr = {};
        this.inLineCount = 0;
        this.rolePanel.removeChildren();
        this.lineGroup.removeChildren();
        this.initRoleList();
        this.showGuide_302();
    }
    initRoleList() {
        var allRole = RolesModel.instance.getRolesList();
        for (var key in allRole) {
            if (allRole.hasOwnProperty(key)) {
                var item = allRole[key];
                var cfg = BattleFunc.instance.getCfgDatas("Role", key);
                if (cfg.kind == BattleConst.LIFE_JIDI) continue;
                if (item.inLine) {
                    this.inLineCount += 1;
                    this.lineList.push(cfg);
                }
                this.roleList.push(cfg);
            }
        }
        this.roleList = this.sortRoleArr(this.roleList);
        this.lineList = this.sortRoleArr(this.lineList);
        var res = WindowManager.getUILoadGroup(WindowCfgs.RoleItemUI) || [];
        var resAll = [];
        for (var url of res) {
            resAll.push(url);
        }
        LoadManager.instance.load(resAll, Laya.Handler.create(this, this.initRoleBack));
        this.initLineList();
    }
    //下方角色
    initRoleBack() {
        for (var i = 0; i < this.roleList.length; i++) {
            var item = this.roleList[i];
            var roleItem: RoleItemUI = new RoleItemUI(item, this);
            this.rolePanel.addChild(roleItem);
            roleItem.x = i % 3 * roleItem.itemWidth;
            roleItem.y = Math.floor(i / 3) * roleItem.itemHeight;
            this.roleItemArr[item.id] = { id: item.id, item: roleItem }
        }


    }
    //按序列排序
    sortRoleArr(arr: any[]) {
        return arr.sort((a, b) => {
            return parseInt(a.mainShowOrder) - parseInt(b.mainShowOrder);
        });
    }
    //上方布阵
    initLineList() {
        var res = WindowManager.getUILoadGroup(WindowCfgs.RoleLineItemUI) || [];
        var resAll = [];
        for (var url of res) {
            resAll.push(url);
        }
        LoadManager.instance.load(resAll, Laya.Handler.create(this, this.initLineBack));
    }
    initLineBack() {
        var unlock = GlobalParamsFunc.instance.getDataArray("squadUnlock");
        for (var i = 0; i < 6; i++) {
            var item = null;
            if (this.lineList[i]) {
                item = this.lineList[i];
            }
            var info = unlock[i].split(",")
            var roleItem: RoleLineItemUI = new RoleLineItemUI(item, this, info[1]);
            this.lineGroup.addChild(roleItem);
            roleItem.x = i % 3 * roleItem.itemWidth;
            roleItem.y = Math.floor(i / 3) * roleItem.itemHeight;
        }
        this.timeCode = TimerManager.instance.add(this.freshSpeak, this, GlobalParamsFunc.instance.getDataNum("arraySpeakInterval"))
        this.freshSpeak()

    }
    hideSpeakInfo() {
        this.rightSpeak.visible = false;
        this.leftSpeak.visible = false;
    }
    /**刷新某角色的上阵信息 */
    freshRoleInLine(id) {
        if (this.curData[id]) {
            if (this.curData[id].inLine == 1) {
                //必须有一个在阵上
                if (this.lineList.length <= 1) return;
                delete this.curData[id].inLine;
                this.inLineCount -= 1;
            } else {
                //如果当前还有可上阵的空位
                if (this.isCanLine()) {
                    this.curData[id].inLine = 1;
                    this.inLineCount += 1;
                }
            }
            this.lineList = [];
            for (var key in this.curData) {
                if (this.curData.hasOwnProperty(key)) {
                    var element = this.curData[key];
                    if (element.inLine) {
                        var cfg = BattleFunc.instance.getCfgDatas("Role", key)
                        this.lineList.push(cfg);
                    }
                }
            }
            this.lineList = this.sortRoleArr(this.lineList);
            this.roleItemArr[id].item.freshImgVis();
            this.freshLineInfo();
        }
    }

    //当前是否还有空位
    public isCanLine() {
        if (this.inLineCount < this.unlockCount) {
            return true
        }
        return false;
    }
    //刷新上面的信息
    public freshLineInfo() {
        for (var i = 5; i >= 0; i--) {
            var item = null;
            if (this.lineList[i]) {
                item = this.lineList[i];
            }
            var roleItem: RoleLineItemUI = this.lineGroup.getChildAt(i) as RoleLineItemUI;
            roleItem.freshLineState(item)
        }
    }
    freshSpeak() {
        if (this.lineGroup.numChildren > 0) {
            this.leftSpeak.visible = false;
            this.rightSpeak.visible = false;
            for (var i = 0; i < this.lineGroup.numChildren - 1; i++) {
                var cur = this.lineGroup.getChildAt(i) as RoleLineItemUI;
                cur.insSpeak = false;

            }
            var randomIndex = GameUtils.getRandomInt(0, this.lineList.length - 1);
            var item = this.lineGroup.getChildAt(randomIndex) as RoleLineItemUI;
            if (item) {
                item.freshSpeak(randomIndex, this.leftSpeak, this.rightSpeak, this.leftTxt, this.rightTxt);
            }
        }
    }
    showGuide_302() {
        if (UserModel.instance.getMainGuide() <= 4 && GuideManager.ins.recentGuideId == GuideConst.GUIDE_3_301) {
            GuideManager.ins.setGuideData(GuideConst.GUIDE_3_302, GuideManager.GuideType.None)
            GuideManager.ins.openGuideUI(GuideConst.GUIDE_3_302, this.showGuide_302_finish, this, this.showGuide_302_finish)
            this.isShowGuide = true;
        } else {
            AdVideoManager.instance.showInterstitialAdById(PlaqueConst.Plaque_RoleInline, this);
        }
    }
    showGuide_302_finish() {
        GuideManager.ins.guideFin(GuideConst.GUIDE_3_302, () => {
            WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
        }, this, true)
    }
    close() {
        TimerManager.instance.remove(this.timeCode);
        WindowManager.CloseUI(WindowCfgs.RoleInLineUI);
        RolesServer.upDataRoleInfo(this.curData, () => {
            Message.instance.send(RoleEvent.ROLE_EVENT_GAMEMAIN_ROLE_INLINE);
            Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_REDPOINT, RedPointConst.POINT_MAIN_TASKRED)
        }, this);
        Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_REDPOINT, RedPointConst.POINT_MAIN_LINERED)
        if (this.isShowGuide) {
            Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_FRESH_GUIDE, GuideConst.GUIDE_10003)
        }
    }




    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}