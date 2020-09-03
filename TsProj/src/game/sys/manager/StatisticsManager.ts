import UserInfo from "../../../framework/common/UserInfo";

import FileUtils from "../../../framework/utils/FileUtils";
import StatisticsExtendManager from "../../../framework/manager/StatisticsExtendManager";
import Client from "../../../framework/common/kakura/Client";

export default class StatisticsManager {
	private static _ins: StatisticsManager;

	public static mainStartT: number = 0;
	public static isLoadingLog: boolean = false;
	public static loadingOutT: number = 0;
	/**根据进游戏时读缓存判断是否为新玩家 */
	public static isNewPlayer: boolean = false;

	public constructor() {
	}

	static get ins(): StatisticsManager {
		if (!this._ins) {
			this._ins = new StatisticsManager();

		}
		return this._ins;
	}

	init() {

	}

	/**loading完成 开始玩 打点计时 */
	static onLoadingLog() {
		if (this.isLoadingLog) return;
		if (FileUtils.isUserWXSource()) {
			this.isLoadingLog = true;
			var disT = Client.instance.miniserverTime- this.mainStartT;
			if (disT > this.loadingOutT) {
				disT -= this.loadingOutT;
			}
			if (disT > 100000) {
				LogsManager.echo("krma. start " + this.mainStartT + " end " + Client.instance.miniserverTime + " time " + disT + " except " + this.loadingOutT);
				LogsManager.sendErrorToPlatform("loadingTime_moreThan_100000", LogsManager.errorTage_serverError, 1000, "loadingTime_moreThan_100000");
			}
			LogsManager.sendLoadingToAiCloud(disT);
		}
	}

	/**loading过程中隐藏到后台的时间长 */
	static addLoadingOutTime(disT: number) {
		if (this.isLoadingLog) return;
		if (disT > 0) {
			this.loadingOutT += disT;
		}
	}

	/**数据打点 */
	onEvent(event: any, eventData = null) {
		StatisticsExtendManager.onEvent(event, eventData);
	}


	//设置合法域名
	//https://pingtas.qq.com https://h5.udrig.com、https://api.talkingdata.com https://glog.aldwx.com

	//StatisticsManager.ins.onEvent(StatisticsManager.SHAREWX, {type:type})


	// 打点分组枚举常量
	static GROUP_Level = 'C_Level';
	static GROUP_Hero = 'D_Hero';
	static GROUP_ShowTv = 'G_ShowTv';
	static GROUP_Share = 'H_Share';
	static GROUP_GUIDE = "E_Guide";
	static GROUP_EQUIP = "F_Equip";
	static GROUP_LOTTERY = "I_Lottery";
	static GROUP_FOG = "K_fog";
	static GROUP_TASK = "L_task";
	static GROUP_SHOP = "M_shop";
	static GROUP_RECORD = "N_record";
	static GROUP_WORK = "O_work";
	//各模块数据打点


	// -----------------------------------------------------视频相关end----------------------------------------------------

	// -----------------------------------------------------分享相关----------------------------------------------------



	// -----------------------------------------------------分享相关end-----------------------------------

	//-------------------------------------------------引导---------------------------------------------------
	static GUIDE_10004 = {groupId: StatisticsManager.GROUP_GUIDE, sortId: 18, name: "guide_unforced_10004"}//前往下一章引导
	static FOG_NEXTLEVEL = {groupId: StatisticsManager.GROUP_FOG, sortId: 5, name: "fog_nextLevel"}//迷雾街区进入下一层的人数/次数
	static FOG_EVENT_TRIGGER = {groupId: StatisticsManager.GROUP_FOG, sortId: 6, name: "fog_event_trigger"}//迷雾街区触发事件的人数/次数
	static FOG_EVENT_COMPLETE = {groupId: StatisticsManager.GROUP_FOG, sortId: 7, name: "fog_event_complete"}//迷雾街区完成事件的人数/次数
	static FOG_ITEM_GET = {groupId: StatisticsManager.GROUP_FOG, sortId: 9, name: "fog_item_get"}//迷雾街区大巴车获得局内道具的人数/次数
	static FOG_BATTLE_START = {groupId: StatisticsManager.GROUP_FOG, sortId: 10, name: "fog_battle_start"}//进入战斗的人数/次数


}
