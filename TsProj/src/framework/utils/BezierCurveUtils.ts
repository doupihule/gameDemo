export default class BezierCurveUtils {

	//一阶贝塞尔
	public static getBezierPosOne(t: number, from: number, to: number) {
		return (1 - t) * from + t * to;
	}

	//获取贝塞尔曲线上的点
	public static getBezierPos(t: number, _from: any, _to: any, _temp: any, vector?: any): any {
		var a: any;
		if (vector) {
			a = vector;
		} else {
			a = {x:0,y:0,z:0};
		}
		a.x = t * t * (_to.x - 2 * _temp.x + _from.x) + _from.x + 2 * t * (_temp.x - _from.x);
		a.y = t * t * (_to.y - 2 * _temp.y + _from.y) + _from.y + 2 * t * (_temp.y - _from.y);
		a.z = t * t * (_to.z - 2 * _temp.z + _from.z) + _from.z + 2 * t * (_temp.z - _from.z);
		return a;
	}

	//获取贝塞尔曲线上的点,any
	public static getBezierPosVector2(t: number, _from: any, _to: any, _temp: any, vector?: any): any {
		var a: any;
		if (vector) {
			a = vector;
		} else {
			a = {x:0,y:0};
		}
		a.x = t * t * (_to.x - 2 * _temp.x + _from.x) + _from.x + 2 * t * (_temp.x - _from.x);
		a.y = t * t * (_to.y - 2 * _temp.y + _from.y) + _from.y + 2 * t * (_temp.y - _from.y);
		return a;
	}
}