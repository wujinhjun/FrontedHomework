var ifBegin = false;

const MAP_SIZE = {
    rowsNum: 10,
    colsNum: 10,
};

const PROP_NUM = 18;
// the 18 is a magic number, because I like multiples of three
// in the map, a total of 18 props

const SCORE = {
    award: 15,
    trap: -30,
    lighting: -99,
};
// for the same reason as the above
// In this game, each awards will add 10 points, 
// trap will reduce 15 points
// lighting will kill you

var timelimiting = 30;
// You have 30second to finish this game

const HEART = 30;
// it can add 30 points and 30 seconds

const INIT_LOC = {
    row: 0,
    col: 0,
};

var loc = {
    row: INIT_LOC.row,
    col: INIT_LOC.col,
}

var scores = 0;


// Initialize the prop and score
const initBonus = (size, count, score) => {
    const record = [];
    while (record.length < count) {
        let row = Math.random() * size.rowsNum; 
        row = Math.floor(row);
        let col = Math.random() * size.colsNum;
        col = Math.floor(col);
        if (row == 0 && col == 0){
            continue;
        }
        // (英文实在有点菜，为了效率还是写中文吧)
        // 判断是否会有冲突出现
        if (isExistBonus([row, col], record)){
            continue;
        }
        // 前十二个为奖牌
        // 中间四个为陷阱
        // 最后两个是闪电（触之即死）
        if (record.length <= 12) {
            record.push([row, col, score.award]);
        }else if (record.length > 12 && record.length <= 16) {
            record.push([row, col, score.trap]);
        }else if (record.length > 16 && record.length < 18){
            record.push([row, col, score.lighting]);
        }else {
            record.push([row, col, HEART])
        }
    }
    return record;
}

// initialize the map
const initMap = (size, count, score) => {
    const map = [];
    const bonusRecord = initBonus(size, count, score);

    for (let row = 0; row < size.rowsNum; row ++){
        const rowItem = [];

        for (let col = 0; col < size.colsNum; col ++){
            const bonusScore = isNumBonus([row, col], bonusRecord);

            if (bonusScore == 0) {
                rowItem.push(null);
            }else {
                rowItem.push({bonus: bonusScore});
            }
        }
        map.push(rowItem);
    }
    return map;
}

// initialize the player position
const initPlayer = () => {
    addPlayer(INIT_LOC.row, INIT_LOC.col);
}

// move the player
const movePlayer = () => {
    window.addEventListener("keydown", function(e){
        deleteProp(loc.row, loc.col);
        let keyResult = e.which;
        if (!ifBegin) {
            keyResult = 0;
        }
        switch (keyResult) {
            case (38):
                if (loc.row > 0) {
                    loc.row --;
                }
                break;

            case (40):
                if (loc.row < MAP_SIZE.rowsNum) {
                    loc.row ++;
                }
                break;

            case (37): 
                if (loc.col > 0) {
                    loc.col --;
                }
                break;

            case (39):
                if (loc.col < MAP_SIZE.colsNum) {
                    loc.col ++;
                }
                break;
        }

        let i = loc.row, j = loc.col;
        if (map[i][j] != null) {
            score = map[i][j].score;
            if (score == HEART) {
                timelimiting += HEART;
            }
            scores += score;

            const oScore = document.getElementsByClassName('score')[0];
            oScore.innerHTML = scores;
            deleteProp(pos.row, pos.col);
            map[i][j] = null;
        }
        addPerson(i, j);
        console.log(pos.row, pos.col);
    }, false)
}

// delete the prop
const deleteProp = (row, col) => {
    const rowBefore = document.getElementsByClassName('row')[row];
    const playerBefore = rowBefore.children[col];
    if (playerBefore.lastElementChild) {
        playerBefore.removeChild(playerBefore.lastChild);
    }
}

// judge the score and repeat
const isExistBonus = (location, record) => {
    for (let i = 0; i < record.length; i++){
        if ((location[0] == record[i][0]) && location[1] == record[i][1]){
            return true;
        }
    }

    return false;
}
const isNumBonus = (location, record) => {
    for (let i = 0; i < PROP_NUM; i++) {
        if ((location[0] == record[i][0]) && (location[1] == record[i][1])) {
            return record[i][2];
        }
    }

    return 0;
}

// add player to the browser
const addPerson = (row,col) => {
    const rowAfter = document.getElementsByClassName('row')[row];
    const playerAfter = rowAfter.children[col];
    const disPlayer = document.createElement('img');
    disPlayer.class = 'player';
    disPlayer.src = './folderForSvg/githubUser.svg';
    playerAfter.appendChild(disPlayer);
}

// display the map
const drawMap = (map) => {

}

var map = initMap(MAP_SIZE, PROP_NUM, SCORE);

drawMap(map);