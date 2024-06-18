// Importaciones generales
const http = require("http");
const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const session = require("express-session");
const passport = require("passport");
const swaggerJSDoc  = require("swagger-jsdoc");
const swaggerExpress  = require("swagger-ui-express");
const mongoStore = require("connect-mongo");
const database = require("./dao/db/mongo/index");
const chatModel = require("./dao/db/models/messages.model");
const ProductService = require("./services/productService");

// Importaciones de rutas
const routerProd = require("./routes/products.routes");
const routerCart = require("./routes/cart.routes");
const userProd = require("./routes/user.routes");
const homeProductsRouter = require("./routes/homeproducts.routes");
const routerRealTimeProducts = require("./routes/realTimeProducts.routes");
const chatRouter = require("./routes/chat.routes");
const cartsRouter = require("./routes/carts.routes");
const authRouter = require("./routes/auth.views.routes");
const authApiRouter = require("./routes/auth.routes");
const sessionsRouter = require("./routes/sessions.routes");
const mockingRouter = require("./routes/mockingproducts.routes");

const initPassport = require("./config/passport.config");

const config = require("./config/config");

const auth = require("./middleware/auth");
const { addLogger } = require("./utils/logger");

const productService = new ProductService();

const app = express();

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "API Docs",
      info: {
        title: "Documentacion de la API",
        description: "Aca va a estar toda la informacion detallada de las API"
      }
    }
  },
  apis: [`./src/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use("/apidocs", swaggerExpress.serve, swaggerExpress.setup(specs))

app.use(
  session({
    store: mongoStore.create({
      mongoUrl: config.MONGO_URL,
    }),
    secret: config.SECRET_KEY_SESSION,
    resave: true,
    saveUninitialized: true,
  })
);

initPassport();
app.use(passport.initialize());
app.use(passport.session());

const server = http.createServer(app);

server.listen(config.PORT, () => {
  console.log(`Se inicio con el puerto ${config.PORT}`);
  database.connect();
});
 

// Motor de plantillas
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Middlewares y carpeta static
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(addLogger);
app.use(express.static(__dirname + "/public"));


// Definicion de las rutas
app.use("/", authRouter);
app.use("/api/products", routerProd);
app.use("/api/carts", routerCart);
app.use("/api/users", userProd);
app.use("/products", auth, homeProductsRouter);
app.use("/carts", auth, cartsRouter);
app.use("/realtimeproducts", auth, routerRealTimeProducts);
app.use("/chat", auth, chatRouter);
app.use("/auth/", authApiRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/mockingproducts", mockingRouter);
app.get('/loggerTest', (req, res, next) => {
  req.logger.fatal('Mensaje fatal');
  req.logger.error('Mensaje de error');
  req.logger.warning('Mensaje de advertencia');
  req.logger.http('Mensaje de HTTP');
  req.logger.info('Mensaje de información');
  req.logger.debug('Mensaje de debug');

  const err = new Error('Este es un error de prueba');
  next(err);
});
app.use("*", async (req, res) => {
  res.status(404).render("404");
});



// Socket
const io = new Server(server);
io.on("connection", async (socket) => {
  console.log(`Nuevo cliente conectado ${socket.id}`);

  socket.on("getProducts", async () => {
    try {
      const products = await productService.getProducts({
        limit: 10,
        page: 1,
        sort: null,
        query: null,
      });
      socket.emit("productsData", products.payload);
    } catch (error) {
      console.error("Error al obtener productos:", error.message);
    }
  });

  socket.on("addProduct", async (addProd) => {
    try {
      productService.addProduct(addProd);
      const products = await productService.getProducts({
        limit: 10,
        page: 1,
        sort: null,
        query: null,
      });
      socket.emit("productsData", products.payload);
    } catch (error) {
      console.error("Error al agregar nuevo producto:", error.message);
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      productService.deleteProduct(productId);
      socket.emit("productDeleted", productId);
    } catch (error) {
      console.error("Error al eliminar producto:", error.message);
    }
  });

  socket.on("new_message", async (data) => {
    const new_message = new chatModel({
      user: data.name,
      message: data.text,
      date: data.date,
    });

    await new_message.save();

    io.sockets.emit("chat_messages", new_message);
  });

  try {
    const messages = await chatModel.find({});
    socket.emit("chat_messages", messages);
  } catch (error) {
    console.error("Error al obtener mensajes existentes:", error);
  }
});