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
	
	// Convertimos task inactivos
	
	inctiveTask(socket);
	
	socket.on('datos usuario', function (data) { 
		
		var usuario = data.user;
		
		if( typeof usuario !== 'undefined') {
		
			jQuery('.errors_msg').html('');		
				
			jQuery('.bienvenida h1').html('Bienvenido ' +  data.user.user );
			
			jQuery('.logInUsers').fadeOut(100);
			
			socket.emit('recuperamos tasks', { user: data.user.user });
			
		} else {
		
			jQuery('.errors_msg').html('<span class="error">Usuario o password incorrectos.</span>');
		
		}
		
	});
	
	// Mensajes 
	
	socket.on('enviamos msg', function (data) {
		
		jQuery('.errors_msg').html(data.msg);
		
	}); 
	
	// Recuperamos actividades
	
	socket.on('enviamos tasks', function (data) { 
	
		jQuery('.tasks ul').empty();
		
		console.log(data);
		
		for (var i = 0; i < data.tasks.length; i++) {
		
			if( data.tasks[i].state == 0 ) {
		   
			   jQuery('.tasks ul').append('<li><input type="checkbox" class="ckeckbox_active"/> <span class="texto_task">' + data.tasks[i].task + '</span> <div class="buttons"><a href="/" class="editar_task"><i class="icon icon-pencil"></i> Editar</a> <a href="/" class="borrar_task"><i class="icon icon-remove"></i> Borrar</a></div></li>');
			   
			} else if(data.tasks[i].state == 1) {
				
			   jQuery('.tasks ul').append('<li><input type="checkbox" class="ckeckbox_active" checked/> <span class="texto_task estado_tarea">' + data.tasks[i].task + '</span> <div class="buttons"><a href="/" class="editar_task"><i class="icon icon-pencil"></i> Editar</a> <a href="/" class="borrar_task"><i class="icon icon-remove"></i> Borrar</a></div></li>');				
				
			}
			   
		   
		} 
		
		// Añadimos usuario a los form de edicion
		
		var task = data.tasks[0];
		
		if( typeof task !== 'undefined') {
		
			jQuery('.tasks > a').animate({
				opacity: 1
			}, 1000);
		
			jQuery('.nueva_tarea a').before('<input type="hidden" class="user" value="' + data.tasks[0].user + '" />');
			
		}
		
	});
	
});

// Nos logueamos

function LogIn(socket) {
	
	jQuery('.enviarLogin').click(function(event) {
		
		event.preventDefault();
		
		if( jQuery('.user').val() == '' || jQuery('.passwd').val() == '' ) {
			
			jQuery('.errors_msg').html('<span class="error">Alguno de los campos están vacíos</span>');
			
		} else {
			
			jQuery('div.tasks').css('position', 'relative');
			
			socket.emit('sesion login', { 
			
				nombre: jQuery('.user').val(),
				passwd: jQuery('.passwd').val()
				
			});
			
			jQuery('.nueva_tarea').css('display', 'block');
			
		}
		
	});
}

// Creamos una nueva tarea

function crearTask(socket) {
	
	jQuery('.tasks a').click(function(e) {
	
		e.preventDefault();
		
		console.log('Hemos hecho click');
		
	});
	
	jQuery('input.nueva_tarea').keypress(function(e) {
	
    	if(e.which == 13) {
	
			e.preventDefault();
			
			if(jQuery('input.nueva_tarea').val() != '') {
				
				socket.emit('nueva tarea', { 
				
					nombre: jQuery('.user').val(),
					nueva_tarea: jQuery('input.nueva_tarea').val()
					
				});
				
				jQuery('input.nueva_tarea').attr('placeholder', 'Escribe una tarea y presiona enter ...');
				
				jQuery('input.nueva_tarea').css('border', '2px solid #FF7954');
				
				jQuery('input.nueva_tarea').val('');
				
			} else {
				
				jQuery('input.nueva_tarea').attr('placeholder', 'Debes escribir una tarea para continuar ...');
				
				jQuery('input.nueva_tarea').css('border', '2px solid #C44A37');
				
			}
			
		}
			
	});			
	
}

// Delete una tarea

function deleteTask(socket) {
	
	jQuery(document).on('click', 'a.borrar_task', socket, function(e) {
		
		e.preventDefault();
		
		console.log('Tarea a borrar' + jQuery(this).closest('li').find('span.texto_task').text());
		console.log('Usuario de tarea a borrar: ' + jQuery('.user').val());
		
		socket.emit('borrar tarea', { 
		
			nombre: jQuery('.user').val(),
			borrar_tarea: jQuery(this).closest('li').find('span.texto_task').text()
			
		});
		
	});
		
}

// Actualizar tarea

function editTask(socket) {
	
	jQuery(document).on('click', 'a.editar_task', socket, function(e) {
		
		e.preventDefault();
		
		jQuery('.tarea_seleccionada').val( jQuery(this).closest('li').find('span.texto_task').text() );	
		
		jQuery('.oldTask').val( jQuery(this).closest('li').find('span.texto_task').text() );
		
		jQuery('.actualizar_tarea').fadeIn(1000);
		
		
		jQuery('.actualizar_tarea_seleccionada').click(function(e) {
		
			e.preventDefault();
			
			socket.emit('editar tarea', { 
			
				nombre: jQuery('.user').val(),
				tarea: jQuery('input.oldTask').val(),
				editar_tarea: jQuery('input.tarea_seleccionada').val()
				
			});
		
			jQuery('.actualizar_tarea').fadeOut(1000);
			
			jQuery('input.tarea_seleccionada').val('');
			
		});
		
	});
		
}

// Seleccionamos items activos

// Seleccionamos items incactivos

function inctiveTask(socket) {
	
	jQuery(document).on('change', 'input.ckeckbox_active', function() {
		
		if  (jQuery(this).is(':checked') ) {
		
			jQuery(this).attr('checked', true);
		
			console.log('Active');
			
			jQuery(this).next('.texto_task').addClass('estado_tarea');						
			
			// Envíamos petición al servidor para pasar a inactivo
			
			socket.emit('cambiamos estado', { 
			
				nombre: jQuery('.user').val(),
				tarea_seleccionada: jQuery(this).next('.texto_task').text(),
				estado: 1
				
			});
			
		} else {
		
			jQuery(this).attr('checked', false);
		
			console.log('Inactive');
			
			jQuery(this).next('.texto_task').removeClass('estado_tarea');			
			//jQuery(this).closest('li').find('.icon-checkmark').css('color', '#333');
			
			socket.emit('cambiamos estado', { 
			
				nombre: jQuery('.user').val(),
				tarea_seleccionada: jQuery(this).next('.texto_task').text(),
				estado: 0
				
			});
			
		}
		
		return false;
		
	});
	
}
