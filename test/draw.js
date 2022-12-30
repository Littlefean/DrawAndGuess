/**
 *
 * by littlefean
 */
let url = "ws://localhost:10086";

window.onload = function () {

    let ws = new WebSocket(url);
    console.log(ws);

    // 创建画板对象
    let drawBoard = new DrawBoard(".mainCanvas");

    ws.onopen = () => {
        // 给服务器发送消息
    }

    // 接收服务器的消息
    ws.onmessage = (e) => {
        // ...
        let msgObj = JSON.parse(e.data);

        if (msgObj.title) {
            switch (msgObj.title) {
                case "broadcastMassage":
                    // 这是一条应该打印在聊天框的广播消息
                    document.querySelector(`.chat`).appendChild(div(msgObj.msg, "msg"));
                    break;

                case "updateBoard":
                    // 来自服务器的更新画板的广播
                    drawBoard.updateByJson(msgObj.msg);
                    break;

                case "drawThing":
                    // 来自服务器的题目
                    let t = msgObj.msg;
                    document.querySelector(`.drawThing`).innerHTML = t;
                    break;
            }
        }

    };

    ws.onclose = () => {

    }

    ws.onerror = () => {

    }


    // 填上去随机名字
    let nameInput = document.querySelector(`.nameInput`);
    nameInput.value = randomName();
    document.querySelector(`.changeName`).onclick = () => {
        nameInput.value = randomName();
    };

    // 两个界面的切换逻辑
    let choiceView = document.querySelector(`.choiceView`);
    let playView = document.querySelector(`.playView`);
    let imagePanel = document.querySelector(`.imagerPanel`);
    let drawerPanel = document.querySelector(`.drawerPanel`);
    let isDrawer = false;  // 这个用户是不是画手
    /**
     * 当前这个客户端进入游戏页面
     */
    function playGoIn() {
        choiceView.style.display = "none";
        playView.style.display = "block";
        let msgObj = {
            title: "userInPlay",
            userName: nameInput.value,
            mode: isDrawer ? "drawer" : "imager",
        }
        ws.send(JSON.stringify(msgObj));
    }

    document.querySelector(`.drawer`).addEventListener("click", () => {
        isDrawer = true;
        imagePanel.style.display = "none";
        drawerPanel.querySelector(`.yourName`).innerHTML = nameInput.value;
        playGoIn();
    });
    document.querySelector(`.imager`).addEventListener("click", () => {
        isDrawer = false;
        drawerPanel.style.display = "none";
        imagePanel.querySelector(`.yourName`).innerHTML = nameInput.value;
        playGoIn();
    });

    // canvas 基础设置

    let mainCanvas = document.querySelector(`.mainCanvas`);

    mainCanvas.width = "800";
    mainCanvas.height = "500";

    let ctx = mainCanvas.getContext("2d");
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;

    /**
     * 上一次的鼠标位置点
     * @type {Point}
     */
    let lastPoint = new Point(0, 0);

    let isMouseDown = false;

    mainCanvas.addEventListener("mousemove", (e) => {
        let cur = new Point(e.clientX - mainCanvas.offsetLeft,
            e.clientY - mainCanvas.offsetTop);
        if (isMouseDown && isDrawer) {
            // 开始画
            let line = new Line(lastPoint, cur);
            line.rend(ctx);
            drawBoard.pushLine(line);
        }
        lastPoint = cur;
    });

    mainCanvas.addEventListener("mousedown", (e) => {
        isMouseDown = true;
    });

    mainCanvas.addEventListener("mouseup", (e) => {
        if (isDrawer) {
            isMouseDown = false;
            try {
                // 告诉服务器说我更新了画板
                let msg = {
                    title: "draw",
                    drawData: drawBoard.dataToJson(),
                }
                ws.send(JSON.stringify(msg));
            } catch (e) {

            }
        }
    });

    // 用户猜测的处理
    let submit = document.querySelector(`.submit`);
    let imageInput = document.querySelector(`.imageInputText`);
    submit.addEventListener("click", () => {
        let imageText = imageInput.value;
        console.log(imageText);

        if (imageText !== "") {
            // 用户输入的不是空字符串
            imageInput.value = "";
            let msg = {
                title: "image",
                userName: nameInput.value,
                imageText: imageText,
            }
            ws.send(JSON.stringify(msg));
        }
    });
}


