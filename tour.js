const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const tt = document.getElementById('tt');
const select = document.getElementById('algo');
const clr = document.getElementById('clear');
const algo_inform = document.getElementById('algo_inform');

const building = {
    宿舍: [225,45,97,69],
    天天餐厅: [330,45,60,69],
    金工楼: [505,45,70,70],
    北操场: [480,165,90,140], 
    信息楼: [215,360,80,90],
    三教: [370,310,120,70],
    南操场: [495,310,120,200],
    四教: [620,340,170,150],
    美食园: [370,465,120,50],
    人文楼: [380,607,110,53],
}    
const width = canvas.width;
const height = canvas.height;
const map_bg = new Image();
map_bg.src = "./pic/bjutmap.png";
let route = [];
let dist = {};
// naive, salesman, mst, none
let algorithm = select.value;

function init(){
    clear();
    map_bg.onload = () => {
        draw();
    }
    update();
    init_dist();
    
    canvas.addEventListener('click', (e) => {
        let tmp_build = isBuilding(e);
        if(tmp_build != false){
            //console.log(tmp_build);
            if (route.includes(tmp_build)){
                route.splice(route.findIndex(i => i === tmp_build), 1)
            } else {
                route.push(tmp_build);
            }
            if (route.length != 0){
                algo();
            }
            update();
            clear();
            draw();
        }else{
            console.log("not building");
        }
    });

    select.addEventListener('change', () => {
        algorithm = select.value;
        if (route.length != 0){
            algo();
        }
        update();
        clear();
        draw();
    });
    
    clr.addEventListener('click', () => {
        route = [];
        update();
        clear();
        draw();
    });
}    

function update(){
    // 三教到宿舍到距离需要5分钟
    // 50pixel <-> 1 min
    let dis = 0;
    for (let i = 0; i < route.length; i++){
        if (i != route.length-1){
            dis += dist[route[i]][route[i+1]];
        }else{
            dis += dist[route[i]][route[0]];
        }
    }
    let time = Math.round(dis/56.6);
    tt.innerHTML = time;
    
    // algo_inform
    switch(algorithm){
    case 'naive':
        algo_inform.innerHTML = '全排列后找出最小, O((k-1)!)';
        break;
    case 'salesman':
        algo_inform.innerHTML = '动态规划';
        break;
    case 'mst':
        algo_inform.innerHTML = '近似算法, prim后前序';
        break;
    case 'none':
        algo_inform.innerHTML = '无处理';
        break;
    default:
        alert("illegal input algorithm");
        break;
    }
    
}

function clear(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);    
    //ctx.drawImage(map_bg, 0, 0);
}

function draw(){
    ctx.drawImage(map_bg, 0, 0);
    draw_building();
    draw_route();
}

function draw_building(){
    for (const [key,value] of Object.entries(building)){
        ctx.save();
        ctx.fillStyle = 'rgba(25, 25, 25, 0.3)'
        ctx.fillRect(value[0], value[1], value[2], value[3]);
        ctx.restore();

        ctx.save();
        ctx.font = '24px bold Times New Roman';
        ctx.textAlign = 'center';
        ctx.fillText(key, value[0] + value[2]/2, value[1]+ value[3]/2);    
        ctx.restore();
    }
}

