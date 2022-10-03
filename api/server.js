const express = require('express');
const cors = require('cors');
const morgan=require('morgan')
const { dbConnection } = require('./database/config');



const cookieSession = require("cookie-session");
const passportSetup = require("./passport");


const usuarios = require('./routes/usuarios')
const productos = require('./routes/productos')
const categorias = require('./routes/categorias')
const buscar = require('./routes/buscar')

const passport = require("passport");
const InstagramStrategy = require("passport-instagram").Strategy;
const keys = require("./config");

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {
        this.app.use(
            cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
          );

          this.app.use(passport.initialize());
          this.app.use(passport.session())
  
        // CORS
        this.app.use( cors() );

        // this.app.use(
        //     cors({
        //       origin: "http://localhost:3000",
        //       methods: "GET,POST,PUT,DELETE",
        //       credentials: true,
        //     })
        //   );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );

        // muestra las reutas cuando se hace un request
        this.app.use(morgan('dev'));

    }

    routes() {
        
        this.app.use( '/api/buscar', buscar);
        this.app.use( '/api/categorias', categorias);
        this.app.use( '/api/productos', productos);
        this.app.use( '/api/usuarios', usuarios);
        this.app.use( '/api', (req,res,next)=>{
            console.log("first")
            res.send('<h1>hola</h1>')
            
        });

        this.app.get("/auth/instagram", passport.authenticate("instagram"));
        this.app.get("/auth/instagram/callback",
            passport.authenticate("instagram"),
                (req, res) => {
                    res.redirect("/home");
                });

                
        // Instagram Strategy
        passport.use(new InstagramStrategy({
            clientID: keys.INSTAGRAM.clientID,
            clientSecret: keys.INSTAGRAM.clientSecret,
            callbackURL: "/auth/instagram/callback"
        },
        (accessToken, refreshToken, profile, cb) => {
            console.log((JSON.stringify(profile)));
            user = { ...profile };
            return cb(null, profile);
        }));


    }





    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
