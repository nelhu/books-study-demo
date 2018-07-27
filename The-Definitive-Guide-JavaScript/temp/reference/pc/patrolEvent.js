var emmsModule = (function(app){
	
	var emms = app.emms;
	
	// 巡查事件
	emms.factory('PatrolEvent',['$resource', function($resource){
		return $resource('/patrol/events/:id',{},{
			states: {
				method: 'GET',
				url:'/patrol/events/states',
				isArray: true,
			}
		});
	}]);
	
	// 巡查事件草稿箱
	emms.factory('PatrolEventDraft',['$resource', function($resource){
		return $resource('/patrol/events/drafts/:id',{},{
			saveAndStart: {
				url: '/patrol/events/start',
				method: 'POST'
			},
		});
	}]);
	
	// 巡查事件任务
	emms.factory('PatrolEventTask', ['$resource', function($resource){
		return $resource('/patrol/events/tasks/:patrolEventId',{},{
			self: {
				method: 'GET',
				url: '/patrol/events/tasks/self',
				isArray: true,
			},
			complete: {
				method: 'POST',
				url: '/patrol/events/tasks/complete',
			},
			tasks: {
				method: 'POST',
				url: '/patrol/events/tasks',
			},
		});
	}]);
	
	// 巡查事件和巡查计划通用父控制器
	var PatrolCommonCtrl = function( $scope, $filter, commenModal, toastr) {
	
		$scope.maxDate = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
		$scope.MalfunctionImageView = function(eventId, img, ctrl) {
			  commenModal.MalfunctionImageView(eventId, img, ctrl, $scope.imgs);
		}
	
	    $scope.staffBaseInfoModal = function (staffId){
			commenModal.staffBaseInfoModal(staffId);
		}
		
		$scope.dismiss = function() {
			$scope.$dismiss();
		}	
		
		
		function prompt(response) {
			
			if (response.errorMsg) {
				toastr.error(response.errorMsg);
			}else if(response.data && response.data.errorMsg){
				toastr.error('请稍后重试');
			}else {
				toastr.success("操作成功");
				$scope.$close();
			}
		}
	};
	app.PatrolCommonCtrl = PatrolCommonCtrl;
	emms.controller('PatrolCommonCtrl', 
			['$scope', '$filter',  'commenModal', 'toastr',   app.PatrolCommonCtrl]);
	
	
	// 新增编辑事件
	emms.controller('PatrolEventEditCtrl', 
			['$scope', 'PatrolEvent', 'PatrolEventDraft', 'toastr', 'param', '$controller', '$uibModal', 'commenModal',
				'$timeout','$cookies','FileUploader', 'Level', 
		function($scope, PatrolEvent, PatrolEventDraft, toastr, param, $controller, $uibModal,
				commenModal, $timeout, $cookies, FileUploader, Level) {
			
	    $controller('uploaderParentCtrl',{$timeout: $timeout, $cookies: $cookies,
	    			$scope: $scope, FileUploader: FileUploader, url:'/images/pc', toastr: toastr});
	   
		
	    function init() {
	    	
	    	$scope.eventId = param.id;
	    	
			$scope.levels = Level.query();
			$scope.selectedItem={poi:null,create:true,markerContent:"选择位置",malfunctionDescript:true};
			
			if($scope.eventId){
				
				PatrolEventDraft.get({id: $scope.eventId},function(response){
					
					$scope.event = response;
					$scope.isSolidPatrolTask = true;
					
					$scope.selectedItem = $scope.event.location;
					$scope.selectedItem.create = true;
					$scope.selectedItem.markerContent = "重新选择故障位置";
					$scope.selectedItem.markerShow = true;
					$scope.selectedItem.malfunctionDescript = true;
					
					$scope.imgs = $scope.event.images;
				});
				
			}else{
				
				$scope.event = {};
				if (param.patrolTask) {
					$scope.isSolidPatrolTask = true;
					$scope.event.patrolTask = {
							id: param.patrolTask.id,
							number: param.patrolTask.number,
							name: param.patrolTask.name,
							executeTime: param.patrolTask.executeTime,
							owner: param.patrolTask.owner
					};
				}
				
				
			}
			
			// 图片过滤
		  	$scope.uploader.filters.push({
		        name: 'customFilter',
		        fn: function(item, options) {
		        	var uploadedImgCounts = $scope.imgs ? $scope.imgs.length : 0;
		        	if ($scope.showMsg && (this.queue.length == 9 || (this.queue.length + uploadedImgCounts == 9))) {
		        		toastr.warning('单次上传图片限制9张!');
		        		$scope.showMsg = false;
		        		$timeout(1500).then(function() {
		        			$scope.showMsg = true;
		        		});
		        	}
		            return (this.queue.length + uploadedImgCounts) < 9;
		        }
		    });
			
		}
	    
	    $scope.preview = function (index){
			  commenModal.previewPicture(index, $scope.uploader.queue);
		}
	    
	   // 图片上传完成
       $scope.uploader.onCompleteAll = function() {
	       if($scope.imgErrorCount > 0) {
	    	   toastr.error("您有"+$scope.imgErrorCount+"张图片未上传成功，请稍后重试");
	    	   $timeout(1500).then();
	       } else {
	    	   
	    	   if ($scope.successImgIds && $scope.successImgIds.length > 0) {
	    		   
	    		   $scope.event.addedImages = $scope.successImgIds;
	    	   }
	    	   
	    	   if ($scope.action == 'save') {
	    		   doSave();
	    	   } else {
	    		   doSaveAndStart();
	    	   }
	       }
		};
	   
	   
		// 选择所属计划任务
		$scope.selectPatrolTask = function() {
			commenModal.openModal(
					'patrol/tasks/template/taskFragment',
					'PatrolTaskListCtrl', 'lg', null).result.then(function(response) {
						$scope.event.patrolTask = response;
					});
		}
		
	   // 打开地图模态框
	   $scope.openMap = function(){
	     $uibModal.open({
	    		backdrop:"static",
		        templateUrl: "/maps",
		        controller: 'MarkerCtrl',
		        windowClass:'mapSize',
		        resolve: {
		        	params: function() {return $scope.selectedItem;}
		        }
		    }).result.then(function(selectedItem) {
		    	selectedItem.create =true;
		    	selectedItem.markerShow = true;
		    	selectedItem.malfunctionDescript=true;
		    	selectedItem.markerContent = "重新选择故障位置";
		    	$scope.selectedItem = selectedItem;
		    	$scope.event.location = $scope.selectedItem;
		    	$scope.event.locationDescription = $scope.selectedItem.poi;
		    });
	    }
		   
	   // 保存
	   $scope.save = function() {
		   
			if (check()) {

				$scope.action = 'save';
				// 保存图片
				if ($scope.uploader.getNotUploadedItems().length > 0) {
					$scope.uploader.uploadAll();
				} else {
					
					doSave();
					
				}
			}
		   
	   }
	   

		// 发起
		$scope.saveAndStart = function() {
			
			if (check()) {
				
				$scope.action = 'saveAndStart';
				// 保存图片
				if ($scope.uploader.getNotUploadedItems().length > 0) {
					$scope.uploader.uploadAll();
				} else {
					doSaveAndStart();
				}
				
			}
	
		}
		
		   
		// 新增编辑
		function doSave() {
			
			PatrolEvent.save($scope.event, function(response) {
				prompt(response);
				$scope.$close({key: 'switch', value: 'toDraft'});
			});
				
		};
		
	// 新增编辑并发起
	function doSaveAndStart() {

		var taskStartTicket = {};
		taskStartTicket.businessTicket = $scope.event;
		taskStartTicket.startTicket = {
				variables: [
					{name: 'checker', value: $scope.event.patrolTask.owner}, /*事件所属计划任务的责任部门编号*/
				],
		};
		
		PatrolEventDraft.saveAndStart(taskStartTicket, 
		function(response) {
			prompt(response);
			$scope.$close({key: 'switch', value: 'toTask'});
		}, function(response) {
			prompt(response);
		});
		
	};
	
	function prompt(response) {
		
		if (response.errorMsg || (response.data && response.data.errorMsg)) {
			toastr.error('请稍后重试');
		} else {
			var failMsg;
			if ($scope.eventId && $scope.action == 'save') {
				failMsg = "更新成功";
			} else {
				if ($scope.action == 'saveAndStart') {
					failMsg = "发起成功";
				} else {
					failMsg = "保存成功";
				}
			}
			toastr.success(failMsg);
		}
		
	}
		
		// 检查输入是否合法
		function check() {
			
			var isValid = true;
			
			$scope.form.$setSubmitted();
			if (isValid && ($scope.form.$invalid && ($scope.form.$dirty || $scope.form.$submitted) )) {
				isValid = false;
			}
			
		   return isValid;
		}
		
		
		// 编辑 删除照片
	    $scope.imageRemove = function(eventId, img){
			
		 	if (!$scope.event.removeImages) {
	    		$scope.event.removeImages = [];
	    	}
	    	
			$scope.imgs.splice($scope.imgs.indexOf(img),1);
			$scope.event.removeImages.push(img);
			
	   }
		
	    // 删除
		$scope.remove = function() {
			commenModal.sureDeleteOnlyPrompt().result.then(function(response) {
				PatrolEvent.delete({id: $scope.eventId}, function(response) {
					$scope.$close();
				});
			});
		}
		
	    
	    $controller('PatrolCommonCtrl', {$scope: $scope, commenModal: commenModal, toastr:toastr});
	    
	    init();
	}]);
	
	// 执行事件任务
	emms.controller('PatrolEventExecuteCtrl', 
			['$scope', 'PatrolEventTask', 'toastr', 'param', '$controller', '$uibModal', 'commenModal', 'FileUploader', 
		function($scope, PatrolEventTask, toastr, param, $controller, $uibModal, commenModal, FileUploader) {
			
		function init() {
			
			$scope.eventId = param.id;
			
			if($scope.eventId){
				PatrolEventTask.get({patrolEventId : $scope.eventId},function(response){
					$scope.eventInfo = response;
					$scope.object = $scope.eventInfo.object;
					$scope.imgs = $scope.object.images;
					
					$scope.closeTask = $scope.eventInfo.tasks.filter(function(task) {
						return task.name === 'check';
					})[0];
					
				});
			}
			
		}
	   
	   
	    // 打开地图模态框
		$scope.openMap = function(){
				$scope.object.location.create=false;
				$scope.object.location.markerShow=true;
				$scope.object.location.malfunctionDescript=true;
				commenModal.viewMapModel($scope.object.location,'MarkerViewCtrl');
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
						if (response.errorMsg || (response.data && response.data.errorMsg)) {
							toastr.error('请稍后重试');
						} else {
							toastr.success("操作成功");
							$scope.$close();
						}
					});
		}
		
        function prompt(response) {
			
			if (response.errorMsg) {
				toastr.error(response.errorMsg);
			}else if(response.data && response.data.errorMsg){
				toastr.error('请稍后重试');
			}else {
				toastr.success("操作成功");
				$scope.$close();
			}
		}
        
		init();
		$controller('PatrolCommonCtrl', {$scope: $scope, commenModal: commenModal, toastr:toastr});
		$controller('CommonOpenCtrl', {$scope: $scope});
	}]);
	
	
	
	// 图片查看详情
	emms.controller('ImageViewCtrl',
			['$scope', '$state', 'params', function ($scope, $state, params) {
	  
		function  init(){
				
				$scope.imgs = params.data;
				$scope.images=[];
				for(var i=0;i<$scope.imgs.length;i++){
					if($scope.imgs[i] == params.img){
						$scope.active = i;
					}
					$scope.images.push({
						rawData:"/images/originalImage/"+$scope.imgs[i],
						index:i
					});
				}
		}
		init();
		
   	    $scope.dismiss = function() {
			 $scope.$dismiss();
		};
		
	}]);
	
