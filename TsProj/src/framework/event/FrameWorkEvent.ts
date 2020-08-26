export default class FrameWorkEvent {
	public constructor() {
	}

	//事件定义.必须是模块名_event_功能拼音的方式.防止重复
	/**进入主界面 */
	static FRAMEWORKEVENT_STARTENTERMAIN = "FRAMEWORKEVENT_STARTENTERMAIN"
	//loading_2打点
	static FRAMEWORKEVENT_ENTERMAINFIN = "FRAMEWORKEVENT_ENTERMAINFIN"


	//按钮点击
	static FRAMEWORKEVENT_BUTTONCLICK = "FRAMEWORKEVENT_BUTTONCLICK"
}
