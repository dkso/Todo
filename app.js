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
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  
  app.use(express.cookieParser()); // Mostrar información de las coockies
  app.use(express.session({ secret: 'Esto es secreto'})); // Mostrar información de las sesiones
  
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

// Sesión de usuario



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
    
      fs.readFile(__dirname + '/vista/index.html', function (err, data) {
	  
	    if (err) {
	    
	      res.writeHead(500);
	      
	      return res.end('Error al cargar index.html');
	      
	    }
	
	    	res.writeHead(200);
			res.end(data);
			
	  });
    
});

// De vuelta con la sesión iniciada

app.get('/:user', function(req, res){
    
      fs.readFile(__dirname + '/vista/index.html', function (err, data) {
	  
	    if (err) {
	    
	      res.writeHead(500);
	      
	      return res.end('Error al cargar index.html');
	      
	    }
	
	    	res.writeHead(200);
			res.end(data);
			
	  });
    
});

// Creamos una nueva tarea

app.get('/todo', function(req, res){
	
	// La sesión de usuario es
	
      fs.readFile(__dirname + '/vista/todo.html', function (err, data) {
	  
	    if (err) {
	    
	      res.writeHead(500);
	      
	      return res.end('Error al cargar la página.');
	      
	    }
	
    	res.writeHead(200);
		res.end(data);
			
	  });
    
});

// Sesión con Socket.io

// Empezamos con las conexiones de Socket.io

