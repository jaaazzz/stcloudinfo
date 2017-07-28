<?php 
admin_priv('gisstore_base_plugin');


function adefault()
{
	$data = $GLOBALS['db']->getAll("
		select bp.*,cate.cat_id ,goods.goods_name
		from {$GLOBALS['ecs']->table('base_plugin')} bp,{$GLOBALS['ecs']->table('category')} cate
			,{$GLOBALS['ecs']->table('goods')} goods
		where goods.goods_id = bp.p_id and cate.cat_id = bp.top_cat_id
		order by sort asc
	");

	$idx = 1;

	foreach ($data as &$item) 
	{
		$item['cat_name'] = implode('&gt;', $GLOBALS['gis']->get_cat_crumbs($item['cat_id'])) ;	
		$item['idx'] = $idx ++;
	}

	$GLOBALS['smarty']->assign('action_link', array(
		'href' => 'gisstore.php?mod=base_plugin&act=edit',
		'text' => '添加新纪录'
	));
	
	$GLOBALS['smarty']->assign('list',$data);
	assign_query_info();
	$GLOBALS['smarty']->display('gisstore_base_plugin.htm');
}

function edit()
{
	$mode = 'insert';

	$bp_id = 0;

	if(isset($_POST['bp_id']))
	{
		$bp_id = intval($_POST['bp_id']);

		$top_cat_id = intval(trim($_POST['p_id']));
		$p_id = intval(trim($_POST['plg_id']));
		$sort = intval(trim($_POST['sort']));		

		$is_basic = isset($_POST['is_basic']);
		$specific = mysql_real_escape_string($_POST['specific']);

		if($top_cat_id < 1)
		{
			$GLOBALS['smarty']->assign('err_msg','父类别id格式不对');
			$GLOBALS['smarty']->display('gisstore_base_plugin.htm');
			die;
		}

		if($p_id < 1)
		{
			$GLOBALS['smarty']->assign('err_msg','插件id格式不对');	
			$GLOBALS['smarty']->display('gisstore_base_plugin.htm');
			die;		
		}

		if( empty($specific) )
		{
			$GLOBALS['smarty']->assign('err_msg','没选择java还是.Net');	
			$GLOBALS['smarty']->display('gisstore_base_plugin.htm');
			die;		
		}

		$goods_info = get_goods_by_id($p_id);

		if( ! $goods_info )
		{
			$GLOBALS['smarty']->assign('err_msg','不存在该插件');	
			$GLOBALS['smarty']->display('gisstore_base_plugin.htm');
			die;
		}

		if( ! $GLOBALS['gis']->is_plugin($goods_info['cat_id']))
		{
			$GLOBALS['smarty']->assign('err_msg','该商品不是插件');	
			$GLOBALS['smarty']->display('gisstore_base_plugin.htm');
			die;
		}

		$i_o = array(
			'top_cat_id' => $top_cat_id,
			'p_id'       => $p_id,
			'sort'       => $sort,
			'is_basic'   => $is_basic,
			'specifics'  => $specific
		);

		if($bp_id == 0)
		{
			$ret = insert_to_db('base_plugin',$i_o);

			if($ret > 0)
			{
				clear_cache_files();
				$GLOBALS['smarty']->assign('msg','添加成功');
			}
			else
			{
				$GLOBALS['smarty']->assign('err_msg','添加失败');
			}
		}
		else
		{
			$ret = update_to_db( 'base_plugin', $i_o, "bp_id='$bp_id'" );
			clear_cache_files();
			$GLOBALS['smarty']->assign('msg','更新成功');			
		}
	}	

	if($bp_id OR isset($_REQUEST['id']))
	{
		$bp_id = $bp_id ? $bp_id : intval($_REQUEST['id']);

		$mode = 'edit';

		$data = $GLOBALS['db']->getRow(
			"select * from {$GLOBALS['ecs']->table('base_plugin')} where bp_id = '$bp_id'"
		);

		if( ! $data)
		{
			$bp_id = 0;
			$GLOBALS['smarty']->assign('err_msg','不存在该记录');
		}
		else
		{
			$GLOBALS['smarty']->assign('data',$data);
		}
	}

	$GLOBALS['smarty']->assign('bp_id',$bp_id);
	assign_query_info();
	$GLOBALS['smarty']->display('gisstore_base_plugin.htm');
}

function delete()
{
	$id = isset($_POST['id']) ? intval($_POST['id']) : 0;

	if( ! $id)
	{ 
		die_result(false,'删除失败'); 
	}

	$GLOBALS['db']->query("
		delete from {$GLOBALS['ecs']->table('base_plugin')} where bp_id = '$id'
	");	
	
	clear_cache_files();
	die_result(true,'删除成功');
}