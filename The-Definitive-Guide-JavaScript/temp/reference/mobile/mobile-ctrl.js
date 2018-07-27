/**
 * description - mobile components
 * create - Nelson.Xuezi.Hu
 * date - 2018-01-16
 */
var emmsMobileModule = (function(mobileApp) {
	var emmsMobile = mobileApp.emmsMobile;
	
	emmsMobile.controller('SelectStaffCtrl', ['$scope', '$stateParams', '$state', 'Staff', 'CommonService', '$timeout', '$document', 
		function($scope, $stateParams, $state, Staff, CommonService, $timeout, $document) {
		
			$scope.title = $stateParams.param.title;
			$scope.sourceState = $stateParams.param.sourceState;
			$scope.parentVehicleType = $stateParams.param.parentVehicleType;
			$scope.source = $stateParams.param.source;
			$scope.condition = $scope.source.passenger ? $scope.source.passenger.staffName : ($scope.childCondition ? $scope.childCondition : '');
		
			function init() {
			
				$timeout(100).then(function() {
					// 参数
					$scope.showMessageFlag = true;
					$scope.results = [];
					
					var size = Math.round(CommonService.getViewHeight() / 73);
					$scope.pageInfos = {num: 0, size: size};
					
					var mescroll = new MeScroll('mescroll', {
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
				});
				
				
			}
		
		// 点击条目进入
		$scope.open = function(state, param) {
			$state.go(state, {param: param});
		}
		
		
		// change
		$scope.change = function() {
			var page = {};
			page.num = 1;
			page.size = $scope.pageInfos.size;
			$scope.loadMore(page);
		}
		
		// 加载更多
		$scope.loadMore = function(page, mescroll) {

			if ($scope.showMessageFlag) {

				if ($scope.condition || $scope.childCondition) {
					
					if ($scope.childSearch) {
						$scope.childSearch(page, mescroll);
					} else {
						
						// 模糊查找人员
						Staff.staffNameOrDeptLike({page: page.num - 1, size: page.size, condition: $scope.condition}, function(response) {
							
							$scope.successCallBack(response, mescroll);
							
						});
						
					}
					
				} else {
					if ($scope.staffs && $scope.staffs.length > 0) {
						$scope.staffs = [];
					}
				}
			
			}
			
			// 请求未发起成功， 手动关闭加载条
			if (mescroll) {
				$timeout(100).then(function() {
					if ($scope.currentPageInfo) {
						mescroll.endByPage($scope.currentPageInfo.numberOfElements, $scope.currentPageInfo.totalPages);
					} else {
						mescroll.endErr();
					}
				});
			}
		
		};
		
		// 成功回调
		$scope.successCallBack = function(response, mescroll) {

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
				$timeout(1000).then(function() {
					$scope.showMessageFlag = true;
				});
			}
			$scope.refreshContent(response);
		
		}
		
		$scope.refreshContent = function(data) {
			
			if (data.first == true) {
				
				$scope.staffs = data.content
				
			} else {
				
				angular.forEach(data.content, function(newResult) {
					var isNotExist = true;
					angular.forEach($scope.staffs, function(oldResult) {
						if (oldResult.id == newResult.id) {
							isNotExist = false;
						}
					});
					if (isNotExist) {
						$scope.staffs.push(newResult);
					}
				});
			//	$scope.staffs = transformLinkedDept($scope.staffs);
			}
			
		}
		
/*		function transformLinkedDept(staffs) {
			angular.forEach(staffs, function(staff, index) {
				var deptName = '';
				deptName = staff.dept.name;
				if (staff.dept.children[0]) {
					deptName = staff.dept.children[0].name;
					if (staff.dept.children[0].children && staff.dept.children[0].children[0]) {
						deptName = deptName + ' - ' + staff.dept.children[0].children[0].name;
						if (staff.dept.children[0].children[0].children && staff.dept.children[0].children[0].children[0]) {
							deptName = deptName + ' - ' + staff.dept.children[0].children[0].children[0].name;
							if (staff.dept.children[0].children[0].children[0].children && staff.dept.children[0].children[0].children[0].children[0]) {
								deptName = deptName + ' - ' + staff.dept.children[0].children[0].children[0].children[0].name;
							}
						}
					}
				}
				staff.deptName = deptName;
			});
			return staffs;
		}*/
		
		$scope.back = function() {
			
			// 子控制器返回
			if ($scope.childBack) {
				$scope.childBack();
			} else {
				var param = {};
				param.parentVehicleType = $scope.parentVehicleType;
				param.vehicleApplication = $scope.source;
				$state.go($scope.sourceState, {param: param});
			}
			
		}
		
		$scope.getSelectedAndBack = function(staff) {
			
			var selectedStaffELement = $document.find('#staff' + staff.staffNo);
			selectedStaffELement.attr('checked', true);
			$scope.selectedStaff = staff;
			
			if ($scope.childGetSelectedAndBack) {
				$scope.childGetSelectedAndBack();
			} else {
				$scope.source.passenger = $scope.selectedStaff ? $scope.selectedStaff : $scope.source.passenger;
				var param = {};
				param.parentVehicleType = $scope.parentVehicleType;
				param.vehicleApplication = $scope.source;
				$state.go($scope.sourceState, {param: param});
			}
			
		}
		
		$scope.removePassenger = function() {
			if ($scope.childRemove) {
				$scope.childRemove();
			} else {
				$scope.source.passenger = null;
				$scope.back();
			}
		}
		
		init();
	}]);
	
	
	//  选择站点
	emmsMobile.controller('SelectStationCtrl', ['$scope', '$stateParams', '$state', 'Stations', 'CommonService', '$timeout', '$document', 'ChildrenArea',
		function($scope, $stateParams, $state, Stations, CommonService, $timeout, $document, ChildrenArea) {
		
			$scope.title = $stateParams.param.title;
			// $scope.type = $stateParams.param.type;
			$scope.parentVehicleType = $stateParams.param.parentVehicleType;
			$scope.sourceState = $stateParams.param.sourceState;
			$scope.source = $stateParams.param.source;
			$scope.areaSection = $stateParams.param.areaSection;
			// $scope.middleAreas = $stateParams.param.middleAreas;
			initCondition();
		
			function init() {
			
				$timeout(100).then(function() {
					// 参数
					$scope.showMessageFlag = true;
					$scope.results = [];
					
					var size = Math.round(CommonService.getViewHeight() / 73);
					$scope.pageInfos = {num: 0, size: size};
					
					var mescroll = new MeScroll('mescroll', {
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
				});
				
				
			}
			
			function initCondition() {
				
				if ($scope.areaSection.area) {
					$scope.condition = $scope.areaSection.area.id ? $scope.areaSection.area.name : $scope.areaSection.description;
				} else {
					$scope.condition = $scope.areaSection.description ? $scope.areaSection.description : "";
				}
				
			}
		
		// 自动提示
		$scope.change = function() {
			var page = {};
			page.num = 1;
			page.size = $scope.pageInfos.size;
			$scope.loadMore(page);
		}
		
		// 加载更多
		$scope.loadMore = function(page, mescroll) {

			if ($scope.showMessageFlag) {
				if ($scope.condition) {
					ChildrenArea.dimSearch({condition: $scope.condition}, function(response) {
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
							$timeout(1000).then(function() {
								$scope.showMessageFlag = true;
							});
						}
						refreshContent(response);
					});
				
				} else {
					if ($scope.stations && $scope.stations.length > 0) {
						$scope.stations = [];
					}
				}
			}
			
			// 请求未发起成功， 手动关闭加载条
			if (mescroll) {
				$timeout(100).then(function() {
					if ($scope.currentPageInfo) {
						mescroll.endByPage($scope.currentPageInfo.numberOfElements, $scope.currentPageInfo.totalPages);
					} else {
						mescroll.endErr();
					}
				});
			}
		
		};
		
		function refreshContent(data) {

			if (data.first == true) {
				
				$scope.stations = data.content
				
			} else {
				
				angular.forEach(data.content, function(newResult) {
					var isNotExist = true;
					angular.forEach($scope.stations, function(oldResult) {
						if (oldResult.id == newResult.id) {
							isNotExist = false;
						}
					});
					if (isNotExist) {
						$scope.stations.push(newResult);
					}
				});
				
			}
		
		}
		
		$scope.getSelected  = function(station) {
			
			angular.forEach($scope.source.areaSections, function(areaSection) {
				if (areaSection.orderIndex == $scope.areaSection.orderIndex) {
					if (station) {
						areaSection.area = station;	
					} else {
						areaSection.description = $scope.condition;
					}
				} 
			});
			
			
			var param = {};
			param.parentVehicleType = $scope.parentVehicleType;
			param.vehicleApplication = $scope.source;
			$state.go($scope.sourceState, {param: param});
			
		}
		
		// 移除途经点
		$scope.removeMiddle = function() {
			angular.forEach($scope.source.areaSections, function(areaSection, index) {
				if (areaSection.orderIndex == $scope.areaSection.orderIndex) {
					if (areaSection.orderIndex == -1 || areaSection.orderIndex == 10000) {
						areaSection.area = null;
					} else {
						$scope.source.areaSections.splice(index, 1);
					}
				}
			});
			$scope.back();
		}
		
		$scope.back = function() {
			var param = {};
			param.parentVehicleType = $scope.parentVehicleType;
			// $scope.source.applyAreas.middleAreas = $scope.middleAreas;
			param.vehicleApplication = $scope.source;
			$state.go($scope.sourceState, {param: param});
		}
		
		init();
	}]);
	
	
	/**
	 * description - 通用页面迁移
	 * create - Nelson.Xuezi.Hu
	 * date - 2018-05-03
	 */
	emmsMobile.controller('CommonOpenCtrl', ['$scope', '$state', function($scope, $state) {
		
		function openInit() {
			
		}
		
		$scope.go = function(target, param) {
			$state.go(target.to, {param: {from: target.from, id: param.id}});
		};
		
		openInit();
	}]);
	
	/**
	 * description - 通用页面滚动控制器(无分页)
	 * create - Nelson.Xuezi.Hu
	 * date - 2018-03-17
	 */
	emmsMobile.controller('CommonUnPageScrollCtrl', ['$scope', '$controller', 'CommonService',
		function($scope, $controller, CommonService) {
		
		function mescrollInit() {
			
			// 页面滑动实例
			var mescroll;
			
			// 页面滑动
			$scope.$on('$viewContentLoaded', function() {
				
				// 内容区域可滑动实例
				mescroll = CommonService.enableContentPullable('mescroll');

			});
			
			$scope.$on('$destroy', function() {
				
				// 销毁滑动实例
				mescroll.destroy();
			});
			
		}
		
		$controller('CommonOpenCtrl', {$scope: $scope});
		mescrollInit();
	}]);
	
	/**
	 * description - 通用页面滚动控制器(下拉刷新)
	 * create - Nelson.Xuezi.Hu
	 * date - 2018-03-17
	 */
	emmsMobile.controller('CommonDownToRefreshScrollCtrl', ['$scope', '$controller', '$timeout', 'CommonService',
		function($scope, $controller, $timeout, CommonService) {
		
		function upToRefreshInit() {
			
			$timeout(100).then(function() {
				// 参数
				$scope.showMessageFlag = true;
				$scope.results = [];
				
				var size = Math.round(CommonService.getViewHeight() / 73);
				$scope.pageInfos = {num: 0, size: size};
				
				var mescroll = new MeScroll('mescroll', {
					down: {
						noMoreSize: $scope.pageInfos.size - 2,
						htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>',
						htmlNodata: '<p class="upwarp-nodata">-- 没有数据啦 --</p>',
						offset: 40,
						callback: function(ms) {
							$scope.refresh(ms);
						}
					}
				});
			});
			
		}
		
		// 刷新
		$scope.refresh = function(ms) {
			$scope.childHandler(ms);
		};
		
		
		$controller('CommonOpenCtrl', {$scope: $scope});
		upToRefreshInit();
	}]);
	
	/**
	 * description - 通用页面滚动控制器(分页)
	 * create - Nelson.Xuezi.Hu
	 * date - 2018-03-17
	 */
	emmsMobile.controller('CommonPageScrollCtrl', ['$scope', '$controller', 'CommonService', '$timeout',
		function($scope, $controller, CommonService, $timeout) {
		
		function pageableInit() {
			
			$timeout(100).then(function() {
				// 参数
				$scope.showMessageFlag = true;
				$scope.results = [];
				
				var size = Math.round(CommonService.getViewHeight() / 73);
				$scope.pageInfos = {num: 0, size: size};
				
				var mescroll = new MeScroll('mescroll', {
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
			});
			
		}
		
		// 加载更多
		$scope.loadMore = function(page, mescroll) {
	
			// 判断执行条件并执行
			if ($scope.showMessageFlag) {
				if ($scope.isSearchable()) {
					$scope.search(page, mescroll);
				} else {
					if ($scope.results && $scope.results.length > 0) {
						$scope.results = [];
					}
				}
			}
			
			// 请求未发起成功， 手动关闭加载条
			if (mescroll) {
				$timeout(100).then(function() {
					if ($scope.currentPageInfo) {
						mescroll.endByPage($scope.currentPageInfo.numberOfElements, $scope.currentPageInfo.totalPages);
					} else {
						mescroll.endErr();
					}
				});
			}
		
		};
		
		// 成功回调
		$scope.successCallBack = function(response, mescroll) {

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
				$timeout(1000).then(function() {
					$scope.showMessageFlag = true;
				});
			}
			$scope.refreshContent(response);
		
		}
		
		$scope.refreshContent = function(data) {
	
			if (data.first == true) {
				
				$scope.results = data.content
				
			} else {
				
				angular.forEach(data.content, function(newResult) {
					var isNotExist = true;
					angular.forEach($scope.results, function(oldResult) {
						if (oldResult.id == newResult.id) {
							isNotExist = false;
						}
					});
					if (isNotExist) {
						$scope.results.push(newResult);
					}
				});
				
			}
		
		}
		
		$scope.reload = function() {
			pageableInit();
		}
		
		$controller('CommonOpenCtrl', {$scope: $scope});
		pageableInit();
	}]);
	
	
	/**
	 * description - 通用中间媒介控制器: 已选择列表项展示页控制器
	 * create - Nelson.Xuezi.Hu
	 * date - 2018-03-17
	 */
	emmsMobile.controller('CommonMediumCtrl', ['$scope', '$stateParams', '$state', 'CommonService', '$timeout', '$document', '$controller',
		function($scope, $stateParams, $state, CommonService, $timeout, $document, $controller) {
		
		function init() {
		
			$controller('CommonUnPageScrollCtrl', {$scope: $scope});
			
			// 初始化参数
			$scope.source = $stateParams.param.source;
			// 获取当前显示项指针
			$scope.propertyArray = $stateParams.param.property.split('.');
			if ($scope.propertyArray.length > 1) {
				$scope.selectedItems = $stateParams.param.source;
				angular.forEach($scope.propertyArray, function(property, index) {
					$scope.selectedItems = $scope.selectedItems[property];
				});
			} else {
				$scope.selectedItems = $stateParams.param.source[$stateParams.param.property];
			}
			// 保存拷贝
			if (!$stateParams.param.fromSelect) {
				$stateParams.param.source.selectedItemsCopy = angular.copy($scope.selectedItems);
			}
			
			// 删除指定项
			if ($stateParams.param.deletedItemId) {
				if ($scope.childRemove) {
					$scope.childRemove();
				} else {
					angular.forEach($scope.selectedItems, function(item, index) {
						if (item.id == $stateParams.param.deletedItemId) {
							$scope.selectedItems.splice(index, 1);
						}
					});
				}
			}
			
		}
		
		// 打开列表项
		$scope.openItem = function(item) {
			var param = {
					prevState: $stateParams.param.state.media,
					prevParam: $stateParams.param,
					fromMediaPage: true,
					itemId: item.id
					};
			$state.go($stateParams.param.state.detail, {param: param});
		}
		
		// 添加新项
		$scope.add = function() {
			$state.go($stateParams.param.state.select, {param: $stateParams.param});
		}
		
		// 返回
		$scope.back = function() {
			
			var param = {editedSource: $stateParams.param.source};
			$state.go($stateParams.param.state.source, {param: param});
		}
		
		// 确认
		$scope.confirm = function() {
			
			if ($scope.childCheckValid && !$scope.childCheckValid()) {
				return ;
			}
			
			var param = {editedSource: $stateParams.param.source};
			$state.go($stateParams.param.state.source, {param: param});
		}
		
		// 移除
		$scope.remove = function(index) {
			$scope.selectedItems.splice(index, 1);
		}
		
		init();
	}]);
	
	/**
	 * description - 选择业务对象控制器
	 * create - Nelson.Xuezi.Hu
	 * date - 2018-03-17
	 */
	var ItemSelectCtrl =  function($scope, $state, $stateParams, $injector, CommonService, SweetAlert, $controller) {
		
		function init() {

			// 分页
			$controller('CommonPageScrollCtrl', {$scope: $scope});
			
			// 初始化参数
			$scope.condition = '';
			$scope.Resource = $injector.get($stateParams.param.resource);
			// 获取当前操作项指针
			$scope.propertyArray = $stateParams.param.property.split('.');
			if ($scope.propertyArray.length > 1) {
				$scope.selectedItems = $stateParams.param.source;
				angular.forEach($scope.propertyArray, function(property, index) {
					$scope.selectedItems = $scope.selectedItems[property];
				});
			} else {
				$scope.selectedItems = $stateParams.param.source[$stateParams.param.property];
			}
			
		}
		
		// 自动匹配搜索结果
		$scope.change = function() {
			var page = {};
			page.num = 1;
			page.size = $scope.pageInfos.size;
			$scope.loadMore(page);
		}
		
		// 是否启动查询
		$scope.isSearchable = function() {
			return $scope.condition || $scope.searchWithoutCondition;
		}
		
		// 查询
		$scope.search = function(page, mescroll) {
			
			if ($scope.childSearch) {
				
				$scope.childSearch(page, mescroll);
				
			} else {
				
				$scope.Resource.dimSearch({
					page: page.num - 1,
					size: page.size,
					condition: $scope.condition},
					function(response) {
						$scope.successCallBack(response, mescroll);
					});
				
			}
			
		
		}
		
	
		// 打开列表项
		$scope.openItem = function(item) {
			var param = {
					prevState: $stateParams.param.state.select,
					prevParam: $stateParams.param,
					itemId: item.id
					};
			$state.go($stateParams.param.state.detail, {param: param});
		}
		
	
		// 选中确认
		$scope.confirm  = function(station) {
			
			var currentSelectedItems = CommonService.getSelected();
			
			var isExists = false;
			angular.forEach(currentSelectedItems, function(selected, index) {
				angular.forEach($scope.selectedItems, function(current, index) {
					if (selected.id == current.id) {
						SweetAlert.swal({
							title: '包含重复项',
							text: '请重新选择',
							type: 'warning'
						});
						isExists = true;
					}
				});
			});
			
			if (isExists) {
				return ;
			} else {
				angular.forEach(currentSelectedItems, function(selected) {
					
					if ($scope.customeReturnedObj) {
						$scope.selectedItems.push($scope.customeReturnedObj(selected));
					} else {
						$scope.selectedItems.push(selected);
					}
					
				});
			}
			
			$stateParams.param.fromSelect = true;
			$scope.back();
			
		}
		
		// 返回
		$scope.back = function() {
			$state.go($stateParams.param.state.media, {param: $stateParams.param});
		}
		
		init();
	}
	emmsMobile.ItemSelectCtrl = ItemSelectCtrl;
	emmsMobile.controller('CommonSelectItemCtrl', ['$scope', '$state', '$stateParams', '$injector', 'CommonService', 'SweetAlert', '$controller', emmsMobile.ItemSelectCtrl]);
	
	
	/**
	 * description - 查看业务对象详情控制器
	 * create - Nelson.Xuezi.Hu
	 * date - 2018-03-17
	 */
	var SelectItemViewCtrl =  function($scope, $state, $stateParams, $injector, $controller) {
		
		function init() {
			
			$controller('CommonUnPageScrollCtrl', {$scope: $scope});
			
			$scope.fromMediaPage = $stateParams.param.fromMediaPage;
			var resourceValue = $stateParams.param.prevParam.childResource ? 
					$stateParams.param.prevParam.childResource : $stateParams.param.prevParam.resource;
			var Resource = $injector.get(resourceValue);
			$scope.resourceName = resourceValue;
			
			// 获取要显示的业务对象
			Resource.get({id: $stateParams.param.itemId}, function(response) {
				$scope.item = response;
				if ($scope.specialHandler) {
					$scope.specialHandler($scope.item);
				}
				$stateParams.param.prevParam.childResource = null;
			});
		}
		
		// 返回
		$scope.back = function() {
			$state.go($stateParams.param.prevState, {param: $stateParams.param.prevParam});
		}
		
		// 移除
		$scope.remove = function() {
			$stateParams.param.prevParam.deletedItemId = $stateParams.param.itemId;
			$scope.back();
		}
		
		init();
	}
	emmsMobile.SelectItemViewCtrl = SelectItemViewCtrl;
	emmsMobile.controller('CommonSelectItemViewCtrl', ['$scope', '$state', '$stateParams', '$injector', '$controller', emmsMobile.SelectItemViewCtrl]);
	
	
	// 通用tab页控制器
	emmsMobile.controller('CommonTabMobileCtrl', ['$scope', '$state', '$controller', '$stateParams', '$document', '$timeout',
		function($scope, $state, $controller, $stateParams, $document, $timeout) {
		
		var destination = angular.copy($stateParams.destination);
		
		function init() {
			
			//  获取tab元素
			$scope.tabsElements = $document.find('.scrollable-header .btn-group span');
			
			var destinationElement;
			if (destination) {
				destinationElement = $document.find('#' + destination);
			} else {
				destinationElement = angular.element($scope.tabsElements[0]);
			}
			
			$timeout(function() {
				destinationElement.triggerHandler('click');
			}, 0);
			
		}
		
		// 菜单选项卡切换
		$scope.toggle = function($event) {
		
			$scope.currentTab = $event.currentTarget.id;
			
		}
		
		$controller('CommonOpenCtrl', {$scope: $scope});
		init();
	}]);
	
	// 业务待发起列表
	emmsMobile.controller('BusinessDraftListCtrl', ['$scope', '$state', '$controller', 'DraftResource',
		function($scope, $state, $controller, DraftResource) {
		
		// 是否启动查询
		$scope.isSearchable = function() {
			return true;
		}
		
		// 查询
		$scope.search = function(page, mescroll) {
			
			DraftResource.get({
					page: $scope.pageInfos.number ? $scope.pageInfos.number - 1 : 0,
					size: $scope.pageInfos.size},
				function (response) {
					$scope.successCallBack(response, mescroll);
				});
			
		}
		
		$controller('CommonPageScrollCtrl', {$scope: $scope});
	}]);
	
	
	// 业务个人任务列表 
	emmsMobile.controller('BusinessSelfTaskListCtrl',['$scope', '$state', '$controller', 'TaskResource',
		function($scope, $state, $controller, TaskResource) {
		
		// 刷新当前任务列表
		$scope.$on('refreshTaskCounts', function(e, param) {
			$scope.SelfTaskInit();
		});
		
		$scope.SelfTaskInit = function(ms){
			
			TaskResource.self(function(response) {
				$scope.results = response;
				ms.endSuccess(); //无参
			});
			
		}
		
		$scope.childHandler = function(ms) {
			$scope.SelfTaskInit(ms);
		}
		
		
		$controller('CommonDownToRefreshScrollCtrl', {$scope: $scope});
	}]);
	
	// 业务当前任务主页面列表
	emmsMobile.controller('BusinessTaskListCtrl',['$scope', '$state', '$controller', 'TaskResource', 
		function($scope, $state, $controller, TaskResource) {
		
		// 是否启动查询
		$scope.isSearchable = function() {
			return true;
		}
		
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
		$controller('CommonPageScrollCtrl', {$scope: $scope});
	}]);
	
	return mobileApp;
}(emmsMobileModule || {}));