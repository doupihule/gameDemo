
import UserModel from "../../model/UserModel";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import IMessage from "../../interfaces/IMessage";
import BattleSceneManager from "../../manager/BattleSceneManager";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import StringUtils from "../../../../framework/utils/StringUtils";
import ButtonConst from "../../../../framework/consts/ButtonConst";
import LevelFunc from "../../func/LevelFunc";
import UserExtModel from "../../model/UserExtModel";
import Client from "../../../../framework/common/kakura/Client";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import DataResourceConst from "../../consts/DataResourceConst";
import ImageExpand from "../../../../framework/components/ImageExpand";
import UIBaseView from "../../../../framework/components/UIBaseView";
import ButtonExpand from "../../../../framework/components/ButtonExpand";
import ListExpand from "../../../../framework/components/ListExpand";
import LabelExpand from "../../../../framework/components/LabelExpand";
import BattleServer from "../../server/BattleServer";
import Table = WebAssembly.Table;
import TableUtils from "../../../../framework/utils/TableUtils";

;


export class StageSelectUI extends UIBaseView implements IMessage {

    page = 1;
    maxPage = 1;
    public  returnBtn:ButtonExpand;
    public  leftBtn:ButtonExpand;
    public  rightBtn:ButtonExpand;
    public  m_list:ListExpand;
    public  pointList:ListExpand;
    public  coinNum:LabelExpand;
    public  goldNum:LabelExpand;
    public  bg:ImageExpand;

    constructor() {
        super();

        new ButtonUtils(this.returnBtn, this.onReturnClick, this);
        var leftBtn = new ButtonUtils(this.leftBtn, this.onLeftBtnClick, this);
        var rightBtn = new ButtonUtils(this.rightBtn, this.onRightBtnClick, this);
        leftBtn.setBtnType(ButtonConst.BUTTON_TYPE_2);
        rightBtn.setBtnType(ButtonConst.BUTTON_TYPE_2);
        // new ButtonUtils(this.stageSelectBtn, this.onSelectStageClick, this);
    }

    onReturnClick() {

        WindowManager.SwitchUI(WindowCfgs.GameMainUI, WindowCfgs.StageSelectUI);
    }

    //设置数据
    setData(data: any) {

        this.refreshCoin();
        this.page = 1;

        var allInfo = LevelFunc.instance.getLevel();
        var info: Array<any> = allInfo.scenes[0].level;
        var levelNum = 0;
        for (var index in info) {
            levelNum++;
        }
        this.maxPage = Math.floor(levelNum / 20) + 1;
        this.refreshList();
    }

    refreshList() {
        var page = this.page;
        switch (page) {
            case 1:
                this.bg.setSkin( "native/main/main_ba_beijing.png");
                break;
            case 2:
                this.bg.setSkin( "native/main/main_ba_beijing.png");
                break;
        }
        if (page <= 0) {
            this.page = 1;
            return;
        }
        if (page > this.maxPage) {
            this.page = this.maxPage;
            return;
        }
        var list = [];
        var allInfo = LevelFunc.instance.getLevel();
        var info: Array<any> = allInfo.scenes[0].level;
        for (var key in info) {
            var index = Number(key.split("_")[1]);
            if (index > 20 * (page - 1) && index <= 20 * page)
                list.push(index);
        }
        list.sort(this.compare);
        this.m_list.repeatY = list.length;
        this.m_list.array = list;//FuncRoom.getInstance().getRooms();
        this.m_list.renderHandler = TableUtils.c_func(this, this.onListRender);

        var pointList = [];
        for (var index = 0; index < this.maxPage; index++) {
            pointList.push(index + 1);
        }
        this.pointList.repeatX = pointList.length;
        this.pointList.array = pointList;//FuncRoom.getInstance().getRooms();
        this.pointList.renderHandler = TableUtils.c_func( this,this.onPointListRender);
        this.pointList.set2dPos( 372 - this.pointList.width / 2,this.pointList.y);
    }

    public compare(a, b): any {
        return a - b;
    }

