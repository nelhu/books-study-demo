/**
 * description - related config for emms mobile app
 * create - Nelson.Xuezi.Hu
 * date - 2017-09-10
 */
var emmsMobileModule = (function(mobileApp, lib){
	
	var emmsMobile = angular.module("emmsMobile", ['ui.router', 'ngAnimate', 'ui.bootstrap', 'mobile-angular-ui', 
		'mobile-angular-ui.gestures', 'ngResource', 'amap', 'leaflet', 'oitozero.ngSweetAlert', 'blockUI', 'ng-mfb']);
	
	
	emmsMobile.config(['$stateProvider', '$urlRouterProvider', 'blockUIConfig', '$httpProvider',
		function ($stateProvider, $urlRouterProvider, blockUIConfig, $httpProvider) {
		
		$stateProvider
		.state('self', {
            url:'/self',
            abstract: true
        })
        .state('self.me', {
            url:'/me',
            templateUrl: '/mobile/users/me',
            controller: 'AboutMeMobileCtrl'
        })
        .state('self.detail', {
            url:'/detail',
            templateUrl: '/mobile/users/myDetail',
            controller: 'MyDetailMobileCtrl'
        })
		.state('malfunctions', {
            url:'/malfunctions',
            abstract: true
        })
        .state('vehicles', {
            url:'/vehicles',
            abstract: true
        })
        .state('patrols', {
        	url:'/patrol',
        	abstract: true
        })
        .state('malfunctions.list',{
        	url: '/list',
        	params: {destination: null},
        	views: {
        		'': {
        			templateUrl: '/mobile/malfunctions/template/content',
                	controller: 'MalfunctionListMobileCtrl'
        		},
        		'taskFragmentView@malfunctions.list': {
        			templateUrl: '/mobile/malfunctions/template/taskFragment',
                	controller: 'MalfunctionSelfTaskCtrl',
        		},
        		'draftFragmentView@malfunctions.list': {
        			templateUrl: '/mobile/malfunctions/template/draftFragment',
                	controller: 'MalfunctionDraftListCtrl',
        		}
        	}
        })
        .state('malfunctions.edit',{
        	url: '/edit',
        	params: {malfunction: null, param: null},
        	templateProvider: ['$templateCache', function($templateCache) {
        		return $templateCache.get('add.tpl');
        	}],
        	controller: 'MalfunctionEditMobileCtrl'
        })
        .state('malfunctions.quickadd',{
        	url: '/quickadd',
        	templateProvider: ['$templateCache', '$http', function($templateCache, $http) {
        		return $templateCache.get('quickadd.tpl');
        	}],
        	controller: 'MalfunctionQuickAddMobileCtrl'
        })
        .state('malfunctions.execute',{
        	url: '/execute',
        	params: {malfunction: null, fromMap: null, param: null, task: null},
        	templateUrl: '/mobile/malfunctions/execute',
        	controller: 'MalfunctionExecuteMobileCtrl'
        })
        .state('malfunctions.images',{
        	url: '/images',
        	params: {malfunction: null, action: null},
        	templateUrl: '/mobile/malfunctions/image',
        	controller: 'MalfunctionImageViewMobileCtrl'
        })
        .state('malfunctions.emergencyGroup', {
        	url: '/emergencyGroup',
        	params: {malfunction: null, param: null},
        	templateUrl: '/mobile/malfunctions/emergencyGroup',
        	controller: 'EmergencyGroupMobileCtrl',
        })
        .state('malfunctions.view', {
        	url: '/view',
        	params: {param: null}, 
        	templateUrl: '/mobile/malfunctions/template/view',
            controller: 'MalfunctionViewCtrl'
        })
        .state('schedules', {
        	url: '/schedules',
        	abstract: true 
        })
        .state('schedules.view', {
        	url: '/selected',
        	params: {param: null}, 
        	templateUrl: '/maintenanceSchedules/template/view',
        	controller: 'CommonSelectItemViewCtrl'
        })
        .state('jobtickets', {
        	url: '/jobjobtickets',
        	abstract: true 
        })
        .state('jobtickets.list', {
            url:'/list',
            templateUrl: '/mobile/jobtickets/template/content',
            controller: 'JobticketSelfTaskMobileCtrl'
        })
        .state('jobtickets.execute', {
            url:'/execute',
            templateUrl: '/mobile/jobtickets/execute',
            params: {param: null}, 
            controller: 'JobticketExecuteMobileCtrl'
        })
        .state('jobtickets.temporaryView', {
        	url:'/temporaryView',
        	templateUrl:  '/mobile/jobtickets/template/temporaryView',
        	params: {param: null}, 
        	controller: 'JobticketTemporaryViewCtrl'
        })
        .state('jobtickets.scheduleView', {
        	url:'/scheduleView',
        	templateUrl:  '/mobile/jobtickets/template/scheduleView',
        	params: {param: null}, 
        	controller: 'MaintenanceScheduleViewCtrl'
        })
        .state('jobtickets.addMalfunction',{
        	url: '/addMalfunction',
        	params: {param: null},
        	templateProvider: ['$templateCache', function($templateCache) {
        		return $templateCache.get('add.tpl');
        	}],
        	controller: 'JobticketMalfunctionAddMobileCtrl'
        })
        
       .state('map', {
            url:'/map',
            abstract: true
        })
        
        //选择  故障和执法定位
        .state('map.LocationSelected', {
            url:'/locations/locationSelected',
            params: {param: null},
            templateUrl: '/mobile/maps/locationSelected',
            controller: 'LocationSelectedMapMobileCtrl'
        })
        
        // 故障位置(包括故障附近人员)
        .state('map.locationShow', {
            url:'/locations/locationShow',
        	params: {location: null, object: null, isShowNear: false, type: null},
        	templateUrl: '/mobile/maps/locationShow',
        	controller: 'LocationShowMapMobileCtrl'
        })
        // 巡查计划人员分布图和事件以及故障分布图
        .state('map.locationPoints', {
        	url:'/locations/points',
        	params: {type: null},
        	templateUrl: '/mobile/maps/points',
        	controller: 'LocationPointsMapMobileCtrl'
        })
        //路线
        .state('map.locationRouteShow', {
        	url:'/locations/route',
        	params: {id: null, locations : null},
        	templateUrl:  '/mobile/maps/route',
        	controller: 'LocationRouteShowMobileCtrl'
        })
        //轨迹
        .state('map.locationPathShow', {
        	url:'/locations/path',
        	params: {id: null, startTime: null, objectId : null,  locations : null, from: null},
        	templateUrl: '/mobile/maps/path',
        	controller: 'LocationPathShowMobileCtrl'
        })
        
        .state('vehicles.list',{
        	url: '/list',
        	params: {destination: null},
        	views: {
        		'': {
        			templateUrl: '/mobile/vehicle/dispatcherManager/template/content',
                	controller: 'CommonTabMobileCtrl'
        		},
        		'dispatchersFragmentView@vehicles.list': {
        			templateUrl: '/mobile/vehicle/dispatcherManager/dispatchers/template/vehicleDispatcherFragment',
                	controller: 'VehicleDispatcherDriverSelfTaskMobileCtrl',
        		},
        		'applicationsFragmentView@vehicles.list': {
        			templateUrl: '/mobile/vehicle/applications/template/vehicleApplicationFragment',
                	controller: 'VehicleApplicationTaskListMobileCtrl',
        		}
        		
        	}
        })
        .state('vehicles.applications', {
            url:'/application',
            abstract: true
        })
        .state('vehicles.dispatchers', {
        	url:'/dispatcher',
        	abstract: true
        })
        .state('vehicles.applications.edit', {
        	url: '/edit',
        	params: {param: null}, 
        	templateUrl: '/mobile/vehicle/applications/template/edit',
        	controller: 'VehicleEditMobileCtrl'
        })
        .state('vehicles.applications.view', {
    	  url: '/execute',
    	  params: {param: null}, 
    	  templateUrl: '/mobile/vehicle/applications/template/details',
    	  controller: 'VehicleApplicationExecuteMobileCtrl'
        })
        .state('vehicles.dispatchers.execute', {
        	url: '/execute',
        	params: {param: null}, 
        	templateUrl: '/mobile/vehicle/dispatcherManager/dispatchers/template/execute',
        	controller: 'VehicleDispatcherExecuteMobileCtrl'
        })
        .state('vehicles.applyTimeWay', {
        	url: '/applyTimeWay',
        	params: {param: null}, 
        	templateUrl: '/mobile/vehicle/applications/template/applyTimeWay',
        	controller: 'VehicleApplyTimeWayMobileCtrl'
        })
        .state('vehicles.applyAreas', {
        	url: '/applyAreas',
        	params: {param: null}, 
        	templateUrl: '/mobile/vehicle/applications/template/applyAreas',
        	controller: 'VehicleApplyAreasMobileCtrl'
        })
        .state('vehicles.applicationview', {
        	url: '/applicationview',
        	params: {param: null}, 
        	templateUrl: '/mobile/vehicle/applications/template/view',
        	controller: 'VehicleApplicationsViewMobileCtrl'
        })
        .state('patrols.list',{
        	url: '/list',
        	params: {destination: null},
        	views: {
        		'': {
        			templateUrl: '/mobile/patrol/events/template/content',
                	controller: 'CommonTabMobileCtrl'
        		},
        		'patrolSchedleTaskFragmentView@patrols.list': {
        			templateUrl: '/mobile/patrol/tasks/template/taskFragment',
                	controller: 'PatrolTaskSelfTaskCtrl',
        		},
        		'patrolEvenTaskFragmentView@patrols.list': {
        			templateUrl: '/mobile/patrol/events/template/taskFragment',
                	controller: 'PatrolEventSelfTaskCtrl',
        		},
        		'patrolEvenDaraftFragmentView@patrols.list': {
        			templateUrl: '/mobile/patrol/events/template/draftFragment',
        			controller: 'PatrolEventDraftListCtrl',
        		}
        	}
        })
        .state('patrols.task', {
        	url:'/task',
        	abstract: true
        })
        .state('patrols.task.execute',{
        	url: '/execute',
        	params: {param: null},
        	templateUrl: '/mobile/patrol/tasks/execute',
        	controller: 'PatrolTaskExecuteMobileCtrl'
        })
        .state('patrols.task.select',{
        	url: '/execute',
        	params: {param: null},
        	templateUrl: '/mobile/patrol/tasks/template/selectTask',
        	controller: 'SelectPatrolTaskMobileCtrl'
        })
        .state('patrols.event', {
        	url:'/event',
        	abstract: true
        })
        .state('patrols.event.edit',{
        	url: '/add',
        	params: {param: null, event: null},
        	templateUrl: '/mobile/patrol/events/edit',
        	controller: 'PatrolEventEditMobileCtrl'
        })
        .state('patrols.event.execute',{
        	url: '/execute',
        	params: {param: null},
        	templateUrl: '/mobile/patrol/events/execute',
        	controller: 'PatrolExecuteEventMobileCtrl'
        })
        .state('devices', {
            url:'/devices',
            abstract: true
        })
        .state('devices.select',{
        	url: '/select',
        	params: {malfunction: null},
        	templateUrl: '/mobile/devices/select',
        	controller: 'DeviceSelectMobileCtrl'
        })
        .state('devices.procesSelect',{
        	url: '/process/select',
        	params: {malfunction: null},
        	templateUrl: '/mobile/devices/procesSelect',
        	controller: 'ProcessDeviceSelectMobileCtrl'
        })
        .state('devices.detail',{
        	url: '/detail',
        	params: {malfunction: null},
        	templateUrl: '/mobile/devices/detail',
        	controller: 'DeviceDetailMobileCtrl'
        })
        .state('devices.confirm',{
        	url: '/confirm',
        	params: {malfunction: null, from: null},
        	templateUrl: '/mobile/devices/confirm',
        	controller: 'DeviceConfirmMobileCtrl'
        })
        .state('settings', {
            url:'/settings',
            abstract: true
        })
        .state('settings.menu', {
        	url: '/menu',
        	templateUrl: '/mobile/users/settings',
            controller: 'UserSettingsMobileCtrl'
        })
        .state('settings.password', {
        	url: '/password',
        	templateUrl: '/mobile/users/updatePass',
            controller: 'UpdatePassMobileCtrl'
        })
        .state('select', {
        	url: '/select',
        	abstract: true 
        })
        .state('select.staff', {
        	url: '/satff',
        	params: {param: null}, 
        	templateUrl: '/mobile/common/template/selectstaff',
            controller: 'SelectStaffCtrl'
        })
        .state('select.station', {
        	url: '/station',
        	params: {param: null}, 
        	templateUrl: '/mobile/common/template/selectstation',
            controller: 'SelectStationCtrl'
        })
        .state('ctrl',{
        	url: '/ctrl',
        	templateUrl: '/mobile/malfunctions/ctrl',
        	controller: 'CtrlMobileCtrl'
        });
		
		$urlRouterProvider.otherwise("/malfunctions/list");
		
		// 注册http拦截器
		$httpProvider.interceptors.push('EmmsAsyncInterceptor');
		
		// blockUI配置
		blockUIConfig.delay = 0;
		blockUIConfig.template = '<div class="block-ui-message-container" aria-atomic="true"><div class="block-ui-message"><i class="fa fa-spinner fa-spin"></i></div></div>';
		blockUIConfig.requestFilter = function(config) {
			if (config.url == '/mobile/malfunctions/inProcess' 
				|| config.url == '/mobile/malfunctions/uncommit'
				|| config.url == '/mobile/devices/search'
				|| config.url == '/system/staffs/emergencyGroup') {
				return false;
			}
		}
	}]);
	
	// 地图配置
	emmsMobile.config(['amapServiceProvider', function(provider){
		provider.setKey('b62e7b517c9b78eb2a90c1c4d0465647');
	}]);
	
	
	mobileApp.emmsMobile = emmsMobile;
	
	return mobileApp;

}(emmsMobileModule || {}, emmsLib || {}));