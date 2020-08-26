"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GuideEvent {
}
exports.default = GuideEvent;
//事件定义.必须是模块名_event_功能拼音的方式.防止重复
//检查主界面引导
GuideEvent.GUIDEEVENT_CHECKGUIDE = "GUIDEEVENT_CHECKGUIDE";
//战斗界面翻转强制引导
GuideEvent.GUIDEEVENT_ROTATE_MAINGUIDE = "GUIDEEVENT_ROTATE_MAINGUIDE";
//战斗界面翻转弱制引导
GuideEvent.GUIDEEVENT_ROTATE_SUBGUIDE = "GUIDEEVENT_ROTATE_SUBGUIDE";
//关闭战斗界面翻转弱制引导
GuideEvent.GUIDEEVENT_CLOSE_ROTATE_SUBGUIDE = "GUIDEEVENT_CLOSE_ROTATE_SUBGUIDE";
//检查主界面引导
GuideEvent.GUIDEEVENT_EXCHANGE = "GUIDEEVENT_EXCHANGE";
//# sourceMappingURL=GuideEvent.js.map