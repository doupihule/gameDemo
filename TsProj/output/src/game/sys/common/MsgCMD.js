"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageCMD = void 0;
class MsgCMD {
}
exports.default = MsgCMD;
//游戏结束
MsgCMD.GAMEOVER = "1000000";
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
MsgCMD.MODULE_SHOW = "10000010";
//关闭模块
MsgCMD.MODULE_CLOSE = "1000002";
//重新加载global接口
MsgCMD.REQ_GLOBAL = "1000012";
//打开连接动画
MsgCMD.ROLL_ANI = "1000013";
MsgCMD.RETURN_GAMEMAIN = "RETURN_GAMEMAIN";
MsgCMD.GAME_ONSHOW = "GAME_ONSHOW";
MsgCMD.GAME_ONHIDE = "GAME_ONHIDE";
MsgCMD.USERINFO_AUTHORIZE = "USERINFO_AUTHORIZE"; //加载更衣室相关模型
MsgCMD.CLIENT_SEND_LOG = "CLIENT_SEND_LOG"; //客户端发送错误日志
MsgCMD.LOAD_JSONCOMPLETE = "LOAD_JSONCOMPLETE"; //配表加载完成
MsgCMD.VIDEO_PLAY = "VIDEO_PLAY";
MsgCMD.VIDEO_STOP = "VIDEO_STOP";
MsgCMD.CUSTOMER_BACK = "CUSTOMER_BACK";
class LocalStorageCMD {
}
exports.LocalStorageCMD = LocalStorageCMD;
LocalStorageCMD.EVENTLIST = 'eventlist';
//# sourceMappingURL=MsgCMD.js.map