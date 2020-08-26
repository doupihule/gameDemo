export default class MethodCommon {
	static global_Account_loginTest: string = "201" // 账户: 登陆测试渠道
	static global_Account_loginOurpalm: string = "211" // 账户: 登陆掌趣渠道
	static global_Account_loginWx: string = "213" // 账户: 登陆微信渠道
	static global_Account_loginQQ: string = "217" //账户：登录QQ渠道
	static global_Account_loginTT: string = "219" //账户：登录头条渠道
	static global_Account_loginOppo: string = "221" //账户：登陆Oppo小游戏
	static global_Account_loginBaidu: string = "223" //账户：登陆baidu小游戏
	static global_Account_loginVivo: string = "225" //账户：登陆vivo小游戏
	static global_Account_loginUC: string = "227" //账户：登陆UC小游戏
	static global_Account_loginAndroidMaster: string = "231" //账户：登陆安卓官服
	static global_Account_loginIosMaster: string = "233" //账户：登陆安卓官服

	static global_Account_setUserInfo: string = "253" //账户: 存储用户信息

	// Global接口:支付接口
	static global_Recharge_getOrder: string = "2203"  //获取订单

	// Global接口:公告系统
	static global_Notice_getGlobal: string = "3101" // 获取全服公告
	static global_Notice_getMaintain: string = "3103" // 获取维护公告

	// 通讯协议描述文件获取接口
	static test_system_getOpList: string = "100103" // 获取通讯协议接口
	static test_system_getTestOpList: string = "100105" // 获取测试命令通讯协议接口

	// 角色系统
	static User_kakuraInit: string = "301" // 连接接口
	static User_kakuraReauth: string = "303" // 重复验证接口
	static User_kakuraClose: string = "305" // 断线回调
	static User_kakuraProcessClose: string = "307" // 进程结束回调
	static User_login: string = "311" // 登陆后获取用户信息
	static User_relogin: string = "313" // 重新获取登录信息接口
	static User_getOffLineCoin: string = "315" // 领取离线收益
	static User_guide: string = "333" // 新手引导进度(线性，关键节点进度)
	static User_setUserInfo: string = "339" // 设置用户详细信息


	static User_setDeviceRecognizition: string = "353"  //设置用户设备识别情况


	static cloudStorage_setByUser: string = "1001";                               //云存储 设置用户数据
	static cloudStorage_setGlobalData: string = "1005"                             //云存储 设置全局数据 比如邀请数据
	static cloudStorage_getGlobalData: string = "1007"                             //云存储 获取全局数据
	static Charge_getOrderId: string = "2001"                                       //获取订单号
	static Charge_checkOrderState: string = "2003"                                  //客户端检查订单状态
	static Charge_confirm: string = "2005"                                       //客户端确认成功或失败
	static saveSubscribeMsg: string = "2101";                                       //存储订阅消息
}