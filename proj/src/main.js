//сохранение данных
const storageKey = '-new';
const storageData = localStorage.getItem(storageKey);

const initialData = storageData ? JSON.parse(storageData) : {
    firstColumn: [],
    secondColumn: [],
    thirdColumn: [],
    column2_disable : storageData.column2_disable,
    column1_lock : storageData.column1_lock
};

let app = new Vue({
    el: '#new',
    data: {
        firstColumn: initialData.firstColumn,
        secondColumn: initialData.secondColumn,
        thirdColumn: initialData.thirdColumn,
        checkColumn1: false,
        checkColumn2: false,
        column1_lock: false,
        column2_disable: false,
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
                thirdColumn: this.thirdColumn,
                column2_disable:this.column2_disable,
                column1_lock:this.column1_lock
            };
            localStorage.setItem(storageKey, JSON.stringify(data));
        },
        checkSizeColumn2(){
            if(this.secondColumn.length === 5){
                this.checkColumn2 = true;
            }
            else{
                this.checkColumn2 = false;
            }
        },
        //удаление из третьего столбца
        deleteGroup(groupId) {
            const index = this.thirdColumn.findIndex(group => group.id === groupId);
            if (index !== -1) {
                this.thirdColumn.splice(index, 1);
            }
        },
        //обнолвение прогресса карточки
        updateCard(card){
            if (this.column1_lock) {
                return;
            }

            this.column2_disable = false

            const completed_tasks = card.items.filter(item => item.checked).length;
            const progress = (completed_tasks / card.items.length) * 100;
            const index_column1 = this.firstColumn.indexOf(card)
            const index_column2 = this.secondColumn.indexOf(card)
            if(progress === 100){
                if (index_column2 !== -1) {
                    this.secondColumn.splice(index_column2, 1);
                    this.thirdColumn.push(card);
                    card.lastComplete = new Date().toLocaleString();
                }
                else {
                    card.lastComplete = null;
                }
            }
            else if(progress >= 50){
                if(this.secondColumn.length < 5) {
                    if (index_column1 !== -1) {
                        this.firstColumn.splice(index_column1, 1);
                        this.secondColumn.push(card);
                    }
                }else {
                    this.column2_disable = true;
                }
            }

            if (this.column1_lock && this.secondColumn.length === 5 && progress >= 50) {
                this.column2_disable = true;
            }

        },
        //добавление карточки в первый столбец
        addCard() {


            // Проверяем, разрешено ли добавление новых карточек в первый столбец
            if (!this.column1_lock && this.firstColumn.length < 3) {
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

            } else {
                return;
            }
            if (this.secondColumn.length < 5) {
                this.column1_lock = false;
            }
        }
    },
        mounted() {
        // this.checkBlockColumn();
    }
})