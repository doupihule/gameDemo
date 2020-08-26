export default class WxEvent {
	public constructor() {
	}

	//事件定义.必须是模块名_event_功能拼音的方式.防止重复
	/**跳转小程序成功 */
	static WX_EVENT_JUMPSUC = "WX_EVENT_JUMPSUC"
	/**跳转小程序失败 */
	static WX_EVENT_JUMPFAIL = "WX_EVENT_JUMPFAIL"
	/**跳转小程序完成 */
	static WX_EVENT_JUMPCOMPLETE = "WX_EVENT_JUMPCOMPLETE"
}