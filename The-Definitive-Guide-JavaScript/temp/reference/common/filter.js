/**
 *  pc/移动端通用过滤器
 */
var emmsLib = (function(lib){
	
	lib.MalfunctionStatusFilter = function() {

		return function(status) {
			if (status == 'investigate') {
				return '待审批';
			}
			if (status == 'declare') {
				return '待认领';
			}
			if (status == 'verify') {
				return '待确认';
			}
			if (status == 'audit') {
				return '待审批';
			}
			if (status == 'repairing') {
				return '待修复';
			}
		}
	
	}
	
	lib.UnitFilter = function() {
		
		return function(status) {
			if (status == 'single') {
				return '单次';
			}
			if (status == 'week') {
				return '周';
			}
			if (status == 'month') {
				return '月';
			}
			if (status == 'year') {
				return '年';
			}
		}
		
	}
	
	return lib;
	
}(emmsLib || {}));

