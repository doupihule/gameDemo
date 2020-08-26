export default class BezierCurveUtils {

	//一阶贝塞尔
	public static getBezierPosOne(t: number, from: number, to: number) {
		return (1 - t) * from + t * to;
	}

	//获取贝塞尔曲线上的点
	public static getBezierPos(t: number, _from: Laya.Vector3, _to: Laya.Vector3, _temp: Laya.Vector3, vector?: Laya.Vector3): Laya.Vector3 {
		var a: Laya.Vector3;
		if (vector) {
			a = vector;
		} else {
			a = new Laya.Vector3(0, 0, 0);
		}
		a.x = t * t * (_to.x - 2 * _temp.x + _from.x) + _from.x + 2 * t * (_temp.x - _from.x);
		a.y = t * t * (_to.y - 2 * _temp.y + _from.y) + _from.y + 2 * t * (_temp.y - _from.y);
		a.z = t * t * (_to.z - 2 * _temp.z + _from.z) + _from.z + 2 * t * (_temp.z - _from.z);
		return a;
	}

	//获取贝塞尔曲线上的点,Laya.Vector2
	public static getBezierPosVector2(t: number, _from: Laya.Vector2, _to: Laya.Vector2, _temp: Laya.Vector2, vector?: Laya.Vector2): Laya.Vector2 {
		var a: Laya.Vector2;
		if (vector) {
			a = vector;
		} else {
			a = new Laya.Vector2(0, 0);
		}
		a.x = t * t * (_to.x - 2 * _temp.x + _from.x) + _from.x + 2 * t * (_temp.x - _from.x);
		a.y = t * t * (_to.y - 2 * _temp.y + _from.y) + _from.y + 2 * t * (_temp.y - _from.y);
		return a;
	}
}