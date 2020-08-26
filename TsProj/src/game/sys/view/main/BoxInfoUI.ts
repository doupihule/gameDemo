import { ui } from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import Message from "../../../../framework/common/Message";
import StatisticsManager from "../../manager/StatisticsManager";
import TimerManager from "../../../../framework/manager/TimerManager";
import SubPackageManager from "../../../../framework/manager/SubPackageManager";
import SubPackageConst from "../../consts/SubPackageConst";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import GameMainEvent from "../../event/GameMainEvent";
import SoundManager from "../../../../framework/manager/SoundManager";
import { MusicConst } from "../../consts/MusicConst";
import { WindowCfgs } from "../../consts/WindowCfgs";
import WindowManager from "../../../../framework/manager/WindowManager";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import UserExtServer from "../../server/UserExtServer";
import BigNumUtils from "../../../../framework/utils/BigNumUtils";
import StringUtils from "../../../../framework/utils/StringUtils";
import UserExtModel from "../../model/UserExtModel";
import { DataResourceType } from "../../func/DataResourceFunc";
import ResourceConst from "../../consts/ResourceConst";
import DataResourceServer from "../../server/DataResourceServer";
import LogsManager from "../../../../framework/manager/LogsManager";

export default class BoxInfoUI extends ui.gameui.main.BoxInfoUI implements IMessage {

    private callBack;
    private thisObj;
    private item;
    private isCanReceive;

    constructor() {
        super();
        this.addEvent();

        new ButtonUtils(this.closeBtn, this.onClickCLose, this);
        new ButtonUtils(this.receiveBtn, this.onClickReceive, this);
    }
    /**添加事件监听 */
    addEvent() {
    }

    public setData(data): void {
        this.callBack = data.callBack;
        this.thisObj = data.thisObj;
        this.item = data.item;
        this.isCanReceive = data.isCanReceive;

        //领取按钮状态
        if (this.isCanReceive) {
            this.receiveBtn.gray = false;
        } else {
            this.receiveBtn.gray = true;

        }
        //界面初始化
        this.initView();
    }

    initView() {
        var reward = this.item.reward[0].split(",");
        this.rewardImg.skin = ResourceConst.AIDDROP_DETAIL_ARR[Number(reward[0])];
        this.rewardCount.changeText(StringUtils.getCoinStr(reward[1]));
        this.desTxt.changeText("转动转盘累计" + this.item.count + "次可领取");
    }

    //linguistic宝箱奖励
    onClickReceive() {
        if (this.isCanReceive) {
            var rewardInfo = this.item.reward[0].split(",");
            DataResourceServer.getBoxReward({ "reward": this.item.reward, "index": this.item.index }, () => {
                this.callBack && this.callBack.call(this.thisObj);
                var rewardInfo = this.item.reward[0].split(",");
                if (Number(rewardInfo[0]) == GlobalParamsFunc.coin) {
                    WindowManager.ShowTip("获得金币 x" + rewardInfo[1])
                } 
                if (Number(rewardInfo[0]) == GlobalParamsFunc.gold) {
                    WindowManager.ShowTip("获得钻石 x" + rewardInfo[1])
                } 
                WindowManager.CloseUI(WindowCfgs.BoxInfoUI);
            }, this);
        }
    }
    onClickCLose() {
        this.callBack && this.callBack.call(this.thisObj);
        WindowManager.CloseUI(WindowCfgs.BoxInfoUI);
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}


