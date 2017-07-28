--
-- `ecs_shop_config`
--

INSERT INTO `ecs_shop_config` (`id`, `parent_id`, `code`, `type`, `store_range`, `store_dir`, `value`, `sort_order`) VALUES
(1, 0, 'shop_info', 'group', '', '', '', '1'),
(2, 0, 'basic', 'group', '', '', '', '1'),
(3, 0, 'display', 'group', '', '', '', '1'),
(4, 0, 'shopping_flow', 'group', '', '', '', '1'),
(5, 0, 'smtp', 'group', '', '', '', '1'),
(6, 0, 'hidden', 'hidden', '', '', '', '1'),
(7, 0, 'goods', 'group', '', '', '', '1'),
(8, 0, 'sms', 'group', '', '', '', '1'),
(9, 0, 'wap', 'group', '', '', '', '1'),
(101, 1, 'shop_name', 'text', '', '', '行業雲管理平臺', '1'),
(102, 1, 'shop_title', 'text', '', '', '行業雲管理平臺', '1'),
(103, 1, 'shop_desc', 'text', '', '', '行業雲管理平臺', '1'),
(104, 1, 'shop_keywords', 'text', '', '', '行業雲管理平臺', '1'),
(105, 1, 'shop_country', 'manual', '', '', '1', '1'),
(106, 1, 'shop_province', 'manual', '', '', '2', '1'),
(107, 1, 'shop_city', 'manual', '', '', '52', '1'),
(108, 1, 'shop_address', 'text', '', '', '', '1'),
(109, 1, 'qq', 'text', '', '', '', '1'),
(110, 1, 'ww', 'text', '', '', '', '1'),
(111, 1, 'skype', 'text', '', '', '', '1'),
(112, 1, 'ym', 'text', '', '', '', '1'),
(113, 1, 'msn', 'text', '', '', '', '1'),
(114, 1, 'service_email', 'text', '', '', '', '1'),
(115, 1, 'service_phone', 'text', '', '', '', '1'),
(116, 1, 'shop_closed', 'select', '0,1', '', '0', '1'),
(117, 1, 'close_comment', 'textarea', '', '', '', '1'),
(118, 1, 'shop_logo', 'file', '', '', '', '1'),
(119, 1, 'licensed', 'select', '0,1', '', '1', '1'),
(120, 1, 'user_notice', 'textarea', '', '', '用戶中心公告！', '1'),
(121, 1, 'shop_notice', 'textarea', '', '', '', '1'),
(122, 1, 'shop_reg_closed', 'select', '1,0', '', '0', '1'),
(201, 2, 'lang', 'manual', '', '', 'zh_tw', '1'),
(202, 2, 'icp_number', 'text', '', '', '', '1'),
(203, 2, 'icp_file', 'file', '', '../cert/', '', '1'),
(204, 2, 'watermark', 'file', '', '../images/', '', '1'),
(205, 2, 'watermark_place', 'select', '0,1,2,3,4,5', '', '1', '1'),
(206, 2, 'watermark_alpha', 'text', '', '', '65', '1'),
(207, 2, 'use_storage', 'select', '1,0', '', '1', '1'),
(208, 2, 'market_price_rate', 'text', '', '', '1.2', '1'),
(209, 2, 'rewrite', 'select', '0,1,2', '', '0', '1'),
(210, 2, 'integral_name', 'text', '', '', '積分', '1'),
(211, 2, 'integral_scale', 'text', '', '', '1', '1'),
(212, 2, 'integral_percent', 'text', '', '', '1', '1'),
(213, 2, 'sn_prefix', 'text', '', '', 'ECS', '1'),
(214, 2, 'comment_check', 'select', '0,1', '', '1', '1'),
(215, 2, 'no_picture', 'file', '', '../images/', '', '1'),
(218, 2, 'stats_code', 'textarea', '', '', '', '1'),
(219, 2, 'cache_time', 'text', '', '', '3600', '1'),
(220, 2, 'register_points', 'text', '', '', '0', '1'),
(221, 2, 'enable_gzip', 'select', '0,1', '', '0', '1'),
(222, 2, 'top10_time', 'select', '0,1,2,3,4', '', '0', '1'),
(223, 2, 'timezone', 'options', '-12,-11,-10,-9,-8,-7,-6,-5,-4,-3.5,-3,-2,-1,0,1,2,3,3.5,4,4.5,5,5.5,5.75,6,6.5,7,8,9,9.5,10,11,12', '', '8', '1'),
(224, 2, 'upload_size_limit', 'options', '-1,0,64,128,256,512,1024,2048,4096', '', '64', '1'),
(226, 2, 'cron_method', 'select', '0,1', '', '0', '1'),
(227, 2, 'comment_factor', 'select', '0,1,2,3', '', '0', '1'),
(228, 2, 'enable_order_check', 'select', '0,1', '', '1', '1'),
(229, 2, 'default_storage', 'text', '', '', '1', '1'),
(230, 2, 'bgcolor', 'text', '', '', '#FFFFFF', '1'),
(231, 2, 'visit_stats', 'select', 'on,off', '', 'on', '1'),
(232, 2, 'send_mail_on', 'select', 'on,off', '', 'off', '1'),
(233, 2, 'auto_generate_gallery', 'select', '1,0', '', '1', '1'),
(234, 2, 'retain_original_img', 'select', '1,0', '', '1', '1'),
(235, 2, 'member_email_validate', 'select', '1,0', '', '1', '1'),
(236, 2, 'message_board', 'select', '1,0', '', '1', '1'),
(239, 2, 'certificate_id', 'hidden', '', '', '', '1'),
(240, 2, 'token', 'hidden', '', '', '', '1'),
(241, 2, 'certi', 'hidden', '', '', 'http://service.shopex.cn/openapi/api.php', '1'),
(242, 2, 'send_verify_email', 'select', '1,0', '', '0', '1'),
(243, 2, 'ent_id', 'hidden', '', '', '', '1'),
(244, 2, 'ent_ac', 'hidden', '', '', '', '1'),
(245, 2, 'ent_sign', 'hidden', '', '', '', '1'),
(246, 2, 'ent_email', 'hidden', '', '', '', '1'),
(301, 3, 'date_format', 'hidden', '', '', 'Y-m-d', '1'),
(302, 3, 'time_format', 'text', '', '', 'Y-m-d H:i:s', '1'),
(303, 3, 'currency_format', 'text', '', '', '￥%s元', '1'),
(304, 3, 'thumb_width', 'text', '', '', '100', '1'),
(305, 3, 'thumb_height', 'text', '', '', '100', '1'),
(306, 3, 'image_width', 'text', '', '', '230', '1'),
(307, 3, 'image_height', 'text', '', '', '230', '1'),
(312, 3, 'top_number', 'text', '', '', '10', '1'),
(313, 3, 'history_number', 'text', '', '', '5', '1'),
(314, 3, 'comments_number', 'text', '', '', '5', '1'),
(315, 3, 'bought_goods', 'text', '', '', '3', '1'),
(316, 3, 'article_number', 'text', '', '', '8', '1'),
(317, 3, 'goods_name_length', 'text', '', '', '7', '1'),
(318, 3, 'price_format', 'select', '0,1,2,3,4,5', '', '5', '1'),
(319, 3, 'page_size', 'text', '', '', '10', '1'),
(320, 3, 'sort_order_type', 'select', '0,1,2', '', '0', '1'),
(321, 3, 'sort_order_method', 'select', '0,1', '', '0', '1'),
(322, 3, 'show_order_type', 'select', '0,1,2', '', '1', '1'),
(323, 3, 'attr_related_number', 'text', '', '', '5', '1'),
(324, 3, 'goods_gallery_number', 'text', '', '', '5', '1'),
(325, 3, 'article_title_length', 'text', '', '', '16', '1'),
(326, 3, 'name_of_region_1', 'text', '', '', '國家', '1'),
(327, 3, 'name_of_region_2', 'text', '', '', '省', '1'),
(328, 3, 'name_of_region_3', 'text', '', '', '市', '1'),
(329, 3, 'name_of_region_4', 'text', '', '', '區', '1'),
(330, 3, 'search_keywords', 'text', '', '', '', '0'),
(332, 3, 'related_goods_number', 'text', '', '', '4', '1'),
(333, 3, 'help_open', 'select', '0,1', '', '1', '1'),
(334, 3, 'article_page_size', 'text', '', '', '10', '1'),
(335, 3, 'page_style', 'select', '0,1', '', '1', '1'),
(336, 3, 'recommend_order', 'select', '0,1', '', '0', '1'),
(337, 3, 'index_ad', 'hidden', '', '', 'sys', '1'),
(401, 4, 'can_invoice', 'select', '1,0', '', '1', '1'),
(402, 4, 'use_integral', 'select', '1,0', '', '1', '1'),
(403, 4, 'use_bonus', 'select', '1,0', '', '1', '1'),
(404, 4, 'use_surplus', 'select', '1,0', '', '1', '1'),
(405, 4, 'use_how_oos', 'select', '1,0', '', '1', '1'),
(406, 4, 'send_confirm_email', 'select', '1,0', '', '0', '1'),
(407, 4, 'send_ship_email', 'select', '1,0', '', '0', '1'),
(408, 4, 'send_cancel_email', 'select', '1,0', '', '0', '1'),
(409, 4, 'send_invalid_email', 'select', '1,0', '', '0', '1'),
(410, 4, 'order_pay_note', 'select', '1,0', '', '1', '1'),
(411, 4, 'order_unpay_note', 'select', '1,0', '', '1', '1'),
(412, 4, 'order_ship_note', 'select', '1,0', '', '1', '1'),
(413, 4, 'order_receive_note', 'select', '1,0', '', '1', '1'),
(414, 4, 'order_unship_note', 'select', '1,0', '', '1', '1'),
(415, 4, 'order_return_note', 'select', '1,0', '', '1', '1'),
(416, 4, 'order_invalid_note', 'select', '1,0', '', '1', '1'),
(417, 4, 'order_cancel_note', 'select', '1,0', '', '1', '1'),
(418, 4, 'invoice_content', 'textarea', '', '', '', '1'),
(419, 4, 'anonymous_buy', 'select', '1,0', '', '1', '1'),
(420, 4, 'min_goods_amount', 'text', '', '', '0', '1'),
(421, 4, 'one_step_buy', 'select', '1,0', '', '0', '1'),
(422, 4, 'invoice_type', 'manual', '', '', 'a:2:{s:4:"type";a:3:{i:0;s:1:"1";i:1;s:1:"2";i:2;s:0:"";}s:4:"rate";a:3:{i:0;d:1;i:1;d:1.5;i:2;d:0;}}', '1'),
(423, 4, 'stock_dec_time', 'select', '1,0', '', '0', '1'),
(424, 4, 'cart_confirm', 'options', '1,2,3,4', '', '3', '0'),
(425, 4, 'send_service_email', 'select', '1,0', '', '0', '1'),
(426, 4, 'show_goods_in_cart', 'select', '1,2,3', '', '3', '1'),
(427, 4, 'show_attr_in_cart', 'select', '1,0', '', '1', '1'),
(501, 5, 'smtp_host', 'text', '', '', 'localhost', '1'),
(502, 5, 'smtp_port', 'text', '', '', '25', '1'),
(503, 5, 'smtp_user', 'text', '', '', '', '1'),
(504, 5, 'smtp_pass', 'password', '', '', '', '1'),
(505, 5, 'smtp_mail', 'text', '', '', '', '1'),
(506, 5, 'mail_charset', 'select', 'UTF8,GB2312,BIG5', '', 'UTF8', '1'),
(507, 5, 'mail_service', 'select', '0,1', '', '0', '0'),
(508, 5, 'smtp_ssl', 'select', '0,1', '', '0', '0'),
(601, 6, 'integrate_code', 'hidden', '', '', 'ecshop', '1'),
(602, 6, 'integrate_config', 'hidden', '', '', '', '1'),
(603, 6, 'hash_code', 'hidden', '', '', '31693422540744c0a6b6da635b7a5a93', '1'),
(604, 6, 'template', 'hidden', '', '', 'appcloud', '1'),
(605, 6, 'install_date', 'hidden', '', '', '1224919217', '1'),
(606, 6, 'ecs_version', 'hidden', '', '', 'v2.7.2', '1'),
(607, 6, 'sms_user_name', 'hidden', '', '', '', '1'),
(608, 6, 'sms_password', 'hidden', '', '', '', '1'),
(609, 6, 'sms_auth_str', 'hidden', '', '', '', '1'),
(610, 6, 'sms_domain', 'hidden', '', '', '', '1'),
(611, 6, 'sms_count', 'hidden', '', '', '', '1'),
(612, 6, 'sms_total_money', 'hidden', '', '', '', '1'),
(613, 6, 'sms_balance', 'hidden', '', '', '', '1'),
(614, 6, 'sms_last_request', 'hidden', '', '', '', '1'),
(616, 6, 'affiliate', 'hidden', '', '', 'a:3:{s:6:"config";a:7:{s:6:"expire";d:24;s:11:"expire_unit";s:4:"hour";s:11:"separate_by";i:0;s:15:"level_point_all";s:2:"5%";s:15:"level_money_all";s:2:"1%";s:18:"level_register_all";i:2;s:17:"level_register_up";i:60;}s:4:"item";a:4:{i:0;a:2:{s:11:"level_point";s:3:"60%";s:11:"level_money";s:3:"60%";}i:1;a:2:{s:11:"level_point";s:3:"30%";s:11:"level_money";s:3:"30%";}i:2;a:2:{s:11:"level_point";s:2:"7%";s:11:"level_money";s:2:"7%";}i:3;a:2:{s:11:"level_point";s:2:"3%";s:11:"level_money";s:2:"3%";}}s:2:"on";i:1;}', '1'),
(617, 6, 'captcha', 'hidden', '', '', '36', '1'),
(618, 6, 'captcha_width', 'hidden', '', '', '100', '1'),
(619, 6, 'captcha_height', 'hidden', '', '', '20', '1'),
(620, 6, 'sitemap', 'hidden', '', '', 'a:6:{s:19:"homepage_changefreq";s:6:"hourly";s:17:"homepage_priority";s:3:"0.9";s:19:"category_changefreq";s:6:"hourly";s:17:"category_priority";s:3:"0.8";s:18:"content_changefreq";s:6:"weekly";s:16:"content_priority";s:3:"0.7";}', '0'),
(621, 6, 'points_rule', 'hidden', '', '', '', '0'),
(622, 6, 'flash_theme', 'hidden', '', '', 'dynfocus', '1'),
(623, 6, 'stylename', 'hidden', '', '', '', 1),
(701, 7, 'show_goodssn', 'select', '1,0', '', '1', '1'),
(702, 7, 'show_brand', 'select', '1,0', '', '1', '1'),
(703, 7, 'show_goodsweight', 'select', '1,0', '', '1', '1'),
(704, 7, 'show_goodsnumber', 'select', '1,0', '', '1', '1'),
(705, 7, 'show_addtime', 'select', '1,0', '', '1', '1'),
(706, 7, 'goodsattr_style', 'select', '1,0', '', '1', '1'),
(707, 7, 'show_marketprice', 'select', '1,0', '', '1', '1'),
(801, 8, 'sms_shop_mobile', 'text', '', '', '', '1'),
(802, 8, 'sms_order_placed', 'select', '1,0', '', '0', '1'),
(803, 8, 'sms_order_payed', 'select', '1,0', '', '0', '1'),
(804, 8, 'sms_order_shipped', 'select', '1,0', '', '0', '1'),
(901, 9, 'wap_config', 'select', '1,0', '', '0', '1'),
(902, 9, 'wap_logo', 'file', '', '../images/', '', '1'),
(903, 2, 'message_check', 'select', '1,0', '', '1', '1');

