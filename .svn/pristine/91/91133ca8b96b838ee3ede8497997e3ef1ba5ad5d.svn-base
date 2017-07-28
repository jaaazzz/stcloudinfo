<?php

defined('IN_ECS') OR die('Hacking attempt');

class gs_earning
{
    var $rate = 0.7;

    function format_money($float)
    {
        return '¥' . number_format($float,2,'.',',');
        /*$rmb = strval(number_format($float, 2, '.', ''));

        if (strlen($rmb) > 7)
        {
            $rmb = substr($rmb, 0, strlen($rmb) - 7) . ',' . substr($rmb, strlen($rmb) - 7, 7);
        }

        $rmb = '¥' . $rmb;

        return $rmb;*/
    }

    function handle_earning_info($order_sn)
    {
        $as_info = $GLOBALS['db']->getRow("
			SELECT * 
			FROM {$GLOBALS['ecs']->table('account_statement')} 
			WHERE order_sn = '$order_sn'
		");

        if (!$as_info)
        {
            return return_result(false, 'no such ac`s id.');
        }

        if ($as_info['is_trial'])
        {
            return return_result(false, 'the ac`s is for trial.');
        }

        $goods_infos = null;

        if ($as_info['order_type'] == GOT_FIRST OR $as_info['order_type'] == GOT_REASSEMBLE)
        {
            $goods_infos = $GLOBALS['db']->getAll("
				SELECT goods.developer_id,goods.goods_name,goods.goods_id,ri.price,goods.shop_price,start_time,end_time
				FROM {$GLOBALS['ecs']->table('reassemble_info')} ri,{$GLOBALS['ecs']->table('goods')} goods
				WHERE account_statement_id = '{$as_info['account_statement_id']}' and goods.goods_id = ri.goods_id
			");
        }
        elseif ($as_info['order_type'] == GOT_RENEW)
        {
            $goods_infos = $GLOBALS['db']->getAll("
				SELECT goods.developer_id,goods.goods_name,goods.goods_id,rn.price,goods.shop_price,start_time,end_time
				FROM {$GLOBALS['ecs']->table('renewal_goods')} rn,{$GLOBALS['ecs']->table('goods')} goods,
                    {$GLOBALS['ecs']->table('renewal_info')} ri
				WHERE ri.account_statement_id = '{$as_info['account_statement_id']}' and goods.goods_id = rn.goods_id
                    and ri.account_statement_id = rn.account_statement_id
			");
        }

        foreach ($goods_infos as $item)
        {
            if (!$item['is_official'])
            {
                $period = (intval($item['end_time']) - intval($item['start_time'])) / 24 / 3600 / 31;
                $earning_item = array(
                    'developer_id' => $item['developer_id'],
                    'earning'      => $item['price'] * $this->rate * $period,
                    'create_time'  => gmtime(),
                    'order_sn'     => $order_sn,
                    'goods_id'     => $item['goods_id'],
                    'goods_price'  => $item['shop_price'],
                    'goods_name'   => $item['goods_name'],
                    'paid'         => 0,
                    'order_name'   => 'unknown',
                    'rate'         => $this->rate
                );

                insert_to_db('earning', $earning_item);
            }
        }

        return return_result(1);
    }

    function get_user_list($starttime, $endtime, $search = '', $orderby = 'not_paid', $desc = 'desc', $page_size = 15, $page = 1)
    {
        $page      = intval($page);
        $page_size = intval($page_size);

        $start_time = strtotime($starttime);
        $end_time   = strtotime($endtime);

        $start_time = $start_time ? $start_time : strtotime('1970-1-1');
        $end_time   = $end_time ? $end_time : strtotime('2100-1-1');

        $orderby   = $orderby ? $orderby : 'not_paid';
        $desc      = $desc ? $desc : 'desc';
        $page_size = $page_size ? $page_size : 15;
        $page      = $page ? $page : 1;

        $sql =
            "SELECT userlist.*,users.user_name
			from {$GLOBALS['ecs']->table('users')} users, 
				(select developer_id,sum(earning) as amount,
					sum(case paid when 0 then earning else 0 end) as not_paid,
					sum(case paid when 1 then earning else 0 end) as paid ,
					sum(case paid when 0 then 1 else 0 end) as not_paid_count,
					sum(case paid when 1 then 1 else 0 end) as paid_count ,
					count(*) as deal_count
				FROM {$GLOBALS['ecs']->table('earning')} 
				where create_time >= $start_time and create_time <= $end_time
				group by developer_id) userlist
			where userlist.developer_id = users.user_id and (
				user_id like '%{$search}%' or user_name like '%{$search}%' or amount like '%{$search}%' 
				or paid like '%{$search}%' or not_paid like '%{$search}%' )	
			order by {$orderby} {$desc}";

        $record_count = $GLOBALS['db']->getOne("select count(*) from ($sql) t");

        $page_count = ceil($record_count / $page_size);

        $page = ($page_count > 0 && $page > $page_count - 1) ? $page_count : $page;

        $page_index = $page - 1;

        $limit_start = $page_size * $page_index;

        $all_result = $GLOBALS['db']->getAll(
            "select * from ($sql) t limit $limit_start,$page_size"
        );

        $summary = $GLOBALS['db']->getRow(
            "SELECT sum(earning) as amount,
				sum(case paid when 0 then earning else 0 end) as not_paid,
				sum(case paid when 1 then earning else 0 end) as paid ,
				sum(case paid when 0 then 1 else 0 end) as not_paid_count,
				sum(case paid when 1 then 1 else 0 end) as paid_count
			FROM {$GLOBALS['ecs']->table('earning')} 
			where create_time >= $start_time and create_time <= $end_time
		");

        $summary['amount']   = $this->format_money($summary['amount']);
        $summary['paid']     = $this->format_money($summary['paid']);
        $summary['not_paid'] = $this->format_money($summary['not_paid']);

        foreach ($all_result as &$item)
        {
            $item['style'] = $item['not_paid'] > 0 ? 'not_paid' : 'paid';
            $item['developer_id'] += 0;
            $item['amount']   = $this->format_money($item['amount']);
            $item['paid']     = $this->format_money($item['paid']);
            $item['not_paid'] = $this->format_money($item['not_paid']);
        }

        return array(
            'user_list'    => $all_result,
            'page_count'   => $page_count,
            'record_count' => $record_count,
            'page'         => $page,
            'page_size'    => $page_size,
            'summary'      => $summary,
            'orderby'      => $orderby,
            'desc'         => $desc
        );
    }

    function get_user_detail($developer_id, $starttime, $endtime, $search = '',
                             $orderby = 'not_paid', $desc = 'desc', $page_size = 50, $page = 1)
    {
        $page      = intval($page);
        $page_size = intval($page_size);

        $start_time = strtotime($starttime);
        $end_time   = strtotime($endtime);

        $start_time = $start_time ? $start_time : strtotime('1970-1-1');
        $end_time   = $end_time ? $end_time : strtotime('2100-1-1');

        $orderby   = $orderby ? $orderby : 'paid';
        $desc      = $desc ? $desc : 'asc';
        $page_size = $page_size ? $page_size : 15;
        $page      = $page ? $page : 1;

        $sql =
            "SELECT goods.cat_id,earning.*,users.user_name,ass.account_statement_id
			FROM {$GLOBALS['ecs']->table('users')} users, {$GLOBALS['ecs']->table('earning')} earning,
				{$GLOBALS['ecs']->table('account_statement')} ass,{$GLOBALS['ecs']->table('goods')} goods
			WHERE earning.create_time >= $start_time and earning.create_time <= $end_time and 
				earning.developer_id = users.user_id and earning.developer_id = '$developer_id' and
				ass.order_sn = earning.order_sn and goods.goods_id = earning.goods_id and (
				earning.goods_name like '%{$search}%' or earning.goods_id like '%{$search}%' 
				or paid like '%{$search}%' or earning.order_sn like '%{$search}%'  
				or goods_price like '%{$search}%' or rate like '%{$search}%')	
			ORDER by {$orderby} {$desc}";

        $record_count = $GLOBALS['db']->getOne("select count(*) from ($sql) t");

        $page_count = ceil($record_count / $page_size);

        $page = ($page_count > 0 && $page > $page_count - 1) ? $page_count : $page;

        $page_index = $page - 1;

        $limit_start = $page_size * $page_index;

        $all_result = $GLOBALS['db']->getAll(
            "select * from ($sql) t limit $limit_start,$page_size"
        );

        $summary = $GLOBALS['db']->getRow(
            "SELECT sum(earning) as amount,
		   		sum(case paid when 0 then earning else 0 end) as not_paid,
				sum(case paid when 1 then earning else 0 end) as paid,
				sum(case paid when 0 then 1 else 0 end) as not_paid_count,
				sum(case paid when 1 then 1 else 0 end) as paid_count
			FROM {$GLOBALS['ecs']->table('earning')} 
			where create_time >= $start_time and create_time <= $end_time and developer_id = $developer_id
		");

        $summary['amount']   = $this->format_money($summary['amount']);
        $summary['paid']     = $this->format_money($summary['paid']);
        $summary['not_paid'] = $this->format_money($summary['not_paid']);

        foreach ($all_result as &$item)
        {
            $item['earning_number'] = $item['earning'];
            $item['cat_nick_name']  = $GLOBALS['gis']->get_nick_name($item['cat_id']);
            //$item['cat_crumbs']     = $GLOBALS['gis']->get_cat_crumbs($item['cat_id']);
            //$item['cat_type']       = implode('', $GLOBALS['gis']->get_cat_crumbs($GLOBALS['gis']->get_top_parent($item['cat_id'])));
            $item['earning']        = $this->format_money($item['earning']);
            $item['paid']           = !!$item['paid'];
            $item['create_time']    = local_date($GLOBALS['_CFG']['time_format'], $item['create_time']);
        }

        $ori_user_info = get_user_by_id($developer_id);

        $user_info = array(
            'user_id'        => $ori_user_info['user_id'],
            'email'          => $ori_user_info['email'],
            'user_name'      => $ori_user_info['user_name'],
            'user_type'      => $ori_user_info['user_type'],
            'contact_name'   => $ori_user_info['contact_name'],
            'id_number'      => $ori_user_info['id_number'],
            'company'        => $ori_user_info['company'],
            'company_number' => $ori_user_info['company_number'],
            'bank_type'      => $ori_user_info['bank_type'],
            'debit_card'     => $ori_user_info['debit_card'],
            'address'        => $ori_user_info['address'],
            'bank_name'      => $ori_user_info['bank_name']
        );

        return array(
            'goods_list'   => $all_result,
            'page_count'   => $page_count,
            'record_count' => $record_count,
            'page'         => $page,
            'page_size'    => $page_size,
            'summary'      => $summary,
            'orderby'      => $orderby,
            'desc'         => $desc,
            'user_info'    => $user_info,
            'user_id'      => $developer_id
        );
    }

    function pay($eid_arr, $trade_no, $money, $admin_id, $admin_name, $user_id, $user_name, $bank, $bank_account, $bank_user)
    {
        if (!$eid_arr OR !$trade_no OR !$admin_id OR !$admin_name OR !$user_id OR !$user_name OR !$bank OR !$bank_account OR !$bank_user)
        {
            return return_result(0, '收益列表、交易号、管理员id、管理员用户名、用户id，用户名、银行名称、银行账号、银行收款人 都不能为空，添加失败');
        }

        $insert = array(
            'amount'       => $money,
            'admin_id'     => $admin_id,
            'admin_name'   => $admin_name,
            'trade_no'     => $trade_no,
            'eids'         => implode(',', $eid_arr),
            'create_time'  => gmtime(),

            'user_id'      => $user_id,
            'user_name'    => $user_name,
            'bank'         => $bank,
            'bank_account' => $bank_account,
            'bank_user'    => $bank_user
        );

        $remit_id = insert_to_db('remit', $insert);

        if ($remit_id < 1)
        {
            return return_result(0, '录入数据失败');
        }

        $error_count = 0;

        foreach ($eid_arr as $item)
        {
            $earning_item = $this->get_earning_by_id($item);

            update_to_db('earning', array('paid' => 1), " e_id = '$item'");

            if ($earning_item)
            {
                if (insert_to_db('remit_detail', array(
                    'remit_id'    => $remit_id,
                    'earning_id'  => $item,
                    'create_time' => gmtime(),
                    'money'       => $earning_item['earning']
                ))
                )
                {
                    continue;
                }
            }
            $error_count++;
        }

        if (!$error_count)
        {
            return return_result(1, '录入数据成功');
        }
        else
        {
            return return_result(0, '部分数据录入失败');
        }
    }

    function get_pay_history($user_id,$starttime, $endtime, $search, $orderby, $desc, $page_size, $page = 1)
    {
        $page      = intval($page);
        $page_size = intval($page_size);

        $start_time = strtotime($starttime);
        $end_time   = strtotime($endtime);

        $start_time = $start_time ? $start_time : strtotime('1970-1-1');
        $end_time   = $end_time ? $end_time : strtotime('2100-1-1');

        $orderby   = $orderby ? $orderby : 'create_time';
        $desc      = $desc ? $desc : 'desc';
        $page_size = $page_size ? $page_size : 15;
        $page      = $page ? $page : 1;

        $where_user = '';

        if($user_id)
        {
            $where_user = "and user_id = '$user_id'";
        }

        $sql =
            "SELECT *
		    from {$GLOBALS['ecs']->table('remit')}
		    where (amount like '%$search%' OR admin_id like '%$search%' OR trade_no like '%$search%' OR 
		   		eids like '%$search%' OR admin_name like '%$search%' OR user_id like '%$search%' OR 
		   		user_name like '%$search%' OR bank like '%$search%' OR 
		   		bank_account like '%$search%' OR bank_user like '%$search%' ) and
				create_time >= $start_time and create_time <= $end_time $where_user
			order by $orderby $desc
		";

        $record_count = $GLOBALS['db']->getOne("select count(*) from ($sql) t");

        $page_count = ceil($record_count / $page_size);

        $page = ($page_count > 0 && $page > $page_count - 1) ? $page_count : $page;

        $page_index = $page - 1;

        $limit_start = $page_size * $page_index;

        $all_result = $GLOBALS['db']->getAll(
            "select * from ($sql) t limit $limit_start,$page_size"
        );

        foreach ($all_result as &$item)
        {
            $item['amount']      = $this->format_money($item['amount']);
            $item['create_time'] = local_date($GLOBALS['_CFG']['time_format'], $item['create_time']);
        }

        return array(
            'result'       => $all_result,
            'page_count'   => $page_count,
            'record_count' => $record_count,
            'page'         => $page,
            'page_size'    => $page_size,
            'summary'      => $summary,
            'orderby'      => $orderby,
            'desc'         => $desc
        );
    }

    function get_pay_summary($user_id,$starttime, $endtime)
    {
        $start_time = strtotime($starttime);
        $end_time   = strtotime($endtime);

        $where_sql = "";

        if($user_id)
        {
            $where_sql = "and user_id = '$user_id'";
        }

        $start_time = $start_time ? $start_time : strtotime('1970-1-1');
        $end_time   = $end_time ? $end_time : strtotime('2100-1-1');

        $result = $GLOBALS['db']->getRow("
            SELECT sum(amount) as amount
            FROM {$GLOBALS['ecs']->table('remit')}
            WHERE create_time >= $start_time and create_time <= $end_time $where_sql");

        $result['amount'] = $this->format_money($result['amount']);
        return $result;
    }

    function get_user_summary($developer_id, $starttime, $endtime)
    {
        $start_time = strtotime($starttime);
        $end_time   = strtotime($endtime);

        $start_time = $start_time ? $start_time : strtotime('1970-1-1');
        $end_time   = $end_time ? $end_time : strtotime('2100-1-1');

        $summary = $GLOBALS['db']->getRow(
            "SELECT sum(earning) as amount,
		   		sum(case paid when 0 then earning else 0 end) as not_paid,
				sum(case paid when 1 then earning else 0 end) as paid,
				sum(case paid when 0 then 1 else 0 end) as not_paid_count,
				sum(case paid when 1 then 1 else 0 end) as paid_count
			FROM {$GLOBALS['ecs']->table('earning')}
			WHERE create_time >= '$start_time' and create_time <= '$end_time' and developer_id = $developer_id
		");

        $summary['amount']   = $this->format_money($summary['amount']);
        $summary['paid']     = $this->format_money($summary['paid']);
        $summary['not_paid'] = $this->format_money($summary['not_paid']);

        return $summary;
    }

    function get_earning_by_id($id)
    {
        return $GLOBALS['db']->getRow("select * from {$GLOBALS['ecs']->table('earning')} where e_id = '$id'");
    }
}

$earning = new gs_earning();