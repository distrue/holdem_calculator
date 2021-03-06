const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const bodyParser = require('koa-bodyparser');
const router = new Router();
const cors = require('koa-cors');

const normal = require('./normal');

app
    .use(bodyParser({ formLimit: '50mb' }))
    .use(bodyParser({ jsonLimit: '50mb' }))
    .use(bodyParser({ textLimit: '50mb' }))
    .use(router.routes())
    .use(router.allowedMethods())
    .use(cors({
        origin: true
      }));   

app.listen(3000, () => console.log("Server started on port 3000"));

// for check
router.get('/', (ctx, next) => {
    ctx.body = 'home';
});

router.use('/normal', normal.routes());
