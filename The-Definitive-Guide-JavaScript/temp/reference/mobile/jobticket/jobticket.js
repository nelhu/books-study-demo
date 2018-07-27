/**
 * description - resolve mobile jobTickets related operation
 * create - Nelson.Xuezi.Hu
 * date - 2018-03-15
 */
var emmsMobileModule = (function(mobileApp) {
	var emmsMobile = mobileApp.emmsMobile;
	
	// 工单个人任务
	emmsMobile.controller('JobticketSelfTaskMobileCtrl', ['$scope', '$controller', 'JobticketTask', function($scope, $controller, JobticketTask) {
		$controller('BusinessSelfTaskListCtrl', {$scope: $scope, TaskResource: JobticketTask});
	}]);
	
	// 执行工单任务控制器
	emmsMobile.controller('JobticketExecuteMobileCtrl',['$scope', '$state', 'Map', 'JobticketTask', '$controller', '$stateParams', 'SweetAlert',
		function($scope, $state, Map, JobticketTask, $controller, $stateParams, SweetAlert) {
		
		$scope.jobticketId = $stateParams.param.id;
		
		function init(){
			
			JobticketTask.get({jobticketId: $scope.jobticketId}, function(response){
				$scope.jobticketInfo = response;
				$scope.jobticket = $scope.jobticketInfo.object;
				
				// 当前任务
				if ($scope.jobticketInfo.tasks.length === 1) {
					$scope.task = $scope.jobticketInfo.tasks[0];
				}
			});
			
		}

		// 完成任务
		$scope.complete = function(taskId, taskName, result, state) {
			var workflowTaskComplete = {
					taskId: taskId,
					taskName: taskName,
					result: result,
					role: '',
					state: state,
					comment: $scope.comment,
					variables: [],
			};
			
			// 完成任务
			$scope.workflowTaskComplete = workflowTaskComplete;
			doComplete();
		}
		
		function doComplete() {
			// 任务完成变量
			var taskCompleteTicket = {
					workflowTask: $scope.jobticketInfo,
					taskComplete: $scope.workflowTaskComplete,
			};
			
			JobticketTask.complete(
					taskCompleteTicket,
					function(response) {
						prompt(response);
					}, function(response) {
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
				$scope.back();
			}
		}
		
		// 查看作业详情
		$scope.openJobDetail = function(job) {
			var param = {id: job.id, objectId: $scope.jobticketId};
			
			if (job.type === 'temporary') {
				$state.go('jobtickets.temporaryView', {param: param});
			}
			
			if (job.type === 'malfunction') {
				$state.go('malfunctions.view', {param: param});
			}
			
			if (job.type === 'schedule') {
				$state.go('jobtickets.scheduleView', {param: param});
			}
		}
		
		// 查看作业轨迹图
		$scope.viewJobPath = function() {
			
		   Map.queryPath({num:$scope.jobticket.principal.staffNo,
		                    startTime: $scope.jobticket.actualStartTime,
		                    endTime: $scope.jobticket.actualEndTime}, function(response){
			   
		           $state.go('map.locationPathShow',
		        		         {id: $scope.jobticketId, 
		        	              endTime: $scope.jobticket.actualEndTime,
		        	              from: 'jobticketExecute',
			    	              objectId : $scope.jobticket.principal.staffNo,
			    	              locations : response});
		   })
		}
		
		// 提报故障
		$scope.submitMalfunction = function() {
			var param = {};
			param.objectId = $scope.jobticketId;
			
			$state.go('jobtickets.addMalfunction', {param: param});
		}
		
		$scope.back = function() {
			$state.go('jobtickets.list');
		}
		
		init();
	}]);
	
	
	// 查看临时工单
	emmsMobile.controller('JobticketTemporaryViewCtrl', ['$scope', '$state', '$stateParams', 'TemporaryJobTicket',
		function($scope, $state, $stateParams, TemporaryJobTicket) {
		
		$scope.temporaryJobticketId  = $stateParams.param.id;
		$scope.objectId  = $stateParams.param.objectId;
		
		function init() {
			if ($scope.temporaryJobticketId) {
				TemporaryJobTicket.get({id: $scope.temporaryJobticketId},function(response){
					$scope.temporaryJobTicket = response;
				});
			}
		}
		
		$scope.back = function() {
			$state.go('jobtickets.execute', {param: {id: $scope.objectId}});
		}
		
		init();
	}]);
	
	// 查看检修计划
	emmsMobile.controller('MaintenanceScheduleViewCtrl', ['$scope', '$state', '$stateParams', 'MaintenaceShedule',
		function($scope, $state, $stateParams, MaintenaceShedule) {
		
		$scope.scheduleId  = $stateParams.param.id;
		$scope.objectId  = $stateParams.param.objectId;
		
		function init() {
			if ($scope.scheduleId) {
				MaintenaceShedule.get({id: $scope.scheduleId},function(response){
					$scope.maintenaceShedule = response;
				});
			}
		}
		
		$scope.back = function() {
			$state.go('jobtickets.execute', {param: {id: $scope.objectId}});
		}
		
		init();
	}]);
	
	// 工单中提报故障
	emmsMobile.controller('JobticketMalfunctionAddMobileCtrl', ['$scope', '$state', '$stateParams', '$controller',
		function($scope, $state, $stateParams, $controller, MaterialInfo, SharedState) {
		
		$scope.fromJobticket = true;
		$scope.jobticketId = $stateParams.param.objectId;
		
		$scope.backToJobOrder = function() {
			$state.go('jobtickets.execute', {param: {id: $scope.jobticketId}});
		}
		
		$controller('MalfunctionEditMobileCtrl', {$scope: $scope, $stateParams: $stateParams});
	}]);
	
	return mobileApp;
}(emmsMobileModule || {}));