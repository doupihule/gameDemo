import UserInfo from "../../../framework/common/UserInfo";
import LogsManager from "../../../framework/manager/LogsManager";
import FileUtils from "../../../framework/utils/FileUtils";
import GameSwitch from "../../../framework/common/GameSwitch";
import StatisticsExtendManager from "../../../framework/manager/StatisticsExtendManager";

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

	private _event_with_switch = {
		// [GameSwitch.SWITCH_DISABLE_BANNER_LOG]: [
		// 	StatisticsManager.GROUP_Video,
		// ],
	};

	setAccount(accountId, level, gameServer, accountType, age, accountName, gender) {
		if (UserInfo.isWeb()) {
			// TalkingData.setAccount(accountId, level, gameServer, accountType, age, accountName, gender)
		}
	}

	/**loading完成 开始玩 打点计时 */
	static onLoadingLog() {
		if (this.isLoadingLog) return;
		if (FileUtils.isUserWXSource()) {
			this.isLoadingLog = true;
			var disT = Laya.Browser.now() - this.mainStartT;
			if (disT > this.loadingOutT) {
				disT -= this.loadingOutT;
			}
			if (disT > 100000) {
				LogsManager.echo("krma. start " + this.mainStartT + " end " + Laya.Browser.now() + " time " + disT + " except " + this.loadingOutT);
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


	//关卡打点
	static LEVEL_START = { groupId: StatisticsManager.GROUP_Level, sortId: 1, name: "level_start" };  // 进入关卡的人数/次数
	static LEVEL_VICTORY = { groupId: StatisticsManager.GROUP_Level, sortId: 2, name: "level_victory" };  // 游戏关卡胜利的人数/次数
	static LEVEL_FAIL = { groupId: StatisticsManager.GROUP_Level, sortId: 3, name: "level_fail" };  // 游戏关卡失败的人数/次数

	//英雄
	static HERO_OPEN = { groupId: StatisticsManager.GROUP_Hero, sortId: 1, name: "hero_openId" };  // 英雄解锁
	static HERO_LEVEL = { groupId: StatisticsManager.GROUP_Hero, sortId: 2, name: "hero_level" };  // 英雄升级
	static HERO_EVOLUTION = { groupId: StatisticsManager.GROUP_Hero, sortId: 3, name: "hero_evolution" };  // 英雄进化


	// -----------------------------------------------------视频相关----------------------------------------------------	
	static SHOWTV_PLANTSUCEEDNUB = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 1, name: "showTv_LuckyRewardNub_finish" }//幸运转盘看视频成功
	static SHOWTV_PLANT_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 1.1, name: "showTv_LuckyRewardNub_show" }//幸运转盘视频展示
	static SHOWTV_PLANT_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 1.2, name: "showTv_LuckyRewardNub_click" }//幸运转盘抽奖点击

	static SHOWTV_BATTLEVICTORY_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 2, name: "showTv_BattleVictory_finish" }//战斗结束视频翻倍成功
	static SHOWTV_BATTLEVICTORY_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 2.1, name: "showTv_BattleVictory_show" }//战斗结束视频翻倍展示
	static SHOWTV_BATTLEVICTORY_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 2.2, name: "showTv_BattleVictory_click" }//战斗结束视频翻倍点击

	static SHOWTV_NOPOWERSUCEEDNUB = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 3, name: "showTv_PowerRecovery_finish" }//体力不足时视频加体力次数
	static SHOWTV_NOPOWER_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 3.1, name: "showTv_PowerRecovery_show" }//体力不足时视频加体力次数
	static SHOWTV_NOPOWER_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 3.2, name: "showTv_PowerRecovery_click" }//体力不足时视频加体力次数


	static SHOWTV_FREEGOLD_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 4, name: "showTv_freeGold_finish" }//每日金币看视频播放完成次数/人数
	static SHOWTV_FREEGOLD_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 4.1, name: "showTv_freeGold_show" }//每日金币看视频战刺次数/人数
	static SHOWTV_FREEGOLD_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 5.2, name: "showTv_freeGold_click" }//每日金币看视频点击次数/人数

	static SHOWTV_OFFLINECOIN_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 5, name: "showTv_offlineCoin_finish" }//离线翻倍看视频播放完成次数/人数
	static SHOWTV_OFFLINECOIN_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 5.1, name: "showTv_offlineCoin_show" }//离线翻倍看视频战刺次数/人数
	static SHOWTV_OFFLINECOIN_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 5.2, name: "showTv_offlineCoin_click" }//离线翻倍看视频点击次数/人数

	static SHOWTV_UNLOCKROLE_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 6, name: "showTv_unlockRole_finish" }//解锁角色看视频播放完成次数/人数
	static SHOWTV_UNLOCKROLE_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 6.1, name: "showTv_unlockRole_show" }//解锁角色看视频战刺次数/人数
	static SHOWTV_UNLOCKROLE_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 6.2, name: "showTv_unlockRole_click" }//解锁角色看视频点击次数/人数

	static SHOWTV_BATTLEADDTION_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 7, name: "showTv_battleAddtion_finish" }//豪华开局看视频播放完成次数/人数
	static SHOWTV_BATTLEADDTION_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 7.1, name: "showTv_battleAddtion_show" }//豪华开局看视频战刺次数/人数
	static SHOWTV_BATTLEADDTION_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 7.2, name: "showTv_battleAddtion_click" }//豪华开局看视频点击次数/人数

	static SHOWTV_FLYBOX_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 8, name: "showTv_flyBox_finish" }//飞行宝箱看视频播放完成次数/人数
	static SHOWTV_FLYBOX_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 8.1, name: "showTv_flyBox_show" }//飞行宝箱看视频战刺次数/人数
	static SHOWTV_FLYBOX_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 8.2, name: "showTv_flyBox_click" }//飞行宝箱看视频点击次数/人数

	static SHOWTV_SEVENDAY_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 9, name: "showTv_sevenDay_finish" }//七日登录看视频播放完成次数/人数
	static SHOWTV_SEVENDAY_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 9.1, name: "showTv_sevenDay_show" }//七日登录看视频战刺次数/人数
	static SHOWTV_SEVENDAY_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 9.2, name: "showTv_sevenDay_click" }//七日登录看视频点击次数/人数

	static SHOWTV_UNLOCKROLEREWARD_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 10, name: "showTv_unlockRoleReward_finish" }//解锁角色奖励看视频播放完成次数/人数
	static SHOWTV_UNLOCKROLEREWARD_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 10.1, name: "showTv_unlockRoleReward_show" }//解锁角色奖励看视频战刺次数/人数
	static SHOWTV_UNLOCKROLEREWARD_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 10.2, name: "showTv_unlockRoleReward_click" }//解锁角色奖励看视频点击次数/人数

	static SHOWTV_ROLEEVO_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 11, name: "showTv_roleEvolution_finish" }//角色进化看视频成功次数/人数
	static SHOWTV_ROLEEVO_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 11.1, name: "showTv_roleEvolution_show" }
	static SHOWTV_ROLEEVO_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 11.2, name: "showTv_roleEvolution_click" }

	static SHOWTV_VIDEOPIECE_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 12, name: "showTv_videoLottery_finish" }//视频抽装备看视频播放完成次数
	static SHOWTV_VIDEOPIECE_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 12.1, name: "showTv_videoLottery_show" }//视频抽装备看视频展示次数
	static SHOWTV_VIDEOPIECE_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 12.2, name: "showTv_videoLottery_click" }//视频抽装备看视频点击次数

	static SHOWTV_ROLEVOREWARD_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 13, name: "showTv_evolutionRoleReward_finish" }//角色进化奖励看视频播放完成次数
	static SHOWTV_ROLEVOREWARD_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 13.1, name: "showTv_evolutionRoleReward_show" }//角色进化奖励看视频展示次数
	static SHOWTV_ROLEVOREWARD_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 13.2, name: "showTv_evolutionRoleReward_click" }//角色进化奖励看视频点击次数

	static SHOWTV_VIDEOPIECE_REWARD_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 14, name: "showTv_videoLotteryReward_finish" }//抽碎片双倍
	static SHOWTV_VIDEOPIECE_REWARD_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 14.1, name: "showTv_videoLotteryReward_show" }//抽碎片双倍
	static SHOWTV_VIDEOPIECE_REWARD_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 14.2, name: "showTv_videoLotteryReward_click" }//抽碎片双倍


	static SHOWTV_FOG_STARTROLE_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 15, name: "showTv_fog_startRole_finish" }//迷雾街区获得额外初始角色-视频播放完成次数/人数
	static SHOWTV_FOG_STARTROLE_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 15.1, name: "showTv_fog_startRole_show" }//迷雾街区获得额外初始角色-展示次数/人数
	static SHOWTV_FOG_STARTROLE_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 15.2, name: "showTv_fog_startRole_click" }//迷雾街区获得额外初始角色-点击次数/人数


	static SHOWTV_FOG_MOBILITYRECOVERY_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 16, name: "showTv_fog_mobilityRecovery_finish" }//迷雾街区恢复行动力看视频播放完成次数/人数
	static SHOWTV_FOG_MOBILITYRECOVERY_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 16.1, name: "showTv_fog_mobilityRecovery_show" }//迷雾街区恢复行动力看视频展示次数/人数
	static SHOWTV_FOG_MOBILITYRECOVERY_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 16.2, name: "showTv_fog_mobilityRecovery_click" }//迷雾街区恢复行动力看视频点击次数/人数

	static SHOWTV_FOG_SETTLEMANT_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 17, name: "showTv_fog_settlement_finish" }//迷雾街区结算翻倍看视频播放完成次数/人数
	static SHOWTV_FOG_SETTLEMANT_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 17.1, name: "showTv_fog_settlement_show" }//迷雾街区结算翻倍看视频展示次数/人数
	static SHOWTV_FOG_SETTLEMANT_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 17.2, name: "showTv_fog_settlement_click" }//迷雾街区结算翻倍看视频点击次数/人数


	static SHOWTV_FOG_SHOPREFRESH_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 18, name: "showTv_fog_shopRefresh_finish" }//迷雾街区商店刷新看视频播放完成次数/人数
	static SHOWTV_FOG_SHOPREFRESH_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 18.1, name: "showTv_fog_shopRefresh_show" }//迷雾街区商店刷新看视频展示次数/人数
	static SHOWTV_FOG_SHOPREFRESH_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 18.2, name: "showTv_fog_shopRefresh_click" }//迷雾街区商店刷新看视频点击次数/人数



	static SHOWTV_FOG_CHOOSE_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 19, name: "showTv_fog_choose_finish" }//迷雾街区2选1奖励看视频播放完成次数/人数
	static SHOWTV_FOG_CHOOSE_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 19.1, name: "showTv_fog_choose_show" }//迷雾街区2选1奖励看视频展示次数/人数
	static SHOWTV_FOG_CHOOSE_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 19.2, name: "showTv_fog_choose_click" }//迷雾街区2选1奖励看视频点击次数/人数

	static SHOWTV_FOG_BROKENROAD_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 20, name: "showTv_fog_brokenRoad_finish" }//迷雾街区坏路事件看视频播放完成次数/人数
	static SHOWTV_FOG_BROKENROAD_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 20.1, name: "showTv_fog_brokenRoad_show" }//迷雾街区坏路事件看视频展示次数/人数
	static SHOWTV_FOG_BROKENROAD_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 20.2, name: "showTv_fog_brokenRoad_click" }//迷雾街区坏路事件看视频点击次数/人数

	static SHOWTV_FOG_BATTLE_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 21, name: "showTv_fog_battle_finish" }//迷雾街区战斗胜利翻倍看视频播放完成次数/人数
	static SHOWTV_FOG_BATTLE_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 21.1, name: "showTv_fog_battle_show" }//迷雾街区战斗胜利翻倍看视频展示次数/人数
	static SHOWTV_FOG_BATTLE_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 21.2, name: "showTv_fog_battle_click" }//迷雾街区战斗胜利翻倍看视频点击次数/人数

	static SHOWTV_FOG_REMOVEBLOCK_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 22, name: "showTv_fog_removeBlock_finish" }//迷雾街区移除障碍物事件看视频播放完成次数/人数
	static SHOWTV_FOG_REMOVEBLOCK_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 22.1, name: "showTv_fog_removeBlock_show" }//迷雾街区移除障碍物事件看视频展示次数/人数
	static SHOWTV_FOG_REMOVEBLOCK_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 22.2, name: "showTv_fog_removeBlock_click" }//迷雾街区移除障碍物事件看视频点击次数/人数

	static SHOWTV_FOG_START_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 23, name: "showTv_fog_start_finish" }//迷雾街区看视频开始播放完成次数/人数
	static SHOWTV_FOG_START_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 23.1, name: "showTv_fog_start_show" }//迷雾街区看视频开始展示次数/人数
	static SHOWTV_FOG_START_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 23.2, name: "showTv_fog_start_click" }//迷雾街区看视频开始点击次数/人数

	static SHOWTV_FOG_JITANG_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 24, name: "showTv_fog_jitang_finish" }//迷雾街区心灵鸡汤视频播放完成次数/人数
	static SHOWTV_FOG_JITANG_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 24, name: "showTv_fog_jitang_show" }//迷雾街区心灵鸡汤视频展示次数/人数
	static SHOWTV_FOG_JITANG_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 24, name: "showTv_fog_jitang_click" }//迷雾街区心灵鸡汤视频点击次数/人数


	static SHOWTV_CHAPTERBOX_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 25, name: "showTv_chapterbox_finish" }//章节宝箱视频播放完成次数/人数
	static SHOWTV_CHAPTERBOX_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 25.1, name: "showTv_chapterbox_show" }//章节宝箱视频展示次数/人数
	static SHOWTV_CHAPTERBOX_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 25.2, name: "showTv_chapterbox_click" }//章节宝箱视频点击次数/人数

	static SHOWTV_TASKREWARD_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 26, name: "showTv_taskreward_finish" }//任务奖励视频播放完成次数/人数
	static SHOWTV_TASKREWARD_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 26.1, name: "showTv_taskreward_show" }//任务奖励视频展示次数/人数
	static SHOWTV_TASKREWARD_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 26.2, name: "showTv_taskreward_click" }//任务奖励视频点击次数/人数

	static SHOWTV_TASKBOX_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 27, name: "showTv_taskbox_finish" }//活跃度宝箱视频播放完成次数/人数
	static SHOWTV_TASKBOX_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 27.1, name: "showTv_taskbox_show" }//活跃度宝箱视频展示次数/人数
	static SHOWTV_TASKBOX_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 27.2, name: "showTv_taskbox_click" }//活跃度宝箱视频点击次数/人数


	static SHOWTV_FOG_RANDROLE_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 28, name: "showTv_fog_randRole_finish" }//迷雾街区战斗中随机获得角色视频播放完成次数/人数
	static SHOWTV_FOG_RANDROLE_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 28.1, name: "showTv_fog_randRole_show" }//迷雾街区战斗中随机获得角色展示次数/人数
	static SHOWTV_FOG_RANDROLE_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 28.2, name: "showTv_fog_randRole_click" }//迷雾街区战斗中随机获得角色点击次数/人数

	static SHOWTV_FOG_REVIVE_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 29, name: "showTv_fog_resurrection_finish" }//迷雾街区战败复活视频播放完成次数/人数
	static SHOWTV_FOG_REVIVE_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 29.1, name: "showTv_fog_resurrection_show" }//迷雾街区战败复活视频展示次数/人数
	static SHOWTV_FOG_REVIVE_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 29.2, name: "showTv_fog_resurrection_click" }//迷雾街区战败复活视频点击次数/人数

	static SHOWTV_FOG_QUESTION_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 30, name: "showTv_fog_question_finish" }//迷雾街区答题事件视频播放完成次数/人数
	static SHOWTV_FOG_QUESTION_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 30.1, name: "showTv_fog_question_show" }//迷雾街区答题事件视频展示次数/人数
	static SHOWTV_FOG_QUESTION_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 30.2, name: "showTv_fog_question_click" }//迷雾街区答题事件视频点击次数/人数

	static SHOWTV_LEVELOVERTIME_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 31, name: "showTv_levelOvertime_finish" }//关卡超时复活视频播放完成次数/人数
	static SHOWTV_LEVELOVERTIME_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 31.1, name: "showTv_levelOvertime_show" }//关卡超时复活视频展示次数/人数
	static SHOWTV_LEVELOVERTIME_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 31.2, name: "showTv_levelOvertime_click" }//关卡超时复活视频点击次数/人数

	static SHOWTV_LEVELFAIL_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 32, name: "showTv_levelFail_finish" }//关卡战败复活视频播放完成次数/人数
	static SHOWTV_LEVELFAIL_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 32.1, name: "showTv_levelFail_show" }//关卡战败复活视频展示次数/人数
	static SHOWTV_LEVELFAIL_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 32.2, name: "showTv_levelFail_click" }//关卡战败复活视频点击次数/人数

	static SHOWTV_LEVELSKILL_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 33, name: "showTv_levelSkill_finish" }//关卡技能释放视频播放完成次数/人数
	static SHOWTV_LEVELSKILL_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 33.1, name: "showTv_levelSkill_show" }//关卡技能释放视频播放展示次数/人数
	static SHOWTV_LEVELSKILL_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 33.2, name: "showTv_levelSkill_click" }//关卡技能释放视频播放点击次数/人数

	static SHOWTV_ROLETRY_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 34, name: "showTv_roleTry_finish" }//关卡试用角色/人数
	static SHOWTV_ROLETRY_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 34.1, name: "showTv_roleTry_show" }//关卡试用角色/人数
	static SHOWTV_ROLETRY_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 34.2, name: "showTv_roleTry_click" }//关卡试用角色/人数

	static SHOWTV_SHOPREFRESH_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 35, name: "showTv_shopRefresh_finish" }//商店刷新视频播放完成次数/人数
	static SHOWTV_SHOPREFRESH_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 35.1, name: "showTv_shopRefresh_show" }//商店刷新视频展示次数/人数
	static SHOWTV_SHOPREFRESH_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 35.2, name: "showTv_shopRefresh_click" }//商店刷新视频点击次数/人数

	static SHOWTV_SHOPVIDEOBUY_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 36, name: "showTv_shopVideoBuy_finish" }//商店视频购买完成次数/人数
	static SHOWTV_SHOPVIDEOBUY_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 36.1, name: "showTv_shopVideoBuy_show" }//商店视频购买展示次数/人数
	static SHOWTV_SHOPVIDEOBUY_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 36.2, name: "showTv_shopVideoBuy_click" }//商店视频购买点击次数/人数

	static SHOWTV_WORKFRESH_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 37, name: "showTv_workRefresh_finish" }//工作刷新视频完成次数/人数
	static SHOWTV_WORKFRESH_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 37.1, name: "showTv_workRefresh_show" }//工作刷新视频展示次数/人数
	static SHOWTV_WORKFRESH_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 37.2, name: "showTv_workRefresh_click" }//工作刷新视频点击次数/人数

	static SHOWTV_WORKQUICK_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 38, name: "showTv_workQuickComplete_finish" }//工作快速完成视频完成次数/人数
	static SHOWTV_WORKQUICK_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 38.1, name: "showTv_workQuickComplete_show" }//工作快速完成视频展示次数/人数
	static SHOWTV_WORKQUICK_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 38.2, name: "showTv_workQuickComplete_click" }//工作快速完成视频点击次数/人数

	static SHOWTV_COMPANYUP_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 39, name: "showTv_companyUpdate_finish" }//工作快速完成视频完成次数/人数
	static SHOWTV_COMPANYUP_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 39.1, name: "showTv_companyUpdate_show" }//公司升级视频展示次数/人数
	static SHOWTV_COMPANYUP_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 39.2, name: "showTv_companyUpdate_click" }//公司升级视频点击次数/人数

	static SHOWTV_GIFTDOUBLE_FINISH = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 40, name: "showTv_giftDouble_finish" }//礼物翻倍视频完成次数/人数
	static SHOWTV_GIFTDOUBLE_SHOW = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 40.1, name: "showTv_giftDouble_show" }//礼物翻倍视频展示次数/人数
	static SHOWTV_GIFTDOUBLE_CLICK = { groupId: StatisticsManager.GROUP_ShowTv, sortId: 40.2, name: "showTv_giftDouble_click" }//礼物翻倍视频点击次数/人数


	// -----------------------------------------------------视频相关end----------------------------------------------------

	// -----------------------------------------------------分享相关----------------------------------------------------
	static SHARE_TURNTABLE_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 1, name: "share_LuckyRewardNub_finish" }//抽奖分享成功
	static SHARE_SETTLEMENT_CLICKSUCCESS = { groupId: StatisticsManager.GROUP_Share, sortId: 2, name: "share_BattleVictory_finish" }//结算翻倍点击分享按钮并成功分享的总用户数/次数
	static SHARE_POWERRECOVERY_CLICKSUCCESS = { groupId: StatisticsManager.GROUP_Share, sortId: 3, name: "share_PowerRecovery_finish" }//体力恢复展示分享按钮的总用户数/次数


	static SHARE_FREEGOLD_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 4, name: "share_freeGold_finish" }//每日金币分享完成次数/人数
	static SHARE_OFFLINECOIN_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 5, name: "share_offlineCoin_finish" }//离线翻倍分享完成次数/人数
	static SHARE_UNLOCKROLE_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 6, name: "share_unlockRole_finish" }//解锁角色分享完成次数/人数
	static SHARE_BATTLEADDTION_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 7, name: "share_battleAddtion_finish" }//豪华开局分享完成次数/人数
	static SHARE_FLYBOX_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 8, name: "share_flyBox_finish" }//飞行宝箱分享完成次数/人数
	static SHARE_SEVENDAY_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 9, name: "share_sevenDay_finish" }//七日登录分享完成次数/人数
	static SHARE_UNLOCKROLEREWARD_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 10, name: "share_unlockRoleReward_finish" }//解锁角色奖励分享完成次数/人数
	static SHARE_FRIEND_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 11, name: "share_friend_finish" }//邀请好友分享完成次数/人数
	static SHARE_FRIEND_REWARD = { groupId: StatisticsManager.GROUP_Share, sortId: 11.1, name: "share_friend_reward" }//邀请好友领奖的次数/人数
	static SHARE_CLICKCARD = { groupId: StatisticsManager.GROUP_Share, sortId: 100, name: "share_clickCard" }//点击分享卡片进入游戏的玩家次数/人数
	static SHARE_ROLEEVO_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 12, name: "share_roleEvolution_finish" }//角色进化分享完成次数
	static SHARE_VIDEOPIECE_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 13, name: "share_videoLottery_finish" }//视频抽装备分享完成次数
	static SHARE_ROLEEVOREWARD_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 14, name: "share_evolutionRoleReward_finish" }//角色进化奖励分享完成次数
	static SHARE_VIDEOPIECE_REWARD_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 15, name: "share_videoLotteryReward_finish" }//抽碎片双倍


	static SHARE_FOG_STARTROLE_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 16, name: "share_fog_startRole_finish" }//迷雾街区获得额外初始角色-分享完成次数/人数
	static SHARE_FOG_MOBILITYRECOVERY_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 17, name: "share_fog_mobilityRecovery_finish" }//迷雾街区恢复行动力分享完成次数/人数
	static SHARE_FOG_SETTLEMENT_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 18, name: "share_fog_settlement_finish" }//迷雾街区结算翻倍分享完成次数/人数
	static SHARE_FOG_SHOPREFRESH_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 19, name: "share_fog_shopRefresh_finish" }//迷雾街区商店刷新分享完成次数/人数
	static SHARE_FOG_CHOOSE_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 20, name: "share_fog_choose_finish" }//迷雾街区2选1奖励分享完成次数/人数
	static SHARE_FOG_BROKENROAD_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 21, name: "share_fog_brokenRoad_finish" }//迷雾街区坏路事件分享完成次数/人数
	static SHARE_FOG_BATTLE_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 22, name: "share_fog_battle_finish" }//迷雾街区战斗胜利翻倍分享完成次数/人数
	static SHARE_FOG_REMOVEBLOCK_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 23, name: "share_fog_removeBlock_finish" }//迷雾街区移除障碍物事件分享完成次数/人数
	static SHARE_FOG_START_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 24, name: "share_fog_start_finish" }//迷雾街区分享开始的完成次数/人数
	static SHARE_FOG_JITANG_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 25, name: "share_fog_jitang_finish" }//迷雾街区心灵鸡汤分享完成次数/人数


	static SHARE_CHAPTERBOX_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 26, name: "share_chapterbox_finish" }//章节宝箱分享完成次数/人数
	static SHARE_TASKREWARD_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 27, name: "share_taskreward_finish" }//任务奖励分享完成次数/人数
	static SHARE_TASKBOX_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 28, name: "share_taskbox_finish" }//活跃度宝箱分享完成次数/人数


	static SHARE_FOG_RANDROLE_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 29, name: "share_fog_randRole_finish" }//迷雾街区战斗中随机获得角色分享完成次数/人数
	static SHARE_FOG_REVIVE_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 30, name: "share_fog_resurrection_finish" }//迷雾街区战败复活分享完成次数/人数
	static SHARE_FOG_QUESTION_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 31, name: "share_fog_question_finish" }//迷雾街区答题事件分享完成次数/人数


	static SHARE_LEVELOVERTIME_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 32, name: "share_levelOvertime_finish" }//关卡超时复活分享完成次数/人数
	static SHARE_LEVELFAIL_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 33, name: "share_levelFail_finish" }//关卡战败复活分享完成次数/人数
	static SHARE_LEVELSKILL_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 34, name: "share_levelSkill_finish" }//关卡技能释放分享完成次数/人数
	static SHARE_ROLETRY_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 35, name: "share_roleTry_finish" }//关卡技能释放分享完成次数/人数
	static SHARE_SHOPFRESH_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 36, name: "share_shopRefresh_finish" }//商店刷新分享完成次数/人数
	static SHARE_SHOPVIDEOBUY_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 37, name: "share_shopVideoBuy_finish" }//商店视频购买完成次数/人数

	static SHARE_WORKFRESH_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 38, name: "share_workRefresh_finish" }//工作刷新分享完成次数/人数
	static SHARE_WORKQUICK_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 39, name: "share_workQuickComplete_finish" }//工作快速完成分享完成次数/人数
	static SHARE_COMPANYUP_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 40, name: "share_companyUpdate_finish" }//公司升级分享完成次数/人数
	static SHARE_GIFTDOUBLE_FINISH = { groupId: StatisticsManager.GROUP_Share, sortId: 41, name: "share_giftDouble_finish" }//礼物翻倍分享完成次数/人数
	

	// -----------------------------------------------------分享相关end-----------------------------------

	//-------------------------------------------------引导---------------------------------------------------
	static GUIDE_1_1 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 1, name: "guide_forced_1_1" }
	static GUIDE_1_2 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 2, name: "guide_forced_1_2" }
	static GUIDE_1_3 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 3, name: "guide_forced_1_3" }
	static GUIDE_1_4 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 4, name: "guide_forced_1_4" }
	static GUIDE_1_5 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 5, name: "guide_forced_1_5" }
	static GUIDE_1_6 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 6, name: "guide_forced_1_6" }
	static GUIDE_1_7 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 7, name: "guide_forced_1_7" }
	static GUIDE_1_8 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 7.1, name: "guide_forced_1_8" }
	static GUIDE_1_9 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 7.2, name: "guide_forced_1_9" }
	static GUIDE_2_1 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 8, name: "guide_forced_2_1" }
	static GUIDE_2_2 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 9, name: "guide_forced_2_2" }
	static GUIDE_2_3 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 10, name: "guide_forced_2_3" }
	static GUIDE_2_4 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 11, name: "guide_forced_2_4" }
	static GUIDE_2_5 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 11.1, name: "guide_forced_2_5" }
	static GUIDE_2_6 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 11.2, name: "guide_forced_2_6" }
	static GUIDE_2_7 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 11.3, name: "guide_forced_2_7" }
	static GUIDE_3_1 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 12, name: "guide_forced_3_1" }
	static GUIDE_3_2 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13, name: "guide_forced_3_2" }
	static GUIDE_4_1 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.1, name: "guide_forced_4_1" }
	static GUIDE_4_2 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.2, name: "guide_forced_4_2" }
	static GUIDE_4_3 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.3, name: "guide_forced_4_3" }
	static GUIDE_4_4 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.4, name: "guide_forced_4_4" }
	static GUIDE_4_5 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.5, name: "guide_forced_4_5" }
	static GUIDE_4_6 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.6, name: "guide_forced_4_6" }
	static GUIDE_4_7 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.7, name: "guide_forced_4_7" }
	static GUIDE_4_8 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.8, name: "guide_forced_4_8" }
	static GUIDE_4_9 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.9, name: "guide_forced_4_9" }
	static GUIDE_5_1 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.901, name: "guide_forced_5_1" }
	static GUIDE_6_1 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.902, name: "guide_forced_6_1" }
	static GUIDE_6_2 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.903, name: "guide_forced_6_2" }
	static GUIDE_6_3 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.904, name: "guide_forced_6_3" }
	static GUIDE_7_1 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.905, name: "guide_forced_7_1" }
	static GUIDE_7_2 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.906, name: "guide_forced_7_2" }
	static GUIDE_8_1 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.907, name: "guide_forced_8_1" }
	static GUIDE_8_2 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.908, name: "guide_forced_8_2" }
	static GUIDE_8_3 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.909, name: "guide_forced_8_3" }
	static GUIDE_9_1 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.91, name: "guide_forced_9_1" }
	static GUIDE_9_2 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.911, name: "guide_forced_9_2" }
	static GUIDE_10_1 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.912, name: "guide_forced_10_1" }
	static GUIDE_10_2 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.913, name: "guide_forced_10_2" }
	static GUIDE_10_3 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.914, name: "guide_forced_10_3" }
	static GUIDE_10_4 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.915, name: "guide_forced_10_4" }
	static GUIDE_11_1 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.916, name: "guide_forced_11_1" }
	static GUIDE_11_2 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.917, name: "guide_forced_11_2" }
	static GUIDE_11_3 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.918, name: "guide_forced_11_3" }
	static GUIDE_12_1 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.919, name: "guide_forced_12_1" }
	static GUIDE_13_1 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 13.92, name: "guide_forced_13_1" }


	static GUIDE_0_1 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 0.1, name: "guide_forced_0_1" }//开场漫画图1触发
	static GUIDE_0_2 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 0.2, name: "guide_forced_0_2" }//开场漫画图2触发
	static GUIDE_0_3 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 0.3, name: "guide_forced_0_3" }//开场漫画图3触发
	static GUIDE_0_4 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 0.4, name: "guide_forced_0_4" }//开场漫画图4触发

	static GUIDE_10002 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 16, name: "guide_unforced_10002" }//任务跳转引导
	static GUIDE_10003 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 17, name: "guide_unforced_10003" }//任务触发弱引导
	static GUIDE_10004 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 18, name: "guide_unforced_10004" }//前往下一章引导
	static GUIDE_10005 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 19, name: "guide_unforced_10005" }//进入关卡引导
	static GUIDE_10006 = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 20, name: "guide_unforced_10006" }//进入章节引导

	static GUIDE_FINISH = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 14, name: "guide_forced_doAll" }
	static GUIDE_UNLOCKROLE = { groupId: StatisticsManager.GROUP_GUIDE, sortId: 15, name: "guide_unforced_10001" }

	//-------------------------------------------------引导end---------------------------------------------------
	static EQUIP_OPEN = { groupId: StatisticsManager.GROUP_EQUIP, sortId: 1, name: "equip_open" }//打开合成装备
	static EQUIP_COMPOSE = { groupId: StatisticsManager.GROUP_EQUIP, sortId: 2, name: "equip_compose" }//合成装备

	static PIECE_OPEN = { groupId: StatisticsManager.GROUP_LOTTERY, sortId: 1, name: "lottery_open" }//抽奖界面打开人数
	static PIECE_FREE = { groupId: StatisticsManager.GROUP_LOTTERY, sortId: 2, name: "lottery_free" }//免费抽奖的人数
	static PIECE_GOLD = { groupId: StatisticsManager.GROUP_LOTTERY, sortId: 3, name: "lottery_gold" }//钻石抽奖的人数



	static FOG_START = { groupId: StatisticsManager.GROUP_FOG, sortId: 1, name: "fog_start" }//迷雾街区开始一局的人数/次数
	static FOG_END = { groupId: StatisticsManager.GROUP_FOG, sortId: 2, name: "fog_end" }//迷雾街区结束一局的人数/次数
	static FOG_LEAVE = { groupId: StatisticsManager.GROUP_FOG, sortId: 3, name: "fog_leave" }//迷雾街区暂离的人数/次数
	static FOG_ENTER = { groupId: StatisticsManager.GROUP_FOG, sortId: 4, name: "fog_enter" }//迷雾街区暂离后进入的人数/次数
	static FOG_NEXTLEVEL = { groupId: StatisticsManager.GROUP_FOG, sortId: 5, name: "fog_nextLevel" }//迷雾街区进入下一层的人数/次数
	static FOG_EVENT_TRIGGER = { groupId: StatisticsManager.GROUP_FOG, sortId: 6, name: "fog_event_trigger" }//迷雾街区触发事件的人数/次数
	static FOG_EVENT_COMPLETE = { groupId: StatisticsManager.GROUP_FOG, sortId: 7, name: "fog_event_complete" }//迷雾街区完成事件的人数/次数
	static FOG_BUS_UPGRADE = { groupId: StatisticsManager.GROUP_FOG, sortId: 8, name: "fog_bus_upGrade" }//迷雾街区大巴车升级的人数/次数
	static FOG_ITEM_GET = { groupId: StatisticsManager.GROUP_FOG, sortId: 9, name: "fog_item_get" }//迷雾街区大巴车获得局内道具的人数/次数
	static FOG_BATTLE_START = { groupId: StatisticsManager.GROUP_FOG, sortId: 10, name: "fog_battle_start" }//进入战斗的人数/次数
	static FOG_BATTLE_VICTORY = { groupId: StatisticsManager.GROUP_FOG, sortId: 11, name: "fog_battle_victory" }//关卡胜利的人数/次数
	static FOG_BATTLE_FAIL = { groupId: StatisticsManager.GROUP_FOG, sortId: 12, name: "fog_battle_fail" }//关卡失败的人数/次数
	static FOG_SHOP_OPEN = { groupId: StatisticsManager.GROUP_FOG, sortId: 13, name: "fog_shop_open" }//局外商店打开的人数/次数
	static FOG_SHOP_BUY = { groupId: StatisticsManager.GROUP_FOG, sortId: 14, name: "fog_shop_buy" }//局外商店购买的人数/次数
	static FOG_JITANG_USE = { groupId: StatisticsManager.GROUP_FOG, sortId: 15, name: "fog_jitang_use" }//消耗道具心灵鸡汤的人数/次数


	static TASK_OPEN = { groupId: StatisticsManager.GROUP_TASK, sortId: 1, name: "task_open" }//打开任务界面的人数/次数
	static TASKDAILY_OPEN = { groupId: StatisticsManager.GROUP_TASK, sortId: 2, name: "taskdaily_open" }//打开每日任务界面的人数/次数
	static TASK_START = { groupId: StatisticsManager.GROUP_TASK, sortId: 3, name: "task_start" }//触发任务的人数/次数
	static TASK_COMPLETE = { groupId: StatisticsManager.GROUP_TASK, sortId: 4, name: "task_complete" }//完成任务的人数/次数
	static TASK_GETREWARD = { groupId: StatisticsManager.GROUP_TASK, sortId: 5, name: "task_getreward" }//领取任务奖励的人数/次数


	static SHOP_OPEN = { groupId: StatisticsManager.GROUP_SHOP, sortId: 1, name: "shop_open" }//打开商店界面的人数/次数
	static SHOP_BUY = { groupId: StatisticsManager.GROUP_SHOP, sortId: 2, name: "shop_buy" }//购买商品的人数/次数

	static RECORD_LEVEL_FINISH = { groupId: StatisticsManager.GROUP_RECORD, sortId: 1, name: "record_level_finish" }//主线关卡录屏分享完成次数/次数
	static RECORD_LEVEL_SHOW = { groupId: StatisticsManager.GROUP_RECORD, sortId: 1.1, name: "record_level_show" }//主线关卡录屏展示完成次数/次数
	static RECORD_LEVEL_CLICK = { groupId: StatisticsManager.GROUP_RECORD, sortId: 1.2, name: "record_level_click" }//主线关卡录屏点击完成次数/次数
	static RECORD_FOG_FINISH = { groupId: StatisticsManager.GROUP_RECORD, sortId: 2, name: "record_fog_finish" }//迷雾战斗录屏分享完成次数/次数
	static RECORD_FOG_SHOW = { groupId: StatisticsManager.GROUP_RECORD, sortId: 2.1, name: "record_fog_show" }//迷雾战斗录屏展示完成次数/次数
	static RECORD_FOG_CLICK = { groupId: StatisticsManager.GROUP_RECORD, sortId: 2.2, name: "record_fog_click" }//迷雾战斗录屏点击完成次数/次数

	static WORK_OPEN = { groupId: StatisticsManager.GROUP_WORK, sortId: 1, name: "work_open" }//打开工作界面的人数/次数
	static WORK_START = { groupId: StatisticsManager.GROUP_WORK, sortId: 2, name: "work_start" }//开始工作的人数/次数
	static WORK_END = { groupId: StatisticsManager.GROUP_WORK, sortId: 3, name: "work_end" }//完成工作并领奖的人数/次数
	static WORK_GOLDQUICK = { groupId: StatisticsManager.GROUP_WORK, sortId: 4, name: "work_quickComplete" }//花费钻石立即完成的人数/次数
	static COMPANYUP_OPEN = { groupId: StatisticsManager.GROUP_WORK, sortId: 5, name: "company_update_open" }//公司升级界面打开的人数/次数
	static COMPANYUP_SUCC = { groupId: StatisticsManager.GROUP_WORK, sortId: 6, name: "company_update_success" }//升级公司的人数/次数

	
}
