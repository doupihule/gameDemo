export default class NotifyEvent {
	//服务器的推送时间map
	public constructor() {
	}

	//当收到服务器推送的时候 会发送对应的消息.
	static methodToEventMap = {
		["10000"]: "CLIENT_SEND_LOG",			//客户端发送错误日志
	}
}
