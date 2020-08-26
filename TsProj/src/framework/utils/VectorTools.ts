export default class VectorTools {
	//原点
	static originPoint: Laya.Vector3 = new Laya.Vector3();
	//单位向量
	static unitPoint: Laya.Vector3 = new Laya.Vector3(1, 1, 1);


	//向量乘法
	static multyByNumToSelf(vec: Laya.Vector3, mul: number) {
		vec.x = vec.x * mul;
		vec.y = vec.y * mul;
		vec.z = vec.z * mul;
	}

	//向量乘法 返回新向量
	static multyByNum(vec: Laya.Vector3, mul: number): Laya.Vector3 {
		vec.x = vec.x * mul;
		vec.y = vec.y * mul;
		vec.z = vec.z * mul;
		return new Laya.Vector3(vec.x * mul, vec.y * mul, vec.z * mul)
	}

	//向量加法,加到第一个向量上
	static addToSelf(vec: Laya.Vector3, vec2: Laya.Vector3) {
		vec.x += vec2.x;
		vec.y += vec2.y;
		vec.z += vec2.z;
	}

	//向量加法创建新向量
	static added(vec: Laya.Vector3, vec2: Laya.Vector3): Laya.Vector3 {
		var newVec: Laya.Vector3 = new Laya.Vector3(vec.x + vec2.x, vec.y + vec2.y, vec.z + vec2.z)
		return newVec;
	}

	//向量减法 ,
	static reduceToSelf(vec: Laya.Vector3, vec2: Laya.Vector3) {
		vec.x -= vec2.x;
		vec.y -= vec2.y;
		vec.z -= vec2.z;
	}

	//copy一个点
	static copyVector(vec: Laya.Vector3) {
		return new Laya.Vector3(vec.x, vec.y, vec.z);
	}

}