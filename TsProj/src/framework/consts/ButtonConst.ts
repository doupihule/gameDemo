export default class ButtonConst {
	/**按钮类型1：按下scale设置为0.9  抬起为1 */
	static BUTTON_TYPE_1: string = "BUTTON_TYPE_1";
	/**按钮类型2：按下scale设置为当前scale * 0.9  抬起恢复(/0.9) */
	static BUTTON_TYPE_2: string = "BUTTON_TYPE_2";
	/** 按钮类型3：按下抬起无显示效果 */
	static BUTTON_TYPE_3: string = "BUTTON_TYPE_3";
	/** 按钮类型4：静止按钮缩放。按下scale设置为当前scale * 0.9  抬起恢复(/0.9) */
	static BUTTON_TYPE_4: string = "BUTTON_TYPE_4";
	/** 按钮类型5：按下scale设置为当前scale * 1.1  抬起恢复(/1.1) */
	static BUTTON_TYPE_5: string = "BUTTON_TYPE_5";
	/** 按钮类型6：静止按钮缩放。按下scale设置为当前scale * 0.8  抬起恢复(/0.8) */
	static BUTTON_TYPE_6: string = "BUTTON_TYPE_6";
	/** 按钮类型7：立体Y偏移按钮 typeParams{diffY:10} */
	static BUTTON_TYPE_7: string = "BUTTON_TYPE_7";
}