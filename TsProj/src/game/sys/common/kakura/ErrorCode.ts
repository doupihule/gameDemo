export default class ErrorCode {
    static sec_maintain: string = "10053";		//服务器维护
    static player_lv_not_enough: string = "10013";		//玩家等级不足
    static sec_close: string = "10054";		//服务器关闭
    static kickouted_by_server: string = "999721";		//被服务器踢下线
    static kakura_getCacheError: string = "999713";		//拿缓存失败
    static kakura_needClientUpdate: string = "999726";		//有版本更新 取消了NotifyEvent.notifyUpdateClientCode这个变量
    static kakura_server_error: string = "999723";		//kakura与php服务器之间通信的各种异常
    static duplicate_login: string = "999722";		//被挤掉线
    static need_client_relogin: string = "999724";		//需要客户端重新登入
    static other_client_response: string = "999725";		//需要客户端重新登入
    static kaura_getResponceError: string = "999716";		//拿缓存请求失败]
    static user_need_queue_time: string = "10089";		//登录排队等待
    static logintoken_expire: string = "19001";		//token错误 请重新登入
    static sec_no_open: string = "10072";		//暂未开服
    static sys_error: string = "99999999";		//系统错误
    static account_forbided: string = "10006";		//账号被封禁
    static account_data_error: string = "34903";		//账号数据异常

    static server_backData_error: string = "99999998" 	//服务器返回的数据格式异常
    static webOffline: string = "110"; //网络中断
    static nologin: string = "111"; //网络中断
    static server_error_test_180101: string = "180101" //时间到，分数无效
    static server_error_test_210101: string = "210101" //签到奖励领取进度大于登陆进度
    static wx_sdk_error1:string = "21701"  //global请求sdk error
    static wx_sdk_error2:string = "21901"  //global请求sdk error
    static wx_sdk_error3:string = "21301"  //global请求sdk error
    static wx_sdk_error4:string = "21302"  //global请求sdk error
    static wx_sdk_error5:string = "10057"  //global请求sdk error

    public constructor() {
    }
}