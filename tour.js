const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const building = {
    dormitory: [0,0,100,100],
    building3: [100,200,100,100],
}    
const width = canvas.width;
const height = canvas.height;
const map_bg = new Image();
map_bg.src = "./map_bg.png";
let route = ['dormitory'];

init();

function clear(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);    
    ctx.drawImage(map_bg, 0, 0);
}

function draw(){
    for (const [key,value] of Object.entries(building)){
        ctx.strokeRect(value[0], value[1], value[2], value[3]);
        
        ctx.font = '24px Times New Roman';
        ctx.fillText(key, value[0], value[1]+ value[3]/2);    
    }
}

function init(){
    clear();
    draw();
    canvas.addEventListener('click', (e) => {
        let tmp_build = isBuilding(e);
        if(tmp_build != false){
            alert(tmp_build);
            calculate();
            draw();
        }else{
            // alert("not building");
        }
    });
}    

function calculate(){
    // dijkstra
}

function isBuilding(e){
    let x = e.clientX;
    let y = e.clientY;
    for (const [key, value] of Object.entries(building)){
        console.log(key + ":" + value);
        if (x > value[0] && x < value[0] + value[2] &&
            y > value[1] && y < value[1] + value[3]){
            return key;
        }
    }
    return false;
}



