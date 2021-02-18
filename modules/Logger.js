export default function log(message){
    const logs=document.getElementById('logs');
    if(logs.children.length>3){
        const fChild=logs.firstChild;
        fChild.remove();
    }

    const node=document.createElement('h4');
    const textNode=document.createTextNode(message);
    node.appendChild(textNode);
    logs.appendChild(node);
    
    console.log(message);
}