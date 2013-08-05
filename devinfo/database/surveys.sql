-- phpMyAdmin SQL Dump
-- version 3.4.10.1deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 01, 2013 at 03:00 PM
-- Server version: 5.5.32
-- PHP Version: 5.3.10-1ubuntu3.7

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `enketo`
--

-- --------------------------------------------------------

--
-- Table structure for table `surveys`
--

CREATE TABLE IF NOT EXISTS `surveys` (
  `subdomain` varchar(12) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `server_url` varchar(100) NOT NULL,
  `form_id` varchar(100) NOT NULL,
  `submissions` int(11) NOT NULL DEFAULT '0',
  `offline` tinyint(1) NOT NULL,
  `submission_url` varchar(100) NOT NULL,
  `data_url` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `hash` varchar(40) NOT NULL,
  `media_hash` varchar(40) DEFAULT NULL,
  `transform_result_model` mediumtext NOT NULL,
  `transform_result_form` longtext NOT NULL,
  `transform_result_title` text NOT NULL,
  `xsl_version` int(11) NOT NULL,
  `launch_date` datetime NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`subdomain`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
