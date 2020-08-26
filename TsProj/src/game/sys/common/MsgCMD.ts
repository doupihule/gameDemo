export default class MsgCMD {
	//游戏结束
	static GAMEOVER: string = "1000000";
	//显示模块
	/**
	 * 显示
	 * @param data
	 * data = WindowCfgs.LOGIN   表明不需要带参数
	 * data = {
	 *  windowName : WindowCfgs.LOGIN ,对应的窗口名称
	 *  data: any,      需要传入的数据
	 *  callFunc,         这个ui打开后的回调, 默认为空
	 *  thisObj,      传入函数thisobj
	 *  expandGroup,  额外扩展需要加载的资源组名默认为空
	 * }
	 *
	 */
	static MODULE_SHOW: string = "10000010";
	//关闭模块
	static MODULE_CLOSE: string = "1000002";

	//重新加载global接口
	static REQ_GLOBAL: string = "1000012";
	//打开连接动画
	static ROLL_ANI: string = "1000013";


	static RETURN_GAMEMAIN: string = "RETURN_GAMEMAIN";


	static GAME_ONSHOW = "GAME_ONSHOW";
	static GAME_ONHIDE = "GAME_ONHIDE";

	static USERINFO_AUTHORIZE = "USERINFO_AUTHORIZE"             //加载更衣室相关模型
	static CLIENT_SEND_LOG = "CLIENT_SEND_LOG"             //客户端发送错误日志
	static LOAD_JSONCOMPLETE = "LOAD_JSONCOMPLETE";        //配表加载完成

	static VIDEO_PLAY = "VIDEO_PLAY";
	static VIDEO_STOP = "VIDEO_STOP";
	static CUSTOMER_BACK = "CUSTOMER_BACK";


}

export class LocalStorageCMD {
	static EVENTLIST: string = 'eventlist';
}
