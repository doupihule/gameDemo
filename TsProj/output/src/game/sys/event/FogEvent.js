"use strict";
/*
* Author: TODO
* Date:2020-05-23
* Description: TODO
*/
Object.defineProperty(exports, "__esModule", { value: true });
class FogEvent {
    constructor() {
    }
}
exports.default = FogEvent;
//事件定义.必须是模块名_event_功能拼音的方式.防止重复
FogEvent.FOGEVENT_ONDATACHANGDE = "FOGEVENT_ONDATACHANGDE";
//刷新大巴车按钮
FogEvent.FOGEVENT_REFRESH_BUS = "FOGEVENT_REFRESH_BUS";
/**刷新格子事件完成状态*/
FogEvent.FOGEVENT_REFRESH_CELLEVENT = "FOGEVENT_REFRESH_CELLEVENT";
/**刷新格子的后置事件的显示 */
FogEvent.FOGEVENT_REFRESH_BEHINDEVENT = "FOGEVENT_REFRESH_BEHINDEVENT";
//刷新零件
FogEvent.FOGEVENT_REFRESH_COMP = "FOGEVENT_REFRESH_COMP";
//刷新行动力
FogEvent.FOGEVENT_REFRESH_ACT = "FOGEVENT_REFRESH_ACT";
//刷新迷雾币
FogEvent.FOGEVENT_REFRESH_FOGCOIN = "FOGEVENT_REFRESH_FOGCOIN";
/**刷新引导 */
FogEvent.FOGEVENT_REFRESH_GUIDE = "FOGEVENT_REFRESH_GUIDE";
//# sourceMappingURL=FogEvent.js.map