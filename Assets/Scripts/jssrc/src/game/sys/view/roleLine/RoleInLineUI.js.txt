"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const BattleConst_1 = require("../../consts/BattleConst");
const BattleFunc_1 = require("../../func/BattleFunc");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const LoadManager_1 = require("../../../../framework/manager/LoadManager");
const RolesModel_1 = require("../../model/RolesModel");
const RoleItemUI_1 = require("./RoleItemUI");
const RoleLineItemUI_1 = require("./RoleLineItemUI");
const GameUtils_1 = require("../../../../utils/GameUtils");
const RolesServer_1 = require("../../server/RolesServer");
const Message_1 = require("../../../../framework/common/Message");
const RoleEvent_1 = require("../../event/RoleEvent");
const UserModel_1 = require("../../model/UserModel");
const GuideManager_1 = require("../../manager/GuideManager");
const GuideConst_1 = require("../../consts/GuideConst");
const GameMainEvent_1 = require("../../event/GameMainEvent");
const RedPointConst_1 = require("../../consts/RedPointConst");
const AdVideoManager_1 = require("../../../../framework/platform/AdVideoManager");
const PlaqueConst_1 = require("../../consts/PlaqueConst");
class RoleInLineUI extends layaMaxUI_1.ui.gameui.roleLine.RoleInLineUI {
    constructor() {
        super();
        this.timeCode = 0;
        this.roleList = [];
        this.lineList = [];
        //当前上阵数量
        this.inLineCount = 0;
        this.unlockCount = 0;
        //底部角色数组
        this.roleItemArr = {};
        this.isShowGuide = false;
        new ButtonUtils_1.ButtonUtils(this.sureBtn, this.close, this);
        this.rolePanel.vScrollBarSkin = "";
    }
    setData(data) {
        this.unlockCount = GlobalParamsFunc_1.default.instance.getUnlockLineCount();
        this.curData = RolesModel_1.default.instance.getData();
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
        var allRole = RolesModel_1.default.instance.getRolesList();
        for (var key in allRole) {
            if (allRole.hasOwnProperty(key)) {
                var item = allRole[key];
                var cfg = BattleFunc_1.default.instance.getCfgDatas("Role", key);
                if (cfg.kind == BattleConst_1.default.LIFE_JIDI)
                    continue;
                if (item.inLine) {
                    this.inLineCount += 1;
                    this.lineList.push(cfg);
                }
                this.roleList.push(cfg);
            }
        }
        this.roleList = this.sortRoleArr(this.roleList);
        this.lineList = this.sortRoleArr(this.lineList);
        var res = WindowManager_1.default.getUILoadGroup(WindowCfgs_1.WindowCfgs.RoleItemUI) || [];
        var resAll = [];
        for (var url of res) {
            resAll.push(url);
        }
        LoadManager_1.LoadManager.instance.load(resAll, Laya.Handler.create(this, this.initRoleBack));
        this.initLineList();
    }
    //下方角色
    initRoleBack() {
        for (var i = 0; i < this.roleList.length; i++) {
            var item = this.roleList[i];
            var roleItem = new RoleItemUI_1.default(item, this);
            this.rolePanel.addChild(roleItem);
            roleItem.x = i % 3 * roleItem.itemWidth;
            roleItem.y = Math.floor(i / 3) * roleItem.itemHeight;
            this.roleItemArr[item.id] = { id: item.id, item: roleItem };
        }
    }
    //按序列排序
    sortRoleArr(arr) {
        return arr.sort((a, b) => {
            return parseInt(a.mainShowOrder) - parseInt(b.mainShowOrder);
        });
    }
    //上方布阵
    initLineList() {
        var res = WindowManager_1.default.getUILoadGroup(WindowCfgs_1.WindowCfgs.RoleLineItemUI) || [];
        var resAll = [];
        for (var url of res) {
            resAll.push(url);
        }
        LoadManager_1.LoadManager.instance.load(resAll, Laya.Handler.create(this, this.initLineBack));
    }
    initLineBack() {
        var unlock = GlobalParamsFunc_1.default.instance.getDataArray("squadUnlock");
        for (var i = 0; i < 6; i++) {
            var item = null;
            if (this.lineList[i]) {
                item = this.lineList[i];
            }
            var info = unlock[i].split(",");
            var roleItem = new RoleLineItemUI_1.default(item, this, info[1]);
            this.lineGroup.addChild(roleItem);
            roleItem.x = i % 3 * roleItem.itemWidth;
            roleItem.y = Math.floor(i / 3) * roleItem.itemHeight;
        }
        this.timeCode = TimerManager_1.default.instance.add(this.freshSpeak, this, GlobalParamsFunc_1.default.instance.getDataNum("arraySpeakInterval"));
        this.freshSpeak();
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
                if (this.lineList.length <= 1)
                    return;
                delete this.curData[id].inLine;
                this.inLineCount -= 1;
            }
            else {
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
                        var cfg = BattleFunc_1.default.instance.getCfgDatas("Role", key);
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
    isCanLine() {
        if (this.inLineCount < this.unlockCount) {
            return true;
        }
        return false;
    }
    //刷新上面的信息
    freshLineInfo() {
        for (var i = 5; i >= 0; i--) {
            var item = null;
            if (this.lineList[i]) {
                item = this.lineList[i];
            }
            var roleItem = this.lineGroup.getChildAt(i);
            roleItem.freshLineState(item);
        }
    }
    freshSpeak() {
        if (this.lineGroup.numChildren > 0) {
            this.leftSpeak.visible = false;
            this.rightSpeak.visible = false;
            for (var i = 0; i < this.lineGroup.numChildren - 1; i++) {
                var cur = this.lineGroup.getChildAt(i);
                cur.insSpeak = false;
            }
            var randomIndex = GameUtils_1.default.getRandomInt(0, this.lineList.length - 1);
            var item = this.lineGroup.getChildAt(randomIndex);
            if (item) {
                item.freshSpeak(randomIndex, this.leftSpeak, this.rightSpeak, this.leftTxt, this.rightTxt);
            }
        }
    }
    showGuide_302() {
        if (UserModel_1.default.instance.getMainGuide() <= 4 && GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_3_301) {
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_3_302, GuideManager_1.default.GuideType.None);
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_3_302, this.showGuide_302_finish, this, this.showGuide_302_finish);
            this.isShowGuide = true;
        }
        else {
            AdVideoManager_1.default.instance.showInterstitialAdById(PlaqueConst_1.default.Plaque_RoleInline, this);
        }
    }
    showGuide_302_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_3_302, () => {
            WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
        }, this, true);
    }
    close() {
        TimerManager_1.default.instance.remove(this.timeCode);
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.RoleInLineUI);
        RolesServer_1.default.upDataRoleInfo(this.curData, () => {
            Message_1.default.instance.send(RoleEvent_1.default.ROLE_EVENT_GAMEMAIN_ROLE_INLINE);
            Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_REDPOINT, RedPointConst_1.default.POINT_MAIN_TASKRED);
        }, this);
        Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_REDPOINT, RedPointConst_1.default.POINT_MAIN_LINERED);
        if (this.isShowGuide) {
            Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_FRESH_GUIDE, GuideConst_1.default.GUIDE_10003);
        }
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = RoleInLineUI;
//# sourceMappingURL=RoleInLineUI.js.map