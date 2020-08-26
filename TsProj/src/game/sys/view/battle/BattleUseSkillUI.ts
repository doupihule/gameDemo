
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import ButtonConst from "../../../../framework/consts/ButtonConst";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import TimerManager from "../../../../framework/manager/TimerManager";
import StatisticsManager from "../../manager/StatisticsManager";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import { ui } from "../../../../ui/layaMaxUI";
import BattleLogicalControler from "../../../battle/controler/BattleLogicalControler";


export default class BattleUseSkillUI extends ui.gameui.battle.BattleUseSkillUI {


    private freeType;
    private callBack;
    private thisObj;
    private controler: BattleLogicalControler;
    private skillId

    constructor() {
        super();
        new ButtonUtils(this.useBtn, this.onClickUse, this).setBtnType(ButtonConst.BUTTON_TYPE_4);
        new ButtonUtils(this.exitBtn, this.onClickCLose, this);
    }

    setData(data): void {
        BannerAdManager.addBannerQuick(this);
        this.callBack = data.callBack;
        this.thisObj = data.thisObj;
        this.controler = data.controler;
        this.skillId = data.skillId;
        this.controler.setGamePlayOrPause(true);
        this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_BATTLE_USESKILL);
        this.freeImg.skin = ShareOrTvManager.instance.getFreeImgSkin(this.freeType);
        var delayTime = ShareTvOrderFunc.instance.getDelayShowTime(ShareTvOrderFunc.SHARELINE_BATTLE_USESKILL);
        this.exitBtn.visible = true;
        if (delayTime) {
            this.exitBtn.visible = false;
            TimerManager.instance.setTimeout(() => {
                this.exitBtn.visible = true;
            }, this, delayTime)
        }
    }

    onClickUse() {
        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_LEVELSKILL_CLICK, { id: this.controler.battleData.levelId, skillId: this.skillId })

        }
        ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_BATTLE_USESKILL, ShareOrTvManager.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.use, this.closeCall, this)
    }

    private use() {
        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_LEVELSKILL_FINISH, { id: this.controler.battleData.levelId, skillId: this.skillId })
        } else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHARE_LEVELSKILL_FINISH, { id: this.controler.battleData.levelId, skillId: this.skillId })
        }
        this.callBack && this.callBack.call(this.thisObj);
        this.onClickCLose();

    }
    closeCall() {

    }
    onClickCLose() {
        WindowManager.CloseUI(WindowCfgs.BattleUseSkillUI);
        this.controler.setGamePlayOrPause(false);
    }


}


