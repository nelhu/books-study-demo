/**
 * description - resolve malfunctions mobile related operation
 * create - Nelson.Xuezi.Hu
 * date - 2017-9-15
 */
var emmsMobileModule = (function(mobileApp) {
	var emmsMobile = mobileApp.emmsMobile;
	
	// 故障任务列表
	emmsMobile.controller('MalfunctionListMobileCtrl', ['$scope', '$state', 'Malfunction', '$uibModal', 'SweetAlert', 'SharedState', '$document', '$stateParams',
		function($scope, $state, Malfunction, $uibModal, SweetAlert, SharedState, $document, $stateParams) {
		
		var destination = angular.copy($stateParams.destination);
		
		// 初始化页面
		function init() {
			
			if (!destination || destination == 'toInprocess') {
				$scope.currentTab = 'inProcessTab';
				$scope.inProcessFlag = true;
				$scope.unCommitFlag = false;
			}
			if (destination == 'toUncommit') {
				$scope.currentTab = 'unCommitTab';
				$scope.inProcessFlag = false;
				$scope.unCommitFlag = true;
			}
			
		}
		
		// 监视消息, 刷新内容
		$scope.refresh = function() {
			$scope.getUncommitMalfunction();
			$scope.getInProcessMalfunction();
		}
		
		// 菜单选项卡切换
		$scope.tabCtrlToggle = function(key) {
			
			var inProcessTab = $document.find('#inProcessTab');
			var unCommitTab = $document.find('#unCommitTab');
			
			if (key == 'inProcessTab') {
				
				$scope.inProcessFlag = true;
				$scope.unCommitFlag = false;
				unCommitTab.removeClass('mobile-tab-ctrl-sty');
				inProcessTab.addClass('mobile-tab-ctrl-sty');
				
			} else {
				
				$scope.inProcessFlag = false;
				$scope.unCommitFlag = true;
				inProcessTab.removeClass('mobile-tab-ctrl-sty');
				unCommitTab.addClass('mobile-tab-ctrl-sty');
				
			}
			
		}
		
		$scope.quickadd = function() {
			$state.go('malfunctions.quickadd');
		}
		
		$scope.add = function() {
			$state.go('malfunctions.edit');
		}
		
		init();
	}]);
	
	// 故障个人任务
	emmsMobile.controller('MalfunctionSelfTaskCtrl', ['$scope', '$controller', 'MalfunctionTask', function($scope, $controller, MalfunctionTask) {
		
		$controller('BusinessSelfTaskListCtrl', {$scope: $scope, TaskResource: MalfunctionTask});
		
	}]);
	
	
	// 故障待发起列表
	emmsMobile.controller('MalfunctionDraftListCtrl', ['$scope', '$state', '$controller', 'MalfunctionDraft',
		function($scope, $state, $controller, MalfunctionDraft) {
		
		$controller('BusinessDraftListCtrl', {$scope: $scope, DraftResource: MalfunctionDraft});
	}]);
	
	
	// 选择调度部门控制器
	emmsMobile.controller('MalfunctionSelectAssignDeptMobileCtrl',['$scope',function($scope) {
	
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
		
		$scope.selectedDept = function(dept) {
			$scope.selected = dept;
		}
		
		init();
	}]);
	
	// 故障快速保修
	emmsMobile.controller('MalfunctionQuickAddMobileCtrl', ['$scope', '$state', '$stateParams', 'SweetAlert', 'blockUI', 'Malfunction', 'MalfunctionDraft',
		'mobileAsyncService', 'SharedState', 'Level', '$rootScope', 'Image', 'MalfunctionService', '$controller',
		function($scope, $state, $stateParams, SweetAlert, blockUI, Malfunction, MalfunctionDraft,
				mobileAsyncService, SharedState, Level, $rootScope, Image, MalfunctionService, $controller) {
		
		$controller('MalfunctionSelectAssignDeptMobileCtrl', {$scope: $scope});
		
		function init() {
			$scope.malfunction = {};
			$scope.malfunction.uploadedImgs = ($scope.malfunction && $scope.malfunction.uploadedImgs) ? $scope.malfunction.uploadedImgs : [];
			$scope.levels = Level.query();
			
			$scope.malfunction.addedImages = [];
		}
		
		// 选择照片
		$scope.selectImg = function() {

			try {
				
				if (typeof(JsInterface) == 'undefined') {
					throw 'undefined';
				}
				var clearAppImgCache = $scope.imgs ? false : true;
				JsInterface.startCamera(clearAppImgCache);
				
			} catch(error) {
				
				if (angular.equals(error, 'undefined')) {
					showMessage('请在app内使用');
				}
			}
			 
		};
		
		// 获取选择照片的缩略图
		$scope.convertImg = function(imageStr) {

			$scope.$apply(function() {
				
				var imgs = [];
				angular.forEach(imageStr.thumbImages, function(imgStr, index){
					var img = {};
					img.identifier = imgStr.id;
					img.base64Str = 'data:image/jpg;base64,' + imgStr.data;
					imgs.push(img);
				});
				$scope.imgs = imgs;
			});
			
		}
		
		// 移除刚选择的图片
		$scope.removeImg = function (identifier) {
			
			JsInterface.deleteOriginalImage(identifier);
			
			angular.forEach($scope.imgs, function(img, index) {
				if (identifier == img.identifier) {
					$scope.imgs.splice(index, 1);
				}
			});
		}
		
		// 预览图片
		$scope.previewImg = function(identifier, index) {
			$scope.activeImgs = [];
			
			// 已经上传的图片
			if ($scope.appendUploadedImgs) {
				$scope.appendUploadedImgs();
			}
			// 新添加的图片
			angular.forEach($scope.imgs, function (img) {
				var tempImg = {};
				var originalImgStr = JsInterface.getOriginalImage(img.identifier);
				var originalImg = JSON.parse(originalImgStr);
				tempImg.identifier = img.identifier;
				tempImg.base64Str = 'data:image/jpg;base64,' + originalImg.data;
				$scope.activeImgs.push(tempImg);
			});
			// 确定当前查看的图片
//			angular.forEach($scope.activeImgs, function (currentImg, index) {
//				
//				if (currentImg.identifier == identifier) {
//					$scope.activeImg = currentImg;
//					$scope.activeIndex = index;
//				}
//				
//			});
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
		
		// 开启语音识别 
		$scope.startRecognize = function() {
			showMessage('敬请期待');
			return ;
			try {
				
				if (typeof(JsInterface) == 'undefined') {
					throw 'undefined';
				}
				JsInterface.startRecognize();
				
			} catch(error) {
				
				if (angular.equals(error, 'undefined')) {
					showMessage('请在app内使用');
				}
			}
			 
		};
		
		// 获取识别内容
		$scope.getRecognizedMsg = function(msg) {
			if(msg) {
				$scope.malfunction.description = msg;
				$scope.$apply();
			}
		}
		
		// 提报故障
		$scope.saveAndStart = function() {
			
			SharedState.turnOff('SelectAssignDeptModal');
			
			if (!$scope.malfunction.summary) {
				showMessage('请填写描述');
				return false;
			}
			if (!$scope.selectedDept) {
				showMessage('请选择调度部门');
				return false;
			}
			// 快报修故障默认项
			$scope.malfunction.name = '快速报修';
			$scope.malfunction.level = $scope.levels[1];
			$scope.malfunction.location = $rootScope.getCurrentLocation();
			if ($scope.imgs && $scope.imgs.length >= 1) {
				if ($scope.checkImg() && typeof(JsInterface) != 'undefined') {
					angular.forEach($scope.imgs, function(img) {
						if ($scope.malfunction.uploadedImgs.indexOf(img.identifier) == -1) {
							var tempImg = MalfunctionService.convertImg(img.identifier);
							if (tempImg) {
								Image.save(tempImg, function(response) {
									$scope.malfunction.addedImages.push(response.id);
									$scope.malfunction.uploadedImgs.push(img.identifier);
									if ($scope.malfunction.addedImages.length == $scope.imgs.length) {
										doSaveAndStart();
									}
									
								}, function() {
									showMessage('图片上传未成功， 请稍后重试');
								});
								
							}
						}
					});
					
					
				};
				
			} else {
				doSaveAndStart();
				
			}
			
			
		};
		
		// 新增编辑并发起
		function doSaveAndStart() {
			var taskStartTicket = {};
			taskStartTicket.businessTicket = $scope.malfunction;
			taskStartTicket.startTicket = {
					role: 'ROLE_AUDIT_MALFUNCTION',
					variables: [
						{name: 'auditors', value: $scope.selected.number},
						{name: 'repairer', value: ''},
						{name: 'verifier', value: ''}
					],
			};
			
			MalfunctionDraft.saveAndStart(taskStartTicket, 
			function(response) {
				prompt(response);
			}, function(response) {
				prompt(response);
			});
			
		};
		
		function prompt(response) {
			
			if (response.errorMsg || (response.data && response.data.errorMsg)) {
			
				if (response.status == '451') {
					SweetAlert.warn({
						title: ' ',
						text: '没有用户处理此任务',
						type: 'warning'
					});
				} else {
					showMessage('请稍后重试');
				}
				
			} else {
				
				SweetAlert.swal({
					title: ' ',
					text: "成功发起",
					type: 'success'
				});
				$state.go('malfunctions.list', {destination: 'toUncommit'});
				
			}
			
		}
		
		$scope.checkImg = function() {
			if ($scope.imgs && $scope.imgs.length > 9) {
				SweetAlert.swal({
					title: '单次上传图片限制9张!',
					confirmButtonColor: 'green',
					confirmButtonText: "确认",
					type: 'warning'
				});
				return false;
			}
			return true;
		}
	
		init();
	}]);
	
	// 添加故障
	emmsMobile.controller('MalfunctionEditMobileCtrl', ['$scope', '$controller', '$state', '$rootScope', '$stateParams', 'SharedState', 'Malfunction', 'MalfunctionDraft',
		'MalfunctionReason', 'Level', 'MalfunctionService', 'SweetAlert', 'CommonService', 'Image',
		function($scope, $controller, $state, $rootScope, $stateParams, SharedState, Malfunction, MalfunctionDraft, MalfunctionReason, Level, MalfunctionService, 
				SweetAlert, CommonService, Image) {
		
		$controller('CommonUnPageScrollCtrl', {$scope: $scope});
		$controller('MalfunctionSelectAssignDeptMobileCtrl', {$scope: $scope});
		
		function init() {
			
			$scope.malfunction = $stateParams.malfunction == null ? {} : $stateParams.malfunction;
			$scope.malfunctionId = $scope.malfunction.id ? $scope.malfunction.id : ($stateParams.param ? $stateParams.param.id : null);
			
			// $scope.selected = false;
			
			$scope.deviceIcon = "fa fa-gavel";
			$scope.reasonIcon = "fa fa-crosshairs";
			$scope.levels = Level.query();
			$scope.action = 'add'; // 默认操作为 添加
			$scope.selectedImgCounts = 0;
			
			if (!$scope.malfunction.id && $scope.malfunctionId) {
				$scope.action = 'update'; // 当前操作为提交
				MalfunctionDraft.get({id: $scope.malfunctionId}, function(response) {
					$scope.malfunction = response;
					$scope.device = response.device;
					$scope.selectedImgCounts = (response.images) ? response.images.length : 0;
					$scope.imgCountInfo = "您选择了" + $scope.selectedImgCounts + "张照片";
				});
			};
			
			// 获取当前位置
			if ($scope.action == 'add' && angular.isUndefined($scope.malfunction.location) ) {
				var location = $rootScope.getCurrentLocation();
				$scope.malfunction.location = angular.isUndefined(location) ? $rootScope.centerPoint : location;
			}
			
			$scope.malfunction.uploadedImgs = ($scope.malfunction && $scope.malfunction.uploadedImgs) ? $scope.malfunction.uploadedImgs : [];
		};
		
		$scope.$on('mobile-angular-ui.state.changed.malfunctionLevel', function(e, newVal, oldVal) {
		    $scope.inLevelFlag = SharedState.isActive('malfunctionLevel');
		});
		
		$scope.setLevel = function(id) {
			$scope.malfunction.level = $scope.levels[id-1];
			SharedState.turnOff('malfunctionLevel');
		};
		
		$scope.selectDevice = function() {
			$state.go('devices.select', {malfunction: $scope.malfunction});
		};
		
		// 选择位置
		$scope.mapLocation = function() {
			
			if ($scope.action == 'add') {
				$scope.locationState = {action: true, markerContent: "选择位置"};
				$scope.malfunction.location =  {id : null};
			}else{
				$scope.locationState = {action: false, markerContent: "选择位置"};
			}
			
			$state.go('map.LocationSelected', {param:{source: $scope.malfunction,state: $scope.locationState, type: "malfunction"}});
		}
		
		// 选择或预览图片
		$scope.selectOrPreviewImg = function() {
			$state.go('malfunctions.images', {malfunction: $scope.malfunction, action: 'edit'});
		};
		
	   // 保存故障
		$scope.save = function() {
			
			if (check($scope.malfunction)) {

				$scope.operation = 'save';
				// 上传图片
				if ($scope.malfunction.selectedImgsId && $scope.malfunction.selectedImgsId.length > 0) {
					uploadImageAndContinue();
				} else {
					
					doSave();
					
				}
				
			};
		};
	   
		$scope.checkAssignDeptBeforeStart = function() {
			
			if ($scope.malfunction.device) {
				
				$scope.saveAndStart();
				
			} else {
				
				SharedState.turnOn('SelectAssignDeptModal');
				
			}
			
		}

		// 发起
		$scope.saveAndStart = function() {
			
			SharedState.turnOff('SelectAssignDeptModal');
			
			if (check($scope.malfunction)) {
				
				$scope.operation = 'saveAndStart';
				// 上传图片
				if ($scope.malfunction.selectedImgsId && $scope.malfunction.selectedImgsId.length > 0) {
					
					uploadImageAndContinue();
					
				} else {
					
					doSaveAndStart();
					
				}
				
			}
	
		}
			
		
		// 上传图片
		function uploadImageAndContinue() {
			
			if (!$scope.malfunction.addedImages) {
				$scope.malfunction.addedImages = [];
			}
			
			if (typeof(JsInterface) != 'undefined') {
				if ($scope.malfunction.uploadedImgs.length == $scope.malfunction.selectedImgsId.length) {
					doSaveOrStart();
				} else {
					angular.forEach($scope.malfunction.selectedImgsId, function(imgId) {
						if ($scope.malfunction.uploadedImgs.indexOf(imgId) == -1) {
							var tempImg = MalfunctionService.convertImg(imgId);
							if (tempImg) {
								Image.save(tempImg, function(response) {
									$scope.malfunction.addedImages.push(response.id);
									$scope.malfunction.uploadedImgs.push(imgId);
									if ($scope.malfunction.addedImages.length == $scope.malfunction.selectedImgsId.length) {
										doSaveOrStart();
									}
									
								}, function() {
									showMessage('图片上传未成功， 请稍后重试');
								});
								
							}
						}
					});
				}
				
			}
			
		
		}
		
		function doSaveOrStart(){
			if ($scope.operation == 'save') {
				doSave();
			} else {
	    	    doSaveAndStart();
			}
		}
		
		// 新增编辑
		function doSave() {
			Malfunction.save($scope.malfunction, function(response) {
				prompt(response);
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
				
			} else {

				startTicket.variables.push({name: 'auditors', value: $scope.selected.number});
				startTicket.variables.push({name: 'repairer', value: ''});
				startTicket.variables.push({name: 'verifier', value: ''});
				taskStartTicket.startTicket = startTicket;
				
				finalSaveAndStart(taskStartTicket);
			
				
			}
			
		};
		
		// 发起
		function finalSaveAndStart(taskStartTicket) {
			
			MalfunctionDraft.saveAndStart(taskStartTicket, 
					function(response) {
						prompt(response);
					}, function(response) {
						prompt(response);
					});
					
		}
		
		
		function prompt(response) {
			
			if (response.errorMsg || (response.data && response.data.errorMsg)) {
			
				if (response.status == '451') {
					SweetAlert.warn({
						title: ' ',
						text: '没有用户处理此任务',
						type: 'warning'
					});
				} else {
					showMessage('请稍后重试');
				}
				
			} else {
				
				var msg;
				if ($scope.operation == 'saveAndStart') {
					msg = "成功发起";
				} else {
					if ($scope.malfunctionId) {
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
				$state.go('malfunctions.list', {destination: 'toUncommit'});
				
			}
			
		}
		
		
	   // 返回
	   $scope.backToList = function() {
		   
		   SweetAlert.swal({
				title: '确认返回?',
				type: 'warning',
				showCancelButton: true,
				cancelButtonText: '取消',
				confirmButtonColor: 'green',
				confirmButtonText: '确认'
			}, function(isConfirm) {
				if (isConfirm) {
					$state.go('malfunctions.list', {destination: 'toUncommit'});
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
					Malfunction.delete({id: $scope.malfunctionId}, function(response) {
						$state.go('malfunctions.list', {destination: 'toUncommit'});
					});
				} else {
					return;
				}
			})
			
	   }
		
	   // 检查用户输入
	   function check(malfunction) {
		   
		   var flag = true;
		   
		   if (!checkFieldValid(malfunction.name)) {
			   showMessage('请输入故障名称');
			   flag = false;
		   }
		   if (flag && !checkFieldValid(malfunction.level)) {
			   showMessage('请选择故障级别');
			   flag = false;
		   }
		   if(!malfunction.location.latitude || !malfunction.location.latitude){
				showMessage('请选择位置');
				flag = false;
		   }
		   if (flag && !checkFieldValid(malfunction.summary)) {
			   showMessage('请输入故障描述');
			   flag = false;
		   }
		   return flag;
	   };
	   
	   // 检查字段合法
	   function checkFieldValid(field) {
		   if (angular.isUndefined(field) || null == field) {
			   return false;
		   }
		   return true;
	   }
		
		init();
	}]);
	
	// 执行故障任务
	emmsMobile.controller('MalfunctionExecuteMobileCtrl', ['$scope', '$controller', '$state', '$stateParams', 'Malfunction', 'MalfunctionTask', 'MalfunctionService',
		'SweetAlert', 'SharedState', '$document', 'CommonService', 'MalfunctionReason', 'Image', 'MalfunctionDealResult',
		function($scope, $controller, $state, $stateParams, Malfunction, MalfunctionTask, MalfunctionService,
				SweetAlert, SharedState, $document, CommonService, MalfunctionReason, Image, MalfunctionDealResult) {
		
		$controller('CommonUnPageScrollCtrl', {$scope: $scope});
		
		$scope.malfunction = $stateParams.malfunction;
		$scope.task = $stateParams.task ? $stateParams.task : (($scope.malfunction && $scope.malfunction.currentTask) ? $scope.malfunction.currentTask : null);
		$scope.malfunctionId = ($scope.malfunction && $scope.malfunction.id) ? $scope.malfunction.id : $stateParams.param.id;
		
		// 判断是否更换过设备
//		if (($scope.task && $scope.task.name === 'repair') && ($scope.malfunction && $scope.malfunction.originalDevice)) {
//			if ($scope.malfunction.originalDevice.id === $scope.malfunction.device.id) {
//				$scope.devicehasChanged = false;
//			} else {
//				$scope.devicehasChanged = true;
//			}
//		}
		
		$scope.fromMap = $stateParams.fromMap == null ? false : true;

		MalfunctionReason.querys(function(response) {
			
			$scope.malfunctionReasons = response.map(function(reason) {
				reason.name = reason.description;
				return reason;
			});
			
			
		});
		
		MalfunctionDealResult.querys(function(response) {
			
			$scope.malfunctionDealResults = response.map(function(reason) {
				reason.name = reason.description;
				return reason;
			});
			
		});
		
		
		function init() {
			
			if ($scope.malfunctionId) {
				
				MalfunctionTask.get({malfunctionId: $scope.malfunctionId}, function(response){
					$scope.malfunctionInfo = response;
					$scope.malfunction = $scope.malfunction ? $scope.malfunction : $scope.malfunctionInfo.object;
					$scope.malfunction.uploadedImgs = ($scope.malfunction && $scope.malfunction.uploadedImgs) ? $scope.malfunction.uploadedImgs : [];
					$scope.malfunctionInfo.object = $scope.malfunction;
//					if (!$scope.malfunction.originalDevice) {
//						$scope.malfunction.originalDevice = angular.copy($scope.malfunction.device);
//					}
					if (($scope.malfunctionInfo.tasks && $scope.malfunctionInfo.tasks.length == 1) || $scope.task) {
						$scope.task = $scope.task || $scope.malfunctionInfo.tasks[0];
					}
				});
				
			} 
			
		}
		
		// 打开当前任务
		$scope.showCurrentTask = function(task) {
			$scope.task = task;
		}
		
		// 查看抢修智囊团
		$scope.showEmergencyGroup = function() {
			$state.go('malfunctions.emergencyGroup', {malfunction: $scope.malfunction});
		}
		
		// 监视ui-state
		$scope.$on('mobile-angular-ui.state.changed.nameFlag', function(e, newVal, oldVal) {
		    $scope.nameFlagIcon = SharedState.isActive('nameFlag');
		});
		$scope.$on('mobile-angular-ui.state.changed.staffFlag', function(e, newVal, oldVal) {
		    $scope.staffFlagIcon = SharedState.isActive('staffFlag');
		});
		$scope.$on('mobile-angular-ui.state.changed.descriptionFlag', function(e, newVal, oldVal) {
			$scope.descriptionFlagIcon = SharedState.isActive('descriptionFlag');
		});
		
		$scope.$on('mobile-angular-ui.state.changed.deviceFlag', function(e, newVal, oldVal) {
		    $scope.deviceFlagIcon = SharedState.isActive('deviceFlag');
		});
		
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
				
				if(!$scope.malfunction.reason){
					showMessage('请选择故障原因');
					return ;
				}
				
				if(!$scope.malfunction.dealResult){
					showMessage('请选择处置结果');
					return ;
				}
				

				workflowTaskComplete.state = "";
				workflowTaskComplete.variables.push({name: 'repairer', value: $scope.malfunction.device.ownerNum});
				workflowTaskComplete.variables.push({name: 'verifier', value: $scope.malfunction.device.clientNum});
			
				$scope.workflowTaskComplete = workflowTaskComplete;
				
				// 上传修复图片
				if ($scope.malfunction.selectedImgsId && $scope.malfunction.selectedImgsId.length > 0) {
					uploadImageAndContinue();
				}  else {
				
					doComplete();
				
				}
				
			} else {
				
				if (taskName == "declare" && result == 'declare'){
					if ($scope.malfunction.device == null) {
						showMessage('请选择故障设备');
						return;
					} else {
						
						workflowTaskComplete.variables.push({name: 'auditors', value: $scope.malfunction.device.ownerNum});
						workflowTaskComplete.variables.push({name: 'repairer', value: $scope.malfunction.device.ownerNum});
						workflowTaskComplete.variables.push({name: 'verifier', value: $scope.malfunction.device.clientNum});
						
					}
				}
				
				// 完成任务
				$scope.workflowTaskComplete = workflowTaskComplete;
				doComplete();
				
			}

		}
		
		// 上传图片
		function uploadImageAndContinue() {
			
			if (!$scope.malfunction.addedImages) {
				$scope.malfunction.addedImages = [];
			}
			
			if (typeof(JsInterface) != 'undefined') {
				if ($scope.malfunction.uploadedImgs.length == $scope.malfunction.selectedImgsId.length) {
					doComplete();
				} else {
					angular.forEach($scope.malfunction.selectedImgsId, function(imgId) {
						if ($scope.malfunction.uploadedImgs.indexOf(imgId) == -1) {
							var tempImg = MalfunctionService.convertImg(imgId);
							if (tempImg) {
								Image.save(tempImg, function(response) {
									$scope.malfunction.addedImages.push(response.id);
									$scope.malfunction.uploadedImgs.push(imgId);
									
									if ($scope.malfunction.addedImages.length == $scope.malfunction.selectedImgsId.length) {
										doComplete();
									}
									
								}, function() {
									showMessage('图片上传未成功， 请稍后重试');
								});
								
							}
						}
					});
				}
				
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
				showMessage('请稍后重试');
			} else {
				SweetAlert.swal({
					title: ' ',
					text: '操作成功',
					type: 'success'
				});
				$state.go('malfunctions.list');
			}
			
		}
		
		// 选择设备
		$scope.selectDevice = function() {
			$scope.malfunction.currentTask = $scope.task;
			$state.go('devices.procesSelect', {malfunction: $scope.malfunction});
		}
		
		// 查看故障设备
		$scope.viewDeviceDetail = function() {
			$scope.malfunction.objectId = $scope.malfunctionId;
			$state.go('devices.detail', {malfunction: $scope.malfunction});
		}
		
		// 查看故障图片
		$scope.previewMalfunctionImg = function(action) {
			//
			$state.go('malfunctions.images', {malfunction: $scope.malfunction, action: action, objectId: $scope.malfunctionId});
		};
		
		// 打电话
		$scope.call = function(phone) {
			return CommonService.call(phone);
		}
		
		// 导航至故障位置
		$scope.toNavigate = function(location) {
				
				$state.go('map.locationShow', {location: location, object: $scope.malfunction, isShowNear : true, type : 'malfunction'});
		}
		
		
	   init();
	}]);
	
	// 故障图片预览
	emmsMobile.controller('MalfunctionImageViewMobileCtrl', ['$scope', '$controller', '$state', '$stateParams', 'SharedState', '$document', 'blockUI', 'mobileAsyncService', 
		'$timeout', 'CommonService', 'SweetAlert',
		function($scope, $controller, $state, $stateParams, SharedState, $document, blockUI, mobileAsyncService, $timeout, CommonService, SweetAlert) {
		
		$controller('CommonUnPageScrollCtrl', {$scope: $scope});
		
		$scope.malfunction = $stateParams.malfunction == null ? {} : angular.copy($stateParams.malfunction);
		$scope.action = $stateParams.action;
		$scope.showMessage = true;
		
		function init() {
			
			$scope.removeImages = [];
			$scope.imgs = [];
			
			$scope.imagesCopy = angular.copy($scope.malfunction.images);
			$scope.repairImagesCopy = angular.copy($scope.malfunction.repairImages);

			if ($scope.action != 'overview' && $scope.malfunction.tempImgs && $scope.malfunction.tempImgs.length > 0) {
				angular.forEach($scope.malfunction.tempImgs, function(img) {
					$scope.imgs.push(img);
				});
			}
			
		}
		
		/////////////////////
		
		// 移除刚选择的图片
		$scope.removeImg = function (identifier) {
			
			JsInterface.deleteOriginalImage(identifier);
			
			angular.forEach($scope.imgs, function(img, index) {
				if (identifier == img.identifier) {
					$scope.imgs.splice(index, 1);
				}
			});
		}
		
		// 删除修复照片
	    $scope.removeRepairImg = function(img){
	    	
	    	angular.forEach($scope.malfunction.repairImages, function(img, index) {
				if (imgId == img) {
					$scope.malfunction.repairImages.splice(index, 1);
				}
			});
	    	
	    	$scope.removeImages.push(imgId);
			
	   }
		
		
		// 移除已经上传的图片
		$scope.removeUploadedImg = function(imgId) {

			angular.forEach($scope.malfunction.images, function(img, index) {
				if (imgId == img) {
					$scope.malfunction.images.splice(index, 1);
				}
			});
			
			$scope.removeImages.push(imgId);
			
		}
		
		// 直接返回
		$scope.back = function() {
			
			// 故障修复任务和其他任务时
			if ($scope.action === 'repairView' || $scope.action === 'overview') {
				if ($scope.repairImagesCopy) {
					$scope.malfunction.repairImages = $scope.repairImagesCopy;
				}
				$state.go('malfunctions.execute', {malfunction: $scope.malfunction});
			} else { // 新增编辑故障单时
				if ($scope.imagesCopy) {
					$scope.malfunction.images = $scope.imagesCopy;
				}
				$state.go('malfunctions.edit', {malfunction: $scope.malfunction});
			}

		}
		
		// 确认返回
		$scope.backToPrev = function() {
			
			var reservedImages;
			$scope.malfunction.selectedImgsId = getSelectedImgsId();
			// 选择图片小于9张
			
			if ($scope.action === 'repairView') {
				reservedImages = $scope.malfunction.repairImages ? $scope.malfunction.repairImages.length : 0;
			} else {
				reservedImages = $scope.malfunction.images ? $scope.malfunction.images.length : 0;
			}
			
			if ((reservedImages + $scope.malfunction.selectedImgsId.length) > 9) {
				
				SweetAlert.swal({
					title: '单次上传图片限制9张!',
					confirmButtonColor: 'green',
					confirmButtonText: "确认",
					type: 'warning'
				});
				return ;
			}
			
			// 所有图片数量
			$scope.malfunction.selectedImgNum = (!$scope.malfunction.repairImages ? 0 : $scope.malfunction.repairImages.length)
											+ (!$scope.malfunction.images ? 0 : $scope.malfunction.images.length)
											+ $scope.imgs.length;
			
			// 存储刚刚选择的图片
			$scope.malfunction.tempImgs = $scope.imgs;
			
			// 已删除的图片
			$scope.malfunction.removeImages = $scope.removeImages;
			
			if ($scope.action === 'repairView') {
				$state.go('malfunctions.execute', {malfunction: $scope.malfunction});
			} else {
				$state.go('malfunctions.edit', {malfunction: $scope.malfunction});
			}
			
		}
		
		
		////////////////
		
		
		// 选择照片
		$scope.selectImg = function() {

			try {
				
				if (typeof(JsInterface) == 'undefined') {
					throw 'undefined';
				}
				
				var clearAppImgCache = (angular.isUndefined($scope.imgs) || $scope.imgs.length <= 0) ? true : false;
				JsInterface.startCamera(clearAppImgCache);
				
			} catch(error) {
				
				if (angular.equals(error, 'undefined')) {
					showMessage('请在app内使用');
				}
			}
			 
		};
		
		// 获取选择照片的缩略图
		$scope.convertImg = function(imageStr) {
			var imgs = [];
			angular.forEach(imageStr.thumbImages, function(imgStr){
				var img = {};
				img.identifier = imgStr.id;
				img.base64Str = 'data:image/jpg;base64,' + imgStr.data;
				imgs.push(img);
			});
			$scope.imgs = imgs;
			$scope.$apply();
		}
		
		// 用户选择的图片id
		function getSelectedImgsId() {
			
			var selectedImgsId = [];
			
			if ($scope.imgs && $scope.imgs.length > 0) {
				selectedImgsId = $scope.imgs.map(function(item) {
					return item.identifier;
				});
			}
			
			return selectedImgsId;
			
		}
		
		// 预览图片
		$scope.previewImg = function(action, type, imgId) {
			
			$scope.activeImgs = [];
			var prepareImagePromise = mobileAsyncService.getPromise(true);
			
			prepareImagePromise.then(function() {
				// 生成当前查看的图片数组activeImgs
				
				blockUI.start();
				
				// 已经上传的故障图片
				if (angular.isDefined($scope.malfunction.images) && $scope.malfunction.images.length > 0) {
					
					if ((action == 'edit' && type == 'malfunctionImg')
							|| (action == 'declareview' && type == 'malfunctionImg')
							|| (action == 'repairView' && type == 'malfunctionImg')
							|| (action == 'overview' && type == 'malfunctionImg')) {
						
						angular.forEach($scope.malfunction.images, function (imgId) {
							$scope.activeImgs.push(imgId);
						});
						
					}
					
				}
				
				// 已经上传的故障修复图片
				if (angular.isDefined($scope.malfunction.repairImages) && $scope.malfunction.repairImages.length > 0) {
					
					if ((action == 'repairView' || action == 'overview') && type == 'malfunctionRepairImg') {
						
						angular.forEach($scope.malfunction.repairImages, function (imgId) {
							$scope.activeImgs.push(imgId);
						});
						
					}
					
				}
				
				// 新添加的图片
				if ((action == 'edit' && type == 'malfunctionImg') || (action == 'repairView' && type == 'malfunctionRepairImg')) {
					
					var tempImgs = [];
					angular.forEach($scope.imgs, function (img) {
						var tempImg = {};
						var originalImgStr = JsInterface.getOriginalImage(img.identifier);
						var originalImg = JSON.parse(originalImgStr);
						tempImg.identifier = img.identifier;
						tempImg.base64Str = 'data:image/jpg;base64,' + originalImg.data;
						$scope.activeImgs.push(tempImg);
					});
					
				}
				
				
			})
			.then(function(isPrepared) {
				
				// 确定当前查看的图片
				angular.forEach($scope.activeImgs, function (currentImg, index) {
					
					if (angular.isUndefined(currentImg.base64Str) || currentImg.base64Str == null) {
						if (currentImg == imgId) {
							$scope.activeImg = currentImg;
							$scope.activeIndex = index;
						}
					} else {
						if (currentImg.identifier == imgId) {
							$scope.activeImg = currentImg;
							$scope.activeIndex = index;
						}
					}
					
				});
				blockUI.stop();
				SharedState.turnOn('AllMalfunctionImgView');
				
			});
			
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
		
		// 关闭大图预览
		$scope.closeImagePreview = function() {
			SharedState.turnOff('AllMalfunctionImgView');
			$scope.$apply();
		}
		
		// 滑动查看图片
		$scope.swipePreview = function(action, fromJquery) {
			
	        if ($scope.activeIndex >= 0 && $scope.activeIndex < $scope.activeImgs.length) {
	        	if (action == 'next') {
	        		if ($scope.activeIndex != $scope.activeImgs.length - 1) {
	        			$scope.activeIndex += 1;
	        		}
				} else {
					if ($scope.activeIndex != 0) {
						$scope.activeIndex -= 1;
					}
				}
	        }
			
			
			// 索引合法
			if ($scope.activeIndex >= 0 && $scope.activeIndex < $scope.activeImgs.length) {
				if ($scope.activeIndex == 0 || $scope.activeIndex == $scope.activeImgs.length - 1) {
					if ($scope.showMessage) {
						$scope.showMessage = false;
						showMessage('没有更多啦');
						var showMessagePromise = $timeout(3000);
						showMessagePromise.then(function() {
							$scope.showMessage = true;
						});
					}
				}
				$scope.activeImg = $scope.activeImgs[$scope.activeIndex];
			} 
			
//			// 重置图片按尺寸
//			var $panzoomContainer = $('.panzoomContainer').first();
//	        $panzoomContainer.find('.panzoom').panzoom("reset");
//			if (fromJquery) {
//				$scope.$apply();
//			}
			
		}
		
		init();
	}]);
	
	// 紧急抢修智囊团
	emmsMobile.controller('EmergencyGroupMobileCtrl', ['$scope', '$state', '$stateParams', 'SharedState', 
		'CommonService', 'EmergencyGroup', '$timeout',
		function($scope, $state, $stateParams, SharedState, CommonService, EmergencyGroup, $timeout) {
		$scope.showMessageFlag = true;
		
		function init() {
			
			$scope.malfunction = $stateParams.malfunction == null ? {} : angular.copy($stateParams.malfunction);
			
			// 分页参数
			var size = Math.round(CommonService.getViewHeight() / 55);
			$scope.pageInfos = {number: 0, size: size};
		}
		
		// 数据分页 滑动刷新
		$scope.$on('$viewContentLoaded', function() {
			
			var emergencyGroupMescroll = new MeScroll('emergencyGroupMescroll', {
				
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
						page.num = $scope.pageInfos.number;
						$scope.search(page, $scope.condition, ms);
					}
				},
				down: { 
					auto: false,
					htmlContent: '&nbsp;',
					callback: function(ms) {
						emergencyGroupMescroll.endErr();
					}
				}
				
			});
			
		});
		
		// 查看详情
		$scope.showEmergencyGroupStaffDetail = function(staff) {
			$scope.staff = staff;
			SharedState.turnOn('emergencyGroupStaffDetail');
		}
		
		// 打电话
		$scope.call = function(phone) {
			return CommonService.call(phone);
		}
		
		// 分页查询
		$scope.search = function(page, condition, mescroll){

			if ($scope.showMessageFlag) {
				EmergencyGroup.queryPage({
					page: page ? page.num : $scope.pageInfos.number,
				    size: page ? page.size : $scope.pageInfos.size,
				    queryItem: $scope.condition}, function(response) {
					$scope.currentPageInfo = response;
					if (mescroll) {
						// 请求成功后关闭加载条
						mescroll.endByPage(response.numberOfElements, response.totalPages);
					}
					if (response.last == false) {
						$scope.pageInfos.number++;
					} else {
						$scope.showMessageFlag = false;
						$timeout(2000).then(function() {
							$scope.showMessageFlag = true;
						});
					}
					refreshContent(response);
				});
			}

			// 请求未发起成功， 手动关闭加载条
			if (mescroll) {
				$timeout(2000).then(function() {
					mescroll.endByPage($scope.currentPageInfo.numberOfElements, $scope.currentPageInfo.totalPages);
				});
			}
		
		};
		
		function refreshContent(data) {
			if (angular.isUndefined($scope.emergencyGroupStaffs)) {
				$scope.emergencyGroupStaffs = [];
			}
			
			if (data.first == true) {
				
				$scope.emergencyGroupStaffs = data.content
				
			} else {
				
				angular.forEach(data.content, function(newStaff) {
					var isNotExist = true;
					angular.forEach($scope.emergencyGroupStaffs, function(oldStaff) {
						if (oldStaff.staffNo == newStaff.staffNo) {
							isNotExist = false;
						}
					});
					if (isNotExist) {
						$scope.emergencyGroupStaffs.push(newStaff);
					}
				});
				
			}

		}
		
		$scope.backToMalfunctionTask = function() {
			if ($stateParams.param && $stateParams.param.location) {
				$state.go('map.locationShow', {location: $stateParams.param.location, object: $scope.malfunction, isShowNear: $stateParams.param.isShowNear, type: 'malfunction'});
			} else {
				$state.go('malfunctions.execute', {malfunction: $scope.malfunction});
			}
		}
		
		init();
	}]);
	
	// 查看故障单
	emmsMobile.controller('MalfunctionViewCtrl', ['$scope', '$state', '$stateParams', 'Malfunction',
		function($scope, $state, $stateParams, Malfunction) {
		
		$scope.malfunctinId  = $stateParams.param.id;
		$scope.objectId  = $stateParams.param.objectId;
		
		function init() {
			if ($scope.malfunctinId) {
				Malfunction.get({id: $scope.malfunctinId}, function(response) {
					$scope.item = response;
				});
			}
		}
		
		$scope.back = function() {
			$state.go('jobtickets.execute', {param: {id: $scope.objectId}});
		}
		
		init();
	}]);
	
	emmsMobile.controller('CtrlMobileCtrl', ['$scope', '$state', 'SweetAlert', '$timeout', '$http', 'Malfunction', 
		function($scope, $state, SweetAlert, $timeout, $http, Malfunction) {}]);
	
	return mobileApp;
}(emmsMobileModule || {}));