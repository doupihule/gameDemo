"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Method {
}
exports.default = Method;
Method.global_HeartBeat = "heartBeat"; //心跳请求
// Global接口:账户系统
Method.global_Account_loginTest = "201"; // 账户: 登陆测试渠道
Method.global_Account_loginOurpalm = "211"; // 账户: 登陆掌趣渠道
Method.global_Account_loginWx = "213"; // 账户: 登陆微信渠道
Method.global_Account_loginQQ = "217"; //账户：登录QQ渠道
Method.global_Account_loginTT = "219"; //账户：登录头条渠道
Method.global_Account_loginOppo = "221"; //账户：登陆Oppo小游戏
Method.global_Account_loginBaidu = "223"; //账户：登陆baidu小游戏
Method.global_Account_setUserInfo = "253"; //账户: 存储用户信息    
//云存储
Method.cloudStorage_setByUser = "1001";
Method.cloudStorage_setGlobalData = "1005"; //云存储 设置全局数据 比如邀请数据
Method.cloudStorage_getGlobalData = "1007"; //云存储 获取全局数据
// 通讯协议描述文件获取接口
Method.test_system_getOpList = "100103"; // 获取通讯协议接口
Method.test_system_getTestOpList = "100105"; // 获取测试命令通讯协议接口
Method.User_kakuraInit = "301"; // 连接接口
Method.User_kakuraReauth = "303"; // 重复验证接口
Method.User_kakuraClose = "305"; // 断线回调
Method.User_kakuraProcessClose = "307"; // 进程结束回调
Method.User_login = "311"; // 登陆后获取用户信息
Method.User_relogin = "313"; // 重新获取登录信息接口
Method.User_setUserInfo = "339"; // 设置用户详细信息
Method.User_setButton = "341"; // 设置音乐、音效开关
Method.Utils_shareOrVideo = "1205"; //分享、视频通用接口
//同步数据
Method.Utils_reloginInfo = "361";
Method.PayPurchace_Notify = "2201"; //通知服务器充值
/**迷雾模式：写入战力 */
Method.Fog_syncForce = "401";
/**迷雾模式：随机用户 */
Method.Fog_randomEnemy = "403";
//# sourceMappingURL=Method.js.map