--
-- `ecs_template`
--

INSERT INTO `ecs_template` (`filename`, `region`, `library`, `sort_order`, `id`, `number`, `type`, `theme`, `remarks`) VALUES
('index', '左邊區域', '/library/vote_list.lbi', 8, 0, 0, 0, 'default', ''),
('index', '左邊區域', '/library/email_list.lbi', 9, 0, 0, 0, 'default', ''),
('index', '左邊區域', '/library/order_query.lbi', 6, 0, 0, 0, 'default', ''),
('index', '左邊區域', '/library/cart.lbi', 0, 0, 0, 0, 'default', ''),
('index', '左邊區域', '/library/promotion_info.lbi', 3, 0, 0, 0, 'default', ''),
('index', '左邊區域', '/library/auction.lbi', 4, 0, 3, 0, 'default', ''),
('index', '左邊區域', '/library/group_buy.lbi', 5, 0, 3, 0, 'default', ''),
('index', '', '/library/recommend_promotion.lbi', 0, 0, 4, 0, 'default', ''),
('index', '右邊主區域', '/library/recommend_hot.lbi', 2, 0, 10, 0, 'default', ''),
('index', '右邊主區域', '/library/recommend_new.lbi', 1, 0, 10, 0, 'default', ''),
('index', '右邊主區域', '/library/recommend_best.lbi', 0, 0, 10, 0, 'default', ''),
('index', '左邊區域', '/library/invoice_query.lbi', 7, 0, 0, 0, 'default', ''),
('index', '左邊區域', '/library/top10.lbi', 2, 0, 0, 0, 'default', ''),
('index', '左邊區域', '/library/category_tree.lbi', 1, 0, 0, 0, 'default', ''),
('index', '', '/library/brands.lbi', '0', '0', '11', '0', 'default', ''),
('category', '左邊區域', '/library/category_tree.lbi', 1, 0, 0, 0, 'default', ''),
('category', '右邊區域', '/library/recommend_best.lbi', 0, 0, 5, 0, 'default', ''),
('category', '右邊區域', '/library/goods_list.lbi', 1, 0, 0, 0, 'default', ''),
('category', '右邊區域', '/library/pages.lbi', 2, 0, 0, 0, 'default', ''),
('category', '左邊區域', '/library/cart.lbi', 0, 0, 0, 0, 'default', ''),
('category', '左邊區域', '/library/price_grade.lbi', 3, 0, 0, 0, 'default', ''),
('category', '左邊區域', '/library/filter_attr.lbi', 2, 0, 0, 0, 'default', '');

