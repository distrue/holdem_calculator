import * as Koa from 'koa';
import * as Router from 'koa-router';

const app = new Koa();
const router = new Router();

// for check
router.get('/', (ctx, next) => {
    ctx.body = 'home';
});

const api = require('./api');
router.use('/api', api.routes());

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000, () => console.log("Server started on port 3000"));
