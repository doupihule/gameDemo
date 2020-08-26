import BaseFunc from "../../../framework/func/BaseFunc";
import ShareOrTvManager from "../../../framework/manager/ShareOrTvManager";

export default class ShareTvOrderFunc extends BaseFunc {

	static SHARELINE_DAILYGOLD = 1;//每日钻石
	static SHARELINE_OFFLINE = 2;//离线收益
	static SHARELINE_UNLOCK_ROLE = 3;//视频解锁角色
	static SHARELINE_BATTLE_START = 4;//豪华开局
	static SHARELINE_SUPPLYBOX = 5;//飞行宝箱
	static SHARELINE_SEVENDAY = 6;//七日登录再次领取
	static SHARELINE_UNLOCKROLE_REWARD = 7;//解锁角色奖励
	static SHARELINE_FREE_SP = 8;//免费体力
	static SHARELINE_TURNABLE = 9;//免费转盘
	static SHARELINE_BATTLEWIN = 10;//战斗获胜结算
	static SHARELINE_FREE_COIN = 10;
	static SHARELINE_EVOLUTION_FREE = 11;//免费进化
	static SHARELINE_EVOLUTION_REWARD = 12;//进化奖励
	static SHARELINE_EQUIP_GET = 13;//抽装备
	static SHARELINE_EQUIP_GET_DOUBLE = 14;//抽装备再领一次
	static SHARELINE_FOG_VIDEO_START = 15;//迷雾街区看视频开始
	static SHARELINE_FOG_START_ADDROLE = 16;//迷雾街区,开局增加一名角色
	static SHARELINE_FOG_FREE_ACT = 17;//迷雾街区看视频得行动力
	static SHARELINE_FOG_MULTI_RESULT = 18;//迷雾街区看视频结算翻倍
	static SHARELINE_FOG_OUTER_SHOP_REFRESH = 19;//街区商店看视频刷新
	static SHARELINE_FOG_EVENT_CHOOSE = 20;//迷雾街区二选一奖励事件看视频
	static SHARELINE_FOG_EVENT_BUSINESSMAN = 21;//迷雾街区神秘商人事件看视频
	static SHARELINE_FOG_EVENT_INNERSHOP_REFRESH = 22;//迷雾街区局内商店看视频刷新
	static SHARELINE_FOG_EVENT_REMOVE_OBSTACLE = 23;//迷雾街区障碍物事件看视频移除
	static SHARELINE_FOG_EVENT_MEND_ROAD = 24;//迷雾街区坏掉的路事件看视频修路
	static SHARELINE_FOG_BATTLERESULT_DOUBLE = 25;//迷雾街区战斗胜利翻倍
	static SHARELINE_FOG_BATTLE_START = 26;//心灵鸡汤
	static SHARELINE_CHAPTERBOX_REWARD = 27;//章节宝箱双倍奖励
	static SHARELINE_TASK_DOUBLEREWARD = 28;//任务再领一次
	static SHARELINE_TASK_POINTREWARD = 29;//活跃度宝箱
	static SHARELINE_FOG_BATTLE_ADDROLE = 30;//迷雾街区角色免费上
	static SHARELINE_BATTLEFOG_REVIVE = 31;//迷雾战斗复活
	static SHARELINE_FOG_ANSWER_ALERT = 32;//迷雾街区答题事件提示
	static SHARELINE_BATTLEREVIVE_OVERTIME = 33;//战斗超时复活
	static SHARELINE_BATTLEREVIVE_DEFEAT = 34;//战斗战败复活
	static SHARELINE_BATTLE_USESKILL = 35;//战斗使用技能
	static SHARELINE_BATTLE_TRYROLE = 36;//战斗试用角色
	static SHARELINE_SHOP_REFRESH = 37;//商店刷新
	static SHARELINE_SHOP_BUY = 38;//商店购买
	static SHARELINE_WORK_FRESH = 39;//工作刷新
	static SHARELINE_WORK_GIFTDOUBLE = 39;//礼物再领一次
	static SHARELINE_WORK_FINISH = 40;//加速工作
	static SHARELINE_WORK_COMPANYUP = 41;//公司升级


	static SHARELINE_TALENT_FREE_UPDATE = 11;//天赋免费升级


	private static _instance: ShareTvOrderFunc;

	public static getInstance(): ShareTvOrderFunc {
		if (!this._instance) {
			this._instance = new ShareTvOrderFunc();
		}
		return this._instance;
	}

	public static get instance() {
		if (!this._instance) {
			this._instance = new ShareTvOrderFunc();
		}
		return this._instance;
	}

	getCfgsPathArr() {
		return [
			{name: "ShareTvOrder_json"}
		]
	}

	getOrder(id: number): any {
		// return this.cfg[id];
		return this.getCfgDatas("ShareTvOrder_json", id);
	}

	getOrderInfoById(id1, id2) {
		return this.getCfgDatasByKey("ShareTvOrder_json", id1, id2);
	}

	//把获取image的方法挪到框架里
	getFreeImgSkin(freeType) {
		return ShareOrTvManager.instance.getFreeImgSkin(freeType);
	}

	//获取延时显示文本的时间
	getDelayShowTime(id) {
		var info = this.getCfgDatas("ShareTvOrder_json", id);
		return info.delyTime || 0;
	}
}