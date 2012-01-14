-- phpMyAdmin SQL Dump
-- version 3.3.8.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 14, 2012 at 06:04 PM
-- Server version: 5.5.16
-- PHP Version: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Table structure for table `putin_users`
--

CREATE TABLE IF NOT EXISTS `putin_users` (
  `nickname` varchar(32) NOT NULL,
  `reg_date` date NOT NULL,
  `score` int(99) NOT NULL,
  `title` varchar(30) NOT NULL,
  `color` varchar(7) NOT NULL,
  `status` int(16) NOT NULL,
  `level` int(5) NOT NULL,
  KEY `i_nickname` (`nickname`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
