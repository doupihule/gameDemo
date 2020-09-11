import { GameUtils, UnityEngine } from 'csharp';
import PlaneExpand from "../components/d3/PlaneExpand";


export default class VectorTools {

	static  createVec2(x=0,y=0){
		return {x:x,y:y};
	}
	static  createVec3(x=0,y=0,z=0){
		return {x:x,y:y,z:z};
	}

	//原点
	static originPoint: any = VectorTools.createVec3();
	//单位向量
	static unitPoint: any = VectorTools.createVec3(1, 1, 1);

	static  _tempVector4:any = {x:0,y:0,z:0,w:0}

	static  cloneTo(formV3:{x,y,z},toV3:{x,y,z} = null){
		if (!toV3){
			toV3 = this.createVec3();
		}
		toV3.x = formV3.x;
		toV3.y = formV3.y;
		toV3.z = formV3.z;
		return toV3;
	}


	//向量乘法
	static multyByNumToSelf(vec: any, mul: number) {
		vec.x = vec.x * mul;
		vec.y = vec.y * mul;
		vec.z = vec.z * mul;
	}

	//向量乘法 返回新向量
	static multyByNum(vec: any, mul: number): any {
		vec.x = vec.x * mul;
		vec.y = vec.y * mul;
		vec.z = vec.z * mul;
		return VectorTools.createVec3(vec.x * mul, vec.y * mul, vec.z * mul)
	}


	static distanceSquared(value1, value2) {
		var x = value1.x - value2.x;
		var y = value1.y - value2.y;
		var z = value1.z - value2.z;
		return (x * x) + (y * y) + (z * z);
	}
	static distance(value1, value2) {
		var x = value1.x - value2.x;
		var y = value1.y - value2.y;
		var z = value1.z - value2.z;
		return Math.sqrt((x * x) + (y * y) + (z * z));
	}
	static min(a, b, out) {
		out.x = Math.min(a.x, b.x);
		out.y = Math.min(a.y, b.y);
		out.z = Math.min(a.z, b.z);
	}
	static max(a, b, out) {
		out.x = Math.max(a.x, b.x);
		out.y = Math.max(a.y, b.y);
		out.z = Math.max(a.z, b.z);
	}
	static transformQuat(source, rotation, out) {
		var x = source.x, y = source.y, z = source.z, qx = rotation.x, qy = rotation.y, qz = rotation.z, qw = rotation.w, ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
		out.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
		out.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
		out.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
	}
	static scalarLength(a) {
		var x = a.x, y = a.y, z = a.z;
		return Math.sqrt(x * x + y * y + z * z);
	}
	static scalarLengthSquared(a) {
		var x = a.x, y = a.y, z = a.z;
		return x * x + y * y + z * z;
	}
	static normalize(s, out) {
		var x = s.x, y = s.y, z = s.z;
		var len = x * x + y * y + z * z;
		if (len > 0) {
			len = 1 / Math.sqrt(len);
			out.x = x * len;
			out.y = y * len;
			out.z = z * len;
		}
	}
	static multiply(a, b, out) {
		out.x = a.x * b.x;
		out.y = a.y * b.y;
		out.z = a.z * b.z;
	}
	static scale(a, b, out) {
		out.x = a.x * b;
		out.y = a.y * b;
		out.z = a.z * b;
	}
	static lerp(a, b, t, out) {
		var ax = a.x, ay = a.y, az = a.z;
		out.x = ax + t * (b.x - ax);
		out.y = ay + t * (b.y - ay);
		out.z = az + t * (b.z - az);
	}
	static transformV3ToV3(vector, transform, result) {
		var intermediate = VectorTools._tempVector4;
		VectorTools.transformV3ToV4(vector, transform, intermediate);
		result.x = intermediate.x;
		result.y = intermediate.y;
		result.z = intermediate.z;
	}
	static transformV3ToV4(vector, transform, result) {
		var vectorX = vector.x;
		var vectorY = vector.y;
		var vectorZ = vector.z;
		var transformElem = transform.elements;
		result.x = (vectorX * transformElem[0]) + (vectorY * transformElem[4]) + (vectorZ * transformElem[8]) + transformElem[12];
		result.y = (vectorX * transformElem[1]) + (vectorY * transformElem[5]) + (vectorZ * transformElem[9]) + transformElem[13];
		result.z = (vectorX * transformElem[2]) + (vectorY * transformElem[6]) + (vectorZ * transformElem[10]) + transformElem[14];
		result.w = (vectorX * transformElem[3]) + (vectorY * transformElem[7]) + (vectorZ * transformElem[11]) + transformElem[15];
	}
	static TransformNormal(normal, transform, result) {
		var normalX = normal.x;
		var normalY = normal.y;
		var normalZ = normal.z;
		var transformElem = transform.elements;
		result.x = (normalX * transformElem[0]) + (normalY * transformElem[4]) + (normalZ * transformElem[8]);
		result.y = (normalX * transformElem[1]) + (normalY * transformElem[5]) + (normalZ * transformElem[9]);
		result.z = (normalX * transformElem[2]) + (normalY * transformElem[6]) + (normalZ * transformElem[10]);
	}
	static transformCoordinate(coordinate, transform, result) {
		var coordinateX = coordinate.x;
		var coordinateY = coordinate.y;
		var coordinateZ = coordinate.z;
		var transformElem = transform.elements;
		var w = ((coordinateX * transformElem[3]) + (coordinateY * transformElem[7]) + (coordinateZ * transformElem[11]) + transformElem[15]);
		result.x = (coordinateX * transformElem[0]) + (coordinateY * transformElem[4]) + (coordinateZ * transformElem[8]) + transformElem[12] / w;
		result.y = (coordinateX * transformElem[1]) + (coordinateY * transformElem[5]) + (coordinateZ * transformElem[9]) + transformElem[13] / w;
		result.z = (coordinateX * transformElem[2]) + (coordinateY * transformElem[6]) + (coordinateZ * transformElem[10]) + transformElem[14] / w;
	}
	static Clamp(value, min, max, out) {
		var x = value.x;
		var y = value.y;
		var z = value.z;
		var mineX = min.x;
		var mineY = min.y;
		var mineZ = min.z;
		var maxeX = max.x;
		var maxeY = max.y;
		var maxeZ = max.z;
		x = (x > maxeX) ? maxeX : x;
		x = (x < mineX) ? mineX : x;
		y = (y > maxeY) ? maxeY : y;
		y = (y < mineY) ? mineY : y;
		z = (z > maxeZ) ? maxeZ : z;
		z = (z < mineZ) ? mineZ : z;
		out.x = x;
		out.y = y;
		out.z = z;
	}
	static add(a, b, out) {
		out.x = a.x + b.x;
		out.y = a.y + b.y;
		out.z = a.z + b.z;
	}
	static subtract(a, b, o) {
		o.x = a.x - b.x;
		o.y = a.y - b.y;
		o.z = a.z - b.z;
	}
	static cross(a, b, o) {
		var ax = a.x, ay = a.y, az = a.z, bx = b.x, by = b.y, bz = b.z;
		o.x = ay * bz - az * by;
		o.y = az * bx - ax * bz;
		o.z = ax * by - ay * bx;
	}
	static dot(a, b) {
		return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
	}



