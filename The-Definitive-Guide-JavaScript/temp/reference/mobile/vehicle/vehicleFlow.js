/**
 * description - resolve mobile vehicles flow related operation
 * create - Nelson.Xuezi.Hu
 * date - 2018-6-15
 */
var emmsMobileModule = (function(mobileApp) {
	var emmsMobile = mobileApp.emmsMobile;
	
	// 申请车辆控制器
	emmsMobile.controller('VehicleEditMobileCtrl', ['$scope', '$state', '$stateParams', 'SweetAlert', 
			'VehicleApplicationDraft', 'Stations', 'VehicleConfiguration', 'SharedState', '$document', '$rootScope',
		function($scope, $state, $stateParams, SweetAlert, VehicleApplicationDraft, Stations, VehicleConfiguration, 
				SharedState, $document, $rootScope) {
		
		function init() {
			
			// 初始化参数
			$scope.categorys = [{name: '汽车', value: 'car'}, /*{name: '工作车', value: 'workingCar'}*/];
			VehicleConfiguration.getTypes({code: "vehiclePurpose"}, function(data, status) {
				$scope.purposes = data;
			});
			$scope.passengerNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
			$scope.filterdResults = [];
			
			// 确定车型
			$scope.parentVehicleType = angular.copy($stateParams.param.parentVehicleType);
			if ($stateParams.param && $stateParams.param.parentVehicleType) {
				$scope.category = $scope.categorys.filter(function(category) {
					return category.value === $stateParams.param.parentVehicleType;
				})[0];
			} else {
				$scope.category = $scope.categorys[0];
			}
			
			$scope.vehicleApplication = {};
			$scope.vehicleApplication.passengers = [];
			$scope.vehicleApplication.applyAreas = {};
			$scope.vehicleApplication.areaSections = [];
			$scope.vehicleApplication.isHitch = true;
			
			$scope.orderIndex = 1;
			
			if ($stateParams.param.vehicleApplication) {
				$scope.vehicleApplication = $stateParams.param.vehicleApplication;
			} else {
				
				$scope.categoryChange();
				
			}
			
		}
		
		
		$scope.categoryChange = function() {
			VehicleConfiguration.getTypes({code: $scope.category.value}, function(response, status) {
				$scope.vehicleTypes = null;
				$scope.vehicleTypes = response;
				$scope.vehicleApplication.vehicleType = null;
			});
		}
		
		$scope.searchInputSelect = function(key) {
			var title = "";
			$scope.currentSelect = key;
			if (key == 'purpose') {
				title = "用途";
				$scope.storedResults = angular.copy($scope.purposes);
				$scope.results = $scope.purposes;
				if ($scope.vehicleApplication.purpose) {
					$scope.matcher = $scope.vehicleApplication.purpose;
				} else {
					$scope.matcher = null;
				}
			}
			if (key == 'cause') {
				title = "事由";
				$scope.storedResults = null;
				$scope.results = null;
				if ($scope.vehicleApplication.cause) {
					$scope.matcher = $scope.vehicleApplication.cause;
				} else {
					$scope.matcher = null;
				}
			}
			$scope.title = title;
			SharedState.turnOn('SearchAndInputSelectModal');
		}
		
		$scope.change = function() {
			$scope.filterdResults = [];
			$scope.results = $scope.storedResults;
			$scope.matcher = $document.find('#matcher').val();
			angular.forEach($scope.results, function(item, index) {
				if ($scope.matcher && item.name.indexOf($scope.matcher) >= 0) {
					$scope.filterdResults.push(item);
				}
			});
			if ($scope.matcher) {
				$scope.results = $scope.filterdResults;
			}
		}
		
		$scope.getSelected = function(selected) {
			if ($scope.currentSelect == 'purpose') {
				$scope.matcher = selected ? selected.name : $scope.matcher;
				$scope.vehicleApplication.purpose = $scope.matcher;
			}
			if ($scope.currentSelect == 'cause') {
				$scope.matcher = selected ? selected.name : $scope.matcher;
				$scope.vehicleApplication.cause = $scope.matcher;
			}
			SharedState.turnOff('SearchAndInputSelectModal');
		}
		
		// 选择用车方式
		$scope.selectApplyTimeWay = function() {
			var param = {};
			param.parentVehicleType = $scope.category.value;
			param.vehicleApplication = $scope.vehicleApplication;
			$state.go('vehicles.applyTimeWay', {param: param});
		}
		
		// 选择路线
		$scope.selectApplyAreas = function() {
			var param = {};
			param.parentVehicleType = $scope.parentVehicleType;
			param.vehicleApplication = $scope.vehicleApplication;
			$rootScope.vehicleApplication = $scope.vehicleApplication;
			$state.go('vehicles.applyAreas', {param: param});
		}
		
		// 选择联系人
		$scope.selectPassenger = function() {
			var param = {};
			param.title = "选择联系人";
			param.sourceState = 'vehicles.applications.edit';
			param.parentVehicleType = $scope.parentVehicleType;
			param.source = angular.copy($scope.vehicleApplication);
			$state.go('select.staff', {param: param});
		}
		
		// 创建和编辑申请单
		$scope.start = function() {
			
			if (checkField()) {
				
				// 检查起点和终点
				if (!checkApplyAreas()) {
					showMessage('起点和终点不能相同');
					return false;
				}
				
				// 发起
				var taskStartTicket = {};
				taskStartTicket.businessTicket = $scope.vehicleApplication;
				taskStartTicket.startTicket = {
						variables: [
							{name: 'auditors', value: $scope.user.dept.num},
							{name: 'type', value: 'start'}
						]
				};
				
				VehicleApplicationDraft.saveAndStart(taskStartTicket, 
				function(response) {
					prompt(response);
				}, function(response) {
					prompt(response);
				});
				
			
				
			}
			
		}
		
		
		// 检查起点和终点是否相同
		function checkApplyAreas() {
			var first = $scope.vehicleApplication.areaSections[0];
			var last = $scope.vehicleApplication.areaSections[$scope.vehicleApplication.areaSections.length-1];
			if (first.area && last.area) {
				if (first.area.id == last.area.id) {
					return false;
				}
			}
			return true;
			
		}
		
		function checkField() {
			
			var flag = true;
			if (flag && !$scope.vehicleApplication.vehicleType) {
				showMessage('请选择车辆类型');
				flag = false;
			}
			if (flag && !$scope.vehicleApplication.purpose) {
				showMessage('请选择或输入用途');
				flag = false;
			}
			if (flag && !$scope.vehicleApplication.cause) {
				showMessage('请选择或输入事由');
				flag = false;
			}
			if (flag && !$scope.vehicleApplication.startTime) {
				showMessage('请选择开始时间');
				flag = false;
			}
			if (flag && !$scope.vehicleApplication.passengerNumber) {
				showMessage('请选择乘车人数');
				flag = false;
			}
			if (flag && $scope.vehicleApplication.areaSections.length === 0) {
				showMessage('请选择或输入起点');
				flag = false;
			}
			if (flag && (
					($scope.vehicleApplication.areaSections[0].area && !$scope.vehicleApplication.areaSections[0].area.id) && 
					(!$scope.vehicleApplication.areaSections[0].description)
					)) {
				showMessage('请选择或输入起点');
				flag = false;
			}
			if (flag && (
					($scope.vehicleApplication.areaSections[$scope.vehicleApplication.areaSections.length - 1].area && !$scope.vehicleApplication.areaSections[$scope.vehicleApplication.areaSections.length - 1].area.id) &&
					(!$scope.vehicleApplication.areaSections[$scope.vehicleApplication.areaSections.length - 1].description)
					)) {
				showMessage('请选择或输入终点');
				flag = false;
			}
			return flag;
		}

		function prompt(response) {
			if (response.errorMsg || (response.data && response.data.errorMsg)) {
				showMessage('请稍后重试');
			} else {
				SweetAlert.swal({
					title: '成功发起',
					text: '请等待派车',
					type: 'success'
				});
				$state.go('vehicles.list', {destination: 'tab2'});
			}
		}
		
		$scope.backToList = function() {
			$state.go('vehicles.list', {destination: 'tab2'});
		}
		
		init();
	}]);
	
	//////////////////
	
	
	
	// 用车申请单列表
	emmsMobile.controller('VehicleApplicationTaskListMobileCtrl',['$scope', '$state', '$stateParams', '$controller', 
		'VehicleApplicationUserTask', 'VehicleConfiguration', 'VehicleApplication',
		function($scope, $state, $stateParams, $controller, 
				VehicleApplicationUserTask, VehicleConfiguration, VehicleApplication) {
		
		function init() {
			
			// 车辆类别
			$scope.vehicleCategories = [{name: '汽车', value: 'car'}, {name: '工作车', value: 'workingCar'},];
			
			// 用车单状态
			VehicleApplication.states({},function(response){
				$scope.states = response;
			});
		}
		
		
		$scope.initCondition = function() {
			$scope.conditions = {
					number: {name: 'number', value: [], fuzzy: true},
					reporterOrPassenger: {name: 'reporterOrPassenger', value: [], fuzzy: true},
					vehicleCategory: {name: 'vehicleCategory', value: [], fuzzy: false},
					vehicleType : {name : 'vehicleType', value: [], fuzzy: false},
					purpose: {name: 'purpose', value: [], fuzzy: true},
					isHitch: {name: 'isHitch', value: [], fuzzy: false},
					passengerNumber: {name: 'passengerNumber', value: [], fuzzy: false},
					state: {name: 'state', value: [], fuzzy : true}
			};
		}
		
		$controller('BusinessTaskListCtrl', {$scope: $scope, TaskResource: VehicleApplicationUserTask});
		init();
	}]);
	
	// 用车申请单详情
	emmsMobile.controller('VehicleApplicationExecuteMobileCtrl', ['$scope', '$state', 'VehicleApplicationUserTask', '$stateParams',
		function($scope, $state, VehicleApplicationUserTask, $stateParams){
		
		function init(){
			VehicleApplicationUserTask.get({vehicleApplicationId : $stateParams.param.id},function(response){
				$scope.vehicleApplicationInfo = response;
				$scope.vehicleApplication = response.object;
			});
		}
		
		$scope.back = function() {
			$state.go('vehicles.list', {destination: 'tab2'});
		}
		
		init();
	}]);
	
	// 司机待出车派车单任务列表
	emmsMobile.controller('VehicleDispatcherDriverSelfTaskMobileCtrl', ['$scope', '$controller', 'VehicleDispatcherDriverTask',
		function($scope, $controller, VehicleDispatcherDriverTask) {
		
		$controller('BusinessSelfTaskListCtrl', {$scope: $scope, TaskResource: VehicleDispatcherDriverTask});
		
	}]);
	
	
	// 执行派车单任务（司机）
	emmsMobile.controller('VehicleDispatcherExecuteMobileCtrl', 
			['$scope', 'VehicleDispatcherDriverTask', '$stateParams', '$controller', 'SweetAlert', '$state',
		function($scope, VehicleDispatcherDriverTask, $stateParams, $controller, SweetAlert, $state) {
			
		function init() {
			
			$scope.vehicleId = $stateParams.param.id;

			VehicleDispatcherDriverTask.get({vehicleDispatcherId : $scope.vehicleId},function(response){
				$scope.vehilceDispatcherTaskInfo = response;
				$scope.vehilceDispatcher = $scope.vehilceDispatcherTaskInfo.object;
				$scope.taskLogs = $scope.vehilceDispatcherTaskInfo.taskLogs;
				
				$scope.hitchTickets = $scope.vehilceDispatcher.hitchTickets;
				$scope.vehicleBaseInfo = $scope.vehilceDispatcher.vehicleBaseInfo;
				$scope.driver = $scope.vehilceDispatcher.driver;
				
				// 过滤掉其他任务
				$scope.filteredTask = $scope.vehilceDispatcherTaskInfo.tasks.filter(function(task) {
					return (task.name === 'driverStart' || task.name === 'driverEnd')
				});
				$scope.currentTask = $scope.filteredTask[0];
				
			});
		
			
		}
	   
	   
		// 完成任务
		$scope.complete = function(result, state) {
			
			var workflowTaskComplete = {
					taskId: $scope.currentTask.id,
					taskName: $scope.currentTask.name,
					result: result,
					role: '',
					state: state,
					comment: $scope.comment,
					candidateDeptNum: '',
					variables: []
			};
			
			var taskCompleteTicket = {
					workflowTask: $scope.vehilceDispatcherTaskInfo,
					taskComplete: workflowTaskComplete,
			};
			
			// 完成任务
			VehicleDispatcherDriverTask.complete(
					taskCompleteTicket,
					function(response) {
						prompt(response);
					},function(response) {
						prompt(response);
					});
		}
		
		function prompt(response) {
			if (response.errorMsg || (response.data && response.data.errorMsg)) {
				showMessage('请稍后重试');
			} else {
				SweetAlert.swal({
					title: '提示',
					text: '操作成功',
					type: 'success'
				});
				$state.go('vehicles.list');
			}
		}
		
		
		$scope.back = function() {
			$state.go('vehicles.list');
		}
		
		init();
	}]);
	
	
	return mobileApp;
}(emmsMobileModule || {}));