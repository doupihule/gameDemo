export default class Equation3d {
	public static tempV31: Laya.Vector3 = new Laya.Vector3(0, 0, 0);
	public static tempV32: Laya.Vector3 = new Laya.Vector3(0, 0, 0);
	public static tempV33: Laya.Vector3 = new Laya.Vector3(0, 0, 0);

	/**
	 * 空间中射线和平面是否相交
	 * @param	ray   射线
	 * @param	plane 平面
	 * @param	out 相交点
	 */
	public static intersectsRayAndPlaneRP(ray: Laya.Ray, plane: Laya.Plane, out: Laya.Vector3) {
		var distance: any = {x: 0};
		if (!this.intersectsRayAndPlaneRD(ray, plane, distance)) {

			out.x = 0;
			out.y = 0;
			out.z = 0;
			return false;
		}

		Laya.Vector3.scale(ray.direction, distance.x, this.tempV31);
		Laya.Vector3.add(ray.origin, this.tempV31, this.tempV32);
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
	public static intersectsRayAndPlaneRD(ray: Laya.Ray, plane: Laya.Plane, out: any): Boolean {

		var planeNor: Laya.Vector3 = plane.normal;
		var direction: number = Laya.Vector3.dot(planeNor, ray.direction);
		if (Laya.MathUtils3D.isZero(direction)) {
			out.x = 0;
			return false;
		}

		var position: number = Laya.Vector3.dot(planeNor, ray.origin);
		out.x = (-plane.distance - position) / direction;

		if (out.x < 0) {
			out.x = 0;
			return false;
		}

		return true;
	}

	//临时射线
	public static _tempRay: Laya.Ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
	public static _tempPointV3: Laya.Vector3 = new Laya.Vector3(0, 0, 0);
	public static _tempPointV3_2: Laya.Vector3 = new Laya.Vector3(0, 0, 0);
	public static _tempPointV2: Laya.Vector2 = new Laya.Vector2(0, 0);

	//z为0的xy平面
	public static defaultPlane_xy_z0: Laya.Plane = Laya.Plane.createPlaneBy3P(new Laya.Vector3(0, 0, 0), new Laya.Vector3(1, 1, 0), new Laya.Vector3(1, 2, 0));

	//把舞台的坐标转化成3d坐标
	/**
	 *
	 * @param stagex  舞台坐标
	 * @param stagey
	 * @param camera  摄像机
	 * @param out      输出点
	 * @param plane    转化到哪个平面.
	 */
	public static turnV2ToV3(stagex, stagey, camera: Laya.Camera, out: Laya.Vector3 = null, plane: Laya.Plane = null) {
		this._tempPointV2.x = stagex
		this._tempPointV2.y = stagey
		camera.viewportPointToRay(this._tempPointV2, this._tempRay);
		//默认取z0平面
		if (!plane) {
			plane = this.defaultPlane_xy_z0;
		}
		if (!out) {
			out = new Laya.Vector3(0, 0, 0);
		}
		var rt = Equation3d.intersectsRayAndPlaneRP(this._tempRay, plane, out);
		return out;
	}

	//把3d坐标转化成2d坐标
	public static turnV3ToV2(x, y, z, camera: Laya.Camera, out: any) {
		var tempPoint: any = this._tempPointV3;
		if (!out) {
			out = new Laya.Vector3(0, 0, 0)
		}
		tempPoint.x = x
		tempPoint.y = y
		tempPoint.z = z
		camera.viewport.project(tempPoint, camera.projectionViewMatrix, out);

	}


}
