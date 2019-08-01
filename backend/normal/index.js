const Router = require('koa-router');

const api = new Router();
const equity = require('./equity');

api.use('/equity', equity.routes());

api.get('/', (ctx, next) => {
    ctx.body = 'normal';
});

module.exports = api;