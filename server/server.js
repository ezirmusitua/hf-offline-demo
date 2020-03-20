const Koa = require("koa");
const cors = require("@koa/cors");
const koaBody = require("koa-body");
let Router = require("koa-better-router");
let router = Router().loadMethods();

router.post("/", (ctx, next) => {
  ctx.set("Content-Type", "application/json");
  ctx.body = `{status: 200}`;
  next();
});

router.get("/", (ctx, next) => {
  ctx.set("Content-Type", "application/json");
  ctx.body = `{status: 200}`;
  next();
});

const app = new Koa();
app.use(koaBody());
app.use(cors());
app.use(router.middleware());

module.exports = function startServer(port = 3000) {
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
    console.log(`Try to open these routes:`);
    router.routes.forEach(route => {
      console.log(`\t${route.method} http://localhost:${port}${route.path}`);
    });
  });
};
