var emmsModule = (function(app){
	
	var emms = app.emms;

	emms.factory('Level', ['$resource', function($resource){
		return $resource('/malfunctions/levels/:id');
	}]);
	
	emms.factory('Malfunction',['$resource', function($resource){
		return $resource('/malfunctions/:id',{},{
			save: {
				method: 'POST',
			},
			queryImage: {
				method: 'GET',
				url:'/malfunctions/:id/images',
				isArray: true,
			},
			managedMalfunction:{
				method:'GET',
				url:'/malfunctions/managedMalfunction'
			},
			states: {
				method: 'GET',
				url:'/malfunctions/states',
				isArray: true,
			},
		});
	}]);
	
	// 故障草稿箱
	emms.factory('MalfunctionDraft',['$resource', function($resource){
		return $resource('/malfunctions/drafts/:id',{},{
			saveAndStart: {
				url: '/malfunctions/start',
				method: 'POST'
			},
		});
	}]);
	
	// 故障任务
	emms.factory('MalfunctionTask', ['$resource', function($resource){
		return $resource('/malfunctions/tasks/:malfunctionId',{},{
			self: {
				method: 'GET',
				url: '/malfunctions/tasks/self',
				isArray: true,
			},
			complete: {
				method: 'POST',
				url: '/malfunctions/tasks/complete',
			},
			tasks: {
				method: 'POST',
				url: '/malfunctions/tasks',
			},
		});
	}]);
	
	// 故障个人任务
	emms.controller('MalfunctionSelfTaskCtrl', ['$scope', '$controller', 'MalfunctionTask', function($scope, $controller, MalfunctionTask) {
		
		$controller('BusinessSelfTaskListCtrl', {$scope: $scope, TaskResource: MalfunctionTask});
		
	}]);
	
	// 故障任务列表
	emms.controller('MalfunctionTaskListCtrl',['$scope','$uibModal','$filter', '$state', '$controller', 'MalfunctionTask', 'commenModal', 'Level', 'Malfunction',
		function($scope,$uibModal,$filter, $state, $controller, MalfunctionTask, commenModal, Level, Malfunction) {
		
		var currentDate = new Date();
		$scope.startMaxDate = $filter("date")(currentDate,'yyyy-MM-dd HH:mm:ss');
		$scope.endMaxDate = $filter("date")(currentDate.setDate(currentDate.getDate()+1),'yyyy-MM-dd HH:mm:ss');
		function init() {
			
			// 故障级别
			Level.query(function(response) {
				$scope.levels = response;
			});
			
			// 故障单状态
			$scope.states = Malfunction.states();
			
		}
		
		$scope.initCondition = function() {
			$scope.conditions = {
					number: {name: 'number', value: [], fuzzy: true},
					name: {name: 'name', value: [], fuzzy: true},
					level: {name: 'level', value: [], fuzzy: false},
					reporter: {name: 'reporter', value: [], fuzzy: true},
					state: {name: 'state', value: [], fuzzy: true},
			};
		}
		
		$scope.child_result_handler = function() {
			for (var i in $scope.results) {
				if ($scope.results[i].level == '紧急') {
					$scope.hasEmergency = true;
					break;
				}
			}
		}
		
		// 分布图
		$scope.openMap = function(){
				
				commenModal.viewMapModel({type: 'malfunction'},'PointsCtrl')
				.result.then(function(response) {
					$scope.pageChange();
				}, function() {
					$scope.pageChange();
				});
		}
		
		// 紧急抢修智囊团
		$scope.showEmergencyGroup=function() {
			commenModal.openModal(
					'/system/staffs/emergencyGroup/show',
					'EmergencyGroupCtrl', 'lg', null).result.then(function(response) {
						
					});
			
		   }
		
		$controller('BusinessTaskListCtrl', {$scope: $scope, TaskResource: MalfunctionTask});
		init();
	}]);
	
	// 故障待发起列表
	emms.controller('MalfunctionDraftListCtrl', ['$scope', '$state', '$controller', 'MalfunctionDraft',
		function($scope, $state, $controller, MalfunctionDraft) {
		
		$controller('BusinessDraftListCtrl', {$scope: $scope, DraftResource: MalfunctionDraft});
	}]);
	
	// 打开模态框
	var CommenModalCtrl = function( $scope, commenModal) {
		
		$scope.viewDevice = function(deviceId){
			  commenModal.deviceDetailModel(deviceId);
		}
		
	    $scope.preview = function (index){
			  commenModal.previewPicture(index, $scope.uploader.queue);
		}
		   
		$scope.MalfunctionImageView = function(malfunctionId, img, ctrl) {
			  commenModal.MalfunctionImageView(malfunctionId, img, ctrl);
		}
		
		$scope.staffBaseInfoModal = function (staffId){
			commenModal.staffBaseInfoModal(staffId);
		}
		
		$scope.dismiss = function () {
			 $scope.$dismiss();
		};
	};
	app.CommenModalCtrl = CommenModalCtrl;
	emms.controller('CommenModalCtrl', [ '$scope', 'commenModal', app.CommenModalCtrl]);
	
	
	
	// 选择单个设备
	var MalfunctionSelectedDeviceCtrl = function( $scope, Device, scope) {
		$scope.pageInfos = {number: 1, size : 10};
		$scope.selectNode = {};
		$scope.treeType = "device";
		
		// 查询设备
		$scope.pageChange = function (pattern,pageInfos) {
	        	$scope.pageInfos = Device.queryPageDevice(
	        			                     {scope: scope, page : $scope.pageInfos.number-1,
	        		                          size : $scope.pageInfos.size,
	        		                          name : $scope.pattern}, $scope.selectNode , function(pageInfos){
	        			pageInfos.number = pageInfos.number+1;
	        	});	
	    }
		 
		
		// 选择设备
		$scope.selectDevice = function(index) {
			var device = $scope.pageInfos.content[index];
			if ($scope.childSelected) {
				$scope.childSelected(device);
			} else {
				if($scope.object != undefined ){
					$scope.object.device = device;
				}else{
					$scope.malfunction.device = device; 
				}
				$scope.pattern = device.number;
			}
		};
	};
	app.MalfunctionSelectedDeviceCtrl = MalfunctionSelectedDeviceCtrl;
	emms.controller('MalfunctionSelectedDeviceCtrl', [ '$scope', 'Device', 'scope', app.MalfunctionSelectedDeviceCtrl]);
	
	
	// 创建/更新 故障ctrl
	emms.controller('MalfunctionEditCtrl', ['$scope','$state', '$rootScope','$cookies', 'Level', '$uibModal', 'Task','Malfunction', 'toastr',
		'FileUploader', 'Device','param','commenModal', "$timeout", "$controller", 'MalfunctionDraft',
			function($scope, $state, $rootScope, $cookies, Level, $uibModal, Task, Malfunction, toastr, FileUploader, Device, 
					param, commenModal,$timeout, $controller, MalfunctionDraft) {
		
		$controller('CommenModalCtrl', {$scope: $scope, commenModal: commenModal});
		$controller('uploaderParentCtrl', {$timeout: $timeout, $cookies: $cookies,
			  $scope: $scope, FileUploader: FileUploader, url:'/images/pc', toastr: toastr});
	
		function inits() {
			
			$scope.levels = Level.query();
			
			$scope.malfunctionId = param.id;
			$scope.pageSize = [10,15,20];
			$scope.isCollapsed = true;
			$scope.pageInfos = null;
	    	$scope.images = null;
	    	$scope.active = -1;
	    	$scope.selectedItem={poi:null,create:true,markerContent:"选择位置",malfunctionDescript:true};
	 		
			if($scope.malfunctionId){
				
				MalfunctionDraft.get({id: $scope.malfunctionId},function(response){
					
					$scope.malfunction = response;
					
					if($scope.malfunction.device != null){
						$scope.pattern = $scope.malfunction.device.professionalNumber;
					}
					
					$scope.selectedItem = $scope.malfunction.location;
					$scope.selectedItem.create = true;
					$scope.selectedItem.markerContent = "重新选择故障位置";
					$scope.selectedItem.markerShow = true;
					$scope.selectedItem.malfunctionDescript = true;
					
					$scope.imgs = $scope.malfunction.images;
				   	
					
				});
				
			} else {
				$scope.malfunction = {};
			}
			
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
		    	$scope.malfunction.location = $scope.selectedItem;
		    });
	    }
	   
		// 选择检修设备
		$scope.selectDevices = function() {
			var modalInstance = commenModal.openModal(
					'/jobtickets/template/selectDevice',
					'SingleSelectDeviceCtrl', 'lg', {scope: 'all'});
			modalInstance.result.then(function(response) {
						$scope.malfunction.device = response;	
					});
		}
		
		// 移除设备
		$scope.removeDevice = function() {
			$scope.malfunction.device = null;
		}
	   
	   // 保存故障
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
    	
	   // 图片上传完成
       $scope.uploader.onCompleteAll = function() {
	       if($scope.imgErrorCount > 0) {
	    	   toastr.error("您有"+$scope.imgErrorCount+"张图片未上传成功，请稍后重试");
	    	   $timeout(1500).then();
	       } else {
	    	   
	    	   if ($scope.successImgIds && $scope.successImgIds.length > 0) {
	    		   
	    		   $scope.malfunction.addedImages = $scope.successImgIds;
	    	   }
	    	   
	    	   if ($scope.action == 'save') {
	    		   doSave();
	    	   } else {
	    		   doSaveAndStart();
	    	   }
	       }
		};
			
		// 检查输入是否合法
		function check() {
			
			var isValid = true;
			$scope.form.$setSubmitted();
			if (isValid && ($scope.form.$invalid && ($scope.form.$dirty || $scope.form.$submitted) )) {
				isValid = false;
			}
			
		   if(isValid && (!$scope.selectedItem.longitude || !$scope.selectedItem.type)){
				toastr.warning("位置信息不能为空");
				isValid = false;
			}
			
		   return isValid;
		}
	   
		// 新增编辑
		function doSave() {
			
			Malfunction.save($scope.malfunction, function(response) {
				prompt(response);
				$scope.$close({key: 'switch', value: 'toDraft'});
			});
				
		};
		
		// 新增编辑并发起
		function doSaveAndStart() {

			var taskStartTicket = {};
			var startTicket = {
					role: 'ROLE_AUDIT_MALFUNCTION',
					variables: [],
			};
			taskStartTicket.businessTicket = $scope.malfunction;
			
			if ($scope.malfunction.device) { // 有设备
				
				startTicket.variables.push({name: 'auditors', value: $scope.malfunction.device.ownerNum});
				startTicket.variables.push({name: 'repairer', value: $scope.malfunction.device.ownerNum});
				startTicket.variables.push({name: 'verifier', value: $scope.malfunction.device.clientNum});
				taskStartTicket.startTicket = startTicket;
				
				finalSaveAndStart(taskStartTicket);
				
			} else { // 无设备-选择调度部门
				
				commenModal.selectAssignDept().result.then(function(number) {
							startTicket.variables.push({name: 'auditors', value: number});
							startTicket.variables.push({name: 'repairer', value: ''});
							startTicket.variables.push({name: 'verifier', value: ''});
							taskStartTicket.startTicket = startTicket;
							
							finalSaveAndStart(taskStartTicket);
						});
				
			}
			
		};
		
		// 发起
		function finalSaveAndStart(taskStartTicket) {
			
			MalfunctionDraft.saveAndStart(taskStartTicket, 
					function(response) {
						prompt(response);
						$scope.$close({key: 'switch', value: 'toTask'});
					}, function(response) {
						prompt(response);
					});
					
		}
		
		
		function prompt(response) {
			
			if (response.errorMsg || (response.data && response.data.errorMsg)) {
				toastr.error('请稍后重试');
				// 是否需要重新上传图片序列
			} else {
				var failMsg;
				if ($scope.malfunctionId && $scope.action == 'save') {
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
		
		// 删除
		$scope.remove = function() {
			commenModal.sureDeleteOnlyPrompt().result.then(function(response) {
				Malfunction.delete({id: $scope.malfunctionId}, function(response) {
					$scope.$close();
				});
			});
		}
		
		// 编辑 malfunction 删除照片
	    $scope.imageRemove = function(img){
	    	
	    	if (!$scope.malfunction.removeImages) {
	    		$scope.malfunction.removeImages = [];
	    	}
	    	
			$scope.imgs.splice($scope.imgs.indexOf(img),1);
			$scope.malfunction.removeImages.push(img);
			
	   }
	    
		inits();
	}]);	
			
	// 查看故障单详情模态框
	var MalfunctionModal = ['$stateParams', '$state', '$uibModal', '$resource',
		function($stateParams, $state, $uibModal, $resource) {
	  
		if($stateParams.id == null || $stateParams.id == undefined ){
	    	return ;
	    }
		
		$uibModal.open({
	    	backdrop:"static",
			templateUrl: "/malfunctions/view",
			controller: 'MalfunctionModalCtrl',
			windowClass:'mapSize',
			resolve:{
				     malfunctionId : function() { 
				    	        return angular.copy($stateParams.id); 
				    	 }
		     }
		}).result.finally(function() {
			$state.go('malfunctions.list', {state: $stateParams.state, page:$stateParams.page, size:$stateParams.size},{reload:true});
		});
	}];
	app.MalfunctionModal = MalfunctionModal;
	
	// 选择调度部门控制器
	emms.controller('MalfunctionSelectAssignDeptCtrl',['$scope', '$state','commenModal', '$controller', 'toastr',
					function($scope, $state, commenModal, $controller, toastr) {
	
		function init(){
		
			$scope.depts = [
				{name: '运营一公司', number: '00066'},
				{name: '运营二公司', number: '00067'},
				{name: '运营三公司', number: '00068'},
				{name: '运营四公司', number: '00069'}
				];
			
			// 当前用户所属公司
			$scope.userDept = $scope.user.dept.num.slice(0, 5);
			
			// 当前选中的公司
			$scope.selected = {};
			var isOperteDept = $scope.depts.some(function(dept) {
				return dept.number === $scope.userDept;
			});
			if (isOperteDept) {
				$scope.selected = {number: $scope.userDept};
			}
			
		}
		
		$scope.confirm = function() {
			
			$scope.form.$setSubmitted();
			if (($scope.form.$invalid && ($scope.form.$dirty || $scope.form.$submitted) )) {
				return ;
			}
		   
			$scope.$close($scope.selected.number);
		}
		
		$scope.dismiss = function() {
			$scope.$dismiss();
		}
		
		init();
	}]);
	
	// 查看故障单详情ctrl
	emms.controller('MalfunctionModalCtrl',['$scope', 'Malfunction', 'malfunctionId', '$state','commenModal', '$controller',
					function($scope, Malfunction, malfunctionId, $state, commenModal, $controller) {
		
		$controller('CommenModalCtrl', {$scope: $scope, commenModal: commenModal});
	
		function init(){
				Malfunction.queryList({id:malfunctionId},function(response){
					$scope.object=response;
					$scope.imgs=$scope.object.images;
				})
		}
		
		$scope.openMap = function (location){
			location.create = false;
			location.markerShow = true;
			location.malfunctionDescript = true;
			location.locations = $scope.object.locations;
			commenModal.viewMapModel(location,'MarkerViewCtrl');
		}
			
		init();
	}]);
	
	// 图片查看详情
	emms.controller('MalfunctionImageViewCtrl',['$scope','$state','params','Malfunction',
		function ($scope,$state,params,Malfunction) {
		function  init(){
			Malfunction.queryImage({id:params.objectId},function(response){
				
				$scope.imgs=response;
				$scope.images=[];
				
				for(var i=0;i<$scope.imgs.length;i++){
					if($scope.imgs[i].id==params.img){
						$scope.active =i;
					}
					$scope.images.push({
						rawData:"/images/originalImage/"+$scope.imgs[i].id,
						index:i
					});
				}
			})
		}
		init();
		
   	    $scope.dismiss = function() {
			 $scope.$dismiss();
		};
		
	}]);
	
	// 执行故障任务
	emms.controller('ViewMalfunctionFlowCtrl',['$scope', '$state', '$cookies', 'param', 'MalfunctionTask', 'Level',
		'commenModal', '$uibModal', 'FileUploader', 'Device',"Malfunction","toastr","$timeout", '$controller', 'MalfunctionReason', 'MalfunctionDealResult', 'Dept',
		function($scope, $state, $cookies, param, MalfunctionTask, Level, commenModal,
				$uibModal, FileUploader, Device, Malfunction, toastr, $timeout, $controller, MalfunctionReason, MalfunctionDealResult, Dept) {
		
		// 文件上传
		$controller('uploaderParentCtrl', {$timeout: $timeout, $cookies: $cookies, $scope: $scope, FileUploader: FileUploader, url:'/images/pc', toastr: toastr});
		$controller('CommenModalCtrl', {$scope: $scope, commenModal: commenModal});
		
		function init(){

			$scope.levels = Level.query();
			$scope.malfunctionReasons = MalfunctionReason.querys();
			$scope.malfunctionDealResults = MalfunctionDealResult.querys();
			$scope.summary = null;
			
			MalfunctionTask.get({malfunctionId: param.id}, function(response){

				$scope.malfunctionInfo = response;
				$scope.object = $scope.malfunctionInfo.object;
				$scope.malfunction = $scope.malfunctionInfo.object;
				// $scope.originalDevice = angular.copy($scope.malfunction.device);
				$scope.repairImagesCopy = angular.copy($scope.malfunction.repairImages);
				
				$scope.hasSingleTask = $scope.malfunctionInfo.tasks && $scope.malfunctionInfo.tasks.length == 1;
				if ($scope.hasMultipleTask && $scope.hasSingleTask) {
					$scope.$close();
				} else {
					$scope.hasMultipleTask = ($scope.hasSingleTask || param.task) ? false : true;
					if (!$scope.hasMultipleTask) {
						$scope.task = $scope.hasSingleTask ? $scope.malfunctionInfo.tasks[0] : param.task;
					}
				}
				
				// 根据任务状态显示或隐藏对应的表单项
				if ($scope.task) {

					// 判断是否处于可补充阶段
					if ($scope.task.name == 'investigate' || $scope.task.name == 'declare' || $scope.task.name == 'audit' ) {
						$scope.replenishable = true;
						if ($scope.task.name == 'investigate') {
							$scope.inInvestigate = true;
							// 部门树操作
							// $controller('DeptCommonOperationCtrl', {$scope:
							// $scope, param: {type: 'one'}});
						}
						if ($scope.task.name == 'declare') {
							$scope.inDeclare = true;
						}
					}
					if ($scope.task.name == 'repair') {
						$scope.inRepair = true;
					}
					if ($scope.task.name == 'verify') {
						$scope.inVerify = true;
					}
				}
				
			});
			
			
		  	$scope.uploader.filters.push({
		        name: 'customFilter',
		        fn: function(item, options) {
		        	var uploadedImgCounts = $scope.repairImagesCopy ? $scope.repairImagesCopy.length : 0;
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
		
		$scope.selectedDept = function(deptId, depts){
			$scope.selectedDepts = depts;
		}
		
		// 选择位置
		$scope.openMap = function (location){
			location.create=false;
			location.markerShow=true;
			location.malfunctionDescript=true;
			location.locations = $scope.object.locations;
			commenModal.viewMapModel(location,'MarkerViewCtrl');
		}
		
		// 打开当前任务
		$scope.showCurrentTask = function(task) {
			
			commenModal.openModal(
					'/malfunctions/execute',
					'ViewMalfunctionFlowCtrl', 'lg', {id: param.id, task: task}).result.then(function(response) {
						// 完成子任务后任务刷新列表
						// $scope.$emit('ChildTaskComplete', {key: 'refresh', value: ''});
						$scope.ChildTaskComplete = true;
						param.task = null;
						init();
					});
			
		}
		
		// 更新故障单的描述
		$scope.updateDescription = function (){
			$scope.summary = $scope.object.summary;
		}
		
		// 保存故障单的描述
		$scope.saveDescription = function (malfunctionId,summary){
			$scope.summary = null;
			$scope.object.summary = summary;
		}
		// 取消修改故障描述
		$scope.dismissDescription = function (){
			$scope.object.summary = $scope.summary;
			$scope.summary = null;
		}
		
		// 选择检修设备
		$scope.selectDevices = function() {
			var modalInstance = commenModal.openModal(
					'/jobtickets/template/selectDevice',
					'SingleSelectDeviceCtrl', 'lg', {scope: "one"});
			modalInstance.result.then(function(response) {
						$scope.malfunction.device = response;	
						// 判断是否更换过设备
//						if ($scope.inRepair && $scope.originalDevice) {
//							if ($scope.originalDevice.id === response.id) {
//								$scope.devicehasChanged = false;
//							} else {
//								$scope.devicehasChanged = true;
//							}
//						}
					});
		}
		
		// 移除设备
		$scope.removeDevice = function() {
			$scope.malfunction.device = null;
		}
		
	   // 图片上传完成
       $scope.uploader.onCompleteAll = function() {
	       if($scope.imgErrorCount > 0) {
	    	   toastr.error("您有"+$scope.imgErrorCount+"张图片未能上传成功");
	       } else {
	    	   
	    	   if ($scope.successImgIds && $scope.successImgIds.length > 0) {
	    		   $scope.malfunction.addedImages = $scope.successImgIds;
	    	   }
	    	   
	    	   doComplete();
	    	   
	       }
		};
		
		// 删除修复照片
	    $scope.removeRepairImg = function(img){
	    	
	    	if (!$scope.malfunction.removeImages) {
	    		$scope.malfunction.removeImages = [];
	    	}
	    	
	    	$scope.repairImagesCopy.splice($scope.repairImagesCopy.indexOf(img),1);
			$scope.malfunction.removeImages.push(img);
			
	   }
			
		// 完成任务
		$scope.complete = function(taskId, taskName, result, role, state) {
			
			var workflowTaskComplete = {
					taskId: taskId,
					taskName: taskName,
					result: result,
					role: role,
					state: state,
					comment: $scope.malfunction.comment,
					candidateDeptNum: $scope.task.candidate.num,
					variables: [],
			};
			
			
			// 根据任务状态检查必要条件
			if (taskName == "repair") {
				
				if ($scope.malfunction.device == null) {
					toastr.warning("请选择故障设备");
					return;
				}
				if(!$scope.malfunction.reason){
					toastr.warning("请选择故障原因");
					return ;
				}
				if(!$scope.malfunction.dealResult){
					toastr.warning("请选择处置结果");
					return ;
				}
				
				workflowTaskComplete.state = "";
				workflowTaskComplete.variables.push({name: 'repairer', value: $scope.malfunction.device.ownerNum});
				workflowTaskComplete.variables.push({name: 'verifier', value: $scope.malfunction.device.clientNum});
				
				// 上传修复图片
				$scope.workflowTaskComplete = workflowTaskComplete;
				
				if ($scope.uploader.queue.length > 0) {
					
					$scope.uploader.uploadAll();
				
				} else {
				
					doComplete();
				
				}
				
			} else if ((taskName == 'audit' && result == 'cancel') || (taskName == "investigate" && result === 'cancel')) {
				
				if (!$scope.malfunction.comment) {
					$scope.isEliminated = true;
					return ;
				}
				
				$scope.workflowTaskComplete = workflowTaskComplete;
				commenModal.onlyPrompt('您确定消单吗？').result.then(function(response) {
					// 完成任务
					doComplete();
				});
			
				
			} else if (taskName == "investigate" && result === 'forward') {
				
				// 选择转发部门
				commenModal.selectAssignDept().result.then(function(number) {
					workflowTaskComplete.variables.push({name: 'auditors', value: number});
					$scope.workflowTaskComplete = workflowTaskComplete;
					doComplete();
				});
				
			} else {
				
				if(taskName == "investigate" && result == 'assign'){
					if ($scope.selectedDepts == undefined || $scope.selectedDepts.length == 0) {
						 toastr.warning("请选择分派部门");
						 return;
					} else {
						var deptNums = '';
						angular.forEach($scope.selectedDepts, function(dept, index) {
							deptNums += dept.num + ','
						});
						workflowTaskComplete.variables.push({name: 'investigators', value: deptNums});
					}
				 }
				
				if (taskName == "declare" && result == 'declare'){
					if ($scope.malfunction.device == null) {
						toastr.warning("请选择故障设备");
						return;
					} else {
						
						workflowTaskComplete.variables.push({name: 'auditors', value: $scope.malfunction.device.ownerNum});
						workflowTaskComplete.variables.push({name: 'repairer', value: $scope.malfunction.device.ownerNum});
						workflowTaskComplete.variables.push({name: 'verifier', value: $scope.malfunction.device.clientNum});
						
					}
				}
				
				if (taskName == 'audit' && result == 'agree'){
					workflowTaskComplete.variables.push({name: 'priority', value: $scope.malfunction.level.id});
				}
				
				// 完成任务
				$scope.workflowTaskComplete = workflowTaskComplete;
				doComplete();
				
			}

		}
		
		function doComplete() {
			
			// 任务完成变量
			var taskCompleteTicket = {
					workflowTask: $scope.malfunctionInfo,
					taskComplete: $scope.workflowTaskComplete,
			};
			
			MalfunctionTask.complete(
					taskCompleteTicket,
					function(response) {
						prompt(response);
					}, function(response) {
						prompt(response);
					});
		}
		
		function prompt(response) {
			
			if (response.errorMsg || (response.data && response.data.errorMsg)) {
				var errorMsg;
				if (response.status === 409) {
					if (response.errorMsg) {
						 errorMsg = response.errorMsg;
					} else {
						if (response.data) {
							errorMsg = response.data.errorMsg;
						} else {
							errorMsg = '请稍后重试';
						}
					}
					toastr.error(errorMsg);
				} else {
					toastr.error('请稍后重试');
				}
			
			} else {
				toastr.success("操作成功");
				$scope.$close();
			}
			
		}
		
		$scope.dismiss = function () {
			 $scope.$dismiss({childTaskComplete: $scope.ChildTaskComplete});
		};
		
		init();
	}]);
	
	return app;
	
}(emmsModule || {}));

