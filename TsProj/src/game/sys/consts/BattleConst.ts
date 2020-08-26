export default class BattleConst {
    //战斗中用到的一些常量定义

    static battle_game_mode_auto: number = 1  //游戏模式 1 是自动
    static battle_game_mode_boss: number = 2;    //2 boss战

    //阵营
    static ROLEGROUP_MYSELF = 1;      //我方
    static ROLEGROUP_ENEMY = 2;       //敌方

    //角色类型
    static LIFE_LANDHERO: number = 1;        //地面小兵
    static LIFE_AIRHERO: number = 2;         //空中小兵
    static LIFE_LANDBUILD: number = 3;       //地面建筑
    static LIFE_JIDI: number = 4;            //基地
    static LIFE_PLAYER: number = 9;     //基地技能的容器

    // static role_kind_land:number = 1;   //地面兵
    // static role_kind_fly:number =2;     //飞行兵

    // 战斗状态 0 是非战斗, 1 是战斗中 2 是战斗结束//非战斗状态 3 战斗复活
    static battleState_out: number = 0;
    static battleState_in: number = 1;
    static battleState_over: number = 2;
    static battleState_revive: number = 3;

    //游戏结果 0未出结果 1胜利 2 失败
    static battleResult_none: number = 0
    static battleResult_win: number = 1
    static battleResult_lose: number = 2


    //动作标签
    static LABEL_IDLE: string = "idle";
    static LABEL_WALK: string = "move";
    static LABEL_ATTACK: string = "attack";
    static LABEL_HITED: string = "hited"
    static LABEL_DEAD: string = "dead"

    //战斗模块
    static model_player: string = "model_player"
    static model_role: string = "role"
    static model_monster: string = "monster"
    static model_bullet: string = "bullet"
    static model_effect: string = "effect"
    static model_prop: string = "prop"
    static model_home: string = "home"

    //运动状态
    static state_stand: string = "stand";
    static state_move: string = "move";
    static state_jump: string = "jump"; //跳跃状态

    //如果要配置运动+旋转 那么 用1|2的方式 

    static TWEEN_MOVE: number = 1;       //运动
    static TWEEN_ROTATE: number = 2;      //旋转
    static TWEEN_SCALE: number = 4;      //缩放
    static TWEEN_ALPHA: number = 8;      //透明度

    static PROPSTYLE_NUM: number = 1;     //数值型属性
    static PROPSTYLE_RATIO: number = 2;   //百分比属性

    static DIED_STATE_NONE: number = 0;   //没有死亡
    static DIED_STATE_ING: number = 1;   //死亡中
    static DIED_STATE_OVER: number = 2;   //死亡结束


    static BULLET_MOVE_LINE: number = 1;   //按直线运动
    static BULLET_MOVE_CURVE: number = 2;   //按抛物线运动

    static POSTYPE_QIANPAI: number = 1;      //前排
    static POSTYPE_HOUPAI: number = 2;      //后排

    static damage_normal: number = 1; //普通
    static damage_baoji: number = 2;  //伤害结果暴击
    static damage_miss: number = 3;  //闪避



    static skill_kind_noraml: number = 1;    //普攻
    static skill_kind_small: number = 2;    //小技能
    static skill_kind_energy: number = 3;    //大招
    static skill_kind_passive: number = 4;    //被动

    static bullet_hit_through: number = 0;   //穿透
    static bullet_hit_bounce: number = 1;    //弹射
    static bullet_hit_back: number = 2;    //返回


    static attr_attack: string = "1";      //攻击
    static attr_def: string = "2";        //防御
    static attr_maxHp: string = "3";  //最大血量
    static attr_hit: string = "4";   //命中
    static attr_dodge: string = "5"; //闪避
    static attr_crit: string = "6";//暴击
    static attr_critDmg: string = "7"; //暴击伤害
    static attr_toughness: string = "8"; //韧性
    static attr_damage: string = "9";      //伤害加成
    static attr_relief: string = "10";       //伤害减免
    static attr_treate: string = "11";        //治疗加成
    static attr_betreated: string = "12";    //被治疗加成
    static attr_speed: string = "13";     //移动速度  像素/毫秒

    static attr_final_damage: string = "51";      //最终伤害加成
    static attr_final_relief: string = "52";       //最终伤害减免
    static attr_final_treate: string = "53";        //治疗加成
    static attr_final_betreated: string = "54";    //被治疗加成

    static attr_relivecd: string = "201"     //复活cd
    static instance_use_normal: number = 0;        //使用状态
    static instance_use_cache: number = 1;         //缓存
    static instance_use_destory: number = 2;       //销毁


    static attr_energyresume: string = "102";		//能量恢复速度
    static attr_profit: string = "101";		//收益
    static attr_killresume: string = "103";		//击杀回血

    static attr_coinmonster: string = "105";     //击杀怪物收益加成
    static attr_coinlevel: string = "106";     //boss战结算加成


    static attr_hp: string = "900";      //属性id 当前血量
    static attr_enegry: string = "901";      //属性id 当前能量

    static attr_xixue: string = "905";     //吸血
    static attr_fanshang: string = "906";  //反伤


    static buff_remove_all: number = 1;      //buff移除时机 ,1是任意时机
    static buff_remove_hudun: number = 2;       //护盾类型血量为0
    static buff_remove_qusan: number = 3;        //被技能驱散
    static buff_remove_timeout: number = 4;      //时间到了
    static buff_remove_diedClear: number = 5;    //死亡清除
    static buff_remove_cover: number = 99;       //被覆盖

    static buff_type_attr: number = 2;       //提升属性的buff

    //1.指定ID的buff 2.指定类型的buff 3.指定组buff4.全部正面buff5.全部负面buff
    static buff_kind_id: number = 1;
    static buff_kind_type: number = 2;
    static buff_kind_group: number = 3;
    static buff_kind_zheng: number = 4;
    static buff_kind_fu: number = 5;

    static effect_label_dmg: string = "normal";        //普通伤害飘字
    static effect_label_crit: string = "crit";        //暴击飘字
    static effect_label_miss: string = "miss";        //闪避飘字
    static effect_label_trit: string = "trit";        //治疗飘字
    static effect_label_tritCrit: string = "tritCrit";        //治疗暴击飘字
    static effect_label_hudun: string = "hudun";      //护盾受伤

    static buff_zengyi: number = 1;   //增益buff
    static buff_jianyi: number = 2;   //减益buff


    //被动技能效果 全局属性加成
    static passive_effect_global_attr: number = 103;

    //被动技能效果 属性加成
    static passive_effect_attr: number = 104;
    //被动cd加成
    static passive_effect_skillcd: number = 105;
    //被动技能效果 改变角色技能
    static passive_effect_changeSkill: number = 106;
    //被动技能效果 改变角色消耗能量
    static passive_effect_changeEnergeCost: number = 107;

    //豪华开局效果
    static battle_start_none = 1;//不弹任何效果
    static battle_start_full_energy = 2;//开局满能量
    static battle_start_attack_add = 3;//己方所有角色攻击加成（万分比）
    static battle_start_life_add = 4;//己方所有角色生命上限加成（万分比）
    static battle_start_homeCd = 5;//己方基地技能CD降低（万分比）
    static battle_start_energy_resume = 6;//能量恢复提升（万分比）
    static battle_start_passive_arr = [BattleConst.battle_start_attack_add, BattleConst.battle_start_life_add];

    //被动效果改变的技能类型 ：角色普通技能
    static skillType_normal = 1;
    //被动效果改变的技能类型 ：角色被动技能
    static skillType_passive = 2;

    static WARSTATE_LINE = 1; //远征状态：可上阵
    static WARSTATE_CANFIGHT = 2; //远征状态：可战斗
    static WARSTATE_INFIGHT = 3; //远征状态：战斗中

    static BATTLETYPE_NORMAL = 1; //战斗类型：正常关卡
    static BATTLETYPE_WAR = 2; //战斗类型：远征模式

    /**角色类型：助阵角色 */
    static ROLETYPE_HELPROLE = 1;

    /**复活类型：超时复活 */
    static REVIVETYPE_OVERTIME = 1;
    /**复活类型：战败复活 */
    static REVIVETYPE_DEFEAT = 2;
    /**复活类型：迷雾复活 */
    static REVIVETYPE_FOG = 3;
}