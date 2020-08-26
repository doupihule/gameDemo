"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameSwitchConst {
}
exports.default = GameSwitchConst;
//落地死亡开关
GameSwitchConst.SWITCH_LAND_DEATH = "SWITCH_LAND_DEATH";
//开关表
/**
 * 开关key,
 * 值 1表示打开开关 0或者空表示 开关是关闭的
 */
//可以在这里初始化定义一些调试开关.后面可以走服务器控制
//战斗调试角色信息开关 调试阶段先给打开.上线后关闭
GameSwitchConst.SWITCH_BATTLE_INFO = "SWITCH_BATTLE_INFO";
//战斗的调试等级
/**
 * 类型 :
 
 * 1, 大招免cd,无参数.
 * 2, 释放固定技能, 参数:技能id,技能等级
 * 3,固定使用某个被动技能, 参数:技能id,技能等级
 * 4,无限血量,参数: (哪个阵营无限血量,0双方,1我方,2敌方)
 * 5,一刀秒. 参数: (哪个阵营生效,0双方,1我方,2敌方)
 * 6,游戏加速 , 加速倍速
 * 9, 调试角色日志,参数:角色id; 可以配置多个角色.可以是我的,也可以是怪的. 0或者不配置表示调试所有角色日志
 *
 *
 */
GameSwitchConst.SWITCH_BATTLE_DEBUGLEVEL = "SWITCH_BATTLE_DEBUGLEVEL";
/**主线战斗技能cd，默认为0 没有cd 1是有cd */
GameSwitchConst.SWITCH_BATTLE_SKILLCD = "SWITCH_BATTLE_SKILLCD";
// 比如是否显示日志, 所有的开关默认是关闭的
GameSwitchConst._switchMap = {
    [GameSwitchConst.SWITCH_LAND_DEATH]: 0,
    [GameSwitchConst.SWITCH_BATTLE_SKILLCD]: 0
};
//# sourceMappingURL=GameSwitchConst.js.map