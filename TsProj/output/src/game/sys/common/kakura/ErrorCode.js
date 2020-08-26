"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorCode {
    constructor() {
    }
}
exports.default = ErrorCode;
ErrorCode.sec_maintain = "10053"; //服务器维护
ErrorCode.player_lv_not_enough = "10013"; //玩家等级不足
ErrorCode.sec_close = "10054"; //服务器关闭
ErrorCode.kickouted_by_server = "999721"; //被服务器踢下线
ErrorCode.kakura_getCacheError = "999713"; //拿缓存失败
ErrorCode.kakura_needClientUpdate = "999726"; //有版本更新 取消了NotifyEvent.notifyUpdateClientCode这个变量
ErrorCode.kakura_server_error = "999723"; //kakura与php服务器之间通信的各种异常
ErrorCode.duplicate_login = "999722"; //被挤掉线
ErrorCode.need_client_relogin = "999724"; //需要客户端重新登入
ErrorCode.other_client_response = "999725"; //需要客户端重新登入
ErrorCode.kaura_getResponceError = "999716"; //拿缓存请求失败]
ErrorCode.user_need_queue_time = "10089"; //登录排队等待
ErrorCode.logintoken_expire = "19001"; //token错误 请重新登入
ErrorCode.sec_no_open = "10072"; //暂未开服
ErrorCode.sys_error = "99999999"; //系统错误
ErrorCode.account_forbided = "10006"; //账号被封禁
ErrorCode.account_data_error = "34903"; //账号数据异常
ErrorCode.server_backData_error = "99999998"; //服务器返回的数据格式异常
ErrorCode.webOffline = "110"; //网络中断
ErrorCode.nologin = "111"; //网络中断
ErrorCode.server_error_test_180101 = "180101"; //时间到，分数无效
ErrorCode.server_error_test_210101 = "210101"; //签到奖励领取进度大于登陆进度
ErrorCode.wx_sdk_error1 = "21701"; //global请求sdk error
ErrorCode.wx_sdk_error2 = "21901"; //global请求sdk error
ErrorCode.wx_sdk_error3 = "21301"; //global请求sdk error
ErrorCode.wx_sdk_error4 = "21302"; //global请求sdk error
ErrorCode.wx_sdk_error5 = "10057"; //global请求sdk error
//# sourceMappingURL=ErrorCode.js.map