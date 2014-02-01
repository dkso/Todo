-- phpMyAdmin SQL Dump
-- version 4.0.9
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 01-02-2014 a las 22:20:09
-- Versión del servidor: 5.6.11
-- Versión de PHP: 5.4.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `todo`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `todoApp_tasks`
--

CREATE TABLE IF NOT EXISTS `todoApp_tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task` varchar(100) DEFAULT NULL,
  `user` varchar(100) DEFAULT NULL,
  `state` int(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=94 ;

--
-- Volcado de datos para la tabla `todoApp_tasks`
--

INSERT INTO `todoApp_tasks` (`id`, `task`, `user`, `state`) VALUES
(43, 'Estudiar Node.JS', 'Todo', 1),
(44, 'Estudiar jQuery & JavaScript', 'Todo', 0),
(45, 'Estudiar PPOO', 'Todo', 0),
(48, 'Esto es una prueba', NULL, 0),
(53, 'Prueba 2', NULL, 0),
(93, 'Estudiar Backbone', 'Todo', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `todoApp_usuarios`
--

CREATE TABLE IF NOT EXISTS `todoApp_usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(20) DEFAULT NULL,
  `passwd` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Volcado de datos para la tabla `todoApp_usuarios`
--

INSERT INTO `todoApp_usuarios` (`id`, `user`, `passwd`) VALUES
(1, 'Todo', 'fe01ce2a7fbac8fafaed7c982a04e229');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
