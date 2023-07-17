import { O, H, B, T, CZ, RZ, S } from './box.js';

export let rowLength = 15;
export let colLength = 11;
export let size = 27;
export function setSize(newSize) {
    size = newSize;
}

export let X = Math.ceil(window.innerWidth / 2 - (colLength * size / 2));

export function updateX() {
    X = Math.ceil(window.innerWidth / 2 - (colLength * size / 2));
}
export const Y = 50;


export let preViewSize = size / 2;
export function setPreViewSize(newSize) {
    preViewSize = newSize;
}
export let preViewColLength = 4;
export let preViewRowLength = 16;

export let storageSize = size / 2;
export function setStorageSize(newSize) {
    storageSize = newSize;
}
export let storageColength = 4;
export let storageRowLength = 6;

export const boardBorder = 2;

export const colors = ['#9AD9C4', '#FAAEC2', '#B7BAF0', '#D99ABD', '#9CD2E6', '#E8E1D1', '#FFE5A9'];
export const boxs = [O, H, B, T, CZ, RZ, S];

export const boardBgColor = '#ECF9EC';
export const tetrisBorderColor = '#573400';