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
