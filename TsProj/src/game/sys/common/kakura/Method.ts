export default class Method {
    static global_HeartBeat: string = "heartBeat"     //心跳请求
    // Global接口:账户系统
    static global_Account_loginTest: string = "201" // 账户: 登陆测试渠道
    static global_Account_loginOurpalm: string = "211" // 账户: 登陆掌趣渠道
    static global_Account_loginWx: string = "213" // 账户: 登陆微信渠道
    static global_Account_loginQQ: string = "217" //账户：登录QQ渠道
    static global_Account_loginTT: string = "219" //账户：登录头条渠道
    static global_Account_loginOppo: string = "221" //账户：登陆Oppo小游戏
    static global_Account_loginBaidu: string = "223" //账户：登陆baidu小游戏
    static global_Account_setUserInfo: string = "253" //账户: 存储用户信息    

    //云存储
    static cloudStorage_setByUser: string = "1001";
    static cloudStorage_setGlobalData: string = "1005"                             //云存储 设置全局数据 比如邀请数据
    static cloudStorage_getGlobalData: string = "1007"                             //云存储 获取全局数据

    // 通讯协议描述文件获取接口
    static test_system_getOpList: string = "100103" // 获取通讯协议接口
    static test_system_getTestOpList: string = "100105" // 获取测试命令通讯协议接口

    static User_kakuraInit: string = "301" // 连接接口
    static User_kakuraReauth: string = "303" // 重复验证接口
    static User_kakuraClose: string = "305" // 断线回调
    static User_kakuraProcessClose: string = "307" // 进程结束回调
    static User_login: string = "311" // 登陆后获取用户信息
    static User_relogin: string = "313" // 重新获取登录信息接口
    static User_setUserInfo: string = "339" // 设置用户详细信息
    static User_setButton: string = "341" // 设置音乐、音效开关

    static Utils_shareOrVideo: string = "1205" //分享、视频通用接口
    //同步数据
    static Utils_reloginInfo = "361";

    static PayPurchace_Notify = "2201";    //通知服务器充值

    /**迷雾模式：写入战力 */
    static Fog_syncForce = "401";
    /**迷雾模式：随机用户 */
    static Fog_randomEnemy = "403";

}