io.sockets.on('connection', function(socket) {

	// Enviamos al cliente
  	socket.emit('bienvenida', { Bienvenida: 'Bienvenido a NodeJs & Socket.io' });
  
  	// Recibimos respuesta del cliente
  	socket.on('respuesta bienvenida', function (data) {
    	console.log(data);
	});
	
	// Recibimos Login del usuario
	
	login(socket);
	
	// Recuperamos los tasks
	
	socket.on('recuperamos tasks', function (data) {
    	
    	var usuario = data.user,
			sql    = 'SELECT task, user, state FROM todoApp_tasks WHERE user = ' + connection.escape(usuario);
		
		connection.query(sql, function(err, results) {
			
			if(!err) {
				
				socket.emit('enviamos tasks', { 
					tasks: results
				});
				
			}
			
		});
	});
	
	// Nuevo task
	
	socket.on('nueva tarea', function (data) {
    	
    	var usuario = data.nombre,
    		nueva_tarea = data.nueva_tarea		
			post  = {task: nueva_tarea, user: usuario, state: 0};
			
		connection.query('INSERT INTO todoApp_tasks SET ?', post, function(err, results) {
			 
			 if(!err) {
				
				// Enviamos de nuevo los resultados
				
				var usuario = data.nombre,
					sql    = 'SELECT task, user, state FROM todoApp_tasks WHERE user = ' + connection.escape(usuario);
				
				connection.query(sql, function(err, results) {

					if(!err) {
												
						socket.broadcast.emit('enviamos msg', { 
							msg: '<span class="success">Otro usuario ha creado una tarea: ' + nueva_tarea + '</span>'
						});
						
						socket.broadcast.emit('enviamos tasks', { 
							tasks: results
						});
						
						socket.emit('enviamos msg', { 
							msg: '<span class="success">Tarea creada: ' + nueva_tarea +  '</span>'
						});
						
						socket.emit('enviamos tasks', { 
							tasks: results
						});
						
					}
					
				});
				
				// 
					
			}
			
		});
	});
	
	// Borrar task
	
	socket.on('borrar tarea', function (data) {
    	
    	var usuario = data.nombre,
    		borrar_tarea = data.borrar_tarea,
    		sql = 'DELETE FROM todoApp_tasks WHERE task=' + connection.escape(borrar_tarea) + 'AND user=' + connection.escape(usuario);
			
		connection.query(sql, function(err, results) {
			 
			 if(!err) {				
				
				var usuario = data.nombre,
					sql    = 'SELECT task, user, state FROM todoApp_tasks WHERE user = ' + connection.escape(usuario);
				
				connection.query(sql, function(err, results) {

					if(!err) {
						
						socket.broadcast.emit('enviamos msg', { 
							msg: '<span class="error">Otro usuario ha borrado una tarea:' + borrar_tarea +  '</span>'
						});
						
						socket.broadcast.emit('enviamos tasks', { 
							tasks: results
						});
						
						socket.emit('enviamos msg', { 
							msg: '<span class="error">Se ha borrado una tarea: ' + borrar_tarea + '</span>'
						});
						
						socket.emit('enviamos tasks', { 
							tasks: results
						});
						
					}
					
				});
					
			} else {
				
				console.log('Ha ocurrido un error: ' + err);
				
			}
			
		});
	});
	
	// Editar task
	
	socket.on('editar tarea', function (data) {
    	
    	var usuario = data.nombre,
    		oldTask = data.tarea,
    		editar_tarea = data.editar_tarea,
    		sql = 'UPDATE todoApp_tasks SET task="' + editar_tarea + '" WHERE task=' + connection.escape(oldTask) + ' AND user= ' + connection.escape(usuario);
			
		// UPDATE `todoApp_tasks` SET `id`=[value-1],`task`=[value-2],`user`=[value-3],`state`=[value-4] WHERE 1
		connection.query(sql, function(err, results) {
			 
			 if(!err) {
				
				// Enviamos de nuevo los resultados
				
				var usuario = data.nombre,
					query    = 'SELECT task, user, state FROM todoApp_tasks WHERE user = ' + connection.escape(usuario);
				
				connection.query(query, function(err, results) {

					if(!err) {
					
						socket.broadcast.emit('enviamos msg', { 
							msg: '<span class="success">Otro usuario ha actualizado una tarea: ' + oldTask + ' por: ' + editar_tarea + '</span>'
						});
						
						socket.broadcast.emit('enviamos tasks', { 
							tasks: results
						});
						
						socket.emit('enviamos msg', { 
							msg: '<span class="success">Se ha actualizado una tarea ' + oldTask + ', por: ' + editar_tarea + '</span>'
						});
						
						socket.emit('enviamos tasks', { 
							tasks: results
						});

						
					} else {
						
						console.log('Ha ocurrido un error: ' + err );
					}
					
				});
				
				// 
					
			} else {
				
				console.log( 'Ha ocurrrido un error en la consulta: ' + err );
				
			}
			
		});
	});
	
	// Cambiamos estado de la tarea
	
	socket.on('cambiamos estado', function (data) {
    	
    	var usuario = data.nombre,
    		tarea_seleccionada = data.tarea_seleccionada,
    		estado = data.estado,
    		sql = 'UPDATE todoApp_tasks SET task="' + tarea_seleccionada + '", state="' + estado + '" WHERE task=' + connection.escape(tarea_seleccionada) + ' AND user= ' + connection.escape(usuario);
    		
    	// UPDATE `todoApp_tasks` SET `id`=[value-1],`task`=[value-2],`user`=[value-3],`state`=[value-4] WHERE 1
			
		connection.query(sql, function(err, results) {
			 
			 if(!err) {
				
				var usuario = data.nombre,
					query    = 'SELECT task, user, state FROM todoApp_tasks WHERE user = ' + connection.escape(usuario);
				
				connection.query(query, function(err, results) {

					if(!err) {
						
						console.log('Resultados del estado' + results );
						
						if(estado == 1) {
							
							socket.broadcast.emit('enviamos msg', { 
								msg: '<span class="error">Otro usuario ha finalizado una tarea: ' + tarea_seleccionada + '</span>'
							});
							
							socket.emit('enviamos msg', { 
								msg: '<span class="error">Tarea finalizada: ' + tarea_seleccionada + '</span>'
							});
							
						} else if (estado == 0) {
							
							socket.broadcast.emit('enviamos msg', { 
								msg: '<span class="success">Otro usuario ha vuelto a activar una tarea: ' + tarea_seleccionada + '</span>'
							});
							
							socket.emit('enviamos msg', { 
								msg: '<span class="success">Tarea activada de nuevo: ' + tarea_seleccionada + '</span>'
							});							
							
						}
					
						
						socket.broadcast.emit('enviamos tasks', { 
							tasks: results
						});
						
						socket.emit('enviamos tasks', { 
							tasks: results
						});

						
					} else {
						
						console.log('Ha ocurrido un error: ' + err );
					}
					
				});
					
			} else {
				
				console.log( 'Ha ocurrrido un error en la consulta: ' + err );
				
			}
			
		});
	});
		
	// Desconexión Usuarios
	
	socket.on('disconnect', function () {
	    io.sockets.emit('Usuario desconectado.');
	});
  
});

// Manejo funciones MySQL

function login(socket) {

	var sessionActive;
	
	socket.on('sesion login', function (data) { 
		
		var nombre = data.nombre,
			passwd = crypto.createHash('md5').update(data.passwd).digest("hex"), // Encriptamos el passwd con MD5
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