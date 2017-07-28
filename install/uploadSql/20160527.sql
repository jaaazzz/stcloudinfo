--
-- 表的结构 `ecs_article_cat`
--

DROP TABLE IF EXISTS `ecs_article_cat`;
CREATE TABLE `ecs_article_cat` (
  `cat_id` smallint(5) NOT NULL AUTO_INCREMENT,
  `cat_name` varchar(255) NOT NULL DEFAULT '',
  `cat_type` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `keywords` varchar(255) NOT NULL DEFAULT '',
  `cat_desc` varchar(255) NOT NULL DEFAULT '',
  `sort_order` tinyint(3) unsigned NOT NULL DEFAULT '50',
  `show_in_nav` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `parent_id` smallint(5) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`cat_id`),
  KEY `cat_type` (`cat_type`),
  KEY `sort_order` (`sort_order`),
  KEY `parent_id` (`parent_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_article`
--

DROP TABLE IF EXISTS `ecs_article`;
CREATE TABLE `ecs_article` (
  `article_id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `cat_id` smallint(5) NOT NULL DEFAULT '0',
  `title` varchar(150) NOT NULL DEFAULT '',
  `content` longtext NOT NULL,
  `author` varchar(30) NOT NULL DEFAULT '',
  `author_email` varchar(60) NOT NULL DEFAULT '',
  `keywords` varchar(255) NOT NULL DEFAULT '',
  `article_type` tinyint(1) unsigned NOT NULL DEFAULT '2',
  `is_open` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `add_time` int(10) unsigned NOT NULL DEFAULT '0',
  `file_url` varchar(255) NOT NULL DEFAULT '',
  `open_type` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `link` varchar(255) NOT NULL DEFAULT '',
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`article_id`),
  KEY `cat_id` (`cat_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;

--
-- `ecs_article_cat`
--

INSERT INTO `ecs_article_cat` (`cat_id`, `cat_name`, `cat_type`, `keywords`, `cat_desc`, `sort_order`, `show_in_nav`, `parent_id`) VALUES
(1, '帮助中心', 1, '', '', 50, 0, 0),
(2, '应用平台组成', 1, '', '', 50, 1, 1),
(3, '部署应用流程', 1, '', '', 50, 1, 1);

--
-- `ecs_article`
--

INSERT INTO `ecs_article` (`article_id`, `cat_id`, `title`, `content`, `author`, `author_email`, `keywords`, `article_type`, `is_open`, `add_time`, `file_url`, `open_type`, `link`, `description`) VALUES
(1, 2, '应用平台组成', '<ul>\r\n  <li>\r\n  <h1><a id="行业云应用平台前台组成" name="行业云应用平台前台组成">行业云应用平台前台组成</a></h1>\r\n </li>\r\n</ul>\r\n\r\n<hr />\r\n<p>&nbsp;&nbsp;前台主要由3个部分组成：应用园地、软件中心和管理中心。<br />\r\n&nbsp;（1）&nbsp;&nbsp; &nbsp;应用园地展示所有发布并上架的在线应用，用户可直接在线使用应用<br />\r\n&nbsp;（2）&nbsp;&nbsp; &nbsp;软件中心展示软件产品，用户可通过点数购买软件后选择部署到云主机使用或迁移到本地安装使用<br />\r\n&nbsp;（3）&nbsp;&nbsp; &nbsp;管理中心由6个部分组成：我的应用、云主机、我的收藏、已购软件、我的订单和个人信息组成，可帮助用户管理应用、云主机、购买信息及个人信息等</p>\r\n\r\n<p>&nbsp;</p>\r\n', '', '', '', 0, 1, 1464308419, '', 0, '', NULL),
(2, 3, '部署应用流程', '<ul>\n  <li>\n  <h1><a id="云交易中心简介" name="云交易中心简介">软件部署在线应用的流程</a></h1>\n </li>\n</ul>\n\n<hr />\n<p>&nbsp; &nbsp;主要流程如下:</p>\n\n<p><img alt="" src="includes/ckfinder/userfiles/images/flow.png" style="height:52px; width:462px" /></p>\n\n<p>（1）&nbsp;&nbsp; &nbsp;在软件中心中选择软件进入软件详情页面，使用点数购买软件</p>\n\n<p><img alt="" src="includes/ckfinder/userfiles/images/flow1.png" style="height:304px; width:633px" /></p>\n\n<p>（2）&nbsp;&nbsp; &nbsp;购买完成后选择【部署到云主机】，并设置部署信息，选择【开始部署】后应用开始自动部署</p>\n\n<p><img alt="" src="includes/ckfinder/userfiles/images/flow2.png" style="height:973px; width:1141px" /></p>\n\n<p>（3）&nbsp;&nbsp; &nbsp;部署的应用在管理中心选择上架即可展示在应用园地中</p>\n\n<p><img alt="" src="includes/ckfinder/userfiles/images/flow3.png" style="height:378px; width:1048px" /></p>\n', '', '', '', 0, 1, 1464309125, '', 0, '', NULL);
