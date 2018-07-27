/**
 * description - resolve malfunctions mobile related operation
 * create - Nelson.Xuezi.Hu
 * date - 2017-9-15
 */
var emmsMobileModule = (function(mobileApp) {
	var emmsMobile = mobileApp.emmsMobile;
	
	emmsMobile.factory('Malfunction',['$resource', function($resource){
		return $resource('/mobile/malfunctions/:id',{},{
			save: {
				method: 'POST',
			},
			queryImage: {
				method: 'GET',
				url:'/mobile/malfunctions/:id/images',
				isArray: true,
			},
			managedMalfunction:{
				method:'GET',
				url:'/mobile/malfunctions/managedMalfunction'
			}
		});
	}]);
	
	// 故障草稿箱
	emmsMobile.factory('MalfunctionDraft',['$resource', function($resource){
		return $resource('/mobile/malfunctions/drafts/:id',{},{
			saveAndStart: {
				url: '/mobile/malfunctions/start',
				method: 'POST'
			},
		});
	}]);
	
	// 故障任务
	emmsMobile.factory('MalfunctionTask', ['$resource', function($resource){
		return $resource('/mobile/malfunctions/tasks/:malfunctionId',{},{
			self: {
				method: 'GET',
				url: '/mobile/malfunctions/tasks/self',
				isArray: true,
			},
			complete: {
				method: 'POST',
				url: '/mobile/malfunctions/tasks/complete',
			},
			tasks: {
				method: 'POST',
				url: '/mobile/malfunctions/tasks',
			},
		});
	}]);
	
	emmsMobile.factory('MalfunctionReason', ['$resource', function($resource) {
		return $resource('/system/malfunctionReasons/:id/:type', {}, {
			querys: {
				method: 'GET',
				isArray: true,
				 url:'/system/malfunctionReasons/all'
			},
		});
	}]);
	
	emmsMobile.factory("MalfunctionDealResult", ['$resource', function($resource){
		return $resource('/system/malfunctionDealResults/:id', {}, {
			querys: {
				method: 'GET',
				isArray: true,
                url:'/system/malfunctionDealResults/all'
			},
		});
	}]);
	
	// 图片资源
	emmsMobile.factory('Image',['$resource', function($resource){
		return $resource('/images/:imgId',{},{
			save: {
				url: '/images/mobile',
				method: 'POST',
			},
		});
	}]);
	
	emmsMobile.factory('Device', ['$resource', function($resource){
		return $resource('/mobile/devices/search/:id', {}, {
			queryDetailByNumber: {
				method: 'GET',
				url: '/mobile/devices/detail/number'
			},
			queryDetailById: {
				method: 'GET',
				url: '/mobile/devices/search/:id'
			},
			dimSearch: {
				method: 'GET',
				url: '/mobile/devices/dimSearch'
			},
		});
	}]);
	
	emmsMobile.factory('Level', ['$resource', function($resource){
		return $resource('/malfunctions/levels/:id');
	}]);
	
	emmsMobile.factory('UserInfo', ['$resource', function($resource) {
		return $resource('/mobile/users/info/:id', {}, {
			updatePassword: {
				method: 'POST',
				url: '/system/users/info/',
				interceptor: {
					response: function(response) {
						var result = response.resource;
						result.$status = response.status;
						return result;
					}
				}
			},
			nearInfoShow: {
				method: 'GET',
				url: '/mobile/users/infoShow/:objectId',
			},
			 getLoginName:{
			    method: 'GET',
				url:'/system/users/getLoginName'
			},
		});
	}]);
	
	emmsMobile.factory("Line", ['$resource', function($resource){
		return $resource('/maps/lines/:id');
	}]);
	
	emmsMobile.factory("MapLevel", ['$resource', function($resource){
		return $resource('/maps/levels/:id');
	}]);
	emmsMobile.factory("Map", ['$resource', function($resource){
		return $resource('/maps/location/:type/:id/:floor',{},{
			locations: {
				method:'GET',
				url:'/maps/locations/:type',
				isArray: true,	
			},
			lineDistance:{
				method:'POST',
				url:'/maps',
				isArray: true,	
			},
			queryPath:{
				method:'GET',
				url:'/maps/staffOrVehicle/:num',
			}
		});
	}]);
	
	emmsMobile.factory("Staff", ['$resource', function($resource){
		return $resource('/system/staffs/:id/:deptId/:name', {}, {
			staffNameOrDeptLike: {
				method: 'GET',
				url: '/system/staffs/query/'
			},
			staffWithJobOualifications: {
				method: 'GET',
				url: '/system/staffs/jobQualifications/'
			},
		});
	}]);
	
	emmsMobile.factory("AmqpMsg", ['$resource', function($resource){
		return $resource('/amqp/message/:id', {id:'@id'}, {
			find: {
				method: 'GET',
				isArray: true
			},
			read: {
				method: 'GET',
				isArray: true
			},
			findHTaskId: {
				url: '/malfunctions/HTask/:instanceId',
				params: {instanceId:'@instanceId'},
				method: 'GET'
			},
			readMsg: {
				method: 'POST',
				url: '/amqp/message/readByTaskId'
			}
		});
	}]);
	
	emmsMobile.factory("EmergencyGroup", ['$resource', function($resource){
		return $resource('/system/staffs/emergencyGroup', {}, {
			queryPage: {
				method: 'GET'
			}
		});
	}]);
	
	emmsMobile.factory("VehicleConfiguration", ['$resource', function($resource){
		return $resource('/vehicleConfigurations/:id/:pId/:code', {id:'@id'}, {
			getTypes: {
				method: 'GET',
				isArray: true,
				url:'/vehicleConfigurations/allChildren/:code',
			}
		});
	}]);
	
	//车辆流程任务资源工厂	
	emmsMobile.factory('VehicleTask', ['$resource', function($resource) {
		return $resource('/mobile/vehicles/flows/tasks/:taskId', {}, {
			start: {
				method: 'GET',
				url: '/mobile/vehicles/flows/start/:id'
			},
			complete: {
				method: 'POST'
			}
		}); 
	}]);

	emmsMobile.factory('VehicleDraft', ['$resource', function($resource) {
		return $resource('/mobile/vehicles/applications/drafts'); 
	}]);

	emmsMobile.factory('VehicleApplication', ['$resource', function($resource) {
		return $resource('/mobile/vehicles/applications/:id', {}, {
			create: {
				method: 'POST',
				url: '/mobile/vehicles/applications/:type',
				interceptor: {
					response: function(response) {
						var result = {};
						result.data = response.data;
						result.status = response.status;
						return result;
					}
				}
			},
			update: {
				method: 'PUT',
				url: '/mobile/vehicles/applications/:type',
				interceptor: {
					response: function(response) {
						var result = {};
						result.data = response.data;
						result.status = response.status;
						return result;
					}
				}
			}
		}); 
	}]);
	
	// 线路资源
	emmsMobile.factory('Stations', ['$resource', function($resource) {
		return $resource('/maps/lineStations', {}, {
			search: {
				url: '/maps/stations',
				method: 'GET'
			}
		}); 
	}]);
	
	// 车辆相关资源
	emmsMobile.factory('VehicleInfo', ['$resource', function($resource) {
		return $resource('/vehicles/info/:id', {}, {
			getTypes: {
				method: 'GET',
				isArray: true,
				url: '/vehicles/info/type'
					}
		});
	}]);
	
	// 部门资源
	emmsMobile.factory('Dept', ['$resource', function($resource){
		return $resource('/system/depts/:id/:type/:num/:pid', {}, {

			getDispatherableDepts: { // 允许调度的公司
				method: 'GET',
				isArray: true,
				url: '/system/depts/getDispatherableDepts'
			},
			havingDispatch: { // 该公司内是否含有调度权限的人
				method:'GET',
				url:'/malfunctions/havingDispatch/:deptNum'
			},
			query: {
				method: 'GET',
				isArray: false,
				interceptor: {
					response: function(response) {
						var result = response.resource;
						result.$status = response.status;
						return result;
					}
				}
			},
			queryDept: {
				method: 'GET',
				url:'/system/depts/getDept/:id'
			},
			queryPage:{
				url:'/system/staffs',
				method: 'GET',
			},
			queryDeptTree: {
				method: 'GET',
				isArray: true,
				url:'/system/depts/deptTree/:type'
			},
			dimSearch: {
				method: 'GET',
				url: '/system/depts/dimSearch'
			}
		});
	}]);
	
	/**
	 * 周计划和工单Resource
	 */
	
	// 工单
	emmsMobile.factory("JobOrder", ['$resource', function($resource){
		return $resource('/mobile/jobOrders/:id', {}, {
			update: {
				method: 'PUT'
			}
		});
	}]);
	
	// 工单任务
	emmsMobile.factory("JobOrderTask", ['$resource', function($resource){
		return $resource('/mobile/jobOrders/flows/tasks/:taskId', {}, {
			start: {
				method: 'GET',
				url: '/mobile/jobOrders/flows/start/:id'
			},
			complete: {
				method: 'GET',
				url: '/mobile/jobOrders/flows/tasks/:taskId/:id'
			},
			completeItems: {
				method: 'POST',
				url: '/mobile/jobOrders/flows/tasks/completeItems'
			},
			inout: {
				method: 'POST',
				url: '/jobOrders/inout',
				isArray: true,
			},
			saveJobOrderTask: {
				method: 'POST',
				url: '/jobOrderTasks'
			}
		});
	}]);
	
	// 工单草稿
	emmsMobile.factory("JobOrderDraft", ['$resource', function($resource){
		return $resource('/mobile/jobOrders/drafts/:id', {}, {
			save: {
				method: 'POST',
				interceptor: {
					response: function(response) {
						var result = response.resource;
						result.$status = response.status;
						result.data = response.data;
						return result;
					}
				}
			},
			update: {
				method: 'PUT',
				interceptor: {
					response: function(response) {
						var result = response.resource;
						result.$status = response.status;
						result.data = response.data;
						return result;
					}
				}
			}
		});
	}]);	
	
	// 子区域
	emmsMobile.factory('ChildAreaName', ['$resource', function($resource) {
		
		return $resource('/areaNames/childAreaNames/:id', {}, {
			dimSearch: {
				method: 'GET',
				url: '/areaNames/childAreaNames/dimSearch'
			}
		});
		
	}]);
	
	// 检修项
	emmsMobile.factory('MaintenanceProcedureContent', ['$resource', function($resource) {
		
		return $resource('/maintenanceProcedure/maintenanceProcedureContents/:id', {}, {
			searchByDevice: { // 根据设备模糊查找检修项
				method: 'GET',
				url: '/maintenanceProcedure/maintenanceProcedureContents/byDevice/:deviceId'
			}
		});
		
	}]);
	
	// 检修项
	emmsMobile.factory('MaintenanceSchedule', ['$resource', function($resource) {
		
		return $resource('/maintenanceSchedules/:id', {}, {
			dimSearch: {
				method: 'GET',
				url: '/maintenanceSchedules/dimSearch'
			}
		});
		
	}]);
	
	emmsMobile.factory('JobQualification', ['$resource', function($resource) {
		return $resource('/system/jobQualifications/:id', {}, {
			update: {
				method: 'PUT'
			}
		}); 
	}]);
		
	
	// 作业资格有效期
	emmsMobile.factory('JobQualificationValidity', ['$resource', function($resource) {
		return $resource('/system/jobQualifications/jobQualificationValidities/:id', {}, {
			update: {
				method: 'PUT'
			},
			hasJobQualification: {
				url: '/system/jobQualifications/jobQualificationValidities/:deptId/:jobQualificationId',
				method: 'GET',
			},
			getByStaff: {
				url: '/system/jobQualifications/jobQualificationValidities/staff/:id',
				method: 'GET',
				isArray: true
			}
		}); 
	}]);
	
	// 区域类型
	emmsMobile.factory('AreaType', ['$resource', function($resource){
		return $resource('/areaTypes/:id', {id:'@id'}, {
			areaTree:{
				url:'/areaTypes/areaTree',
				method: 'GET',
				isArray: true
			},
		});
	}]);
	
	
	// 周计划任务
	emmsMobile.factory("WeekScheduleTask", ['$resource', function($resource){
		return $resource('/weekSchedules/tasks/:taskId', {}, {
			checkCollision: {
				method: 'GET',
				url: '/mobile/jobOrders/checkCollision',
				isArray: true
			}
		});
	}]);
	
	// 子区域(站点)
	emmsMobile.factory("ChildrenArea", ['$resource', function($resource){
		return $resource('/childrenAreas/:id', {id:'@id'}, {
			dimSearch: {
				url: '/childrenAreas/dimSearch',
				method: 'GET',
			}
		});
	}]);
	
	// 检修项
	emmsMobile.factory("MaintenanceProcedureContent", ['$resource', function($resource){
		return $resource('/maintenanceProcedure/maintenanceProcedureContents/:id', {}, {
			update: {
				method: 'PUT'
			},
			searchByDevice: { // 根据设备模糊查找检修项
				method: 'GET',
				url: '/maintenanceProcedure/maintenanceProcedureContents/byDevice/:deviceId'
			}
		});
	}]);
	
	// 物料
	emmsMobile.factory("MaterialInfo", ['$resource', function($resource){
		return $resource('/materials/:id', {id:'@id'}, {
			queryPage: {
				method: 'GET'
			},
			inout:{
				url:'/materials/inout',
				method:'POST',
				interceptor: {
					response: function(response) {
						var result = response.resource;
						result.$status = response.status;
						return result;
					}
				}
			},
			getStockSum: {
				url:'/materials/stockSum',
				method: 'GET'
			}
		});
	}]);
	
	/**
	 *  巡查相关
	 */
	
	// 巡查事件
	emmsMobile.factory('PatrolEvent',['$resource', function($resource){
		return $resource('/patrol/events/:id',{},{
			states: {
				method: 'GET',
				url:'/mobile/patrol/events/states',
				isArray: true,
			}
		});
	}]);
	
	// 巡查事件草稿箱
	emmsMobile.factory('PatrolEventDraft',['$resource', function($resource){
		return $resource('/mobile/patrol/events/drafts/:id',{},{
			saveAndStart: {
				url: '/mobile/patrol/events/start',
				method: 'POST'
			},
		});
	}]);
	
	// 巡查事件任务
	emmsMobile.factory('PatrolEventTask', ['$resource', function($resource){
		return $resource('/mobile/patrol/events/tasks/:patrolEventId',{},{
			self: {
				method: 'GET',
				url: '/mobile/patrol/events/tasks/self',
				isArray: true,
			},
			complete: {
				method: 'POST',
				url: '/mobile/patrol/events/tasks/complete',
			},
			tasks: {
				method: 'POST',
				url: '/mobile/patrol/events/tasks',
			},
		});
	}]);
	
	// 巡查任务
	emmsMobile.factory('PatrolTask', ['$resource', function($resource){
		return $resource('/mobile/patrol/tasks/:patrolTaskId',{},{
			start: {
				url: '/mobile/patrol/tasks/start',
				method: 'POST'
			},
			self: {
				method: 'GET',
				url: '/mobile/patrol/tasks/self',
				isArray: true,
			},
			complete: {
				method: 'POST',
				url: '/mobile/patrol/tasks/complete',
			},
			tasks: {
				method: 'POST',
				url: '/mobile/patrol/tasks',
			},
			states: {
				method: 'GET',
				url: '/mobile/patrol/tasks/states',
				isArray: true
			}
		});
	}]);
	
	// 用车单
	emmsMobile.factory('VehicleApplication',['$resource', function($resource){
		return $resource('/mobile/vehicle/applications/:id',{},{
			states: {
				method: 'GET',
				url:'/mobile/vehicle/applications/states',
				isArray: true,
			}
		});
	}]);
	
	// 用车单草稿箱
	emmsMobile.factory('VehicleApplicationDraft',['$resource', function($resource){
		return $resource('/mobile/vehicle/applications/:id',{},{
			saveAndStart: {
				url: '/mobile/vehicle/applications/start',
				method: 'POST'
			}
		});
	}]);
	
	// 用车单任务(用户)
	emmsMobile.factory('VehicleApplicationUserTask', ['$resource', function($resource){
		return $resource('/mobile/vehicle/applications/tasks/:vehicleApplicationId',{},{
			complete: {
				method: 'POST',
				url: '/mobilevehicle/applications/tasks/complete',
			},
			tasks: {
				method: 'POST',
				url: '/mobile/vehicle/applications/tasks',
				params : {isApply : true}
			}
		});
	}]);
	
	emmsMobile.factory('VehicleDispatcher',['$resource', function($resource){
		return $resource('/mobile/vehicle/dispatcherManager/:id',{},{
			dispatcherStates: { // 派车单状态-司机使用
				method: 'GET',
				url:'/mobile/vehicle/dispatcherManager/dispatchers/states',
				isArray: true,
			},
		});
	}]);
	
	// 派车单任务-司机使用
	emmsMobile.factory('VehicleDispatcherDriverTask', ['$resource', function($resource){
		return $resource('/mobile/vehicle/dispatcherManager/tasks/:vehicleDispatcherId',{},{
			self: {
				method: 'GET',
				url: '/mobile/vehicle/dispatcherManager/tasks/self',
				params: {isDriver: true},
				isArray: true,
			},
			complete: {
				method: 'POST',
				url: '/mobile/vehicle/dispatcherManager/tasks/complete',
			},
			tasks: {
				method: 'POST',
				url: '/mobile/vehicle/dispatcherManager/tasks',
				params: {isDriver: true}
			}
		});
	}]);
	
	// 工单任务
	emmsMobile.factory('JobticketTask',['$resource', function($resource){
		return $resource('/mobile/jobtickets/tasks/:jobticketId',{},{
			self: {
				method: 'GET',
				url: '/mobile/jobtickets/tasks/self',
				isArray: true,
			},
			complete: {
				method: 'POST',
				url: '/mobile/jobtickets/tasks/complete',
			}
		});
	}]);
	
	// 临时作业
	emmsMobile.factory('TemporaryJobTicket',['$resource', function($resource){
		return $resource('/jobtickets/temporary/:id', {}, {});
	}]);
	
	
	return mobileApp;
}(emmsMobileModule || {}));