import { TetrisCenterBoard, TetrisLeftBoard, TetrisRightBoard } from './tetrisBoard.js';
import { Tetris } from './tetris.js';
import {
    size, setSize, colLength, rowLength, X, Y, updateX,
    preViewRowLength, preViewColLength, storageRowLength, storageColength,
    storageSize, boardBorder, preViewSize, setPreViewSize, setStorageSize
} from './variable.js';
import { Record } from './record.js';
import { Panel } from './panel.js';
import { particleCanvas } from './particcle.js';

//canvas
const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');


const bgColor = window.getComputedStyle(document.querySelector('body')).getPropertyValue('background-color');
const score = document.querySelector('.score span');
const againBtn = document.querySelector('.record-footer button');
const startBtn = document.querySelector('.start button');
const record = document.querySelector(".record");
const start = document.querySelector('.start');


//操作盤
const myPanel = new Panel(ctx, 40, window.innerHeight - 80, window.innerWidth - 40, window.innerHeight - 80, bgColor);

// 記錄版
const myRecord = new Record(
    record,
    document.querySelector(".record ul"),
    score
);

//遊戲版
const myTetrisCenterBoard = new TetrisCenterBoard(ctx, X, Y, rowLength, colLength, size, myRecord);
const myTetrisRightBoard = new TetrisRightBoard(ctx, X + colLength * size + boardBorder, Y, preViewRowLength, preViewColLength, preViewSize);
const myTetrisLeftBoard = new TetrisLeftBoard(ctx, X - storageColength * storageSize - boardBorder, Y, storageRowLength, storageColength, storageSize);



//mp3
const mp3 = document.querySelector('.mp3');

let ms = 0;
let myTetris;
let startTime;
let updateMs = 40;
let maxUpdateMs = 10;


window.addEventListener('keydown', function (e) {
    if (
        e.code === 'Space'
        && !myTetrisCenterBoard.isEnd
        && myTetris?.y >= -1
    ) {
        myTetris.clickSpace();
        ms = 0;
    }
    if (
        e.code === 'ArrowUp'
        && !myTetrisCenterBoard.isEnd
        && myTetris?.y >= 0
    ) {
        myTetris.clickUp();
        ms = 0;
    }
    if (
        e.code === 'ArrowLeft'
        && !myTetrisCenterBoard.isEnd
        && myTetris?.y >= -1
    ) {
        myTetris.clickLeft();
    }
    if (
        e.code === 'ArrowRight'
        && !myTetrisCenterBoard.isEnd
        && myTetris?.y >= -1
    ) {
        myTetris.clickRight();
    }
    if (
        e.code === 'ArrowDown'
        && !myTetrisCenterBoard.isEnd
        && myTetris?.y >= -1
    ) {
        myTetris.clickDown();
        ms = 0;
    }
    if (
        e.code === 'ControlLeft'
        && !myTetrisCenterBoard.isEnd
        && myTetris?.y >= -1
    ) {
        storageSizeTetris();
        ms = 0;
    }
})



window.addEventListener('pointerdown', (e) => {
    let mouseX = e.clientX;
    let mouseY = e.clientY;
    //三角形上方按鈕
    if (
        myPanel.isPointInTriangle(
            myPanel.topPoint.x1, myPanel.topPoint.y1,
            myPanel.topPoint.x2, myPanel.topPoint.y2,
            myPanel.topPoint.x3, myPanel.topPoint.y3,
            mouseX, mouseY,
        )
        && !myTetrisCenterBoard.isEnd
        && myTetris?.y >= 0
    ) {
        myTetris.clickUp();
        ms = 0;
    }
    //三角形左方按鈕
    if (
        myPanel.isPointInTriangle(
            myPanel.leftPoint.x1, myPanel.leftPoint.y1,
            myPanel.leftPoint.x2, myPanel.leftPoint.y2,
            myPanel.leftPoint.x3, myPanel.leftPoint.y3,
            mouseX, mouseY,
        )
        && !myTetrisCenterBoard.isEnd
        && myTetris?.y >= -1
    ) {
        myTetris.clickLeft();
    }
    //三角形右方按鈕
    if (
        myPanel.isPointInTriangle(
            myPanel.rightPoint.x1, myPanel.rightPoint.y1,
            myPanel.rightPoint.x2, myPanel.rightPoint.y2,
            myPanel.rightPoint.x3, myPanel.rightPoint.y3,
            mouseX, mouseY,
        )
        && !myTetrisCenterBoard.isEnd
        && myTetris?.y >= -1
    ) {
        myTetris.clickRight();
    }
    //三角形下方按鈕
    if (
        myPanel.isPointInTriangle(
            myPanel.bottomPoint.x1, myPanel.bottomPoint.y1,
            myPanel.bottomPoint.x2, myPanel.bottomPoint.y2,
            myPanel.bottomPoint.x3, myPanel.bottomPoint.y3,
            mouseX, mouseY,
        )
        && !myTetrisCenterBoard.isEnd
        && myTetris?.y >= -1
    ) {
        myTetris.clickDown();
        ms = 0;
    }
    //右邊圓形 替換功能
    if (
        myPanel.isPointInCircle(mouseX, mouseY)
        && !myTetrisCenterBoard.isEnd
        && myTetris?.y >= 0
    ) {
        storageSizeTetris();
        ms = 0;
    }
});

