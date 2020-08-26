export default class ShopEvent {
	public constructor() {
	}

	//事件定义.必须是模块名_event_功能拼音的方式.防止重复
	static SHOP_EVENT_FRESHDAILYSELECT = "SHOP_EVENT_FRESHDAILYSELECT"
	/**刷新每日精选 */
	static SHOP_EVENT_FRESHCARDSHOP = "SHOP_EVENT_FRESHCARDSHOP" /**刷新卡包购买 */
}
