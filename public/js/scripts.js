jQuery(document).ready(function() {

	var socket = io.connect();
		  
	socket.on('bienvenida', function (data) {
	
		jQuery('.bienvenida h1').html(data.Bienvenida);
	
		socket.emit('respuesta bienvenida', { respuesta: 'Un nuevo usuario se ha conectado' });
	
	});
	
	// Enviamos login al servidor
	
	LogIn(socket);
	
	// Creamos una nueva task
	
	jQuery('.nueva_tarea').css('display', 'none');
	
	jQuery('.actualizar_tarea').css('display', 'none');
	
	crearTask(socket);
	
	// Borramos una nueva tarea lo ponemos aquí para que funcione después de que cargue
	
	deleteTask(socket);
	
	// Editar task
	
	editTask(socket);
	
	// Envío de todas las peticiones
	
	socket.on('datos usuario', function (data) { 
		
		var usuario = data.user;
		
		if( typeof usuario !== 'undefined') {
		
			jQuery('.errors_msg').html('');		
				
			jQuery('.bienvenida h1').html('Bienvenido ' +  data.user.user );
			
			jQuery('.logInUsers').fadeOut(1000);
			
			socket.emit('recuperamos tasks', { user: data.user.user });
			
		} else {
		
			jQuery('.errors_msg').html('Usuario o password incorrectos.');
		
		}
		
	});
	
	// Mensajes 
	
	socket.on('enviamos msg', function (data) {
		
		jQuery('.errors_msg').html(data.msg);
		
	}); 
	
	// Recuperamos actividades
	
	socket.on('enviamos tasks', function (data) { 
	
		jQuery('.tasks ul').empty();
		
		for (var i = 0; i < data.tasks.length; i++) {
		   
		   jQuery('.tasks ul').append('<li><span class="texto_task">' + data.tasks[i].task + '</span> <a href="/" class="editar_task">Editar</a> <a href="/" class="borrar_task">Borrar</a></li>');
		   
		} 
		
		// Añadimos usuario a los form de edicion
		
		var task = data.tasks[0];
		
		if( typeof task !== 'undefined') {
		
			jQuery('.nueva_tarea a').before('<input type="hidden" class="user" value="' + data.tasks[0].user + '" />');
			
		}
		
	});
	
});

// Nos logueamos

function LogIn(socket) {
	
	jQuery('.enviarLogin').click(function(event) {
		
		event.preventDefault();
		
		if( jQuery('.user').val() == '' || jQuery('.passwd').val() == '' ) {
			
			jQuery('.errors_msg').html('Alguno de los campos están vacíos');
			
		} else {
			
			socket.emit('sesion login', { 
			
				nombre: jQuery('.user').val(),
				passwd: jQuery('.passwd').val()
				
			});
			
		}
		
	});
}

// Creamos una nueva tarea

function crearTask(socket) {
	
	jQuery('.tasks a').click(function(e) {
	
		e.preventDefault();
		
		console.log('Hemos hecho click');
		
		jQuery('.nueva_tarea').fadeIn(2000);
		
	});
	
	jQuery('.crear_tarea').click(function(e) {
	
		e.preventDefault();
		
		console.log('Hemos creado una nueva tarea');
		
		socket.emit('nueva tarea', { 
		
			nombre: jQuery('.user').val(),
			nueva_tarea: jQuery('input.nueva_tarea').val()
			
		});
		
		jQuery('.nueva_tarea').fadeOut(2000);
		
		jQuery('input.nueva_tarea').val('');
		
		jQuery('input.user').remove();
			
	});			
	
}

// Delete una tarea

function deleteTask(socket) {
	
	jQuery(document).on('click', 'a.borrar_task', socket, function(e) {
		
		e.preventDefault();
		
		console.log(jQuery(this).closest('li').find('span.texto_task').text());
		
		socket.emit('borrar tarea', { 
		
			nombre: jQuery('.user').val(),
			borrar_tarea: jQuery(this).closest('li').find('span.texto_task').text()
			
		});
		
		jQuery('input.user').remove();
		
	});
		
}

// Actualizar tarea

function editTask(socket) {
	
	jQuery(document).on('click', 'a.editar_task', socket, function(e) {
		
		e.preventDefault();
		
		jQuery('.tarea_seleccionada').val( jQuery(this).closest('li').find('span.texto_task').text() );	
		
		jQuery('.oldTask').val( jQuery(this).closest('li').find('span.texto_task').text() );
		
		jQuery('.actualizar_tarea').fadeIn(2000);
		
		
		jQuery('.actualizar_tarea_seleccionada').click(function(e) {
		
			e.preventDefault();
			
			socket.emit('editar tarea', { 
			
				nombre: jQuery('.user').val(),
				tarea: jQuery('input.oldTask').val(),
				editar_tarea: jQuery('input.tarea_seleccionada').val()
				
			});
		
			jQuery('.actualizar_tarea').fadeOut(2000);
			
			jQuery('input.tarea_seleccionada').val('');
			
		});
		
	});
		
}