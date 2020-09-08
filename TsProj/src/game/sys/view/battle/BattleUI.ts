
import UserModel from "../../model/UserModel";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import IMessage from "../../interfaces/IMessage";
import BattleLogicalControler from "../../../battle/controler/BattleLogicalControler";
import BattleSceneManager from "../../manager/BattleSceneManager";
import Message from "../../../../framework/common/Message";
import BattleEvent from "../../event/BattleEvent";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";
import SoundManager from "../../../../framework/manager/SoundManager";
import StatisticsManager from "../../manager/StatisticsManager";
import GuideManager from "../../manager/GuideManager";
import GuideEvent from "../../event/GuideEvent";
import TimerManager from "../../../../framework/manager/TimerManager";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import ButtonExpand from "../../../../framework/components/ButtonExpand";
import LabelExpand from "../../../../framework/components/LabelExpand";
import BaseContainer from "../../../../framework/components/BaseContainer";
import UIBaseView from "../../../../framework/components/UIBaseView";
import ListExpand from "../../../../framework/components/ListExpand";
import ImageExpand from "../../../../framework/components/ImageExpand";
import TableUtils from "../../../../framework/utils/TableUtils";
import TouchManager from "../../../../framework/manager/TouchManager";


export class BattleUI extends UIBaseView implements IMessage {


    /**头条录制状态 */
    private ttCameraStatus: string;
    public controller: BattleLogicalControler;
    //进度条的最大宽度
    private _currentStar: number = -1;
    private _battleData: any;

    public  leftBtn:ButtonExpand;
    public  levelTxt:LabelExpand;
    public  rightBtn:ButtonExpand;
    public  skipBtn:ButtonExpand;
    public  skipBtn2:ButtonExpand;
    public  restartBtn:ButtonExpand;
    public  restartBtn2:ButtonExpand;
    public  returnBtn:ButtonExpand;
    public  skip_skipBtn:ButtonExpand;
    public  skip_closeBtn:ButtonExpand;
    public  topGroup:BaseContainer;

    public  m_list:ListExpand;

    public battleBtn:BaseContainer;
    public  losePanel:BaseContainer;
    public  skipPanel:BaseContainer;
    public  battleCtn:BaseContainer;

    public  bg:BaseContainer;






    public gameStart;//起步结束

    constructor() {
        super();
        Message.instance.add(BattleEvent.BATTLEEVENT_BATTLESTART, this);
        Message.instance.add(BattleEvent.BATTLEEVENT_BATTLEEXIT, this);
        Message.instance.add(GuideEvent.GUIDEEVENT_OVERTAKEGUIDE, this);

        TouchManager.addTouchDown(this.battleCtn,this.onMouseDown,this);
        TouchManager.addTouchMove(this.battleCtn,this.onMouseMove,this);
        TouchManager.addTouchUp(this.battleCtn,this.onMouseEnd,this);
        TouchManager.addTouchOut(this.battleCtn,this.onMouseEnd,this);

        new ButtonUtils(this.leftBtn, this.onLeftBtn, this)
        new ButtonUtils(this.levelTxt, this.onReplayGame, this)
        new ButtonUtils(this.rightBtn, this.onRightBtn, this)

        new ButtonUtils(this.skipBtn, this.onSkipBtnClick, this);
        new ButtonUtils(this.skipBtn2, this.onSkipBtnClick, this);
        new ButtonUtils(this.restartBtn, this.onReplayGame, this);
        new ButtonUtils(this.restartBtn2, this.onReplayGame, this);
        new ButtonUtils(this.returnBtn, this.onClickMainBtn, this);

        new ButtonUtils(this.skip_skipBtn, this.onSkipSkipBtnClick, this);
        new ButtonUtils(this.skip_closeBtn, this.onSkipCloseBtnClick, this);

        ScreenAdapterTools.alignNotch(this.topGroup, ScreenAdapterTools.Align_MiddleTop);

    }

