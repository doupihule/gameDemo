export default class JumpConst {
	static MAIN_SIDE = "主界面侧边栏";
	static MAIN_BOTTOM = "主界面底部栏";
	static RESULT_MIDDLE = "结算界面中间";
	static Format_TOP = "布阵界面上面";
	static JUMPLIST = "抽屉界面";
	static BATTLE_SIDE = "战斗界面侧边栏";
	static BATTLE_DETAIL_BOTTOM = "战斗详情界面底部";
	static RESULT_BOTTOM = "结算界面底部";


	//跳转类型 1 抽屉 2 热门 3结算 4复活 5猜你喜欢
	static JUMP_TYPE_CHOUTI: number = 1;
	static JUMP_TYPE_REMEN: number = 1;
	static JUMP_TYPE_JIESUAN: number = 1;
	static JUMP_TYPE_FUHUO: number = 1;
	static JUMP_TYPE_XIHUAN: number = 1;
	static JUMP_TYPE_BATTLE: number = 1;

	/**卡日曲主界面右上角类型 */
	// static JUMP_KARIQU_MAINICON: number = 320;
	/**卡日曲主界面左侧拉起类型 */
	static JUMP_KARIQU_LEFTSIDE: number = 100;
	/**卡日曲战斗右上类型 */
	static JUMP_KARIQU_BATTLEICON: number = 27;
	/**卡日曲BANNER样式互推 */
	static JUMP_KARIQU_BANNER: number = 22;
	/**卡日曲结算界面互推类型 */
		// static JUMP_KARIQU_RESULT: number = 103;
		//跳转图标动画 0表示没动画
	static JUMP_ANI_STYLE_NONE: number = 0;
	static JUMP_ANI_STYLE_1: number = 1;
	static JUMP_ANI_STYLE_2: number = 2;

	//跳转黑名单状态
	static JUMP_SCENE_STATE_NONE: number = 0;
	static JUMP_SCENE_STATE_BLACK: number = 1;
	static JUMP_SCENE_STATE_NORMAL: number = 2;

	/**互推渠道：奇幻梦想 */
	static JUMP_CHANNEL_FANTASY = 1;
	/**互推渠道：梦嘉 */
	static JUMP_CHANNEL_MENGJIA = 2;
	/**互推渠道：指色 */
	static JUMP_CHANNEL_ZHISE = 3;
	/**互推渠道：卡日曲 */
	static JUMP_CHANNEL_KARIQU = 4;
}
