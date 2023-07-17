


export class Record {
    constructor(recordElement, recordListElement) {
        this.record = recordElement;
        this.recordListElement = recordListElement;
        this.recordBoard = document.querySelector('.record');
        this.recordItems = JSON.parse(window.localStorage.getItem('recordItems')) || [];
        this.maxLength = 5;
    }
    show() {
        this.recordBoard.classList.remove('close');
        const recordInput = document.querySelector('.record-name input');
        if (recordInput) {
            recordInput.focus();
        }
    }
    hidden() {
        this.recordBoard.classList.add('close');
        this.hiddenFooter();
    }
    addRecordItem({ sort, name, score }) {
        const li = document.createElement('li');
        const sortElement = document.createElement('div');
        const nameElement = document.createElement('div');
        const scoreElement = document.createElement('div');
        sortElement.textContent = sort + '.';
        nameElement.textContent = name;
        scoreElement.textContent = score;
        sortElement.className = 'record-sort';
        nameElement.className = 'record-name';
        scoreElement.className = 'record-score';
        li.className = 'record-item';
        //沒有名字輸入名字
        if (name) {
            const span = document.createElement('span');
            nameElement.append(span);
        } else {
            const input = document.createElement('input');
            nameElement.append(input);
            const vm = this;
            //按下enter更新輸入的名稱 把input換成span
            input.onkeydown = function (e) {
                if (e.code === 'Enter') {
                    e.stopPropagation();
                    const newName = input.value || 'anonymous';
                    const span = document.createElement('span');
                    span.textContent = newName;
                    input.remove();
                    nameElement.append(span);
                    console.log(vm.recordItems)
                    vm.recordItems[sort - 1].name = newName;
                    vm.save(vm.recordItems);
                    vm.showFooter();
                }
            }
        }

        li.append(sortElement);
        li.append(nameElement);
        li.append(scoreElement);
        this.recordListElement.append(li);
    }
    update(score) {
        this.reset();
        const arr = [...this.recordItems];
        arr.push({ sort: arr.length - 1, name: undefined, score });
        arr.sort((a, b) => b.score - a.score);
        while (arr.length > this.maxLength) {
            arr.pop();
        }
        for (let i = 0; i < arr.length; i++) {
            //更新sort
            arr[i].sort = i + 1;
            this.addRecordItem(arr[i]);
        }
        const isNotUpdateName = arr.find((item) => item.name === undefined);
        //沒有更新紀錄就顯示重新
        if (!isNotUpdateName) {
            this.showFooter();
        }
        this.recordItems = arr;
    }
    save(arr) {
        window.localStorage.setItem('recordItems', JSON.stringify(arr));
    }
    reset() {
        this.recordListElement.innerHTML = '';
        this.recordItems = JSON.parse(window.localStorage.getItem('recordItems')) || [];
    }
    showFooter() {
        this.record.lastElementChild.classList.remove('hidden');
    }
    hiddenFooter() {
        this.record.lastElementChild.classList.add('hidden');
    }
}