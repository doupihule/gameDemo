/**
 * 录屏相关事件
 */
export default class RecordEvent {
	//服务器的推送时间map
	public constructor() {
	}

	//事件定义.必须是模块名_event_功能拼音的方式.防止重复
	static TT_RECORD_EVENT_START = "TT_RECORD_EVENT_START"  //头条开始录屏
	static TT_RECORD_EVENT_STOP = "TT_RECORD_EVENT_STOP"  //头条结束录屏
}
