import {ui} from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import RoleInLineUI from "./RoleInLineUI";
import BattleFunc from "../../func/BattleFunc";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import UserModel from "../../model/UserModel";
import ResourceConst from "../../consts/ResourceConst";
import BattleRoleView from "../../../battle/view/BattleRoleView";
import PoolTools from "../../../../framework/utils/PoolTools";
import PoolCode from "../../consts/PoolCode";
import RolesModel from "../../model/RolesModel";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import GameUtils from "../../../../utils/GameUtils";
import TimerManager from "../../../../framework/manager/TimerManager";
import RolesFunc from "../../func/RolesFunc";
import ChapterFunc from "../../func/ChapterFunc";

export default class RoleLineItemUI extends ui.gameui.roleLine.RoleLineItemUI implements IMessage {
	private cfg;
	public itemWidth = 212;
	public itemHeight = 280;
	private id;
	private isInLine = false;
	private isLock = false;
	private owner: RoleInLineUI;
	private unlockLevel;
	private roleAnim: BattleRoleView;
	private lastId;
	private attackFrame = 10;
	public insSpeak = false;
	private timeCode = 0;


	constructor(cfg, owner, unlockLevel) {
		super();
		if (cfg) {
			this.cfg = cfg;
			this.id = this.cfg.id;
			this.isInLine = true;
		} else {
			this.isInLine = false;
		}
		this.owner = owner;
		this.unlockLevel = unlockLevel
		this.insSpeak = false;
		this.setData();
		new ButtonUtils(this.item, this.onClickItem, this)
	}

	public setData() {
		if (this.unlockLevel <= UserModel.instance.getMaxBattleLevel()) {
			this.isLock = false;
		} else {
			this.isLock = true;
		}
		this.qualImg.skin = "uisource/card/card/role_image_buzhenhui.png"
		if (this.isLock) {
			this.unlockGroup.visible = true;
			this.unlockTxt.text = TranslateFunc.instance.getTranslate("#tid_flat_unlockTip1", null, ChapterFunc.instance.getOpenConditionByLevel(this.unlockLevel));

		} else {
			this.unlockGroup.visible = false;
		}
		if (this.isInLine) {
			this.freshRoleInfo();
		}


	}

	/**刷新新英雄的信息 */
	freshRoleInfo() {
		this.qualImg.skin = ResourceConst.LINE_ICON_DI[this.cfg.qualityType];
		if (this.roleAnim) {
			this.aniGroup.removeChild(this.roleAnim);
			PoolTools.cacheItem(PoolCode.POOL_ROLE + this.lastId, this.roleAnim);
		}
		var cacheItem: BattleRoleView = PoolTools.getItem(PoolCode.POOL_ROLE + this.id);
		var scale = (GlobalParamsFunc.instance.getDataNum("roleSizeInArrayUI") / 10000 || 1) * BattleFunc.defaultScale;

		if (!cacheItem) {
			cacheItem = BattleFunc.instance.createRoleSpine(this.id, RolesModel.instance.getRoleLevelById(this.id), 2, scale, true, false, "RoleLineItemUI")
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

	//从阵上移除
	removeLine() {
		if (this.isInLine) {
			this.qualImg.skin = "uisource/card/card/role_image_buzhenhui.png";
			this.cfg = null;
			if (this.roleAnim) {
				this.aniGroup.removeChild(this.roleAnim);
				PoolTools.cacheItem(PoolCode.POOL_ROLE + this.lastId, this.roleAnim);
				this.roleAnim = null;
				TimerManager.instance.clearTimeout(this.timeCode);
			}
		}
	}

	onClickItem() {
		if (this.isInLine && !this.isLock) {
			this.owner.freshRoleInLine(this.id);
			if (this.insSpeak) {
				this.owner.hideSpeakInfo();
				this.insSpeak = false;
			}
		}
	}

	freshLineState(cfg) {
		if (this.isLock) return;
		if (this.isInLine) {
			//如果之前在阵上现在不在阵上
			if (!cfg) {
				this.removeLine();
				this.isInLine = false;
			} else {
				//之前在阵上现在也在阵上但id变了
				if (this.id != cfg.id) {
					this.id = cfg.id;
					this.cfg = cfg;
					this.freshRoleInfo();
				}
			}
		} else {
			//之前不在阵上现在在阵上
			if (cfg) {
				this.cfg = cfg;
				this.id = this.cfg.id
				this.isInLine = true;
				this.freshRoleInfo();
			}
		}
	}

	freshSpeak(index, leftSpeak, rightSpeak, leftTxt, rightTxt) {
		if (this.isInLine && this.roleAnim) {
			this.insSpeak = true;
			this.roleAnim.play("attack", false);
			this.timeCode = TimerManager.instance.setTimeout(() => {
					if (this.roleAnim) {
						this.roleAnim.play("idle", true);
					}
				}, this, Math.ceil(this.attackFrame * BattleFunc.battleViewFrameScale / 60 * 1000)
			)
			if (index == 2 || index == 5) {
				leftSpeak.visible = true;
				leftTxt.text = TranslateFunc.instance.getTranslate(GameUtils.getRandomInArr(this.cfg.arraySpeak).result);
				leftSpeak.y = this.y;
				leftSpeak.x = this.x;
			} else {
				rightSpeak.visible = true;
				rightTxt.text = TranslateFunc.instance.getTranslate(GameUtils.getRandomInArr(this.cfg.arraySpeak).result);
				rightSpeak.y = this.y;
				rightSpeak.x = this.x;
			}

		}

	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}
}