/**
 * description - resolve vehicles mobile related operation
 * create - Nelson.Xuezi.Hu
 * date - 2018-1-15
 */
var emmsMobileModule = (function(mobileApp) {
	var emmsMobile = mobileApp.emmsMobile;
	
	// 用车tab
	emmsMobile.controller('VehicleListMobileCtrl', ['$scope', '$state', 'Malfunction', '$uibModal', 'SweetAlert', 'SharedState', '$document', '$stateParams',
		function($scope, $state, Malfunction, $uibModal, SweetAlert, SharedState, $document, $stateParams) {
		$scope.ctrl = 'VehicleListMobileCtrl';

		var destination = angular.copy($stateParams.destination);
		
		// 初始化页面
		function init() {
			
			if (!destination || destination == 'taskListTab') {
				$scope.currentTab = 'taskListTab';
				$scope.taskListFlag = true;
				$scope.draftListFlag = false;
				$scope.applicationListFlag = false;
			}
			if (destination == 'draftListTab') {
				$scope.currentTab = 'draftListTab';
				$scope.taskListFlag = false;
				$scope.draftListFlag = true;
				$scope.applicationListFlag = false;
			}
			if (destination == 'applicationListTab') {
				$scope.currentTab = 'applicationListTab';
				$scope.taskListFlag = false;
				$scope.draftListFlag = false;
				$scope.applicationListFlag = true;
			}
			
		}
		
		// 菜单选项卡切换
		$scope.tabCtrlToggle = function(key) {
			
			var taskListTab = $document.find('#taskListTabId');
			var draftListTab = $document.find('#draftListTabId');
			var applicationListTab = $document.find('#applicationListTabId');
			$scope.currentTab = key;
			
			if (key == 'taskListTab') {
				
				$scope.taskListFlag = true;
				$scope.draftListFlag = false;
				$scope.applicationListFlag = false;
				draftListTab.removeClass('mobile-tab-ctrl-sty');
				applicationListTab.removeClass('mobile-tab-ctrl-sty');
				taskListTab.addClass('mobile-tab-ctrl-sty');
				
			} else if (key == 'draftListTab') {
				
				$scope.taskListFlag = false;
				$scope.applicationListFlag = false;
				$scope.draftListFlag = true;
				taskListTab.removeClass('mobile-tab-ctrl-sty');
				applicationListTab.removeClass('mobile-tab-ctrl-sty');
				draftListTab.addClass('mobile-tab-ctrl-sty');
				
			} else {
				$scope.taskListFlag = false;
				$scope.draftListFlag = false;
				$scope.applicationListFlag = true;
				taskListTab.removeClass('mobile-tab-ctrl-sty');
				draftListTab.removeClass('mobile-tab-ctrl-sty');
				applicationListTab.addClass('mobile-tab-ctrl-sty');
			}
			
		}
		
		init();
	}]);
	
	// 移动端list页面滑动分页控制器
	var mobileCommonScrollPaginationCtrl = function($scope, Resource, $state, $stateParams, SweetAlert, CommonService, $timeout, $document) {
		
		function init() {
			
			// 参数
			$scope.showMessageFlag = true;
			$scope.results = [];
			
			var size = Math.round(CommonService.getViewHeight() / 120);
			$scope.pageInfos = {number: 0, size: size};
			
			var mescroll = new MeScroll($scope.currentTab, {
				up: {
					noMoreSize: $scope.pageInfos.size - 2,
					htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>',
					htmlNodata: '<p class="upwarp-nodata">-- 没有数据啦 --</p>',
					offset: 40,
					page: {
						num : 0,
						size : $scope.pageInfos.size, 
						time: null
					},
					callback: function(page, ms) {
						$scope.loadMore(page, ms);
					}
				}
			});
		}
		
		// 数据分页 滑动刷新
		$scope.$on('$viewContentLoaded', function() {
			
		});
		
		// 点击条目进入
		$scope.open = function(state, param) {
			$state.go(state, {param: param});
		}
		
		// 加载更多
		$scope.loadMore = function(page, mescroll) {

			if ($scope.showMessageFlag) {
				Resource.get({page: page.num - 1, size: page.size}, function(response) {
					$scope.currentPageInfo = response;
					if (mescroll) {
						// 请求成功后关闭加载条
						if (response.content) {
							mescroll.endByPage(response.numberOfElements, response.totalPages);
						} else {
							mescroll.endErr();
						}
					}
					if (response.last == false) {
						$scope.pageInfos.number++;
					} else {
						$scope.showMessageFlag = false;
						$timeout(2000).then(function() {
							$scope.showMessageFlag = true;
						});
					}
					$scope.refreshContent(response);
				});
			}
			
			// 请求未发起成功， 手动关闭加载条
			if (mescroll) {
				$timeout(2000).then(function() {
					if ($scope.currentPageInfo) {
						mescroll.endByPage($scope.currentPageInfo.numberOfElements, $scope.currentPageInfo.totalPages);
					} else {
						mescroll.endErr();
					}
				});
			}
		
		};
		
		$scope.refreshContent = function(data) {
			
			if (data.first == true) {
				
				$scope.results = data.content
				
			} else {
				
				angular.forEach(data.content, function(newMalfunction) {
					var isNotExist = true;
					angular.forEach($scope.results, function(oldMalfunction) {
						if (oldMalfunction.id == newMalfunction.id) {
							isNotExist = false;
						}
					});
					if (isNotExist) {
						$scope.results.push(newMalfunction);
					}
				});
				
			}
			
			if ($scope.childHandler) {
				$scope.childHandler();
			}
			
		}
		
		init();
	}
	emmsMobile.mobileCommonScrollPaginationCtrl = mobileCommonScrollPaginationCtrl;
	
	var ViewCtrl =  function($scope, $state, $stateParams, Resource) {
		
		// 获取要显示的数据
		Resource.get({id: $stateParams.param.id}, function(response) {
			$scope.dataModel = response;
			if ($scope.childHandler) {
				$scope.childHandler();
			}
		});
		
		// 返回
		$scope.back = function() {
			$state.go($stateParams.param.originalState, {destination: $stateParams.param.destination ? $stateParams.param.destination : null});
		}
		
	}
	emmsMobile.ViewCtrl = ViewCtrl;
	
	// 查看申请单
	emmsMobile.controller('VehicleApplicationsViewMobileCtrl', ['$scope', '$state', '$stateParams', 'VehicleApplication', emmsMobile.ViewCtrl]);
	
	emmsMobile.controller('VehicleListParentMobileCtrl', ['$scope', 'Resource', '$state', '$stateParams', 'SweetAlert', 'CommonService', '$timeout', '$document', emmsMobile.mobileCommonScrollPaginationCtrl]);
	
	// 正在执行的任务
	emmsMobile.controller('VehicleTaskListMobileCtrl', ['$scope', '$controller', 'VehicleTask', function($scope, $controller, VehicleTask) {
		$controller('VehicleListParentMobileCtrl', {$scope: $scope, Resource: VehicleTask});
	}]);
	
	// 未发起的故障
	emmsMobile.controller('VehicleDraftListMobileCtrl', ['$scope', '$controller', 'VehicleDraft', function($scope, $controller, VehicleDraft) {
		$controller('VehicleListParentMobileCtrl', {$scope: $scope, Resource: VehicleDraft});
	}]);
	
	// 所有用车申请
	emmsMobile.controller('VehicleApplicationListMobileCtrl', ['$scope', '$controller', 'VehicleApplication', 'SharedState', '$timeout',
		function($scope, $controller, VehicleApplication, SharedState, $timeout) {
		$controller('VehicleListParentMobileCtrl', {$scope: $scope, Resource: VehicleApplication});
		
		function initSelf() {
			$scope.query = {};
		}
		
		$scope.loadMore = function(page, mescroll) {
			if ($scope.showMessageFlag) {
				VehicleApplication.get({
					page: $scope.pageInfos.number ? $scope.pageInfos.number - 1 : 0, 
					size: $scope.pageInfos.size,
					startTime: $scope.query.startTime,
					endTime: $scope.query.endTime,
					status: $scope.query.status
				}, function(response) {
					$scope.currentPageInfo = response;
					if (mescroll) {
						// 请求成功后关闭加载条
						if (response.content) {
							mescroll.endByPage(response.numberOfElements, response.totalPages);
						} else {
							mescroll.endErr();
						}
					}
					if (response.last == false) {
						$scope.pageInfos.number++;
					} else {
						$scope.showMessageFlag = false;
						$timeout(2000).then(function() {
							$scope.showMessageFlag = true;
						});
					}
					$scope.refreshContent(response);
				});
			}
			
			// 请求未发起成功， 手动关闭加载条
			if (mescroll) {
				$timeout(2000).then(function() {
					if ($scope.currentPageInfo) {
						mescroll.endByPage($scope.currentPageInfo.numberOfElements, $scope.currentPageInfo.totalPages);
					} else {
						mescroll.endErr();
					}
				});
			}
		}
		
		$scope.search = function(key) {
			$scope.query.status = key;
			$scope.loadMore();
			SharedState.turnOff('vehicleApplicationStatusFilter');
		}
		
		$scope.searchByMonth = function(month) {
			$scope.query.startTime = month.monthStart;
			$scope.query.endTime = month.monthEnd;
			$scope.loadMore();
		}	
		
		initSelf();
	}]);
	
	// 用车方式
	emmsMobile.controller('VehicleApplyTimeWayMobileCtrl', ['$scope', '$state', '$stateParams', 'SharedState', 'CommonService', 'SweetAlert',
		function($scope, $state, $stateParams, SharedState, CommonService, SweetAlert) {
		
		function init() {
			
			$scope.parentVehicleType = $stateParams.param.parentVehicleType;
			$scope.vehicleApplication = angular.copy($stateParams.param.vehicleApplication);
			
			// 乘车时段类型
			if ($scope.parentVehicleType == 'car' && $scope.vehicleApplication.endTime) {
				$scope.vehicleApplication.isTimeFrame = true;
			}
		}
		
		$scope.confirmTime = function() {
			if ($scope.isTimeFrame && !$scope.vehicleApplication.endTime) {
				showMessage('请选择结束时间');
				return false;
			}
			
			var param = {};
			param.parentVehicleType = $scope.parentVehicleType;
			param.vehicleApplication = $scope.vehicleApplication;
			$scope.back(param);
		}
		
		$scope.back = function(param) {
			if (!param) {
				var param = {};
				param.parentVehicleType = $scope.parentVehicleType;
				param.vehicleApplication = $stateParams.param.vehicleApplication;
			}
			$state.go('vehicles.applications.edit', {param: param});
		}
		
		
		init();
	}]);
	
	// 用车路线
	emmsMobile.controller('VehicleApplyAreasMobileCtrl', ['$scope', '$state', '$stateParams', 'SharedState', 'CommonService', 'SweetAlert', '$rootScope',
		function($scope, $state, $stateParams, SharedState, CommonService, SweetAlert, $rootScope) {
		
		function init() {
			
			$scope.parentVehicleType = $stateParams.param.parentVehicleType;
			$scope.vehicleApplication = angular.copy($stateParams.param.vehicleApplication);
			
			var areaLength = $scope.vehicleApplication.areaSections.length;
			$scope.moddleAreaCount = areaLength > 2  ? areaLength - 2 : 0;
			if ($scope.vehicleApplication.areaSections.length == 0) {
				$scope.vehicleApplication.areaSections = [{orderIndex : -1},{orderIndex : 10000}];
			}
			
			
			// $scope.middleAreas = $scope.vehicleApplication.applyAreas.middleAreas ? $scope.vehicleApplication.applyAreas.middleAreas : [];
			//$scope.orderIndex = $scope.middleAreas.length > 0 ? $scope.middleAreas[$scope.middleAreas.length - 1].orderIndex + 1 : 1;
			
		}
		
		// 选择站点
		$scope.selectStation = function(areaSection) {
			
			var param = {};
			if (areaSection.orderIndex == -1) {
				param.title = "选择起点";
			}
			else if (areaSection.orderIndex == 10000) {
				param.title = "选择终点";
			}
			else {
				param.title = "选择途经点";
				// param.area = area;
				// param.middleAreas = $scope.middleAreas;
			}
			param.sourceState = 'vehicles.applyAreas';
			param.parentVehicleType = $scope.parentVehicleType;
			// param.type = type;
			param.areaSection = areaSection;
			param.source = $scope.vehicleApplication;
			$state.go('select.station', {param: param});
			
		}
		
		// 添加途经点
		$scope.addMiddleArea = function() {

			$scope.moddleAreaCount += 1;
			var area = {orderIndex : $scope.moddleAreaCount};
			// 拼接函数(索引位置, 要删除元素的数量, 元素)  
			var index = $scope.vehicleApplication.areaSections.length - 1;
			$scope.vehicleApplication.areaSections.splice(index, 0, area);  
		
			
		}
		
		$scope.confirmAreas = function() {
			
			angular.forEach($scope.vehicleApplication.areaSections, function(areaSection, index) {
				
				if (areaSection.orderIndex != -1 && areaSection.orderIndex != 10000) {
					if (!areaSection.area && !areaSection.description) {
						$scope.vehicleApplication.areaSections.splice(index, 1);
					}
				}
				
			});
			
			var param = {};
			param.parentVehicleType = $scope.parentVehicleType;
			param.vehicleApplication = $scope.vehicleApplication;
			$scope.back(param);
		}
		
		$scope.back = function(param) {
			if (!param) {
				var param = {};
				param.parentVehicleType = $scope.parentVehicleType;
				// param.vehicleApplication = $rootScope.vehicleApplication;
				param.vehicleApplication = $scope.vehicleApplication;
				$state.go('vehicles.applications.edit', {param: param});
			} else {
				$state.go('vehicles.applications.edit', {param: param});
			}
		}
		
		
		init();
	}]);
	
	
	
	return mobileApp;
}(emmsMobileModule || {}));