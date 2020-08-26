import StatisticsManager from "../../manager/StatisticsManager";
import TimerManager from "../../../../framework/manager/TimerManager";
import SubPackageManager from "../../../../framework/manager/SubPackageManager";
import IMessage from "../../interfaces/IMessage";
import SubPackageConst from "../../consts/SubPackageConst";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import {ui} from "../../../../ui/layaMaxUI";
import Message from "../../../../framework/common/Message";
import StringUtils from "../../../../framework/utils/StringUtils";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import ButtonConst from "../../../../framework/consts/ButtonConst";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import BigNumUtils from "../../../../framework/utils/BigNumUtils";
import GameUtils from "../../../../utils/GameUtils";
import ResourceConst from "../../consts/ResourceConst";
import UserExtModel from "../../model/UserExtModel";
import DataResourceServer from "../../server/DataResourceServer";
import GameMainEvent from "../../event/GameMainEvent";
import PoolTools from "../../../../framework/utils/PoolTools";
import PoolCode from "../../consts/PoolCode";
import BattleRoleView from "../../../battle/view/BattleRoleView";
import RolesModel from "../../model/RolesModel";
import BattleFunc from "../../func/BattleFunc";
import TranslateFunc from "../../../../framework/func/TranslateFunc";


export default class OfflineIncomeUI extends ui.gameui.main.OfflineIncomeUI implements IMessage {
	private coinNum;
	private land;
	private type;
	private offlineCoinCount;
	/** 离线收益倍数 */
	private offlineCoinRetio;
	private freeType;
	private offlineReward;
	private multi;
	private rewardType;
	private roleAnim;

	constructor() {
		super();
		this.addEvent();
		TimerManager.instance.setTimeout(() => {
			SubPackageManager.loadSubPackage(SubPackageConst.packName_share);
		}, this, 2000);

		new ButtonUtils(this.btn_multiReward, this.onReceiveBtnClick, this).setBtnType(ButtonConst.BUTTON_TYPE_4);
		new ButtonUtils(this.btn_normalReward, this.clickNormalReward, this);
		new ButtonUtils(this.closeBtn, this.close, this);
	}

	/**添加事件监听 */
	addEvent() {
	}

	setData(data): void {
		BannerAdManager.addBannerQuick(this);
		BannerAdManager.addTopBannerStyleJump(this);
		var offlineWeightArr = GlobalParamsFunc.instance.getDataArray("offLineDoubleNub");


		this.multi = Number(GameUtils.getWeightItem(offlineWeightArr)[0]);
		this.lbl_multi.text = "×" + this.multi;

		var reward = UserExtModel.instance.calcuOfflineReward();
		this.rewardType = reward[0];
		this.offlineReward = reward[1];
		this.lbl_normalReward.text = StringUtils.getCoinStr(this.offlineReward);
		this.lbl_multiReward.text = StringUtils.getCoinStr(BigNumUtils.floatMuitlfy(this.offlineReward, this.multi));


		//按钮状态
		this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_OFFLINE);
		if (this.freeType == ShareOrTvManager.TYPE_QUICKRECEIVE) {
			this.multiRewardGroup.visible = false;
		} else {
			this.multiRewardGroup.visible = true;
			this.freeImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.freeType);
			if (this.freeType == ShareOrTvManager.TYPE_ADV) {
				this.freeImg.skin = ResourceConst.ADV_PNG;
				StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_OFFLINECOIN_SHOW, {"times": this.multi});
			}
		}

		if (!GameUtils.isReview) {
			this.showRoleAni("1016");
		}
	}

	showRoleAni(roleId) {
		if (this.roleAnim) {
			this.roleSpine.removeChild(this.roleAnim);
			PoolTools.cacheItem(PoolCode.POOL_ROLE + roleId, this.roleAnim);
		}
		var cacheItem: BattleRoleView = PoolTools.getItem(PoolCode.POOL_ROLE + roleId);
		if (!cacheItem) {
			var scaleRoleInfo = 1.7 * BattleFunc.defaultScale;
			var roleLevel = RolesModel.instance.getRoleLevelById(roleId);
			this.roleAnim = BattleFunc.instance.createRoleSpine(roleId, roleLevel, 2, scaleRoleInfo, true, false, "OfflineComeUI");
		} else {
			this.roleAnim = cacheItem;
		}

		this.roleSpine.addChild(this.roleAnim);
		this.roleAnim.play("idle", true);
	}

	//退出并领取1倍离线收益
	clickNormalReward() {
		DataResourceServer.getReward({"reward": [this.rewardType, this.offlineReward], "offlineTime": -1}, () => {
			WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_get_lab"));
			this.close();
		}, this);
	}

	//领取多倍离线收益
	onReceiveBtnClick() {
		if (this.freeType == ShareOrTvManager.TYPE_ADV) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_OFFLINECOIN_CLICK, {"times": this.multi});
		}
		ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_OFFLINE, ShareOrTvManager.TYPE_ADV, {
			id: "1",
			extraData: {}
		}, this.successCall, this.closeCall, this);

	}

	successCall() {
		DataResourceServer.getReward({
			"reward": [this.rewardType, BigNumUtils.floatMuitlfy(this.offlineReward, this.multi)],
			"offlineTime": -1
		}, () => {
			WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_get_lab"));
			this.close();
		}, this);
		if (this.freeType == ShareOrTvManager.TYPE_ADV) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_OFFLINECOIN_FINISH, {"times": this.multi});
		} else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHARE_OFFLINECOIN_FINISH, {"times": this.multi});
		}
	}

	closeCall() {

	}

	close() {
		WindowManager.CloseUI(WindowCfgs.OfflineIncomeUI);
		Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_REFRESH_OFFLINE_ICON);
		Message.instance.send(GameMainEvent.GAMEMIAN_EVENT_CHECKPOP);
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}

	}
}


