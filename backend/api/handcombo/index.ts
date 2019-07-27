import * as Router from 'koa-router';

const handcombo = new Router();

// for test
handcombo.get('/', (ctx, next) => {
    ctx.body = 'handcombo';
});

module.exports = handcombo;