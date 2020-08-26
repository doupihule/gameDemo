import FileUtils from "../utils/FileUtils";
import VersionManager from "../manager/VersionManager";
import LogsManager from "../manager/LogsManager";
import SubPackageConst from "../../game/sys/consts/SubPackageConst";
import GameConsts from "../../game/sys/consts/GameConsts";

export default class EngineExpand {


	//本地资源数组
	public static localResArr: string[] = [
		"MainScene.json",
		"static/",
		"version.json",
		"fileconfig.json",
		"layaNativeDir", "wxlocal"

	]

	static initEngineExpand() {
		if (FileUtils.isUserWXSource()) {
			this.initWXExpand();
		}
		//覆盖文件映射表 走自己的 不走 laya的了
		Laya.URL.customFormat = VersionManager.getVirtualUrl;
		this.MouseManager_runEvent();
		this.URL_formatURL();
		this.Scene3D_update_prototype();
		this.LoadImagerExpand();
		this.spineSkeletonExpand();
		if (GameConsts.isUsePhysics) {
			this.initPhysicsExpand();
		}
	}

	//微信相关的扩展
	private static initWXExpand() {
		this.MiniFileMgr_isLocalNativeFileExpand();
		this.AtlasInfoManager_getFileLoadPath();
		this.MiniFileMgr_getFileInfo();
	}


	//物理库相关的扩展
	private static initPhysicsExpand() {
		this._innerDerivePhysicsTransformation_expand();
	}


	private static spineSkeletonExpand() {
		if (!Laya.Templet) {
			return;
		}
		var old_func = Laya.Templet.prototype.deleteAniData;

		Laya.Templet.prototype.deleteAniData = function (aniIndex) {
			return;
		}
		var old_func2 = Laya.Skeleton.prototype["_update"];
		Laya.Skeleton.prototype["_update"] = function (autoKey) {
			//不在舞台就不执行刷新逻辑了
			if (!this.displayedInStage) {
				return;
			}
			old_func2.call(this, autoKey);
		}
	}

	private static LoadImagerExpand() {
		var old_func = Laya.Loader.prototype["_loadImage"];
		Laya.Loader.prototype["_loadImage"] = function (url, isformatURL = true) {
			old_func.call(this, url, true)
		}
	}


	private static MiniFileMgr_getFileInfo() {
		var old_func = Laya.MiniFileMgr.getFileInfo;
		//读取文件信息的时候需要多添加一步路径格式化判断
		Laya.MiniFileMgr.getFileInfo = (url) => {
			var info = old_func.call(Laya.MiniFileMgr, url);
			if (!info) {
				url = Laya.URL.formatURL(url);
				info = old_func.call(Laya.MiniFileMgr, url);
			}
			return info;
		}
	}


	private static old_isLocalNativeFile: Function;


	//判断是否是本地文件的接口扩展
	private static _nativeFileCheckCache: any = {};

	//重写判断是否是本地路径接口.
	private static MiniFileMgr_isLocalNativeFileExpand() {
		var old_isLocalNativeFile = Laya.MiniFileMgr.isLocalNativeFile;
		Laya.MiniFileMgr.isLocalNativeFile = function (url: string): boolean {
			return EngineExpand.isLocalNativeFileExpand(url)
		}
	}

	/*判断是否是本地文件的接口扩展*/
	private static isLocalNativeFileExpand(url: string) {
		//如果是有走cdn分包的
		if (EngineExpand._nativeFileCheckCache[url] != null) {
			return EngineExpand._nativeFileCheckCache[url];
		}

		var result = false;
		//如果是一个cdnurl 返回false
		if (EngineExpand.checkFileIsCdn(url)) {
			//如果路径已经包含本地缓存路径
			result = false;
		} else {
			result = true;
		}


		EngineExpand._nativeFileCheckCache[url] = result
		return result
	}

	//判断资源是否是走cdn下载的
	private static checkFileIsCdn(url) {

		if (url.indexOf("version.json") != -1) {
			return false;
		}
		//只有图片会走cdn
		// if(url.indexOf(".jpg")== -1 && url.indexOf(".png") == -1){
		//     return false;
		// }

		var subPackConst = SubPackageConst.subPackData;
		for (var i in subPackConst) {
			var info = subPackConst[i];
			//必须是走cdn的
			if (info.style == SubPackageConst.PATH_STYLE_CDN) {
				var path = info.path;
				//如果是包含这个路径说明是走远端cdn的
				if (path && url.indexOf(path) != -1) {
					return true;
				}

			}
		}
		return false;
	}


