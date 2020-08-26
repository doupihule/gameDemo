import Equation from "./Equation";

/**
 * ...
 * @author star
 *
 * 贝塞尔曲线
 *  求出曲线上任意一点的坐标
 */
export default class Bezier {

	//  =====================================  属性


	//  对外变量
	private static p0: any;					// 起点
	private static p1: any;					// 贝塞尔点
	private static p2: any;					// 终点
	private static step: number;					// 分割份数

	//  辅助变量
	private static ax: number;
	private static ay: number;
	private static bx: number;
	private static by: number;

	// 曲线参数
	private static A: number;
	private static B: number;
	private static C: number;

	public static total_length: number;			// 长度


	//  =====================================  方法


	//  速度函数  就是一元二次方程
	private static s(t: number): number {
		return Math.sqrt(this.A * t * t + this.B * t + this.C);
	}


	//  长度函数 从起点开始 到 t 的长度  如果t=1 那么就刚好是这段曲线的长度
	private static L(t: number): number {
		var temp1: number = Math.sqrt(this.C + t * (this.B + this.A * t));
		var temp2: number = (2 * this.A * t * temp1 + this.B * (temp1 - Math.sqrt(this.C)));
		var temp3: number = Math.log(this.B + 2 * Math.sqrt(this.A) * Math.sqrt(this.C));
		var temp4: number = Math.log(this.B + 2 * this.A * t + 2 * Math.sqrt(this.A) * temp1);
		var temp5: number = 2 * Math.sqrt(this.A) * temp2;
		var temp6: number = (this.B * this.B - 4 * this.A * this.C) * (temp3 - temp4);

		return (temp5 + temp6) / (8 * Math.pow(this.A, 1.5));
	}


	//  长度函数反函数，使用牛顿切线法求解
	private static InvertL(t: number, l: number): number {
		var t1: number = t;
		var t2: number;
		do {
			t2 = t1 - (this.L(t1) - l) / this.s(t1);
			if (Math.abs(t1 - t2) < 0.000001) break;
			t1 = t2;
		} while (true);
		return t2;
	}


	//  =====================================  封装


	//  返回所需总步数  speed 是 给定的一个步长，然后通过贝塞尔曲线的总长度 来算出需要走多少步可以从头走到尾
	public static init($p0: any, $p1: any, $p2: any, $speed: number): number {

		this.p0 = $p0;
		this.p1 = $p1;
		this.p2 = $p2;
		//step = 30;

		this.ax = this.p0.x - 2 * this.p1.x + this.p2.x;
		this.ay = this.p0.y - 2 * this.p1.y + this.p2.y;
		this.bx = 2 * this.p1.x - 2 * this.p0.x;
		this.by = 2 * this.p1.y - 2 * this.p0.y;

		this.A = 4 * (this.ax * this.ax + this.ay * this.ay);
		this.B = 4 * (this.ax * this.bx + this.ay * this.by);
		this.C = this.bx * this.bx + this.by * this.by;

		//  计算长度
		this.total_length = this.L(1);

		//  计算步数
		this.step = Math.floor(this.total_length / $speed);
		if (this.total_length % $speed > $speed / 2) this.step++;

		return this.step;
	}

	private static tempVec1: any = {x: 0, y: 0}
	private static tempVec2: any = {x: 0, y: 0}

	// 根据指定nIndex位置获取锚点：返回x,y,角度,弧度,对应点垂线的直线方程
	public static getAnchorPoint(nIndex: number, needLineObj: boolean = false, pixelToMi: number = 1): any[] {
		if (nIndex >= 0 && nIndex <= this.step) {
			var t: number = nIndex / this.step;
			//  如果按照线行增长，此时对应的曲线长度
			var l: number = t * this.total_length;
			//  根据L函数的反函数，求得l对应的t值 就是已知长度 求出所在的t值
			t = this.InvertL(t, l);

			//  根据贝塞尔曲线函数，求得取得此时的x,y坐标
			var xx: number = (1 - t) * (1 - t) * this.p0.x + 2 * (1 - t) * t * this.p1.x + t * t * this.p2.x;
			var yy: number = (1 - t) * (1 - t) * this.p0.y + 2 * (1 - t) * t * this.p1.y + t * t * this.p2.y;

			var q0x: number = (1 - t) * this.p0.x + t * this.p1.x
			var q0y: number = (1 - t) * this.p0.y + t * this.p1.y
			var q1x: number = (1 - t) * this.p1.x + t * this.p2.x
			var q1y: number = (1 - t) * this.p1.y + t * this.p2.y

			// var Q0:any = new Vector3D((1 - t) * this.p0.x + t * this.p1.x, (1 - t) * this.p0.y + t * this.p1.y);
			// var Q1:any = new Vector3D((1 - t) * this.p1.x + t * this.p2.x, (1 - t) * this.p1.y + t * this.p2.y);

			//  计算角度
			var dx: number = q1x - q0x;
			var dy: number = q1y - q0y;
			var radians: number = Math.atan2(dy, dx);
			xx = xx * pixelToMi;
			yy = yy * pixelToMi;
			//这里判断是否需要把像素转化成米
			//是否需要返回对应点的垂线方程 .是为了简化后续每帧的运算.后面根据需要去优化.
			if (needLineObj) {
				var lineObj: any = Equation.creat_1_1_a(xx, yy, radians + Math.PI / 2);
				return [xx, yy, radians, lineObj];
			}
			/*xx = Math.round(xx);
			yy = Math.round(yy);*/
			return [xx, yy, radians];
		} else {
			return [];
		}
	}

}
