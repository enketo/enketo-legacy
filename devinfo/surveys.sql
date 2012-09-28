-- phpMyAdmin SQL Dump
-- version 3.3.2deb1ubuntu1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 28, 2012 at 10:57 AM
-- Server version: 5.1.63
-- PHP Version: 5.3.2-1ubuntu4.17

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `aidwebso_enketo`
--

-- --------------------------------------------------------

--
-- Table structure for table `surveys`
--

CREATE TABLE IF NOT EXISTS `surveys` (
  `subdomain` varchar(12) NOT NULL,
  `server_url` varchar(100) NOT NULL,
  `form_id` varchar(100) NOT NULL,
  `offline` tinyint(1) NOT NULL,
  `submission_url` varchar(100) NOT NULL,
  `data_url` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `launch_date` datetime NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`subdomain`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
