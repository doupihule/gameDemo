"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScreenAdapterTools_1 = require("./ScreenAdapterTools");
const GameConsts_1 = require("../../game/sys/consts/GameConsts");
const Sprite3DExpand_1 = require("../viewcomp/Sprite3DExpand");
const SkeletonExpand_1 = require("../viewcomp/SkeletonExpand");
const ResourceManager_1 = require("../manager/ResourceManager");
const SpriteFrameExpand_1 = require("../viewcomp/SpriteFrameExpand");
class DisplayUtils {
    static swapChildrenAt(parent, index1, index2) {
        var child1 = parent.getChildAt(index1);
        var child2 = parent.getChildAt(index2);
        parent.setChildIndex(child1, index2);
        parent.setChildIndex(child2, index1);
    }
    /**传入资源url以及父物体获取当前加载对象，并添加摄像机 */
    static getModelByUrl(url, parentObj, isClone = false) {
        var goal;
        if (isClone) {
            goal = Laya.loader.getRes(url).clone();
        }
        else {
            goal = Laya.loader.getRes(url);
        }
        ResourceManager_1.default.checkParticalRendeMode(goal, url);
        var camera;
        camera = goal.getChildByName("main_camera");
        var extraAdd = 0;
        camera.orthographic = true;
        camera.orthographicVerticalSize = 2;
        var x = (ScreenAdapterTools_1.default.UIOffsetX + ScreenAdapterTools_1.default.sceneOffsetX) * Laya.stage.clientScaleX;
        var y = (ScreenAdapterTools_1.default.UIOffsetY + ScreenAdapterTools_1.default.sceneOffsetY) * Laya.stage.clientScaleY;
        camera.viewport = new Laya.Viewport(x, y, ScreenAdapterTools_1.default.designWidth * Laya.stage.clientScaleX, ScreenAdapterTools_1.default.designHeight * Laya.stage.clientScaleY);
        parentObj.addChild(camera);
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;
        return goal;
    }
    static adjustLabelPos() {
    }
    //创建一个摄像机
    static createCamera(clearFlag = 2) {
        var camera = new Laya.Camera();
        var sx = Laya.stage.clientScaleX;
        var sy = Laya.stage.clientScaleY;
        camera.viewport = new Laya.Viewport((ScreenAdapterTools_1.default.UIOffsetX + ScreenAdapterTools_1.default.sceneOffsetX) * sx, ScreenAdapterTools_1.default.UIOffsetY * sy, ScreenAdapterTools_1.default.designWidth * sx, ScreenAdapterTools_1.default.designHeight * sy);
        camera.clearFlag = clearFlag;
        return camera;
    }
    //创建3D场景 是否启用带物理引擎的scene    
    static createScene3D(usePhysics = false) {
        var scene;
        if (!usePhysics && GameConsts_1.default.isUsePhysics) {
            Laya3D["_enbalePhysics"] = false;
            scene = new Laya.Scene3D();
            Laya3D["_enbalePhysics"] = true;
        }
        else {
            scene = new Laya.Scene3D();
        }
        return scene;
    }
    //设置一个模型所有子对象的renderquene
    static setViewRenderQuene(view, value) {
        var a = view;
        var b = view;
        if (a.meshRenderer && a.meshRenderer.material) {
            a.meshRenderer.material.renderQueue = value;
        }
        if (b.skinnedMeshRenderer && b.skinnedMeshRenderer.material) {
            b.skinnedMeshRenderer.material.renderQueue = value;
        }
        for (var i = 0; i < view.numChildren; i++) {
            var child = view.getChildAt(i);
            this.setViewRenderQuene(child, value);
        }
    }
    /**
     *
     * @param modelName  模型名字 比如role_1; 原则上战斗中不要这样使用. 会降低一定性能.多嵌套一层. 只适合系统层的开发
     * @param showViewArr 需要显示的子对象名字.默认为空表是全部显示,否则按照传入的数组显示.可以多级显示,["child1.child12", "child2","child3",... ];
     *  显示会显示某个路径以及这个路径的所有子对象 ,比如 child2 会显示child2以及所有子对象
     * @param callBack 模型加载成功后的回调.
     * @param thisObj
     * @param args 回调附带参数
     *  返回一个sprite3D对象. 目前是可以非阻塞的进行其他的流程
     */
    static createSpriteExpand(modelName, showViewArr = null, callBack = null, thisObj = null, args = null) {
        var sp = new Sprite3DExpand_1.default(modelName);
        sp.startLoadModel(modelName, callBack, thisObj, args);
        sp.setShowViewArr(showViewArr);
        return sp;
    }
    //创建动态特效 
    static createEffectExpand(modelName, showViewArr = null, callBack = null, thisObj = null, args = null) {
    }
    //创建动画扩展 aniName 动画短名,  aniMode 动画模式 0 不支持换装, 1,2支持换装, 原则上只使用1,  
    static createSkeletonExpand(aniName, aniMode = 0, completeFunc = null, thisObj = null, expandParams = null) {
        var ske = new SkeletonExpand_1.default(null, aniMode);
        ske.completeBackFunc = completeFunc;
        ske.completeThisObj = thisObj;
        ske.completeExpandParams = expandParams;
        ske.startLoadByShortName(aniName);
        return ske;
    }
    //设置显示对象变暗 (通用对象未激活效果)
    static setViewDark(view) { this.setViewMatrixByMatirx(view, this.darkMatrix); }
    //设置显示对象变亮 (通用按钮点击变色效果)
    static setViewLight(view) { this.setViewMatrixByMatirx(view, this.lightMatrix); }
    //设置显示对象变红(通用闪红效果)
    static setViewLittleRed(view) { this.setViewMatrixByMatirx(view, this.littleRedMatrix); }
    //清空滤镜
    static clearViewFilter(view) { view.filters = null; }
    ;
    //设置图片的颜色形变 r,g,b  -1,1,  offrgb  (-255,255);
    static setViewColorTransform(view, r = 1, g = 1, b = 1, a = 1, offr = 0, offg = 0, offb = 0, offa = 0) {
        var matrixArr = [
            r, 0, 0, 0, offr,
            0, g, 0, 0, offg,
            0, 0, b, 0, offb,
            0, 0, 0, a, offa,
        ];
        view.filters = [new Laya.ColorFilter(matrixArr)];
    }
    //设置颜色 滤镜效果
    static setViewMatrixFilter(view, r1, r2, r3, r4, offr, g1, g2, g3, g4, offg, b1, b2, b3, b4, offb, a1, a2, a3, a4, offa) {
        var matrixArr = [
            r1, r2, r3, r4, offr,
            g1, g2, g3, g4, offg,
            b1, b2, b3, b4, offb,
            a1, a2, a3, a4, offa,
        ];
        view.filters = [new Laya.ColorFilter(matrixArr)];
    }
    //设置颜色滤镜 根据矩阵数组. 这个是为了节省内存. 防止有大量数组创建
    static setViewMatrixByMatirx(view, matrix) {
        view.filters = [new Laya.ColorFilter(matrix)];
    }
    static localToLocalPos(p1Pos, sp1, sp2) {
        sp1.localToGlobal(p1Pos);
        sp2.globalToLocal(p1Pos);
        return p1Pos;
    }
    //创建序列帧动画  这个数据结构是最标准的. 
    /**
     * 序列帧动画的图片名字结尾必须是连续的数字 , 比如 role_atk_1,role_atk_2,...
     * imagePath 图片路径,以/结尾 . 比如 frame/role1/;
     * imageHead 可以为空串,
     * 对于只有一个动作标签的 比如特效  默认的label全部配 idle
     * labels:[
     *  {
     *      label:  'idle',
     *      //采用这个结构是为了节省内存 牺牲可读性
     *      frame: [ 图片1持续帧数,图片2持续帧数 ,...],
     *      group:[101,102,103,... ]   //图片序号
     *      offset:[1,1,1.1,1.2]        //根据图片的数量 依次向后排列 2位对应group1位
     *  },
     * {
     *      label:  'attack',
     *      frame: [1,1,1,1,1 ],         可以不传入 表示默认一个图片持续1帧
     *      group:[101,102,103,104,105]    表示动作包含5个图片 ,.动作长度是9帧第一张图片持续1帧,第二张图持续2帧 依次类推
     *  },
     * ]
     */
    static createSpriteFrame(imagePath, imageHead, labelsArr = null, anchorX = 0.5, anchorY = 0.5, offsetMap = null) {
        var spriteFrame = new SpriteFrameExpand_1.default();
        spriteFrame.setFrameData(imagePath, imageHead, labelsArr, anchorX, anchorY, 1, offsetMap);
        return spriteFrame;
    }
    /**
     * 根据简短的标签数据创建序列帧动画
     * @param labelsArr
     *  [
     *      {
     *          label:"idle",
     *          group:[1,10,1]      //group 3个值表示 起始序号,结束序号, 每一个图片持续帧数.
     *      }
     *
     * ]
     * @param offsetMap 坐标偏移表: {1001:[10,20],1002:[10,20],...};
     */
    static createSpriteFrameByShort(imagePath, imageHead, labelsArr, anchorX = 0.5, anchorY = 0.5, offsetMap = null) {
        var spriteFrame = new SpriteFrameExpand_1.default();
        spriteFrame.setFrameData(imagePath, imageHead, labelsArr, anchorX, anchorY, 2, offsetMap);
        return spriteFrame;
    }
    /**设置panel的滚动
     * isScroll：true 可以滚动 false 禁止滚动
     */
    static setPanelScrollVisbie(panel, isScroll) {
        if (panel.vScrollBar) {
            panel.vScrollBar.touchScrollEnable = isScroll;
        }
        if (panel.hScrollBar) {
            panel.hScrollBar.touchScrollEnable = isScroll;
        }
    }
}
exports.default = DisplayUtils;
//发光矩阵
DisplayUtils.lightMatrix = [
    0.52, 0, 0, 0, 0,
    0, 0.52, 0, 0, 0,
    0, 0, 0.52, 0, 0,
    0, 0, 0, 0.52, 0,
];
//闪红矩阵
DisplayUtils.littleRedMatrix = [
    1, 0, 0, 0, 80,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, 1, 0,
];
//变暗矩阵
DisplayUtils.darkMatrix = [
    0.3, 0, 0, 0, 0,
    0, 0.3, 0, 0, 0,
    0, 0, 0.3, 0, 0,
    0, 0, 0, 1, 0,
];
//# sourceMappingURL=DisplayUtils.js.map