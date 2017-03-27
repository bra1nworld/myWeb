function lines(dom) {
    dom.ctx = dom.getContext('2d');
    dom.frame = 0;
    dom.marginTop = 150;
    dom.marginLeft = 160;
    // this.drawLine = this.drawLine.bind(this);
    // 匿名参数解决requestAnimationFrame回调函数传参问题
    (function drawLine() {
        dom.frame++;
        if (dom.frame > 60) {
            dom.frame = 0;
        }
        if (dom.id === "line1") {
            dom.width = window.innerWidth;
            dom.height = window.innerHeight;
        }
        if (dom.id === "line2") {
            var sections = document.getElementById("sections");
            if (sections.classList.contains('animate')) {
                dom.frame = 60;
            }
            dom.width = 280;
            dom.height = window.innerHeight;
        }
        dom.ctx.beginPath();
        dom.ctx.strokeStyle = "#6a6a6a";
        dom.ctx.lineWidth = 1;
        var point = {
            1: [360, 0],
            2: [340, -90],
            3: [320, 90],
            4: [300, -55],
            5: [290, 55],
            6: [280, 0]
        }
        if (dom.id === "line1") {
            var year = document.getElementById("year").getClientRects()[0];
            dom.ctx.moveTo(year.left - 55, dom.marginTop);
            for (var i = 1; i <= 6; i++) {
                dom.ctx.lineTo(dom.marginLeft + point[i][0], dom.marginTop + jumpHeight(dom.frame, point[i][1]));
            }
            dom.ctx.lineTo(dom.marginLeft, dom.marginTop);
            dom.ctx.lineTo(dom.marginLeft, dom.height);
            dom.ctx.stroke();
        }
        if (dom.id === "line2") {
            dom.ctx.moveTo(dom.marginLeft, 0);
            for (var i = 6; i > 0; i--) {
                dom.ctx.lineTo(dom.marginLeft + jumpHeight(dom.frame, point[i][1]), point[i][0])
            }
            dom.ctx.lineTo(dom.marginLeft, dom.height);
            dom.ctx.stroke()
        }
        //每秒刷新60次
        requestAnimationFrame(drawLine);
    })()
}

//调整跳动高度(frame：0->60 高度为：1-->1/3-->6/5-->0)
function jumpHeight(frame, height) {
    var percent;
    if (frame <= 20) {
        //控制高度变化为线性
        frame = 30 - frame;
        percent = (frame / 30);
    } else if (frame > 20 && frame < 50) {
        frame = 50 - frame;
        percent = (frame / 25);
    }
    //frame>50的时候由于i未赋值，所以返回的为空
    return height * percent
}