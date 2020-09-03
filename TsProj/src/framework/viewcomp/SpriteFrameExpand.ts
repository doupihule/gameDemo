
import BaseContainer from "../components/BaseContainer";
//序列帧动画扩展
export default class SpriteFrameExpand extends BaseContainer {

	//缓存的帧数据
	/**
	 * {
	 *  imageurl: {
	 *      frame:
	 *      group:
	 *  }
	 * }
	 *
	 */
	private static _cacheFrameData: any = {};

	//子对象
	private _childView: ImageExpand;

	private _imagePath: string;
	private _imageHead: string;
	private _labelsData: any[];

	private _fullPath: string;

	private _labelMapData: any;

	//当前动作标签数据
	private _currentLabelData: any;

	//当前的标签
	public currentLabel: string;
	//当前的标签动作序号
	public currentIndex: number = 0;

	//当前的帧数
	public currentFrame: number = 0;

	//帧序号 表示当前显示的是哪一个图片 和currentFrame是有区别的
	private frameIndex: number = 0;

	//当前动作总帧数
	public totalFrame: number = 1;


	//起始帧 和结束帧
	private _startFrame: number = 0;
	private _endFrame: number = -1;

	//播放速度
	public playSpeed: number = 1;

	private _playState: number = 0;  //0暂停 1播放

	//坐标偏移表
	private _offsetMap: any = null;
	private _isLoop: boolean = false;

	//创建 序列帧扩展 type 1表示标准格式的序列帧配置 2表示精简格式的序列帧配置
	constructor() {
		super();
		this._childView = ViewTools.createImage("");
		this.addChild(this._childView);
		// this.on(Laya.Event.DISPLAY, this, this.onAddToStage);
		// this.on(Laya.Event.UNDISPLAY, this, this.onRemoveStage);
	}

	//设置数据
	public setFrameData(imagePath: string, imageHead: string, labelsArr: any[] = null, anchorX: number = 0.5, anchorY: number = 0.5, type: number = 1, offsetMap: any = null) {
		this._imageHead = imageHead;
		this._imagePath = imagePath;

		this._fullPath = imagePath + imageHead;
		this._labelMapData = {};
		this._offsetMap = offsetMap
		labelsArr = this.turnShortLabelData(labelsArr, type);
		this._labelsData = labelsArr;


	}


	//转化精简数据
	//最终转化 [1,1,2,2,3,3,.....]这种完整格式.提高计算性能 ,同时对url做缓存
	private turnShortLabelData(sourceLabel: any[], frameType: number) {
		//先判断缓存
		var rtArr: any[] = SpriteFrameExpand._cacheFrameData[this._fullPath];
		if (rtArr) {
			return rtArr;
		}
		rtArr = [];
		SpriteFrameExpand._cacheFrameData[this._fullPath] = rtArr;
		//这里对格式进行单独处理
		var i = 0;
		for (i = 0; i < sourceLabel.length; i++) {
			var tempInfo = sourceLabel[i];
			var groupArr: any[] = [];
			var tempArr = tempInfo.group
			var offsetArr = tempInfo.offset;
			var lastFrame: number;
			var rtOffsetArr: any[] = []
			if (frameType == 2) {
				var startFrame: number = Number(tempArr[0]);
				var endFrame: number = Number(tempArr[1]);
				// lastFrame = tempArr[2] || (GameConsts.gameFrameRate/30);
				lastFrame = 6;

				for (var s = startFrame; s <= endFrame; s++) {
					for (var m = 0; m < lastFrame; m++) {
						var len = groupArr.length
						groupArr.push(s);
						if (offsetArr) {
							rtOffsetArr.push(offsetArr[len] || 0)
							rtOffsetArr.push(offsetArr[len + 1] || 0)
						}

					}
				}
			} else {
				//如果是标准版数据
				var tempFrameArr = tempInfo.frame;
				for (var g = 0; g < tempArr.length; g++) {
					if (tempFrameArr) {
						lastFrame = tempFrameArr[g] || 1
					} else {
						lastFrame = 1;
					}
					for (var gg = 0; gg < lastFrame; gg++) {
						groupArr.push(tempArr[g]);
						if (offsetArr) {
							rtOffsetArr.push(offsetArr[g])
							rtOffsetArr.push(offsetArr[g + 1])
						}
					}
				}
			}

			//转化成完整格式
			var tempObj = {
				label: tempInfo.label,
				group: groupArr,
				offset: rtOffsetArr
			}
			rtArr.push(tempObj);

		}
		return rtArr;
	}

