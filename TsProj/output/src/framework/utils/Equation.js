"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ...
 * @author star
 */
class Equation {
    // 弧度转化为 数学里面的 小的角
    static transToSmallRadian(num) {
        var result;
        if (num > 0 && num < Math.PI / 2) {
            result = num;
        }
        else if (num > -Math.PI && num < -Math.PI / 2) {
            result = Math.PI - Math.abs(num);
        }
        else if (num > -Math.PI / 2 && num < 0) {
            result = num;
        }
        else if (num > Math.PI / 2 && num < Math.PI) {
            result = -(Math.PI - num);
        }
        return result;
    }
    // 弧度转化为 垂线的角
    static transToSmallVerticalRadian(num) {
        var result;
        result = this.transToSmallRadian(num);
        if (result > 0 && result < Math.PI / 2) {
            result = -(Math.PI / 2 - result);
        }
        else if (result > -Math.PI && result < -Math.PI / 2) {
            result = -(Math.PI / 2 - (Math.PI - Math.abs(result)));
        }
        else if (result > -Math.PI / 2 && result < 0) {
            result = Math.PI / 2 - Math.abs(result);
        }
        else if (result > Math.PI / 2 && result < Math.PI) {
            result = Math.PI / 2 - (Math.PI - result);
        }
        return result;
    }
    //三角形 已知正切值和对边 求斜边的长
    static triangleLength(tan, a) {
        var c;
        c = a * Math.sqrt(tan * tan + 1) / tan;
        return c;
    }
    static tempInarea() {
        return true;
    }
    // 建立一元一次方程
    static creat_1_1_a(startX, startY, radian) {
        var eqObj = {};
        // 方程式
        // a * x + b * y + c = 0;
        // 竖向方程
        if (radian == Math.PI / 2) {
            eqObj.a = 1;
            eqObj.b = 0;
            eqObj.c = -startX;
            // 横向方程
        }
        else if (radian == 0) {
            eqObj.a = 0;
            eqObj.b = 1;
            eqObj.c = -startY;
            // 普通方程
        }
        else {
            // 规定为1
            eqObj.b = 1;
            eqObj.a = -Math.tan(radian);
            eqObj.c = -eqObj.a * startX - startY;
        }
        return eqObj;
    }
    // 建立一元一次方程
    static creat_1_1_b(startX, startY, endX, endY, haveArea = true) {
        var eqObj = {};
        // 方程式
        // a * x + b * y + c = 0;
        // 限制定义域
        eqObj.haveArea = haveArea;
        // 竖向方程
        if (startX == endX) {
            // eqObj.typ = "plumb";
            eqObj.a = 1;
            eqObj.b = 0;
            eqObj.c = -endX;
            // 横向方程
        }
        else if (startY == endY) {
            // eqObj.typ = "level";
            eqObj.a = 0;
            eqObj.b = 1;
            eqObj.c = -endY;
            // 普通方程
        }
        else {
            // eqObj.typ = "normal";
            // 规定为1
            eqObj.b = 1;
            // - a / b = (y2- y1) / ( x2 - x1 )
            eqObj.a = -(endY - startY) / (endX - startX);
            // c = -a x + y;
            eqObj.c = -eqObj.a * startX - startY;
        }
        if (haveArea) {
            // 检查 point 是否在 定义域内
            eqObj.inArea = function (p) {
                // 有定义域限制
                if (eqObj.haveArea) {
                    // 是否在X轴
                    var inX;
                    if (p.x <= startX && p.x >= endX) {
                        inX = true;
                    }
                    else if (p.x >= startX && p.x <= endX) {
                        inX = true;
                    }
                    // 是否在Y轴
                    var inY;
                    if (p.y <= startY && p.y >= endY) {
                        inY = true;
                    }
                    else if (p.y >= startY && p.y <= endY) {
                        inY = true;
                    }
                    // 同时在定义域 x y 满足
                    if (inX && inY) {
                        return true;
                    }
                    else {
                        return false;
                    }
                    // 没定义域限制
                }
                else {
                    return true;
                }
            };
        }
        return eqObj;
    }
    //已知2直线 求其夹角的正切值  
    static lineTangent(eq1, eq2) {
        var tan = 0;
        var k1;
        var k2;
        if (eq1.b == 0 && eq2.a != 0) {
            tan = eq2.b / eq2.a;
            return tan;
        }
        if (eq2.b == 0 && eq1.a != 0) {
            tan = eq1.b / eq1.a;
            return tan;
        }
        else {
            k1 = -eq1.a / eq1.b;
            k2 = -eq2.a / eq2.b;
            tan = (k2 - k1) / (k2 * k1 + 1);
            return tan;
        }
    }
    // 判断2个一元一次方程的交点
    static pointOf(eqObj1, eqObj2) {
        var p;
        // 2条平行线
        if (eqObj1.a == 0 && eqObj2.a == 0) {
            return null;
            // 1条平行线
            // } else if ( eqObj1.typ == "level" ) {
        }
        else if (eqObj1.a == 0) {
            p = new Laya.Vector3();
            p.y = -eqObj1.c;
            p.x = (-eqObj2.c - eqObj2.b * p.y) / eqObj2.a;
            // 1条平行线
            // } else if ( eqObj2.typ == "level" ) {
        }
        else if (eqObj2.a == 0) {
            p = new Laya.Vector3();
            p.y = -eqObj2.c;
            p.x = (-eqObj1.c - eqObj1.b * p.y) / eqObj1.a;
        }
        else if (eqObj1.a != 0 && eqObj2.a != 0) {
            p = new Laya.Vector3();
            if (eqObj1.b == 0) {
                p.x = -eqObj1.c;
                p.y = (-eqObj2.c - eqObj2.a * p.x) / eqObj2.b;
            }
            else if (eqObj2.b == 0) {
                p.x = -eqObj2.c;
                p.y = (-eqObj1.c - eqObj1.a * p.x) / eqObj1.b;
            }
            else {
                p.y = (eqObj2.c / eqObj2.a - eqObj1.c / eqObj1.a) / (eqObj1.b / eqObj1.a - eqObj2.b / eqObj2.a);
                p.x = (-eqObj1.c - eqObj1.b * p.y) / eqObj1.a;
            }
        }
        //如果是没有区域限定的
        if (!eqObj1.inArea || !eqObj2.inArea) {
            return p;
        }
        if (p == null) {
            return null;
            // 检查是否在2者的 定义域
        }
        else if (eqObj1.inArea(p) && eqObj2.inArea(p)) {
            return p;
        }
        else {
            return null;
        }
    }
    //平面2点间的距离
    static pointDistance(p1, p2) {
        var dis = Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
        return dis;
    }
    //过一点做已知直线的垂线
    static plumbLine(x, y, eqobj) {
        var eq;
        //3种情况
        if (eqobj.a == 0) {
            eq = Equation.creat_1_1_a(x, y, Math.PI / 2);
        }
        else if (eqobj.b == 0) {
            eq = Equation.creat_1_1_a(x, y, 0);
        }
        else {
            eq = {};
            eq.a = eqobj.b;
            eq.b = -eqobj.a;
            eq.c = eqobj.a * y - eqobj.b * x;
        }
        return eq;
    }
    //点到直线的距离  tpy 类型 默认值为0 就是距离的绝对值， 1  和 2是相对距离 有正负的
    static pointLineDistance(x, y, eqobj, tpy = 0) {
        var distance;
        if (tpy == 0) {
            distance = Math.abs(eqobj.a * x + eqobj.b * y + eqobj.c) / Math.sqrt(eqobj.a * eqobj.a + eqobj.b * eqobj.b);
        }
        else if (tpy == 1) {
            distance = (eqobj.a * x + eqobj.b * y + eqobj.c) / Math.sqrt(eqobj.a * eqobj.a + eqobj.b * eqobj.b);
        }
        else if (tpy == 2) {
            distance = -(eqobj.a * x + eqobj.b * y + eqobj.c) / Math.sqrt(eqobj.a * eqobj.a + eqobj.b * eqobj.b);
        }
        return distance;
    }
    //修正坐标 到直线的距离 小于半径 然后修正到刚好等于半径
    static adjustPosByLine(p, dis, r, ang, eq) {
        var angDis = ang - eq.angle;
        var length = (r - dis * eq.type) / Math.abs(Math.sin(angDis));
        p.x -= length * Math.cos(ang);
        p.y -= length * Math.sin(ang);
        return p;
    }
    //过点做目标直线的垂线，判断垂线和目标直线是否有交点 
    static checkPlumbPoint(x, y, eq) {
        var plumbLine = Equation.plumbLine(x, y, eq);
        if (Equation.pointOf(plumbLine, eq) == null) {
            return false;
        }
        else
            return true;
    }
    //过点做 目标2点所在直线的垂线 判断垂线和目标直线是否有交点
    static checkPointByThreePoint(x, y, linep1, linep2) {
        var line = this.creat_1_1_b(linep1.x, linep1.y, linep2.x, linep2.y);
        var plumbLine = Equation.plumbLine(x, y, line);
        if (Equation.pointOf(plumbLine, line) == null) {
            return false;
        }
        else
            return true;
    }
    //判断1点到已知2点的直接上的最小距离 如果  点与直线没有交点  返回 到直线顶点的最小距离
    static pointLineDistance2(x, y, lineP1, lineP2) {
        var line = this.creat_1_1_b(lineP1.x, lineP1.y, lineP2.x, lineP2.y);
        //如果点和直线有交点  那么返回点到直线的距离
        if (this.checkPlumbPoint(x, y, line)) {
            return this.pointLineDistance(x, y, line);
            //否则返回点到2端点的距离
        }
        else {
            var dis1 = (lineP1.x - x) * (lineP1.x - x) + (lineP1.y - y) * (lineP1.y - y);
            var dis2 = (lineP2.x - x) * (lineP2.x - x) + (lineP2.y - y) * (lineP2.y - y);
            var dis = Math.min(dis1, dis2);
            return Math.sqrt(dis);
        }
    }
    // 计算一点关于另外一点的对称点
    static symmetryByPAToPB(pa, pb) {
        var arr = [];
        arr[0] = 2 * pb[0] - pa[0];
        arr[1] = 2 * pb[1] - pa[1];
        if (pb[2] != null) {
            arr[2] = 2 * pb[2] - pa[2];
        }
        return arr;
    }
    //过一点 作已知直线垂线， 求出交点
    static getPlumbPoint(x, y, eq) {
        var line = this.plumbLine(x, y, eq);
        return this.pointOf(line, eq);
    }
    //圆与直线交点的求法					圆心				半径	直线	直线方向的角度 类型 1是 正方向交点 -1 是反方向交点	
    static roundLinePointof(centrePoint, r, eq, ang, type) {
        //圆心到直线距离
        var dis = this.pointLineDistance(centrePoint.x, centrePoint.y, eq);
        //调整的长度
        var length = Math.sqrt(r * r - dis * dis);
        //过圆心作直线的垂线
        var plumb = this.plumbLine(centrePoint.x, centrePoint.y, eq);
        //垂线与 已知直线的交点；
        var point1 = this.pointOf(eq, plumb);
        //圆与直线的交点
        var pointoff = new Laya.Vector3();
        pointoff.x = point1.x + length * type * Math.cos(ang);
        pointoff.y = point1.y + length * type * Math.sin(ang);
        return pointoff;
    }
    //判断三点的位置关系 中间一点是否在2点之间
    static check3PointPos(p1, p2, p3, type = 0) {
        var xCheck;
        var yCheck;
        if (type == 0) {
            if (p2.x <= p1.x && p2.x >= p3.x) {
                xCheck = true;
            }
            else if (p2.x <= p3.x && p2.x >= p1.x) {
                xCheck = true;
            }
            else {
                xCheck = false;
            }
            if (p2.y <= p1.y && p2.y >= p3.y) {
                yCheck = true;
            }
            else if (p2.y <= p3.y && p2.y >= p1.y) {
                yCheck = true;
            }
            else {
                yCheck = false;
            }
            if (xCheck && yCheck) {
                return true;
            }
            else
                return false;
        }
        else {
            if (p2.x < p1.x && p2.x > p3.x) {
                xCheck = true;
            }
            else if (p2.x < p3.x && p2.x > p1.x) {
                xCheck = true;
            }
            else {
                xCheck = false;
            }
            if (p2.y < p1.y && p2.y > p3.y) {
                yCheck = true;
            }
            else if (p2.y < p3.y && p2.y > p1.y) {
                yCheck = true;
            }
            else {
                yCheck = false;
            }
            if (xCheck && yCheck) {
                return true;
            }
            else
                return false;
        }
    }
    // 算抛物线方程 参数为 起点 终点 顶点 重力
    static creat_2_2(pa, pb, pc, g) {
        var eqObj = {};
        // 求方程参数
        // 方程
        // y = a (x -  b)^ + c
        // y1 = a ( x1 - b )^ + c
        // y2 = a ( x2 - b )^ + c
        // 顶点 x3 y3
        // y3 = c
        // y1 - y3 = a ( x1 - b )^
        // y2 - y3 = a ( x2 - b )^
        // 2式相除
        //  y1 - y3     x1 - b
        // --------- = --------- ^
        //  y2 - y3     x2 - b
        //  b - x1                  y1 - y3
        // --------- = Math.sqrt(-----------)
        // x2 - b			    y2 - y3
        // b = (x2 * Math.sqrt((y1 - y3)/(y2 - y3)) + x1) / (1 + Math.sqrt((y1 - y3)/(y2 - y3)) )
        // a = (y1 - y3) / (x1 - b)^
        // c = y3
        // x3 = b
        eqObj.pa = pa;
        eqObj.pb = pb;
        eqObj.pc = pc;
        if (Math.abs(pa.x - pb.x) <= 2) {
            pb.x += 3;
            eqObj.pb.x += 3;
        }
        // 方程参数 a b c
        eqObj.b = (pb.x * Math.sqrt((pa.y - pc.y) / (pb.y - pc.y)) + pa.x) / (1 + Math.sqrt((pa.y - pc.y) / (pb.y - pc.y)));
        eqObj.a = (pa.y - pc.y) / (pa.x - eqObj.b) / (pa.x - eqObj.b);
        eqObj.c = pc.y;
        // 计算顶点x坐标
        eqObj.pc.x = eqObj.b;
        // x 对应 y 坐标
        eqObj.yCd = function (xCd) {
            return eqObj.a * (xCd - eqObj.b) * (xCd - eqObj.b) + eqObj.c;
        };
        // 斜率方程推到 ( 导数 )
        // y~ = lim ( a(x + @ - b)^ - a(x - b)^ ) / @ = lim a ( 2x + @ - 2b ) @ / @ = lim a (2x - 2b + @)
        // y~ = 2ax - 2ab
        // 出射角
        eqObj.radian = Math.atan(2 * eqObj.a * pa.x - 2 * eqObj.a * eqObj.b);
        // 某一点的角
        eqObj.currentRad = function (xCd) {
            return Math.atan(2 * eqObj.a * xCd - 2 * eqObj.a * eqObj.b);
        };
        // v = gt;
        // v^ = 2g(pc.y - pa.y);
        // pc.y - pa.y = 1/2 * g * t^;
        // 上升的时间
        eqObj.t1 = Math.sqrt(2 * (pc.y - pa.y) / -g);
        // 下落的时间
        eqObj.t2 = Math.sqrt(2 * (pc.y - pb.y) / -g);
        // 总速度
        eqObj.speed = -g * eqObj.t1 / Math.sin(eqObj.radian);
        return eqObj;
    }
    //保留小数位										保留多少位
    static getNumByDecimalAnalyserNode(num, index = 0) {
        var result = Math.round(num / pow) * pow;
        if (index >= 0) {
            var pow = Math.pow(10, index);
            result = Math.round(num / pow) * pow;
        }
        else {
            var str = String(num);
            var dianIndex = str.indexOf(".");
            //如果已经是整数了 那么返回这个数
            if (dianIndex == -1) {
                return num;
            }
            str = str.slice(0, dianIndex - index + 1);
            result = Number(str);
        }
        return result;
    }
    //根据 水平位移 水平速度 和g 计算 初始竖直方向上的速度 以及竖直方向上的位移为负
    static countPlumbSpeedBySVG(sx, vx, g) {
        var t = Math.abs(sx / vx);
        var vy = -g * t / 2;
        var sy = -g * t * t / 4;
        return [vy, sy];
    }
    //根据 水平位移 水平速度 和数值位移 计算 初始竖直方向上的速度 以及重力加速度
    static countPlumbSpeedBySVS(sx, vx, sy) {
        var t = Math.abs(sx / vx);
        var g = Math.abs(sy) * 2 / (t * t);
        return [-g * t / 2, g];
    }
    //横坐标 纵坐标  旋转角度  true正方向旋转（false反方向旋转）  是数学系里面的坐标旋转
    static ratoteFormulation(nx, ny, ang, boo = true, out = null) {
        if (!out) {
            out = new Laya.Vector3();
        }
        var cos = Math.cos(ang);
        var sin = Math.sin(ang);
        //
        if (boo) {
            //正方向旋转
            var newX = cos * nx - sin * ny;
            var newY = cos * ny + sin * nx;
            out.x = newX;
            out.y = newY;
        }
        else {
            //反方向旋转
            var backX = cos * nx + sin * ny;
            var backY = cos * ny - sin * nx;
            out.x = backX;
            out.y = backY;
        }
        return out;
    }
    //横坐标 纵坐标  旋转角度  true正方向旋转（false反方向旋转）  是数学系里面的坐标旋转  返回的是x 和z
    static ratoteFormulationXZ(nx, nz, ang, boo = true, out = null) {
        if (!out) {
            out = new Laya.Vector3();
        }
        var cos = Math.cos(ang);
        var sin = Math.sin(ang);
        //
        if (boo) {
            //正方向旋转
            var newX = cos * nx - sin * nz;
            var newY = cos * nz + sin * nx;
            out.x = newX;
            out.z = newY;
        }
        else {
            //反方向旋转
            var backX = cos * nx + sin * nz;
            var backY = cos * nz - sin * nx;
            out.x = backX;
            out.z = backY;
        }
        return out;
    }
    //根据距离计算 时间  计算 速度 角度
    static countSpeedByTime(dx, dy, g, time) {
        var obj = {};
        obj.xSpeed = dx / time;
        obj.ySpeed = (dy - 0.5 * g * time * time) / time;
        obj.angle = Math.atan2(obj.ySpeed, obj.xSpeed);
        return obj;
    }
    //给定 最大的竖直高度 
    static countSpeedByHeight(dx, dy, g) {
        var obj = {};
        var time = Math.sqrt(-2 * dy / g);
        obj.ySpeed = -g * time;
        obj.xSpeed = dx / (time * 2);
        obj.time = time;
        obj.angle = Math.atan2(obj.ySpeed, obj.xSpeed);
        return obj;
    }
    //从最大值最小值里面随机取一个数
    /**
     *
     * @param	min
     * @param	max
     * @param	decimal 保留小数位
     * @return
     */
    static getRadomFromMinMax(start, end, decimal = 0) {
        var dis = end - start;
        //随机取x
        var radom = Math.random();
        //直线  2点式
        /**
         *  0  			1
         * start        end
         */
        var k = (end - start) / (1 - 0); //计算斜率
        //直线 点斜式
        //y - y1 = k(x- x1);
        var result = k * (radom - 0) + start;
        return this.getNumByDecimal(result, decimal);
    }
    //根据起始坐标S 终点坐标E  重力G跳跃高度H 计算  3D速度
    /**
     *
     * @param	s
     * @param	e
     * @param	g
     * @param	h
     * @return
     */
    static getSpeedBySEGH(s, e, g, h) {
        var t; //运动总时间
        var xSpeed; //
        var ySpeed;
        var zSpeed;
        var dx = e[0] - s[0]; //总的x位移
        var dy = e[1] - s[1]; //总的y位移
        if (-(e[2] - s[2]) > h) {
            e[2] = s[2] - h;
        }
        var dz = e[2] - s[2]; //z位移
        var halfT; //运动到最高点的时间 也就是上升时间  上升时间可能和下落时间不相等
        halfT = Math.sqrt(2 * h / g);
        zSpeed = -g * halfT; //z速度 -等级加速度×时间 因为开始上升过程是 减速过程
        t = halfT + Math.sqrt((dz + h) * 2 / g); //运动的总时间 等于 上升时间 加上下落时间
        xSpeed = dx / t;
        ySpeed = dy / t;
        return [xSpeed, ySpeed, zSpeed];
    }
    /**
     *
     * @param	base  底数
     * @param	logarithm 对数
     * @return
     */
    static log(base, logarithm) {
        if (base == 1) {
            return 1;
        }
        return Math.log(logarithm) / Math.log(base);
    }
    //计算一组数的平均值 
    static averageByNums(numsArr) {
        var average = 0;
        for (var i = 0; i < numsArr.length; i++) {
            average += numsArr[i];
        }
        average /= numsArr.length;
        return average;
    }
    //计算一组数的方差
    static varianceByNums(numsArr) {
        //先计算平均值
        var average = this.averageByNums(numsArr);
        var variance = 0;
        for (var i = 0; i < numsArr.length; i++) {
            variance += (numsArr[i] - average) * (numsArr[i] - average);
        }
        return variance;
    }
    //随机获取半径范围内的一个点
    /**
     *
     * @param	r  这里有2层半径 表示的 是  r 到r2半径范围内的点
     * @param	r2
     * @return
     */
    static getRadomPointByRadius(r = 200, r2 = 0, a = 0, a2 = Math.PI * 2) {
        var radomR = this.getRadomFromMinMax(r, r2);
        var ang = this.getRadomFromMinMax(a, a2, -2);
        var xPos = radomR * Math.cos(ang);
        var ypos = radomR * Math.sin(ang);
        return new Laya.Vector3(xPos, ypos);
    }
    //保留小数位										保留多少位
    static getNumByDecimal(num, index = 0) {
        var pow = Math.pow(10, index);
        var result = Math.round(num / pow) * pow;
        if (index >= 0) {
            result = Math.round(num / pow) * pow;
        }
        else {
            var str = String(num);
            var dianIndex = str.indexOf(".");
            //如果已经是整数了 那么返回这个数
            if (dianIndex == -1) {
                return num;
            }
            str = str.slice(0, dianIndex - index + 1);
            result = Number(str);
        }
        return result;
    }
    //缓动跟随算法 tovalue 目标值, fromvalue起始值, f 缓动系数 默认0.1 就是每帧用距离乘以0.1
    //换回是缓动改变量
    static easyToTargetPos(tovalue, fromvalue, f = 0.1, min = 1) {
        var dis = tovalue - fromvalue;
        var absDistance = Math.abs(dis);
        if (absDistance < min) {
            return dis;
        }
        var way = dis / absDistance;
        absDistance *= f;
        if (absDistance < min) {
            absDistance = min;
        }
        return absDistance * way;
    }
    /*
    * 把所有的角度转化成180-180之间的角度. 同时 角度差不能超过360
    * 	类型 0是弧度 1是角度
    */
    static easyToTargetAngle(tovalue, fromvalue, f = 0.1, min = 1, t = 0) {
        var disang = tovalue - fromvalue;
        if (t == 0) {
            if (disang > Math.PI) {
                tovalue -= Math.PI * 2;
            }
            else if (disang < -Math.PI) {
                tovalue += Math.PI * 2;
            }
        }
        else {
            if (disang > 180) {
                tovalue -= 360;
            }
            else if (disang < -180) {
                tovalue += 360;
            }
        }
        return this.easyToTargetPos(tovalue, fromvalue, f, min);
    }
    //获取2个角度的差 取值在-PI到PI之间
    /**
     *@t 类型 0表示弧度 1表示角度
        * 返回 ang2 - ang1 的差
        */
    static getAngDis(ang1, ang2, t = 0) {
        var disAng = ang2 - ang1;
        if (t == 0) {
            if (disAng > Math.PI) {
                disAng -= this.MATH2PI;
            }
            else if (disAng < -Math.PI) {
                disAng += this.MATH2PI;
            }
        }
        else {
            if (disAng > 180) {
                disAng -= 360;
            }
            else if (disAng < -180) {
                disAng += 360;
            }
        }
        return disAng;
    }
    //修正角度
    static adjustAngle(ang) {
        if (ang > Math.PI) {
            return ang - this.MATH2PI;
        }
        else if (ang < -Math.PI) {
            return ang + this.MATH2PI;
        }
        return ang;
    }
    //2球碰撞方法   ball: {position: {x: ***,y: ***},velocity: {x: ***,y: ***}}
    static ballBallCollision(b1posx, b1posy, b1spdx, b1spdy, b2posx, b2posy, b2spdx, b2spdy) {
        var lenX = (b2posx - b1posx); //坐标差
        var lenY = (b2posy - b1posy);
        var angle = Math.atan2(lenY, lenX); //2球的角度
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        // var pos0:egret.Point = new egret.Point();
        // var pos1:egret.Point = this.rotateCalculate(lenX, lenY, sin, cos, true);		//旋转相对坐标	正旋转
        var vel0 = this.rotateCalculate(b1spdx, b1spdy, sin, cos, true); //旋转速度
        var vel1 = this.rotateCalculate(b2spdx, b2spdy, sin, cos, true);
        //这里运用的是默认的动量守恒定理  只是 质量相等了 所以是简化版
        var vxTotal = (vel0.x - vel1.x);
        vel0.x = vel1.x;
        vel1.x = (vxTotal + vel0.x);
        // pos0.x = (pos0.x + vel0.x);
        // pos1.x = (pos1.x + vel1.x);
        // var pos0F:egret.Point = this.rotateCalculate(pos0.x, pos0.y, sin, cos, false);		//把坐标和速度再旋转回来
        // var pos1F:egret.Point = this.rotateCalculate(pos1.x, pos1.y, sin, cos, false);
        var vel0F = this.rotateCalculate(vel0.x, vel0.y, sin, cos, false);
        var vel1F = this.rotateCalculate(vel1.x, vel1.y, sin, cos, false);
        // ball1.velocity.x = vel0F.x;
        // ball1.velocity.y = vel0F.y;
        // ball2.velocity.x = vel1F.x;
        // ball2.velocity.y = vel1F.y;
        return [this.convertToValueAndAngle(new Laya.Vector3(vel0F.x, vel0F.y)), this.convertToValueAndAngle(new Laya.Vector3(vel1F.x, vel1F.y))];
    }
    //转化为向量
    static convertToVector(value, angle) {
        return new Laya.Vector3(value * Math.cos(angle), value * Math.sin(angle));
    }
    static convertToValueAndAngle(vector) {
        return [Math.sqrt(vector.x * vector.x + vector.y * vector.y), Math.atan2(vector.y, vector.x)];
    }
    //旋转坐标
    static rotateCalculate(xpos, ypos, sin, cos, reverse, resultPoint = null) {
        if (!resultPoint) {
            resultPoint = new Laya.Vector3();
        }
        if (reverse) {
            resultPoint.x = ((xpos * cos) + (ypos * sin));
            resultPoint.y = ((ypos * cos) - (xpos * sin));
        }
        else {
            resultPoint.x = ((xpos * cos) - (ypos * sin));
            resultPoint.y = ((ypos * cos) + (xpos * sin));
        }
        ;
        return resultPoint;
    }
    //判断两矩形是否相交（矩形碰撞检测）     参数： 矩形顶点坐标 (左边顺序传入 顺时针或逆时针) 
    static rectangularCollisionDetection(p1, p2, p3, p4, p5, p6, p7, p8) {
        //计算中心点和宽高
        var centerPointx1 = (p1.x + p2.x + p3.x + p4.x) / 4;
        var centerPointy1 = (p1.y + p2.y + p3.y + p4.y) / 4;
        var width1 = this.pointDistance(p1, p2);
        var height1 = this.pointDistance(p2, p3);
        var centerPointx2 = (p5.x + p6.x + p7.x + p8.x) / 4;
        var centerPointy2 = (p5.y + p6.y + p7.y + p8.y) / 4;
        var width2 = this.pointDistance(p5, p6);
        var height2 = this.pointDistance(p6, p7);
        var short1 = Math.min(height1, width1);
        var short2 = Math.min(width2, height2);
        var distanceSqrt = (centerPointx1 - centerPointx2) * (centerPointx1 - centerPointx2) + (centerPointy1 - centerPointy2) * (centerPointy1 - centerPointy2);
        if (distanceSqrt > (width1 + width2) * (width1 + width2) / 4 + (height1 + height2) * (height1 + height2) / 4) {
            //先粗略过滤一遍  中心距离大于两车对角线和的一半则无法碰撞
            return null;
        }
        // else if(distanceSqrt < (short1 + short2) * (short1 + short2) / 4){
        // 	//中心距离小于两矩形最短边之和的一半则必碰撞
        // 	return true;
        // }
        else {
            //过滤完毕 启动分离轴算法（因为是矩形 所以只用分别计算两条边）
            return this.separationAxisAlgorithm(p1, p2, p3, p4, p5, p6, p7, p8);
        }
    }
    //两个矩形间的分离轴算法  传入矩形顶点坐标(顺时针或逆时针排序)   返回最小偏移量
    static separationAxisAlgorithm(p1, p2, p3, p4, p5, p6, p7, p8) {
        var oll = this.isPointsOnLine(p1, p2, p5, p6, p7, p8);
        var overLapLen = oll;
        var skewInfo;
        if (oll == -1) {
            skewInfo = null;
        }
        else {
            skewInfo = [overLapLen, p1, p2];
            oll = this.isPointsOnLine(p2, p3, p5, p6, p7, p8);
            if (oll == -1) {
                skewInfo = null;
            }
            else {
                if (oll < overLapLen) {
                    overLapLen = oll;
                    skewInfo = [overLapLen, p2, p3];
                }
                oll = this.isPointsOnLine(p5, p6, p1, p2, p3, p4);
                if (oll == -1) {
                    skewInfo = null;
                }
                else {
                    if (oll < overLapLen) {
                        overLapLen = oll;
                        skewInfo = [overLapLen, p5, p6];
                    }
                    oll = this.isPointsOnLine(p6, p7, p1, p2, p3, p4);
                    if (oll == -1) {
                        skewInfo = null;
                    }
                    else {
                        if (oll < overLapLen) {
                            overLapLen = oll;
                            skewInfo = [overLapLen, p6, p7];
                        }
                    }
                }
            }
        }
        return skewInfo;
    }
    //传入六个点 以前两点AB做直线 判断后四个点的投影是否有在线段AB上 并返回重叠区域长度
    static isPointsOnLine(p1, p2, p3, p4, p5, p6) {
        var axis1;
        var pp1, pp2, pp3, pp4, ppp1, ppp2;
        axis1 = this.creat_1_1_b(p1.x, p1.y, p2.x, p2.y, false);
        pp1 = this.getPlumbPoint(p3.x, p3.y, axis1);
        pp2 = this.getPlumbPoint(p4.x, p4.y, axis1);
        pp3 = this.getPlumbPoint(p5.x, p5.y, axis1);
        pp4 = this.getPlumbPoint(p6.x, p6.y, axis1);
        var disSqrt1 = (pp1.x - pp3.x) * (pp1.x - pp3.x) + (pp1.y - pp3.y) * (pp1.y - pp3.y);
        var disSqrt2 = (pp2.x - pp4.x) * (pp2.x - pp4.x) + (pp2.y - pp4.y) * (pp2.y - pp4.y);
        if (disSqrt1 > disSqrt2) {
            ppp1 = pp1;
            ppp2 = pp3;
        }
        else {
            ppp1 = pp2;
            ppp2 = pp4;
        }
        return this.lineOverlap(p1, p2, ppp1, ppp2);
    }
    //判断同一条直线上的两线段是否有重叠 返回重叠区域的长度
    static lineOverlap(pStart1, pEnd1, pStart2, pEnd2) {
        var pxs1 = pStart1.x;
        var pxe1 = pEnd1.x;
        var pxs2 = pStart2.x;
        var pxe2 = pEnd2.x;
        var pys1 = pStart1.y;
        var pye1 = pEnd1.y;
        var pys2 = pStart2.y;
        var pye2 = pEnd2.y;
        var pDis1 = this.pointDistance(pStart1, pEnd1);
        var pDis2 = this.pointDistance(pStart2, pEnd2);
        var maxLen = pDis1 + pDis2; //若存在大于此值 则未重叠
        // var maxLenSqrt = maxLen * maxLen;
        var l1 = Math.sqrt((pxs1 - pxs2) * (pxs1 - pxs2) + (pys1 - pys2) * (pys1 - pys2));
        var l2 = Math.sqrt((pxs1 - pxe2) * (pxs1 - pxe2) + (pys1 - pye2) * (pys1 - pye2));
        var l3 = Math.sqrt((pxe1 - pxs2) * (pxe1 - pxs2) + (pye1 - pys2) * (pye1 - pys2));
        var l4 = Math.sqrt((pxe1 - pxe2) * (pxe1 - pxe2) + (pye1 - pye2) * (pye1 - pye2));
        if (l1 > maxLen || l2 > maxLen || l3 > maxLen || l4 > maxLen) {
            return -1;
        }
        else {
            var len = l1 + l2 + l3 + l4 - 2 * Math.max(l1, l2, l3, l4, pDis1, pDis2); //重叠区域长度
            //如果为0则说明有一条线段被另一条包含了  此时重叠区域为较短的那一条线段长
            if (len == 0) {
                len = Math.min(pDis1, pDis2);
            }
            return len;
        }
    }
    //按当前值A、B和一周的总值判断谁在前面  算法： 余数比较小的加上总值的一半 若大于较大的则较大的在前
    static judgeFormerIsLarge(a, b, total) {
        var remainderA = a % total;
        var remainderB = b % total;
        if (remainderA > remainderB) {
            return (remainderB + total / 2) > remainderA;
        }
        else {
            return (remainderA + total / 2) <= remainderB;
        }
    }
    //求线段关于直线的反射线段  返回长度和方向 参数：入射角方向、直线方向、线段长、法线方向衰减百分比、直线方向衰减百分比
    static countReflectSegment(angle, lineAngle, value = 0, yDamp = 0, xDamp = 0) {
        var arr = [];
        //入射角
        var rsAngle = this.getAngDis(angle, lineAngle);
        //无衰减时 反射角方向等于入射角方向加2倍的入射角
        var reAngle = angle + 2 * rsAngle;
        if (value != 0) {
            var dx = value * Math.cos(rsAngle) * (1 - xDamp);
            var dy = value * Math.sin(rsAngle) * (1 - yDamp);
            var len = Math.sqrt(dx * dx + dy * dy);
            arr.push(len);
            //实际反射角
            var reAngleValue = Math.atan2(dy, dx);
            //反射角方向				
            reAngle = angle + rsAngle + reAngleValue;
        }
        else {
            arr.push(0);
        }
        arr.push(this.adjustAngle(reAngle));
        return arr;
    }
    //求射线关于直线的反射射线方向
    static countReflect(angle, line) {
        return this.countReflectSegment(angle, line)[1];
    }
    //
    static getPosByRatio(p1, p2, ratio) {
        var dis = p2 - p1;
        dis *= ratio;
        return p1 + dis;
    }
}
exports.default = Equation;
Equation.MATH2PI = Math.PI * 2;
//角度转弧度
Equation.ANGLETORADIAN = 180 / Math.PI;
//弧度转角度
Equation.RADIANTOANGLE = Math.PI / 180;
//# sourceMappingURL=Equation.js.map