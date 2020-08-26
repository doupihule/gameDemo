"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FogFindWayControler = void 0;
const LogsManager_1 = require("../../../framework/manager/LogsManager");
/**寻路控制器 */
class FogFindWayControler {
    constructor(fogControler) {
        //开放列表
        this.openList = [];
        //关闭列表
        this.closeList = [];
        //路径列表
        this.pathArr = [];
        this.fogControler = fogControler;
    }
    /**重置路径 */
    resetPath(targePos) {
        this.targePos = targePos;
        this.pathArr = [];
        for (var i = 0; i < this.openList.length; i++) {
            this.openList[i].resetPathData();
        }
        for (var i = 0; i < this.closeList.length; i++) {
            this.closeList[i].resetPathData();
        }
        this.openList = [];
        this.closeList = [];
    }
    findPath(start, end) {
        this.resetPath(end);
        //起点和终点一致 直接返回空列表
        if (start == end)
            return [];
        this.openList.push(start);
        this.endNode = end;
        var times = 0;
        while (this.openList.length > 0 && times < 2000) {
            this.curNode = this.openList[0];
            //把curNode从Open列表中删除掉
            this.openList.splice(0, 1);
            this.CheckAround(this.curNode);
            this.closeList.push(this.curNode);
            //如果当前点等于最终节点
            if (this.curNode == end) {
                var tmpNode = end;
                //从最后一个开始吧我的上一个格子加到路径里
                while (tmpNode.tmpCell != null) {
                    this.pathArr.push(tmpNode);
                    tmpNode = tmpNode.tmpCell;
                    //起点是没有上一个格子 说明结束了
                    if (tmpNode.tmpCell == null) {
                        LogsManager_1.default.echo("找到终点了", times);
                        break;
                    }
                }
                //反转集合
                this.pathArr.reverse();
                return this.pathArr;
            }
            times++;
        }
        //开放列表为0了说明没有可以走的路，直接返回空路径
        return [];
    }
    //分别检测当前格子四周的格子
    CheckAround(cell) {
        this.getCellItem(cell, "up");
        this.getCellItem(cell, "down");
        this.getCellItem(cell, "left");
        this.getCellItem(cell, "right");
    }
    getCellItem(cell, pos) {
        var id = cell.getAroundCell(pos);
        var targetCell = this.fogControler.getCellData(id);
        //如果当前点是终点，直接放到开放列表里，或者如果当前点周围的目标格子完全解锁了，判断是否放到开放列表里
        if (targetCell == this.endNode || (targetCell && targetCell.getIsCanPath())) {
            this.addOpenList(targetCell);
        }
    }
    addOpenList(item) {
        //被检测的格子不在开放列表也不再关闭列表里，再加到开放列表中
        if (item && this.openList.indexOf(item) == -1 && this.closeList.indexOf(item) == -1) {
            //计算它的F值
            item.tmpCell = this.curNode;
            item.G = item.tmpCell.G + 1;
            item.H = Math.abs(item.xIndex - this.targePos.xIndex) + Math.abs(item.yIndex - this.targePos.yIndex);
            item.F = item.G + item.H;
            this.openList.push(item);
            //把F值最小的放第一个
            this.openList.sort(this.sortCellF);
        }
    }
    //从小到大排
    sortCellF(a, b) {
        var small = a.F - b.F;
        return small;
    }
    //销毁函数
    dispose() {
        this.targePos = null;
        this.curNode = null;
        this.openList = [];
        this.closeList = [];
        this.pathArr = [];
        this.fogControler = null;
    }
}
exports.FogFindWayControler = FogFindWayControler;
//# sourceMappingURL=FogFindWayControler.js.map