    onLeftBtn() {
        if (this.controller.battleData.levelId > 1) {
            this.controller.battleData.levelId = this.controller.battleData.levelId - 1;
            this.onReplayGame();
        }
    }

    onRightBtn() {
        this.controller.battleData.levelId = this.controller.battleData.levelId + 1;
        this.onReplayGame();
    }

    //停止声音
    private stopSound() {
    }


    //重玩关卡
    //继续比赛
    public onReplayGame() {
        if (UserModel.instance.getMainGuide() == 0) return;
        // if (this.controller.battleInfo.indexOf(this.controller.battleData.levelId) == -1) {
        //     BattleSceneManager.instance.replayBattle();
        //     this.controller.battleInfo.push(this.controller.battleData.levelId);
        // }
        if (this.controller && !this.controller.battleEnd) {
            BattleSceneManager.instance.replayBattle();
            this.resetStatus();
        }
        //初始化设置暂停界面不可见

        // this.initUI();
        // this.setData(this._battleData)
    }

    //重置状态
    public resetStatus() {
        this.gameStart = false;
    }

    public refreshBullet(isInit?) {
        var num = this.controller.bulletNum;
        var list = [];
        for (var index = 0; index < this.controller.bulletNum; index++) {
            list.push(index);
        }
        this.m_list.repeatX = list.length;
        this.m_list.array = list;//FuncRoom.getInstance().getRooms();
        this.m_list.renderHandler = TableUtils.c_func(this, this.onListRender);
        if (isInit) {
            this.m_list.set2dPos( 320 - this.m_list.width / 2,this.m_list.y);
        }
    }

    private onListRender(cell: any, index: number): void {
        if (index < this.controller.bulletNum) {
            cell.visible = true;
        }
        else {
            cell.visible = false;
        }
        var img = cell.getChildByName("bulletImg") as ImageExpand;
        if (index < this.controller.basicBulletNum) {
            img.setSkin("native/main/battle_image_zidan.png" );
        }
        else {
            img.setSkin( "native/main/battle_image_zidanjin.png");
        }
    }

    public lose() {
        this.battleBtn.visible = false;
        this.losePanel.visible = true;
        if (this.controller) this.controller.battleEnd = false;
    }

    //点击回主界面
    private onClickMainBtn() {
        if (UserModel.instance.getMainGuide() == 0) return;
        WindowManager.OpenUI(WindowCfgs.GameMainUI);
        BattleSceneManager.instance.exitBattle();
    }

    showItem(cd) {
    }

    //设置数据
    setData(data: any) {
        this._battleData = data;
        //进入主界面后测试直接进入战斗 
        BattleSceneManager.instance.startLoadBattleRes(data);

        //初始化设置暂停界面不可见
        // if (Number(data.level) == 1) {
        //     WindowManager.OpenUI(WindowCfgs.GameGuideUI);
        // }

        // this.label_jiasu.visible =false;
    }


    /**
     * 设置战斗界面进度条进度
     * @param progress 进度值，0-1
     */
    refreshProgress(progress) {
        if (this.gameStart && this.controller) {
            // this.progressImg.scaleX = progress;
        }
    }

