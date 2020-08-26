import {ui} from "../../../../../ui/layaMaxUI";
import IMessage from "../../../interfaces/IMessage";
import WindowManager from "../../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../../consts/WindowCfgs";
import {ButtonUtils} from "../../../../../framework/utils/ButtonUtils";
import TranslateFunc from "../../../../../framework/func/TranslateFunc";
import FogModel from "../../../model/FogModel";
import FogServer from "../../../server/FogServer";
import PoolTools from "../../../../../framework/utils/PoolTools";
import PoolCode from "../../../consts/PoolCode";
import BattleFunc from "../../../func/BattleFunc";
import BattleRoleView from "../../../../battle/view/BattleRoleView";
import BannerAdManager from "../../../../../framework/manager/BannerAdManager";
import FogEventData from "../../../../fog/data/FogEventData";
import FogInstanceCell from "../../../../fog/instance/FogInstanceCell";
import RolesFunc from "../../../func/RolesFunc";
import RolesModel from "../../../model/RolesModel";


export default class FogUserRoleUI extends ui.gameui.fog.FogUserRoleUI implements IMessage {

	private eventId;//事件id
	private eventInfo;//事件cfg
	private costAct;

	private callBack;
	private thisObj;

	//格子事件
	private events: FogEventData;
	//格子
	private cell: FogInstanceCell;

	private roleId;//角色id
	//角色动画
	private roleAnim: BattleRoleView;
	//上次缓存角色spine的id
	private _lastRoleId: string;

	private isFinish = false;//事件是否完成


	constructor() {
		super();
		new ButtonUtils(this.btn_close, this.close, this);
		new ButtonUtils(this.takeBtn, this.onClickTake, this);

	}

	public setData(data) {
		this.roleId = null;
		this._lastRoleId = null;
		this.isFinish = false;

		this.callBack = data && data.callBack;
		this.thisObj = data && data.thisObj;

		this.events = data.event;
		this.cell = data.cell;
		this.roleId = this.events.roleId;
		this.eventId = this.events.eventId;
		this.eventInfo = this.events.cfgData;


		//标题
		var roleInfo = RolesFunc.instance.getRoleInfoById(this.roleId);
		var roleName = TranslateFunc.instance.getTranslate(roleInfo.name, "TranslateRole");
		this.titleLab.text = TranslateFunc.instance.getTranslate(this.eventInfo.name, "TranslateEvent", [roleName]);
		//描述
		this.desc.text = TranslateFunc.instance.getTranslate(this.eventInfo.desc[0], "TranslateEvent", [roleName]);

		//角色spine
		this.showRoleAni(this.roleId);
		this.costAct = this.events.mobilityCost || 0;
		if (this.costAct) {
			this.costNum.text = "-" + this.costAct;
		} else {
			this.costGroup.visible = false;
		}


		BannerAdManager.addBannerQuick(this);
	}

	showRoleAni(roleId) {
		if (!this.roleId) {
			return;
		}

		if (this.roleAnim) {
			this.roleSpine.removeChild(this.roleAnim);
			PoolTools.cacheItem(PoolCode.POOL_ROLE + this._lastRoleId, this.roleAnim);
		}
		var cacheItem: BattleRoleView = PoolTools.getItem(PoolCode.POOL_ROLE + roleId);
		if (!cacheItem) {
			var scaleRoleInfo = RolesFunc.instance.getRoleDataById(roleId, "scaleRoleInfo") / 10000 * BattleFunc.defaultScale;
			var roleLevel = RolesModel.instance.getRoleLevelById(roleId);
			this.roleAnim = BattleFunc.instance.createRoleSpine(roleId, roleLevel, 2, scaleRoleInfo, true, false, "FogUserRoleUI");
		} else {
			this.roleAnim = cacheItem;
		}

		this.roleSpine.addChild(this.roleAnim);
		this.roleAnim.x = 0.5 * this.roleSpine.width;
		this.roleAnim.y = this.roleSpine.height;
		this.roleAnim.play("idle", true);
		this._lastRoleId = roleId;
	}

	onClickTake() {
		//判断行动力是否足够
		var userActNum = FogModel.instance.getActNum()
		if (userActNum < Number(this.costAct)) {
			FogModel.instance.checkFreeAct();
			return;
		}

		//消耗行动力带走角色
		FogServer.takenRole({"cost": this.costAct, "roleId": this.roleId}, this.finishCallBack, this);
	}

	finishCallBack() {
		this.isFinish = true;
		this.close();
	}

	close() {
		WindowManager.CloseUI(WindowCfgs.FogUserRoleUI);
		if (this.isFinish) {
			this.callBack && this.callBack.call(this.thisObj);
		}

	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}
}