--
-- `ecs_category`
--

INSERT INTO `ecs_category` (`cat_id`, `cat_name`, `keywords`, `cat_desc`, `parent_id`, `sort_order`, `template_file`, `measure_unit`, `show_in_nav`, `style`, `is_show`, `grade`, `filter_attr`) VALUES
(7, '獨立工具', '', '', 2, 50, '', '', 0, '', 1, 0, ''),
(2, '桌面工具', '', '', 0, 50, '', '个', 0, '', 1, 0, ''),
(3, 'WEB應用', '', '', 0, 50, '', '个', 0, '', 1, 0, ''),
(8, '可定製工具', '', '', 2, 50, '', '', 0, '', 1, 0, ''),
(9, '可定製應用', '', '', 3, 50, '', '', 0, '', 1, 0, ''),
(10, '獨立應用', '', '', 3, 50, '', '', 0, '', 1, 0, ''),
(11, '基礎', '', '', 8, 51, '', '', 0, '', 1, 0, ''),
(12, '國土', '', '', 8, 52, '', '', 0, '', 1, 0, ''),
(13, '通信', '', '', 8, 53, '', '', 0, '', 1, 0, ''),
(14, '市政', '', '', 8, 54, '', '', 0, '', 1, 0, ''),
(15, '基礎', '', '', 10, 51, '', '', 1, '', 1, 0, ''),
(16, '國土', '', '', 10, 52, '', '', 0, '', 1, 0, ''),
(17, '通信', '', '', 10, 53, '', '', 0, '', 1, 0, ''),
(18, '市政', '', '', 10, 54, '', '', 0, '', 1, 0, ''),
(19, '國土', '', '', 7, 52, '', '', 0, '', 1, 0, ''),
(20, '通信', '', '', 7, 53, '', '', 0, '', 1, 0, ''),
(21, '市政', '', '', 7, 54, '', '', 0, '', 1, 0, ''),
(22, '基礎', '', '', 7, 50, '', '', 1, '', 1, 0, ''),
(23, '國土', '', '', 9, 52, '', '', 0, '', 1, 0, ''),
(24, '通信', '', '', 9, 53, '', '', 0, '', 1, 0, ''),
(25, '市政', '', '', 9, 54, '', '', 0, '', 1, 0, ''),
(27, '基礎', '', '', 9, 51, '', '', 0, '', 1, 0, ''),
(44, '插件', '', '', 2, 50, '', '', 0, '', 1, 0, ''),
(45, '基礎', '', '', 44, 1, '', '', 0, '', 1, 0, ''),
(46, '通信', '', '', 44, 3, '', '', 0, '', 1, 0, ''),
(47, '國土', '', '', 44, 2, '', '', 0, '', 1, 0, ''),
(48, '市政', '', '', 44, 4, '', '', 0, '', 1, 0, ''),
(49, '插件', '', '', 3, 50, '', '', 0, '', 1, 0, ''),
(50, '基礎', '', '', 49, 51, '', '', 0, '', 1, 0, ''),
(51, '國土', '', '', 49, 52, '', '', 0, '', 1, 0, ''),
(52, '通信', '', '', 49, 53, '', '', 0, '', 1, 0, ''),
(53, '市政', '', '', 49, 54, '', '', 0, '', 1, 0, ''),
(56, '公安', '', '', 8, 55, '', '', 0, '', 1, 0, ''),
(57, '公安', '', '', 10, 55, '', '', 0, '', 1, 0, ''),
(58, '公安', '', '', 7, 55, '', '', 0, '', 1, 0, ''),
(59, '水利', '', '', 8, 56, '', '', 0, '', 1, 0, ''),
(60, '水利', '', '', 7, 56, '', '', 0, '', 1, 0, ''),
(61, '防災', '', '', 8, 57, '', '', 0, '', 1, 0, ''),
(62, '防災', '', '', 7, 57, '', '', 0, '', 1, 0, ''),
(63, '公安', '', '', 9, 55, '', '', 0, '', 1, 0, ''),
(64, '地礦', '', '', 7, 58, '', '', 0, '', 1, 0, ''),
(65, '地礦', '', '', 8, 58, '', '', 0, '', 1, 0, ''),
(66, '自然資源', '', '', 10, 61, '', '', 0, '', 1, 0, ''),
(67, '自然資源', '', '', 9, 61, '', '', 0, '', 1, 0, ''),
(68, '其他', '', '', 10, 63, '', '', 0, '', 1, 0, ''),
(69, '其他', '', '', 9, 63, '', '', 0, '', 1, 0, ''),
(70, '其他', '', '', 8, 63, '', '', 0, '', 1, 0, ''),
(71, '其他', '', '', 7, 63, '', '', 0, '', 1, 0, ''),
(72, '大賽專區', '', '', 8, 62, '', '', 0, '', 1, 0, ''),
(73, '大賽專區', '', '', 7, 62, '', '', 0, '', 1, 0, ''),
(74, '自然資源', '', '', 8, 61, '', '', 0, '', 1, 0, ''),
(75, '自然資源', '', '', 7, 61, '', '', 0, '', 1, 0, ''),
(76, '大賽專區', '', '', 9, 62, '', '', 0, '', 1, 0, ''),
(77, '大賽專區', '', '', 10, 62, '', '', 0, '', 1, 0, ''),
(78, '水利', '', '', 9, 56, '', '', 0, '', 1, 0, ''),
(79, '水利', '', '', 10, 56, '', '', 0, '', 1, 0, ''),
(80, '防災', '', '', 9, 57, '', '', 0, '', 1, 0, ''),
(81, '防災', '', '', 10, 57, '', '', 0, '', 1, 0, ''),
(82, '地礦', '', '', 9, 58, '', '', 0, '', 1, 0, ''),
(83, '地礦', '', '', 10, 58, '', '', 0, '', 1, 0, ''),
(84, '公安', '', '', 44, 5, '', '', 0, '', 1, 0, ''),
(85, '水利', '', '', 44, 6, '', '', 0, '', 1, 0, ''),
(86, '防災', '', '', 44, 7, '', '', 0, '', 1, 0, ''),
(87, '地礦', '', '', 44, 8, '', '', 0, '', 1, 0, ''),
(88, '自然資源', '', '', 44, 11, '', '', 0, '', 1, 0, ''),
(89, '其他', '', '', 44, 13, '', '', 0, '', 1, 0, ''),
(90, '大賽專區', '', '', 44, 12, '', '', 0, '', 1, 0, ''),
(91, '公安', '', '', 49, 55, '', '', 0, '', 1, 0, ''),
(92, '水利', '', '', 49, 56, '', '', 0, '', 1, 0, ''),
(93, '防災', '', '', 49, 57, '', '', 0, '', 1, 0, ''),
(94, '地礦', '', '', 49, 58, '', '', 0, '', 1, 0, ''),
(95, '自然資源', '', '', 49, 61, '', '', 0, '', 1, 0, ''),
(96, '其他', '', '', 49, 63, '', '', 0, '', 1, 0, ''),
(97, '大賽專區', '', '', 49, 62, '', '', 0, '', 1, 0, ''),
(98, '移動應用', '', '', 0, 50, '', '', 0, '', 1, 0, ''),
(99, '移動應用', '', '', 98, 50, '', '', 0, '', 1, 0, ''),
(100, '基礎', '', '', 99, 1, '', '', 1, '', 1, 0, ''),
(101, '國土', '', '', 99, 2, '', '', 0, '', 1, 0, ''),
(102, '市政', '', '', 99, 4, '', '', 0, '', 1, 0, ''),
(103, '通信', '', '', 99, 3, '', '', 0, '', 1, 0, ''),
(104, '公安', '', '', 99, 5, '', '', 0, '', 1, 0, ''),
(105, '水利', '', '', 99, 6, '', '', 0, '', 1, 0, ''),
(106, '防災', '', '', 99, 7, '', '', 0, '', 1, 0, ''),
(107, '地礦', '', '', 99, 8, '', '', 0, '', 1, 0, ''),
(108, '自然資源', '', '', 99, 11, '', '', 0, '', 1, 0, ''),
(109, '大賽專區', '', '', 99, 12, '', '', 0, '', 1, 0, ''),
(110, '其他', '', '', 99, 13, '', '', 0, '', 1, 0, ''),
(117, '服务产品', '', '', 0, 50, '', '', 0, '', 1, 0, ''),
(118, '基礎', '', '', 117, 51, '', '', 0, '', 1, 0, ''),
(119, '國土', '', '', 117, 52, '', '', 0, '', 1, 0, ''),
(120, '通信', '', '', 117, 53, '', '', 0, '', 1, 0, ''),
(121, '市政', '', '', 117, 54, '', '', 0, '', 1, 0, ''),
(122, '公安', '', '', 117, 55, '', '', 0, '', 1, 0, ''),
(123, '水利', '', '', 117, 56, '', '', 0, '', 1, 0, ''),
(124, '防災', '', '', 117, 57, '', '', 0, '', 1, 0, ''),
(125, '地礦', '', '', 117, 58, '', '', 0, '', 1, 0, ''),
(126, '自然資源', '', '', 117, 61, '', '', 0, '', 1, 0, ''),
(127, '大賽專區', '', '', 117, 62, '', '', 0, '', 1, 0, ''),
(128, '其他', '', '', 117, 63, '', '', 0, '', 1, 0, ''),
(130, '氣象', '', '', 99, 9, '', '', 0, '', 1, 0, ''),
(131, '氣象', '', '', 117, 59, '', '', 0, '', 1, 0, ''),
(132, '氣象', '', '', 7, 59, '', '', 0, '', 1, 0, ''),
(133, '氣象', '', '', 44, 9, '', '', 0, '', 1, 0, ''),
(134, '氣象', '', '', 8, 59, '', '', 0, '', 1, 0, ''),
(135, '氣象', '', '', 9, 59, '', '', 0, '', 1, 0, ''),
(136, '氣象', '', '', 49, 59, '', '', 0, '', 1, 0, ''),
(137, '氣象', '', '', 10, 59, '', '', 0, '', 1, 0, ''),
(138, '農林', '', '', 99, 10, '', '', 0, '', 1, 0, ''),
(139, '農林', '', '', 117, 60, '', '', 0, '', 1, 0, ''),
(140, '農林', '', '', 44, 10, '', '', 0, '', 1, 0, ''),
(141, '農林', '', '', 8, 60, '', '', 0, '', 1, 0, ''),
(142, '農林', '', '', 7, 60, '', '', 0, '', 1, 0, ''),
(143, '農林', '', '', 9, 60, '', '', 0, '', 1, 0, ''),
(144, '農林', '', '', 49, 60, '', '', 0, '', 1, 0, ''),
(145, '農林', '', '', 10, 60, '', '', 0, '', 1, 0, '');

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
(1, 2, '應用平臺組成', '<ul>\r\n	<li>\r\n	<h1><a id="行业云应用平台前台组成" name="行业云应用平台前台组成">行业云应用平台前台组成</a></h1>\r\n	</li>\r\n</ul>\r\n\r\n<hr />\r\n<p>&nbsp;&nbsp;前台主要由3个部分组成：应用园地、软件中心和管理中心。<br />\r\n&nbsp;（1）&nbsp;&nbsp; &nbsp;应用园地展示所有发布并上架的在线应用，用户可直接在线使用应用<br />\r\n&nbsp;（2）&nbsp;&nbsp; &nbsp;软件中心展示软件产品，用户可通过点数购买软件后选择部署到云主机使用或迁移到本地安装使用<br />\r\n&nbsp;（3）&nbsp;&nbsp; &nbsp;管理中心由6个部分组成：我的应用、云主机、我的收藏、已购软件、我的订单和个人信息组成，可帮助用户管理应用、云主机、购买信息及个人信息等</p>\r\n\r\n<p>&nbsp;</p>\r\n', '', '', '', 0, 1, 1464308419, '', 0, '', NULL),
(2, 3, '部署應用流程', '<ul>\n	<li>\n	<h1><a id="云交易中心简介" name="云交易中心简介">软件部署在线应用的流程</a></h1>\n	</li>\n</ul>\n\n<hr />\n<p>&nbsp; &nbsp;主要流程如下:</p>\n\n<p><img alt="" src="includes/ckfinder/userfiles/images/flow.png" style="height:52px; width:462px" /></p>\n\n<p>（1）&nbsp;&nbsp; &nbsp;在软件中心中选择软件进入软件详情页面，使用点数购买软件</p>\n\n<p><img alt="" src="includes/ckfinder/userfiles/images/flow1.png" style="height:304px; width:633px" /></p>\n\n<p>（2）&nbsp;&nbsp; &nbsp;购买完成后选择【部署到云主机】，并设置部署信息，选择【开始部署】后应用开始自动部署</p>\n\n<p><img alt="" src="includes/ckfinder/userfiles/images/flow2.png" style="height:973px; width:1141px" /></p>\n\n<p>（3）&nbsp;&nbsp; &nbsp;部署的应用在管理中心选择上架即可展示在应用园地中</p>\n\n<p><img alt="" src="includes/ckfinder/userfiles/images/flow3.png" style="height:378px; width:1048px" /></p>\n', '', '', '', 0, 1, 1464309125, '', 0, '', NULL);

