import Message from "../common/Message";
import NotifyEvent from "../event/NotifyEvent";

//通知管理器
export default class NotifyManager {
	static notifyFlag = false;

	public constructor() {
	}

	//收到服务器推送消息 并把服务器返回的数据发出去
	/**
	 * 服务器推送数据格式
	 * {
	 * 	method:101,
	 * 	params:{...},对应的参数
	 * }
	 */
	static onServerNotify(serverInfo) {
		console.log("=================get server push info ==========================", serverInfo);
		var method: string = serverInfo.method;
		Message.instance.send(NotifyEvent.methodToEventMap[String(method)], serverInfo);
		NotifyManager.notifyFlag = false;
	}

}
