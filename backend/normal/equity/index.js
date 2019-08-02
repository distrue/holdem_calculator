const Router = require('koa-router');
const equity = new Router();

// GameResult
// 1. gameNum    : 전체 게임 횟수
// 2. playerWin  : player 별 solo win num / draw win num
// 3. playerHand : player 별 스트레이트 플러시 / 포 카드 / 풀 하우스 / 플러시 / 스트레이트 / 트리플 / 투 페어 / 원 페어 / 탑 개수
const GameResult = new Object();

function error(content, context) {
  // tslint:disable-next-line: no-console
    console.error(context, content);
}

async function calequity(time, playnum, sharedcardnum, sharedcard, playrangenum, playrange){
  
  // console.log(3);
  const cp = require('child_process');
  const random = cp.spawn('./normal/equity/random');

  // console.log(4);
  function random_stdin(param1, param2){
    param1.stdin.write(param2 + '\n');
  }

  // console.log(5);
  random.stdin.write(time + '\n');
  random.stdin.write(playnum + '\n');
  random.stdin.write(sharedcardnum + '\n');
  for(let i = 0; i < sharedcardnum; i++) random_stdin(random, sharedcard[i]);
  for(let i = 0; i < playnum; i++){
    random_stdin(random, playrangenum[i]);
    for(var j = 0; j < playrangenum[i]; j++){
      for(var t = 0; t < 2; t++) random_stdin(random, playrange[i][j][t]);
    }
  }
  
  const playerlist = new Array();
  // console.log(6);
  await random.stdout.on('data', (data) => {

    const random_out = `${data}`;
    const result = random_out.split('\n');

    const win = Array(playnum).fill(null).map(() => Array());
    for(let i = 0; i < playnum; i++){
      const str = result[i+1];
      const tmp = str.split(' ');
      for(let j = 0; j < 2; j++) win[i][j] = tmp[j];
    }

    const hand = Array(playnum).fill(null).map(() => Array());
    for(let i = 0; i < playnum; i++){
      const str = result[i + 1 + playnum];
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
    GameResult.playerResult = playresult;
  });
};

equity.post('/', async ctx => {
  // console.log(ctx.request.body);

  const playTime = Number(ctx.request.body.playTime);
  const fixedSharedCardnum = Number(ctx.request.body.fixedSharedCardnum);
  const fixedSharedCard = ctx.request.body.fixedSharedCard;
  const playernum =  Number(ctx.request.body.playernum);
  const playerRangenum = ctx.request.body.playerRangenum;
  const playerRange = ctx.request.body.playerRange;

  try {
    await calequity(playTime, playernum, fixedSharedCardnum, fixedSharedCard, playerRangenum, playerRange);
    ctx.status = 200;
    ctx.body = {success: true};
  } 
  catch (err) {
    ctx.status = 500;
    ctx.body = {success: false}; 
    error(err, 'POST /api/equity');
  }
});

equity.get('/', async ctx => {
  try {
    ctx.status = 200;
    ctx.body = GameResult;
  } 
  catch (err) {
    ctx.status = 500;
    ctx.body = {success: false}; 
    error(err, 'GET /api/equity');
  }
});
module.exports = equity;