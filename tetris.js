import {
    size,
    colLength,
    rowLength,
    boardBgColor,
    tetrisBorderColor
} from './variable.js';
import { H } from './box.js';

export class Tetris {
    constructor(ctx, data, TetrisBoard, color) {
        this.x = Math.ceil(colLength / 2) - 2;
        this.y = -2;
        this.ctx = ctx;
        this.data = data;
        this.sort = 0;
        this.color = color;
        this.curDataValue = data[0];
        this.tetrisBoard = TetrisBoard;
        this.score = document.querySelector('.score span');
        this.isDestination = false;
    }

    ifOutOfBoundsUpdateXY(sort) {
        for (let r = 0; r < this.data[sort].length; r++) {
            for (let c = 0; c < this.data[sort].length; c++) {
                if (!this.data[sort][r][c]) { return }
                if (c + this.x >= colLength) {
                    return this.x = this.x - (this.data[sort][r].length + this.x - colLength);
                } else if (c + this.x < 0) {
                    return this.x = 0;
                }
                if (r + this.y >= rowLength) {
                    return this.y = this.y - (this.data[sort][r].length + this.y - rowLength);
                } else if (r + this.y < 0) {
                    return this.y = 0;
                }
            }
        }
    }

    clickUp() {
        const sort = this.sort !== this.data.length - 1 ? this.sort + 1 : 0;
        //避免H 第一種不能轉
        if (this.isOutBoard(0, 0, this.data[sort]) || this.isCollision(0, 0, this.data[sort])) {
            if (this.correctionUp(this.data[sort], sort)) {
                // this.ifOutOfBoundsUpdateXY(sort);
                this.sort = sort;
                this.curDataValue = this.data[this.sort];
                this.drawShape();
            }
        }
        if (this.isOutBoard(0, 0, this.data[sort]) || this.isCollision(0, 0, this.data[sort])) { return }
        this.clear();
        // this.ifOutOfBoundsUpdateXY(sort);
        this.sort = sort;
        this.curDataValue = this.data[this.sort];
        this.drawShape();
    }

    clickDown() {
        if (this.isOutBoard(0, 1, this.curDataValue) || this.isCollision(0, 1, this.curDataValue)) {
            this.updateTetrisBoard();
            this.isDestination = true;
            this.isEliminate();
        } else {
            this.clear();
            this.y++;
            this.drawShape();
        }
    }
    replaceAttibutes(data, color) {
        this.data = data;
        this.color = color;
        this.curDataValue = data[0];
        this.sort = 0;
    }
    correctionUp(curData, sort) {
        //H轉第二種才會遇到
        const isH = H[0][0].length === curData.length && sort === 1;
        if (!this.isOutBoard(0, -1, curData) && !this.isCollision(0, -1, curData) && isH) {
            this.clear();
            this.y = this.y - 1;
            return true
        } else if (!this.isOutBoard(0, -2, curData) && !this.isCollision(0, -2, curData) && isH) {
            this.clear();
            this.y = this.y - 2;
            return true
        }
        return false
    }
    replaceTetris(data, color) {
        const curData = data[0];
        // //當別的旋轉只剩兩行時 長條長度為四需多一次移動判斷
        const isH = H[0][0].length === curData.length;
        if (!this.isOutBoard(0, 0, curData) && !this.isCollision(0, 0, curData)) {
            this.replaceAttibutes(data, color);
            return true
        } else if (!this.isOutBoard(-1, 0, curData) && !this.isCollision(-1, 0, curData)) {
            this.x = this.x - 1;
            this.replaceAttibutes(data, color);
            return true
        } else if (!this.isOutBoard(-2, 0, curData) && !this.isCollision(-2, 0, curData) && isH) {
            this.x = this.x - 2;
            this.replaceAttibutes(data, color);
            return true
        } else if (!this.isOutBoard(1, 0, curData) && !this.isCollision(1, 0, curData)) {
            this.x = this.x + 1;
            this.replaceAttibutes(data, color);
            return true
        } else if (!this.isOutBoard(2, 0, curData) && !this.isCollision(2, 0, curData) && isH) {
            this.x = this.x + 2;
            this.replaceAttibutes(data, color);
            return true
        } else if (!this.isOutBoard(0, -1, curData) && !this.isCollision(0, -1, curData)) {
            this.y = this.y - 1;
            this.replaceAttibutes(data, color);
            return true
        }

        return false
    }
    updateTetrisBoard() {
        for (let r = 0; r < this.curDataValue.length; r++) {
            for (let c = 0; c < this.curDataValue.length; c++) {
                if (this.curDataValue[r][c] && this.y + r >= 0) {
                    this.tetrisBoard.board[this.y + r][this.x + c] = this.color;
                }
            }
        }

        this.tetrisBoard.updateBoard();
    }