function draw_route(){
    for (let i = 0; i < route.length; i++){
        // route[i] -> route[i+1]
        let first = building[route[i]];
        let second;
        if (i == route.length-1){
            second = building[route[0]]; // exceed route length, last build->first build
        }else{
            second = building[route[i+1]];
        }
        let start = [first[0] + first[2]/2, first[1] + first[3]/2];
        let end = [second[0] + second[2]/2, second[1] + second[3]/2];
        
        let arrow_len = 30; // length of head in pixels
        var dx = end[0] - start[0];
        var dy = end[1] - start[1];
        var angle = Math.atan2(dy, dx);
        ctx.save();
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(end[0], end[1]);
        ctx.lineTo(end[0] - arrow_len * Math.cos(angle - Math.PI / 6), end[1] - arrow_len * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(end[0], end[1]);
        ctx.lineTo(end[0] - arrow_len * Math.cos(angle + Math.PI / 6), end[1] - arrow_len * Math.sin(angle + Math.PI / 6));        
        ctx.stroke();
        ctx.restore();
    }
}

function distance(x1, y1, x2, y2){
    let x = x2 - x1;
    let y = y2 - y1;
    return Math.sqrt(x * x + y * y);
}

function init_dist(){
    // {key: {k: d, k:d, k:d...}, key:...}
    for (const [key, value] of Object.entries(building)){
        let tmp = {};
        for (const [k, v] of Object.entries(building)){
            tmp[k] = distance(value[0], value[1], v[0], v[1]);
        }
        dist[key] = tmp;
    }

    console.log(dist);
}


// change `route' in place, route[0]->route[1]->route[2]->...->route[n-1]
// although called algorithm, its not pure function, but just calculation
// with side effects
function algo(){
    switch(algorithm){
    case 'naive':
        algo_naive();
        break;
    case 'salesman':
        algo_salesman();
        break;
    case 'mst':
        algo_mst();
        break;
    case 'none':
        break;
    default:
        algo_naive();
        break;
    }
}

function algo_naive(){
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

function algo_mst(){
    const tree = new Tree(route[0]);
    let rest = route.slice();
    rest.splice(0, 1);
    for (let i = 0; i < route.length - 1; i++){
        let from;
        let to;
        let min = Number.MAX_VALUE;
        for (const node of tree.preOrder()){
            for (const r of rest){
                if (dist[node.key][r] < min){
                    from = node.key;
                    to = r;
                    min = dist[node.key][r];
                }
            }
        }
        tree.insert(from, to);
        rest.splice(rest.findIndex(i => i === to), 1)
    }
    
    route = [...tree.preOrder()].map(x => x.key);
}

class TreeNode {
    constructor(key, parent = null) {
        this.key = key;
        this.parent = parent;
        this.children = [];
    }
}

class Tree{
    constructor(key){
        this.root = new TreeNode(key);
    }
    
    insert(parent, key){
        for (const node of this.preOrder()){
            if (node.key === parent){
                node.children.push(new TreeNode(key, node));
                return true;
            }
        }
        alert("should not return false");
    }
    
    *preOrder(node = this.root){
        yield node;
        if (node.children.length){
            for (const child of node.children){
                yield* this.preOrder(child);
            }
        }
    }
    
}
    
// init memo
let memo = {};

function algo_salesman(){
    let len = route.length;
    memo = {};
    
    // algo
    let ret = Math.pow(2, 20);
    for (let i = 1; i < len; i++){
        ret = Math.min(ret, salesman_cost(route, route[i]) + dist[route[0]][route[i]]);
    }
    
    let tmp_route = [route[0]];
    while(route.length > 2){
        let ret = Math.pow(2, 20);
        let last = "";
        for (const [key, value] of Object.entries(memo[route])){
            if (tmp_route == [route[0]]) {
                if (value + dist[key][tmp_route[0]] < ret){
                    ret = value + dist[key][tmp_route[0]];
                    last = key;
                }
            }
            else if (value + dist[key][tmp_route[0]] < ret){
                ret = value + dist[key][tmp_route[0]];
                last = key;
            }
        }
        route.splice(route.findIndex(i => i === last), 1);
        tmp_route.reverse();
        tmp_route.push(last);
        tmp_route.reverse();
    }

    if (tmp_route != [route[0]]){
        tmp_route.splice(tmp_route.findIndex(i => i === route[0]), 1);        
        route = route.concat(tmp_route);
    }
}

function salesman_cost(subset, end){
    if (subset.length == 2){
        return dist[subset[0]][end];
    }

    if (memo[subset] == undefined){
        memo[subset] = {};
    }
        
    if (memo[subset][end] != undefined){
        return memo[subset][end];
    }
    // push to memo
    let ret = Math.pow(2, 20);
    for (const tmp of subset){
        if (tmp == route[0]) continue;
        if (tmp == end) continue;
        let ssubset = subset.slice();
        ssubset.splice(ssubset.findIndex(i => i === end), 1);
        ret = Math.min(ret, salesman_cost(ssubset, tmp) + dist[end][tmp]);
        memo[subset][end] = ret;
    }

    return ret;
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
