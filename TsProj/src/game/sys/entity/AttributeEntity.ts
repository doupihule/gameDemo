import TableUtils from "../../../framework/utils/TableUtils";
import BattleFunc from "../func/BattleFunc";

export default class AttributeEntity {
	//属性定义 所有的时间和长度单位都会转成米 或者帧


	/*基础动力（平跑加速度，单位：万分之一米/s^2） */
	public basePower: number;
	/**松手后的减速度(1/10000 m/s^2) */
	public baseSlowDownPower: number;
	/*平跑极速（单位：万分之一米/s） 转成米/帧 */
	public baseMaxSpeed: number;
	/**翻转速度(1/10000角度/秒)*/
	public turnSpeed: number;
	/**翻转单倍动力(1/10000米/秒^2) */
	public turnPower: number;

	/**翻转单倍动力时长(毫秒)*/
	public turnPowerTime: number;
	/**翻转动力最大时长(毫秒) */
	public turnPowerMaxTime: number;
	/**翻转极速（单位：万分之一米/s）--取值需要/10000 */
	public turnMaxspeed: number;
	/**非安全角度落地翻滚时间  */
	public unsafeFallTurnTime: number;
	/**非安全角度落地减速度(1/10000 m/s^2) */
	public unsafeFallSlowDownPower: number;

	//回源减速度.
	public slowDownPower: number;

	/**碰撞加速度（ */
	public collisionSpeedChange: number[];
	/**赛道转向灵敏度(1/10000米 /像素) */
	public roadChangeDirection: number;
	/**空中转向灵敏度(1/10000米 /像素) */
	public skyChangeDirection: number;
	/**carLength */
	public carLength: number;
	public box: number[];


	constructor(data) {
		var scaleValue: number = 1;
		this.basePower = BattleFunc.instance.turnAddSpeedToFrame(data.basePower);
		this.baseSlowDownPower = BattleFunc.instance.turnAddSpeedToFrame(data.baseSlowDownPower);
		this.baseMaxSpeed = BattleFunc.instance.turnSpeedToFrame(data.baseMaxSpeed);
		this.turnSpeed = BattleFunc.instance.turnRotateSpeedToFrame(data.turnSpeed);
		this.turnPower = BattleFunc.instance.turnAddSpeedToFrame(data.turnPower);
		this.turnPowerTime = BattleFunc.instance.turnMinisecondToframe(data.turnPowerTime);
		this.turnPowerMaxTime = BattleFunc.instance.turnMinisecondToframe(data.turnPowerMaxTime);
		this.turnMaxspeed = BattleFunc.instance.turnSpeedToFrame(data.turnMaxspeed);
		this.unsafeFallTurnTime = BattleFunc.instance.turnMinisecondToframe(data.unsafeFallTurnTime);
		this.unsafeFallSlowDownPower = BattleFunc.instance.turnAddSpeedToFrame(data.unsafeFallSlowDownPower);
		this.slowDownPower = BattleFunc.instance.turnAddSpeedToFrame(data.slowDownPower);
		this.slowDownPower = BattleFunc.instance.turnAddSpeedToFrame(data.slowDownPower);
		this.collisionSpeedChange = TableUtils.copyOneArr(data.collisionSpeedChange);
		this.collisionSpeedChange[0] /= 10000;
		this.collisionSpeedChange[1] /= 10000;
		this.roadChangeDirection = (data.roadChangeDirection);
		this.skyChangeDirection = (data.skyChangeDirection);
		this.carLength = data.carLength / 10000;
		this.box = data.box;
	}

}