--
-- `ecs_base_price_group`
--

INSERT INTO `ecs_base_price_group` (`id`, `group_name`, `price`, `price_ratio`, `code`, `fun_desc`, `explanation`, `type`, `function`, `created_at`, `updated_at`, `minimum`, `group_order`, `is_delete`, `main_function`, `sub_functions`) VALUES
(1, 'C/S功能组1', 0, 1, '12345678', '支持文件数据库，仅支持数据的显示（不包含三维数据）', NULL, 'DESK', 121, 1408156087, 1408156087, 2, 100, 0, '10000000', '50000000'),
(2, 'C/S功能组2', 15, 1, '123466789', '支持文件数据库，支持数据的显示与打印（不包含三维数据）', NULL, 'DESK', 123466789, 1408156080, 1408156080, 1, 200, 0, '12000000', '72000000 00000000'),
(3, 'C/S功能组3', 30, 1, '123', '支持文件数据库，支持显示、打印、分析等二维功能，及栅格常规、雷达处理等遥感功能', NULL, 'DESK', 140815608, 1408156089, 1408156089, 1, 300, 0, '12000000', '73000000 00020000'),
(4, 'C/S功能组4', 45, 1, '1235', '支持文件/SQL Server数据库，支持显示、打印、分析、专题图制作等二维功能，支持栅格常规、雷达处理、高分处理等遥感功能，及三维数据的显示功能', 'C/S功能组4备注', 'DESK', 140815608, 1408156089, 1408156089, 1, 400, 0, '13000000', 'F3000001 00030000 00001400'),
(5, 'C/S功能组5', 60, 1, '12356', '支持文件/Oracle数据库，支持显示、打印、分析、专题图制作等二维功能，支持栅格常规、雷达处理、高分处理等遥感功能，及三维数据的显示功能', 'C/S功能组5备注', 'DESK', 140815608, 1408156089, 1408156089, 1, 500, 0, '13000000', 'F3000004 00030000 00001400'),
(6, 'C/S功能组6', 75, 1, '123567', '支持文件/Oracle/SQL Server数据库，支持显示、打印、分析、专题图制作等二维功能，支持栅格常规、雷达处理、高分处理等遥感功能，及三维数据的显示和建模功能', 'C/S功能组6备注', 'DESK', 140815608, 1408156089, 1408156089, 1, 600, 0, '13000000', 'F3000005 00030000 00001530'),
(7, 'C/S功能组7', 80, 1, '123567', '超级版，支持文件/Oracle/SQL Server数据库，支持显示、打印、分析、专题图制作等二维功能，支持栅格常规、雷达处理、高分处理等遥感功能，及三维数据的显示、建模和分析功能', 'C/S功能组7备注', 'DESK', 140815608, 1408156089, 1408156089, 1, 700, 0, '13000000', 'F300000D 00030000 00001730'),
(8, 'B/S功能组1', 0, 1, '123567', '支持文件数据库，仅支持数据的显示（不包含三维数据）', 'B/s功能组1备注', 'WEB', 140815608, 1408156089, 1408156089, 1, 800, 0, '10000000', '50000000'),
(9, 'B/S功能组2', 30, 1, '123567', '支持文件数据库，支持数据的显示与打印（不包含三维数据）', 'B/s功能组2备注', 'WEB', 140815608, 1408156089, 1408156089, 1, 900, 0, '12000000', '72000000 00000000'),
(10, 'B/S功能组3', 60, 1, '123567', '支持文件数据库，支持显示、打印、分析等二维功能，及栅格常规、雷达处理等遥感功能', 'B/s功能组3备注', 'WEB', 140815608, 1408156089, 1408156089, 1, 1000, 0, '12000000', '73000000 00020000'),
(11, 'B/S功能组4', 90, 1, '123567', '支持文件/SQL Server数据库，支持显示、打印、分析、专题图制作等二维功能，支持栅格常规、雷达处理、高分处理等遥感功能，及三维数据的显示功能', 'B/S功能组4备注', 'WEB', 140815608, 1408156089, 1408156089, 1, 1100, 0, '13000000', 'F3000001 00030000 00001400'),
(12, 'B/S功能组5', 120, 1, '123567', '支持文件/Oracle数据库，支持显示、打印、分析、专题图制作等二维功能，支持栅格常规、雷达处理、高分处理等遥感功能，及三维数据的显示功能', 'B/S功能组5备注', 'WEB', 140815608, 1408156089, 1408156089, 1, 1200, 0, '13000000', 'F3000004 00030000 00001400'),
(13, 'B/S功能组6', 180, 1, '123567', '支持文件/Oracle/SQL Server数据库，支持显示、打印、分析、专题图制作等二维功能，支持栅格常规、雷达处理、高分处理等遥感功能，及三维数据的显示和建模功能', 'B/S功能组6备注', 'WEB', 140815608, 1408156089, 1408156089, 1, 1300, 0, '13000000', 'F3000005 00030000 00001530'),
(14, 'B/S功能组7', 200, 1, '123567', '超级版，支持文件/Oracle/SQL Server数据库，支持显示、打印、分析、专题图制作等二维功能，支持栅格常规、雷达处理、高分处理等遥感功能，及三维数据的显示、建模和分析功能', 'B/S功能组7备注', 'WEB', 140815608, 1408156089, 1408156089, 1, 1400, 0, '13000000', 'F300000D 00030000 00001730'),
(15, 'B/S功能组8', 300, 1, '123567', '超级版，支持文件/Oracle/SQL Server数据库，支持显示、打印、分析、专题图制作等二维功能，支持栅格常规、雷达处理、高分处理等遥感功能，及三维数据的显示、建模和分析功能', 'B/S功能组8备注', 'WEB', 140815608, 1408156089, 1408156089, 1, 1500, 0, '13000000', 'F300000D 00030000 00001730');

