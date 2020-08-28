import FogLogicalControler from "./FogLogicalControler";
import FogFunc from "../../sys/func/FogFunc";
import FogModel from "../../sys/model/FogModel";
import FogConst from "../../sys/consts/FogConst";
import RandomUtis from "../../../framework/utils/RandomUtis";
import LogsManager from "../../../framework/manager/LogsManager";

/**总控制器 */
export default class FogMistControler {
	protected controler: FogLogicalControler;

	//迷雾数据 为了遍历性能 初始化就存一份数据 .
	/**
	 * [
	 *    0,0,0,0,1,0
	 *    0,1,0,0,1,            类似这种数据结构
	 *
	 *
	 * ]
	 *
	 *
	 *
	 */
	protected _mistsData: any[];

	constructor(controler: FogLogicalControler) {
		this.controler = controler;
		this._mistsData = []
	}

	//迷雾管理器
	//缓动时间
	private static tweenTime: number = 800;


	//边相对应中心的偏移坐标. 迷雾周边8个格子 分为4个边 4个角
	private static borderToPos: any[] = [
		[0, 1], [1, 0], [0, -1], [-1, 0],
	]


	//顶点相对应的中心偏移坐标
	private static vecToPos: any[] = [
		[1, 1], [1, -1], [-1, -1], [-1, 1]
	];

	//边相邻的角 序号
	private static borderToVecIndex: any[] = [
		[3, 0],
		[0, 1],
		[1, 2],
		[2, 3]
	]


	//周围一圈8个点
	public static rectNearPoints: any[] = [
		[-1, 1], [0, 1], [1, 1],
		[-1, 0], [1, 0],
		[-1, -1], [0, -1], [1, -1],
	]


	//根据缺失的点数判断用哪个图片 以及对应角度 以及对应的套数
	private static imageToRotation: any = {
		"0": [0, 2],
		"1": [0, 1],
		"2_1": [0, 1],
		"2_2": [180, 1],
		"3": [-90, 3],
		"4": [0, 4],
	}

	private static imageToNums: any = []


	//初始化迷雾数据
	public initMistData() {
		var xNums: number = FogFunc.line;
		var yNums: number = FogFunc.row;
		for (var j = 0; j <= yNums; j++) {
			this._mistsData[j] = []
			for (var i = 0; i <= xNums; i++) {

				var data = FogModel.instance.getCellInfoById(i + "_" + j);
				if (i == 2 && j == 6) {
					LogsManager.echo("kasjdkasd", data);
				}
				if (!data) {
					this._mistsData[j][i] = false;
				} else {
					//true表示解锁 false表示未解锁区域
					if (data.ste && data.ste == FogConst.FOG_CELLSTATE_OPEN) {
						this._mistsData[j][i] = true;
					} else {
						this._mistsData[j][i] = false;
					}
				}
			}
		}

	}

	//定义临时 边角 检测数组
	private _tempBorderResultArr: boolean[] = [false, false, false, false];
	private _tempVectorResultArr: boolean[] = [false, false, false, false];

	// isInit是否是初始化 非初始化需要做渐变缓动 增强表现
	public turnOneCellView(img: ImageExpand, lastImg: ImageExpand, x: number, y: number, isInit: boolean = false) {
		if (!isInit) {
			Laya.Tween.clearAll(img);
		}
		var lb: Laya.Label = img["__label"];
		//@xd_test
		// if(!lb){
		//     lb = new Laya.Label();
		//     img["__label"] = lb;
		//     img.parent.addChild(lb);
		//     lb.width = 100;
		//     lb.zOrder = 1000;
		//     lb.height = 100;
		//     lb.anchorX  = 0.5;
		//     lb.fontSize  =20;
		//     lb.anchorY  =0.5;
		//     lb.strokeColor = "#ffff00";
		//     lb.y = 64
		// }

		// lb.rotation = -img.rotation
		//先遍历四边是否有解锁的格子
		//如果自己已经解锁了 那么清空皮肤
		img.alpha = 1;
		lastImg.visible = false;
		if (this.getOneCellState(x, y)) {
			if (isInit) {
				img.visible = false
			} else {
				Laya.Tween.to(img, {alpha: 0}, FogMistControler.tweenTime, null, Laya.Handler.create(this, () => {
					img.visible = false;
				}))
			}

			lb && (lb.text = x + "_" + y + "_unlock");
			return;
		}
		img.visible = true;
		var i = 0;
		var borderToPos = FogMistControler.borderToPos;
		var len = borderToPos.length;
		var tempArr;

		var vecUnLockNums: number = 0;

		var rt: boolean;
		var tempVectorResultArr = this._tempVectorResultArr;

		//先初始化全为false
		for (i = 0; i < tempVectorResultArr.length; i++) {
			tempVectorResultArr[i] = false;
		}

		//记录四边状态
		for (i = 0; i < len; i++) {
			tempArr = borderToPos[i];
			rt = this.getOneCellState(x + tempArr[0], y + tempArr[1]);
			// this._tempBorderResultArr[i] = rt;
			if (rt) {
				//一条边相当于2个点解锁
				var borderToVecArr = FogMistControler.borderToVecIndex[i];
				if (!tempVectorResultArr[borderToVecArr[0]]) {
					tempVectorResultArr[borderToVecArr[0]] = true;
					vecUnLockNums++;
				}
				if (!tempVectorResultArr[borderToVecArr[1]]) {
					tempVectorResultArr[borderToVecArr[1]] = true;
					vecUnLockNums++;
				}
			}
		}
		var vecToPos = FogMistControler.vecToPos
		//记录四个顶点的状态
		for (i = 0; i < len; i++) {
			tempArr = vecToPos[i];
			rt = this.getOneCellState(x + tempArr[0], y + tempArr[1]);
			if (rt) {
				if (!tempVectorResultArr[i]) {
					tempVectorResultArr[i] = rt;
					vecUnLockNums++;
				}
			}
		}

		lb && (lb.text = x + "_" + y + "_v:" + this.getDebugText());

		//刷新迷雾
		this.refreshMistByResult(img, lastImg, vecUnLockNums, x, y, isInit);
	}

