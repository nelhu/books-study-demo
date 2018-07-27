var emmsModule = (function(app, lib){
	
	var emms = angular.module("emmsApp", ["ui.router",'treeControl',"ngResource", "ngMessages", "ngCookies", "ui.bootstrap", 
		'angularFileUpload','gantt','gantt.table', 'gantt.tooltips', 'amap', 'leaflet', 'blockUI', 'ngTagsInput', 'toastr']);
	
	
	emms.factory("HttpInterceptor",['$q', '$window', 'toastr','$timeout', function($q, $window, toastr, $timeout) {
        return {
           'responseError': function(rejection) {
	              if (rejection.status === 401) {
	            	  $window.location.href = '/loginPage';
	              }else if(rejection.status === 404){
	            	  toastr.error("页面找不到，请稍后再试");
//	            	  $timeout(1000).then(function() {
//	            		  $window.location.href = '/';
//	            	  });
	              }
	              return $q.reject(rejection);
            }
          };
	 }])
	
	
	emms.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'blockUIConfig', 'tagsInputConfigProvider', 'toastrConfig',
		function ($stateProvider, $urlRouterProvider, $httpProvider, blockUIConfig, tagsInputConfigProvider, toastrConfig) {
		
		
		$httpProvider.interceptors.push('HttpInterceptor');
	    $urlRouterProvider.otherwise("home");
	
	    $stateProvider
		    .state('home', {
		    	url:'/home',
		    	templateUrl: '/home',
		    	controller: 'HomeCtrl',
		    	params: {category: null},
		    })
	    	.state('tasks', {
	    		abstract: true,
	    	})
	    	.state('tasks.list', {
	    		url: '/tasks',
	    		views: {
	    			'': {
	    				templateUrl: '/tasks/applications/template/tabs',
	    				controller: 'TaskFlowTabsCtrl'
	    			},
	    			'draftListView@tasks.list': {
	    				templateUrl: '/tasks/applications/template/draftList',
	    	    		controller: 'TaskDraftListCtrl'
	    			},
	    			'taskListView@tasks.list': {
	    				templateUrl: '/tasks/applications/template/taskList',
	    	    		controller: 'TaskListCtrl'
	    			},
	    			'applicationListView@tasks.list': {
	    				templateUrl: '/tasks/applications/template/applicationList',
	    				controller: 'TaskApplicationListCtrl'
	    			}
	    		}
	    	})
	    	.state('jobs', {
	    		abstract: true,
	    	})
	    	.state('jobs.config', {
	    		url: '/config',
	    		views: {
	    			'': {
	    				templateUrl: '/system/jobTimes/template/tabs',
	    				controller: 'JobConfigTabsCtrl'
	    			},
	    			'jobTimeListView@jobs.config': {
	    				templateUrl: '/system/jobTimes/template/list',
	    	    		controller: 'JobTimeListCtrl'
	    			},
	    			'jobQualificationListView@jobs.config': {
	    				templateUrl: '/system/jobQualifications/template/list',
	    				controller: 'JobQualificationListCtrl'
	    			}
	    		}
	    	})
	    	.state('malfunctions', {
	    		url: '/malfunctions',
	    		abstract: true,
	    	})
	    	.state('malfunctions.list', {
	    		url: '/list',
	    		views: {
	        		'': {
	        			templateUrl: '/malfunctions/template/content',
	                	controller: 'CommonTabCtrl'
	        		},
	        		'taskFragmentView@malfunctions.list': {
	        			templateUrl: '/malfunctions/template/taskFragment',
	                	controller: 'MalfunctionTaskListCtrl',
	        		},
	        		'draftFragmentView@malfunctions.list': {
	        			templateUrl: '/malfunctions/template/draftFragment',
	                	controller: 'MalfunctionDraftListCtrl',
	        		}
	        	}
	    	})
	    	.state('malfunctions.view', {
	       		url: '',
	    		params: {id:null, state: 0, page: 0, size: 10},
	    		onEnter: app.MalfunctionModal,
	    	})
	    	.state('malfunctions.viewMalfunctionTaskModal', {
	        	url: '',
	        	params: {id:null},
	    		onEnter: app.viewMalfunctionTaskModal
	    	})
	    	.state('malfunctionConfigurations', {
	    		url: '/malfunctionConfigurations',
	    		abstract: true,
	    	})
	    	.state('malfunctionConfigurations.list', {
	    		url: '/list',
	    		views: {
	        		'': {
	        			templateUrl: '/system/malfunctionReasons/template/content',
	                	controller: 'CommonTabCtrl'
	        		},
	        		'reasonFragmentView@malfunctionConfigurations.list': {
	        			templateUrl: '/system/malfunctionReasons/list',
	                	controller: 'MalfunctionReasonListCtrl',
	        		},
	        		'dealResultFragmentView@malfunctionConfigurations.list': {
	        			templateUrl: '/system/malfunctionDealResults/list',
	                	controller: 'MalfunctionDealResultListCtrl',
	        		}
	        	}
	    	})
		    .state('vehicles', {
		    		url: '/vehicles'
		    })
	    	.state('vehicles.flow', {
	        	url: '/flow',
	        	abstract: true
	        })
	        .state('vehicles.flow.application', {
	    		url: '/application',
	    		templateUrl: '/vehicle/applications/template/content',
	    		controller: 'VehicleApplicationTaskListCtrl',
	    		params: {isApply : true}
	    	})
	    	.state('vehicles.flow.dispatcherManager', {
	    		url: '/manager',
	    		params: {inDispatch: true,isApply: false},
	    		views: {
	        		'': {
	        			templateUrl: '/vehicle/dispatcherManager/template/content',
	                	controller: 'CommonTabCtrl'
	        		},
	        		'applicationsFragmentView@vehicles.flow.dispatcherManager': {
	        			templateUrl: '/vehicle/applications/template/vehicleApplicationFragment',
	                	controller: 'VehicleApplicationTaskListCtrl'
	        		},
	        		'dispatchersFragmentView@vehicles.flow.dispatcherManager': {
	        			templateUrl: '/vehicle/dispatcherManager/dispatchers/template/vehicleDispatcherFragment',
	                	controller: 'VehicleDispatcherTaskListCtrl',
	        		}
	        	}
	    	})
	    	.state('vehicles.flow.dispatchers', {
	    		url: '/dispatchers',
	    		templateUrl: '/vehicle/dispatcherManager/dispatchers/template/content',
	    		params:{isDriverTask: true},
	    		controller: 'VehicleDispatcherTaskListCtrl'
	    	})
	    	

	    	.state('vehicles.business', {
	    		url: '/business',
	    		abstract: true,
	    	})
	    	.state('vehicles.business.available',{
	        	url: '/available',
	        	templateUrl: '/vehicles/availablities/content',
	        	controller: 'VehicleBusinessAvailableCtrl'
	        })
	    	.state('vehicles.business.car', {
	        	url: '/car',
	        	templateUrl: '/vehicles/template/content',
	        	controller: 'VehicleCarBusinessCtrl'
	        })
	        .state('vehicles.business.proudction',{
	        	url: '/proudction',
	        	templateUrl: '/vehicle/production/template/content',
	        	controller: 'VehicleBusinessProductionCtrl'
	        })
	    	.state('charts', {
	    		url: '/charts',
	    		templateUrl: '/charts',
	    	})
		    .state('staffs', {
		    		url: '/system/staffs',
		    		abstract: true,
		    		template: '<div ui-view></div>',
		    		controller: 'StaffCtrl',
		    	})
	    	.state('staffs.list',{
	    		url: '',
	    		params: {page: 0,size: 10,deptId: 1, staffName: "", staffNo: "", phone: ""},
	    		templateUrl: '/system/staffs/list'
	    	})
	    	.state('roles', {
	    		url: '/system/roles',
	    		abstract: true,
	    		template: '<div ui-view></div>',
	    		controller: 'RoleCtrl',
	    	})
	    	.state('roles.list', {
	    		url: '',
	        	templateUrl: '/system/roles/list'
	    	})
	    	.state('users', {
	    		url: '/system/users',
	    		abstract: true,
	    		template: '<div ui-view></div>',
	    	})
	      
	    	.state('permissions', {
	    		url: '/permissions',
	    		templateUrl: '/permissions',
	    	})
	    	.state('settings', {
	    		url: '/settings',
	    		templateUrl: '/settings',
	    	})
	    	.state('settings.materials', {
	    		url: '/settings/materials',
	    		templateUrl: '/settings/materials',
	    	})
	        
	    	.state('flows', {
	        	url: '/flows',
	        	abstract: true,
	        	template: '<div ui-view></div>',
	        	controller: 'FlowCtrl',
	        })
	        .state('flows.list', {
	        	url: '',
	        	views: {
	        		'': {
	        			templateUrl: '/flows/list',
	        		},
	        		'filters@flows.list': {
	        			templateUrl: '/flows/list/filters'
	        		},
	        		'table@flows.list': {
	        			templateUrl: '/flows/list/table',
	        		},
	        	},
	        })

	        .state('materials', {
		    	url: '/materials',
		    	abstract: true,
		    	template: '<div ui-view></div>',
		    	controller: 'MaterialsCtrl',
		    })   
		    .state('materials.list', {
		    	url: '',
		    	views: {
		    		'': {
		    			templateUrl: '/materials/list',
		    		},
		    		'filters@materials.list': {
		    			templateUrl: '/materials/list/filters'
		    		},
		    		'BSList@materials.list': {
		    			templateUrl: '/materials/list/BSList',
		    		}
		    	},
		    })
		    .state('materialHistory', {
		    	url: '/materials/history',
		    	abstract: true,
		    	template: '<div ui-view></div>',
		    	controller: 'MaterialHistory',
		    })  
		    .state('materialHistory.list', {
		    	url: '',
		    	views: {
		    		'': {
		    			templateUrl: '/materials/history/list',
		    		},
		    		'HQfilters@materialHistory.list': {
		    			templateUrl: '/materials/history/list/HQfilters'
		    		},
		    		'HQList@materialHistory.list': {
		    			templateUrl: '/materials/history/list/HQList',
		    		},
		    	},
		    })
		    
		    .state('vehicleConfigurations', {
	        	url: '/vehicleConfigurations',
	        	abstract: true,
	        	template: '<div ui-view></div>',
	        })
	        .state('vehicleConfigurations.list', {
	        	url: 'list',
	    		params: {pId : 1, code : 'car'},
	        	templateUrl: '/vehicleConfigurations/content',
	        	controller: 'VehicleConfigurationsCtrl',
	        })
	        
	        .state('devices', {
	        	url: '/devices',
	        	abstract: true,
	        	template: '<div ui-view></div>',
	        	controller: 'DevicesCtrl',
	        })
	        .state('devices.list', {
	        	url: '',
	        	views: {
	        		'': {
	        			templateUrl: '/devices/list',
	        		},
	        		'filters@devices.list': {
	        			templateUrl: '/devices/list/filters'
	        		},
	        		'devices@devices.list': {
	        			templateUrl: '/devices/list/devices',
	        		}
	        	}
	        })
	        
	        .state('updates', {
	        	url: '/updates',
	        	abstract: true,
	        	template: '<div ui-view></div>',
	        	controller: 'UpdateCtrl',
	        })
	        
	        .state('updates.list', {
	        	url: '',
	        	templateUrl: '/updates/list',
	        })
	        
	        .state('updates.create', {
	        	url: '',
	   			templateUrl: '/updates/create',
	   			controller: 'CreateUpdateCtrl',
	        })
	        
	        .state('superManage', {
	        	url:'/system/users/list',
	        	abstract: true,
	        })
	        
	        .state('superManage.list', {
	        	url: '',
	        	templateUrl: '/system/users/list',
	        	controller: 'UserCtrl'
	        })
	        
	        .state('baseConfiguration', {
	        	url: '/baseConfiguration',
	        	abstract: true
	        })
	        
	        .state('baseConfiguration.list', {
	        	url: '/list',
	        	views: {
	        		'': {
	        			templateUrl: '/baseConfiguration/list',
	        			controller: 'CommonTabCtrl'
	        		},
	        		'areaView@baseConfiguration.list': {
	        			templateUrl: '/baseConfiguration/template/area/conrtent',
	        			controller: 'BaseConfigurationCtrl'
	        		},
	        		'professionalSystemDeviceTypeView@baseConfiguration.list': {
	        			templateUrl: '/device/basis/professional/template/content',
	        			controller: 'ProfessionalSystemDeviceTypeCtrl'
	        		}
	        	}
	        })
	        .state('maintenanceProcedure', {
	    		url: '/maintenanceProcedure',
	    		params: {param: null},
	    		templateUrl: '/maintenanceProcedures/template/list',
	    		controller: 'MaintenanceProcedureListCtrl'
	    	})
	    	.state('schedules', {
	        	url:'/schedule',
	        	abstract: true,
	        })
	    	.state('schedules.precaution', {
	    		url: '/schedule',
				templateUrl: 'schedules/precautionSchedules/template/list',
				controller: 'PrecautionScheduleListCtrl'
	    	})
	        .state('schedules.annual', {
	    		url: '/annual',
	    		views: {
	    			'': {
	    				templateUrl: '/annualSchedules/template/tabs',
	    				controller: 'AnnualScheduleTabsCtrl'
	    			},
	    			'listView@schedules.annual': {
	    				templateUrl: '/annualSchedules/template/list',
	    				controller: 'AnnualScheduleListCtrl'
	    			},
	    			'draftListView@schedules.annual': {
	    				templateUrl: '/annualSchedules/template/draftList',
	    	    		controller: 'AnnualScheduleDraftListCtrl'
	    			}
	    		}
	    	})
	    	.state('jobtickets', {
	    		url: '/jobtickets',
	    		abstract: true,
	    	})
			.state('schedules.year', {
	    		url: '/year',
	    		abstract: true
	    	})
	    	.state('schedules.year.template', {
	    		url: '/template',
	    		templateUrl: '/schedule/year/template/template/content',
	    		controller: 'ScheduleTemplateListCtrl'
	    	})
	    	.state('schedules.year.list', {
	    		url: '/list',
	    		templateUrl: '/schedule/year/template/content',
	    		controller: 'ScheduleYearListCtrl'
	    	})
	    	.state('jobtickets.pending', {
	        	url: '/pending',
	        	templateUrl: '/jobtickets/pending/template/content',
	        	controller: 'PendingJobListCtrl'
	        })
	        .state('jobtickets.weekSchedule', {
	        	url: '/weekSchedule',
	        	templateUrl: '/jobtickets/weekSchedule/template/content',
	        	controller: 'WeekScheduleListCtrl'
	        })
	        .state('jobtickets.list', {
	        	url: '/list',
	        	templateUrl: '/jobtickets/template/content',
	        	controller: 'JobticketListCtrl'
	        })
	        
	        .state('patrolsEvent', {
	        	url:'/patrol/',
	        	abstract: true,
	        })
	        .state('patrolsEvent.list', {
	    		url: '/event',
	    		views: {
	        		'': {
	        			templateUrl: '/patrol/events/template/content',
	                	controller: 'CommonTabCtrl'
	        		},
	        		'taskFragmentView@patrolsEvent.list': {
	        			templateUrl: '/patrol/events/template/taskFragment',
	                	controller: 'PatrolEventTaskListCtrl',
	        		},
	        		'draftFragmentView@patrolsEvent.list': {
	        			templateUrl: '/patrol/events/template/draftFragment',
	                	controller: 'PatrolEventDraftListCtrl',
	        		}
	        	}
	    	})
	        .state('patrolsSchedule', {
	        	url:'/patrol',
	        	abstract: true,
	        })
	        .state('patrolsSchedule.list', {
	        	url: '/schedule',
	        	templateUrl: '/patrol/schedules/template/content',
	        	controller: 'PatrolScheduleListCtrl'
	        })
	        .state('patrolsRoute', {
	        	url:'/patrol/route',
	        	abstract: true,
	        })
	        .state('patrolsRoute.list', {
	        	url: '',
	        	templateUrl: '/patrol/routes/template/show',
	        	controller: 'PatrolRouteListCtrl'
	        })
	        .state('patrolsCount', {
	        	url:'/patrol/count',
	        	abstract: true,
	        })
	        .state('patrolsCount.list', {
	        	url: '',
	        	templateUrl: '/patrol/routes/template/count',
	        	controller: 'PatrolCountListCtrl'
	        });
	    
	    // ngTagsInput配置
	    tagsInputConfigProvider.setDefaults('tagsInput', { placeholder: '' });
	    tagsInputConfigProvider.setTextAutosizeThreshold();
		
		// blockUI配置
	    blockUIConfig.delay = 0;
		blockUIConfig.template = '<div class="block-ui-message-container" aria-atomic="true"><div class="block-ui-message"><img src="/img/loading.gif"></div></div>';
	
		// toastr配置
		angular.extend(toastrConfig, {
		    positionClass: 'toast-top-center',
		    maxOpened: 1,
		    timeOut: 3000,
		  });
	
	}]);
	
	// 初始化全局数据
	emms.run(['$rootScope', 'commenModal', 'UserInfo', 'Map',
		function($rootScope, commenModal, UserInfo, Map) {
		
		UserInfo.query(function(res){
			$rootScope.user = res.user;
			$rootScope.user.type = res.type;
		})
		
		// 分页大小
		$rootScope.pageSize = [10, 15, 20];
		$rootScope.type = 'malfunction';
		
		// 通用方法
		$rootScope.staffBaseInfoModal = function(staffId) {
			commenModal.staffBaseInfoModal(staffId);
		}
		
		// 查看设备
		$rootScope.viewDeviceDetail = function(id) {
			commenModal.deviceDetailModel(id);
		}
		
		// 车辆基本信息
		$rootScope.vehicleBaseInfoModal = function(id) {
			commenModal.viewVehicleModel(id);
		}
		
		// 用车申请单
		$rootScope.vehicleAplicationBaseInfoModal = function(application) {
			commenModal.viewVehicleApplicationModel(application);
		}
		
		// 计划项 
		$rootScope.viewMaintenanceSchedule = function(id) {
			commenModal.viewMaintenanceSchedule(id);
		}
		
		// 故障单
		$rootScope.viewMalfunction = function(id) {
			commenModal.viewMalfunction(id);
		}
		
		// 查看检修项 
		$rootScope.viewMaintenanceProcedureContent = function(id) {
			commenModal.viewMaintenanceProcedureContent(id);
		}
		
		// 查看作业轨迹图
		$rootScope.viewPatrolPath = function(startTime, endTime, staffNo) {
			
			if (isNaN(parseInt(staffNo))) {
				staffNo = staffNo.slice(-6, -1);
			}
			
			 Map.queryPath({num: staffNo,
				            startTime: startTime,
				            endTime : endTime},function(response){
				    response.type = "staff";
				    response.objectId = staffNo;
				    commenModal.viewMapModel(response,'PathCtrl');
			   })
		}
		
	}]);

		
	emms.directive('ngInitial', ['$parse', function($parse) {
	    return {
	        restrict: "A",
	        compile: function($element, $attrs) {
	            var initialValue = $attrs.value || $element.val();
	            return {
	                pre: function($scope, $element, $attrs) {
	                    $parse($attrs.ngModel).assign($scope, initialValue);
	                }
	            }
	        }
	    }
	}]);
	
	//任务和草稿箱中心
	emms.controller('HomeCtrl', ['$scope', '$stateParams', '$uibModal', "Task", 'Drafts', '$state', '$controller','commenModal',
		function($scope, $stateParams, $uibModal, Task, Drafts, $state, $controller, commenModal) {
		
		function init(){
			$scope.migratedMsgCategory = $stateParams.category;
			
			var isUser = document.getElementById("isUser").value;
			if(isUser == "false"){
				$state.go("staffs.list");
			}
			Task.tasks(function(result){
				$scope.task = result;
			});
			
			Drafts.drafts(function(result){
				$scope.draft = result;
			});
			
		}
		
		// 获取当前消息类型
		$scope.$on('refreshTaskCounts', function(e, param) {
			$scope.migratedMsgCategory = param.value;
			init();
		});
		
		$scope.showCenter = function(business, category) {
			
			if (category == 'task' && $scope.migratedMsgCategory == business) {
				// 移除消息提示
				$scope.$emit('MsgHasBeenRead', {key: $scope.migratedMsgCategory, value: ''});
			}
			
			$uibModal.open({
				backdrop:"static",
			    templateUrl: "/home/template/taskList",
	            controller: 'HomeCenterCtrl',
	            windowClass:'mapSize',
	            resolve: {
					param: function() {
						return angular.copy({business: business, category: category});
					}
				}
			}).result.then(function(response) {
				init();
		    },function(){
				init();
	    	});
		}
		
		$scope.openMap = function (){
			
			commenModal.viewMapModel(
					{type:'vehicle',
					 alarm: true },'PointsCtrl')
					 .result.then(function(response) {
							init();
					 },function(){
							init();
				     });
		}
		
		
		$controller('CommonOpenCtrl', {$scope: $scope});
		init();
	}]);
	
	emms.controller('AppController', 
			['$scope', '$state', '$http', '$document', '$uibModal', 'User', 'AmqpMsg', 'commenModal',
		function($scope, $state, $http, $document, $uibModal, User, AmqpMsg, commenModal) {
		//获取登录人的姓名
		User.getLoginName(function(result){
			$scope.name = result.username;
		})
		$scope.openInfoView = function(){
			$uibModal.open({
				backdrop:"static",
			    templateUrl: "/system/users/infoView",
	            controller: 'UserInfoViewCtrl',
			})
		}
		
		$scope.isHavingEmergency = false;
		$scope.message = {};
		
		// 移除消息提示
		$scope.$on('MsgHasBeenRead', function(e, param) {
			$scope.message = {};
		});
		
		
		$document.ready(function(){
			
//			$http.get('/amqp/count')
//		        .success(function(data) {
//		        	 if(0 == data.count) {
//		        		 $scope.message = ""
//		        	 }else {
//		        		 $scope.message = data.count;
//		        	 }
//					 $scope.isHavingEmergency = data.isHavingEmergency;	
//		        });
			
			 lib.amqpMsgListener($scope.stomp, $scope.staffNo,
				     function(data) {
					    var result = JSON.parse(data.body);
					    $scope.$apply(function(){
					    	
					    	$scope.message = result;
					    	if ($state.$current.name == 'home') {
					    		$scope.$broadcast('refreshTaskCounts', {key: 'category', value: $scope.message.category});
					    	}
					    	if ($scope.message.category == 'warning') {
								commenModal.noAssignee().result.then(function(response) {
									
								});
					    	}
					    	
			        	});
				  	},
					function(response){
				  		$scope.$apply(function() {
							$scope.message = {};
						});
			});
		});		

	}]);
	
	emms.factory("Statistics", ['$resource', function($resource){
		return $resource('/statistics/:category/:type', {category:'@category',type:'@type'}, {
			search: {
				method: 'GET',
				isArray: true
			}
		});
	}]);

	
	emms.controller('ChartsController', ['$scope', 'Statistics', 'User',function($scope, Statistics, User) {
		
		var charts=['tDayMalfunctionProgressCount','yDayMalfunctionReasonCount','malfunctionTypeCount', 'yDayFinishedMalfunctionCount'];
		
		init(charts);
		
		function init(charts) {
			User.isUser(function(data) {
				$scope.isUser = data.isUser;
				if(data.isUser) {
					angular.forEach(charts, function(chartName) {
					    getChart(chartName);
				    })
					Statistics.search({category:"malfunction",type:"deptsMalfunctionTypeCount"},function(result) {
						var i=1;
						$scope.childCharts = [];
						angular.forEach(result, function(childChart) {
							$scope.childCharts.push(i++);
						})
					});
				}
		   })
	    }
		
		function getChart(chartName, result) {
    		Statistics.search({category:"malfunction",type:chartName},function(result) {
    			if("deptsMalfunctionTypeCount"==chartName){
    				var j=1;
    				angular.forEach(result, function(child) {
    					malfunctionReportForm("deptsMalfunctionTypeCount"+(j++), child.type, child.malfunctionTitle, 
    							child.categories, child.xTitle, child.yTitle, child.stacking, child.series);
    				})
    			}else{
    				malfunctionReportForm(chartName,result[0].type,result[0].malfunctionTitle, result[0].categories, 
    						result[0].xTitle, result[0].yTitle, result[0].stacking, result[0].series);
    			}	
    		});
		}
		
		$scope.chartRotate=function(divId) {
			chartRotate(divId);
		}
		
		function chartRotate(divId) {
			var childrenDivs=angular.element("#"+divId).children();
			angular.forEach(childrenDivs, function(child) {
				var dom = angular.element("#"+child.id);
				if(dom.hasClass("my-transform")) {
					dom.removeClass("my-transform");
					getChart(child.id);
				}else {
					dom.addClass("my-transform");
				}
			})
		}
		
		function malfunctionReportForm(container, type, malfunctionTitle, categories, xTitle, yTitle, stacking, series) {
			Highcharts.setOptions({
		        lang: {
		            noData: '暂无数据'
		        }
		    });
		    var	malfunctionChart=new Highcharts.Chart(container, {
		    	credits: {
		            enabled: false
		        },
		    	chart: {
		    		type: type
		    	},
		    	title: {
		    		text:malfunctionTitle
		    	},
		    	xAxis:{
		    		categories: categories,
		    		title:{
		    		    text: xTitle,
		    		    align: 'high'
		    		}
		    	},
		    	yAxis: {
		    		allowDecimals: false,
		    		title: {
		                text: yTitle,
		                align: 'high'
		            },
		            showEmpty: true
		    	},
		    	noData: {
		            style: {
		                fontWeight: 'bold',
		                fontSize: '15px',
		                color: '#303030'
		            }
		        },
		        plotOptions: {
		            column: {
		                stacking: stacking,
		                dataLabels: {
		                	enabled: true
		                }
		            }
		        },
		    	series: series
		    });
		}
	}]);
	
	app.emms = emms;
	
	return app;

}(emmsModule || {}, emmsLib || {}));