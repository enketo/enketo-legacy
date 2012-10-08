--
-- Table structure for table `instances`
--

CREATE TABLE `instances` (
    `instanceid` varchar(255) NOT NULL,
    `subdomain` varchar(100) NOT NULL,
    `return_url` varchar(255) NOT NULL,
    `instance_xml` mediumtext,
    UNIQUE KEY `idx_instanceid` (`instanceid`),
    KEY `idx_subdomain` (`subdomain`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