    private onMouseDown(e) {

        if (!this.controller || !this.controller.player) {
            return;
        }
        if (!this.gameStart) {
            // this.guideGroup.visible = false;
            this.gameStart = true;
        }
        // if (UserModel.instance.getMainGuide() == 0) {
        //     var guideId = GuideManager.ins.nowGuideId;
        //     if (guideId == 1) {
        //         GuideManager.ins.setGuideData(2, GuideManager.GuideType.Static, this, this, null, null, null, null, { pos1: new Laya.Point(150, 750), pos2: new Laya.Point(320, 750) });
        //         GuideManager.ins.openGuideUI(2);
        //         GuideManager.ins.setGuideTipVisible(1, true);
        //     }
        // }
        this.controller.player.onToucheDown(e.stageX, e.stageY);
    }
    private onMouseMove(e) {
        if (!this.controller || !this.controller.player) {
            return
        }

        this.controller.player.onTouchMove(e.stageX, e.stageY);
    }
    private onMouseEnd(e) {
        if (!this.controller || !this.controller.player) {
            return
        }
        this.controller.player.onTouchEnd(e.stageX, e.stageY);
        // if (GuideManager.ins.nowGuideId == 2) {
        //
        //     GuideManager.ins.setGuideTipVisible(1, false);
        //     GuideManager.ins.setGuideData(3, GuideManager.GuideType.None);
        //     GuideManager.ins.openGuideUI(3);
        //     TimerManager.instance.setTimeout(() => {
        //         if (GuideManager.ins.nowGuideId == 3) {
        //             this.controller.bulletNum++;
        //             this.refreshBullet();
        //             GuideManager.ins.setGuideData(1, GuideManager.GuideType.None, this.battleCtn, this, 200, 200, 100, 650);
        //             GuideManager.ins.openGuideUI(1);
        //         }
        //     }, this, GlobalParamsFunc.instance.getDataNum("guideAgainTime"));
        // }
    }

    //战斗开始
    private onBattleStart() {
        this.controller = BattleSceneManager.instance.battleControler;
        this.initUI();
        // this.controller.registObjUpdate(this.refreshUI, this);
        this.refreshBullet(true);
        this.battleBtn.visible = true;
        this.losePanel.visible = false;
        this.skipPanel.visible = false;

        this.levelTxt.text = "关卡" + this.controller.battleData.levelId;

        var guideStep = UserModel.instance.getMainGuide();
        if (guideStep == 0 && this._battleData.levelId == 1) {
            GuideManager.ins.setGuideData(1, GuideManager.GuideType.None, this.battleCtn, this, 200, 200, 100, 650);
            GuideManager.ins.openGuideUI(1);
            this.skipBtn.visible = false;
            this.skipBtn2.visible = false;
        }
        else {
            if (guideStep == 0) {
                GuideManager.ins.guideFin(3, () => {
                }, this, true);
            }
            this.skipBtn.visible = false;
            this.skipBtn2.visible = false;
        }
    }

    private onSkipBtnClick() {
        this.skipPanel.visible = true;
    }

    private onSkipSkipBtnClick() {
        ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_SKIPBATTLE, ShareOrTvManager.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.successCall, this.onSkipCloseBtnClick, this);
    }

    private successCall() {
        WindowManager.OpenUI(WindowCfgs.BattleResultUI, { levelId: this._battleData.levelId, rank: 1 })
        this.onSkipCloseBtnClick();
    }

    private onSkipCloseBtnClick() {
        this.skipPanel.visible = false;
    }


    private initUI() {
        this.bg.visible = true;
        this.gameStart = false;

        this.guideTween();
    }

    private guideTween() {
        // if (this.guideGroup.visible) {
        //     TweenAniManager.instance.horizontalAni(this.guideFinger, this.guideBar.width, () => {
        //         TweenAniManager.instance.horizontalAni(this.guideFinger, 0, () => {
        //             this.guideTween()
        //         }, this, 800);
        //     }, this, 800);
        // }
    }

    //退出战斗
    private onBattleExit() {
        this.gameStart = false;
        WindowManager.CloseUI(WindowCfgs.BattleUI)
    }


    recvMsg(cmd: string, data: any): void {
        switch (cmd) {
            case BattleEvent.BATTLEEVENT_BATTLESTART:
                this.onBattleStart();
                break;
            case BattleEvent.BATTLEEVENT_BATTLEEXIT:
                this.onBattleExit();
                break;
            // case BattleEvent.BATTLEEVENT_SPEEDCHANGE:
            //     this.refreshSpeed();
            //     break;
        }
    }

}