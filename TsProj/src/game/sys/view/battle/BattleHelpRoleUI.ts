import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import ButtonConst from "../../../../framework/consts/ButtonConst";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import TimerManager from "../../../../framework/manager/TimerManager";
import StatisticsManager from "../../manager/StatisticsManager";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import {ui} from "../../../../ui/layaMaxUI";
import BattleRoleView from "../../../battle/view/BattleRoleView";
import PoolTools from "../../../../framework/utils/PoolTools";
import PoolCode from "../../consts/PoolCode";
import BattleFunc from "../../func/BattleFunc";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import RolesFunc from "../../func/RolesFunc";


export default class BattleHelpRoleUI extends ui.gameui.battle.BattleHelpRoleUI {


	private freeType;
	private callBack;
	private thisObj;
	//角色动画
	private roleAnim: BattleRoleView;
	//上次缓存角色spine的id
	private _lastRoleId: string;
	private helpRoleId;

	constructor() {
		super();
		new ButtonUtils(this.useBtn, this.onClickUse, this).setBtnType(ButtonConst.BUTTON_TYPE_4);
		new ButtonUtils(this.exitBtn, this.onClickCLose, this);
	}

	setData(data): void {
		BannerAdManager.addBannerQuick(this);
		this.callBack = data.callBack;
		this.thisObj = data.thisObj;
		this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_BATTLE_TRYROLE);
		this.freeImg.skin = ShareOrTvManager.instance.getFreeImgSkin(this.freeType);
		var delayTime = ShareTvOrderFunc.instance.getDelayShowTime(ShareTvOrderFunc.SHARELINE_BATTLE_TRYROLE);
		this.exitBtn.visible = true;
		if (delayTime) {
			this.exitBtn.visible = false;
			TimerManager.instance.setTimeout(() => {
				this.exitBtn.visible = true;
			}, this, delayTime)
		}
		this.showRoleAni(data.helpRoleId);
		this.helpRoleId = data.helpRoleId
		var roleData = RolesFunc.instance.getCfgDatas("Role", data.helpRoleId)
		var name = TranslateFunc.instance.getTranslate(roleData.name);
		var times = roleData.tryParams.split(",")[1]
		this.desTxt.text = TranslateFunc.instance.getTranslate("#tid_tryRoleDesc", null, name, Number(times) / 1000, name)
	}

	//显示角色
	showRoleAni(roleId) {
		if (this.roleAnim) {
			this.aniGroup.removeChild(this.roleAnim);
			PoolTools.cacheItem(PoolCode.POOL_ROLE + this._lastRoleId, this.roleAnim);
		}
		var cacheItem: BattleRoleView = PoolTools.getItem(PoolCode.POOL_ROLE + roleId);
		var scaleRoleInfo = GlobalParamsFunc.instance.getDataNum("tryRoleSize") / 10000 * BattleFunc.defaultScale;
		if (!cacheItem) {
			this.roleAnim = BattleFunc.instance.createRoleSpine(roleId, 1, 2, scaleRoleInfo, false, false, "BattleHelpRoleUI");
		} else {
			cacheItem.setItemViewScale(scaleRoleInfo);
			this.roleAnim = cacheItem;
		}
		this.aniGroup.addChild(this.roleAnim);
		this.roleAnim.play("idle", true);
		this._lastRoleId = roleId;
	}

	onClickUse() {
		if (this.freeType == ShareOrTvManager.TYPE_ADV) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_ROLETRY_CLICK, {
				levelId: this.thisObj.levelId,
				roleId: this.helpRoleId
			});
		}
		ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_BATTLE_TRYROLE, ShareOrTvManager.TYPE_ADV, {
			id: "1",
			extraData: {}
		}, this.use, this.closeCall, this)
	}

	private use() {
		if (this.freeType == ShareOrTvManager.TYPE_ADV) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_ROLETRY_FINISH, {
				levelId: this.thisObj.levelId,
				roleId: this.helpRoleId
			});
		} else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHARE_ROLETRY_FINISH, {
				levelId: this.thisObj.levelId,
				roleId: this.helpRoleId
			});
		}
		this.callBack && this.callBack.call(this.thisObj)
		this.onClickCLose();

	}

	closeCall() {

	}

	onClickCLose() {
		WindowManager.CloseUI(WindowCfgs.BattleHelpRoleUI);
	}


}


