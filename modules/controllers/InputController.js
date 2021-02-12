import THREEx from '/extra_libs/Keyboard.js';

export default class InputController {

    constructor(){
        this.keyPressed={
            forward: false,
            backward: false,
            left: false,
            right: false,
            space: false,
            shift: false,
            leftClick: false,
            rightClick: false
        }
        this._keyboard=new THREEx.KeyboardState();

        document.addEventListener('keydown', this._onKeyDown);
        document.addEventListener('keyup', this._onKeyUp);
        document.addEventListener('click', this._onClick);
        document.addEventListener('contextmenu', this._onRightClick);
    }   

    _onKeyDown=()=>{
        if(this._keyboard.pressed("w+shift")) {
            this.keyPressed.shift=true;
            this.keyPressed.forward=true;
            return;
        }
        if(this._keyboard.pressed("w")) this.keyPressed.forward=true;
        if(this._keyboard.pressed("s")) this.keyPressed.backward=true;
        if(this._keyboard.pressed("a")) this.keyPressed.left=true;
        if(this._keyboard.pressed("d")) this.keyPressed.right=true;
        if(this._keyboard.pressed("space")) this.keyPressed.space=true;
    }

    _onKeyUp=()=>{
        if(!this._keyboard.pressed("w+shift")) this.keyPressed.shift=false;
        if(!this._keyboard.pressed("w")) this.keyPressed.forward=false;
        if(!this._keyboard.pressed("s")) this.keyPressed.backward=false;
        if(!this._keyboard.pressed("a")) this.keyPressed.left=false;
        if(!this._keyboard.pressed("d")) this.keyPressed.right=false;
        if(!this._keyboard.pressed("space")) this.keyPressed.space=false;
    }

    _onClick=()=>{
        this._keyboard.leftClick=true;
    }

    _onRightClick=()=>{
        this._keyboard.rightClick=true;
    }
}