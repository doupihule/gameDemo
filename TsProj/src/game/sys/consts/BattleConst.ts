export default class BattleConst {
	//战斗中用到的一些常量定义

	public static POWERTYPE_TURN: number = 1;
	public static POWERTYPE_START: number = 2;
	public static POWERTYPE_HIT: number = 3;
	public static POWERTYPE_END: number = 4; //到达终点

	// 战斗状态 0 是非战斗, 1 是战斗中 2 是战斗结束//非战斗状态
	static battleState_out: number = 0;
	static battleState_in: number = 1;
	static battleState_over: number = 2;

	//战斗模块
	static model_role: string = "role"
	static model_monster: string = "monster"
	static model_bullet: string = "bullet"
	static model_effect: string = "effect"
	static model_prop: string = "prop"

	static state_stand: string = "stand";
	static state_move: string = "move";
	static state_move2stand: string = "move2stand";
	static state_jump: string = "jump"; //跳跃状态

	static model_bullet_model: string = "bullet_01"

	static  collion_layer_1:number = 9;
	static  collion_layer_2:number = 10;
	static  collion_layer_3:number = 11;


	//如果要配置运动+旋转 那么 用1|2的方式

	static TWEEN_MOVE: number = 1;       //运动
	static TWEEN_ROTATE: number = 2;      //旋转
	static TWEEN_SCALE: number = 4;      //缩放
	static TWEEN_ALPHA: number = 8;      //透明度


}