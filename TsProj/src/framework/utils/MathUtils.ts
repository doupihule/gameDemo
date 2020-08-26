export default class MathUtils {
	public constructor() {
	}

	static tempVector3_1 = new Laya.Vector3();
	static tempVector3_2 = new Laya.Vector3();
	static tempVector3_3 = new Laya.Vector3();

	//计算2个点的角度(弧度)
	static countAngle(p1: any, p2: any) {
		var dx: number = p1.x - p2.x;
		var dy: number = p1.y - p2.y;
		return Math.atan2(dy, dx);
	}

	//计算距离 这些都是二唯计算
	static countDistance(p1: any, p2: any) {
		var dx: number = p1.x - p2.x;
		var dy: number = p1.y - p2.y;
		return Math.sqrt(dx * dx + dy * dy)
	}

	static countXZDistance(p1: any, p2: any) {
		var dx: number = p1.x - p2.x;
		var dz: number = p1.z - p2.z;
		return Math.sqrt(dx * dx + dz * dz)
	}

	//判断az距离
	static countXZDistanceSquart(p1: any, p2: any) {
		var dx: number = p1.x - p2.x;
		var dz: number = p1.z - p2.z;
		return (dx * dx + dz * dz)
	}

	static countDistanceByNums(x1: number, y1: number, x2: number, y2: number) {
		var dx: number = x2 - x1;
		var dy: number = y2 - y1;
		return Math.sqrt(dx * dx + dy * dy)
	}


	//计算距离的平方
	static countDistanceSquart(p1: any, p2: any) {
		var dx: number = p1.x - p2.x;
		var dy: number = p1.y - p2.y;
		return (dx * dx + dy * dy)
	}

	//计算点的长度 
	static countPointLenth(p: any) {
		return Math.sqrt(p.x * p.x + p.y * p.y);
	}

	//判断一个点是否在矩形内
	static checkInRect(x, y, rx, ry, rw, rh) {
		if (x < rx || x > rx + rw || y < ry || y > ry + rh) {
			return false;
		}
		return true;
	}

	//二维向量点积
	static dot2(a: Laya.Vector2, b: Laya.Vector2) {
		this.tempVector3_1.x = a.x;
		this.tempVector3_1.y = a.y;
		this.tempVector3_2.x = b.x;
		this.tempVector3_2.y = b.y;
		return Laya.Vector3.dot(this.tempVector3_1, this.tempVector3_2);
	}


	//二维向量叉积
	static cross2(a: Laya.Vector2, b: Laya.Vector2, out: Laya.Vector2) {
		this.tempVector3_1.x = a.x;
		this.tempVector3_1.y = a.y;
		this.tempVector3_2.x = b.x;
		this.tempVector3_2.y = b.y;
		Laya.Vector3.cross(this.tempVector3_1, this.tempVector3_2, this.tempVector3_3);
		out.x = this.tempVector3_3.x;
		out.y = this.tempVector3_3.y;
		return out;
	}

	//二维向量差
	static subtract2(a: Laya.Vector2, b: Laya.Vector2, out: Laya.Vector2) {
		this.tempVector3_1.x = a.x;
		this.tempVector3_1.y = a.y;
		this.tempVector3_2.x = b.x;
		this.tempVector3_2.y = b.y;
		Laya.Vector3.subtract(this.tempVector3_1, this.tempVector3_2, this.tempVector3_3);
		out.x = this.tempVector3_3.x;
		out.y = this.tempVector3_3.y;
		return out;
	}

}