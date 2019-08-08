const Router = require('koa-router');
const equity = new Router();

// GameResult
// 1. gameNum    : 전체 게임 횟수
// 2. winNum     : 전체 승리 횟수 (!= 전체 게임 횟수, beca of hand percentage)
// 3. playerWin  : player 별 solo win num / draw win num
// 4. playerHand : player 별 스트레이트 플러시 / 포 카드 / 풀 하우스 / 플러시 / 스트레이트 / 트리플 / 투 페어 / 원 페어 / 탑 개수

const GameResultList = new Object();
let GameId = 1;

function error(content, context) {
  // tslint:disable-next-line: no-console
    console.error(context, content);
}

function calequity(time, playnum, sharedcardnum, sharedcard, playrangenum, playrange){
    // console.log(GameResultList);
    const GameResult = new Object();
    // console.log(3);
    const cp = require('child_process');
    const random = cp.spawn('./normal/equity/random');

    // console.log(4);
    function random_stdin(param1, param2){
      param1.stdin.write(param2 + '\n');
    }

    return new Promise(function(resolve, reject) {
      // console.log(5);
      random.stdin.write(time + '\n');
      random.stdin.write(playnum + '\n');
      random.stdin.write(sharedcardnum + '\n');
      for(let i = 0; i < sharedcardnum; i++) random_stdin(random, sharedcard[i]);
      for(let i = 0; i < playnum; i++) random_stdin(random, playrangenum[i]);
      for(let i = 0; i < playnum; i++){
        let k = playrangenum[i];
        for(var j = 0; j < k; j++) for(var t = 0; t < 3; t++) random_stdin(random, playrange[i][j][t]);
      }
      
      // console.log(6);
      random.stdout.on('data', (data) => {

        const random_out = `${data}`;
        const result = random_out.split('\n');
        var hash = require('object-hash');

        if(result[0] == -1){
          // console.log(7);
          reject( "Impossible Range Setting" );
        }
        else{
          // console.log(8);
          const win = Array(playnum).fill(null).map(() => Array());
          for(let i = 0; i < playnum; i++){
            const str = result[i+2];
            const tmp = str.split(' ');
            for(let j = 0; j < 2; j++) win[i][j] = tmp[j];
          }

          const hand = Array(playnum).fill(null).map(() => Array());
          for(let i = 0; i < playnum; i++){
            const str = result[i + 2 + playnum];
            const tmp = str.split(' ');
            for(let j = 0; j < 9; j++) hand[i][j] = tmp[j];
          }

          const playresult = new Array();
          for(let i = 0; i < playnum; i++){
            const playerresult = new Object();
            playerresult.soloWin = win[i][0];
            playerresult.drawWin = win[i][1];
            playerresult.straightflush = hand[i][0];
            playerresult.fourcard = hand[i][1];
            playerresult.fullhouse = hand[i][2];
            playerresult.flush = hand[i][3];
            playerresult.straight = hand[i][4];
            playerresult.triple = hand[i][5];
            playerresult.twopair = hand[i][6];
            playerresult.onepair = hand[i][7];
            playerresult.top = hand[i][8];
            playresult.push(playerresult);
          }
          GameResult.gameNum = result[0];
          GameResult.winNum = result[1];
          GameResult.playerResult = playresult;
          GameId = hash(GameResult);

          GameResultList[GameId] = GameResult;
          // console.log(GameResultList);
          resolve();
        };
      });
    });
};

equity.post('/', async ctx => {
  ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');

  console.dir(ctx.request.body);
  const playTime = Number(ctx.request.body.playTime);
  const fixedSharedCardnum = Number(ctx.request.body.fixedSharedCardnum);
  const fixedSharedCard = ctx.request.body.fixedSharedCard;
  const playernum =  Number(ctx.request.body.playernum);
  const playerRangenum = ctx.request.body.playerRangenum;
  const playerRange = ctx.request.body.playerRange;

  try {
    await calequity(playTime, playernum, fixedSharedCardnum, fixedSharedCard, playerRangenum, playerRange);
    ctx.status = 200;
    ctx.body = { success: true, key: GameId };
  }
  catch (err) {
    ctx.status = 500;
    ctx.body = { success: false, err }; 
    error(err, 'POST /api/equity :  ');
  }
});

equity.get('/', async ctx => {
  // console.log(ctx.request.body);
  requestId = ctx.request.body.GameId;
  
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');

  try {
    // console.log(requestId);
    ctx.status = 200;
    ctx.body = GameResultList[requestId];
    delete GameResultList[requestId];
  } 
  catch (err) {
    ctx.status = 500;
    ctx.body = { success: false }; 
    error(err, 'GET /api/equity');
  }
});

module.exports = equity;