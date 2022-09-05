const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const building = {
    dormitory: [0,0,100,100],
    building3: [100,200,100,100],
    building4: [400,400,100,100],
    building5: [200,0,100,100],
}    
const width = canvas.width;
const height = canvas.height;
const map_bg = new Image();
map_bg.src = "./map_bg.png";
let route = ['dormitory'];

init();

function clear(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);    
    //ctx.drawImage(map_bg, 0, 0);
}

function draw_building(){
    for (const [key,value] of Object.entries(building)){
        ctx.strokeRect(value[0], value[1], value[2], value[3]);
        
        ctx.font = '24px Times New Roman';
        ctx.fillText(key, value[0], value[1]+ value[3]/2);    
    }
}

function draw_route(){
    for (let i = 0; i < route.length - 1; i++){
        // route[i] -> route[i+1]
        let first = building[route[i]];
        let second = building[route[i+1]];
        let start = [first[0] + first[2]/2, first[1] + first[3]/2];
        let end = [second[0] + second[2]/2, second[1] + second[3]/2];
        ctx.beginPath();
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(end[0], end[1]);
        ctx.stroke();
    }
}
function draw(){
    draw_building();
    draw_route();
}
function init(){
    clear();
    draw();
    canvas.addEventListener('click', (e) => {
        let tmp_build = isBuilding(e);
        if(tmp_build != false){
            console.log(tmp_build);
            if (route.includes(tmp_build)){
                route.splice(route.findIndex(i => i === tmp_build), 1)
            } else {
                route.push(tmp_build);
            }
            //alert(route);
            calculate();
            clear();
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



