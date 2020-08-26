export default class WindowEvent {
	public constructor() {
	}

	//事件定义.必须是模块名_event_功能拼音的方式.防止重复
	static WINDOW_EVENT_SWITCHUISTART = "WINDOW_EVENT_SWITCHUISTART"
	/**界面切换开始 */
	static WINDOW_EVENT_SWITCHUIFIN = "WINDOW_EVENT_SWITCHUIFIN" /**界面切换结束 */
}
