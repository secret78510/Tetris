import {
    size,
    colLength,
    rowLength,
    preViewSize,
    preViewColLength,
    preViewRowLength,
    storageSize,
    storageRowLength,
    storageColength,
    boardBorder,
    colors,
    boxs,
    boardBgColor,
    tetrisBorderColor
} from './variable.js';
import { H } from './box.js';


const mp3 = document.querySelector('.mp3');
const score = document.querySelector('.score span');
let randomColors = randomVariable(colors);
let randomBoxs = randomVariable(boxs);

//[[T,'#9AD9C4'],[O,'#F3FCC7']]
let tetrominoes = randomBoxs.map((item, index) => [item, randomColors[index]])
function randomTetrominoes() {
    return Math.floor(Math.random() * tetrominoes.length);
};

function randomVariable(arr) {
    let newArr = [];
    while (newArr.length !== arr.length) {
        let randomColor = arr[Math.floor(arr.length * Math.random())]
        if (!newArr.includes(randomColor)) {
            newArr.push(randomColor)
        }
    }
    return newArr
}

export class TetrisBoard {
    constructor(ctx, x, y, rowLength, colLength, size) {
        this.ctx = ctx;
        this.board = [];
        this._positionX = x;
        this._positionY = y;
        this.boardBorder = boardBorder;
        this.rowLength = rowLength;
        this.colLength = colLength;
        this.strokeStyle = 'black';
        this.fillStyle = boardBgColor;
        this._size = size;
        this.initBoard();
    }
    set positionX(x) {
        this._positionX = x;
    }

    get positionX() {
        return this._positionX;
    }
    set size(size) {
        this._size = size;
    }

    get size() {
        return this._size;
    }
    set positionY(y) {
        this._positionY = y;
    }

    get positionY() {
        return this._positionY;
    }

    initBoard() {
        for (let r = 0; r < this.rowLength; r++) {
            this.board.push([]);
            for (let c = 0; c < this.colLength; c++) {
                this.board[r].push([]);
                this.board[r][c] = this.fillStyle;
            }
        }
    }
    drawSquare(x, y, width, color) {
        this.ctx.beginPath();
        this.ctx.save()
        this.ctx.translate(this._positionX, this._positionY);
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
        this.ctx.restore()
    }

    updateBoard() {
        //避免stroke重繪一直加深
        for (let r = 0; r < this.rowLength; r++) {
            for (let c = 0; c < this.colLength; c++) {
                this.drawSquare(
                    this._size * c,
                    this._size * r,
                    this._size,
                    boardBgColor
                );
            }
        }
        for (let r = 0; r < this.rowLength; r++) {
            for (let c = 0; c < this.colLength; c++) {
                this.drawSquare(
                    this._size * c,
                    this._size * r,
                    this._size,
                    this.board[r][c]
                );
            }
        }
    }
}


export class TetrisCenterBoard extends TetrisBoard {

    constructor(ctx, x, y, rowLength, colLength, size, myRecord) {
        super(ctx, x, y, rowLength, colLength, size);
        this.isEnd = false;
        this.myRecord = myRecord;
        this.updateBoard();
    }


    reset() {
        for (let r = 0; r < rowLength; r++) {
            for (let c = 0; c < colLength; c++) {
                this.board[r][c] = this.fillStyle;
            }
        }
        this.isEnd = false;
        this.updateBoard();
    }

    isGameOver() {
        //檢查第一排是否有被碰到
        for (let c = 0; c < colLength; c++) {
            if (this.board[0][c] !== this.fillStyle) {
                this.isEnd = true;
                this.myRecord.update(Number(score.textContent))
                this.myRecord.show();
                mp3.pause();
                break;
            }
        }
        return this.isEnd
    }

    updateBoardBorder() {
        const width = colLength * size + this.boardBorder;
        const height = rowLength * size + this.boardBorder;
        this.ctx.beginPath();
        this.ctx.save();
        this.ctx.translate(this._positionX, this._positionY);
        this.ctx.rect(-1, -1, width, height);
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.lineWidth = this.boardBorder;
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
    }

}



export class TetrisRightBoard extends TetrisBoard {

