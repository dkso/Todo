var http = require('http'),
	express = require('express'),
    routes = require('./routes'),
    crypto = require('crypto'), // Para MD5, sha1, sha256 
    fs = require('fs'),
    mysql = require('mysql');
    
var app =  express(),
	server = http.createServer(app),
	io = require('socket.io').listen(server);

server.listen(3000);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/vista');
  app.set("view options", { layout: false }) 
  //app.engine('html', require('ejs').renderFile); // Tiene que estar cargado el módulo ejs para cargar .html
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

/*app.configure('production', function(){
  app.use(express.errorHandler()); 
});*/

// Configuración MySQL

var db_config = {
	host: 'localhost',
    user: 'dani',
    password: 'Nadlc2009',
    database: 'todo'
};

var connection;

function handleDisconnect() {

  connection = mysql.createConnection(db_config); // Creamos la conexión

  connection.connect(function(err) {              // Si la conexión se cae
  
    if(err) {   
                                     
      console.log('Error al conectar con la base de datos:', err);
      
      setTimeout(handleDisconnect, 2000); // Si perdemos la conexion utilizamos un delay de 2 segundos para reconectar,
      
    } else {
    
	    console.log('Conectado a MySQL con éxito.');
	    
    }                                    
    
  });                                    
  
    connection.on('error', function(err) {
  
	  	console.log('db error', err);
	    
	    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
	    
	      handleDisconnect();                         // lost due to either server restart, or a
	      
	    } else {                                      // connnection idle timeout (the wait_timeout
	    
	      throw err;                                  // server variable configures this)
	      
	    }
    
	});
  
}

// Enrutamiento de las páginas

app.get('/', function(req, res){

	/*var data = 'Esto es una prueba';

    res.render('index.html');*/
    
      fs.readFile(__dirname + '/vista/index.html', function (err, data) {
	  
	    if (err) {
	    
	      res.writeHead(500);
	      
	      return res.end('Error loading index.html');
	      
	    }
	
	    	res.writeHead(200);
			res.end(data);
			
	  });
    
});

// Empezamos con las conexiones de Socket.io

io.sockets.on('connection', function(socket) {

	// Enviamos al cliente
  	socket.emit('bienvenida', { Bienvenida: 'Bienvenido, estamos conectados' });
  
  	// Recibimos respuesta del cliente
  	socket.on('respuesta bienvenida', function (data) {
    	console.log(data);
	});
	
	// Recibimos Login del usuario
	
	login(socket);
	
	// Desconexión Usuarios
	
	socket.on('disconnect', function () {
	    io.sockets.emit('Usuario desconectado.');
	});
  
});

// Manejo funciones MySQL
function login(socket) {
	
	socket.on('sesion login', function (data) { 
		
		var nombre = data.nombre,
			passwd = crypto.createHash('md5').update(data.passwd).digest("hex"),
			sql    = 'SELECT user FROM todoApp_usuarios WHERE user = ' + connection.escape(nombre) + 'AND passwd = ' + connection.escape(passwd);
		
		connection.query(sql, function(err, results) {
			
			if(!err) {
				
				socket.emit('datos usuario', { 
					user: results[0]
				});
				
			}	 	
		 	
		});
		
	});
	
}

// Cerramos la conexión a la base de datos

handleDisconnect();

// Corrupción

console.log("Servidor express está escuchando en el puerto 3000 en modo dev");