	private getDebugText() {
		var tempVectorResultArr = this._tempVectorResultArr;
		var str = "";
		for (var i = 0; i < tempVectorResultArr.length; i++) {
			str += (tempVectorResultArr[i] == false && "0" || 1);
		}
		return str;
	}

	//微暗矩阵
	private static littledarkMatrix: any[] = [
		0.6, 0, 0, 0, 0,
		0, 0.6, 0, 0, 0,
		0, 0, 0.6, 0, 0,
		0, 0, 0, 1, 0,
	]

	//刷新迷雾
	private refreshMistByResult(img: ImageExpand, lastImg: ImageExpand, vecUnLockNums: number, x, y, isInit: boolean) {
		//这里就根据解锁的数量去判断应该怎么显示
		//不缺角, 缺1角, 缺2角, 缺对角,缺3角, 缺4角
		var cloudKey: string;
		var way: number = 0;// 方位 1-4;


		var tempVectorResultArr = this._tempVectorResultArr;
		var len: number = tempVectorResultArr.length;
		var i: number;
		// DisplayUtils.clearViewFilter(img);
		if (vecUnLockNums == 0) {
			cloudKey = "0";
			// DisplayUtils.setViewMatrixByMatirx(img,FogMistControler.littledarkMatrix);
		} else if (vecUnLockNums == 1) {
			way = tempVectorResultArr.indexOf(true);
			cloudKey = "1";
		} else if (vecUnLockNums == 2) {
			//如果对边
			if ((tempVectorResultArr[0] == tempVectorResultArr[2]) && (tempVectorResultArr[1] == tempVectorResultArr[3])) {
				//对边的key
				cloudKey = "2_2"
				if (tempVectorResultArr[0] == true) {
					way = 0;
				} else {
					way = 2;
				}
			} else {
				cloudKey = "2_1"
				//如果是 0,3 缺
				if (tempVectorResultArr[0] == true && tempVectorResultArr[3] == true) {
					way = 0;
				} else if (tempVectorResultArr[0] == true && tempVectorResultArr[1] == true) {
					way = 1;
				} else if (tempVectorResultArr[1] == true && tempVectorResultArr[2] == true) {
					way = 2;
				} else if (tempVectorResultArr[2] == true && tempVectorResultArr[3] == true) {
					way = 3;
				}

			}
		} else if (vecUnLockNums == 3) {
			cloudKey = "3";
			way = tempVectorResultArr.indexOf(false);
		} else if (vecUnLockNums == 4) {
			//
			cloudKey = "4";
			way = 0;
		}
		//计算需要旋转的角度
		var rotation = FogMistControler.imageToRotation[cloudKey][0] + way * 90
		img.rotation = rotation;
		var skinNums: number = FogMistControler.imageToRotation[cloudKey][1];
		//随机取一个序号
		var random = RandomUtis.getOneRandomInt(skinNums + 1, 1);
		var skinName = "fog/fog/fog_mist_" + cloudKey + "_" + random + ".png";
		if (img.skin != skinName) {

			img.alpha = 1;
			lastImg.visible = true;
			if (isInit) {
				img.skin = skinName;

			} else {
				//非初始化 做一个缓动效果

				// img.skin = skinName;

				lastImg.alpha = 1;
				lastImg.skin = img.skin;
				// img.alpha = 0.5;
				img.skin = skinName;
				// Laya.Tween.to(lastImg,{alpha:0},FogMistControler.tweenTime);
				Laya.Tween.clearAll(lastImg);
				Laya.Tween.to(lastImg, {alpha: 0}, FogMistControler.tweenTime, null, Laya.Handler.create(this, () => {
					lastImg.visible = false;
				}));

			}


		}

		// LogsManager.echo("xy:"+x+"_,"+y+ ",key:"+cloudKey+"_way:"+way +"_index:"+random,"__", tempVectorResultArr);
	}


	/**获取一个格子的迷雾状态 ,false是未解锁,true是解锁 */
	private getOneCellState(x: number, y: number) {
		if (!this._mistsData[y]) {
			return false
		}
		return this._mistsData[y][x];
	}

	//解锁一个格子
	public onLockOneCell(x: number, y: number) {
		this._mistsData[y][x] = true;
	}


	dispose() {
		this.controler = null;
	}

}
