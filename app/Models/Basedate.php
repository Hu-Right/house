<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Basedate extends Model
{
    protected  $table;   

     /**
	 * 列表查询
	 *
	 * @param int $page_index
	 * @param number $page_size
	 * @param string $order
	 * @param string $where
	 * @param string $field
	 */
	public function pageQuery($page_index, $page_size, $condition, $order, $field)
	{
		$order = trim($order);
		$count = $this->where($condition)->count();
		if ($page_size == 0) {
			$list = $this->field($field)
				->where($condition)
				->order($order)
				->select();
			$page_count = 1;
		} else {
			$start_row = $page_size * ($page_index - 1);
			$list = $this->field($field)
				->where($condition)
				->order($order)
				->limit($start_row . "," . $page_size)
				->select();
			if ($count % $page_size == 0) {
				$page_count = $count / $page_size;
			} else {
				$page_count = (int) ($count / $page_size) + 1;
			}
		}
		return array(
			'data' => $list,
			'total_count' => $count,
			'page_count' => $page_count,
		);
	}
	
	/**
	 * 获取一定条件下的列表
	 */
	public function getQuery($condition = [], $field = '*', $order = '', $group = '')
	{
		$order = trim($order);
		if (empty($group)) {
			$list = $this->field($field)->where($condition)->order($order)->select();
		} else {
			$list = $this->field($field)->where($condition)->group($group)->order($order)->select();
		}
		
		return $list;
	}
}