const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const building = {
    // the first key should be 宿舍 for route to init    
    宿舍: [0,0,100,100],
    天天餐厅: [100,0,100,100],
    金工楼: [500,0,100,100],
    北操场: [400,100,100,100], 
    信息楼: [0,200,100,100],
    三教: [200,200,100,100],
    南操场: [300,200,200,200],
    四教: [600,200,100,100],
    美食园: [200,300,100,100],
    人文楼: [200,400,100,100],
}    
const width = canvas.width;
const height = canvas.height;
const map_bg = new Image();
map_bg.src = "./map_bg.png";
let route = [Object.keys(building)[0]];
let dist = {};

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
    for (let i = 0; i < route.length; i++){
        // route[i] -> route[i+1]
        let first = building[route[i]];
        let second;
        if (i == route.length-1){
            second = building[route[0]]; // exceed route length, last building->dormitory
        }else{
            second = building[route[i+1]];
        }
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
            //console.log(tmp_build);
            if (route.includes(tmp_build)){
                route.splice(route.findIndex(i => i === tmp_build), 1)
            } else {
                route.push(tmp_build);
            }
            cal();
            clear();
            draw();
        }else{
            console.log("not building");
        }
    });
    init_dist();
}    

function cal_dist(x1, y1, x2, y2){
    let x = x2 - x1;
    let y = y2 - y1;
    return Math.sqrt(x * x + y * y);
}

function init_dist(){
    // {key: {k: d, k:d, k:d...}, key:...}
    for (const [key, value] of Object.entries(building)){
        let tmp = {};
        for (const [k, v] of Object.entries(building)){
            tmp[k] = cal_dist(value[0], value[1], v[0], v[1]);
        }
        dist[key] = tmp;
    }

    console.log(dist);
}


// change `route' in place, route[0]->route[1]->route[2]->...->route[n-1]
function cal(){
    cal_naive();
    //cal_salesman();
}

function cal_naive(){
    let ret = 1000000000;
    let mem;
    for (const tmp of perms(route)){
        let time = 0;
        for (let i = 0; i < tmp.length; i++){
            if (i != tmp.length-1){
                time += dist[tmp[i]][tmp[i+1]];
                if (time > ret){
                    continue;
                }
            }else{
                time += dist[tmp[i]][tmp[0]];
            }
        }
        if (time < ret){
            ret = time;
            mem = tmp;
        }
    }
    route = mem;
}

function perms(xs) {
    if (!xs.length) return [[]];
    return xs.flatMap(x => {
        // get permutations of xs without x, then prepend x to each
        return perms(xs.filter(v => v!==x)).map(vs => [x, ...vs]);
    });
}

function cal_salesman(){
    let len = route.length;
    
    // init memo
    let memo = {};
    // for (const k of route){
    //     memo[k] = new Array(Math.pow(2, len)).fill(-1);
    // }
    //console.log(memo);
    
    let ret = Math.pow(2, 20);
}

function algo_salesman(tgt, rest){
}

function isBuilding(e){
    let x = e.clientX;
    let y = e.clientY;
    for (const [key, value] of Object.entries(building)){
        //console.log(key + ":" + value);
        if (x > value[0] && x < value[0] + value[2] &&
            y > value[1] && y < value[1] + value[3]){
            return key;
        }
    }
    return false;
}



init();

