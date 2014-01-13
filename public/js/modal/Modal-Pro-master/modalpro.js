/*
 * jQuery Modal Pro Plugin 1.0
 * https://github.com/danielariza1982
 *
 * Copyright 2013, Daniel Ariza
 * https://danielariza.com
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

(function($, undefined) {

	var opciones = {
		modal: this,
		modaLunch: '.modaLunch',
		overlayActive: true, // config true, false
		overlayZindex: 5555,
		overlayColor: 'rgba(0,0,0,0.6)',
		width: 400,
		height: 300,
		top: 50,
		left: 50,
		modalZindex: 9999,
		modalBackground: '#FFF',
		modalOverflow: 'auto',
		modalStyle: 'style_One',
		modalTitle: '',
		openInit: false, // true, false inicia la ventana al entrar en la página
		closeModalButton: '.agree_modal',
		textCloseButton: 'Cerrar',
		seundaryClassButton: '.customButton',
		secundaryCallbackButton: null, // Null or function(){}
		seundaryClassButton2: '.customButton2',
		secundaryCallbackButton2: null
	}

	jQuery.fn.modalPro = function (options) {
	  
		var config = jQuery.extend({}, opciones, options);
		
		var self = jQuery(this) || jQuery(config.modal),
			modaLunch = jQuery(config.modaLunch);
			
			
		function overlayFunction() 
		{
			var	addOverlay = jQuery('body').prepend("<div class='overlay'></div>"),
				overlay = jQuery('.overlay');
				
			overlay.css({
				'display': 'block',
				'backgroundColor': config.overlayColor,
				'position': 'fixed',
				'overflow': 'hidden',
				'width': '100%',
				'height': '100%',
				'z-index': config.overlayZindex,
				'top': '0px',
				'botton': '0px'
			});
		}
		
		// Calculamos el ancho de la pantalla para adaptar la pantalla al 50%
		function positionLeft() {
		
			var widthWindow = jQuery(window).width();
				
			var widthModal = config.width / 2,
				totalWidth = widthWindow,
				positionLeft = config.left;
			
			var positionTotal = totalWidth * positionLeft / 100 - widthModal;
			
			return positionTotal + 'px';
			
		}
		
		function positionTop() {
		
			var heightWindow = jQuery(window).height();
				
			var heightModal = config.height / 2,
				totalHeight = heightWindow,
				positionTop = config.top;
				
			var positionTotalHeight = totalHeight * positionTop / 100 - heightModal;
			
			return positionTotalHeight + 'px';	
			
		}
		
		self.css({
			'display': 'none',
			'position': 'fixed',
			'width': config.width,
			'height': config.height,
			'top': positionTop(),
			'left': positionLeft(),
			'z-index': config.modalZindex,
			'backgroundColor': config.modalBackground,
			'overflow': config.modalOverflow
		});
		
		// Añadimos clase para nuestros estilos personalizados de css
		
		self.addClass('custom_modal' + config.modalStyle);
		
		// Añadimos un título
		
		if( !config.modalTitle == '' ) {
			
			self.prepend('<h2 class="title">' + config.modalTitle + '</h2>');
			
		}
		
		// Añadimos la x a la ventana modal
		
		self.prepend("<a href='#' class='close_modal'>" + config.textCloseButton + "</a>");
		jQuery('.close_modal').css({
			'float': 'right'
		});
		
		// Hacemos click y ejecutamos la ventana modal
		
		modaLunch.click(function(){
			
			if(config.overlayActive == true) {
				overlayFunction();	
			} 
			self.css("display", "block");
			
		});
		
		// función cerrar la ventana modal
		
		function closeModalWindow() {
			self.css('display', 'none');
			if(config.overlayActive == true) {
		    	jQuery('div').remove('.overlay');
		    }
		}
		
		// Cerramos la ventana y borramos el overlay
		
		jQuery( document ).on( 'keydown', function ( e ) {
		    if ( e.keyCode === 27 ) { // ESC
		        closeModalWindow();
		    }
		});
		
		jQuery('.close_modal').on('click', function(event) {
			event.preventDefault();
			closeModalWindow();
		});
		
		// Añadimos la posibilidad de cerrar con un botón
		
		jQuery(config.closeModalButton).on('click', function(event) {
			event.preventDefault();
			closeModalWindow();
		});
		
		// Añadir custom function para un botón
		
		function secundaryButton() {

			if ( jQuery.isFunction( config.secundaryCallbackButton ) ) {
		        config.secundaryCallbackButton.call( this );
			}
			
		}
		
		jQuery(config.seundaryClassButton).on('click', function(event, self) {
			
			event.preventDefault();
			secundaryButton();
			closeModalWindow();
			
		});
		
		// Añadir custom function para un botón número 2
		
		function secundaryButton2() {

			if ( jQuery.isFunction( config.secundaryCallbackButton2 ) ) {
		        config.secundaryCallbackButton2.call( this );
		    }
			
		}
		
		jQuery(config.seundaryClassButton2).on('click', function(event, self) {
			
			event.preventDefault();
			secundaryButton2();
			closeModalWindow();
			
		});
		
		// Inicializamos la ventana modal si procede
		
		if( config.openInit == true ) {
			modaLunch.trigger( "click" );
		}
	};
	
}(jQuery));
