"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../../framework/utils/ButtonUtils");
const FogFunc_1 = require("../../../func/FogFunc");
const TranslateFunc_1 = require("../../../../../framework/func/TranslateFunc");
const DataResourceFunc_1 = require("../../../func/DataResourceFunc");
const PiecesModel_1 = require("../../../model/PiecesModel");
const UserModel_1 = require("../../../model/UserModel");
const UserExtModel_1 = require("../../../model/UserExtModel");
const FogModel_1 = require("../../../model/FogModel");
const BigNumUtils_1 = require("../../../../../framework/utils/BigNumUtils");
const FogServer_1 = require("../../../server/FogServer");
const PoolTools_1 = require("../../../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../../consts/PoolCode");
const BattleFunc_1 = require("../../../func/BattleFunc");
const BattleRoleView_1 = require("../../../../battle/view/BattleRoleView");
const StringUtils_1 = require("../../../../../framework/utils/StringUtils");
const BannerAdManager_1 = require("../../../../../framework/manager/BannerAdManager");
class FogHandinUI extends layaMaxUI_1.ui.gameui.fog.FogHandinUI {
    constructor() {
        super();
        this.isAllown = true; //是否全部拥有
        this.isFinish = false; //是否完成事件
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.close, this);
        new ButtonUtils_1.ButtonUtils(this.handBtn, this.onClickHand, this);
    }
    setData(data) {
        this.isAllown = true;
        this.isFinish = false;
        this.callBack = data && data.callBack;
        this.thisObj = data && data.thisObj;
        this.events = data.event;
        this.cell = data.cell;
        this.eventId = this.events.eventId;
        this.eventInfo = this.events.cfgData;
        //标题
        this.titleLab.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.name, "TranslateEvent");
        //描述
        this.descLab.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.desc[0], "TranslateEvent");
        //显示spine
        this.showRoleSpine();
        //显示上交内容
        var list = this.eventInfo.params; //["8","2001","1"],["8","2002","1"]
        this.itemList.repeatX = list.length;
        this.itemList.array = list;
        this.itemList.renderHandler = new Laya.Handler(this, this.onListRender);
        this.itemList.scrollTo(0);
        if (list.length == 1) {
            this.itemList.x = 222;
            this.itemList.width = 116;
        }
        else if (list.length == 2) {
            this.itemList.x = 151;
            this.itemList.width = 258;
        }
        else if (list.length > 2) {
            this.itemList.x = 77;
            this.itemList.width = 405;
        }
        BannerAdManager_1.default.addBannerQuick(this);
    }
    onListRender(cell, index) {
        var data = this.itemList.array[index];
        var itemLab = cell.getChildByName("item").getChildByName("itemLab");
        var itemIcon = cell.getChildByName("item").getChildByName("itemIcon");
        var result = FogFunc_1.default.instance.getResourceShowInfo(data);
        var userOwnNum = "0";
        var type = "number";
        switch (Number(data[0])) {
            //碎片
            case DataResourceFunc_1.DataResourceType.PIECE:
                userOwnNum = PiecesModel_1.default.instance.getPieceCount(data[1]) + "";
                break;
            //金币
            case DataResourceFunc_1.DataResourceType.COIN:
                userOwnNum = UserModel_1.default.instance.getCoin();
                type = "string";
                break;
            //钻石
            case DataResourceFunc_1.DataResourceType.GOLD:
                userOwnNum = UserModel_1.default.instance.getGold();
                type = "string";
                break;
            //体力
            case DataResourceFunc_1.DataResourceType.SP:
                userOwnNum = UserExtModel_1.default.instance.getNowSp() + "";
                break;
            //行动力
            case DataResourceFunc_1.DataResourceType.ACT:
                userOwnNum = FogModel_1.default.instance.getActNum() + "";
                break;
            //零件
            case DataResourceFunc_1.DataResourceType.COMP:
                userOwnNum = FogModel_1.default.instance.getCompNum() + "";
                break;
            //迷雾币
            case DataResourceFunc_1.DataResourceType.FOGCOIN:
                userOwnNum = UserModel_1.default.instance.getFogCoinNum() + "";
                break;
            //迷雾街区道具
            case DataResourceFunc_1.DataResourceType.FOGITEM:
                userOwnNum = FogModel_1.default.instance.getPropNum(data[1]) + "";
                break;
        }
        itemLab.text = StringUtils_1.default.getCoinStr(userOwnNum) + "/" + result["num"];
        if (type == "string") {
            if (BigNumUtils_1.default.compare(userOwnNum, result["num"])) {
                itemLab.color = "#000000";
            }
            else {
                itemLab.color = "#f60c08";
                this.isAllown = false;
            }
        }
        else {
            if (Number(userOwnNum) >= Number(result["num"])) {
                itemLab.color = "#000000";
            }
            else {
                itemLab.color = "#f60c08";
                this.isAllown = false;
            }
        }
        itemIcon.skin = result["icon"];
        itemIcon.scale(result["scale"], result["scale"]);
    }
    showRoleSpine() {
        if (this.roleAnim) {
            this.roleSpine.removeChild(this.roleAnim);
        }
        if (this.eventInfo.uiSpine) {
            var spine = this.eventInfo.uiSpine;
            var item = PoolTools_1.default.getItem(PoolCode_1.default.POOL_ROLE + spine[0]);
            var scaleRoleInfo = BattleFunc_1.default.defaultScale * Number(spine[2]) / 10000;
            if (!item) {
                this.roleAnim = new BattleRoleView_1.default(spine[0], scaleRoleInfo, 0, "FogHandingUI");
            }
            else {
                this.roleAnim = item;
                this.roleAnim.setItemViewScale(scaleRoleInfo);
            }
            this.roleSpine.addChild(this.roleAnim);
            this.roleAnim.play(spine[1], true);
        }
    }
    onClickHand() {
        if (!this.isAllown) {
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_hand_notenough_item"));
            return;
        }
        //行动力检测
        var userActNum = FogModel_1.default.instance.getActNum();
        if (userActNum < Number(this.events.mobilityCost)) {
            FogModel_1.default.instance.checkFreeAct();
            return;
        }
        //扣除道具
        var hand = [];
        for (var i = 0; i < this.eventInfo.params.length; i++) {
            hand.push(this.eventInfo.params[i]);
        }
        hand.push([DataResourceFunc_1.DataResourceType.ACT, this.events.mobilityCost]);
        FogServer_1.default.handIn({ "hand": hand }, this.finishCallBack, this);
    }
    finishCallBack() {
        this.isFinish = true;
        this.close();
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogHandinUI);
        if (this.isFinish) {
            this.callBack && this.callBack.call(this.thisObj);
        }
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogHandinUI;
//# sourceMappingURL=FogHandinUI.js.map