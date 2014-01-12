jQuery(document).ready(function() {

	var socket = io.connect();
		  
	socket.on('bienvenida', function (data) {
	
		jQuery('.bienvenida h1').html(data.Bienvenida);
	
		socket.emit('respuesta bienvenida', { respuesta: 'Un nuevo usuario se ha conectado' });
	
	});
	
	// Enviamos login al servidor
	
	LogIn(socket);
			
	socket.on('datos usuario', function (data) { 
		
		var usuario = data.user;
		
		if( typeof usuario !== 'undefined' ) {
		
			jQuery('.errors_msg').html('');		
				
			jQuery('.bienvenida h1').html('Bienvenido ' +  data.user.user );
			
		} else {
		
			jQuery('.errors_msg').html('Usuario o password incorrectos.');
		
		}
		
	});
	
});

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