	/*按照标签播放动画 */
	public playByLabel(label: string, isLoop: boolean, startFrame: number = 1, endFrame: number = -1) {
		this.currentLabel = label;
		for (var i = 0; i < this._labelsData.length; i++) {
			var tempInfo = this._labelsData[i];
			if (tempInfo.label == label) {
				this.playByIndex(i, isLoop, startFrame, endFrame);
				return;
			}
		}

		LogsManager.errorTag("labelError", "没有这个动作标签数据,label:", label, "_path:", this._fullPath);
	}

	/*按照动作序号播放 从序号0开始*/
	public playByIndex(index: number, isLoop: boolean, startFrame: number = 0, endFrame: number = 0) {
		if (index > this._labelsData.length) {
			LogsManager.errorTag("labelIndexError", "动作序号超出了index:", index, "_path:", this._fullPath)
			return;
		}
		this._playState = 1;
		this.initLabelData(index);
		if (endFrame <= 0 || endFrame > this.totalFrame) {
			this._endFrame = this.totalFrame;
		} else {
			this._endFrame = endFrame;
		}
		this._startFrame = startFrame;
		this.currentFrame = startFrame;
		this._isLoop = isLoop;
		this.showView();

	}

	// 初始化标签数据
	private initLabelData(index: number) {
		var labelData = this._labelsData[index];
		this.currentLabel = labelData.label;
		this._currentLabelData = labelData;
		this.totalFrame = labelData.group.length;
	}

	//紧紧改变标签
	public onlyChangeLabel(label: string) {
		this.currentLabel = label;
		for (var i = 0; i < this._labelsData.length; i++) {
			var tempInfo = this._labelsData[i];
			if (tempInfo.label == label) {
				this.initLabelData(i);
				return;
			}
		}
	}

	//显示视图
	private showView() {
		var group: any[] = this._currentLabelData.group;
		var offset: any = this._offsetMap;
		var index: number;
		var targetFrame = Math.floor(this.currentFrame);
		if (targetFrame >= group.length) {
			index = group.length - 1
		} else {
			index = targetFrame
		}
		//设置皮肤
		var frameIndex = group[index]
		this._childView.setSkin( this._fullPath + frameIndex + ".png");
		if (offset) {
			var posArr = offset[frameIndex];
			if (posArr) {
				this._childView.x = posArr[0]
				this._childView.y = posArr[1]
			}

		}

	}


	/**刷新函数 */
	protected updateFrame() {
		//如果是暂停状态 不执行
		if (this._playState == 0) {
			return;
		}
		this.currentFrame += this.playSpeed;
		var dt = this.currentFrame - this._endFrame
		//如果已经是最后一帧了计算差值 从头开始算起 并记录这个差值
		if (dt >= 0) {
			//必须是循环才这样处理
			if (this._isLoop) {
				this.currentFrame = this._startFrame + dt;
			}

		}
		//显示视图
		this.showView();

	}

	/**当被添加到舞台时 注册循环刷新函数 */
	protected onAddToStage() {
		//采用这个是因为 这个算法有追帧逻辑 可以和游戏逻辑保持同步
		TimerManager.instance.registObjUpdate(this.updateFrame, this, null);
	}

	/**当被添加到舞台时 移除循环刷新函数 */
	protected onRemoveStage() {
		TimerManager.instance.deleteObjUpdate(null, this.updateFrame, this);
	}


	//恢复
	public resume() {
		this._playState = 1;
	}

	//暂停
	public stop() {
		this._playState = 0;
	}

	public paused() {
		this._playState = 0
	}


}

import TimerManager from "../manager/TimerManager";


import ViewTools from "../components/ViewTools";
import ImageExpand from "../components/ImageExpand";