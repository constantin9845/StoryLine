const {readFile} = require('node:fs/promises')

export class riddle{

    constructor(level_assets){
        this.level_assets = level_assets;

        // Types of riddles:
        // 0 = MCQ
        // 1 = Enter word
        // 2 = Spinning wheel
        this.type = level_assets['riddle_type'];
        this.MCQ_state = null;
        this.Sequence_state = [2,2,2];
        this.Sequence_col = 0;
        this.Sequence_content = [5][3];
    }


    create_riddle(){
        let riddleWindow = document.createElement('div');
        riddleWindow.id = 'riddle_function_window';
        let riddleText = document.createElement('p');
        riddleText.innerText = this.level_assets['riddle'];
        
        let riddle;

        switch(this.type){
            case 0:
                riddle = this.create_MQC();
                this.MCQ_state = 2;
                break;
            case 1:
                riddle = this.create_Enter();
                break;
            case 2:
                riddle = this.create_Wheel();
                break;
        }

        riddleWindow.appendChild(riddleText);
        riddleWindow.appendChild(riddle);

        return riddleWindow;
    }

    create_MQC(){
        const MQC_window = document.createElement('div');
        MQC_window.id = 'MCQ_window';
        let correct = Math.floor(Math.random()*5);
        let answers = []

        console.log(correct)

        for(let i = 0, j = 0; i < 5; i++, j++){
            const stub = document.createElement('p');
            stub.classList.add(`stub${i}`);

            if(i == correct){
                answers.push(this.level_assets['answer'])
                stub.id = 'correct_MCQ';
                j--;
            }
            else{
                answers.push(this.level_assets['answer_stubs'][j]);
            }

            if(i == 2){
                stub.style.backgroundColor = '#c7c7c7';
                stub.classList.add('selected')
            }
            
            stub.innerText = answers[i];
            MQC_window.appendChild(stub);
        }

        return MQC_window;
    }

    update_MCQ(key){

        document.querySelector(`.stub${this.MCQ_state}`).style.backgroundColor = 'white';
        document.querySelector(`.stub${this.MCQ_state}`).classList.remove('selected');

        switch(key){
            case 'a':
                this.MCQ_state = (this.MCQ_state-1);
                this.MCQ_state = (this.MCQ_state == -1) ? 4 : this.MCQ_state;
                break;

            case 'd':
                this.MCQ_state = (this.MCQ_state+1)%5;
                break;
        }

        document.querySelector(`.stub${this.MCQ_state}`).style.backgroundColor = '#c7c7c7';
        document.querySelector(`.stub${this.MCQ_state}`).classList.add('selected');
    }

    create_Enter(){ 
        const MQC_window = document.createElement('div');
        MQC_window.id = 'enter_window'
        const inputSpace = document.createElement('p');
        inputSpace.id = 'inputSpace_riddle';

        MQC_window.appendChild(inputSpace);

        return MQC_window;
    }

    update_Enter(key){

        let text = document.getElementById('inputSpace_riddle');

        
        if(key == 'Backspace'){
            text.innerText = text.innerText.substring(0,(text.innerHTML).length-1);
        }
        else if(key == ' '){
            text.innerHTML += " ";
        }
        else{
            text.innerHTML += key;
        }
    }

    empty_Enter(){
        document.getElementById('inputSpace_riddle').innerHTML = "";
    }

    create_Wheel(){
        this.Sequence_content = this.level_assets['sequences']
        const MQC_window = document.createElement('div');
        MQC_window.id = 'sequence'

        const band1 = document.createElement('p');
        const band2 = document.createElement('p');
        const band3 = document.createElement('p');

        band1.id = 'band0';
        band2.id = 'band1';
        band3.id = 'band2';

        band1.innerText = this.Sequence_content[2][0];
        band2.innerText = this.Sequence_content[2][1];
        band3.innerText = this.Sequence_content[2][2];

        MQC_window.append(band1, band2, band3);

        return MQC_window;
    }

    update_Wheel(key){

        switch(key){
            case 'a':
                document.getElementById(`band${this.Sequence_col}`).style.backgroundColor = 'white';
                this.Sequence_col--;
                this.Sequence_col = (this.Sequence_col == -1) ? 2 : this.Sequence_col;

                document.getElementById(`band${this.Sequence_col}`).style.backgroundColor = '#c7c7c7';
                break;

            case 'd':
                document.getElementById(`band${this.Sequence_col}`).style.backgroundColor = 'white';
                this.Sequence_col = (this.Sequence_col+1)%3;

                document.getElementById(`band${this.Sequence_col}`).style.backgroundColor = '#c7c7c7';
                break;

            case 's':
                this.Sequence_state[this.Sequence_col] = (this.Sequence_state[this.Sequence_col]+1)%5;
                document.getElementById(`band${this.Sequence_col}`).innerText = this.Sequence_content[this.Sequence_state[this.Sequence_col]][this.Sequence_col];
                break;

            case 'w':
                this.Sequence_state[this.Sequence_col]--;
                this.Sequence_state[this.Sequence_col] = (this.Sequence_state[this.Sequence_col] == -1) ? 4 : this.Sequence_state[this.Sequence_col];
                document.getElementById(`band${this.Sequence_col}`).innerText = this.Sequence_content[this.Sequence_state[this.Sequence_col]][this.Sequence_col];
                break;
        }

        console.log(this.Sequence_content[this.Sequence_state[0]][0]+this.Sequence_content[this.Sequence_state[1]][1]+this.Sequence_content[this.Sequence_state[2]][2])
    }

    check_input(){

        switch(this.type){
            case 0:
                return (document.querySelector('.selected').innerHTML === this.level_assets['answer']);
            
            case 1:
                return (document.getElementById('inputSpace_riddle').innerText === this.level_assets['answer'])
            
            case 2:
                let current_sequence = this.Sequence_content[this.Sequence_state[0]][0]+this.Sequence_content[this.Sequence_state[1]][1]+this.Sequence_content[this.Sequence_state[2]][2];
                current_sequence = current_sequence.replace(/_/g,'');

                console.log(current_sequence)
                return current_sequence === this.level_assets['answer'];
        }
    }
}