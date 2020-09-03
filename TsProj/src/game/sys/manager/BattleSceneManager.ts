import BattleLogicalControler from "../../battle/controler/BattleLogicalControler";
import TimerManager from "../../../framework/manager/TimerManager";

import ShareOrTvManager from "../../../framework/manager/ShareOrTvManager";
import UserInfo from "../../../framework/common/UserInfo";
import BaseContainer from "../../../framework/components/BaseContainer";


export default class BattleSceneManager {
	//实例
	private static _instance: BattleSceneManager;

	public static get instance() {
		if (!this._instance) {
			this._instance = new BattleSceneManager();
		}
		return this._instance;
	}

	//主场景拿着游戏控制器
	public autoBattleControler: BattleLogicalControler;

	//boss关卡战斗控制器
	public bossBattleControler: BattleLogicalControler;

	//战斗状态 0 非战斗.1 战斗中 这个针对副本战斗
	private _battestate: number = 0;
	private _cacheSpriteMap: any;


	//挂机游戏可以有2个战斗控制器


	constructor() {
	}

	/*进入战斗
		@param data 根据游戏自己定义 比如 levelid
	*/

	//进入战斗
	public enterBattle(data: any, ctn: BaseContainer, ui: any) {
		this._battestate = 1;
		this.autoBattleControler = new BattleLogicalControler(ctn, ui);
		this.autoBattleControler.setData(data);
		if (ShareOrTvManager.instance.canShareVideo()) {
			UserInfo.platform.recordStart();
		}

	}


	//重玩
	public replayBattle(inBattle = false) {
		var battleui = this.autoBattleControler.battleUI;
		var helpRole;
		if (inBattle) {
			helpRole = this.autoBattleControler.helpRoleId
		}
		if (this.autoBattleControler) {
			this.autoBattleControler.exitBattle();
		}
		// 重玩开始录屏时还没有结束录屏的回调，延迟加开始录屏
		if (ShareOrTvManager.instance.canShareVideo()) {
			TimerManager.instance.setTimeout(() => {
				LogsManager.echo("whn replay recordStart----------");
				UserInfo.platform.recordStart();
			}, this, 200);

		}
		battleui.setData({"isShowTalk": 2, levelId: battleui.levelId, name: battleui.levelName, helpRole: helpRole});

	}

	//触发角色节能
	public onClickRoleSkill(rid: string) {
		var control = this.getCurrentBattleControler();
		control.onClickRole(rid);
	}

	//使用战斗中的道具
	public useProp(propId: string) {

	}


	public getCurrentBattleControler() {
		if (this.bossBattleControler) {
			return this.bossBattleControler;
		}
		return this.autoBattleControler;
	}


	//设置游戏播放或者暂停
	public setGamePlayOrPause(value) {
		this.getCurrentBattleControler().setGamePlayOrPause(value)
	}

	//当触发点击
	public onTouchClick(e: any = null) {

	}

	//退出战斗之后
	public exitBattle() {
		this._battestate = 0;
		if (this.autoBattleControler) {
			//恢复游戏暂停
			this.autoBattleControler.exitBattle();
			this.autoBattleControler = null;
		}

	}

	/**获取本关所需要的所有模型arr */
	getCurModelArrByLevel(): string[] {
		//monsterList  根据ai车辆去判断加载哪些模型

		return [];
	}


	recvMsg(e) {

	}
}