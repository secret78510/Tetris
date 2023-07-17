

export class Panel {
    constructor(ctx, leftPanelX, leftPanelY, rightPanelX, rightPanelY, themeBg) {
        this.ctx = ctx;
        this.leftPanelX = leftPanelX;
        this.leftPanelY = leftPanelY;
        this.rightPanelX = rightPanelX;
        this.rightPanelY = rightPanelY;
        this.size = 24;
        this.leftBg = 'rgba(256,256,256,0.4)';
        this.themeBg = themeBg;
        this.rightBg = '#A2EFFF';
        this.piddingY = 15;
        this.piddingX = 25;
        this.topPoint = { x1: 0, y1: 0, x1: 0, y2: 0, x3: 0, y3: 0 };
        this.leftPoint = { x1: 0, y1: 0, x1: 0, y2: 0, x3: 0, y3: 0 };
        this.rightPoint = { x1: 0, y1: 0, x1: 0, y2: 0, x3: 0, y3: 0 };
        this.bottomPoint = { x1: 0, y1: 0, x1: 0, y2: 0, x3: 0, y3: 0 };
    }

    leftTriangle(x, y) {
        this.drawTriangle(x, y);
    }

    drawTriangle(x1, y1, x2, y2, x3, y3) {

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1)
        this.ctx.lineTo(x2, y2)
        this.ctx.lineTo(x3, y3)
        this.ctx.closePath();
        this.ctx.fill();
    }
    drawCircle(x, y, bg) {
        this.ctx.beginPath();
        this.ctx.save();
        this.ctx.fillStyle = bg;
        this.ctx.arc(x, y, this.size * 2, 0, Math.PI * 2)
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    update(leftPanelX, leftPanelY, rightPanelX, rightPanelY) {
        this.leftPanelX = leftPanelX;
        this.leftPanelY = leftPanelY;
        this.rightPanelX = rightPanelX;
        this.rightPanelY = rightPanelY;
        this.reset();
    }
    hide() {
        this.drawCircle(this.leftPanelX + this.size / 2, this.leftPanelY, this.themeBg);
        this.drawCircle(this.rightPanelX - this.size / 2, this.rightPanelY, this.themeBg);
    }

    triangleTop() {
        let x1, y1, x2, y2, x3, y3;
        const newY = this.leftPanelY - this.piddingY;
        this.topPoint = {
            x1: x1 = this.leftPanelX,
            y1: y1 = newY,
            x2: x2 = this.leftPanelX + this.size / 2,
            y2: y2 = newY - this.size,
            x3: x3 = this.leftPanelX + this.size,
            y3: y3 = newY
        }
        this.drawTriangle(
            x1, y1, x2, y2, x3, y3
        )
    }

    triangleLeft() {
        let x1, y1, x2, y2, x3, y3;
        const newX = this.leftPanelX - this.piddingX;
        this.leftPoint = {
            x1: x1 = newX,
            y1: y1 = this.leftPanelY,
            x2: x2 = newX + this.size,
            y2: y2 = this.leftPanelY - this.size / 2,
            x3: x3 = newX + this.size,
            y3: y3 = this.leftPanelY + this.size / 2
        }
        this.drawTriangle(
            x1, y1, x2, y2, x3, y3
        )
    }
    triangleRight() {
        let x1, y1, x2, y2, x3, y3;
        const newX = this.leftPanelX + this.piddingX;
        this.rightPoint = {
            x1: x1 = newX,
            y1: y1 = this.leftPanelY - this.size / 2,
            x2: x2 = newX + this.size,
            y2: y2 = this.leftPanelY,
            x3: x3 = newX,
            y3: y3 = this.leftPanelY + this.size / 2
        }
        this.drawTriangle(
            x1, y1, x2, y2, x3, y3
        )
    }
    triangleBottom() {
        let x1, y1, x2, y2, x3, y3;
        const newY = this.leftPanelY + this.piddingY;
        this.bottomPoint = {
            x1: x1 = this.leftPanelX,
            y1: y1 = newY,
            x2: x2 = this.leftPanelX + this.size,
            y2: y2 = newY,
            x3: x3 = this.leftPanelX + this.size / 2,
            y3: y3 = newY + this.size
        }
        this.drawTriangle(
            x1, y1, x2, y2, x3, y3
        )
    }
    isPointInCircle(mouseX, mouseY) {
        const r = this.size * 2;
        const rightPanelX = this.rightPanelX - this.size / 2;
        const distance = Math.sqrt((mouseX - rightPanelX) * (mouseX - rightPanelX) + (mouseY - this.rightPanelY) * (mouseY - this.rightPanelY))
        return r > distance
    }
    isPointInTriangle(x1, y1, x2, y2, x3, y3, x, y) {
        let triangleArea = Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2);
        let areaA = Math.abs((x * (y2 - y3) + x2 * (y3 - y) + x3 * (y - y2)) / 2);
        let areaB = Math.abs((x1 * (y - y3) + x * (y3 - y1) + x3 * (y1 - y)) / 2);
        let areaC = Math.abs((x1 * (y2 - y) + x2 * (y - y1) + x * (y1 - y2)) / 2);
        return triangleArea === areaA + areaB + areaC;
    }
    reset() {
        this.triangleTop();
        this.triangleLeft();
        this.triangleRight();
        this.triangleBottom();
        this.drawCircle(this.leftPanelX + this.size / 2, this.leftPanelY, this.leftBg);
        this.drawCircle(this.rightPanelX - this.size / 2, this.rightPanelY, this.rightBg);
    }
}
