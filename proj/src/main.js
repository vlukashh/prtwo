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
        //удаление из третьего столбца
        deleteGroup(groupId) {
            const index = this.thirdColumn.findIndex(group => group.id === groupId);
            if (index !== -1) {
                this.thirdColumn.splice(index, 1);
            }
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
        //перемещает карточку из первого столбца, если выполнины условия для перехода
        MoveFirstColm() {
            this.firstColumn.forEach(card => {
                const progress = (card.items.filter(item => item.checked).length / card.items.length) * 100;

                const isMaxSecondColumn = this.secondColumn.length >= 5;

                if (progress >= 50 && !isMaxSecondColumn) {
                    this.secondColumn.push(card);
                    this.firstColumn.splice(this.firstColumn.indexOf(card), 1);
                    this.MoveSecondColm();
                }
            });

        },
        //перемещает карточку из второго столбца, если выполнины условия для перехода
        MoveSecondColm() {
            this.secondColumn.forEach(card => {
                const progress = (card.items.filter(item => item.checked).length / card.items.length) * 100;
                if (progress === 100) {
                    card.isComplete = true;
                    card.lastChecked = new Date().toLocaleString();
                    this.thirdColumn.push(card);
                    this.secondColumn.splice(this.secondColumn.indexOf(card), 1);
                    this.MoveFirstColm();
                }
            })
        },
        //проверка нужно ли перемещать карточку между столбцами
        checkMoveCard() {
            this.MoveFirstColm();
            this.MoveSecondColm();
        },
        //добавление карточки в первый столбец
        addCard() {
            // Проверяем, заполнен ли второй столбец
            if (this.secondColumn.length >= 5) {
                alert('Второй столбец заполнен максимальным количеством карточек. Нельзя создавать новые карточки в первый столбец.');
                return;
            }

            // Проверяем, разрешено ли добавление новых карточек в первый столбец
            if (!this.isFirstColumnLocked && this.firstColumn.length < 3) {
                this.firstColumn.push({
                    id: Date.now(),
                    groupName: this.groupName,
                    items: [
                        {text: this.inputOne, checked: false},
                        {text: this.inputTwo, checked: false},
                        {text: this.inputThr, checked: false},
                    ]
                });

                this.groupName = null;
                this.inputOne = null;
                this.inputTwo = null;
                this.inputThr = null;

                this.MoveFirstColm(); // Проверяем, нужно ли перемещать карточку из первого столбца
            } else {
                alert('Первый столбец заполнен максимальным количеством карточек .');
            }
        }
    },
        mounted() {
        // this.checkBlockColumn();
    }
})