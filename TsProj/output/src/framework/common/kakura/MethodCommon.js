"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MethodCommon {
}
exports.default = MethodCommon;
MethodCommon.global_Account_loginTest = "201"; // 账户: 登陆测试渠道
MethodCommon.global_Account_loginOurpalm = "211"; // 账户: 登陆掌趣渠道
MethodCommon.global_Account_loginWx = "213"; // 账户: 登陆微信渠道
MethodCommon.global_Account_loginQQ = "217"; //账户：登录QQ渠道
MethodCommon.global_Account_loginTT = "219"; //账户：登录头条渠道
MethodCommon.global_Account_loginOppo = "221"; //账户：登陆Oppo小游戏
MethodCommon.global_Account_loginBaidu = "223"; //账户：登陆baidu小游戏
MethodCommon.global_Account_loginVivo = "225"; //账户：登陆vivo小游戏
MethodCommon.global_Account_loginUC = "227"; //账户：登陆UC小游戏
MethodCommon.global_Account_loginAndroidMaster = "231"; //账户：登陆安卓官服
MethodCommon.global_Account_loginIosMaster = "233"; //账户：登陆安卓官服
MethodCommon.global_Account_setUserInfo = "253"; //账户: 存储用户信息    
// Global接口:支付接口
MethodCommon.global_Recharge_getOrder = "2203"; //获取订单
// Global接口:公告系统
MethodCommon.global_Notice_getGlobal = "3101"; // 获取全服公告
MethodCommon.global_Notice_getMaintain = "3103"; // 获取维护公告
// 通讯协议描述文件获取接口
MethodCommon.test_system_getOpList = "100103"; // 获取通讯协议接口
MethodCommon.test_system_getTestOpList = "100105"; // 获取测试命令通讯协议接口
// 角色系统
MethodCommon.User_kakuraInit = "301"; // 连接接口
MethodCommon.User_kakuraReauth = "303"; // 重复验证接口
MethodCommon.User_kakuraClose = "305"; // 断线回调
MethodCommon.User_kakuraProcessClose = "307"; // 进程结束回调
MethodCommon.User_login = "311"; // 登陆后获取用户信息
MethodCommon.User_relogin = "313"; // 重新获取登录信息接口
MethodCommon.User_getOffLineCoin = "315"; // 领取离线收益
MethodCommon.User_guide = "333"; // 新手引导进度(线性，关键节点进度)
MethodCommon.User_setUserInfo = "339"; // 设置用户详细信息
MethodCommon.User_setDeviceRecognizition = "353"; //设置用户设备识别情况
MethodCommon.cloudStorage_setByUser = "1001"; //云存储 设置用户数据
MethodCommon.cloudStorage_setGlobalData = "1005"; //云存储 设置全局数据 比如邀请数据
MethodCommon.cloudStorage_getGlobalData = "1007"; //云存储 获取全局数据
MethodCommon.Charge_getOrderId = "2001"; //获取订单号
MethodCommon.Charge_checkOrderState = "2003"; //客户端检查订单状态
MethodCommon.Charge_confirm = "2005"; //客户端确认成功或失败
MethodCommon.saveSubscribeMsg = "2101"; //存储订阅消息
//# sourceMappingURL=MethodCommon.js.map