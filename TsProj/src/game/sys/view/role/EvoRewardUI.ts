import IMessage from "../../interfaces/IMessage";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import RolesModel from "../../model/RolesModel";
import RolesFunc from "../../func/RolesFunc";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import {ui} from "../../../../ui/layaMaxUI";
import BattleRoleView from "../../../battle/view/BattleRoleView";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import DataResourceFunc from "../../func/DataResourceFunc";
import TimerManager from "../../../../framework/manager/TimerManager";
import PoolTools from "../../../../framework/utils/PoolTools";
import PoolCode from "../../consts/PoolCode";
import BattleFunc from "../../func/BattleFunc";
import DataResourceServer from "../../server/DataResourceServer";
import StatisticsManager from "../../manager/StatisticsManager";
import BattleConst from "../../consts/BattleConst";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";


export default class EvoRewardUI extends ui.gameui.role.EvoRewardUI implements IMessage {
	//角色id
	private roleId;
	private _lastRoleId;
	//角色动画
	private roleAnim: BattleRoleView;

	private freeType;
	private rewardArr;

	constructor() {
		super();
		this.initBtn();
	}

	initBtn() {
		new ButtonUtils(this.btn_close, this.onClickClose, this);
		new ButtonUtils(this.btn_reward, this.onClickVideoReward, this);
		new ButtonUtils(this.btn_return, this.onClickReturn, this);
	}

	//初始化
	setData(data) {
		BannerAdManager.addBannerQuick(this);
		this.roleId = data.roleId;
		this.initView();
		this.initAttr();
		this.refreshBtn();
	}

	//初始化属性
	initAttr() {
		var nowStar = RolesModel.instance.getRoleStarLevel(this.roleId);
		this.firstAttack.text = RolesFunc.instance.getAttShowTxt(BattleConst.attr_attack, this.roleId, null, nowStar, false, nowStar - 1);
		this.lastAttack.text = RolesFunc.instance.getAttShowTxt(BattleConst.attr_attack, this.roleId, null, nowStar, false, nowStar);
		this.firstLife.text = RolesFunc.instance.getAttShowTxt(BattleConst.attr_maxHp, this.roleId, null, nowStar, false, nowStar - 1);
		this.lastLife.text = RolesFunc.instance.getAttShowTxt(BattleConst.attr_maxHp, this.roleId, null, nowStar, false, nowStar);
	}

	initView() {
		var starLevel = RolesModel.instance.getRoleStarLevel(this.roleId);
		//炫耀的奖励
		var info = RolesFunc.instance.getCfgDatasByKey("RoleStar", this.roleId, starLevel);
		this.rewardArr = info.reward[0].split(",");
		var skill = BattleFunc.instance.getCfgDatasByKey("PassiveSkill", info.passiveSkill, "desc");
		this.skillTxt.text = TranslateFunc.instance.getTranslate(skill);
		//角色spine
		this.showRoleAni(this.roleId);
		StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_ROLEEVO_SHOW, {roleId: this.roleId})
	}

	//按钮初始化
	refreshBtn() {
		this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_EVOLUTION_REWARD);
		//没有视频或者分享
		if (this.freeType != ShareOrTvManager.TYPE_QUICKRECEIVE) {
			this.btn_return.visible = false;
			this.btn_reward.visible = true;
			this.btn_close.visible = false;

			//奖励展示
			var result = DataResourceFunc.instance.getDataResourceInfo(this.rewardArr);
			this.rewardImg.skin = result["img"];
			this.rewardNum.text = result["num"];

			var delayTime = ShareTvOrderFunc.instance.getDelayShowTime(ShareTvOrderFunc.SHARELINE_EVOLUTION_REWARD);
			this.btn_return.visible = true;
			if (delayTime) {
				this.btn_return.visible = false;
				TimerManager.instance.setTimeout(() => {
					this.btn_return.visible = true;
				}, this, delayTime)
			}
			this.freeImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.freeType);

		} else {
			this.btn_return.visible = false;
			this.btn_reward.visible = false;
			this.btn_close.visible = true;
		}
	}

	showRoleAni(roleId) {
		if (this.roleAnim) {
			this.roleSpine.removeChild(this.roleAnim);
			PoolTools.cacheItem(PoolCode.POOL_ROLE + this._lastRoleId, this.roleAnim);
		}
		var cacheItem: BattleRoleView = PoolTools.getItem(PoolCode.POOL_ROLE + roleId);
		var scaleRoleInfo = 1.8 * BattleFunc.defaultScale;
		if (!cacheItem) {
			var roleLevel = RolesModel.instance.getRoleLevelById(roleId);
			this.roleAnim = BattleFunc.instance.createRoleSpine(roleId, roleLevel, 2, scaleRoleInfo, true, false, "EvoRewardUI");
		} else {
			cacheItem.setItemViewScale(scaleRoleInfo);
			this.roleAnim = cacheItem;
		}
		this._lastRoleId = this.roleId
		this.roleSpine.addChild(this.roleAnim);
		this.roleAnim.play("idle", true);
	}

	onClickClose() {
		this.close();
	}

	onClickVideoReward() {
		StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_ROLEEVO_CLICK, {roleId: this.roleId})
		ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_UNLOCKROLE_REWARD, ShareOrTvManager.TYPE_SHARE,
			{
				id: "1",
				extraData: {}
			},
			this.successfull, this.closefull, this);
	}

	successfull() {
		DataResourceServer.getReward({"reward": this.rewardArr}, this.close, this);
		if (this.freeType == ShareOrTvManager.TYPE_ADV) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_ROLEVOREWARD_FINISH, {"roleId": this.roleId});
		} else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHARE_ROLEEVOREWARD_FINISH, {"roleId": this.roleId});
		}
	}

	closefull() {

	}

	//放弃奖励
	onClickReturn() {
		this.close();
	}

	close() {
		WindowManager.CloseUI(WindowCfgs.EvoRewardUI);
	}

	clear() {

	}

	dispose() {

	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}

}