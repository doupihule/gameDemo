import { ui } from "../../../../../ui/layaMaxUI";
import IMessage from "../../../interfaces/IMessage";
import WindowManager from "../../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../../consts/WindowCfgs";
import { ButtonUtils } from "../../../../../framework/utils/ButtonUtils";
import FogFunc from "../../../func/FogFunc";
import TranslateFunc from "../../../../../framework/func/TranslateFunc";
import LogsManager from "../../../../../framework/manager/LogsManager";
import { DataResourceType } from "../../../func/DataResourceFunc";
import PiecesModel from "../../../model/PiecesModel";
import UserModel from "../../../model/UserModel";
import UserExtModel from "../../../model/UserExtModel";
import FogModel from "../../../model/FogModel";
import BigNumUtils from "../../../../../framework/utils/BigNumUtils";
import FogServer from "../../../server/FogServer";
import PoolTools from "../../../../../framework/utils/PoolTools";
import PoolCode from "../../../consts/PoolCode";
import BattleFunc from "../../../func/BattleFunc";
import BattleRoleView from "../../../../battle/view/BattleRoleView";
import StringUtils from "../../../../../framework/utils/StringUtils";
import BannerAdManager from "../../../../../framework/manager/BannerAdManager";
import FogEventData from "../../../../fog/data/FogEventData";
import FogInstanceCell from "../../../../fog/instance/FogInstanceCell";




export default class FogHandinUI extends ui.gameui.fog.FogHandinUI implements IMessage {

    private eventId;//事件id
    private eventInfo;//事件cfg
    private isAllown = true;//是否全部拥有

    //格子事件
    private events: FogEventData
    //格子
    private cell: FogInstanceCell;

    private callBack;
    private thisObj;
    private roleAnim: BattleRoleView;

    private isFinish = false;//是否完成事件

    constructor() {
        super();
        new ButtonUtils(this.closeBtn, this.close, this);
        new ButtonUtils(this.handBtn, this.onClickHand, this);

    }

    public setData(data) {
        this.isAllown = true;
        this.isFinish = false;
        
        this.callBack = data && data.callBack;
        this.thisObj = data && data.thisObj;

        this.events = data.event;
        this.cell = data.cell;
        this.eventId = this.events.eventId;
        this.eventInfo = this.events.cfgData;



        //标题
        this.titleLab.text = TranslateFunc.instance.getTranslate(this.eventInfo.name, "TranslateEvent");
        //描述
        this.descLab.text = TranslateFunc.instance.getTranslate(this.eventInfo.desc[0], "TranslateEvent");

        //显示spine
        this.showRoleSpine();

        //显示上交内容
        var list = this.eventInfo.params;//["8","2001","1"],["8","2002","1"]
        this.itemList.repeatX = list.length;
        this.itemList.array = list;
        this.itemList.renderHandler = new Laya.Handler(this, this.onListRender);
        this.itemList.scrollTo(0);

        if (list.length == 1) {
            this.itemList.x = 222;
            this.itemList.width = 116;
        } else if (list.length == 2) {
            this.itemList.x = 151;
            this.itemList.width = 258;
        } else if (list.length > 2) {
            this.itemList.x = 77;
            this.itemList.width = 405;
        }

        BannerAdManager.addBannerQuick(this);
    }
    onListRender(cell: Laya.Box, index: number) {
        var data = this.itemList.array[index];
        var itemLab = cell.getChildByName("item").getChildByName("itemLab") as Laya.Label;
        var itemIcon = cell.getChildByName("item").getChildByName("itemIcon") as Laya.Image;

        var result = FogFunc.instance.getResourceShowInfo(data);
        var userOwnNum = "0";
        var type = "number";
        switch (Number(data[0])) {
            //碎片
            case DataResourceType.PIECE:
                userOwnNum = PiecesModel.instance.getPieceCount(data[1]) + "";
                break;
            //金币
            case DataResourceType.COIN:
                userOwnNum = UserModel.instance.getCoin();
                type = "string";
                break;
            //钻石
            case DataResourceType.GOLD:
                userOwnNum = UserModel.instance.getGold();
                type = "string";
                break;
            //体力
            case DataResourceType.SP:
                userOwnNum = UserExtModel.instance.getNowSp() + "";
                break;
            //行动力
            case DataResourceType.ACT:
                userOwnNum = FogModel.instance.getActNum() + "";
                break;
            //零件
            case DataResourceType.COMP:
                userOwnNum = FogModel.instance.getCompNum() + "";
                break;
            //迷雾币
            case DataResourceType.FOGCOIN:
                userOwnNum = UserModel.instance.getFogCoinNum() + "";
                break;
            //迷雾街区道具
            case DataResourceType.FOGITEM:
                userOwnNum = FogModel.instance.getPropNum(data[1]) + "";
                break;
        }

        itemLab.text = StringUtils.getCoinStr(userOwnNum) + "/" + result["num"];
        if (type == "string") {
            if (BigNumUtils.compare(userOwnNum, result["num"])) {
                itemLab.color = "#000000";
            } else {
                itemLab.color = "#f60c08";
                this.isAllown = false;
            }
        } else {
            if (Number(userOwnNum) >= Number(result["num"])) {
                itemLab.color = "#000000";
            } else {
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
            var item = PoolTools.getItem(PoolCode.POOL_ROLE + spine[0]);
            var scaleRoleInfo = BattleFunc.defaultScale * Number(spine[2]) / 10000;
            if (!item) {
                this.roleAnim = new BattleRoleView(spine[0], scaleRoleInfo, 0,"FogHandingUI");
            } else {
                this.roleAnim = item;
                this.roleAnim.setItemViewScale(scaleRoleInfo);
            }
            this.roleSpine.addChild(this.roleAnim);
            this.roleAnim.play(spine[1], true);
        }
    }

    onClickHand() {
        if (!this.isAllown) {
            WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_hand_notenough_item"));
            return;
        }

        //行动力检测
        var userActNum = FogModel.instance.getActNum()
        if (userActNum < Number(this.events.mobilityCost)) {
            FogModel.instance.checkFreeAct();
            return;
        }

        //扣除道具
        var hand = [];
        for (var i = 0; i < this.eventInfo.params.length; i++) {
            hand.push(this.eventInfo.params[i]);
        }
        hand.push([DataResourceType.ACT, this.events.mobilityCost]);
        FogServer.handIn({ "hand": hand }, this.finishCallBack, this);
    }
    finishCallBack(){
        this.isFinish = true;
        this.close();
    }

    close() {
        WindowManager.CloseUI(WindowCfgs.FogHandinUI);
        if(this.isFinish){
            this.callBack && this.callBack.call(this.thisObj);
        }
        
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}