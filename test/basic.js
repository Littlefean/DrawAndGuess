/**
 * 点对象
 * by littlefean
 */
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * 把这个点对象转化成字符串
     * @return {string}
     */
    toString() {
        return `${this.x},${this.y}`;
    }

    /**
     * 把一个字符串解析成这个对象
     * @param str
     * @return {Point}
     */
    static strToPoint(str) {
        let p = str.split(",");
        return new this(p[0], p[1]);
    }
}

/**
 * 线对象
 */
class Line {
    /**
     *
     * @param start {Point}
     * @param end {Point}
     */
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    toString() {
        return `${this.start.toString()}=>${this.end.toString()}`;
    }

    /**
     * 把这个线渲染到canvas里面去
     * @param ctx
     */
    rend(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.closePath();
        ctx.stroke();
    }

    static strToLine(str) {
        let pList = str.split("=>");
        return new this(Point.strToPoint(pList[0]), Point.strToPoint(pList[1]));
    }

}