	/**重写根据资源路径获取atlas路径的方法，将新的atlas路径返回 */
	private static AtlasInfoManager_getFileLoadPath() {
		// var old_getFileLoadPath = laya.net.AtlasInfoManager.getFileLoadPath;
		// laya.net.AtlasInfoManager.getFileLoadPath = function(file:string):string{
		//     var filePath = old_getFileLoadPath(file);
		//     filePath = SubPackageManager.getNewAtlasPath(filePath);
		//     return filePath
		// }
	}

	//重写鼠标事件 touchstart
	private static MouseManager_runEvent() {
		this.SingletonList_expand();
		var old_func = Laya.MouseManager.prototype.runEvent;
		Laya.MouseManager.prototype.runEvent = function (evt): void {
			//当游戏加载资源卡顿的时候,某一时刻 touchend事件不会触发.此时又可以继续触发 touchstart,导致 _curTouchID 错乱 后面所有的触摸事件失效.必现
			if (evt.type == "touchstart") {
				this._curTouchID = NaN
			}
			old_func.call(this, evt);
		}
	}

	//重写scene3D update函数
	private static Scene3D_update_prototype() {
		if (!Laya.Scene3D) {
			return;
		}
		var old_func = Laya.Scene3D.prototype["_update"];
		Laya.Scene3D.prototype["_update"] = function (): void {
			//如果是带物理的场景 走底层的 , 走底层函数
			if (this._physicsSimulation) {
				old_func.call(this);
			} else {
				//因为我们的ui里面会嵌入 scene3D场景. 底层的物理引擎判断没做 _physicsSimulation兼容会导致报错
				var delta = this.timer._delta / 1000;
				this._time += delta;
				this._updateScript();
				Laya.Animator._update(this);
				this._lateUpdateScript();
			}

		}
	}

	//扩展 判断是否是错误函数的接口
	private static MiniFileMgr_checkIsWrongFile() {

	}


	/**解决因为卡顿在触摸期间导致的bug*/
	private static SingletonList_expand() {
		if (!Laya.SingletonList) {
			return;
		}
		Laya.SingletonList.prototype["_remove"] = function (index) {
			// @xd added, 如果index == -1 不执行
			if (index == -1) {
				return;
			}

			this.length--;
			if (index !== this.length) {
				var end = this.elements[this.length];
				// @xd added, 添加end是存存在判断
				if (end) {
					this.elements[index] = end;
					end._setIndexInList(index);
				}

			}
		}

		var old_func = Laya.SimpleSingletonList.prototype.add;
		Laya.SimpleSingletonList.prototype.add = function (element) {
			var index = element._getIndexInList();
			//@xd add, 添加安全性判断.
			if (index !== -1) {
				LogsManager.echo("SimpleSingletonList:element has  in  SingletonList.");
				return;
			}

			old_func.call(this, element);
		}

		var old_func2 = Laya.SimpleSingletonList.prototype.remove;
		Laya.SimpleSingletonList.prototype.remove = function (element) {
			var index = element._getIndexInList();
			this.length--;
			if (index !== this.length) {
				var end = this.elements[this.length];
				if (end) {
					this.elements[index] = end;
					end._setIndexInList(index);
				} else {
					LogsManager.echo("SimpleSingletonList:element has  in  SingletonList.");
				}
			}
			element._setIndexInList(-1);
		}

	}

	//重写格式化url.添加缓存机制, 防止重复格式化url造成性能问题 因为一个3D场景 里面合起来有60多个文件 每次加载资源会反复走好几次formaturl
	private static URL_formatURL() {
		Laya.URL["_cacheFormat"] = {}
		Laya.URL.formatURL = function (url) {
			var tempUrl = url
			if (this._cacheFormat[tempUrl]) {
				return this._cacheFormat[tempUrl];
			}
			var resultStr: string;
			if (!url) {
				resultStr = "null path"
			} else if (url.indexOf(":") > 0) {
				this._cacheFormat[tempUrl] = url;
				return url
			} else {
				if (Laya.URL.customFormat != null) url = Laya.URL.customFormat(url);
				//@xd add  添加是否是本地文件判断.
				//所有平台都要判断是否是本地url判断
				if (EngineExpand.isLocalNativeFileExpand(url)) {
					resultStr = url;
					this._cacheFormat[url] = resultStr
					return resultStr;
				}
				if (url.indexOf(":") > 0) {
					this._cacheFormat[tempUrl] = url;
					return url
				}
				var char1 = url.charAt(0);
				if (char1 === ".") {
					this._cacheFormat[tempUrl] = Laya.URL._formatRelativePath(Laya.URL.basePath + url)
					return this._cacheFormat[tempUrl];
				} else if (char1 === '~') {
					this._cacheFormat[tempUrl] = Laya.URL.rootPath + url.substring(1)
					return this._cacheFormat[tempUrl];
				} else if (char1 === "d") {
					if (url.indexOf("data:image") === 0) {
						this._cacheFormat[tempUrl] = url;
						return url;
					}
				} else if (char1 === "/") {
					this._cacheFormat[tempUrl] = url;
					return url;
				}
			}
			this._cacheFormat[tempUrl] = Laya.URL.basePath + url
			return this._cacheFormat[tempUrl];

		}
	}

