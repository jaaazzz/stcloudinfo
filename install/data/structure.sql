--
-- 表的结构 `ecs_account_ex`
--

DROP TABLE IF EXISTS `ecs_account_ex`;
CREATE TABLE IF NOT EXISTS `ecs_account_ex` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `order_sn` varchar(30) NOT NULL,
  `price_ratio` float NOT NULL DEFAULT '1',
  `minnum` int(11) NOT NULL,
  `scale_type` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `order_sn` (`order_sn`),
  KEY `scale_type` (`scale_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_account_statement`
--

DROP TABLE IF EXISTS `ecs_account_statement`;
CREATE TABLE IF NOT EXISTS `ecs_account_statement` (
  `account_statement_id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` mediumint(8) unsigned NOT NULL,
  `order_id` mediumint(8) unsigned NOT NULL,
  `price` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
  `order_status` tinyint(1) NOT NULL,
  `order_type` int(2) NOT NULL,
  `create_time` int(10) unsigned NOT NULL,
  `order_sn` varchar(20) NOT NULL,
  `is_trial` tinyint(1) NOT NULL,
  `is_exchange` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `pay_id` smallint(2) NOT NULL,
  `pay_name` varchar(50) NOT NULL,
  `pay_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '支付完成时间',
  `pay_account` varchar(100) DEFAULT NULL COMMENT '支付账户',
  `goods_name` varchar(120) NOT NULL,
  `goods_id` mediumint(8) unsigned NOT NULL,
  `as_group_id` int(8) DEFAULT NULL,
  `order_count` int(8) DEFAULT NULL,
  `group_id` int(5) unsigned NOT NULL COMMENT '功能组id',
  `version_no` int(11) NOT NULL DEFAULT '1' COMMENT '版本标识  1：正式版   -2：预发行版  -1：测试版',
  `integrate_workbench_id` int(11) NOT NULL DEFAULT '0',
  `verify_msg` text NOT NULL,
  PRIMARY KEY (`account_statement_id`),
  UNIQUE KEY `order_sn` (`order_sn`),
  KEY `user_id` (`user_id`),
  KEY `order_id` (`order_id`),
  KEY `goods_id` (`goods_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_admin_log`
--

DROP TABLE IF EXISTS `ecs_admin_log`;
CREATE TABLE IF NOT EXISTS `ecs_admin_log` (
  `log_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `log_time` int(10) unsigned NOT NULL DEFAULT '0',
  `user_id` smallint(5) unsigned NOT NULL,
  `log_module` text NOT NULL COMMENT '操作模块',
  `log_info` text NOT NULL,
  `ip_address` varchar(15) NOT NULL DEFAULT '',
  PRIMARY KEY (`log_id`),
  KEY `log_time` (`log_time`),
  KEY `log_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_admin_message`
--

DROP TABLE IF EXISTS `ecs_admin_message`;
CREATE TABLE IF NOT EXISTS `ecs_admin_message` (
  `message_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `sender_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `receiver_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `sent_time` int(11) unsigned NOT NULL DEFAULT '0',
  `read_time` int(11) unsigned NOT NULL DEFAULT '0',
  `readed` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `deleted` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `title` varchar(150) NOT NULL DEFAULT '',
  `message` text NOT NULL,
  PRIMARY KEY (`message_id`),
  KEY `sender_id` (`sender_id`,`receiver_id`),
  KEY `receiver_id` (`receiver_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_admin_user`
--

DROP TABLE IF EXISTS `ecs_admin_user`;
CREATE TABLE IF NOT EXISTS `ecs_admin_user` (
  `user_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `user_name` varchar(60) NOT NULL DEFAULT '',
  `email` varchar(60) NOT NULL DEFAULT '',
  `password` varchar(32) NOT NULL DEFAULT '',
  `role_list` varchar(512) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '管理员权限列表',
  `is_super` int(1) NOT NULL DEFAULT '0' COMMENT '0:普通,1:超级',
  `remark` varchar(256) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `ec_salt` varchar(10) DEFAULT NULL,
  `add_time` int(11) NOT NULL DEFAULT '0',
  `last_login` int(11) NOT NULL DEFAULT '0',
  `last_ip` varchar(15) NOT NULL DEFAULT '',
  `action_list` text NOT NULL,
  `nav_list` text NOT NULL,
  `lang_type` varchar(50) NOT NULL DEFAULT '',
  `agency_id` smallint(5) unsigned NOT NULL,
  `suppliers_id` smallint(5) unsigned DEFAULT '0',
  `todolist` longtext,
  `role_id` smallint(5) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `user_name` (`user_name`),
  KEY `agency_id` (`agency_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_application`
--

DROP TABLE IF EXISTS `ecs_application`;
CREATE TABLE IF NOT EXISTS `ecs_application` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_name` varchar(255) NOT NULL COMMENT '应用名称',
  `app_type` varchar(255) NOT NULL COMMENT '应用类型1.内部应用　2.外部应用',
  `app_no` varchar(100) NOT NULL COMMENT '应用编号',
  `host_id` int(11) NOT NULL COMMENT '云主机id',
  `user_id` mediumint(11) unsigned NOT NULL COMMENT '创建应用的当前用户ID',
  `category` varchar(100) NOT NULL COMMENT '所属类别ID',
  `app_description` text COMMENT '应用描述',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `logo_image` varchar(255) NOT NULL COMMENT 'logo图片',
  `status` tinyint(4) NOT NULL COMMENT '应用状态，1包括未提交，2正在部署，3已发布，4发布失败',
  `order_sn` mediumint(8) unsigned NOT NULL COMMENT '订单编号',
  `app_url` varchar(255) NOT NULL COMMENT '应用地址',
  `hidden` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除0未删除1已删除',
  `file_list` text COMMENT '附件',
  `is_on_sale` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否上架0未上架1已上架',
  `is_public` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否公开0否1是',
  `is_show_index` int(1) NOT NULL DEFAULT '0' COMMENT '是否在首页显示,0:否,1:是',
  `show_order` int(12) NOT NULL DEFAULT '0' COMMENT '显示顺序',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='我的应用' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_app_category`
--

DROP TABLE IF EXISTS `ecs_app_category`;
CREATE TABLE IF NOT EXISTS `ecs_app_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL COMMENT '分类名称',
  `app_order` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
  `add_userid` smallint(5) unsigned NOT NULL COMMENT '添加用户id',
  `add_time` int(11) NOT NULL COMMENT '添加时间',
  `is_delete` int(11) NOT NULL DEFAULT '0' COMMENT '删除标志',
  PRIMARY KEY (`id`),
  KEY `cat_user` (`add_userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='分类表' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_app_host`
--

DROP TABLE IF EXISTS `ecs_app_host`;
CREATE TABLE IF NOT EXISTS `ecs_app_host` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` mediumint(8) unsigned NOT NULL COMMENT '创建应用的当前用户ID',
  `name` varchar(255) NOT NULL COMMENT '主机名用户起得',
  `status` tinyint(4) NOT NULL COMMENT '云主机状态，1正在创建，2创建失败，3正在运行，4已关闭',
  `cpu_core_num` tinyint(4) NOT NULL COMMENT 'cpu核心个数',
  `memory_size` int(11) NOT NULL COMMENT '内存大小(单位G)',
  `hdd_volume` int(11) NOT NULL COMMENT '硬盘大小',
  `operation_system` varchar(100) NOT NULL COMMENT '操作系统名称',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `host_ip` varchar(100) NOT NULL,
  `host_user` varchar(100) NOT NULL,
  `host_password` varchar(100) NOT NULL,
  `host_type` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1为自建云，2为阿里云',
  `host_name` varchar(255) NOT NULL COMMENT '主机名称',
  `host_server_id` varchar(255) NOT NULL,
  `hidden` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除0未删除1已删除',
  `openstack_image_id` varchar(500) NOT NULL,
  `flavorid` varchar(500) NOT NULL,
  `verify_msg` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_app_power`
--

DROP TABLE IF EXISTS `ecs_app_power`;
CREATE TABLE IF NOT EXISTS `ecs_app_power` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_id` int(11) NOT NULL COMMENT '应用id',
  `user_id` mediumint(11) unsigned NOT NULL COMMENT '用户id',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `hidden` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除0未删除1已删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_article`
--

DROP TABLE IF EXISTS `ecs_article`;
CREATE TABLE IF NOT EXISTS `ecs_article` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_article_cat`
--

DROP TABLE IF EXISTS `ecs_article_cat`;
CREATE TABLE IF NOT EXISTS `ecs_article_cat` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_base_plugin`
--

DROP TABLE IF EXISTS `ecs_base_plugin`;
CREATE TABLE IF NOT EXISTS `ecs_base_plugin` (
  `bp_id` int(11) NOT NULL AUTO_INCREMENT,
  `top_cat_id` int(11) DEFAULT NULL,
  `p_id` mediumint(8) unsigned DEFAULT NULL,
  `is_basic` int(1) DEFAULT '0',
  `exclude` int(1) DEFAULT '0',
  `memo` varchar(45) CHARACTER SET latin1 DEFAULT NULL,
  `sort` int(3) DEFAULT '0',
  `specifics` varchar(45) CHARACTER SET latin1 DEFAULT NULL,
  PRIMARY KEY (`bp_id`),
  KEY `bp_goods_id` (`p_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='必选插件的存储表' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_base_price_ex`
--

DROP TABLE IF EXISTS `ecs_base_price_ex`;
CREATE TABLE IF NOT EXISTS `ecs_base_price_ex` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `price_ratio` float NOT NULL DEFAULT '1',
  `price_group_id` int(11) NOT NULL,
  `scale_name` varchar(50) NOT NULL,
  `scale_type` int(11) NOT NULL,
  `minnum` int(11) NOT NULL,
  `concurrent_user` int(11) NOT NULL DEFAULT '1',
  `online_user` int(11) NOT NULL DEFAULT '1',
  `register_user` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `price_group_id` (`price_group_id`),
  KEY `scale_type` (`scale_type`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=76 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_base_price_group`
--

DROP TABLE IF EXISTS `ecs_base_price_group`;
CREATE TABLE IF NOT EXISTS `ecs_base_price_group` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `group_name` varchar(50) NOT NULL,
  `price` float NOT NULL,
  `price_ratio` float NOT NULL DEFAULT '1',
  `code` varchar(100) DEFAULT NULL,
  `fun_desc` text,
  `explanation` text,
  `type` varchar(10) NOT NULL,
  `function` int(32) NOT NULL,
  `created_at` int(11) NOT NULL,
  `updated_at` int(11) NOT NULL,
  `minimum` int(11) NOT NULL DEFAULT '1',
  `group_order` int(11) NOT NULL,
  `is_delete` tinyint(1) NOT NULL DEFAULT '0',
  `main_function` varchar(50) NOT NULL,
  `sub_functions` varchar(512) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=16 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_cart`
--

DROP TABLE IF EXISTS `ecs_cart`;
CREATE TABLE IF NOT EXISTS `ecs_cart` (
  `rec_id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `session_id` char(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `goods_id` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `goods_sn` varchar(60) NOT NULL DEFAULT '',
  `product_id` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `goods_name` varchar(120) NOT NULL DEFAULT '',
  `market_price` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
  `goods_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `goods_number` smallint(5) unsigned NOT NULL DEFAULT '0',
  `goods_attr` text NOT NULL,
  `is_real` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `extension_code` varchar(30) NOT NULL DEFAULT '',
  `parent_id` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `rec_type` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `is_gift` smallint(5) unsigned NOT NULL DEFAULT '0',
  `is_shipping` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `can_handsel` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `goods_attr_id` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`rec_id`),
  KEY `session_id` (`session_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_category`
--

DROP TABLE IF EXISTS `ecs_category`;
CREATE TABLE IF NOT EXISTS `ecs_category` (
  `cat_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `cat_name` varchar(90) NOT NULL DEFAULT '',
  `keywords` varchar(255) NOT NULL DEFAULT '',
  `cat_desc` varchar(255) NOT NULL DEFAULT '',
  `parent_id` smallint(5) unsigned NOT NULL DEFAULT '0',
  `sort_order` tinyint(1) unsigned NOT NULL DEFAULT '50',
  `template_file` varchar(50) NOT NULL DEFAULT '',
  `measure_unit` varchar(15) NOT NULL DEFAULT '',
  `show_in_nav` tinyint(1) NOT NULL DEFAULT '0',
  `style` varchar(150) NOT NULL,
  `is_show` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `grade` tinyint(4) NOT NULL DEFAULT '0',
  `filter_attr` varchar(255) NOT NULL DEFAULT '0',
  PRIMARY KEY (`cat_id`),
  KEY `parent_id` (`parent_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=146 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_collection`
--

DROP TABLE IF EXISTS `ecs_collection`;
CREATE TABLE IF NOT EXISTS `ecs_collection` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `obj_type` varchar(20) DEFAULT NULL COMMENT '收藏类型(app:应用soft:软件)',
  `obj_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '收藏对象编号',
  `user_id` mediumint(8) unsigned NOT NULL DEFAULT '0' COMMENT '收藏用户id',
  `on_time` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '收藏时间',
  PRIMARY KEY (`id`),
  KEY `col_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='收藏表' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_comment`
--

DROP TABLE IF EXISTS `ecs_comment`;
CREATE TABLE IF NOT EXISTS `ecs_comment` (
  `comment_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `comment_type` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `id_value` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `email` varchar(60) NOT NULL DEFAULT '',
  `user_name` varchar(60) NOT NULL DEFAULT '',
  `content` text NOT NULL,
  `comment_rank` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `add_time` int(10) unsigned NOT NULL DEFAULT '0',
  `ip_address` varchar(15) NOT NULL DEFAULT '',
  `status` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `parent_id` int(10) unsigned NOT NULL DEFAULT '0',
  `user_id` int(10) unsigned NOT NULL DEFAULT '0',
  `goods_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`comment_id`),
  KEY `parent_id` (`parent_id`),
  KEY `id_value` (`id_value`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=63 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_goods`
--

DROP TABLE IF EXISTS `ecs_goods`;
CREATE TABLE IF NOT EXISTS `ecs_goods` (
  `goods_id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `cat_id` smallint(5) unsigned NOT NULL DEFAULT '0',
  `goods_sn` varchar(60) NOT NULL DEFAULT '',
  `goods_name` varchar(120) NOT NULL DEFAULT '',
  `goods_name_style` varchar(60) NOT NULL DEFAULT '+',
  `click_count` int(10) unsigned NOT NULL DEFAULT '0',
  `brand_id` smallint(5) unsigned NOT NULL DEFAULT '0',
  `provider_name` varchar(100) NOT NULL DEFAULT '',
  `goods_number` smallint(5) unsigned NOT NULL DEFAULT '0',
  `goods_weight` decimal(10,3) unsigned NOT NULL DEFAULT '0.000',
  `market_price` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
  `shop_price` int(5) unsigned NOT NULL DEFAULT '0',
  `shop_price_bak` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
  `promote_price` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
  `promote_start_date` int(11) unsigned NOT NULL DEFAULT '0',
  `promote_end_date` int(11) unsigned NOT NULL DEFAULT '0',
  `warn_number` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `keywords` varchar(255) NOT NULL DEFAULT '',
  `goods_brief` varchar(255) NOT NULL DEFAULT '',
  `goods_desc` text NOT NULL,
  `goods_thumb` varchar(255) NOT NULL DEFAULT '',
  `goods_img` varchar(255) NOT NULL DEFAULT '',
  `original_img` varchar(255) NOT NULL DEFAULT '',
  `is_real` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `extension_code` varchar(30) NOT NULL DEFAULT '',
  `is_on_sale` tinyint(1) NOT NULL DEFAULT '1',
  `is_alone_sale` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `is_shipping` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `integral` int(10) unsigned NOT NULL DEFAULT '0',
  `add_time` int(10) unsigned NOT NULL DEFAULT '0',
  `sort_order` smallint(4) unsigned NOT NULL DEFAULT '100',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `is_best` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `is_new` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `is_hot` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `is_promote` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `bonus_type_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `last_update` int(10) unsigned NOT NULL DEFAULT '0',
  `goods_type` smallint(5) unsigned NOT NULL DEFAULT '0',
  `seller_note` varchar(255) NOT NULL DEFAULT '',
  `give_integral` int(11) NOT NULL DEFAULT '-1',
  `rank_integral` int(11) NOT NULL DEFAULT '-1',
  `suppliers_id` smallint(5) unsigned DEFAULT NULL,
  `is_check` tinyint(1) unsigned DEFAULT NULL,
  `upload_file_guid` varchar(500) NOT NULL,
  `weight_id` varchar(50) NOT NULL,
  `grade` float(3,2) NOT NULL DEFAULT '0.00',
  `file_name` varchar(256) NOT NULL,
  `file_size` int(10) DEFAULT NULL,
  `md5` varchar(64) DEFAULT NULL,
  `envs` varchar(64) DEFAULT NULL,
  `lang` varchar(64) DEFAULT NULL,
  `version` varchar(45) DEFAULT NULL,
  `notes` varchar(600) DEFAULT NULL,
  `file_info` varchar(500) DEFAULT NULL,
  `file_guid` varchar(64) DEFAULT NULL,
  `store_file_name` varchar(245) DEFAULT NULL,
  `developer_id` int(10) DEFAULT NULL,
  `is_official` int(1) DEFAULT '0',
  `goods_trial_period` int(11) DEFAULT NULL,
  `is_has_beta` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否有预发行版',
  `is_has_formal` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否有正式版本',
  `workbench_id` int(5) unsigned NOT NULL DEFAULT '0' COMMENT '工作室id',
  --`is_show_index` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否首页显示',
  PRIMARY KEY (`goods_id`),
  KEY `goods_sn` (`goods_sn`),
  KEY `cat_id` (`cat_id`),
  KEY `last_update` (`last_update`),
  KEY `brand_id` (`brand_id`),
  KEY `goods_weight` (`goods_weight`),
  KEY `promote_end_date` (`promote_end_date`),
  KEY `promote_start_date` (`promote_start_date`),
  KEY `goods_number` (`goods_number`),
  KEY `sort_order` (`sort_order`),
  KEY `weight_id` (`weight_id`),
  KEY `file_guid` (`file_guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_goods_base_price`
--

DROP TABLE IF EXISTS `ecs_goods_base_price`;
CREATE TABLE IF NOT EXISTS `ecs_goods_base_price` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `goods_id` int(10) unsigned NOT NULL,
  `price_group_id` int(10) unsigned NOT NULL,
  `price_ratio` float NOT NULL DEFAULT '1',
  `group_name` varchar(50) NOT NULL,
  `scale_type` int(10) unsigned NOT NULL,
  `is_delete` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `goods_id` (`goods_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_group_goods`
--

DROP TABLE IF EXISTS `ecs_group_goods`;
CREATE TABLE IF NOT EXISTS `ecs_group_goods` (
  `parent_id` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `goods_id` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `goods_price` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
  `admin_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `is_basic` decimal(3,0) NOT NULL DEFAULT '0',
  PRIMARY KEY (`parent_id`,`goods_id`,`admin_id`),
  KEY `parent_id` (`parent_id`),
  KEY `goods_id` (`goods_id`),
  KEY `admin_id` (`admin_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_member_price`
--

DROP TABLE IF EXISTS `ecs_member_price`;
CREATE TABLE IF NOT EXISTS `ecs_member_price` (
  `price_id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `goods_id` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `user_rank` tinyint(3) NOT NULL DEFAULT '0',
  `user_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`price_id`),
  KEY `goods_id` (`goods_id`,`user_rank`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_nav`
--

DROP TABLE IF EXISTS `ecs_nav`;
CREATE TABLE IF NOT EXISTS `ecs_nav` (
  `id` mediumint(8) NOT NULL AUTO_INCREMENT,
  `ctype` varchar(10) DEFAULT NULL,
  `cid` smallint(5) unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `ifshow` tinyint(1) NOT NULL,
  `vieworder` tinyint(1) NOT NULL,
  `opennew` tinyint(1) NOT NULL,
  `url` varchar(255) NOT NULL,
  `type` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `type` (`type`),
  KEY `ifshow` (`ifshow`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=19 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_order_goods`
--

DROP TABLE IF EXISTS `ecs_order_goods`;
CREATE TABLE IF NOT EXISTS `ecs_order_goods` (
  `rec_id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `goods_id` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `goods_name` varchar(120) NOT NULL DEFAULT '',
  `goods_sn` varchar(60) NOT NULL DEFAULT '',
  `product_id` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `goods_number` smallint(5) unsigned NOT NULL DEFAULT '1',
  `market_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `goods_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `goods_attr` text NOT NULL,
  `send_number` smallint(5) unsigned NOT NULL DEFAULT '0',
  `is_real` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `extension_code` varchar(30) NOT NULL DEFAULT '',
  `parent_id` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `is_gift` smallint(5) unsigned NOT NULL DEFAULT '0',
  `goods_attr_id` varchar(255) NOT NULL DEFAULT '',
  `start_time` int(10) unsigned NOT NULL,
  `end_time` int(10) unsigned NOT NULL,
  PRIMARY KEY (`rec_id`),
  KEY `order_id` (`order_id`),
  KEY `goods_id` (`goods_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_order_info`
--

DROP TABLE IF EXISTS `ecs_order_info`;
CREATE TABLE IF NOT EXISTS `ecs_order_info` (
  `order_id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `order_sn` varchar(20) NOT NULL DEFAULT '',
  `user_id` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `order_status` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `shipping_status` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `pay_status` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `consignee` varchar(60) NOT NULL DEFAULT '',
  `country` smallint(5) unsigned NOT NULL DEFAULT '0',
  `province` smallint(5) unsigned NOT NULL DEFAULT '0',
  `city` smallint(5) unsigned NOT NULL DEFAULT '0',
  `district` smallint(5) unsigned NOT NULL DEFAULT '0',
  `address` varchar(255) NOT NULL DEFAULT '',
  `zipcode` varchar(60) NOT NULL DEFAULT '',
  `tel` varchar(60) NOT NULL DEFAULT '',
  `mobile` varchar(60) NOT NULL DEFAULT '',
  `email` varchar(60) NOT NULL DEFAULT '',
  `best_time` varchar(120) NOT NULL DEFAULT '',
  `sign_building` varchar(120) NOT NULL DEFAULT '',
  `postscript` varchar(255) NOT NULL DEFAULT '',
  `shipping_id` tinyint(3) NOT NULL DEFAULT '0',
  `shipping_name` varchar(120) NOT NULL DEFAULT '',
  `pay_id` tinyint(3) NOT NULL DEFAULT '0',
  `pay_name` varchar(120) NOT NULL DEFAULT '',
  `how_oos` varchar(120) NOT NULL DEFAULT '',
  `how_surplus` varchar(120) NOT NULL DEFAULT '',
  `pack_name` varchar(120) NOT NULL DEFAULT '',
  `card_name` varchar(120) NOT NULL DEFAULT '',
  `card_message` varchar(255) NOT NULL DEFAULT '',
  `inv_payee` varchar(120) NOT NULL DEFAULT '',
  `inv_content` varchar(120) NOT NULL DEFAULT '',
  `goods_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `shipping_fee` decimal(10,2) NOT NULL DEFAULT '0.00',
  `insure_fee` decimal(10,2) NOT NULL DEFAULT '0.00',
  `pay_fee` decimal(10,2) NOT NULL DEFAULT '0.00',
  `pack_fee` decimal(10,2) NOT NULL DEFAULT '0.00',
  `card_fee` decimal(10,2) NOT NULL DEFAULT '0.00',
  `money_paid` decimal(10,2) NOT NULL DEFAULT '0.00',
  `surplus` decimal(10,2) NOT NULL DEFAULT '0.00',
  `integral` int(10) unsigned NOT NULL DEFAULT '0',
  `integral_money` decimal(10,2) NOT NULL DEFAULT '0.00',
  `bonus` decimal(10,2) NOT NULL DEFAULT '0.00',
  `order_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `from_ad` smallint(5) NOT NULL DEFAULT '0',
  `referer` varchar(255) NOT NULL DEFAULT '',
  `add_time` int(10) unsigned NOT NULL DEFAULT '0',
  `confirm_time` int(10) unsigned NOT NULL DEFAULT '0',
  `pay_time` int(10) unsigned NOT NULL DEFAULT '0',
  `shipping_time` int(10) unsigned NOT NULL DEFAULT '0',
  `pack_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `card_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `bonus_id` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `invoice_no` varchar(255) NOT NULL DEFAULT '',
  `extension_code` varchar(30) NOT NULL DEFAULT '',
  `extension_id` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `to_buyer` varchar(255) NOT NULL DEFAULT '',
  `pay_note` varchar(255) NOT NULL DEFAULT '',
  `agency_id` smallint(5) unsigned NOT NULL,
  `inv_type` varchar(60) NOT NULL,
  `tax` decimal(10,2) NOT NULL,
  `is_separate` tinyint(1) NOT NULL DEFAULT '0',
  `parent_id` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `discount` decimal(10,2) NOT NULL,
  `last_gen_file_time` int(10) unsigned NOT NULL,
  `download_file_name` varchar(100) NOT NULL,
  `serial_no` varchar(10000) NOT NULL,
  `last_modify_time` int(10) unsigned NOT NULL,
  `start_time` int(10) unsigned NOT NULL,
  `end_time` int(10) unsigned NOT NULL,
  `is_trial` smallint(5) unsigned NOT NULL,
  `is_delete` tinyint(1) NOT NULL DEFAULT '0',
  `is_exchange` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `order_count` int(8) unsigned NOT NULL,
  `group_serial_no` varchar(100) NOT NULL,
  `group_id` int(5) unsigned NOT NULL DEFAULT '0' COMMENT '功能组id',
  `version_no` int(11) NOT NULL DEFAULT '1' COMMENT '版本标识 1：正式版 -2：预发行版 -1：测试版',
  `integrate_workbench_id` int(11) NOT NULL DEFAULT '0',
  `is_yj` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否被移交过得订单',
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `order_sn` (`order_sn`),
  KEY `user_id` (`user_id`),
  KEY `order_status` (`order_status`),
  KEY `shipping_status` (`shipping_status`),
  KEY `pay_status` (`pay_status`),
  KEY `shipping_id` (`shipping_id`),
  KEY `pay_id` (`pay_id`),
  KEY `extension_code` (`extension_code`,`extension_id`),
  KEY `agency_id` (`agency_id`),
  KEY `parent_id` (`parent_id`),
  KEY `is_exchange` (`is_exchange`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_payment`
--

DROP TABLE IF EXISTS `ecs_payment`;
CREATE TABLE IF NOT EXISTS `ecs_payment` (
  `pay_id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `pay_code` varchar(20) NOT NULL DEFAULT '',
  `pay_name` varchar(120) NOT NULL DEFAULT '',
  `pay_fee` varchar(10) NOT NULL DEFAULT '0',
  `pay_desc` text NOT NULL,
  `pay_order` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `pay_config` text NOT NULL,
  `enabled` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `is_cod` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `is_online` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`pay_id`),
  UNIQUE KEY `pay_code` (`pay_code`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_platform_plugin`
--

DROP TABLE IF EXISTS `ecs_platform_plugin`;
CREATE TABLE IF NOT EXISTS `ecs_platform_plugin` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `goods_id` mediumint(8) unsigned NOT NULL DEFAULT '0' COMMENT '产品id',
  `parent_id` mediumint(8) unsigned NOT NULL DEFAULT '0' COMMENT '所属框架产品id',
  `group_id` int(5) unsigned NOT NULL DEFAULT '0' COMMENT '功能组id',
  `is_delete` smallint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否删除',
  `belongs_version` smallint(1) unsigned NOT NULL DEFAULT '0' COMMENT '(所属版本1:基础版2:标准版3:高级版)',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=44 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_reassemble_info`
--

DROP TABLE IF EXISTS `ecs_reassemble_info`;
CREATE TABLE IF NOT EXISTS `ecs_reassemble_info` (
  `account_statement_id` mediumint(8) unsigned NOT NULL,
  `reassemble_info_id` mediumint(8) NOT NULL AUTO_INCREMENT,
  `start_time` int(10) NOT NULL,
  `end_time` int(10) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `goods_id` mediumint(8) NOT NULL,
  `parent_id` mediumint(8) NOT NULL,
  `create_time` int(10) NOT NULL,
  PRIMARY KEY (`reassemble_info_id`),
  KEY `a_id` (`account_statement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_region`
--

DROP TABLE IF EXISTS `ecs_region`;
CREATE TABLE IF NOT EXISTS `ecs_region` (
  `region_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` smallint(5) unsigned NOT NULL DEFAULT '0',
  `region_name` varchar(120) NOT NULL DEFAULT '',
  `region_type` tinyint(1) NOT NULL DEFAULT '2',
  `agency_id` smallint(5) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`region_id`),
  KEY `parent_id` (`parent_id`),
  KEY `region_type` (`region_type`),
  KEY `agency_id` (`agency_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3409 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_renewal_goods`
--

DROP TABLE IF EXISTS `ecs_renewal_goods`;
CREATE TABLE IF NOT EXISTS `ecs_renewal_goods` (
  `renewal_goods_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `account_statement_id` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `goods_id` int(10) unsigned NOT NULL DEFAULT '0',
  `parent_id` int(10) unsigned NOT NULL DEFAULT '0',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`renewal_goods_id`),
  UNIQUE KEY `account_statement_id` (`account_statement_id`,`goods_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_renewal_info`
--

DROP TABLE IF EXISTS `ecs_renewal_info`;
CREATE TABLE IF NOT EXISTS `ecs_renewal_info` (
  `renewal_info_id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `account_statement_id` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `start_time` int(10) unsigned NOT NULL,
  `end_time` int(10) unsigned NOT NULL,
  PRIMARY KEY (`renewal_info_id`),
  KEY `r_i_a_id` (`account_statement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_sessions`
--

DROP TABLE IF EXISTS `ecs_sessions`;
CREATE TABLE IF NOT EXISTS `ecs_sessions` (
  `sesskey` char(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `expiry` int(10) unsigned NOT NULL DEFAULT '0',
  `userid` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `adminid` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `ip` char(15) NOT NULL DEFAULT '',
  `user_name` varchar(60) NOT NULL,
  `user_rank` tinyint(3) NOT NULL,
  `discount` decimal(3,2) NOT NULL,
  `email` varchar(60) NOT NULL,
  `data` char(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`sesskey`),
  KEY `expiry` (`expiry`)
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_sessions_data`
--

DROP TABLE IF EXISTS `ecs_sessions_data`;
CREATE TABLE IF NOT EXISTS `ecs_sessions_data` (
  `sesskey` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `expiry` int(10) unsigned NOT NULL DEFAULT '0',
  `data` longtext NOT NULL,
  PRIMARY KEY (`sesskey`),
  KEY `expiry` (`expiry`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_shop_config`
--

DROP TABLE IF EXISTS `ecs_shop_config`;
CREATE TABLE IF NOT EXISTS `ecs_shop_config` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` smallint(5) unsigned NOT NULL DEFAULT '0',
  `code` varchar(30) NOT NULL DEFAULT '',
  `type` varchar(10) NOT NULL DEFAULT '',
  `store_range` varchar(255) NOT NULL DEFAULT '',
  `store_dir` varchar(255) NOT NULL DEFAULT '',
  `value` text NOT NULL,
  `sort_order` tinyint(3) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `parent_id` (`parent_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=904 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_stats`
--

DROP TABLE IF EXISTS `ecs_stats`;
CREATE TABLE IF NOT EXISTS `ecs_stats` (
  `access_time` int(10) unsigned NOT NULL DEFAULT '0',
  `ip_address` varchar(15) NOT NULL DEFAULT '',
  `visit_times` smallint(5) unsigned NOT NULL DEFAULT '1',
  `browser` varchar(60) NOT NULL DEFAULT '',
  `system` varchar(20) NOT NULL DEFAULT '',
  `language` varchar(20) NOT NULL DEFAULT '',
  `area` varchar(30) NOT NULL DEFAULT '',
  `referer_domain` varchar(100) NOT NULL DEFAULT '',
  `referer_path` varchar(200) NOT NULL DEFAULT '',
  `access_url` varchar(255) NOT NULL DEFAULT '',
  KEY `access_time` (`access_time`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_template`
--

DROP TABLE IF EXISTS `ecs_template`;
CREATE TABLE IF NOT EXISTS `ecs_template` (
  `filename` varchar(30) NOT NULL DEFAULT '',
  `region` varchar(40) NOT NULL DEFAULT '',
  `library` varchar(40) NOT NULL DEFAULT '',
  `sort_order` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `id` smallint(5) unsigned NOT NULL DEFAULT '0',
  `number` tinyint(1) unsigned NOT NULL DEFAULT '5',
  `type` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `theme` varchar(60) NOT NULL DEFAULT '',
  `remarks` varchar(30) NOT NULL DEFAULT '',
  KEY `filename` (`filename`,`region`),
  KEY `theme` (`theme`),
  KEY `remarks` (`remarks`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_unbind_record`
--

DROP TABLE IF EXISTS `ecs_unbind_record`;
CREATE TABLE IF NOT EXISTS `ecs_unbind_record` (
  `id` int(12) NOT NULL AUTO_INCREMENT,
  `serial_no` varchar(40) NOT NULL,
  `order_id` mediumint(8) unsigned NOT NULL,
  `unbind_at` int(13) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `u_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_update_history`
--

DROP TABLE IF EXISTS `ecs_update_history`;
CREATE TABLE IF NOT EXISTS `ecs_update_history` (
  `uh_id` int(10) NOT NULL AUTO_INCREMENT,
  `goods_id` int(10) NOT NULL,
  `version` varchar(50) NOT NULL,
  `notes` varchar(300) NOT NULL,
  `createtime` int(10) NOT NULL,
  `file_guid` varchar(64) DEFAULT NULL,
  `file_name` varchar(256) DEFAULT NULL,
  `lang` varchar(45) DEFAULT NULL,
  `envs` varchar(100) DEFAULT NULL,
  `md5` varchar(64) DEFAULT NULL,
  `file_info` varchar(500) DEFAULT NULL,
  `file_size` int(10) DEFAULT NULL,
  `store_file_name` varchar(245) DEFAULT NULL,
  `is_formal` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`uh_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4986 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_users`
--

DROP TABLE IF EXISTS `ecs_users`;
CREATE TABLE IF NOT EXISTS `ecs_users` (
  `user_id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `uc_id` int(12) unsigned NOT NULL COMMENT '全局通用的用户编号',
  `email` varchar(60) NOT NULL DEFAULT '',
  `user_name` varchar(60) NOT NULL DEFAULT '',
  `password` varchar(32) NOT NULL DEFAULT '',
  `point_all` int(16) NOT NULL DEFAULT '0' COMMENT '点数配额',
  `point_have` int(16) NOT NULL DEFAULT '0' COMMENT '点数余额',
  `host_num` int(16) NOT NULL DEFAULT '0' COMMENT '云主机数',
  `host_have` int(128) NOT NULL DEFAULT '0' COMMENT '云主机剩余',
  `is_delete` int(1) NOT NULL DEFAULT '0',
  `remark` varchar(256) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '备注',
  `question` varchar(255) NOT NULL DEFAULT '',
  `answer` varchar(255) NOT NULL DEFAULT '',
  `sex` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `birthday` date NOT NULL DEFAULT '0000-00-00',
  `user_money` decimal(10,2) NOT NULL DEFAULT '0.00',
  `frozen_money` decimal(10,2) NOT NULL DEFAULT '0.00',
  `pay_points` int(10) unsigned NOT NULL DEFAULT '0',
  `rank_points` int(10) unsigned NOT NULL DEFAULT '0',
  `address_id` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `reg_time` int(10) unsigned NOT NULL DEFAULT '0',
  `last_login` int(11) unsigned NOT NULL DEFAULT '0',
  `last_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `last_ip` varchar(15) NOT NULL DEFAULT '',
  `visit_count` smallint(5) unsigned NOT NULL DEFAULT '0',
  `user_rank` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `is_special` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `ec_salt` varchar(10) DEFAULT NULL,
  `salt` varchar(10) NOT NULL DEFAULT '0',
  `parent_id` mediumint(9) NOT NULL DEFAULT '0',
  `flag` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `alias` varchar(60) NOT NULL,
  `msn` varchar(60) NOT NULL,
  `qq` varchar(20) NOT NULL,
  `office_phone` varchar(20) NOT NULL,
  `home_phone` varchar(20) NOT NULL,
  `mobile_phone` varchar(20) NOT NULL,
  `is_validated` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `phone_is_validated` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `credit_line` decimal(10,2) unsigned NOT NULL,
  `passwd_question` varchar(50) DEFAULT NULL,
  `passwd_answer` varchar(255) DEFAULT NULL,
  `is_developer` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `dev_serial_no` varchar(500) DEFAULT NULL,
  `dev_sn_deadline` int(10) unsigned NOT NULL DEFAULT '0',
  `dev_sn_starttime` int(10) unsigned NOT NULL DEFAULT '0',
  `vip_dev_sn_starttime` int(10) unsigned NOT NULL DEFAULT '0',
  `vip_dev_sn_deadline` int(10) unsigned NOT NULL DEFAULT '0',
  `is_dev_vip` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `user_type` varchar(45) DEFAULT NULL,
  `contact_name` varchar(45) DEFAULT NULL,
  `id_number` varchar(45) DEFAULT NULL,
  `company` varchar(145) DEFAULT NULL,
  `company_number` varchar(45) DEFAULT NULL,
  `bank_type` varchar(45) DEFAULT NULL,
  `debit_card` varchar(45) DEFAULT NULL,
  `address` varchar(145) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_name` (`user_name`),
  KEY `email` (`email`),
  KEY `parent_id` (`parent_id`),
  KEY `flag` (`flag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecs_user_operate_log`
--

DROP TABLE IF EXISTS `ecs_user_operate_log`;
CREATE TABLE IF NOT EXISTS `ecs_user_operate_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ip` varchar(16) NOT NULL,
  `user_id` mediumint(8) unsigned NOT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `log_time` int(11) unsigned NOT NULL,
  `content` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `log_time` (`log_time`),
  KEY `subject` (`subject`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 限制导出的表
--

--
-- 限制表 `ecs_account_statement`
--
ALTER TABLE `ecs_account_statement`
  ADD CONSTRAINT `acc_user` FOREIGN KEY (`user_id`) REFERENCES `ecs_users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `goods_id` FOREIGN KEY (`goods_id`) REFERENCES `ecs_goods` (`goods_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 限制表 `ecs_admin_log`
--
ALTER TABLE `ecs_admin_log`
  ADD CONSTRAINT `log_user` FOREIGN KEY (`user_id`) REFERENCES `ecs_admin_user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;


--
-- 限制表 `ecs_app_category`
--
ALTER TABLE `ecs_app_category`
  ADD CONSTRAINT `cat_user` FOREIGN KEY (`add_userid`) REFERENCES `ecs_admin_user` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- 限制表 `ecs_app_host`
--
ALTER TABLE `ecs_app_host`
  ADD CONSTRAINT `host_user` FOREIGN KEY (`user_id`) REFERENCES `ecs_users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `ecs_app_power`
--
ALTER TABLE `ecs_app_power`
  ADD CONSTRAINT `power_user` FOREIGN KEY (`user_id`) REFERENCES `ecs_users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `ecs_article`
--
ALTER TABLE `ecs_article`
  ADD CONSTRAINT `cat_id` FOREIGN KEY (`cat_id`) REFERENCES `ecs_article_cat` (`cat_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `ecs_base_plugin`
--
ALTER TABLE `ecs_base_plugin`
  ADD CONSTRAINT `bp_goods_id` FOREIGN KEY (`p_id`) REFERENCES `ecs_goods` (`goods_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `ecs_collection`
--
ALTER TABLE `ecs_collection`
  ADD CONSTRAINT `col_user` FOREIGN KEY (`user_id`) REFERENCES `ecs_users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `ecs_order_goods`
--
ALTER TABLE `ecs_order_goods`
  ADD CONSTRAINT `goods_order_id` FOREIGN KEY (`order_id`) REFERENCES `ecs_order_info` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_goods_id` FOREIGN KEY (`goods_id`) REFERENCES `ecs_goods` (`goods_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `ecs_order_info`
--
ALTER TABLE `ecs_order_info`
  ADD CONSTRAINT `order_user` FOREIGN KEY (`user_id`) REFERENCES `ecs_users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `ecs_reassemble_info`
--
ALTER TABLE `ecs_reassemble_info`
  ADD CONSTRAINT `a_id` FOREIGN KEY (`account_statement_id`) REFERENCES `ecs_account_statement` (`account_statement_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `ecs_renewal_goods`
--
ALTER TABLE `ecs_renewal_goods`
  ADD CONSTRAINT `r_a_id` FOREIGN KEY (`account_statement_id`) REFERENCES `ecs_account_statement` (`account_statement_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `ecs_renewal_info`
--
ALTER TABLE `ecs_renewal_info`
  ADD CONSTRAINT `r_i_a_id` FOREIGN KEY (`account_statement_id`) REFERENCES `ecs_account_statement` (`account_statement_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `ecs_unbind_record`
--
ALTER TABLE `ecs_unbind_record`
  ADD CONSTRAINT `u_order_id` FOREIGN KEY (`order_id`) REFERENCES `ecs_order_info` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `ecs_user_operate_log`
--
ALTER TABLE `ecs_user_operate_log`
  ADD CONSTRAINT `op_user` FOREIGN KEY (`user_id`) REFERENCES `ecs_users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
--系统消息表`ecs_message`
--
DROP TABLE IF EXISTS `ecs_message`;
CREATE TABLE IF NOT EXISTS `ecs_message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `msg_title` varchar(225) DEFAULT NULL,
  `msg_type` int(3) NOT NULL,
  `msg_from` int(3) NOT NULL,
  `msg_to_user` int(11) NOT NULL,
  `msg_content` text NOT NULL,
  `msg_read` int(3) NOT NULL DEFAULT '0',
  `msg_status` int(3) NOT NULL DEFAULT '1',
  `msg_update_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `msg_byzd1` varchar(225) DEFAULT NULL,
  `msg_byzd2` int(11) DEFAULT NULL,
  `msg_byzd3` datetime DEFAULT NULL,
  `msg_byzd4` text,
  `msg_byzd5` int(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;