//////////////////////////

// 巡查事件任务列表
emms.controller('PatrolEventTaskListCtrl',['$scope', '$filter', '$state', '$controller', 'PatrolEvent', 'PatrolEventTask', 'commenModal', 'Level', 
	function($scope, $filter, $state, $controller, PatrolEvent, PatrolEventTask, commenModal, Level) {
	
	var currentDate = new Date();
	$scope.startMaxDate = $filter("date")(currentDate,'yyyy-MM-dd HH:mm:ss');
	$scope.endMaxDate = $filter("date")(currentDate.setDate(currentDate.getDate()+1),'yyyy-MM-dd HH:mm:ss');
	
	function init() {
		
		// 级别
		Level.query(function(response) {
			$scope.levels = response;
		});
		
		// 巡查事件状态
		$scope.states = PatrolEvent.states();
		$scope.conditions.state.value[0] = '待关闭';
		
	}
	
	$scope.initCondition = function() {
		$scope.conditions = {
				number: {name: 'number', value: [], fuzzy: true},
				name: {name: 'name', value: [], fuzzy: true},
				level: {name: 'level', value: [], fuzzy: false},
				reporter: {name: 'reporter', value: [], fuzzy: true},
				locationDescription: {name: 'locationDescription', value: [], fuzzy: true},
				state: {name: 'state', value: [], fuzzy: false}
		};
	}
	
	// 事件分布图
	$scope.openMap = function(){
			commenModal.viewMapModel({type: 'patrolEvent'},'PointsCtrl')
			.result.then(function(response) {
				$scope.pageChange();
			}, function() {
				$scope.pageChange();
			});
	}
	
	$controller('BusinessTaskListCtrl', {$scope: $scope, TaskResource: PatrolEventTask});
	init();
}]);


// 巡查事件待发起列表
emms.controller('PatrolEventDraftListCtrl', ['$scope', '$state', '$controller', 'PatrolEventDraft',
	function($scope, $state, $controller, PatrolEventDraft) {
	
	$scope.action = 'Draft';
	
	$controller('BusinessDraftListCtrl', {$scope: $scope, DraftResource: PatrolEventDraft});
	
}]);

// 巡查事件个人任务
emms.controller('PatrolEventSelfTaskCtrl', ['$scope', '$controller', 'PatrolEventTask', 
	function($scope, $controller, PatrolEventTask) {
	
	$controller('BusinessSelfTaskListCtrl', {$scope: $scope, TaskResource: PatrolEventTask});
	
}]);

	return app;

}(emmsModule || {}));

