export default class Test {
    constructor(name){
        this.name=name;
        console.log(`constructing....${name}`);
    }
    
    getName(){
        dosth();
        return this.name;
    }
}

function dosth(){
    console.log(`do sth ${name}`);
}