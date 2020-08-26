export default class BannerEvent {
	public constructor() {
	}

	//事件定义.必须是模块名_event_功能拼音的方式.防止重复
	static BANNER_EVENT_SHOWLEADBANNER = "BANNER_EVENT_SHOWLEADBANNER"
	/**刷新间接banner */
	static BANNER_EVENT_SHOWQUICKBANNER = "BANNER_EVENT_SHOWQUICKBANNER"  /**刷新直接banner */
}
