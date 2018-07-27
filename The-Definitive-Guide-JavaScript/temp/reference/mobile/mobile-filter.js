/**
 * description - mobile filter
 * create - Nelson.Xuezi.Hu
 * date - 2018-1-15
 */
var emmsMobileModule = (function(mobileApp, lib) {
	var emmsMobile = mobileApp.emmsMobile;
	
	// 日期格式yyyy-MM-dd HH:MM
	emmsMobile.filter('withMinute', function() {
		return function(timeStr) {
			if (timeStr != null && timeStr != '') {
				return timeStr.substr(0, timeStr.lastIndexOf(":"));
			}
		}
	});
	
	// 日期格式 MM-dd HH:MM
	emmsMobile.filter('withDateHourMinute', function() {
		return function(timeStr) {
			if (timeStr) {
				return timeStr.slice(5, 16);
			}
		}
	});
	
	// 工单类型转换
	emmsMobile.filter('JobticketTypeFilter', function() {
			return function(status) {
				if (status == 'schedule') {
					return '计划修';
				}
				if (status == 'malfunction') {
					return '故障修';
				}
				if (status == 'temporary') {
					return '临时修';
				}
			}
	});
	
	
	// 巡查任务状态转换
	emmsMobile.filter('PatrolTypeFilter', function() {
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
	});
	
	// 巡查任务类型转换
	emmsMobile.filter('PatrolScheduleStatusFilter', function() {
		return function(status) {
			if (status == 'startCheck') {
				return '开始巡查';
			}
			if (status == 'endCheck') {
				return '结束巡查';
			}
		}
	});
	
	// 安装区域类型转换
	emmsMobile.filter('InstallAreaNameFilter', function() {
		return function(areaName) {
			var areaType = '';
			var childrenArea = ''; 
			var installAreaName = ''; 
			if (areaName) {
				installAreaName = areaName.name;
				if (areaName.childrenArea) {
					childrenArea = areaName.childrenArea.name;
					if (areaName.childrenArea.areaType) {
						areaType = areaName.childrenArea.areaType.name;
					}
				}
			}
			return areaType + childrenArea + installAreaName;
			
		}
	});
	
	// 故障单业务转换
	emmsMobile.filter('MalfunctionStatusFilter', lib.MalfunctionStatusFilter);
	
	
	return mobileApp;
}(emmsMobileModule || {}, emmsLib || {}));