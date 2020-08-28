"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ControlConst {
}
exports.default = ControlConst;
//失去焦点
ControlConst.ON_LIFE_PAUSE = "on_life_pause";
//获得焦点
ControlConst.ON_LIFE_START = "on_life_start";
//头条分享录屏成功
ControlConst.TT_SHARE_SUCC = "TT_SHARE_SUCC";
//头条分享录屏失败
ControlConst.TT_SHARE_FAIL = "TT_SHARE_FAIL";
/**按钮类型1：按下scale设置为0.9  抬起为1 */
ControlConst.BUTTON_TYPE_1 = "BUTTON_TYPE_1";
/**按钮类型2：按下scale设置为当前scale * 0.9  抬起恢复(/0.9) */
ControlConst.BUTTON_TYPE_2 = "BUTTON_TYPE_2";
/** 按钮类型3：按下抬起无显示效果 */
ControlConst.BUTTON_TYPE_3 = "BUTTON_TYPE_3";
/** 按钮类型4：静止按钮缩放。按下scale设置为当前scale * 0.9  抬起恢复(/0.9) */
ControlConst.BUTTON_TYPE_4 = "BUTTON_TYPE_4";
//点赞动画
ControlConst.ZAN_ANIM = 'zan_anim';
//跳过动画
ControlConst.SKIP_ANIM = 'skip_anim';
//微信等监听版本更新收到回调
ControlConst.VERSION_CHECK_COMPLETE = 'version_check_complete';
//空表
ControlConst.emptyTable = {};
//# sourceMappingURL=ControlConst.js.map