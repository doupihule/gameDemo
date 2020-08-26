"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BattleConst {
}
exports.default = BattleConst;
//战斗中用到的一些常量定义
BattleConst.battle_game_mode_auto = 1; //游戏模式 1 是自动
BattleConst.battle_game_mode_boss = 2; //2 boss战
//阵营
BattleConst.ROLEGROUP_MYSELF = 1; //我方
BattleConst.ROLEGROUP_ENEMY = 2; //敌方
//角色类型
BattleConst.LIFE_LANDHERO = 1; //地面小兵
BattleConst.LIFE_AIRHERO = 2; //空中小兵
BattleConst.LIFE_LANDBUILD = 3; //地面建筑
BattleConst.LIFE_JIDI = 4; //基地
BattleConst.LIFE_PLAYER = 9; //基地技能的容器
// static role_kind_land:number = 1;   //地面兵
// static role_kind_fly:number =2;     //飞行兵
// 战斗状态 0 是非战斗, 1 是战斗中 2 是战斗结束//非战斗状态 3 战斗复活
BattleConst.battleState_out = 0;
BattleConst.battleState_in = 1;
BattleConst.battleState_over = 2;
BattleConst.battleState_revive = 3;
//游戏结果 0未出结果 1胜利 2 失败
BattleConst.battleResult_none = 0;
BattleConst.battleResult_win = 1;
BattleConst.battleResult_lose = 2;
//动作标签
BattleConst.LABEL_IDLE = "idle";
BattleConst.LABEL_WALK = "move";
BattleConst.LABEL_ATTACK = "attack";
BattleConst.LABEL_HITED = "hited";
BattleConst.LABEL_DEAD = "dead";
//战斗模块
BattleConst.model_player = "model_player";
BattleConst.model_role = "role";
BattleConst.model_monster = "monster";
BattleConst.model_bullet = "bullet";
BattleConst.model_effect = "effect";
BattleConst.model_prop = "prop";
BattleConst.model_home = "home";
//运动状态
BattleConst.state_stand = "stand";
BattleConst.state_move = "move";
BattleConst.state_jump = "jump"; //跳跃状态
//如果要配置运动+旋转 那么 用1|2的方式 
BattleConst.TWEEN_MOVE = 1; //运动
BattleConst.TWEEN_ROTATE = 2; //旋转
BattleConst.TWEEN_SCALE = 4; //缩放
BattleConst.TWEEN_ALPHA = 8; //透明度
BattleConst.PROPSTYLE_NUM = 1; //数值型属性
BattleConst.PROPSTYLE_RATIO = 2; //百分比属性
BattleConst.DIED_STATE_NONE = 0; //没有死亡
BattleConst.DIED_STATE_ING = 1; //死亡中
BattleConst.DIED_STATE_OVER = 2; //死亡结束
BattleConst.BULLET_MOVE_LINE = 1; //按直线运动
BattleConst.BULLET_MOVE_CURVE = 2; //按抛物线运动
BattleConst.POSTYPE_QIANPAI = 1; //前排
BattleConst.POSTYPE_HOUPAI = 2; //后排
BattleConst.damage_normal = 1; //普通
BattleConst.damage_baoji = 2; //伤害结果暴击
BattleConst.damage_miss = 3; //闪避
BattleConst.skill_kind_noraml = 1; //普攻
BattleConst.skill_kind_small = 2; //小技能
BattleConst.skill_kind_energy = 3; //大招
BattleConst.skill_kind_passive = 4; //被动
BattleConst.bullet_hit_through = 0; //穿透
BattleConst.bullet_hit_bounce = 1; //弹射
BattleConst.bullet_hit_back = 2; //返回
BattleConst.attr_attack = "1"; //攻击
BattleConst.attr_def = "2"; //防御
BattleConst.attr_maxHp = "3"; //最大血量
BattleConst.attr_hit = "4"; //命中
BattleConst.attr_dodge = "5"; //闪避
BattleConst.attr_crit = "6"; //暴击
BattleConst.attr_critDmg = "7"; //暴击伤害
BattleConst.attr_toughness = "8"; //韧性
BattleConst.attr_damage = "9"; //伤害加成
BattleConst.attr_relief = "10"; //伤害减免
BattleConst.attr_treate = "11"; //治疗加成
BattleConst.attr_betreated = "12"; //被治疗加成
BattleConst.attr_speed = "13"; //移动速度  像素/毫秒
BattleConst.attr_final_damage = "51"; //最终伤害加成
BattleConst.attr_final_relief = "52"; //最终伤害减免
BattleConst.attr_final_treate = "53"; //治疗加成
BattleConst.attr_final_betreated = "54"; //被治疗加成
BattleConst.attr_relivecd = "201"; //复活cd
BattleConst.instance_use_normal = 0; //使用状态
BattleConst.instance_use_cache = 1; //缓存
BattleConst.instance_use_destory = 2; //销毁
BattleConst.attr_energyresume = "102"; //能量恢复速度
BattleConst.attr_profit = "101"; //收益
BattleConst.attr_killresume = "103"; //击杀回血
BattleConst.attr_coinmonster = "105"; //击杀怪物收益加成
BattleConst.attr_coinlevel = "106"; //boss战结算加成
BattleConst.attr_hp = "900"; //属性id 当前血量
BattleConst.attr_enegry = "901"; //属性id 当前能量
BattleConst.attr_xixue = "905"; //吸血
BattleConst.attr_fanshang = "906"; //反伤
BattleConst.buff_remove_all = 1; //buff移除时机 ,1是任意时机
BattleConst.buff_remove_hudun = 2; //护盾类型血量为0
BattleConst.buff_remove_qusan = 3; //被技能驱散
BattleConst.buff_remove_timeout = 4; //时间到了
BattleConst.buff_remove_diedClear = 5; //死亡清除
BattleConst.buff_remove_cover = 99; //被覆盖
BattleConst.buff_type_attr = 2; //提升属性的buff
//1.指定ID的buff 2.指定类型的buff 3.指定组buff4.全部正面buff5.全部负面buff
BattleConst.buff_kind_id = 1;
BattleConst.buff_kind_type = 2;
BattleConst.buff_kind_group = 3;
BattleConst.buff_kind_zheng = 4;
BattleConst.buff_kind_fu = 5;
BattleConst.effect_label_dmg = "normal"; //普通伤害飘字
BattleConst.effect_label_crit = "crit"; //暴击飘字
BattleConst.effect_label_miss = "miss"; //闪避飘字
BattleConst.effect_label_trit = "trit"; //治疗飘字
BattleConst.effect_label_tritCrit = "tritCrit"; //治疗暴击飘字
BattleConst.effect_label_hudun = "hudun"; //护盾受伤
BattleConst.buff_zengyi = 1; //增益buff
BattleConst.buff_jianyi = 2; //减益buff
//被动技能效果 全局属性加成
BattleConst.passive_effect_global_attr = 103;
//被动技能效果 属性加成
BattleConst.passive_effect_attr = 104;
//被动cd加成
BattleConst.passive_effect_skillcd = 105;
//被动技能效果 改变角色技能
BattleConst.passive_effect_changeSkill = 106;
//被动技能效果 改变角色消耗能量
BattleConst.passive_effect_changeEnergeCost = 107;
//豪华开局效果
BattleConst.battle_start_none = 1; //不弹任何效果
BattleConst.battle_start_full_energy = 2; //开局满能量
BattleConst.battle_start_attack_add = 3; //己方所有角色攻击加成（万分比）
BattleConst.battle_start_life_add = 4; //己方所有角色生命上限加成（万分比）
BattleConst.battle_start_homeCd = 5; //己方基地技能CD降低（万分比）
BattleConst.battle_start_energy_resume = 6; //能量恢复提升（万分比）
BattleConst.battle_start_passive_arr = [BattleConst.battle_start_attack_add, BattleConst.battle_start_life_add];
//被动效果改变的技能类型 ：角色普通技能
BattleConst.skillType_normal = 1;
//被动效果改变的技能类型 ：角色被动技能
BattleConst.skillType_passive = 2;
BattleConst.WARSTATE_LINE = 1; //远征状态：可上阵
BattleConst.WARSTATE_CANFIGHT = 2; //远征状态：可战斗
BattleConst.WARSTATE_INFIGHT = 3; //远征状态：战斗中
BattleConst.BATTLETYPE_NORMAL = 1; //战斗类型：正常关卡
BattleConst.BATTLETYPE_WAR = 2; //战斗类型：远征模式
/**角色类型：助阵角色 */
BattleConst.ROLETYPE_HELPROLE = 1;
/**复活类型：超时复活 */
BattleConst.REVIVETYPE_OVERTIME = 1;
/**复活类型：战败复活 */
BattleConst.REVIVETYPE_DEFEAT = 2;
/**复活类型：迷雾复活 */
BattleConst.REVIVETYPE_FOG = 3;
//# sourceMappingURL=BattleConst.js.map