	/**解决因为卡顿在触摸期间导致的bug*/
	private static _innerDerivePhysicsTransformation_expand() {

		Laya.PhysicsComponent.prototype["_innerDerivePhysicsTransformation"] = function (physicTransformOut, force) {
			var bt = Laya.Physics3D["_bullet"];
			var transform = this.owner._transform;
			var rotation = transform.rotation;
			var scale = transform.getWorldLossyScale();
			if (force || this._getTransformFlag(Laya.Transform3D["TRANSFORM_WORLDPOSITION"])) {
				var shapeOffset = this._colliderShape.localOffset;
				var position = transform.position;
				var btPosition = Laya.PhysicsComponent["_btVector30"];
				if (shapeOffset.x !== 0 || shapeOffset.y !== 0 || shapeOffset.z !== 0) {
					var physicPosition = Laya.PhysicsComponent["_tempVector30"];
					//新
					// if(this._colliderShape.flag){

					if (!this._colliderShape.preScale)
						this._colliderShape.preScale = new Laya.Vector3(1, 1, 1);

					var preScale = this._colliderShape.preScale;
					preScale.x = 1 / preScale.x;
					preScale.y = 1 / preScale.y;
					preScale.z = 1 / preScale.z;
					Laya.Vector3.multiply(scale, preScale, preScale);
					Laya.Vector3.multiply(shapeOffset, preScale, shapeOffset);
					preScale.x = scale.x;
					preScale.y = scale.y;
					preScale.z = scale.z;
					// }
					// shapeOffset = physicPosition;
					Laya.Vector3.transformQuat(shapeOffset, rotation, physicPosition);

					// // 原
					// Vector3.transformQuat(shapeOffset, rotation, physicPosition);
					// Vector3.multiply(physicPosition, scale, physicPosition);
					Laya.Vector3.add(position, physicPosition, physicPosition);
					bt.btVector3_setValue(btPosition, -physicPosition.x, physicPosition.y, physicPosition.z);
				} else {
					bt.btVector3_setValue(btPosition, -position.x, position.y, position.z);
				}
				bt.btTransform_setOrigin(physicTransformOut, btPosition);
				this._setTransformFlag(Laya.Transform3D["TRANSFORM_WORLDPOSITION"], false);
			}
			if (force || this._getTransformFlag(Laya.Transform3D["TRANSFORM_WORLDQUATERNION"])) {
				var shapeRotation = this._colliderShape.localRotation;
				var btRotation = Laya.PhysicsComponent["_btQuaternion0"];
				if (shapeRotation.x !== 0 || shapeRotation.y !== 0 || shapeRotation.z !== 0 || shapeRotation.w !== 1) {
					var physicRotation = Laya.PhysicsComponent["_tempQuaternion0"];
					Laya.PhysicsComponent["physicQuaternionMultiply"](rotation.x, rotation.y, rotation.z, rotation.w, shapeRotation, physicRotation);
					bt.btQuaternion_setValue(btRotation, -physicRotation.x, physicRotation.y, physicRotation.z, -physicRotation.w);
				} else {
					bt.btQuaternion_setValue(btRotation, -rotation.x, rotation.y, rotation.z, -rotation.w);
				}
				bt.btTransform_setRotation(physicTransformOut, btRotation);
				this._setTransformFlag(Laya.Transform3D["TRANSFORM_WORLDQUATERNION"], false);
			}
			if (force || this._getTransformFlag(Laya.Transform3D["TRANSFORM_WORLDSCALE"])) {
				this._onScaleChange(transform.getWorldLossyScale());
				this._setTransformFlag(Laya.Transform3D["TRANSFORM_WORLDSCALE"], false);
			}
		}
	}


}