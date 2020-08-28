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


	static  subtract(a:any,b:any,out:any){
		out.x = a.x-b.x;
		out.y = a.y-b.y;
		out.z = a.z-b.z;
	}

	static  scalarLength(a:any){
		return Math.sqrt(a.x*a.x+a.y*a.y+a.z*a.z);
	}

	static  normalize(a:{x,y,z},out:{x,y,z}){
		var leng:number = this.scalarLength(a);
		out.x = a.x/leng;
		out.y = a.y/leng;
		out.z = a.z/leng;
	}
	static  scale(a:{x,y,z},scale:number, out:{x,y,z}){
		out.x = a.x * scale;
		out.y = a.y * scale;
		out.z = a.z * scale;

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

}