import {ui} from "../../../../ui/layaMaxUI";
import WorkModel from "../../model/WorkModel";
import WorkConst from "../../consts/WorkConst";
import RolesFunc from "../../func/RolesFunc";
import PoolTools from "../../../../framework/utils/PoolTools";
import PoolCode from "../../consts/PoolCode";
import BattleRoleView from "../../../battle/view/BattleRoleView";
import BattleFunc from "../../func/BattleFunc";
import TimerManager from "../../../../framework/manager/TimerManager";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import WorkFunc from "../../func/WorkFunc";
import GameUtils from "../../../../utils/GameUtils";
import UserModel from "../../model/UserModel";
import ChapterFunc from "../../func/ChapterFunc";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import FogFunc from "../../func/FogFunc";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import WorkServer from "../../server/WorkServer";
import WorkDetailUI from "./WorkDetailUI";
import Message from "../../../../framework/common/Message";
import WorkEvent from "../../event/WorkEvent";
import TweenAniManager from "../../manager/TweenAniManager";
import StatisticsManager from "../../manager/StatisticsManager";


export default class WorkCompanyUI extends ui.gameui.work.WorkCompanyUI {
	private roleAnim;
	private timeCode = 0;
	private freeType;
	private isCan = true
	private isReputeEnough = true
	private isCostEnough = true
	private costInfo;
	private work: WorkDetailUI

	constructor(work) {
		super();
		this.work = work
		new ButtonUtils(this.upGradeBtn, this.onClickCost, this);
		new ButtonUtils(this.videoUpBtn, this.onClickVideo, this);

	}


	public setData(id): void {
		this.showRoleAni("2002")
		this.setCompany();
		StatisticsManager.ins.onEvent(StatisticsManager.COMPANYUP_OPEN)


	}

	showRoleAni(roleId) {
		if (this.roleAnim) {
			this.aniGroup.removeChild(this.roleAnim);
			PoolTools.cacheItem(PoolCode.POOL_ROLE + roleId, this.roleAnim);
		}
		var cacheItem: BattleRoleView = PoolTools.getItem(PoolCode.POOL_ROLE + roleId);
		if (!cacheItem) {
			var scaleRoleInfo = 1.6 * BattleFunc.defaultScale;
			this.roleAnim = BattleFunc.instance.createRoleSpine(roleId, 1, 2, scaleRoleInfo, true, false, "WorkCompanyUI");
		} else {
			this.roleAnim = cacheItem;
		}
		this.aniGroup.addChild(this.roleAnim);
		this.roleAnim.play("idle", true);
	}

	setCompany() {
		if (!this.timeCode) {
			this.timeCode = RolesFunc.instance.setRoleSpeak("2002", RolesFunc.ROLE_SPEAK_WORK, this.desTxt, this)
		}
		this.freshInfo()

	}

	freshInfo() {
		this.costInfo = null
		var level = WorkModel.instance.getCompanyLevel()
		this.companyLevelTxt.text = level + TranslateFunc.instance.getTranslate("#tid_work_companyLevel");
		var nowCfg = WorkFunc.instance.getCfgDatas("CompanyUpdate", level);
		if (level >= WorkFunc.instance.getMaxCompanyLevel()) {
			this.nextGroup.visible = false;
			this.upGroup.visible = false;
			this.fullTxt.visible = true;
		} else {
			this.nextGroup.visible = true;
			this.upGroup.visible = true;
			this.fullTxt.visible = false;
			this.setNextInfo(level + 1)
		}
		this.commissionTxt.text = nowCfg.commissionAdd / 100 + "%"
		this.starTxt.text = TranslateFunc.instance.getTranslate(nowCfg.starRange);
		this.numTxt.text = nowCfg.workNum + ""
		this.timeTxt.text = GameUtils.convertTime(nowCfg.workTimeReduce, 2)
	}

