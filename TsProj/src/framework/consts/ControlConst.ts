export default class ControlConst {
	//失去焦点
	static ON_LIFE_PAUSE: string = "on_life_pause";
	//获得焦点
	static ON_LIFE_START: string = "on_life_start";

	//头条分享录屏成功
	static TT_SHARE_SUCC: string = "TT_SHARE_SUCC";
	//头条分享录屏失败
	static TT_SHARE_FAIL: string = "TT_SHARE_FAIL";

	/**按钮类型1：按下scale设置为0.9  抬起为1 */
	static BUTTON_TYPE_1: string = "BUTTON_TYPE_1";
	/**按钮类型2：按下scale设置为当前scale * 0.9  抬起恢复(/0.9) */
	static BUTTON_TYPE_2: string = "BUTTON_TYPE_2";
	/** 按钮类型3：按下抬起无显示效果 */
	static BUTTON_TYPE_3: string = "BUTTON_TYPE_3";
	/** 按钮类型4：静止按钮缩放。按下scale设置为当前scale * 0.9  抬起恢复(/0.9) */
	static BUTTON_TYPE_4: string = "BUTTON_TYPE_4";
	//点赞动画
	static ZAN_ANIM: string = 'zan_anim';
	//跳过动画
	static SKIP_ANIM: string = 'skip_anim';

	//微信等监听版本更新收到回调
	static VERSION_CHECK_COMPLETE: string = 'version_check_complete';

	//空表
	static emptyTable: any = {}


}