	//向量加法,加到第一个向量上
	static addToSelf(vec: any, vec2: any) {
		vec.x += vec2.x;
		vec.y += vec2.y;
		vec.z += vec2.z;
	}

	//向量加法创建新向量
	static added(vec: any, vec2: any): any {
		var newVec: any = VectorTools.createVec3(vec.x + vec2.x, vec.y + vec2.y, vec.z + vec2.z)
		return newVec;
	}

	//向量减法 ,
	static reduceToSelf(vec: any, vec2: any) {
		vec.x -= vec2.x;
		vec.y -= vec2.y;
		vec.z -= vec2.z;
	}

	//copy一个点
	static copyVector(vec: any) {
		return VectorTools.createVec3(vec.x, vec.y, vec.z);
	}

	public static tempV31:{x,y,z,} = VectorTools.createVec3();
	public static tempV32:{x,y,z,}  =  VectorTools.createVec3();
	public static tempV33:{x,y,z,}  =  VectorTools.createVec3();

	/**
	 * 空间中射线和平面是否相交
	 * @param	ray   射线
	 * @param	plane 平面
	 * @param	out 相交点
	 */
	public static intersectsRayAndPlaneRP(ray:any, plane:PlaneExpand, out:{x,y,z}){
		var distance:any = {x:0};
		if (!this.intersectsRayAndPlaneRD(ray, plane, distance)) {

			out.x =0;
			out.y =0;
			out.z =0;
			return false;
		}

		this.scale(ray.direction, distance.x, this.tempV31);
		this.add(ray.origin,this.tempV31, this.tempV32);
		out.x = this.tempV32.x
		out.y = this.tempV32.y
		out.z = this.tempV32.z
		return true;
	}

	/**
	 * 空间中射线和平面是否相交
	 * @param	ray   射线
	 * @param	plane 平面
	 * @param	out {x} 相交距离,如果为out.x为0,不相交
	 */
	public static  intersectsRayAndPlaneRD(ray:any, plane:PlaneExpand, out:any):Boolean {

		var planeNor:{x,y,z} = plane.normal;
		var direction:number = this.dot(planeNor, ray.direction);
		if (this.isZero(direction)) {
			out.x = 0;
			return false;
		}

		var position:number = this.dot(planeNor, ray.origin);
		out.x = (-plane.distance - position) / direction;

		if (out.x < 0) {
			out.x = 0;
			return false;
		}

		return true;
	}

	public  static  isZero(num:number){
		return Math.abs(num)< 0.00000001
	}

	//把v3转化为 c#端的vector3
	public static turnV3ToNativeV3(v3){
		return GameUtils.ViewExtensionMethods.initVec3(v3.x,v3.y,v3.z);
	}

}