    isEliminate() {

        let eliminateArr = [];
        //計算第幾行滿
        for (let r = 0; r < rowLength; r++) {
            let count = 0;
            for (let c = 0; c < colLength; c++) {
                if (this.tetrisBoard.board[r][c] !== boardBgColor) { count++; }
                if (count === colLength) {
                    eliminateArr.push(r);
                }
            }
        }

        if (!eliminateArr.length) { return }

        while (eliminateArr.length) {
            const r = eliminateArr.shift();
            //消除變成背景色
            for (let c = 0; c < colLength; c++) {
                this.tetrisBoard.board[r][c] = boardBgColor;
            }
            //往上替換
            for (let i = r; i > 0; i--) {
                const temp = this.tetrisBoard.board[i];
                this.tetrisBoard.board[i] = this.tetrisBoard.board[i - 1];
                this.tetrisBoard.board[i - 1] = temp;
            }
            this.score.textContent = +this.score.textContent + 1000;
        }
        this.tetrisBoard.updateBoard();
        this.isDestination = true;

    }

    isCollision(x, y, data) {
        for (let r = 0; r < data.length; r++) {
            for (let c = 0; c < data.length; c++) {
                // this.y === -2 遊戲盤還是空白
                if (this.y === -2 || !data[r][c]) { continue }
                //超出範圍
                if (!this.tetrisBoard.board?.[this.y + y + r]?.[this.x + x + c]) { continue }
                if (this.tetrisBoard.board[this.y + y + r][this.x + x + c] !== boardBgColor) {
                    return true;
                }
            }
        }
        return false
    }
    isOutBoard(x, y, data) {
        for (let r = 0; r < data.length; r++) {
            for (let c = 0; c < data.length; c++) {
                if (!data[r][c]) { continue }
                if (
                    this.y + y + r >= rowLength ||
                    this.x + x + c >= colLength ||
                    this.x + x + c < 0
                ) {
                    return true;
                }
            }
        }
        return false
    }
    clickLeft() {
        if (this.isCollision(-1, 0, this.curDataValue) || this.isOutBoard(-1, 0, this.curDataValue)) { return }
        this.clear();
        this.x--;
        this.drawShape();
    }
    clickRight() {
        if (this.isCollision(1, 0, this.curDataValue) || this.isOutBoard(1, 0, this.curDataValue)) { return }
        this.clear();
        this.x++;
        this.drawShape();
    }

    //待檢查
    clickSpace() {
        //先等元素出來
        if (this.y === -2) { return }
        let y = 0;
        for (let r = 1; this.y + r <= rowLength; r++) {
            if (this.isOutBoard(0, r, this.curDataValue) || this.isCollision(0, r, this.curDataValue)) {
                y = this.y + r - 1;
                break
            }
        }
        this.y = y;
        this.updateTetrisBoard();
        this.isEliminate();
        this.isDestination = true;
    }

    clear() {
        this.drawShape(boardBgColor);
    }

    drawShape(color = this.color) {
        this.ctx.beginPath();
        this.ctx.save()
        this.ctx.translate(Math.ceil(this.ctx.canvas.width / 2 - (colLength * size / 2)), 50);
        for (let r = 0; r < this.curDataValue.length; r++) {
            for (let c = 0; c < this.curDataValue.length; c++) {
                //超出範圍不顯示
                if (this.curDataValue[r][c] && this.y + r >= 0) {
                    this.drawSquare((this.x * size) + (size * c), (this.y * size) + (size * r), size, color);
                }
            }
        }
        this.ctx.closePath();
        this.ctx.restore();
    }


    drawSquare(x, y, width, color) {
        this.ctx.beginPath();
        if (color === boardBgColor) {
            this.ctx.clearRect(x, y, width, width);
            this.ctx.fillStyle = boardBgColor;
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x + width, y);
            this.ctx.lineTo(x + width, y + width);
            this.ctx.lineTo(x, y + width);

            this.ctx.closePath();
        } else {
            //預設1px 是上下左右大約可能是0.5吧 不到1就是了
            const newX = x + 1.2;
            const newY = y + 1.2;
            const newWidth = width - 2.5;
            this.ctx.strokeStyle = tetrisBorderColor;
            this.ctx.fillStyle = color;
            this.ctx.moveTo(newX, newY);
            this.ctx.lineTo(newX + newWidth, newY);
            this.ctx.lineTo(newX + newWidth, newY + newWidth);
            this.ctx.lineTo(newX, newY + newWidth);
            this.ctx.closePath();
            this.ctx.stroke();
        }
        this.ctx.fill();
    }
}