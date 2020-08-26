/**迷雾常量 */
export default class FogConst {

	//获取迷雾街区的进入状态:1 功能未开启 2 可以直接进入 3 可以免费进入 4 可以视频进入  5 不可进入
	static FOG_STATUS_NOT_OPEN = 1;
	static FOG_STATUS_ENTER = 2;
	static FOG_STATUS_COST_FREE_COUNT = 3;
	static FOG_STATUS_COST_VIDEO_COUNT = 4;
	static FOG_STATUS_NO_ENTER = 5;
	static FOG_STATUS_COST_FREE_COUNT_LIMIT = 6;


	//FogMultiRewardUI界面类型
	static VIEW_TYPE_ITEM_EXCHANGE = 1;//道具满级折算零件
	static VIEW_TYPE_BOX_REWARD = 2;//宝箱奖励
	static VIEW_TYPE_REWARD_EVENT = 3;//奖励事件

	//迷雾街区商店类型:1 局外商店 2 局内商店
	static FOG_SHOP_TYPE_OUTER = 1;
	static FOG_SHOP_TYPE_INNER = 2;

	//Battle类型
	static VIEW_TYPE_BATTLE_DETAIL = 1;//正常战斗
	static VIEW_TYPE_FOG_ENEMY = 2;//迷雾战斗

	//fog敌人事件中敌人的类型
	static FOG_EVENT_ENEMY_TYPE_PLAYER = 1;//玩家敌人
	static FOG_EVENT_ENEMY_TYPE_NPC = 2;//npc敌人

	/**迷雾格子状态：半开放，可点击，不会加到寻路列表里 */
	static FOG_CELLSTATE_HALFOPEN = 1;
	/**迷雾格子状态：全开放，可点击，会加到寻路列表里 */
	static FOG_CELLSTATE_OPEN = 2;

	/**格子方向：向上 */
	static FOG_CELL_TURNUP = 1;
	/**格子方向：向下 */
	static FOG_CELL_TURNDOWN = 2;
	/**格子方向：向左 */
	static FOG_CELL_TURNLEFT = 3;
	/**格子方向：向右 */
	static FOG_CELL_TURNRIGHT = 4;


	/**格子 */
	static model_Cell = "model_Cell";
	/**汽车 */
	static model_Bus = "model_Bus";


	//npc对话事件中角色显示方向
	static FOG_NPC_ROLE_LEFT = 1;//左侧
	static FOG_NPC_ROLE_RIGHT = 2;//右侧

	//FogTipUI界面类型
	static FOG_VIEW_TYPE_FRONTEVENT = 1;//前置事件不满足提示
	static FOG_VIEW_TYPE_NEXTLAYER = 2;//下一层
	static FOG_VIEW_TYPE_PASS_SUCCESS = 3;//通关
	static FOG_VIEW_TYPE_FINISH_BATTLE = 4;//结束本局
	static FOG_VIEW_TYPE_EXIT_FOG = 5;//退出迷雾
	static FOG_VIEW_TYPE_NOACT = 6; //行动力不足
	static FOG_VIEW_TYPE_DEFEAT = 7; //连续战败

	/**迷雾格子层级：比周围高 */
	static FOG_CELLORDER_HIGH = 1;
	/**迷雾格子层级：比周围低 */
	static FOG_CELLORDER_LOW = 2;

	/**格子类型：出生点 */
	public static cellType_Start = 1;
	/**格子类型：出口点 */
	public static cellType_End = 2;
	/**格子类型：出生点周边绑定点 */
	public static cellType_StartAround = 3;
	/**格子类型：出口点周边绑定点 */
	public static cellType_EndAround = 4;

	//FogNpcTalkUI界面类型
	static VIEW_TYPE_NPC_TACK = 1;//npc对话事件
	static VIEW_TYPE_MAIN_LEVEL = 2;//主线关卡对话

	/**迷雾完成事件数 */
	static FOG_COUNT_EVENTFINISH = 1;
	/**迷雾击败敌人数 */
	static FOG_COUNT_FIGHTENEMY = 2;
	/**迷雾开启格子数 */
	static FOG_COUNT_OPENCELL = 3;
	//迷雾免费行动力视频观看次数
	static fog_free_act_count = 4;
	//迷雾完成事件所得的总积分
	static fog_finish_event_score = 5;
	/**迷雾战斗失败数 */
	static fog_battle_defeat = 6;


}
