/**
 * description - resolve mobile jobOrders related operation
 * create - Nelson.Xuezi.Hu
 * date - 2018-04-10
 */
var emmsMobileModule = (function(mobileApp) {
	var emmsMobile = mobileApp.emmsMobile;
	
	// 巡查任务个人任务列表
	emmsMobile.controller('PatrolTaskSelfTaskCtrl', ['$scope', '$controller', 'PatrolTask', function($scope, $controller, PatrolTask) {
		
		$controller('BusinessSelfTaskListCtrl', {$scope: $scope, TaskResource: PatrolTask});
		
	}]);
	
	// 巡查事件个人任务列表
	emmsMobile.controller('PatrolEventSelfTaskCtrl', ['$scope', '$controller', 'PatrolEventTask', function($scope, $controller, PatrolEventTask) {
		
		$controller('BusinessSelfTaskListCtrl', {$scope: $scope, TaskResource: PatrolEventTask});
		
	}]);
	
	
	// 巡查事件待发起列表
	emmsMobile.controller('PatrolEventDraftListCtrl', ['$scope', '$state', '$controller', 'PatrolEventDraft',
		function($scope, $state, $controller, PatrolEventDraft) {
		
		$controller('BusinessDraftListCtrl', {$scope: $scope, DraftResource: PatrolEventDraft});
	}]);
	
	
	// 执行巡查任务
	emmsMobile.controller('PatrolTaskExecuteMobileCtrl',
			['$scope', '$controller', 'PatrolTask', '$stateParams', 'SweetAlert', '$state', 'Map',
		function($scope, $controller, PatrolTask, $stateParams, SweetAlert, $state, Map) {
		
		function init() {
			
			$scope.taskId = $stateParams.param.id;
			
			if($scope.taskId){
				PatrolTask.get({patrolTaskId : $scope.taskId},function(response){
					$scope.taskInfo = response;
					$scope.task = $scope.taskInfo.object;
					
					// 过滤撤销任务
					$scope.currentTask = $scope.taskInfo.tasks.filter(function(task) {
						return task.name !== 'recall';
					})[0];
					
				});
			}
			
		}
		
		$scope.submitEvent = function() {
			
			$state.go('patrols.event.edit', {param: {patrolTask: $scope.task, patrolTaskId: $scope.taskId}});
			
		}
	   

		// 完成任务
		$scope.complete = function() {
			
			var state;
			if ($scope.currentTask.name === 'startCheck') {
				state = '执行中';
			} else {
				state = '已完成';
			}
			
			var workflowTaskComplete = {
					taskId: $scope.currentTask.id,
					taskName: $scope.currentTask.name,
					result: $scope.currentTask.name,
					role: null,
					state: state,
					comment: $scope.comment,
					variables: []
			};
			
			var taskCompleteTicket = {
					workflowTask: $scope.taskInfo,
					taskComplete: workflowTaskComplete,
			};
			
			// 完成任务
			PatrolTask.complete(
					taskCompleteTicket,
					function(response) {
						prompt(response);
					});
		}
		
		
		// 查看路线
		$scope.viewRoute = function() {
			if($scope.task && $scope.task.route && $scope.task.route.locations){
				$state.go('map.locationRouteShow', {id: $scope.taskId, locations: $scope.task.route.locations});
			}
		}
		
		// 查看人员轨迹
		$scope.viewPath = function() {
			if($scope.currentTask.name == "endCheck"){
				 Map.queryPath({num: $scope.task.executor.staffNo,
			                    startTime: $scope.task.executeTime}, function(response){
				   
			           $state.go('map.locationPathShow',
			        		         {id: $scope.taskId, startTime: $scope.task.executeTime,
				    	              objectId : $scope.task.executor.staffNo,  locations : response});
			   })
			}
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
				$state.go('patrols.list');
			}
		}
		
		$scope.back = function() {
			$state.go('patrols.list');
		}
		
		$controller('CommonUnPageScrollCtrl', {$scope: $scope});
		
		init();
	}]);
	
	// 添加巡查事件
	emmsMobile.controller('PatrolEventEditMobileCtrl', ['$scope', '$rootScope', 'MalfunctionService', '$controller', '$stateParams', 
			'SweetAlert', '$state', 'PatrolEvent', 'PatrolEventDraft', 'Level', 'Image',
		function($scope, $rootScope, MalfunctionService, $controller, $stateParams, SweetAlert, $state, PatrolEvent, PatrolEventDraft, Level, Image) {
		
		$controller('CommonUnPageScrollCtrl', {$scope: $scope});
		// 选择图片相关方法
		$controller('MalfunctionQuickAddMobileCtrl', {$scope: $scope});
		
		function init() {
			
			$scope.event = $stateParams.event == null ? {} : $stateParams.event;
			if ($stateParams.param && $stateParams.param.patrolTask) {
				$scope.event.patrolTask = {
						id: $stateParams.param.patrolTask.id,
						number: $stateParams.param.patrolTask.number,
						name: $stateParams.param.patrolTask.name,
						executeTime: $stateParams.param.patrolTask.executeTime,
						owner: $stateParams.param.patrolTask.owner
				};
			}
			
			$scope.eventId = $scope.event.id ? $scope.event.id : ($stateParams.param ? $stateParams.param.id : null);
			
			Level.query(function(response) {
				$scope.levels = response;
			});
			$scope.action = 'add'; // 默认操作为 添加
			
			if (!$scope.event.id && $scope.eventId) {
				$scope.action = 'update'; // 当前操作为提交
				PatrolEventDraft.get({id: $scope.eventId}, function(response) {
					$scope.event = response;
					$scope.device = response.device;
				});
			};
			
			// 获取当前位置
			if ($scope.action === 'add' && !$scope.event.location ) {
				var location = $rootScope.getCurrentLocation();
				$scope.event.location = location;
			}
			
			$scope.event.uploadedImgs = ($scope.event && $scope.event.uploadedImgs) ? $scope.event.uploadedImgs : [];
		};
		
		
		
		// 选择位置
		$scope.selectLocation = function() {
			
			if ($scope.action == 'add') {
				$scope.locationState = {action: true, markerContent: "选择位置"};
				$scope.event.location =  {id : null};
			}else{
				$scope.locationState = {action: false, markerContent: "选择位置"};
			}
			
			$state.go('map.LocationSelected', {param:{source: $scope.event,state: $scope.locationState, type: "patrolEvent"}});
		}
		
		// 选择所属巡查任务
		$scope.selectPatrolTask = function() {
			
//			commenModal.openModal(
//					'patrol/tasks/template/selectTask',
//					'SelectPatrolTaskListCtrl', 'lg', null).result.then(function(response) {
//						$scope.event.patrolTask = response; // 执法任务单号 	
//					});
			
			$state.go('patrols.task.select', {param: {event: $scope.event}});
			
		}
		
		
	   // 保存事件
		$scope.save = function() {
			
			if (check()) {

				$scope.operation = 'save';
				if ($scope.imgs && $scope.imgs.length >= 1) {
					uploadImageAndContinue();
				} else {
					doSave();
				}
				
			};
		};

		// 发起
		$scope.saveAndStart = function() {
			
			if (check($scope.malfunction)) {
				
				$scope.operation = 'saveAndStart';
				if ($scope.imgs && $scope.imgs.length >= 1) {
					uploadImageAndContinue();
				} else {
					doSaveAndStart();
				}
				
			}
	
		}
		
		
		function uploadImageAndContinue() {
			
			if (!$scope.event.addedImages) {
				$scope.event.addedImages = [];
			}
			
			if ($scope.checkImg() && typeof(JsInterface) != 'undefined') {
				angular.forEach($scope.imgs, function(img) {
					if ($scope.event.uploadedImgs.indexOf(img.identifier) == -1) {
						var tempImg = MalfunctionService.convertImg(img.identifier);
						if (tempImg) {
							Image.save(tempImg, function(response) {
								$scope.event.addedImages.push(response.id);
								$scope.event.uploadedImgs.push(img.identifier);
								if ($scope.event.addedImages.length == $scope.imgs.length) {
									doSaveOrStart();
								}
								
							}, function() {
								showMessage('图片上传未成功， 请稍后重试');
							});
							
						}
					}
				});
				
				
			};
			
		}
		
		
		function doSaveOrStart(){
			if ($scope.operation === 'save') {
				doSave();
			} else {
	    	    doSaveAndStart();
			}
		}
		
		// 新增编辑
		function doSave() {
			$scope.event.locationDescription = $scope.event.location.poi;
			PatrolEvent.save($scope.event, function(response) {
				prompt(response);
			});
				
		};
		
		// 新增编辑并发起
		function doSaveAndStart() {

			$scope.event.locationDescription = $scope.event.location.poi;
			
			var taskStartTicket = {};
			taskStartTicket.businessTicket = $scope.event;
			taskStartTicket.startTicket = {
					variables: [
						{name: 'checker', value: $scope.event.patrolTask.owner}, /*巡查任务的责任部门编号*/
					],
			};
			
			PatrolEventDraft.saveAndStart(taskStartTicket, 
			function(response) {
				prompt(response);
			}, function(response) {
				prompt(response);
			});
			
		};
		
		function prompt(response) {
			
			if (response.errorMsg || (response.data && response.data.errorMsg)) {
			
				showMessage('请稍后重试');
				
			} else {
				
				var msg;
				if ($scope.operation == 'saveAndStart') {
					msg = "成功发起";
				} else {
					if ($scope.eventId) {
						msg = "更新成功";
					} else {
						msg = "保存成功";
					}
				}
				SweetAlert.swal({
					title: ' ',
					text: msg,
					type: 'success'
				});
				// 回到待发起页面
				$state.go('patrols.list', {destination: 'tab3'});
				
			}
			
		}
		
		
	   // 返回
	   $scope.back = function() {
		   
		   SweetAlert.swal({
				title: '确认返回?',
				type: 'warning',
				showCancelButton: true,
				cancelButtonText: '取消',
				confirmButtonColor: 'green',
				confirmButtonText: '确认'
			}, function(isConfirm) {
				if (isConfirm) {
					if ($stateParams.param && $stateParams.param.patrolTaskId) {
						$state.go('patrols.task.execute', {param: {id: $stateParams.param.patrolTaskId}});
					} else {
						$state.go('patrols.list', {destination: 'tab3'});
					}
				} else {
					return;
				}
			})
			
	   }
	   
	   // 删除故障
	   $scope.remove = function() {
		   
		   SweetAlert.swal({
				title: '确认删除?',
				type: 'warning',
				showCancelButton: true,
				cancelButtonText: '取消',
				confirmButtonColor: 'green',
				confirmButtonText: '确认'
			}, function(isConfirm) {
				if (isConfirm) {
					PatrolEvent.delete({id: $scope.eventId}, function(response) {
						$state.go('patrols.list', {destination: 'tab3'});
					});
				} else {
					return;
				}
			})
			
	   }
		
	   // 检查用户输入
	   function check() {
		   
		   var flag = true;
		   
			if (!$scope.event.name) {
				showMessage('请输入标题');
				flag = false;
			}
//			if (!$scope.event.level) {
//				showMessage('请选择所属任务');
//				flag = false;
//			}
			if (!$scope.event.level) {
				showMessage('请选择级别');
				flag = false;
			}
			if (!$scope.event.happenTime) {
				showMessage('请选择发生时间');
				flag = false;
			}
			if (!$scope.event.location) {
				showMessage('请选择位置');
				flag = false;
			}
			if (!$scope.event.summary) {
				showMessage('请输入描述');
				flag = false;
			}
			
			return flag;
	   };
	   
		
		init();
	}]);
	
	// 执行巡查事件
	emmsMobile.controller('PatrolExecuteEventMobileCtrl', ['$scope', '$controller', '$stateParams', 'SweetAlert', '$state', 'PatrolEventTask', 'SharedState',
		function($scope, $controller, $stateParams, SweetAlert, $state, PatrolEventTask, SharedState) {
		
		function init() {
			
			$scope.eventId = $stateParams.param && $stateParams.param.id;
			$scope.fromMap = $stateParams.param && $stateParams.param.fromMap;
			
			if($scope.eventId){
				PatrolEventTask.get({patrolEventId : $scope.eventId},function(response){
					$scope.eventInfo = response;
					$scope.object = $scope.eventInfo.object;
					
					$scope.closeTask = $scope.eventInfo.tasks.filter(function(task) {
						return task.name === 'check';
					})[0];
					
				});
			}
			
		}
	   
		// 完成任务
		$scope.complete = function() {
			
			var workflowTaskComplete = {
					taskId: $scope.closeTask.id,
					taskName: $scope.closeTask.name,
					result: 'check',
					role: '',
					state: '已关闭',
					comment: $scope.comment,
					candidateDeptNum: '',
					variables: []
			};
			
			var taskCompleteTicket = {
					workflowTask: $scope.eventInfo,
					taskComplete: workflowTaskComplete,
			};
			
			
			// 完成任务
			PatrolEventTask.complete(
					taskCompleteTicket,
					function(response) {
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
		
		
		// 预览图片
		$scope.previewImg = function(index) {
			$scope.activeImgs = [];
			
			// 已经上传的图片
			angular.forEach($scope.object.images, function(img) {
				$scope.activeImgs.push(img);
			});
			
			$scope.activeIndex = index;
			
			SharedState.turnOn('AllMalfunctionImgView');
		} 
		
		// 图片轮播容器
		$scope.initImgContainer = function() {

			var malfunctionImgSwiper = new Swiper('.swiper-container', {
				
				initialSlide: $scope.activeIndex,
				speed: 500,
				
				lazyLoading: true, // 开启图片懒加载
				lazyLoadingOnTransitionStart : true, // 当transition开始时就开始加载
				lazyLoadingInPrevNext: true, // 懒加载前后图片
				
				zoom: true,
				zoomMin: 1,
				
				observer:true,
				observeParents:true,
				
				pagination: '.swiper-pagination',
				paginationType: 'fraction'
				
			});
	    
		};
		
		$scope.back = function() {
			if ($scope.fromMap) {
				$state.go('map.locationPoints', {type:'event'});
			} else {
				$state.go('patrols.list', {destination: 'tab2'});
			}
			
		}
		
		$controller('CommonUnPageScrollCtrl', {$scope: $scope});
		
		init();
	}]);

	
	// 巡查任务-任务列表(带查询)
	emmsMobile.controller('SelectPatrolTaskMobileCtrl',['$scope', '$filter', '$state', '$stateParams', '$controller', 'PatrolTask',
		function($scope, $filter, $state, $stateParams, $controller, PatrolTask) {
		
		var currentDate = new Date();
		$scope.startMaxDate = $filter("date")(currentDate,'yyyy-MM-dd HH:mm:ss');
		$scope.endMaxDate = $filter("date")(currentDate.setDate(currentDate.getDate()+1),'yyyy-MM-dd HH:mm:ss');
		
		function init() {
			
			$scope.action = 'selectPatrolTask';
			
			// 巡查事件状态
			PatrolTask.states(function(response) {
				
//				$scope.states = response.map(function(state, index) {
//					return {id: index, name: state, value: state};
//				});
				
				$scope.states = response;
			});
			
			
		}
		
		$scope.initCondition = function() {
			$scope.conditions = {
					name: {name: 'name', value: [], fuzzy: true},
					state: {name: 'state', value: [], fuzzy: false},
			};
		}
		
		// 选中任务并关闭页面
		$scope.selectPatrolTask = function(task) {
			$stateParams.param.event.patrolTask = task;
			$scope.back();
		}
		
		$scope.back = function () {
			$state.go('patrols.event.edit', {event: $stateParams.param.event});
		};
		
		$controller('BusinessTaskListCtrl', {$scope: $scope, TaskResource: PatrolTask});
		init();
	}]);
	
	
	
	return mobileApp;
}(emmsMobileModule || {}));