    constructor(ctx, x, y, rowLength, colLength, size) {
        super(ctx, x, y, rowLength, colLength, size);
        this.previewTetrisArr = [];
        this.previeweMaxLength = 3;
        this.y1 = 1;
        this.y2 = 6;
        this.y3 = 11;
    }
    updateTertris(box, color, y) {
        let i = 0;
        //遇到H要換下一個動作
        if (box[i] === H[0]) {
            i++;
        }
        const x = Math.floor((this.colLength / 2) - (box[i].length / 2));
        for (let r = 0; r < this.rowLength; r++) {
            for (let c = 0; c < this.colLength; c++) {
                if (box[i][r]?.[c]) {
                    this.board[r + y][c + x] = color;
                }
            }
        }
    }
    reset() {
        this.clear();
        randomColors = randomVariable(colors);
        randomBoxs = randomVariable(boxs);
        tetrominoes = randomBoxs.map((item, index) => [item, randomColors[index]]);
        this.previewTetrisArr = [];
        this.updatePreviewTetris();
    }
    clear() {
        for (let r = 0; r < this.rowLength; r++) {
            for (let c = 0; c < this.colLength; c++) {
                this.board[r][c] = this.fillStyle;
            }
        }
        this.updateBoard();
    }
    shift() {
        if (!this.previewTetrisArr.length) { return }
        const tetris = this.previewTetrisArr.shift();
        this.updatePreviewTetris();

        return tetris
    }
    updataPreviewTetrisArr() {
        while (this.previewTetrisArr.length < this.previeweMaxLength) {
            const random = randomTetrominoes();
            this.previewTetrisArr.push({ box: tetrominoes[random][0], color: tetrominoes[random][1] });
        }
    }
    updatePreviewTetris() {
        this.clear();
        this.updataPreviewTetrisArr();
        let i = 3;
        //從下方往上
        while (i > 0) {
            this.updateTertris(this.previewTetrisArr[i - 1].box, this.previewTetrisArr[i - 1].color, this['y' + i]);
            i--;
        }
        this.updateBoard();
    }
    updateBoardBorder() {
        const width = preViewSize * preViewColLength + this.boardBorder;
        const height = preViewSize * preViewRowLength + this.boardBorder;
        this.ctx.beginPath();
        this.ctx.save()
        this.ctx.translate(this._positionX, this._positionY);
        this.ctx.rect(-1, -1, width, height);
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.lineWidth = this.boardBorder;
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
    }
}


export class TetrisLeftBoard extends TetrisBoard {
    constructor(ctx, x, y, rowLength, colLength, size) {
        super(ctx, x, y, rowLength, colLength, size)
        this.y = 1;
        this.isStorage = false;
        this.storageTetrisArr = [];
        this.storageMaxLength = 1;
    }
    reset() {
        this.clear();
        this.isStorage = false;
    }
    clear() {
        for (let r = 0; r < this.rowLength; r++) {
            for (let c = 0; c < this.colLength; c++) {
                this.board[r][c] = this.fillStyle;
            }
        }
        this.updateBoard();
    }
    updateTertris(box, color) {
        let i = 0;
        //遇到H要換下一個動作
        if (box[i] === H[0]) {
            i++;
        }
        const x = Math.floor((this.colLength / 2) - (box[i].length / 2));

        for (let r = 0; r < this.rowLength; r++) {
            for (let c = 0; c < this.colLength; c++) {
                if (box[i][r]?.[c]) {
                    this.board[r + this.y][c + x] = color;
                }
            }
        }

    }
    shift() {
        if (!this.storageTetrisArr.length) { return }
        const tetris = this.storageTetrisArr.shift();
        return tetris
    }
    storageTertris(box, color) {

        while (this.storageTetrisArr.length < this.storageMaxLength) {
            this.storageTetrisArr.push({ box, color });
            this.updateTertris(box, color)
        }

        this.isStorage = true;
    }

    updateBoardBorder() {
        const width = storageSize * storageColength + this.boardBorder;
        const height = storageSize * storageRowLength + this.boardBorder;
        this.ctx.beginPath();
        this.ctx.save()
        this.ctx.translate(this._positionX, this._positionY);
        this.ctx.rect(-1, -1, width, height);
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.lineWidth = this.boardBorder;
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
    }
}