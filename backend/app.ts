import * as Koa from 'koa';
import * as Router from 'koa-router';

const app = new Koa();
const router = new Router();

router.get('/', (ctx: any, next) => {
    ctx.status = 200; ctx.body = {"success": true, "result": "Holdem API server"};
});

app.use(router.routes());
app.listen(3000, () => console.log("Server started on port 3000"));
