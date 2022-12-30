/**
 *
 * by littlefean
 */

/**
 * 随机选择一个元素
 * @param arr
 * @return {*}
 */
function randomChoice(arr) {
    let randI = Math.floor(Math.random() * arr.length);
    return arr[randI];
}

function randomName() {
    let adjList = "氢弹 原子弹 月球 木卫二 冥王星 太阳 核桃 宇宙 银河系 黑洞 地球 太平州 中国 美国 半人马座 比邻星".split(" ");
    let fList = "上面 里面 下面 外面 中心".split(" ");
    let n = "柯洁 阿尔法狗 机器人 霍金 图灵 弗洛伊德 迪杰斯特拉 玛莎拉蒂 福尔马林 阿司匹林 阿莫西林 玛尔扎哈 蒙娜丽莎 迪丽热巴 古力娜扎".split(" ");
    return randomChoice(adjList) + randomChoice(fList) + "的" + randomChoice(n);
}

function div(innerText, className) {
    let res = document.createElement("div");
    res.innerText = innerText;
    res.classList.add(className);
    return res;
}
