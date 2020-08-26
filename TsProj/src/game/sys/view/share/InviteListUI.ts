import { ui } from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import UserGlobalModel from "../../../../framework/model/UserGlobalModel";
import WindowManager from "../../../../framework/manager/WindowManager";
import StringUtils from "../../../../framework/utils/StringUtils";
import UserModel from "../../model/UserModel";
import DataResourceServer from "../../server/DataResourceServer";
import DataResourceFunc from "../../func/DataResourceFunc";
import ResourceConst from "../../consts/ResourceConst";
import Message from "../../../../framework/common/Message";
import GameMainEvent from "../../event/GameMainEvent";
import RedPointConst from "../../consts/RedPointConst";


export default class InviteListUI extends ui.gameui.share.InviteListUI implements IMessage {

    private shareData;
    //奖励数值
    private rewardNum: number;
    private rewardType;
    //已经初始化按钮了
    private _hasInitBtn: boolean = false;
    public itemHeight = 101;
    public itemOffsetY = 5;
    
    constructor(shareData) {
        super();
        this.shareData = shareData;
        this.initData();
    }
    initBtn() {
        if (this._hasInitBtn) return;
        this._hasInitBtn = true;
        new ButtonUtils(this.reward_btn, this.getReward, this);
    }
    //初始化
    initData() {
        this.initBtn();
        this.list_num.text = this.shareData.num;
        var rewardArr = this.shareData.invitingReward[0].split(",");
        this.rewardType = Number(rewardArr[0]);
        this.rewardNum = Number(rewardArr[1]);

        this.rewardImg.skin = ResourceConst.AIDDROP_DETAIL_ARR[this.rewardType];
        this.reward_num.text = "X" + StringUtils.getCoinStr(rewardArr[1]);
        this.reward_description.text = "邀请" + this.shareData.count + "个新玩家";
      
        this.initBtnStatus();
        
    }
    initBtnStatus(){
        var shareNum = Object.keys(UserGlobalModel.instance.getInviteInfo()).length;
        var gainStatus = UserModel.instance.getInviteRewardStatus(this.shareData.id);
        //已领取
        if (gainStatus) {
            this.reward_no_recive.visible = false;
            this.reward_has_recive.visible = true;
            this.dikuang.skin = "uisource/video/video/video_image_yilingqudi.png";
        }
        //未领取
        else {
            this.reward_no_recive.visible = true;
            this.reward_has_recive.visible = false;
            this.reward_progress.text = Math.min(shareNum, this.shareData.count) + "/" + this.shareData.count;
            this.dikuang.skin = "uisource/video/video/video_image_zuanshidi.png";

            if(shareNum < this.shareData.count){
                this.reward_btn.gray = true;
            }else{
                this.reward_btn.gray = false;
            }
        }
    }
    getReward() {
        var shareNum = Object.keys(UserGlobalModel.instance.getInviteInfo()).length;
        if (shareNum < this.shareData.count) {
            WindowManager.ShowTip("人数不够哦！多邀请些小伙伴吧");
            return;
        }
        DataResourceServer.getInviteReward({"id": this.shareData.id, "reward": [this.rewardType, this.rewardNum]}, () => {
            this.initBtnStatus();
            Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_REDPOINT,RedPointConst.POINT_MAIN_INVITEFRIEND);
        }, this);
    }
    close() {

    }
    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}