//сохранение данных
const storageKey = '-new';
const storageData = localStorage.getItem(storageKey);

const initialData = storageData ? JSON.parse(storageData) : {
    firstColumn: [],
    secondColumn: [],
    thirdColumn: []
};

let app = new Vue({
    el: '#new',
    data: {
        firstColumn: initialData.firstColumn,
        secondColumn: initialData.secondColumn,
        thirdColumn: initialData.thirdColumn,
        groupName: null,
        inputOne: null,
        inputTwo: null,
        inputThr: null,
    },
    watch: {
        firstColumn: {
            handler(newFirstColumn) {
                this.saveData();
            },
            deep: true
        },
        secondColumn: {
            handler(newSecondColumn) {
                this.saveData();
            },
            deep: true
        },
        thirdColumn: {
            handler(newThirdColumn) {
                this.saveData();
            },
            deep: true
        }
    },
    methods: {
        //сохранение данных
        saveData() {
            const data = {
                firstColumn: this.firstColumn,
                secondColumn: this.secondColumn,
                thirdColumn: this.thirdColumn
            };
            localStorage.setItem(storageKey, JSON.stringify(data));
        },
        //обнолвение прогресса карточки
        updateProgress(card) {
            const checkedCount = card.items.filter(item => item.checked).length;
            const progress = (checkedCount / card.items.length) * 100;
            card.isComplete = progress === 100;
            if (card.isComplete) {
                card.lastChecked = new Date().toLocaleString();
            }
            this.checkMoveCard();
        },

        //проверка нужно ли перемещать карточку между столбцами
        checkMoveCard() {
            this.MoveFirstColm();
            this.MoveSecondColm();
        },
        //добавление карточки в первый столбец
        addCard() {
            const newGroup = {
                id: Date.now(),
                groupName: this.groupName,
                items: [
                    { text: this.inputOne, checked: false },
                    { text: this.inputTwo, checked: false },
                    { text: this.inputThr, checked: false },
                ]
            }
            if (this.firstColumn.length < 3) {
                this.firstColumn.push(newGroup)
            }
            this.groupName = null,
                this.inputOne = null,
                this.inputTwo = null,
                this.inputThr = null
        }
    },
    mounted() {
        // this.checkBlockColumn();
    }
})