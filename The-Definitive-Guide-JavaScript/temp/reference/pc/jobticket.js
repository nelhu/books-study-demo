var emmsModule = (function(app){
	
	var emms = app.emms;
	
	// 待办作业
	emms.factory('PendingJob', ['$resource', function($resource){
		return $resource('/jobtickets/pending',{},{
			search: {
				method: 'POST',
				url: '/jobtickets/pending/search',
				isArray: true
			}
		});
	}]);
	
	// 周计划
	emms.factory('WeekSchedule',['$resource', function($resource){
		return $resource('/jobtickets/weekSchedule',{},{
			tasks: {
				method: 'POST',
				url: '/jobtickets/weekSchedule/tasks',
			},
			states: {
				method: 'GET',
				url:'/jobtickets/weekSchedule/states',
				isArray: true,
			}
		});
	}]);
	
	// 周计划任务
	emms.factory('WeekScheduleTask',['$resource', function($resource){
		return $resource('/jobtickets/weekSchedule/tasks/:jobticketId',{},{
			self: {
				method: 'GET',
				url: '/jobtickets/weekSchedule/tasks/self',
				isArray: true,
			},
			complete: {
				method: 'POST',
				url: '/jobtickets/weekSchedule/tasks/complete',
			}
		});
	}]);
	
	// 工单
	emms.factory('Jobticket',['$resource', function($resource){
		return $resource('/jobtickets',{},{
			saveAndStart: {
				url: '/jobtickets/start',
				method: 'POST'
			},
			tasks: {
				method: 'POST',
				url: '/jobtickets/tasks',
			},
			states: {
				method: 'GET',
				url:'/jobtickets/states',
				isArray: true,
			}
		});
	}]);
	
	// 工单任务
	emms.factory('JobticketTask',['$resource', function($resource){
		return $resource('/jobtickets/tasks/:jobticketId',{},{
			self: {
				method: 'GET',
				url: '/jobtickets/tasks/self',
				isArray: true,
			},
			complete: {
				method: 'POST',
				url: '/jobtickets/tasks/complete',
			}
		});
	}]);
	
	// 临时作业
	emms.factory('TemporaryJobTicket',['$resource', function($resource){
		return $resource('/jobtickets/temporary/:id', {}, {});
	}]);
	
	// 待办作业列表控制器
	emms.controller('PendingJobListCtrl', ['$scope', '$controller', 'PendingJob', 'commenModal', 'toastr'
		,function($scope, $controller, PendingJob, commenModal, toastr) {

		function init() {
			
			$scope.categorys = [{name: '计划修', value: 'schedule'}, {name: '故障修', value: 'malfunction'}, {name: '临时修', value: 'temporary'},];
			
		}
		
		$scope.initCondition = function() {
			$scope.conditions = {
					number: {name: 'number', value: [], fuzzy: true},
					name: {name: 'name', value: [], fuzzy: true},
					category: {name: 'category', value: [], fuzzy: false},
			};
		}
		
		$scope.mergePendingJob = function() {
			$scope.confirm();
		}
		
		// 获取选中的项
		$scope.childSelected = function(selectedItems) {
			
			if ($scope.$close) {
				$scope.$close(selectedItems);
			} else {
				// 打开制定工单窗口
				$scope.open(
						'/jobtickets/edit',
						'JobTicketEditCtrl',
						'lg',
						{selectedPendingJobs: selectedItems});
			}
			
		}
		
		init();
		
		// 多选控制
		$controller('MultiSelectItemCtrl', {$scope: $scope, param: null});
		
		$controller('BusinessObjectNoPageListCtrl', {$scope: $scope, BusinessObjectResource: PendingJob});
		
	}]);
	
	
	// 周计划列表控制器
	emms.controller('WeekScheduleListCtrl',['$scope', '$controller', 'WeekSchedule', 'commenModal',
		function($scope, $controller, WeekSchedule, commenModall) {
		
		function init() {
			
			$scope.isWeekSchedule = true;
			
			// 状态
			WeekSchedule.states(function (response) {
				$scope.states = response;
			});
			
		}
		
		$scope.initCondition = function() {
			$scope.conditions = {
					number: {name: 'number', value: [], fuzzy: true},
					principal: {name: 'principal', value: [], fuzzy: true},
					owner: {name: 'owner', value: [], fuzzy: true},
					state: {name: 'state', value: [], fuzzy: true}
			};
		}
		
		$controller('BusinessTaskListCtrl', {$scope: $scope, TaskResource: WeekSchedule});
		init();
	}]);
	
	// 周计划个人任务
	emms.controller('WeekScheduleSelfTaskCtrl', ['$scope', '$controller', 'WeekScheduleTask', function($scope, $controller, WeekScheduleTask) {
		
		$controller('BusinessSelfTaskListCtrl', {$scope: $scope, TaskResource: WeekScheduleTask});
		
	}]);
	
	// 工单列表控制器
	emms.controller('JobticketListCtrl',['$scope', '$controller', 'Jobticket', 'commenModal',
		function($scope, $controller, Jobticket, commenModall) {
		
		function init() {
			
			// 状态
			Jobticket.states(function (response) {
				$scope.states = response;
			});
			
		}
		
		$scope.initCondition = function() {
			$scope.conditions = {
					number: {name: 'number', value: [], fuzzy: true},
					principal: {name: 'principal', value: [], fuzzy: true},
					owner: {name: 'owner', value: [], fuzzy: true},
					state: {name: 'state', value: [], fuzzy: true}
			};
		}
		
		$controller('BusinessTaskListCtrl', {$scope: $scope, TaskResource: Jobticket});
		init();
	}]);
	
	// 工单个人任务
	emms.controller('JobticketSelfTaskCtrl', ['$scope', '$controller', 'JobticketTask', function($scope, $controller, JobticketTask) {
		
		$controller('BusinessSelfTaskListCtrl', {$scope: $scope, TaskResource: JobticketTask});
		
	}]);
	
	// 新增编辑临时工单
	emms.controller('TemporaryJobTicketEditCtrl', 
			['$scope', 'TemporaryJobTicket', 'toastr', 'param', '$controller', 'commenModal', 'CommonFunction',
		function($scope, TemporaryJobTicket, toastr, param, $controller, commenModal, CommonFunction) {
		
	    function init() {
	    	
	    	$scope.temporaryJobticketId = param.id;
	    	$scope.fromJobticketEdit = param.fromJobticketEdit;
	    	
			if($scope.temporaryJobticketId){
				
				TemporaryJobTicket.get({id: $scope.temporaryJobticketId},function(response){
					
					$scope.temporaryJobTicket = response;
					$scope.devices = $scope.temporaryJobTicket.devices;
				});
				
			} else {
				
				$scope.temporaryJobTicket = {};
				$scope.devices = [];
			}
			
		}
	    
	    // 选择设备
		$scope.selectDevices = function() {
			commenModal.openModal(
					'/jobtickets/template/selectDevice',
					'SingleSelectDeviceCtrl', 'lg', {scope: 'all'}).result.then(function(response) {
						if(!$scope.devices) {
							$scope.devices = [];
						}
						$scope.devices.push(response);	
					});
		}
		
		// 移除检修设备
		$scope.removeDevice = function(index) {
			
			$scope.devices.splice(index, 1);
		}
	   
	   // 保存
	   $scope.save = function() {
			if (check()) {
				doSave();
			}
	   }
	   

		// 发起
		$scope.start = function() {
			
			$scope.temporaryJobTicket.devices = $scope.devices;
			
			// 打开制定工单的页面
			commenModal.openModal(
					'/jobtickets/edit',
					'JobTicketEditCtrl', 'lg', {selectedJobTicketTemporary: $scope.temporaryJobTicket}).result.then(function(response) {
						$scope.$close();
					});
		}
		
		   
		// 新增编辑
		function doSave() {
			
			$scope.temporaryJobTicket.devices = $scope.devices;
			
			if ($scope.fromJobticketEdit) {
				
				$scope.$close($scope.temporaryJobTicket);
				
			} else {
				
				TemporaryJobTicket.save($scope.temporaryJobTicket, function(response) {
					CommonFunction.promptWithBackendMsg(response);
					$scope.$close();
				}, function(response) {
					CommonFunction.promptWithBackendMsg(response);
				});
				
			}
				
		};
		
		// 检查输入是否合法
		function check() {
			
			var isValid = true;
			
			$scope.form.$setSubmitted();
			if (isValid && ($scope.form.$invalid && ($scope.form.$dirty || $scope.form.$submitted) )) {
				isValid = false;
			}
			
		   return isValid;
		}
		
		
	    // 删除
		$scope.remove = function() {
			commenModal.sureDeleteOnlyPrompt().result.then(function(response) {
				TemporaryJobTicket.delete({id: $scope.temporaryJobticketId}, function(response) {
					$scope.$close();
				});
			});
		}
		
		$scope.dismiss = function() {
			$scope.$dismiss();
		}	
		
	    init();
	}]);
	
	
	// 制定工单
	emms.controller('JobTicketEditCtrl', ['$scope', 'Jobticket', 'toastr', 'param', '$controller', 'commenModal', 'CommonFunction', '$filter',
	function($scope, Jobticket, toastr, param, $controller, commenModal, CommonFunction, $filter) {
				
	$scope.minDate = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
				
	function init() {
		
		$scope.selectedPendingJobs = param.selectedPendingJobs;
		$scope.selectedJobTicketTemporary = param.selectedJobTicketTemporary;
		if ($scope.selectedJobTicketTemporary) {
			transformJobticketTemporary($scope.selectedJobTicketTemporary)
		}
		
		// 初始化参数
		if ($scope.unCompleteJobticket) {
			// 重新安排工单
			$scope.jobticket = $scope.unCompleteJobticket;
			$scope.selectedPendingJobs = $scope.unCompleteJobticket.pendingJobs;
			$scope.principals = [$scope.unCompleteJobticket.principal];
		} else {
			// 初始化工单
			$scope.jobticket = {};
			$scope.jobticket.isElectricity = 3;
			$scope.principals = [];
		}
		
	}
	
	// 转换临时工单
	function transformJobticketTemporary(selectedJobTicketTemporary) {
		if (selectedJobTicketTemporary) {
			$scope.temporaryJobtickets = $scope.temporaryJobtickets ? $scope.temporaryJobtickets : [];
			$scope.temporaryJobtickets.push({
				number: '#',
				name: selectedJobTicketTemporary.name,
				type: '临时修',
				time: new Date(),
				remark: selectedJobTicketTemporary.devices.reduce(function(prevValue, device) {return prevValue + device.number + ', '}, '').slice(0, -1),
				content: selectedJobTicketTemporary.content,
				devices: selectedJobTicketTemporary.devices
			});
		}
	}
	
	// 移除待办作业
	$scope.removePendingJob = function(index) {
		$scope.selectedPendingJobs.splice(index, 1);
	}
	
	// 移除临时工单
	$scope.removeTemporaryJobticket = function(index) {
		$scope.temporaryJobtickets.splice(index, 1);
	}
	
	// 选择待办作业
	$scope.selectPendingJob = function() {
		commenModal.openModal(
				'/jobtickets/template/selectPendingJob',
				'SelectPendingJobCtrl', 'lg', {selectedPendingJobs: $scope.selectedPendingJobs}).result.then(function(response) {
					
					angular.forEach(response, function(pendingJob) {
						$scope.selectedPendingJobs.push(pendingJob);
					});
					
					
				});
	}
	
	// 新增临时工单
	$scope.addJobticketTemporary = function() {
		commenModal.openModal(
				'/jobtickets/temporary/edit',
				'TemporaryJobTicketEditCtrl', '', {fromJobticketEdit: true}).result.then(function(response) {
					
					transformJobticketTemporary(response);
					
				});
	}
	
	// 选择作业负责人
	$scope.selectJobPricinpal = function() {
		commenModal.openModal(
				'/jobtickets/template/selectJobPricinpal',
				'SelectJobPricinpalCtrl', 'lg', null).result.then(function(response) {
					
					if (!$scope.principals) {
						$scope.principals = [];
					}
					$scope.principals.push(response.staffs[0]);
					
				});
	}
	
	// 多专业配合
	$scope.multiCooperate = function() {
		commenModal.openModal(
				'/jobtickets/template/multipleCooperate',
				'MultiplCooperateCtrl', 'md', {multiProfession: $scope.jobticket.multiProfession, action: 'edit'}).result.then(function(response) {
					$scope.jobticket.multiProfession = response;
				});
	}
	
	// 用车申请
	$scope.applyVehicle = function() {
		commenModal.openModal(
				'/jobtickets/template/vehicleApplication',
				'JobticketVehicleApplicationCtrl', 'lg', {vehicleApplication: $scope.jobticket.vehicleApplication}).result.then(function(response) {
					$scope.jobticket.vehicleApplication = response;
				});
	}
	
	// 改变所专业配合
	$scope.changeMultipleCooperate = function() {
		if (!$scope.jobticket.needMultipleCooperate) {
			$scope.jobticket.multiProfession = null;
		} else {
			$scope.jobticket.multiProfession = {};
			$scope.jobticket.multiProfession.depts = [];
		}
		
	}
	
	// 改变用车
	$scope.changeVehicle = function() {
		if (!$scope.jobticket.needVehicle) {
			$scope.jobticket.vehicleApplication = null;
		} else {
			$scope.jobticket.vehicleApplication = {};
		}
		
	}
	
	// 发起
	$scope.saveAndStart = function() {
		if (($scope.selectedPendingJobs && $scope.selectedPendingJobs.length === 0) && !$scope.temporaryJobtickets ) {
			toastr.warning('请选择任务');
			return ;
		}
		
		if ($scope.jobticket.needMultipleCooperate && (!$scope.jobticket.multiProfession || $scope.jobticket.multiProfession.depts.length === 0)) {
			toastr.warning('请选择多专业配合工班');
			return ;
		}
		
		if ($scope.jobticket.needVehicle && (!$scope.jobticket.vehicleApplication || !$scope.jobticket.vehicleApplication.vehicleType)) {
			toastr.warning('请填写用车申请');
			return ;
		}
		
		if (check()) {
			doSaveAndStart();
		}
	}
	
	// 新增编辑并发起
	function doSaveAndStart() {
		
		$scope.jobticket.pendingJobs = $scope.selectedPendingJobs;
		$scope.jobticket.jobTicketTemporaries = $scope.temporaryJobtickets;
		$scope.jobticket.principal = $scope.principals[0];
		
		var taskStartTicket = {};
		taskStartTicket.businessTicket = $scope.jobticket;
		var minitors = "";
		if( $scope.jobticket.needMultipleCooperate ){
			angular.forEach($scope.jobticket.multiProfession.depts, function(node){
				minitors += node.num +",";
			})
			minitors = minitors.slice(0, -1);
		}
		
		taskStartTicket.startTicket = {
				variables: [
					{name: 'principal', value: $scope.jobticket.principal.staffNo},
					{name: 'dept', value: $scope.user.dept.num},
					{name: 'minitors', value: minitors},
				]
		};
		
		Jobticket.saveAndStart(taskStartTicket, 
				function(response) {
			CommonFunction.promptWithBackendMsg(response);
			$scope.$close();
		}, function(response) {
			CommonFunction.promptWithBackendMsg(response);
		});
		
	};
	
	// 检查输入是否合法
		function check() {
			
			var isValid = true;
			
			$scope.form.$setSubmitted();
			if (isValid && ($scope.form.$invalid && ($scope.form.$dirty || $scope.form.$submitted) )) {
				isValid = false;
			}
			
			return isValid;
		}
	
		$scope.dismiss = function() {
			$scope.$dismiss();
		}	
		
		init();
	}]);
	
	// 执行周计划/工单任务控制器
	emms.controller('JobticketExecuteCtrl',['$scope', '$controller', 'param', 'WeekScheduleTask', 'JobticketTask', 'commenModal',
		'toastr', 'CommonFunction', 'dateService',
		function($scope, $controller, param, WeekScheduleTask, JobticketTask, commenModal, toastr, CommonFunction, dateService) {
		
		$controller('CommonOpenCtrl', {$scope: $scope});
		
		// 是否为周计划任务  是: 周计划, 否: 工单 
		$scope.isWeekSchedule = param.isWeekSchedule ? true : false;
		$scope.jobticketId = param.id;
		$scope.selectedMultiDeptAuditTask = param.selectedTask; // 当前的多部门审批任务
		
		function init(){
			$scope.CurrentTaskResource = $scope.isWeekSchedule ? WeekScheduleTask : JobticketTask;
			
			$scope.CurrentTaskResource.get({jobticketId: $scope.jobticketId}, function(response){
				$scope.jobticketInfo = response;
				$scope.jobticket = $scope.jobticketInfo.object;
				
				// 周计划审批中判断是否为审批任务
				if ($scope.isWeekSchedule) {
					$scope.isCurrentWeek = false;
					var monday = dateService.getMonday();
					var sunday = dateService.getSunday();
					var currentDate = $scope.jobticket.expectedStartTime;
					if (currentDate >= monday && currentDate <= sunday) {
						$scope.isCurrentWeek = true;
					}
				}
				
				// 判断是否为多专业审批任务
				if ($scope.selectedMultiDeptAuditTask) {
					$scope.jobticketInfo.tasks = [$scope.selectedMultiDeptAuditTask];
				} else {
					if ($scope.jobticketInfo.tasks.length > 1 && $scope.jobticketInfo.tasks[0].name === 'multiDeptsAudit') {
						$scope.inMultiDeptsAudit = true;
					}
				}
				
				// 判断是否为重新安排作业任务
				if ($scope.jobticketInfo.tasks.length > 0 && $scope.jobticketInfo.tasks[0].name === 'arrangeJob') {
					$scope.unCompleteJobticket = $scope.jobticket;
					$controller('JobTicketEditCtrl', {$scope: $scope});
				}
				
				// 当前任务
				if ($scope.jobticketInfo.tasks.length === 1) {
					$scope.task = $scope.jobticketInfo.tasks[0];
				}
				
				// 判断多专业审批环节是否完成了所有审批任务， 是： 关闭列表页
				if ($scope.ChildTaskComplete) {
					$scope.$close();
				}
			});
			
		}

		// 打开当前任务
		$scope.showCurrentTask = function(task) {
			
			commenModal.openModal(
					'/jobtickets/execute',
					'JobticketExecuteCtrl', 'lg', {id: $scope.jobticketId, selectedTask: task, isWeekSchedule: $scope.isWeekSchedule}).result.then(function(response) {
						// 完成子任务后任务刷新列表
						$scope.ChildTaskComplete = true;
						param.task = null;
						init();
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
					comment: $scope.jobticket.comment,
					variables: [],
			};
			
			// 根据任务状态检查必要条件和设置变量
			if (taskName === 'productionDispatcherAudit') {
				// 生产调度审批
				workflowTaskComplete.variables.push({name: 'isThisWeek', value: $scope.isCurrentWeek ? true : false});
			} 
			
			if (taskName === 'arrangeJob' ){
				workflowTaskComplete.variables.push({name: 'principal', value: $scope.jobticket.principal.staffNo});
				workflowTaskComplete.variables.push({name: 'dept', value: $scope.user.dept.num});
			}
			
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
			
			$scope.CurrentTaskResource.complete(
					taskCompleteTicket,
					function(response) {
						CommonFunction.promptWithBackendMsg(response);
						$scope.$close();
					}, function(response) {
						CommonFunction.promptWithBackendMsg(response);
					});
		}
		
		$scope.dismiss = function () {
			 $scope.$dismiss({childTaskComplete: $scope.ChildTaskComplete});
		};
		
		init();
	}]);
	
	
	return app;

}(emmsModule || {}));

