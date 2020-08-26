import { ui } from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import BattleFunc from "../../func/BattleFunc";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import ResourceConst from "../../consts/ResourceConst";
import BattleRoleView from "../../../battle/view/BattleRoleView";
import PoolTools from "../../../../framework/utils/PoolTools";
import PoolCode from "../../consts/PoolCode";
import RolesModel from "../../model/RolesModel";
import RolesFunc from "../../func/RolesFunc";
import FogInitRoleUI from "./FogInitRoleUI";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import TimerManager from "../../../../framework/manager/TimerManager";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import GameUtils from "../../../../utils/GameUtils";
import UserInfo from "../../../../framework/common/UserInfo";
import StatisticsManager from "../../manager/StatisticsManager";

export default class FogRoleItemUI extends ui.gameui.fog.FogRoleItemUI implements IMessage {
    private cfg;
    public itemWidth = 212;
    public itemHeight = 280;
    private id;
    private owner: FogInitRoleUI;
    private isShowVideo;
    private roleAnim: BattleRoleView;
    private lastId;
    private attackFrame = 10;
    public insSpeak = false;
    private timeCode = 0;
    private freeType;
    private isShowItem;



    constructor(cfg, owner, isShowVideo, isShowItem) {
        super();

        this.owner = owner;
        this.cfg = cfg;
        this.id = this.cfg.id;
        this.isShowVideo = isShowVideo;
        this.isShowItem = isShowItem;
        this.insSpeak = false;

        this.setData();
        new ButtonUtils(this.item, this.onClickItem, this);
    }

    public setData() {
        if(!this.isShowItem){
           this.visible = false;
            return;
        }
        if (this.isShowVideo) {
            this.videoGroup.visible = true;
            this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_FOG_START_ADDROLE);
            this.unlockImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.freeType);
            if (this.freeType == ShareOrTvManager.TYPE_ADV) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_STARTROLE_SHOW);
            }
            this.starGroup.visible = false;
            this.qualImg.skin = "uisource/card/card/role_image_buzhenhui.png"
        } else {
            this.freshRoleInfo();
        }
    }
    /**刷新新英雄的信息 */
    freshRoleInfo() {
        this.videoGroup.visible = false;
        this.starGroup.visible = true;

        this.qualImg.skin = ResourceConst.LINE_ICON_DI[this.cfg.qualityType];
        if (this.roleAnim) {
            this.aniGroup.removeChild(this.roleAnim);
            PoolTools.cacheItem(PoolCode.POOL_ROLE + this.lastId, this.roleAnim);
        }
        var cacheItem: BattleRoleView = PoolTools.getItem(PoolCode.POOL_ROLE + this.id);
        var scale = (GlobalParamsFunc.instance.getDataNum("roleSizeInArrayUI") / 10000 || 1) * BattleFunc.defaultScale;

        if (!cacheItem) {
            cacheItem = BattleFunc.instance.createRoleSpine(this.id, RolesModel.instance.getRoleLevelById(this.id), 2, scale,true,false,"FogRoleItemUI")
        } else {
            cacheItem.setItemViewScale(scale);
        }

        cacheItem.scaleX = 1

        this.roleAnim = cacheItem
        this.aniGroup.addChild(this.roleAnim);
        this.roleAnim.play("idle", true);
        this.lastId = this.id;
        var act = BattleFunc.instance.getCfgDatasByKey("RoleAct", BattleFunc.instance.getCfgDatasByKey("Role", this.id, "spine"), "act");
        for (var i = 0; i < act.length; i++) {
            var item = act[i];
            if (item[0] == "attack") {
                this.attackFrame = Number(item[1])
            }
        }
        RolesFunc.instance.addStarImg(this.starGroup, this.id, 28, 28);

    }
    onClickItem() {
        if(!this.visible || !this.videoGroup.visible){
            return;
        }
        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_STARTROLE_CLICK);
        }
        //视频解锁
        ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_FOG_START_ADDROLE, ShareOrTvManager.TYPE_ADV,
            {
                id: "1",
                extraData: {}
            },
            this.successfull, this.closefull, this);
    }
    successfull() {
        this.freshRoleInfo();
        this.owner.isVideoGet = true;
        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_STARTROLE_FINISH);
        } else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHARE_FOG_STARTROLE_FINISH);
        }
    }
    closefull() {

    }
    freshSpeak(index, leftSpeak, rightSpeak, leftTxt, rightTxt) {
        if (this.roleAnim) {
            this.insSpeak = true;
            this.roleAnim.play("attack", false);
            this.timeCode = TimerManager.instance.setTimeout(() => {
                if (this.roleAnim) {
                    this.roleAnim.play("idle", true);
                }
            }, this, Math.ceil(this.attackFrame * BattleFunc.battleViewFrameScale / 60 * 1000)
            )
            if (index == 2) {
                leftSpeak.visible = true;
                leftTxt.text = TranslateFunc.instance.getTranslate(GameUtils.getRandomInArr(this.cfg.arraySpeak).result);
                leftSpeak.y = this.y - 10;
                leftSpeak.x = this.x + this.item.width - 10;
            } else {
                rightSpeak.visible = true;
                rightTxt.text = TranslateFunc.instance.getTranslate(GameUtils.getRandomInArr(this.cfg.arraySpeak).result);
                rightSpeak.y = this.y - 10;
                rightSpeak.x = this.x + this.item.width - 10;
            }
        }
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}