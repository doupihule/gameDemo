
import  {Resource,UnityEngine} from "csharp";


export default class ResourceManager {

	private static uiPrefabPath:string = "Assets/UI/Prefabs/"
	private static  spinePrefabPath:string = "Assets/Animation/Prefabs/"

	public constructor() {
	}

	private static _instance: ResourceManager;
	public static PATHHEAD: string = "LayaScene_";          //laya 场景
	public static resplatform: string = "Conventional";  //资源平台

	public static SPINEPATH: string = "spine";  //2d骨骼动画路径


	static get instance(): ResourceManager {
		if (!ResourceManager._instance) {
			ResourceManager._instance = new ResourceManager();
		}
		return ResourceManager._instance;
	}


	//加载多个3dmodel 以及场景
	//示例:loadMult3dmodel(["role_001","role_101","effect_110"],"scene_battle");
	// params 自带的回调参数
	static loadMult3dmodel(models: string[], sceneModel = null, callBack = null, thisObj = null, params = null) {

	}

	//判断是否3d模块需要分包
	private static check3dIsSubpack() {
		return false
	}


	//加载一个3dmodel
	static load3dmodel(modelName, isScene: boolean, callBack, thisObj, params = null) {

	}

	//获取一个3dmodel的分包名
	static get3dodelPackName(modelName: string) {
		return this.PATHHEAD + modelName;
	}

	//获取3d模型的url,比如传入 role_1001  返回 3dmodel/LayaScene_role_1001/Conventional/role_1001.lh
	//isScene  如果是场景 返回ls 否则返回lh
	static get3dmodelUrl(modelName, isScene: boolean = false) {
		var houzhui = isScene && ".ls" || ".lh"
		return this.get3DModelPath(modelName) + "/" + this.PATHHEAD + modelName + "/" + this.resplatform + "/" + modelName + houzhui;
	}

	//获取一个3demol的sprite3D对象.根据业务逻辑自己去clone withClone 是否克隆.原则上都需要克隆 默认false;
	static get3dmodelRes(modelName,shortPath:string,  boundlename:string,outclone:boolean =false) {
		var targetPath = "Assets/Model3d/"+shortPath+"/Prefabs/"+modelName +".prefab";
		LogsManager.echo("targetPath",targetPath);
		var obj =Resource.ResourceManager.Instance.luaLoadAsset(targetPath, targetPath, boundlename);
		if (!outclone){
			return obj;
		}
		return UnityEngine.Object.Instantiate(obj);
	}





	//加载一个spine动画  根据spine动画名字作为动态分包 ,回调参数顺序:  callback(ani,params); 会把 动画对象放到回调里面
	//  ani  是 Laya.Skeleton对象
	//这个接口废弃
	static loadSpine(spineName, callBack, thisObj, params = null, needChangeSkin = false) {


	}

	//获取spine对应的分包 因为考虑到如果有组的分包
	public static getSpineSubpack(shortName: string) {
		return ""
	}

	//获取spine的路径
	public static getSpinePath(shortName: string) {
		return ""
	}


	//获取spineskurl
	public static getSpineSkUrl(shortName: string) {
		return this.getSpinePath(shortName) + shortName + ".sk"
	}



	// needChangeSkin 是否需要换装 默认false 不换砖. 换装会占用更多的模版内存
	private static createSpineAni(spineName, needChangeSkin = false) {
		return null;
	}

	//获取一个3d模型的路径 不带Layascene的 model
	public static get3DModelPath(model) {
		return "3dmodels"
	}

	//获取文本资源
	public  static  getResTxt(path,bounlde = "textab"){
		return "";
	}

	//获取文件buffer
	public  static  getResBuffer(path,boundle:string ){
		return  new  ArrayBuffer(10);
	}

	//获取uiprefab
	public  static loadUIPrefab(name, boundlename:string ){
		var path =this.uiPrefabPath + name+ ".prefab";
		var obj =Resource.ResourceManager.Instance.luaLoadAsset(path, path, boundlename);
		return UnityEngine.Object.Instantiate(obj);
	}

	public  static  loadSpinePrefab(name, boundlename){
		var path =this.spinePrefabPath + name+ ".prefab";
		var obj =Resource.ResourceManager.Instance.luaLoadAsset(path, path, boundlename);
		if (!obj){
			window["LogsManager"].errorTag("spineError","没有找到对应的spine:"+name+"_用临时spine替代effect_jidi_attack_hit");
			name ="effect_jidi_attack_hit";
			path =this.spinePrefabPath + name+ ".prefab";
			obj =Resource.ResourceManager.Instance.luaLoadAsset(path, path, boundlename);
		}
		return UnityEngine.Object.Instantiate(obj);
	}

	//获取对应的Sprite对象
	public  static  loadSprite(imageurl, boundlename:string ){
		if (!imageurl){
			window["LogsManager"].errorTag("nullImageUrl","ResourceManager.loadSprite");
			return null;
		}
		var path = imageurl+ "png";
		var sp =Resource.ResourceManager.Instance.luaLoadAsset(path, path, boundlename);
		if (!sp){
			window["LogsManager"].errorTag("spriteError", path +"加载失败");
		}
		return UnityEngine.Object.Instantiate(sp);
	}



}