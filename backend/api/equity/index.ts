import * as Router from 'koa-router';

const equity = new Router();

// for test
equity.get('/', (ctx, next) => {
    ctx.body = 'equity';
});

equity.post('/', (req, res) => {
    const form = {

      email: req.body.email,
      nickname: req.body.nickname,
      password: req.body.password
    };
});

module.exports = equity;