	setNextInfo(level) {
		var cfg = WorkFunc.instance.getCfgDatas("CompanyUpdate", level);
		this.commisionTxt2.text = cfg.commissionAdd / 100 + "%"
		this.starTxt2.text = TranslateFunc.instance.getTranslate(cfg.starRange);
		this.numTxt2.text = cfg.workNum + ""
		this.timeTxt2.text = GameUtils.convertTime(cfg.workTimeReduce, 2)
		var unlockCondition = cfg.unlockCondition;
		this.isCan = true;
		this.isCostEnough = true;
		var txt = ""
		for (var i = 0; i < unlockCondition.length; i++) {
			var info = unlockCondition[i];
			if (Number(info[0]) == WorkConst.CompanyUnlock_level) {
				var nowLevel = UserModel.instance.getMaxBattleLevel()
				if (nowLevel < Number(info[1])) {
					this.isCan = false;
				}
				txt += TranslateFunc.instance.getTranslate("#tid_work_companyUnlockLevel", null, ChapterFunc.instance.getOpenConditionByLevel(Number(info[1])), ChapterFunc.instance.getOpenConditionByLevel(nowLevel)) + "\n"
			} else if (Number(info[0]) == WorkConst.CompanyUnlock_fogLevel) {
				if (UserModel.instance.getMaxFogLayer() < Number(info[1])) {
					this.isCan = false;
				}
				txt += TranslateFunc.instance.getTranslate("#tid_work_companyUnlockFogLevel", null, Number(info[1]), UserModel.instance.getMaxFogLayer()) + "\n"
			}
		}
		this.passTxt.text = txt;
		if (!this.isCan) {
			this.passTxt.color = "#ff0101"
		} else {
			this.passTxt.color = "#000000"
		}
		var hasNum = WorkModel.instance.getReputeNum();
		var costNum = cfg.renownNeed
		this.needTxt.text = "/" + costNum
		this.hasTxt.text = hasNum + ""
		this.isReputeEnough = true
		if (hasNum < costNum) {
			this.hasTxt.color = "#eeb024"
			this.isReputeEnough = false
		} else {
			this.hasTxt.color = "#000000"
		}
		if (!this.isCan || !this.isReputeEnough) {
			this.videoUpBtn.gray = true;
			this.upGradeBtn.gray = true;
		} else {
			this.videoUpBtn.gray = false;
			this.upGradeBtn.gray = false;
		}
		this.setBtnShow(cfg.cost)
		this.freeRedImg.visible = false;
		this.upRedImg.visible = false;
		if (this.isCan && this.isReputeEnough) {
			this.freeRedImg.visible = true;
			if (this.isCostEnough) {
				this.upRedImg.visible = true;
			}
		}
	}

	setBtnShow(cost) {
		this.costInfo = cost;
		this.videoUpBtn.visible = false;
		this.upGradeGroup.visible = false;
		if (cost[0][0] == -1) {
			this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_WORK_COMPANYUP);
			if (this.freeType != ShareOrTvManager.TYPE_QUICKRECEIVE) {
				this.videoUpBtn.visible = true;
				this.freeImg.skin = ShareOrTvManager.instance.getFreeImgSkin(this.freeType);
				if (this.freeType == ShareOrTvManager.TYPE_ADV) {
					StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_COMPANYUP_SHOW, {level: WorkModel.instance.getCompanyLevel()})
				}
			} else {
				this.setCostInfo(cost[1])
			}
		} else {
			this.setCostInfo(cost[0])
		}
	}

	setCostInfo(cost) {
		this.upGradeGroup.visible = true;
		var info = FogFunc.instance.getResourceShowInfo(cost);
		this.costImg.skin = info.icon;
		this.costTxt.text = info.num;
		if (info.num > Number(info.userNum)) {
			this.costTxt.color = "#ff0101"
			this.isCostEnough = false;
		} else {
			this.costTxt.color = "#000000"
		}
	}

	onClickVideo() {
		if (!this.isCan) {
			this.doShakeAni(this.passTxt)
			return;
		}
		if (!this.isReputeEnough) {
			this.doShakeAni(this.hasTxt)
			return;
		}
		if (this.freeType == ShareOrTvManager.TYPE_ADV) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_COMPANYUP_CLICK, {level: WorkModel.instance.getCompanyLevel()})
		}
		ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_WORK_COMPANYUP, ShareOrTvManager.TYPE_ADV, {
			id: 1,
			extraData: {}
		}, this.succCall, null, this)

	}

	doShakeAni(item) {
		TweenAniManager.instance.fadeOutAni(item, () => {
			TweenAniManager.instance.fadeInAni(item, null, 300, this)
		}, 300, this)
	}

	succCall() {
		if (this.freeType == ShareOrTvManager.TYPE_ADV) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_COMPANYUP_FINISH, {level: WorkModel.instance.getCompanyLevel()})
		} else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHARE_COMPANYUP_FINISH, {level: WorkModel.instance.getCompanyLevel()})

		}
		this.upCompany();
	}

	onClickCost() {
		if (!this.isCan) {
			this.doShakeAni(this.passTxt)
			return;
		}
		if (!this.isReputeEnough) {
			this.doShakeAni(this.hasTxt)
			return;
		}
		if (!this.isCostEnough) {
			WindowManager.OpenUI(WindowCfgs.TurnableUI);
			return;
		}
		this.upCompany(this.costInfo);

	}

	upCompany(cost = null) {
		var data = {}
		if (cost) {
			data = {
				cost: cost
			}
		}
		WorkServer.upWorkCompany(data, this.upCall, this)
	}

	upCall() {
		this.freshInfo();
		Message.instance.send(WorkEvent.WORK_REPUTE_UPDATE)
		StatisticsManager.ins.onEvent(StatisticsManager.COMPANYUP_SUCC, {level: WorkModel.instance.getCompanyLevel()})
	}

	close() {
		TimerManager.instance.removeByObject(this);
		this.timeCode = null
	}
}