function replaceTetris() {

    const { box, color } = myTetrisRightBoard.shift();
    return new Tetris(ctx, box, myTetrisCenterBoard, color);

}

function storageInteraction(box, color) {
    const tempMyTetrisData = myTetris.data;
    const tempMyTetrisColor = myTetris.color;

    myTetris.clear();
    if (myTetris.replaceTetris(box, color)) {
        myTetris.drawShape();
        myTetrisLeftBoard.clear();
        myTetrisLeftBoard.storageTertris(tempMyTetrisData, tempMyTetrisColor);
    } else {
        if (!myTetrisLeftBoard.isStorage) { return }
        myTetris.drawShape();
        myTetrisLeftBoard.storageTertris(box, color);
    }
    myTetrisLeftBoard.updateBoard();
}

function storageSizeTetris() {
    if (myTetrisLeftBoard.isStorage) {
        const { box, color } = myTetrisLeftBoard.shift();
        storageInteraction(box, color);
    } else {
        const newTetris = replaceTetris();
        const box = newTetris.data;
        const color = newTetris.color;
        storageInteraction(box, color);
    }
}

function updateTetrisAllBoard() {
    myTetrisCenterBoard.positionX = X;
    myTetrisCenterBoard.updateBoardBorder();
    myTetrisCenterBoard.updateBoard();
    myTetrisLeftBoard.positionX = X - storageColength * storageSize - boardBorder;
    myTetrisLeftBoard.updateBoardBorder();
    myTetrisLeftBoard.updateBoard();
    myTetrisRightBoard.positionX = X + colLength * size + boardBorder;
    myTetrisRightBoard.updateBoardBorder();
    myTetrisRightBoard.updateBoard();
    if (myTetris) {
        myTetris.drawShape();
    }
}

function updateTetris() {
    if (myTetrisCenterBoard.isGameOver()) { return }
    if (updateMs > maxUpdateMs) {
        speededUp();
    }
    if (ms >= updateMs) {
        myTetris.clickDown();
        ms = 0;
    }

    if (myTetris.isDestination && !myTetrisCenterBoard.isGameOver()) {
        myTetris = replaceTetris();
        myTetris.clickDown();
        ms = 0;
    }
    ms++;
    window.requestAnimationFrame(updateTetris);
}

function reset() {
    myRecord.hidden();
    myTetrisCenterBoard.reset();
    myTetrisLeftBoard.reset();
    myTetrisRightBoard.reset();
    myTetris = replaceTetris();
    score.textContent = 0;
    ms = 0;
    updateMs = 40;
    startTime = Date.now();
    mp3.load();
    mp3.play();
    window.requestAnimationFrame(updateTetris);
}

function speededUp() {
    const passMs = 20000;
    let delta = Date.now();
    if (startTime + passMs < delta) {
        startTime = Date.now();
        updateMs = updateMs - 5;
    }
}

againBtn.addEventListener('click', function () {
    reset();
})
startBtn.addEventListener('click', function () {
    reset();
    start.classList.add('hidden');
})

window.addEventListener('keydown', function (e) {
    if (e.code === 'Enter' && !record.lastElementChild.classList.contains('hidden')) {
        reset();
    } else if (e.code === 'Enter' && !start.classList.contains('hidden')) {
        reset();
        start.classList.add('hidden');;
    }
})
function resizeEvent(width) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    //更新方向盤是否出現與畫面響應
    if (width <= 576) {
        myPanel.update(40, window.innerHeight - 80, window.innerWidth - 40, window.innerHeight - 80);
        const newSize = 25;
        myTetrisCenterBoard.size = newSize;
        myTetrisLeftBoard.size = 10;
        myTetrisRightBoard.size = 10;
        setSize(newSize);
        setPreViewSize(10);
        setStorageSize(10);
    } else {
        //canvas重新給寬高沒有更新 其實方向盤就跑掉了
        myPanel.hide();
        const newSize = (window.innerHeight - (Y * 2) - (boardBorder * 2)) / rowLength;
        myTetrisCenterBoard.size = newSize;
        myTetrisLeftBoard.size = newSize / 2;
        myTetrisRightBoard.size = newSize / 2;
        setSize(newSize);
        setPreViewSize(newSize / 2);
        setStorageSize(newSize / 2);
    }
    updateX();
    //更新畫板 tetris 
    updateTetrisAllBoard();
}

window.addEventListener('load', function () {
    resizeEvent(window.innerWidth);
})


window.addEventListener('resize', (e) => {
    resizeEvent(e.target.innerWidth);
});