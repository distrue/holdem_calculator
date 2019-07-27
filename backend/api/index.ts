const Router = require('koa-router');

const api = new Router();

api.get('/', (ctx, next) => {
    ctx.body = 'api';
});

const equity = require('./equity');
const handcombo = require('./handcombo');

api.use('/equity', equity.routes());
api.use('/handcombo', handcombo.routes());

module.exports = api;