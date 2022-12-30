/**
 * 我的搜索记录
 *
 * 基本使用
 * https://blog.csdn.net/weixin_45532305/article/details/104622121
 *
 * 如何广播
 * https://npmmirror.com/package/ws#server-broadcast
 *
 * by littlefean
 */

let ws = require("ws");

let wss = new ws.Server({port: 10086});

/**
 * 随机生成一个要画的事物
 */
function randomThing() {
    let list = ["打草惊蛇", "长舌妇", "中国"];
    return list[Math.floor(Math.random() * list.length)];
}

let THING = randomThing();

/**
 * 建立连接
 */
wss.on('connection', function (ws) {
    console.log('server: 收到连接');

    function broadcast(msg) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === ws.OPEN) {
                client.send(msg);
            }
        });
    }

    // 收到客户端的消息
    ws.on('message', function (message, isBinary) {
        console.log('server: 收到消息', message.toString());

        let msgObj = JSON.parse(message.toString());

        if (msgObj.title) {
            // 开始分析收到的数据是什么
            switch (msgObj.title) {
                case "userInPlay":
                    // 有一个玩家进入了房间
                    // 广播，xxx进入了游戏
                    let msg = `${msgObj.userName}进入了房间`;
                    if (msgObj.mode === "drawer") {
                        msg = "灵魂画手 " + msg;
                    } else {
                        msg = "眼瞎猜手 " + msg;
                    }
                    broadcast(JSON.stringify({
                        title: "broadcastMassage",
                        msg: msg,
                    }));
                    // 把题目发给画手客户端
                    if (msgObj.mode === "drawer") {
                        ws.send(JSON.stringify({
                            title: "drawThing",
                            msg: THING,
                        }));
                    }
                    break;
                case "draw":
                    // 接受到了一个画画的消息
                    // 应该把这个画画的消息发送给所有猜的人，广播
                    wss.clients.forEach(function each(client) {
                        if (client.readyState === ws.OPEN) {
                            client.send(JSON.stringify({
                                title: "updateBoard",
                                msg: msgObj.drawData,
                            }));
                        }
                    });
                    break;
                case "image":
                    // 接受到了一个猜测消息
                    let testUser = msgObj.userName;
                    let testT = msgObj.imageText;
                    // 看看这个消息有没有猜对，把猜错了的消息打出去
                    // 如果这个消息猜对了，把这个消息广播说xxx猜对了
                    if (testT === THING) {
                        broadcast(JSON.stringify({
                            title: "broadcastMassage",
                            msg: `${testUser}猜对了啦！`,
                        }));
                    } else {
                        broadcast(JSON.stringify({
                            title: "broadcastMassage",
                            msg: `${testUser}：${testT}`,
                        }));
                    }
                    break;
            }
        }
    });
    ws.on("close", () => {
        console.log("与前端断开连接");
    })

    // 给客户端发现消息
    // ws.send('server: hi，客户端');
});

