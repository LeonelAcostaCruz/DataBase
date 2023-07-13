//configuraciones del servidor
let express = require("express");
let Sha1 = require("sha1");
let mysql = require('mysql');
let expressSession = require ("express-session");
let cookieParser = require ("cookie-parser");

class Server{
  constructor(){
    //se agrega la funcion express a la variable app
    //se agrega el puerto al puerto xd
    //se invocan las funciones middleware y routes
    this.app=express();
    this.port=process.env.PORT;
    this.middlewares();
    this.routes();
    
  }

  middlewares(){
    // se agregan las paginas estaticas que creamos en la carpeta public
    this.app.use(express.static('public'));
    //view engine
    this.app.set('view engine', 'ejs'); 
    // para las seciones
   //sesiones//////////////////
   this.app.use(cookieParser());

   this.app.use(expressSession({
       secret: "amar",
       saveUninitialized: true,
       resave: true
   }));
   ////////////////////////////
  }

  routes(){
    //se agragan rutas
    this.app.get('/hola',(req, res) => {
      //session
      //condicionador de roles 
      if (req.session.user){
        if(req.session.user.rol  =='admin'){
          res.send("<h1 style=' color: blue;'>Iniciaste como Administrador!</h1>" )
        }
        else{
          res.send("<h1 style=' color: blue;'>Iniciaste como Cliente!</h1>" )
        }
      }
      else{
        res.send("<h1 style=' color: blue;'>ERROR NO HAS INICIADO SESION!</h1>")
      }
    });
    
    //ruta login
    this.app.get("/login", (req, res) =>{
      let nombre_usuario = req.query.nombre_usuario;
      let contrasena = req.query.contrasena;


      ////////cifrado hash sha1
      /////////////////////////////////
      let passSha1 = Sha1(contrasena);
      ///////////////////////////////
      
      //ENSALZAR BD
     
      let con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "P4nt3r4.123",
        database: "escuel_a"
      });
      con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        let sql = "select * from usuarios where nombre_usuario = '"+ nombre_usuario + "'";

        con.query(sql, function (err, result) {
          if (err) throw err;
          if (result.length>0)

           if(result[0].contrasena == passSha1){
            ///////////session///////////
            let user = {
              nam: nombre_usuario,
              psw: contrasena,
              rol: result[0].rol
            };
            req.session.user = user;
            req.session.save();
            res.render("login" , {nombre_usuario: result[0].nombre_usuario,
              rol:result[0].rol
              });
            }
          else
           res.render("login",{error: "contraseña incorrecta!!"});
          else
            res.render("login" ,{error: "Usuario no existe!!!"});

        });
      });
    });
 //fin de la ruta login
//ruta registrar 
    this.app.get("/registrar", (req, res) =>{
      let mat = req.query.matricula;
      let nombre = req.query.nombre;
      let cuatri = req.query.cuatrimestre; 
      //ENSALZAR BD
      res.render("registrado" , { mat:mat, nombre:nombre, cuatri:cuatri});
      let con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "P4nt3r4.123",
        database: "escuel_a"
      });
      con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        let sql = "INSERT INTO alumno values ("+ mat + ",'"+nombre+"'," + cuatri +")";
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      });
      //fin de la ruta alumno
    });
    //ruta de curso registrado
    this.app.get("/registrar_cursos", (req, res) =>{
      let id_curso = req.query.id_curso;
      let nombre = req.query.nombre;

      //ENSALZAR BD
      res.render("registrar_curso" , {id_curso:id_curso , nombre:nombre});

      let con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "P4nt3r4.123",
        database: "escuel_a"
      });
      con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        let sql = "INSERT INTO curso values ("+id_curso+",'"+nombre+"')" ;
        con.query(sql, function (err, result) {
          if  (err) throw err;
          console.log("1 record inserted");
        });
      });
    });
    this.app.get("/usuarios", (req, res) =>{
      let usuario = req.query.usuario;
      let contrasena = req.query.contrasena;
      let rol = req.query.rol; 
      //ENSALZAR BD
      res.render("registrado" , { usuario:usuario, contrasena:contrasena, rol:rol});
      let con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "P4nt3r4.123",
        database: "escuel_a"
      });
      con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        let sql = "INSERT INTO alumnos values ("+ usuario + ",'"+contrasena+"'," + rol +")";
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      });
      //fin de la ruta alumno
    });
    this.app.get("/inscribir",(req,res)=>{
      let matricula=req.query.matricula;
      let id_curso=req.query.curso;
      
      res.render('inscribir',{matricula:matricula,id_curso:id_curso});
      
      let con=mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "P4nt3r4.123",
        database: "escuel_a"
      });
      
      con.connect(function(err){
        if(err) throw err;
        console.log('conectado!');
        let sql="INSERT INTO inscrito VALUES ("+matricula+","+id_curso+")";
        con.query(sql,function(err,result){
          if(err) throw err;
            console.log('1 registro agregado');
        });
      });
    });
  }

  listen(){
    //en que puerto se va a configurar
    this.app.listen(this.port,()=>{
      console.log("http://127.0.0.1:"+this.port);
    });
  }
}

module.exports = Server;