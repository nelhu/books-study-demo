/**
 * description - 系统通用控制器
 * create - Nelson.Xuezi.hu
 * date - 2018-03-23
 */
var emmsModule = (function(app){
	
	var emms = app.emms;
	
	// 通用 - 打开模态框
	emms.controller('CommonOpenCtrl', ['$scope', '$uibModal', function($scope, $uibModal) {
		
		/**
		 * templateUrl: 模板路径
		 * ctrl: 控制器
		 * size: 模态框的尺寸
		 * currentRecord: 要打开的记录
		 */
		$scope.open = function(templateUrl, ctrl, size, param) {
			var uibModalInstance= $uibModal.open({
				backdrop:"static",
				templateUrl: templateUrl,
				controller: ctrl,
				size: size,
				resolve: {
					param: function() {
						return angular.copy(param);
					}
				}
			}).result.then(function(response) {
				/**
				 * description: 刷新list/向下级控制器传递广播
				 */
				// 刷新list
				$scope.$broadcast('closed', {key: 'refresh', value: ''});
				if (response) { 
					// 向下级控制器传递广播
					$scope.$broadcast('closed', {key: response.key, value: response.value});
				
				}
			}, function(response) {
				if (response && response.childTaskComplete) {
					$scope.$broadcast('closed', {key: 'refresh', value: ''});
				}
			});
		}
		
		// 刷新列表
		$scope.$on('ChildTaskComplete', function(e, param) {
			$scope.$broadcast('closed', {key: 'refresh', value: ''});
		});
		
		$scope.dismiss = function() {
			$scope.$dismiss();
		}		
		
	}]);
	
	// 通用 - tab页控制器
	emms.controller('CommonTabCtrl', ['$scope', '$controller', function($scope, $controller) {
		
		function tabInit() {
			$scope.selectedIndex = 0;
		}
		
		$scope.onSelect = function(event, index) {
			$scope.selectedIndex = index;
		};

		$scope.$on('closed', function(e, param) {
			if (param.key == 'switch') {
				if (param.value === 'toDraft') {
					$scope.selectedIndex = 1;
				} else {
					$scope.selectedIndex = 0;
				}
				
			}
		});
		
		$controller('CommonOpenCtrl', {$scope: $scope});
		tabInit();
	}]);	
	
	// 通用 - 基础列表页(不分页)
	emms.controller('CommonListCtrl', ['$scope', 'Resource', '$controller', function($scope, Resource, $controller) {
		
		function ListInit(){
			
			Resource.lists(function(response) {
				$scope.results = response;
			});
			
		}
		
		$controller('CommonOpenCtrl', {$scope: $scope});
		ListInit();
	}]);
	
	// 通用 - 基础分页
	emms.controller('CommonPaginationCtrl', ['$scope', '$controller', function($scope, $controller) {
		
		function paginationInit(){
			
			// 分页参数
			$scope.pageInfos = {};
			
			// 获取第一页
			$scope.pageChange();
		}
		
		$scope.pageChange = function() {

			// 子控制器查询
			$scope.search();
			
		}
		
		$scope.refreshContent = function(data) {
			$scope.results = data.content;
			$scope.pageInfos.totalElements = data.totalElements;
			$scope.pageInfos.number = data.number + 1;
			
			// 子控制器自定义处理
			if ($scope.child_result_handler) {
				$scope.child_result_handler();
			}
		}
		
		$scope.dismiss = function() {
			$scope.$dismiss();
		}		
		
		$controller('CommonOpenCtrl', {$scope: $scope});
		paginationInit();
	}]);
	
	emms.controller('CheckboxCtrl',['$scope','param'
		,function($scope,param){
		
		function init(){
			$scope.selectObjects = param.Objects ? param.Objects : [];
		}
		
		$scope.returnSelectObj = function(){
			return $scope.selectObjects;
		}
		
		$scope.selectedObjectAll = function($event){
			var i;
			var size;
			var flag;
			if($event.target.checked){
				angular.forEach($scope.results,function(item){
					if(!$scope.isSelectd(item)){
						$scope.selectObjects.push(item);
					}
				});
			}else{
				angular.forEach($scope.results,function(item){
					flag = true;
					for(i = 0,size = $scope.selectObjects.length;i < size && flag;i++){
						if(item.id === $scope.selectObjects[i].id){
							$scope.selectObjects.splice(i,1);
							flag = false;
						}
					}
				});
			}
		}
		
		$scope.selectObject = function($event,obj){
			var flag = $scope.isSelectd(obj);
			var objs = [];
			if($event.target.checked){
				if(!flag){
					$scope.selectObjects.push(obj);
				}
			}else{
				if(flag){
					angular.forEach($scope.selectObjects,function(item){
						if(item.id !== obj.id){
							objs.push(item);
						}
					});
					$scope.selectObjects = angular.copy(objs);
				}
			}
		}
		
		$scope.isSelectd = function(obj){
			var flag = false;
			angular.forEach($scope.selectObjects,function(item){
				if(item.id === obj.id){
					flag = true;
				}
			});
			return flag;
		}
		
		init();
		
	}]);
	
	// 通用 - 多选-复选框模态框控制器
	emms.controller('MultiSelectItemCtrl', ['$scope', '$controller','$document', 'CommonFunction', 'toastr', 'param', 
		function($scope, $controller,$document, CommonFunction, toastr, param) {
		
		function MultiSelectItemCtrlInit(){
			
			// 已存在项
		}
		
		$scope.selectAll = function() {
			$scope.hasItemSelected = CommonFunction.selectAllCheckbox($scope.allCheck);
		}
		
		//已存在项勾选
		$scope.alreadyChecked = function(checked,pageItems){
			angular.forEach(checked, function(check) {
				angular.forEach(pageItems, function(pageItem) {
					if(check.id === pageItem.id){
					}
				});
			});
		}
		
		//获取已被勾选项
		$scope.obtainChecked = function(checked){
			checked = checked.concat(CommonFunction.getSelected());
			return checked;
		}
		
		$scope.confirm = function() {
			
			$scope.selectedItems = CommonFunction.getSelected();
			
			var isExists = false;
			angular.forEach($scope.selectedItems, function(selected, index) {
				angular.forEach($scope.existedItems, function(existed, index) {
					if (selected.id == existed.id) {
						toastr.warning('包含重复项');
						isExists = true;
					}
				});
			});
			
			if (!isExists) {
				if ($scope.childSelected) {
					$scope.childSelected($scope.selectedItems);
				} else {
					$scope.$close($scope.selectedItems);
				}
			}
		}
		
		$scope.dismiss = function() {
			$scope.$dismiss();
		}	
		
		MultiSelectItemCtrlInit();
	}]);
	
	// 通用 - 单选-选择按钮控制器
	emms.controller('SingleSelectItemCtrl', ['$scope', 'CommonFunction', 'toastr', 'param', 
		function($scope, CommonFunction, toastr, param) {
		
		function SingleSelectItemInit(){
			
			// 已存在项: 与当前选择项的类型相同
			$scope.existedItems = param;
			
		}
		
		$scope.childSelected = function(selectedItem) {
			
			var isExists = false;
			angular.forEach($scope.existedItems, function(existed, index) {
				if (selectedItem.id == existed.id) {
					toastr.warning('包含重复项');
					isExists = true;
				}
			});
			
			if (!isExists) {
				$scope.$close(selectedItem);
			}
		}
		
		$scope.dismiss = function() {
			$scope.$dismiss();
		}	
		
		SingleSelectItemInit();
	}]);
	
	// 通用 - 选择设备（单个）控制器
	emms.controller('SingleSelectDeviceCtrl', ['$scope', '$controller', 'CommonFunction', 'toastr', 'param', 'Device', '$timeout',
		function($scope, $controller, CommonFunction, toastr, param, Device, $timeout) {
		
		// 选择设备
		$controller('MalfunctionSelectedDeviceCtrl', { $scope: $scope, Device: Device, scope :param.scope });
		
		// 过滤返回
		$controller('SingleSelectItemCtrl', {$scope: $scope, param: param});
		
		
		function SelectDeviceInit(){
			
		}
		
		// TODO 替换定时器
		$timeout(100).then(function() {
			$scope.pageChange($scope.pattern, $scope.pageInfos);
		});

		SelectDeviceInit();
	}]);
	
	// 通用 - 确认发起
	emms.controller('CommonSureStartCtrl', ['$scope', 'toastr', 'param', '$injector',
		function($scope, toastr, param, $injector) {

		$scope.Resource = $injector.get(param.resource);
		$scope.start = function() {
			$scope.Resource.start({id: param.id}, function(response) {
				if (response.errorMsg || (response.data && response.data.errorMsg)) {
					toastr.error('请稍后重试');
				} else {
					toastr.success('成功发起');
					$scope.$close('success');
				}
				
			});
		};
		
		$scope.dismiss = function() {
			$scope.$close("cancel");
		}

	}]);
	
	
	// 业务对象列表(通用 -管理业务对象-不分页-条件筛选)
	emms.controller('BusinessObjectNoPageListCtrl', ['$scope', '$state', '$controller', 'BusinessObjectResource',
		function($scope, $state, $controller, BusinessObjectResource) {
		
		// 任务模态框关闭
		$scope.$on('closed', function(e, param) {
			if (param.key == 'refresh') {
				$scope.search();
			}
		});
		
		function BusinessObjectNoPageListInit() {
			
			$scope.conditionArray = [];
			$scope.filter = {};
			$scope.filter.startTime = '';
			$scope.filter.endTime = '';
			
			$scope.initCondition();
			
			$scope.search();
		}
		
		$scope.search = function() {
			
			$scope.conditionArray.length = 0;
			for (condition in $scope.conditions) {
				$scope.conditionArray.push($scope.conditions[condition]);
			}
			if($scope.pageBeforeFunction){
				$scope.pageBeforeFunction();
			}
			BusinessObjectResource.search({
						startTime: $scope.filter.startTime,
						endTime: $scope.filter.endTime},
						$scope.conditionArray, function(response){
							$scope.refreshContent(response);
						}, function(response) {});
			
		}
		
		$scope.refreshContent = function(response) {
			$scope.results = response;
			
			// 子控制器自定义处理
			if ($scope.child_result_handler) {
				$scope.child_result_handler();
			}
		}
		
		BusinessObjectNoPageListInit();
		$controller('CommonOpenCtrl', {$scope: $scope});
	}]);
	
	// 业务对象列表(通用 - 管理业务对象-分页-条件筛选)
	emms.controller('BusinessObjectListCtrl', ['$scope', '$state', '$controller', 'BusinessObjectResource',
		function($scope, $state, $controller, BusinessObjectResource) {
		
		// 任务模态框关闭
		$scope.$on('closed', function(e, param) {
			if (param.key == 'refresh') {
				$scope.pageChange();
			}
		});
		
		function BusinessObjectListInit() {
			
			$scope.conditionArray = [];
			$scope.filter = {};
			$scope.filter.startTime = '';
			$scope.filter.endTime = '';
			
			$scope.initCondition();
		}
		
		$scope.search = function() {
			
			$scope.conditionArray.length = 0;
			for (condition in $scope.conditions) {
				$scope.conditionArray.push($scope.conditions[condition]);
			}
			if($scope.pageBeforeFunction){
				$scope.pageBeforeFunction();
			}
			BusinessObjectResource.search({
				page: $scope.pageInfos.number ? $scope.pageInfos.number - 1 : 0,
				size: $scope.pageInfos.size,
				startTime: $scope.filter.startTime,
				endTime: $scope.filter.endTime},
				$scope.conditionArray, function(response){
				$scope.refreshContent(response);
			}, function(response) {
				if ($scope.childOutError) {
					$scope.childOutError();
				}
			});
			
		}
		
		BusinessObjectListInit();
		$controller('CommonPaginationCtrl', {$scope: $scope});
	}]);
	
	
	// 业务当前任务主页面列表
	emms.controller('BusinessTaskListCtrl',['$scope', '$state', '$controller', 'TaskResource', 
		function($scope, $state, $controller, TaskResource) {
		
		// 任务模态框关闭
		$scope.$on('closed', function(e, param) {
			if (param.key == 'refresh') {
				$scope.pageChange();
			}
		});
		
		function BusinessTaskListInit() {
			
			$scope.filter = {};
			$scope.filter.startTime = '';
			$scope.filter.endTime = '';
			$scope.conditionArray = [];
			
			$scope.initCondition();
		}
		
		$scope.search = function() {
			
			$scope.conditionArray.length = 0;
			for (condition in $scope.conditions) {
				$scope.conditionArray.push($scope.conditions[condition]);
			}
			
			TaskResource.tasks({
				page: $scope.pageInfos.number ? $scope.pageInfos.number - 1 : 0,
				size: $scope.pageInfos.size,
				startTime: $scope.filter.startTime,
				endTime: $scope.filter.endTime,
			}, $scope.conditionArray, function(response) {
				$scope.refreshContent(response);
			});
		}
		
		BusinessTaskListInit();
		$controller('CommonPaginationCtrl', {$scope: $scope});
	}]);
	
	// 业务待发起列表
	emms.controller('BusinessDraftListCtrl', ['$scope', '$state', '$controller', 'DraftResource',
		function($scope, $state, $controller, DraftResource) {
		
		// 任务模态框关闭
		$scope.$on('closed', function(e, param) {
			if (param.key == 'refresh') {
				$scope.pageChange();
			}
		});
		
		$scope.search = function() {
			
			DraftResource.get({
				page: $scope.pageInfos.number ? $scope.pageInfos.number - 1 : 0,
				size: $scope.pageInfos.size}, function(response){
				$scope.refreshContent(response);
			});
			
		}
		
		$controller('CommonPaginationCtrl', {$scope: $scope});
	}]);
	
	
	// 业务任务中心列表 
	emms.controller('BusinessSelfTaskListCtrl',['$scope', '$state', '$controller', 'TaskResource',
		function($scope, $state, $controller, TaskResource) {
		
		// 任务模态框关闭
		$scope.$on('closed', function(e, param) {
			if (param.key == 'refresh') {
				SelfTaskInit();
			}
		});
		
		function SelfTaskInit(){
			
			TaskResource.self(function(response) {
				$scope.results = response;
			});
			
		}
		
		$controller('CommonOpenCtrl', {$scope: $scope});
		SelfTaskInit();
	}]);
	
	return app;
}(emmsModule || {}));

