'use strict'

class Game{
    constructor(parentElement, size = 4){
        this.fieldSize = 80;
        this.size = size;
        this.cellSize = ((this.fieldSize/this.size) - 2);
        
        let gameFieldElement = createAndAppend({
            className: 'game',
            parentElement
        });

		this.headerElement = createAndAppend({
			className: 'header',
			parentElement: gameFieldElement
		});

		this.ratingElement = createAndAppend({
			className: 'rating',
			parentElement: this.headerElement
		});

		this.restartElement = createAndAppend({
			className: 'restart',
			parentElement: this.headerElement,
			value: 'Начать заново'
		}, 'button');

        this.recordsElement = createAndAppend({
			className: 'records',
			parentElement: this.headerElement,
			value: 'Таблица рекордов'
		}, 'button');

        this.restartElement.addEventListener('click', this.restart.bind(this));

        this.rating = 0;

        

        this.fieldElement = createAndAppend({
            className: 'field',
            parentElement: gameFieldElement
        });

        this.fieldElement.style.width = this.fieldSize + 'vmin';
		this.fieldElement.style.height = this.fieldSize + 'vmin';

        this.restart();
 
        window.addEventListener('keyup', function(e){
            switch(e.keyCode){
                case 38:
                    this.moveUp();
                    break;
                case 40:
                    this.moveDown();
                    break;    
                case 37:
                    this.moveLeft();
                    break;
                case 39:
                    this.moveRight();
                    break;
            }  
        }.bind(this));
        onSwipe('up',    this.moveUp.bind(this));
		onSwipe('down',  this.moveDown.bind(this));
		onSwipe('left',  this.moveLeft.bind(this));
		onSwipe('right', this.moveRight.bind(this));
    }

    addRating(value){
        this.rating += value;
    }

	spawnUnit() {
		let emptyCells = [];

		for (let i = 0; i < this.field.length; i++) {
			for (let k = 0; k < this.field[i].length; k++) {
				if (!this.field[i][k].value) {
					emptyCells.push(this.field[i][k]);
				}
			}
		}

		if (emptyCells.length) {
			emptyCells[getRandomInt(0, emptyCells.length - 1)].spawn();
		} else {
			alert('You lose');
		}
	}

    set rating(value){
        this._rating = value;
        this.ratingElement.innerHTML = 'Счет: ' + this.rating;
    }
    get rating(){
        return this._rating;
    }


    


    // Обходим все ячейки в противоположном направлении от нажатия клавиши
	// По направлению первую строку или столбец пропускаем
	// Для ячейки ищем следующую заяную ячейку (или последнюю)
	//	если ячейка занята и совпадает с нашей, то объединяем
	//	если ячейка занята и не совпадет, то проверяем предыдущую ячейку

    moveRight(){
        let hasMoved = false;
        for(let i = 0; i < this.size; i++){
            for(let k = this.size - 2; k >= 0; k--){
                let currentCell = this.field[i][k];
                if(currentCell.isEmpty){
                    continue;
                }

                let nextCellKey = k + 1;
                while(nextCellKey < this.size){
                    let nextCell = this.field[i][nextCellKey];
                    if(!nextCell.isEmpty || this.isLastKey(nextCellKey)){
                        if((nextCell.isEmpty && this.isLastKey(nextCellKey))
                        || nextCell.isSameTo(currentCell)
                        ){
                            this.field[i][nextCellKey].merge(currentCell);
                            hasMoved = true;
                        }else if(!nextCell.isEmpty && nextCellKey - 1 != k){
                            this.field[i][nextCellKey - 1].merge(currentCell);
                            hasMoved = true;
                        }
                        break;
                    }
                    nextCellKey++;
                    nextCell = this.field[i][nextCellKey];

                }
            }
        }
        if(hasMoved){
            this.spawnUnit();
        }
    }
    isLastKey(key){
        return key == (this.size - 1);
    }

    isFrirstKey(key){
        return key == 0;
    }

    moveLeft(){
        let hasMoved = false;
        for(let i = 0; i < this.size; i++){
            for(let k = 1; k < this.size; k++){
                let currentCell = this.field[i][k];
                if(currentCell.isEmpty){
                    continue;
                }

                let nextCellKey = k - 1;
                while(nextCellKey >= 0){
                    let nextCell = this.field[i][nextCellKey];
                    if(!nextCell.isEmpty || this.isFrirstKey(nextCellKey)){
                        if((nextCell.isEmpty && this.isFrirstKey(nextCellKey))
                        || nextCell.isSameTo(currentCell)
                        ){
                            this.field[i][nextCellKey].merge(currentCell);
                            hasMoved = true;
                        }else if(!nextCell.isEmpty && nextCellKey + 1 != k){
                            this.field[i][nextCellKey + 1].merge(currentCell);
                            hasMoved = true;
                        }
                        break;
                    }
                    nextCellKey--;
                    nextCell = this.field[i][nextCellKey];

                }
            }
        }
        if(hasMoved){
            this.spawnUnit();
        }
    }
    moveDown(){
        let hasMoved = false;
        for(let k = 0; k < this.size; k++){
            for(let i = this.size - 2; i >= 0; i--){
                let currentCell = this.field[i][k];
                if(currentCell.isEmpty){
                    continue;
                }

                let nextCellKey = i + 1;
                while(nextCellKey < this.size){
                    let nextCell = this.field[nextCellKey][k];
                    if(!nextCell.isEmpty || this.isLastKey(nextCellKey)){
                        if((nextCell.isEmpty && this.isLastKey(nextCellKey))
                        || nextCell.isSameTo(currentCell)
                        ){
                            this.field[nextCellKey][k].merge(currentCell);
                            hasMoved = true;
                        }else if(!nextCell.isEmpty && nextCellKey - 1 != i){
                            this.field[nextCellKey - 1][k].merge(currentCell);
                            hasMoved = true;
                        }
                        break;
                    }
                    nextCellKey++;
                    nextCell = this.field[nextCellKey][k];

                }
            }
        }
        if(hasMoved){
            this.spawnUnit();
        }
    }

    moveUp(){
        let hasMoved = false;
        for(let k = 0; k < this.size; k++){
            for(let i = 1; i < this.size; i++){
                let currentCell = this.field[i][k];
                if(currentCell.isEmpty){
                    continue;
                }

                let nextCellKey = i - 1;
                while(nextCellKey < this.size){
                    let nextCell = this.field[nextCellKey][k];
                    if(!nextCell.isEmpty || this.isFrirstKey(nextCellKey)){
                        if((nextCell.isEmpty && this.isFrirstKey(nextCellKey))
                        || nextCell.isSameTo(currentCell)
                        ){
                            this.field[nextCellKey][k].merge(currentCell);
                            hasMoved = true;
                        }else if(!nextCell.isEmpty && nextCellKey + 1 != i){
                            this.field[nextCellKey + 1][k].merge(currentCell);
                            hasMoved = true;
                        }
                        break;
                    }
                    nextCellKey--;
                    nextCell = this.field[nextCellKey][k];

                }
            }
        }
        if(hasMoved){
            this.spawnUnit();
        }
    }
    
    restart() {
		this.fieldElement.innerHTML = '';
		this.field = [];
        this.rating = 0;
        

		for (let i = 0; i < this.size; i++) {
			this.field[i] = [];
			for (let k = 0; k < this.size; k++) {
				this.field[i][k] = new Cell(this.fieldElement, this);
			}
		}
	}
}
