const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const bodyParser = require('koa-bodyparser');
const router = new Router();

const normal = require('./normal');

app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());   

app.listen(3000, () => console.log("Server started on port 3000"));

// for check
router.get('/', (ctx, next) => {
    ctx.body = 'home';
});

router.use('/normal', normal.routes());
