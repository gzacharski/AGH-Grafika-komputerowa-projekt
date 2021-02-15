import THREEx from '/extra_libs/Keyboard.js';

export default class InputController {

    constructor(){
        this.disabled=true;
        this.keyPressed={
            forward: false,
            backward: false,
            left: false,
            right: false,
            space: false,
            shift: false,
            arrowUp: false,
            keyC: false,
            arrowLeft: false,
            arrowRight: false
        }
        this._keyboard=new THREEx.KeyboardState();

        document.addEventListener('keydown', this._onKeyDown);
        document.addEventListener('keyup', this._onKeyUp);
        document.addEventListener('click', this._onClick);
        document.addEventListener('contextmenu', this._onRightClick);
    }   

    _onKeyDown=()=>{
        if(!this.disabled){
            if(this._keyboard.pressed("left")) this.keyPressed.arrowLeft=true;
            if(this._keyboard.pressed("right")) this.keyPressed.arrowRight=true;
            if(this._keyboard.pressed("space")) this.keyPressed.space=true;
            if(this._keyboard.pressed("w+shift")) {
                this.keyPressed.shift=true;
                this.keyPressed.forward=true;
                return;
            }
            if(this._keyboard.pressed("w")) this.keyPressed.forward=true;
            if(this._keyboard.pressed("s")) this.keyPressed.backward=true;
            if(this._keyboard.pressed("a")) this.keyPressed.left=true;
            if(this._keyboard.pressed("d")) this.keyPressed.right=true;
            if(this._keyboard.pressed("up")) this.keyPressed.arrowUp=true;
            if(this._keyboard.pressed("c")) this.keyPressed.keyC=!this.keyPressed.keyC;
        }
    }

    _onKeyUp=()=>{
        if(!this.disabled){
            if(!this._keyboard.pressed("left")) this.keyPressed.arrowLeft=false;
            if(!this._keyboard.pressed("right")) this.keyPressed.arrowRight=false;
            if(!this._keyboard.pressed("w+shift")) this.keyPressed.shift=false;
            if(!this._keyboard.pressed("w")) this.keyPressed.forward=false;
            if(!this._keyboard.pressed("s")) this.keyPressed.backward=false;
            if(!this._keyboard.pressed("a")) this.keyPressed.left=false;
            if(!this._keyboard.pressed("d")) this.keyPressed.right=false;
            if(!this._keyboard.pressed("space")) this.keyPressed.space=false;
            if(!this._keyboard.pressed("up")) this.keyPressed.arrowUp=false;
        }
    }

    _onClick=()=>{
        console.log("Left click...")
    }

    _onRightClick=(event)=>{
        event.preventDefault();
        console.log("Right click...");
    }
}