--
-- `ecs_base_price_ex`
--

INSERT INTO `ecs_base_price_ex` (`id`, `price_ratio`, `price_group_id`, `scale_name`, `scale_type`, `minnum`, `concurrent_user`, `online_user`, `register_user`) VALUES
(1, 1, 1, '微型', 10, 1, 1, 1, 1),
(2, 0.9, 1, '小型', 20, 2, 1, 1, 1),
(3, 0.8, 1, '中型', 30, 6, 1, 1, 1),
(4, 0.7, 1, '大型', 40, 21, 1, 1, 1),
(5, 0.6, 1, '超型', 50, 101, 1, 1, 1),
(6, 1, 2, '微型', 10, 1, 1, 1, 1),
(7, 0.9, 2, '小型', 20, 2, 1, 1, 1),
(8, 0.8, 2, '中型', 30, 6, 1, 1, 1),
(9, 0.7, 2, '大型', 40, 21, 1, 1, 1),
(10, 0.6, 2, '超型', 50, 101, 1, 1, 1),
(11, 1, 3, '微型', 10, 1, 1, 1, 1),
(12, 0.9, 3, '小型', 20, 2, 1, 1, 1),
(13, 0.8, 3, '中型', 30, 6, 1, 1, 1),
(14, 0.7, 3, '大型', 40, 21, 1, 1, 1),
(15, 0.6, 3, '超型', 50, 101, 1, 1, 1),
(16, 1, 4, '微型', 10, 1, 1, 1, 1),
(17, 0.9, 4, '小型', 20, 2, 1, 1, 1),
(18, 0.8, 4, '中型', 30, 6, 1, 1, 1),
(19, 0.7, 4, '大型', 40, 21, 1, 1, 1),
(20, 0.6, 4, '超型', 50, 101, 1, 1, 1),
(21, 1, 5, '微型', 10, 1, 1, 1, 1),
(22, 0.9, 5, '小型', 20, 2, 1, 1, 1),
(23, 0.8, 5, '中型', 30, 6, 1, 1, 1),
(24, 0.7, 5, '大型', 40, 21, 1, 1, 1),
(25, 0.6, 5, '超型', 50, 101, 1, 1, 1),
(26, 1, 6, '微型', 10, 1, 1, 1, 1),
(27, 0.9, 6, '小型', 20, 2, 1, 1, 1),
(28, 0.8, 6, '中型', 30, 6, 1, 1, 1),
(29, 0.7, 6, '大型', 40, 21, 1, 1, 1),
(30, 0.6, 6, '超型', 50, 101, 1, 1, 1),
(31, 1, 7, '微型', 10, 1, 1, 1, 1),
(32, 0.9, 7, '小型', 20, 2, 1, 1, 1),
(33, 0.8, 7, '中型', 30, 6, 1, 1, 1),
(34, 0.7, 7, '大型', 40, 21, 1, 1, 1),
(35, 0.6, 7, '超型', 50, 101, 1, 1, 1),
(36, 2, 8, '微型', 10, 1, 1, 2, 15),
(37, 4, 8, '小型', 20, 2, 1, 5, 50),
(38, 7, 8, '中型', 30, 6, 3, 20, 200),
(39, 15, 8, '大型', 40, 21, 6, 50, 500),
(40, 70, 8, '超型', 50, 101, 10, 100, 1000),
(41, 2, 9, '微型', 10, 1, 1, 2, 15),
(42, 4, 9, '小型', 20, 2, 1, 5, 50),
(43, 7, 9, '中型', 30, 6, 3, 20, 200),
(44, 15, 9, '大型', 40, 21, 6, 50, 500),
(45, 70, 9, '超型', 50, 101, 10, 100, 1000),
(46, 2, 10, '微型', 10, 1, 1, 2, 15),
(47, 4, 10, '小型', 20, 2, 1, 5, 50),
(48, 7, 10, '中型', 30, 6, 3, 20, 200),
(49, 15, 10, '大型', 40, 21, 6, 50, 500),
(50, 70, 10, '超型', 50, 101, 10, 100, 1000),
(51, 2, 11, '微型', 10, 1, 1, 2, 15),
(52, 4, 11, '小型', 20, 2, 1, 5, 50),
(53, 7, 11, '中型', 30, 6, 3, 20, 200),
(54, 15, 11, '大型', 40, 21, 6, 50, 500),
(55, 70, 11, '超型', 50, 101, 10, 100, 1000),
(56, 2, 12, '微型', 10, 1, 1, 2, 15),
(57, 4, 12, '小型', 20, 2, 1, 5, 50),
(58, 7, 12, '中型', 30, 6, 3, 20, 200),
(59, 15, 12, '大型', 40, 21, 6, 50, 500),
(60, 70, 12, '超型', 50, 101, 10, 100, 1000),
(61, 2, 13, '微型', 10, 1, 1, 2, 15),
(62, 4, 13, '小型', 20, 2, 1, 5, 50),
(63, 7, 13, '中型', 30, 6, 3, 20, 200),
(64, 15, 13, '大型', 40, 21, 6, 50, 500),
(65, 70, 13, '超型', 50, 101, 10, 100, 1000),
(66, 2, 14, '微型', 10, 1, 1, 2, 15),
(67, 4, 14, '小型', 20, 2, 1, 5, 50),
(68, 7, 14, '中型', 30, 6, 3, 20, 200),
(69, 15, 14, '大型', 40, 21, 6, 50, 500),
(70, 70, 14, '超型', 50, 101, 10, 100, 1000),
(71, 2, 15, '微型', 10, 1, 15, 500, 15),
(72, 4, 15, '小型', 20, 2, 30, 1000, 10000),
(73, 7, 15, '中型', 30, 6, 50, 2000, 20000),
(74, 15, 15, '大型', 40, 21, 100, 5000, 100000),
(75, 70, 15, '超型', 50, 101, 200, 20000, 500000),
(76, 1, 16, '小型', 10, 1, 1, 50, 100),
(77, 1, 16, '中型', 30, 6, 3, 100, 200),
(78, 1, 16, '大型', 40, 21, 6, 200, 500);
