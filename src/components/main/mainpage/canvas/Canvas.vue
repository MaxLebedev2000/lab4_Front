<template>
    <div class="canv">
        <canvas id="canvas" ref="canvas" width="320px" height="320px" @click="listener"
                style="background: white;"></canvas>
    </div>

</template>


<script>
    export default {
        name: "Canvas",
        props: ["isRedraw", "isDrawPoint"],
        watch: {
            isRedraw: function () {
                this.redraw();
            },
            isDrawPoint: function () {
                this.drawPoint(localStorage.getItem('response'), localStorage.getItem('checkedR'))
                this.redraw();
            }

        },

        mounted: function () {
            this.redraw();
        },

        data() {
            return {
                width: 320,
                height: 320,
                padding: 20,
                LINE_WIDTH: 2,
                canvas: document.getElementById("canvas"),
                maxR: 5,
                BaseURL: "http://localhost:8030/api/points",
            }
        },
        methods:
            {
                askList() {
                    return this.$axios({
                        method: 'get',
                        url: "http://localhost:8030/api/points",
                        headers: {'Content-Type': 'application/json', 'token': localStorage.getItem('token')},
                    }).then((data) => {
                        return data.data;
                    }).catch(
                        (error) => {
                            alert(error)
                        }
                    );
                },

                drawArrow(from, to, headlen = 10) {
                    let ctx = document.getElementById("canvas").getContext("2d");
                    ctx.fillStyle = "rgb(0, 0, 0)";
                    ctx.beginPath();
                    ctx.lineWidth = this.LINE_WIDTH;
                    let angle = Math.atan2(to.y - from.y, to.x - from.x);
                    ctx.moveTo(from.x, from.y);
                    ctx.lineTo(to.x, to.y);
                    ctx.lineTo(to.x - headlen * Math.cos(angle - Math.PI / 6), to.y - headlen * Math.sin(angle - Math.PI / 6));
                    ctx.moveTo(to.x, to.y);
                    ctx.lineTo(to.x - headlen * Math.cos(angle + Math.PI / 6), to.y - headlen * Math.sin(angle + Math.PI / 6));
                    ctx.stroke();
                },

                axises(color = "rgb(0, 0, 0)") {
                    let ctx = document.getElementById("canvas").getContext("2d");
                    let center = {
                        x: this.width / 2,
                        y: this.height / 2
                    };
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(center.x, center.y, this.width / 200 < 5 ? this.width / 200 : 5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.font = "bold 13px Courier";
                    ctx.fillText("Y", this.width / 2 - 15, 10);
                    ctx.fillText("X", this.width - 10, this.height / 2 - 8);
                    this.drawArrow({x: 0, y: center.y}, {x: this.width, y: center.y});
                    this.drawArrow({x: center.x, y: this.height}, {x: center.x, y: 0});
                },

                drawMark(from, to) {
                    let ctx = document.getElementById("canvas").getContext("2d");
                    ctx.fillStyle = "rgb(0, 0, 0)";
                    let horizontal = from.x === to.x;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    if (horizontal) {
                        ctx.moveTo(from.x, from.y);
                        ctx.lineTo(to.x, to.y);
                        ctx.stroke();
                    } else {
                        ctx.moveTo(from.x, from.y);
                        ctx.lineTo(to.x, to.y);
                        ctx.stroke();
                    }
                },

                rMarks() {
                    let ctx = document.getElementById("canvas").getContext("2d");
                    let size;
                    ctx.fillStyle = "rgb(0, 0, 0)";
                    ctx.font = "normal 10px Courier";
                    let xMark = this.padding;
                    let stepx = (this.width - 2 * this.padding) / (this.maxR * 2 * 2);
                    let xLine = this.height / 2;
                    let yMark = this.padding;
                    let stepy = (this.height - 2 * this.padding) / (this.maxR * 2 * 2);
                    let yLine = this.width / 2;
                    for (let i = -this.maxR; i <= this.maxR; i += 0.5) {
                        if (i % 1 === 0) {
                            size = 3;
                        } else {
                            size = 1.5;
                        }
                        this.drawMark({x: xMark, y: (xLine - size)}, {x: xMark, y: (xLine + size)});
                        if (i !== 0 && i % 1 === 0) {
                            ctx.fillText(i.toString(), xMark - 6, xLine + size + 10);
                        }
                        xMark += stepx;
                    }
                    for (let i = this.maxR; i >= -this.maxR; i -= 0.5) {
                        if (i % 1 === 0) {
                            size = 3;
                        } else {
                            size = 1.5;
                        }
                        this.drawMark({x: yLine - size, y: yMark}, {x: yLine + size, y: yMark});
                        let ctx = document.getElementById("canvas").getContext("2d");
                        if (i !== 0 && i % 1 === 0) {
                            ctx.fillText(i.toString(), yLine + size + 10, yMark);
                        }
                        yMark += stepy;
                    }
                },

                drawFigure(r) {
                    let ctx = document.getElementById("canvas").getContext("2d");
                    let pd = this.padding + ((5 - r) * ((this.width - 2 * this.padding) / 10));
                    ctx.beginPath();
                    ctx.fillStyle = "rgb(38,86,200)";
                    ctx.beginPath();
                    ctx.moveTo((this.width - 2 * pd) / 4 + pd, this.height / 2);
                    ctx.arc(this.width / 2, this.height / 2,
                        (this.width - 2 * pd) / 4, Math.PI, 3 * Math.PI / 2, false);
                    ctx.lineTo(this.width / 2, pd);
                    ctx.lineTo(3 * (this.width - 2 * pd) / 4 + pd, pd);
                    ctx.lineTo((this.width - 2 * pd) / 4 * 3 + pd, this.height / 2);
                    ctx.lineTo(this.width - pd, this.height / 2);
                    ctx.lineTo(this.width / 2, this.height - pd);
                    ctx.lineTo(this.width / 2, this.height / 2);
                    ctx.fill();

                },

                drawPoints(jsonlist, curR = this.maxR) {
                    for (let check of jsonlist) {
                        this.drawPoint(check, curR);
                    }
                },

                drawPoint(check, curR) {
                    let ctx = document.getElementById("canvas").getContext("2d");
                    let cnv = this.toCanvas(check);

                    let tr = parseFloat(check.r) !== parseFloat(curR);

                    if (tr) {

                        ctx.fillStyle = "#000000";

                    } else {

                        if (JSON.parse(check.result)) {

                            ctx.fillStyle = "#008000";
                        } else {

                            ctx.fillStyle = "#FF0000";
                        }
                    }
                    ctx.beginPath();
                    ctx.arc(cnv.x, cnv.y, 2, 0, 2 * Math.PI);
                    ctx.fill();

                },

                async redraw() {
                    let r = localStorage.getItem('checkedR');
                    let json = await this.askList();
                    let ctx = document.getElementById("canvas").getContext("2d");
                    ctx.clearRect(0, 0, 320, 320);
                    this.drawFigure(r);
                    this.axises();
                    this.rMarks();
                    this.drawPoints(json, r);
                },

                toCanvas(point) {
                    let x = point.x;
                    let y = point.y;
                    if (x > 0) {
                        x = this.width / 2 + x * (this.width - 2 * this.padding) / 10;
                    } else {
                        x = this.width / 2 + x * (this.width - 2 * this.padding) / 10;
                    }
                    if (y > 0) {
                        y = this.height / 2 - y * (this.height - 2 * this.padding) / 10;
                    } else {
                        y = this.height / 2 - y * (this.height - 2 * this.padding) / 10;
                    }
                    return {"x": x, "y": y};
                },

                listener: function (event) {
                    let rect = document.getElementById("canvas").getBoundingClientRect();
                    let canx = (event.clientX - rect.left - this.LINE_WIDTH / 2);
                    let cany = (event.clientY - rect.top - this.LINE_WIDTH / 2);
                    let r = localStorage.getItem('checkedR');
                    console.log({"x": canx, "y": cany, "r": r});
                    let res = this.fromCanvas({"x": canx, "y": cany, "r": r});
                    console.log(res.x + ":" + res.y + ":" + res.r);
                    this.$axios({
                        timeout: 500,
                        method: 'post',
                        headers: {'Content-Type': 'application/json', 'token': localStorage.getItem('token')},
                        url: this.BaseURL,
                        data: res
                    }).then((data) => {
                        let response = data.data;
                        if (response.auth === "failed") {
                            alert("Для отправки точек необходимо авторизаваться!!!");
                        } else {
                            this.drawPoint(response, localStorage.getItem('checkedR'))
                            this.$emit("drawTableCanvas");
                        }
                    })
                },
                fromCanvas(canPoint) {
                    let x = canPoint.x;
                    let y = this.height - canPoint.y;
                    if (x < this.width / 2) {
                        x = -(this.width / 2 - x);
                    } else {
                        x = x - this.width / 2;
                    }
                    if (y < this.height / 2) {
                        y = -(this.height / 2 - y);
                    } else {
                        y = y - this.height / 2;
                    }
                    x = x / ((this.width - 2 * this.padding) / 10);
                    y = y / ((this.height - 2 * this.padding) / 10);
                    return {"x": x, "y": y, "r": canPoint.r};

                }

            }
    }


</script>

<style scoped>


    @media only screen and (max-width: 695px) {
        #canvas {
            cursor: Crosshair;
        }



    }


    @media only screen and (max-width: 1216px) and (min-width: 696px) {
        #canvas {
            cursor: Crosshair;
        }


    }


    @media only screen and (min-width: 1217px) {
        #canvas {
            cursor: Crosshair;
            margin-left: 35%;
        }

    }


</style>