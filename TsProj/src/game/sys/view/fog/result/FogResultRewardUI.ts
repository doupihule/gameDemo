
import { ButtonUtils } from "../../../../../framework/utils/ButtonUtils";
import IMessage from "../../../interfaces/IMessage";
import BannerAdManager from "../../../../../framework/manager/BannerAdManager";
import WindowManager from "../../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../../consts/WindowCfgs";
import TimerManager from "../../../../../framework/manager/TimerManager";
import FogModel from "../../../model/FogModel";
import { LoadManager } from "../../../../../framework/manager/LoadManager";
import LogsManager from "../../../../../framework/manager/LogsManager";
import FogRewardItemUI from "./FogRewardItemUI";
import { ui } from "../../../../../ui/layaMaxUI";
import TweenAniManager from "../../../manager/TweenAniManager";
import ShareOrTvManager from "../../../../../framework/manager/ShareOrTvManager";
import UserInfo from "../../../../../framework/common/UserInfo";



export default class FogResultRewardUI extends ui.gameui.fog.FogResultRewardUI implements IMessage {

    private clickCount;//点击次数
    private rewardArr;//局外奖励
    private rewardTimerCode = 0;
    private thisObj;

    constructor() {
        super();
        this.bgImg.on(Laya.Event.MOUSE_DOWN, this, this.onClickContinue);
    }

    public setData(data) {
        BannerAdManager.addBannerQuick(this);
        this.clickCount = 1;
        this.rewardTimerCode = 0;
        this.continueBtn.visible = false;
        this.thisObj = data && data.thisObj;

        // 头条停止录屏
        if (ShareOrTvManager.instance.canShareVideo()) {
            UserInfo.platform.recordStop();
        }

        this.initRewardPanel();
        this.rewardPanel.vScrollBarSkin = "";

        TimerManager.instance.setTimeout(() => {
            this.continueBtn.visible = true;
        }, this, 500);
    }

    initRewardPanel() {
        this.rewardPanel.removeChildren();
        //获取局外奖励
        this.rewardArr = FogModel.instance.getFogOuterReward();
       
        for (var i = 0; i < Math.ceil(this.rewardArr.length / 3); i++) {
            var itemGroup = new Laya.Image();
            itemGroup.width = 438;
            itemGroup.height = 154;
            //  itemGroup.x = 0;
            itemGroup.x = 550;//显示在屏幕外
            itemGroup.y = i * (itemGroup.height + 3) + 2;
            this.rewardPanel.addChild(itemGroup);
            itemGroup.name = "itemGroup" + i;
            this.initRewardItem(itemGroup, i);
        }

    }

    initRewardItem(itemGroup, index) {
        var res = WindowManager.getUILoadGroup(WindowCfgs.FogRewardItemUI) || [];
        var resAll = [];
        for (var url of res) {
            resAll.push(url);
        }
        LoadManager.instance.load(resAll, Laya.Handler.create(this, this.iniRewardPanelData, [itemGroup, index]));
    }
    iniRewardPanelData(group, index) {
        group.removeChildren();
        var count = 0;
        for (var i = index * 3; i < Math.min(i + 3, i + this.rewardArr.length - i); i++) {
            var item = this.rewardArr[i];
            var rewardItem: FogRewardItemUI = new FogRewardItemUI(item);
            group.addChild(rewardItem);
            rewardItem.x = count * (rewardItem.itemWidth + 36);
            count++;
        }

        if (index == Math.ceil(this.rewardArr.length / 3) - 1) {
            this.addTimer(index);
        }
    }
    //添加定时器
    addTimer(count) {
        for (var index = count; index >= 0; index--) {
            TimerManager.instance.setTimeout((data) => {
                var item = this.rewardPanel.getChildAt(data[0]) as Laya.Image;
                //判断是否需要滑屏
                var num = Math.ceil(Number(item.y) / Number(this.rewardPanel.height));
                if(item.x != 0){
                    this.rewardPanel.vScrollBar.setScroll(0, num * this.rewardPanel.height, (num - 1) * this.rewardPanel.height - 10);
                }
                TweenAniManager.instance.horizontalAni(item, 0, () => {
                    //判断是否是最后一个动画完成
                    if(data[0] == count){
                        this.clickCount = 2;
                    }
                }, this, 500);
            }, this, (count - index) * 500, [count - index]);
        }
    }
    onClickContinue() {
        //第一次点击，跳过奖励动画
        if (this.clickCount == 1) {
            this.clickCount++;
            //全部直接显示
            this.removeRewardTimer();
        }
        //第二次点击，进入下一步奖励结算
        else if (this.clickCount == 2) {
            WindowManager.CloseUI(WindowCfgs.FogResultRewardUI);
            WindowManager.OpenUI(WindowCfgs.FogResultUI, {thisObj: this.thisObj});
        }
    }
    removeRewardTimer(){
        for (var i = 0; i < Math.ceil(this.rewardArr.length / 3); i++) {
            var item = this.rewardPanel.getChildAt(i) as Laya.Image;
            //去掉动画
            Laya.Tween.clearAll(item);
            
            //全部显示出来
            item.x = 0;
        } 

    }
    close() {
        WindowManager.CloseUI(WindowCfgs.FogResultRewardUI);
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}