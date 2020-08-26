import InstanceMoveEntity from "./InstanceMoveEntity";

export default class InstanceMoveMultyEntity {
	/**
	 * 多点运动对象
	 * 
	 */
	currentStep:number = 0; //当前运动到的点的位置,
	totalStep:number; 		//总长度
	pointArr:Laya.Vector3[]; 	// 点的数组
	spd:number ;
	callFunc;
	thisObj;
	isGrid:boolean =false ;	//是否是按照网格点

	loopParams:any ; 	//循环方式 默认为0 不循环.1来回循环 ,
	currentEntity:InstanceMoveEntity; 	//当前的运动参数.
	currentLoopIndex:number =0;
	expandParams:any[]		//扩展数据的数组,每个点单独对应扩展数据 如果长度为1 表示所有点都对应这个扩展数据
	

	public constructor() {
	}

	/**
	 * @loopParams 默认为空
	 * 	@@ loopNums = 0 表示无线循环 ,对应的loopNums表示单程循环次数
	 */
	public initData(pointArr:Laya.Vector3[],speed:number =0,callFunc:any=null,thisObj:any=null,loopParams:any = null,isGrid = false){
		this.pointArr = pointArr;
		this.spd = speed;
		this.callFunc = callFunc;
		this.thisObj = thisObj;
		this.totalStep = this.pointArr.length;
		this.currentEntity = new InstanceMoveEntity(pointArr[1],speed);
		this.loopParams = loopParams;
		this.isGrid = isGrid;
		this.currentStep  =0;
	}

	getNextpos():InstanceMoveEntity{
		this.currentStep +=1;
		if(this.loopParams ){
			return  this.getLoopPos();
		}
		//如果到达了 那么返回空
		if(this.currentStep == this.totalStep+1){
			
			//后面扩展循环运动,.
			return null;
		}
		this.currentEntity.target = this.pointArr[this.currentStep-1];
		if(this.expandParams && this.expandParams.length > 0){
			if(this.expandParams.length == 1){
				this.currentEntity.expandParams = this.expandParams[0];
			} else {
				this.currentEntity.expandParams = this.expandParams[this.currentStep-1];
			}
			
		}

		return this.currentEntity;
	}
	//获取循环方式获得的坐标
	getLoopPos(){
		var roundNum:number = Math.floor(this.currentStep/this.totalStep);
		var pos:number = this.currentStep % this.totalStep;
		//如果是单线
		if(roundNum %2 == 0){
			
			this.currentEntity.target = this.pointArr[pos];
		} else{
			this.currentEntity.target = this.pointArr[this.totalStep-pos-1];
		}
		return this.currentEntity
	}

	//销毁
	dispose(){
		this.currentEntity = null;
		this.callFunc = null;
		this.thisObj = null;
	}

}