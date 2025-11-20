const {readFile, writeFile} = require('node:fs/promises');

export class DB{

    static async getClue(level){
        const data = JSON.parse(await readFile('./db.json', 'utf-8'));
        return data[`clues`][level-1];
    }

    static async getClues(){
        const data = JSON.parse(await readFile('./db.json', 'utf-8'));
        return data[`clues`];
    }

    static async addClue(level){

        const data = JSON.parse(await readFile('./db.json', 'utf-8'));

        data['found'][level-1] = 1;

        await writeFile('./db.json', JSON.stringify(data, null, 2), 'utf-8');
    }

    static async checkFound(level){
        const data = JSON.parse(await readFile('./db.json', 'utf-8'));
        return data['found'][level-1] == 1;
    }

    static async checkFound(){
        const data = JSON.parse(await readFile('./db.json', 'utf-8'));

        for(let i = 0; i < 15; i++){
            if(data['found'][i] != 1){
                return i
            }
        }

        return 14;
    }

    static async reset(){
        const data = JSON.parse(await readFile('./db.json', 'utf-8'));

        data['found'] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

        await writeFile('./db.json', JSON.stringify(data, null, 2), 'utf-8');
    }

    static async checkSolution(sequence){
        const data = JSON.parse(await readFile('./db.json', 'utf-8'));

        for(let i = 0; i < 15; i++){
            if(sequence[i] != data['found'][i]){
                return false;
            }
        }
        return true;
    }

}