/**
	 * description - 过滤器
	 * create - Nelson.Xuezi.hu
	 * date - 2017-12-23
	 */
var emmsModule = (function(app, lib) {
	var emms = app.emms;

	// 日期格式yyyy-MM-dd
	emms.filter('filterLogin', function() {
		return function(form) {
			if (form != null && angular.isString(form)  && form != '' ) {
				return timeStr.substr(0, timeStr.indexOf(" "));
			}
		}
	});
	
	emms.filter('maintenanceCycleType',function() {

		return function(status) {
			if (status == 'single') {
				return '天';
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

	// 日期格式yyyy-MM-dd
	emms.filter('withDate', function() {
		return function(timeStr) {
			if (timeStr != null && timeStr != '') {
				return timeStr.substr(0, timeStr.indexOf(" "));
			}
		}
	});
	
	// 日期格式yyyy-MM-dd HH:MM
	emms.filter('withMinute', function() {
		return function(timeStr) {
			if (timeStr != null && timeStr != '') {
				return timeStr.substr(0, timeStr.lastIndexOf(":"));
			}
		}
	});
	
	// 车辆子流程状态转换
	emms.filter('VehicleSubProcessStatusFilter', function() {
			return function(status) {
				if (status == 'cancel') {
					return '已拒绝';
				}
				if (status == 'canceled') {
					return '已取消';
				}
				if (status == 'agree') {
					return '已同意';
				}
				if (status == 'auditing') {
					return '审批中';
				}
				if (status == 'wait') {
					return '等待派车';
				}
				if (!status) {
					return '待发起';
				}
			}
	});
	
	//工单结果转换
	emms.filter('jobOrderTaskResultFilter', function() {
		return function(status) {
			if (status == 'cancel') {
				return '取消';
			}
			if (status == 'agree') {
				return '同意';
			}
			if (status == 'reject') {
				return '拒绝';
			}
			if (status == 'recall') {
				return '撤回';
			}
			if (status == 'change') {
				return '变更';
			}
			if (status == 'complete') {
				return '完成';
			}
			if (status == 'holdOn') {
				return '挂起';
			}
			if (status == 'verify') {
				return '已确认';
			}
			if (status == 'close') {
				return '关闭';
			}
			if (status == 'start') {
				return '开始';
			}
			if (!status) {
				return '完成';
			}
			
		}
	});
	
	// 车辆流程状态转换
	emms.filter('VehicleFlowStatusFilter', function() {
		return function(status) {
			var statusStr = '';
			switch (status) {
			case 'wait':
				statusStr = "待发起";
				break;
			case 'dispatch':
				statusStr = "调度";
				break;
			case 'assign':
				statusStr = "分派";
				break;
			case 'declare':
				statusStr = "认领";
				break;
			case 'audit':
				statusStr = "审批";
				break;
			case 'repair':
				statusStr = "修复";
				break;
			case 'verify':
				statusStr = "确认";
				break;
			case 'close':
				statusStr = "关闭";
				break;
			case 'workingCarApplicationAudit':
				statusStr = "申请审批";
				break;
			case 'carApplicationAudit':
				statusStr = "申请审批";
				break;
			case 'carApplicationOrder':
				statusStr = "变更";
				break;
			case 'carOrderStart':
				statusStr = "派车单开始";
				break;
			case 'carOrderEnd':
				statusStr = "派车单结束";
				break;
			case 'orderAudit':
				statusStr = "审批出车顺序";
				break;
			case 'hitchAudit':
				statusStr = "审批搭乘请求";
				break;
			case 'workingCarApplicationOrder':
				statusStr = "变更";
				break;
			case 'workingCarOrderStart':
				statusStr = "派车单开始";
				break;
			case 'workingCarOrderEnd':
				statusStr = "派车单结束";
				break;
			case 'boardOrder':
				statusStr = "乘车单";
				break;
	   }
			
			return statusStr;
			
	}
});
	
	// 工单类型转换
	emms.filter('JobticketTypeFilter', function() {
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
	
	//秒转换为天时分
	emms.filter('SecondFilter',function(){
	    return function(inputArray){
	    	var time = inputArray;
	        if (null != time && "" != time) {
                if (time > 60 && time < 60 * 60) {
                    time = parseInt(time / 60.0) + "分钟" + parseInt((parseFloat(time / 60.0) -
                        parseInt(time / 60.0)) * 60) + "秒";
                }else if (time >= 60 * 60 && time < 60 * 60 * 24) {
                    time = parseInt(time / 3600.0) + "小时" + parseInt((parseFloat(time / 3600.0) -
                        parseInt(time / 3600.0)) * 60) + "分钟" +
                        parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                        parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
                } else if (time >= 60 * 60 * 24) {
                    time = parseInt(time / 3600.0/24) + "天" +parseInt((parseFloat(time / 3600.0/24)-
                        parseInt(time / 3600.0/24))*24) + "小时" + parseInt((parseFloat(time / 3600.0) -
                        parseInt(time / 3600.0)) * 60) + "分钟" +
                        parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                        parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
                }else {
                    time = parseInt(time) + "秒";
                }
	        }
	        return time;
	    }
	});
	
	// 安装区域类型转换
	emms.filter('InstallAreaNameFilter', function() {
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
	emms.filter('MalfunctionStatusFilter', lib.MalfunctionStatusFilter);
	
	// 
	emms.filter('UnitFilter', lib.UnitFilter);
	
	return app;
	
}(emmsModule || {}, emmsLib || {}));
