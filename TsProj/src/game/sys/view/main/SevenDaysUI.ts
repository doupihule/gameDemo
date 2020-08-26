import IMessage from "../../interfaces/IMessage";
import { ui } from "../../../../ui/layaMaxUI";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import StringUtils from "../../../../framework/utils/StringUtils";
import SevenDayFunc from "../../func/SevenDayFunc";
import SevenDayModel from "../../model/SevenDayModel";
import ResourceConst from "../../consts/ResourceConst";
import SevenDayServer from "../../server/SevenDayServer";
import Message from "../../../../framework/common/Message";
import GameMainEvent from "../../event/GameMainEvent";
import PoolTools from "../../../../framework/utils/PoolTools";
import PoolCode from "../../consts/PoolCode";
import BattleRoleView from "../../../battle/view/BattleRoleView";
import BattleFunc from "../../func/BattleFunc";
import RolesModel from "../../model/RolesModel";
import RedPointConst from "../../consts/RedPointConst";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import AdVideoManager from "../../../../framework/platform/AdVideoManager";
import PlaqueConst from "../../consts/PlaqueConst";
import FogFunc from "../../func/FogFunc";
import FogServer from "../../server/FogServer";

export default class SevenDaysUI extends ui.gameui.main.SevenDaysUI implements IMessage {

    private _sevenData;
    private _curReward;
    private roleAnim;
    private curWeek;
    private loginStep;


    constructor() {
        super();
        this.initBtn();
        this._sevenData = SevenDayFunc.instance.getSevenDatas();
    }

    initBtn() {
        new ButtonUtils(this.closeBtn, this.close, this);
    }
    showRoleAni(roleId) {
        if (this.roleAnim) {
            this.roleSpine.removeChild(this.roleAnim);
            PoolTools.cacheItem(PoolCode.POOL_ROLE + roleId, this.roleAnim);
        }
        var cacheItem: BattleRoleView = PoolTools.getItem(PoolCode.POOL_ROLE + roleId);
        if (!cacheItem) {
            var scaleRoleInfo = 1.4 * BattleFunc.defaultScale;
            var roleLevel = RolesModel.instance.getRoleLevelById(roleId);
            this.roleAnim = BattleFunc.instance.createRoleSpine(roleId, roleLevel, 2, scaleRoleInfo, true,false,"SevenDaysUI");
        } else {
            this.roleAnim = cacheItem;
        }

        this.roleSpine.addChild(this.roleAnim);
        this.roleAnim.play("idle", true);
    }
    setData(data) {
        BannerAdManager.addBannerQuick(this);
        AdVideoManager.instance.showInterstitialAdById(PlaqueConst.Plaque_SevenDays, this);
        this.curWeek = 0;
        this.loginStep = 1;

        this.showRoleAni("1011");

        var loginDay = SevenDayModel.instance.getLoginDay();
        //判断当前是第几周
        var loginStep = loginDay.loginStep || 1;
        var gainStep = loginDay.gainStep || 0;

        //判断当前是第几周
        this.curWeek = Math.ceil(loginStep / 7);
        this.loginStep = loginStep - (this.curWeek - 1) * 7;
        gainStep -= (this.curWeek - 1) * 7;
        if (this._sevenData) {
            for (var i = 0; i < Object.keys(this._sevenData).length; i++) {
                var curReward;
                switch (this.curWeek) {
                    case 1:
                        curReward = this._sevenData[i + 1].reward1;
                        break;
                    case 2:
                        curReward = this._sevenData[i + 1].reward2;
                        break;
                    default:
                        curReward = this._sevenData[i + 1].continuousReward;
                        break;
                }
                curReward = curReward[0].split(",");
                var info = FogFunc.instance.getResourceShowInfo(curReward)
                this["rewardImg" + i].skin = info.icon;
                this["rewardTxt" + i].text = StringUtils.getCoinStr(info.num);

                //  this["receiveBtn" + i].visible = false;
                this["hasReceiveGroup" + i].visible = false;
                this["receiveBtn" + i].touchEnabled = false;
                this["receiveBtn" + i].touchChildren = false;


                new ButtonUtils(this["receiveBtn" + i], this.onClickReceive, this, null, null, [curReward, i]);

                //已经领取过得
                if (this.loginStep > i + 1) {
                    this["hasReceiveGroup" + i].visible = true;
                    this["receiveBtn" + i].gray = true;
                    this["receiveBtnLab" + i].text = "已领取";
                } else if (this.loginStep == i + 1) {
                    //今天领过
                    if (this.loginStep == gainStep) {
                        this["hasReceiveGroup" + i].visible = true;
                        this["receiveBtn" + i].gray = true;
                        this["receiveBtnLab" + i].text = "已领取";
                    } else {
                        //今天没领
                        this["receiveBtn" + i].visible = true;
                        this["receiveBtn" + i].gray = false;
                        this["receiveBtnLab" + i].text = "领取";
                        this["receiveBtn" + i].touchEnabled = true;
                        this["receiveBtn" + i].touchChildren = true;
                    }
                } else {
                    this["receiveBtn" + i].visible = false;
                }
            }
        }
    }

    onClickReceive(data) {
        var reward = data[0];
        var index = data[1];
        if (this["receiveBtn" + index].gray) {
            return;
        }


        this._curReward = reward;
        SevenDayServer.getSevendayReward({ "reward": reward }, () => {
            this.refreshUI(index);
            //弹出再领一次的界面
            var freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_SEVENDAY, ShareOrTvManager.TYPE_SHARE);
            if (freeType != ShareOrTvManager.TYPE_QUICKRECEIVE) {
                var params = {
                    succCall: this.onSuccessCall.bind(this, index),
                    reward: reward,
                    params: { "curWeek": this.curWeek, "loginStep": this.loginStep },
                    shareName: ShareTvOrderFunc.SHARELINE_SEVENDAY
                };
                WindowManager.OpenUI(WindowCfgs.ComRewardDoubleUI, params);
            }
        }, this);
    }
    //领取奖励后刷新界面
    onSuccessCall(index) {
        FogServer.getReward({ reward: [this._curReward] }, () => {
            this.refreshUI(index);
        }, this);
    }
    refreshUI(index) {
        //刷新当前界面
        this.receiveCallBack(index);
        //刷新主界面七登红点
        Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_REDPOINT, RedPointConst.POINT_MAIN_SEVENDAY);
    }
    receiveCallBack(index) {
        this["hasReceiveGroup" + index].visible = true;
        this["receiveBtn" + index].gray = true;
        this["receiveBtnLab" + index].text = "已领取";
    }
    close() {
        WindowManager.CloseUI(WindowCfgs.SevenDaysUI);
        Message.instance.send(GameMainEvent.GAMEMIAN_EVENT_CHECKPOP);
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }

    }
}


