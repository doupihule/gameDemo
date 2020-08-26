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
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import TimerManager from "../../../../framework/manager/TimerManager";
import PoolTools from "../../../../framework/utils/PoolTools";
import PoolCode from "../../consts/PoolCode";
import BattleFunc from "../../func/BattleFunc";
import DataResourceServer from "../../server/DataResourceServer";
import StatisticsManager from "../../manager/StatisticsManager";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";


export default class UnlockRoleUI extends ui.gameui.role.UnlockRoleUI implements IMessage {
	//角色id
	private roleId;
	private changeId;
	//角色动画
	private roleAnim: BattleRoleView;

	private freeType;
	private rewardArr;
	private callBack;
	private thisObj;

	constructor() {
		super();
		this.addEvent();
		this.initBtn();
	}

	//添加事件监听
	addEvent() {
		// Message.instance.add(GameMainEvent.ROLELIST_EVENT_REFRESH, this);
		// Message.instance.add(GameMainEvent.GAMEMAIN_EVENT_STAGE, this);
		// Message.instance.add(GameMainEvent.GAMEMAIN_EVENT_FRESHMONEY, this);
	}

	initBtn() {
		new ButtonUtils(this.btn_close, this.onClickClose, this);
		new ButtonUtils(this.btn_reward, this.onClickVideoReward, this);
		new ButtonUtils(this.btm_freeGet, this.onClickClose, this);
		new ButtonUtils(this.btn_return, this.onClickReturn, this);
	}

	//初始化
	setData(data) {
		BannerAdManager.addBannerQuick(this);
		this.roleId = data.roleId;
		this.callBack = data.callBack;
		this.thisObj = data.thisObj;
		this.initView();
		this.refreshBtn();
	}

	initView() {
		var roleInfo = RolesFunc.instance.getRoleInfoById(this.roleId);
		//炫耀的奖励
		var rewardInfo = RolesFunc.instance.getRoleDataById(this.roleId, "shareGiveDiamond");
		this.rewardArr = rewardInfo[0].split(",");


		//角色spine
		this.showRoleAni(this.roleId);

		//角色名字，等级
		var roleName = TranslateFunc.instance.getTranslate(roleInfo.name, "TranslateRole");
		this.roleName.text = roleName;
	}

	//按钮初始化
	refreshBtn() {
		var unlockRoleRewardSwitch = GlobalParamsFunc.instance.getDataNum("unlockRoleRewardSwitch");
		if (!unlockRoleRewardSwitch) {
			this.btn_return.visible = false;
			this.btn_reward.visible = false;
			this.btn_close.visible = false;
			this.freeImg.visible = false;
			this.btm_freeGet.visible = true;
			//奖励展示
			var result = DataResourceFunc.instance.getDataResourceInfo(this.rewardArr);
			this.freeGetImg.skin = result["img"];
			this.freeGetCount.text = result["num"];
		} else {
			this.freeImg.visible = true;
			this.btm_freeGet.visible = false;
			this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_UNLOCKROLE_REWARD);
			//没有视频或者分享
			if (this.freeType != ShareOrTvManager.TYPE_QUICKRECEIVE) {
				this.btn_return.visible = false;
				this.btn_reward.visible = true;
				this.btn_close.visible = false;

				//奖励展示
				var result = DataResourceFunc.instance.getDataResourceInfo(this.rewardArr);
				this.rewardImg.skin = result["img"];
				this.rewardNum.text = result["num"];

				var delayTime = ShareTvOrderFunc.instance.getDelayShowTime(ShareTvOrderFunc.SHARELINE_UNLOCKROLE_REWARD);
				this.btn_return.visible = true;
				if (delayTime) {
					this.btn_return.visible = false;
					TimerManager.instance.setTimeout(() => {
						this.btn_return.visible = true;
					}, this, delayTime)
				}
				this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_UNLOCKROLE_REWARD);
				this.freeImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.freeType);
				if (this.freeType == ShareOrTvManager.TYPE_ADV) {
					StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_UNLOCKROLEREWARD_SHOW, {"roleId": this.roleId});
				}
			} else {
				this.btn_return.visible = false;
				this.btn_reward.visible = false;
				this.btn_close.visible = true;
			}
		}

	}

	showRoleAni(roleId) {
		if (this.roleAnim) {
			this.roleSpine.removeChild(this.roleAnim);
		}
		var cacheItem: BattleRoleView = PoolTools.getItem(PoolCode.POOL_ROLE + roleId);
		if (!cacheItem) {
			var scaleRoleInfo = 1.8 * BattleFunc.defaultScale;
			var roleLevel = RolesModel.instance.getRoleLevelById(roleId);
			this.roleAnim = BattleFunc.instance.createRoleSpine(roleId, roleLevel, 2, scaleRoleInfo, true, false, "UnlockRoleUI");
		} else {
			this.roleAnim = cacheItem;
		}

		this.roleSpine.addChild(this.roleAnim);
		this.roleAnim.play("idle", true);
	}

	//直接领取奖励
	onClickClose() {
		DataResourceServer.getReward({"reward": this.rewardArr}, this.close, this);
	}

	onClickVideoReward() {
		if (this.freeType == ShareOrTvManager.TYPE_ADV) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_UNLOCKROLEREWARD_CLICK, {"roleId": this.roleId});
		}
		ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_UNLOCKROLE_REWARD, ShareOrTvManager.TYPE_SHARE,
			{
				id: "1",
				extraData: {}
			},
			this.successfull, this.closefull, this);

	}

	successfull() {
		this.onClickClose();
		if (this.freeType == ShareOrTvManager.TYPE_ADV) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_UNLOCKROLEREWARD_FINISH, {"roleId": this.roleId});
		} else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHARE_UNLOCKROLEREWARD_FINISH, {"roleId": this.roleId});
		}
	}

	closefull() {

	}

	//放弃奖励
	onClickReturn() {
		this.close();
	}

	close() {
		WindowManager.CloseUI(WindowCfgs.UnlockRoleUI);
		this.callBack && this.callBack.call(this.thisObj);
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