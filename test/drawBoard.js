/**
 * 包含数据的画板对象
 * by littlefean
 */
class DrawBoard {
    constructor(queryEleStr) {
        // 绑定的canvas对象
        this.bindEle = document.querySelector(queryEleStr);

        // 存放所有的画的痕迹的数据
        /**
         *
         * @type {[Line]}
         */
        this.drawContent = [];
    }

    /**
     * 把一个线段对象添加到这个画板对象中去
     * @param line
     */
    pushLine(line) {
        this.drawContent.push(line);
    }

    /**
     * 把当前画布里的所有信息转化成字符流
     * "['12,23=>33,56', '12,23=>33,56' ... ]"
     */
    dataToJson() {
        let res = [];
        for (let line of this.drawContent) {
            res.push(line.toString());
        }
        return res;
    }

    /**
     * 根据获得的字符流更新当前的画布
     * 这个函数主要是猜的人才会用到的地方
     * @param arr 经过json解析之后的arr
     */
    updateByJson(arr) {
        // 清空画布

        // 一个一个解析数组
        let ctx = this.bindEle.getContext("2d");

        for (let lineStr of arr) {
            Line.strToLine(lineStr).rend(ctx);
        }
    }


}
