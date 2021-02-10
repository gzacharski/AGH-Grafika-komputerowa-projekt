
export const walkForward = (ninja, diffvector)=>{

    //switchAction(idleAction,walkAction);
    ninja.position.x+=diffvector.x;
    ninja.position.z+=diffvector.z;
}

export const walkBackwards= (ninja, camera,diffvector)=>{
    camera.position.x-=diffvector.x;
    camera.position.z-=diffvector.z;

    ninja.position.x-=diffvector.x;
    ninja.position.z-=diffvector.z;

    //switchAction(idleAction,walkBackwardAction);
}

export const walkRight=(ninja, camera,diffvector)=>{
    camera.position.x-=diffvector.z;
    camera.position.z+=diffvector.x;

    ninja.position.x-=diffvector.z;
    ninja.position.z+=diffvector.x;

    // switchAction(idleAction,turnRightAction);
}

export const walkLeft = (ninja, camera,diffvector)=>{

    camera.position.x+=diffvector.z;
    camera.position.z-=diffvector.x;

    ninja.position.x+=diffvector.z;
    ninja.position.z-=diffvector.x;

    // switchAction(idleAction,turnLeftAction);
}

export const turnRight = (ninja, camera,diffvector)=>{

}

export const turnLeft = (ninja, camera,diffvector)=>{

}

export const jump= (ninja, camera,diffvector)=>{

}

export const run= (ninja, camera,diffvector)=>{

}