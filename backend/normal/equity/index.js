const Router = require('koa-router');
const equity = new Router();

function error(content, context) {
  // tslint:disable-next-line: no-console
    console.error(context, content);
}

function calequity(time, playnum, sharedcardnum, sharedcard, playrangenum, playrange){
  // const exec = require('child_process').execFile;
  // const random = exec('./random');

  const { spawn } = require('child_process');
  const random = spawn('/Users/autochess/Desktop/holdem/back/holdem_calculator/backend/api/equity/random');  

  function stdin_sharedcard(param1, param2){
    console.log(param2);
    param1.stdin.write(param2);
  }
  function stdin_playrangenum(param1, param2){
    console.log(param2);
    param1.stdin.write(param2);
  }
  function stdin_playrange(param1, param2){
    console.log(param2);
    param1.stdin.write(param2);
  }

/*
  // for test..
  console.log("Random.exe start..");
  console.log(time);
  console.log(playnum);
  console.log(sharedcardnum);
  console.log(sharedcard);
  console.log(playrangenum);
  console.log(playrange);
*/

  console.log(time);
  // time
  random.stdin.write(time);

  console.log(playnum);
  // playnum
  random.stdin.write(playnum);

  console.log(sharedcardnum);
  // sharedcardnum
  random.stdin.write(sharedcardnum);

  // sharedcard[i]
  for(var i = 0; i < sharedcardnum; i++) stdin_sharedcard(random, sharedcard[i]);

  // playrangenum[i]
  for(var i = 0; i < playnum; i++){
    stdin_playrangenum(random, playrangenum[i]);
    for(var j = 0; j < playrangenum[i]; j++){
      for(var t = 0; t < 2; t++) stdin_playrange(random, playrange[i][j][t]);
    }
  }
  // for test..
  console.log("end..");
  random.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
};

// for test
equity.get('/', (ctx, next) => {
    ctx.body = 'equity';
});

equity.post('/', (ctx, next) => {
  // for test..
  console.log(ctx.request.body);

  const playTime = ctx.request.body.playTime;
  const fixedSharedCardnum = ctx.request.body.fixedSharedCardnum;
  const fixedSharedCard = ctx.request.body.fixedSharedCard;
  const playernum =  ctx.request.body.playernum;
  const playerRangenum =  ctx.request.body.playerRangenum;
  const playerRange =  ctx.request.body.playerRange;

/*
  // for test
  console.log("Success..");
  console.log(playTime);
  console.log(fixedSharedCardnum);
  console.log(fixedSharedCard);
  console.log(playernum);
  console.log(playerRangenum);
  console.log(playerRange);
*/

  try {
    ctx.status = 200;
    ctx.body = {success: true};
    next().then(()=> {
      // calequity(playTime, playernum, fixedSharedCardnum, fixedSharedCard, playerRangenum, playerRange);
      ctx.status = 200; ctx.body = {playTime, playernum, fixedSharedCardnum, fixedSharedCard, playerRangenum, playerRange};
    });
  } 
  catch (err) {
    ctx.status = 500;
    ctx.body = {success: false}; 
    error(err, 'POST /api/equity');
  }
});

module.exports = equity;