    private onPointListRender(cell: any, index: number): void {
        var data = this.pointList.array[index];

        var point = cell.getChildByName("point") as ImageExpand;
        if (data == this.page) {
            point.setSkin( "native/main/battle_image_fanye2.png");
        }
        else {
            point.setSkin( "native/main/battle_image_fanye1.png");
        }
    }

    private onListRender(cell: any, index: number): void {
        var id = this.m_list.array[index];

        var box = cell.getChildByName("box") as ImageExpand;

        var levelId = box.getChildByName("levelId") as LabelExpand;
        levelId.text = "" + (id);

        var star1 = box.getChildByName("star1") as ImageExpand;
        var star2 = box.getChildByName("star2") as ImageExpand;
        var star3 = box.getChildByName("star3") as ImageExpand;

        var rank = UserModel.instance.getstageRank(id);

        star1.setSkin( "native/main/common_image_xing2.png");
        star2.setSkin( "native/main/common_image_xing2.png");
        star3.setSkin(  "native/main/common_image_xing2.png");
        if (rank >= 1) {
            star1.setSkin(  "native/main/common_image_xing1.png");
            if (rank >= 2) {
                star2.setSkin(  "native/main/common_image_xing1.png");
                if (rank >= 3) {
                    star3.setSkin(  "native/main/common_image_xing1.png");
                }
            }
        }

        if (cell["button"] && cell["button"]._button) {
            cell["button"].destoryButtonUtil();
        }

        if (Number(id) > Number(UserModel.instance.getMaxBattleLevel()) + 1) {
            cell.gray = true;
        }
        else {
            cell.gray = false;
            cell["button"] = new ButtonUtils(box, this.onSelectEnterStage, this, null, null, { id: Number(id) });
        }
    }
    public onSelectEnterStage(param) {

        //判断体力是否足够
        var nowPower = UserExtModel.instance.getLastFreshPower() + Math.floor((Client.instance.serverTime - UserExtModel.instance.getLastPowerFreshTime()) / GlobalParamsFunc.instance.getDataNum('spRestoreTime'));
        var maxSp = GlobalParamsFunc.instance.getDataNum('maxSp');
        if (UserExtModel.instance.getLastFreshPower() > maxSp) {
            //如果服务器告诉的体力大于最大的  则体力等于服务器给的
            nowPower = UserExtModel.instance.getLastFreshPower();
        } else if (nowPower > maxSp) {
            nowPower = maxSp;
        }
        if (nowPower < GlobalParamsFunc.instance.getDataNum('levelSpCost')) {
            var freeSpType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_FREE_SP);
            //没有视频或者分享，加体力按钮隐藏
            if (freeSpType != ShareOrTvManager.TYPE_QUICKRECEIVE) {
                WindowManager.OpenUI(WindowCfgs.FreePowerUI, { type: DataResourceConst.SP });
            }
            else {
                WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_power_01"));
            }
            return;
        }
        BattleServer.battleStart(null, this);
        BattleSceneManager.instance.enterBattle({ levelId: param.id });
    }
    public refreshCoin() {
        this.coinNum.text = StringUtils.getCoinStr(UserModel.instance.getDisplayCoin());
        this.goldNum.text = StringUtils.getCoinStr(UserModel.instance.getGold());
    }

    onLeftBtnClick() {
        this.page--;
        this.refreshList();
    }

    onRightBtnClick() {
        this.page++;
        this.refreshList();
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {
            // case BattleEvent.BATTLEEVENT_BATTLESTART:
            //     this.onBattleStart();
            //     break;
            // case BattleEvent.BATTLEEVENT_BATTLEEXIT:
            //     this.onBattleExit();
            //     break;
            // // case BattleEvent.BATTLEEVENT_SPEEDCHANGE:
            // //     this.refreshSpeed();
            // //     break;
            // case GuideEvent.GUIDEEVENT_OVERTAKEGUIDE:
            //     this.overtakeGuide(data);
            //     break;
        }
    }

}