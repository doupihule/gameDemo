import IMessage from "../../interfaces/IMessage";
import RolesModel from "../../model/RolesModel";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import {ui} from "../../../../ui/layaMaxUI";
import BattleRoleView from "../../../battle/view/BattleRoleView";
import PoolTools from "../../../../framework/utils/PoolTools";
import PoolCode from "../../consts/PoolCode";
import BattleFunc from "../../func/BattleFunc";
import RolesFunc from "../../func/RolesFunc";
import LogsManager from "../../../../framework/manager/LogsManager";
import TableUtils from "../../../../framework/utils/TableUtils";
import GameUtils from "../../../../utils/GameUtils";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";
import TimerManager from "../../../../framework/manager/TimerManager";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import GameConsts from "../../consts/GameConsts";

/**角色弹幕 */
export default class RoleBarrageUI extends ui.gameui.role.RoleBarrageUI implements IMessage {
	//角色id
	private roleId;
	private _lastRoleId;
	//角色动画
	private roleAnim: BattleRoleView;
	private barrageTxt;
	private typeArr;
	private allBarrage = [];
	private timeCode = 0;
	private moveArr = [];
	private callBack;
	private thisObj;

	constructor() {
		super();
		this.initBtn();
		var barType = RolesFunc.instance.getAllCfgData("Comment");
		for (var key in barType) {
			if (barType.hasOwnProperty(key)) {
				this.allBarrage.push(key);
			}
		}
	}

	initBtn() {
		this.on(Laya.Event.MOUSE_DOWN, this, this.onClickBg)
	}

	//初始化
	setData(data) {
		this.roleId = data.roleId;
		this.callBack = data.callBack;
		this.thisObj = data.thisObj;
		this.timeCode = TimerManager.instance.add(this.doTxtMove, this, 10)
		this.initView();
		var delay = GlobalParamsFunc.instance.getDataNum("roleCommentTime")
		TimerManager.instance.setTimeout(this.onClickBg, this, delay)

	}

	initView() {
		this.showRoleAni(this.roleId);
		this.typeArr = [];
		this.barrageTxt = RolesFunc.instance.getCfgDatasByKey("RoleComment", this.roleId, "comments");
		if (this.barrageTxt.length > this.allBarrage.length) {
			LogsManager.errorTag("弹幕样式数小于当前弹幕文本数");
			return;
		}
		var tempArr = [];
		TableUtils.copyOneArr(this.allBarrage, tempArr);
		for (var i = 0; i < this.barrageTxt.length; i++) {
			var ritem = GameUtils.getRandomInArr(tempArr);
			this.typeArr.push(ritem.result);
			tempArr.splice(ritem.index, 1);
		}
		this.showBarrage();

	}

	showBarrage() {
		for (var i = 0; i < this.barrageTxt.length; i++) {
			var content = this.barrageTxt[i];
			var typeInfo = RolesFunc.instance.getCfgDatas("Comment", this.typeArr[i]);
			var txt = new Laya.Label(TranslateFunc.instance.getTranslate(content, "TranslateComment"));
			var pos = typeInfo.position;
			var x = pos[0];
			var delay = typeInfo.delayTime;
			if (i == 0) {
				x = ScreenAdapterTools.width / 2;
				delay = 0;
			}
			txt.x = x;
			txt.y = pos[1];
			txt.fontSize = typeInfo.size;
			txt.color = typeInfo.color;
			txt.alpha = 0;
			this.barrageCtn.addChild(txt);
			TimerManager.instance.setTimeout(this.delayMove, this, delay, {speed: typeInfo.speed, txt: txt, index: i})
		}
	}

	delayMove(data) {
		this.moveArr.push(data);
		if (data.index == 0) {
			this.doTxtMove();
		}
	}

	doTxtMove() {
		for (var i = 0; i < this.moveArr.length; i++) {
			var item = this.moveArr[i];
			item.txt.alpha = 1;
			item.txt.x -= item.speed / 100 * (60 / GameConsts.gameFrameRate)
			// TweenAniManager.instance.horizontalAni(item.txt, item.txt.x - item.speed, null, null, 1000)
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
			this.roleAnim = BattleFunc.instance.createRoleSpine(roleId, roleLevel, 2, scaleRoleInfo, true, false, "RoleBarrageUI");
		} else {
			cacheItem.setItemViewScale(scaleRoleInfo);
			this.roleAnim = cacheItem;
		}
		this._lastRoleId = this.roleId
		this.roleSpine.addChild(this.roleAnim);
		this.roleAnim.play("idle", true);
	}

	onClickBg() {
		this.close();
	}

	close() {
		WindowManager.CloseUI(WindowCfgs.RoleBarrageUI);
		TimerManager.instance.removeByObject(this);
		this.barrageCtn.removeChildren();
		WindowManager.OpenUI(WindowCfgs.UnlockRoleUI, {
			"roleId": this.roleId,
			callBack: this.callBack,
			thisObj: this.thisObj
		});
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