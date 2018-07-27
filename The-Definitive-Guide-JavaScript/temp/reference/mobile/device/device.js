/**
 * description - mobile device related operation
 * create - Nelson.Xuezi.Hu
 * date - 2017-10-17
 */
var emmsMobileModule = (function(mobileApp) {
	var emmsMobile = mobileApp.emmsMobile;

	
	// 选择设备
	emmsMobile.controller('DeviceSelectMobileCtrl', ['$scope', '$state', '$stateParams', 'SharedState', 'Device',
		'$timeout', 'CommonService', 'mobileAsyncService', '$document', 'blockUI',
		function($scope, $state, $stateParams, SharedState, Device, $timeout, CommonService, mobileAsyncService, $document, blockUI) {
		$scope.ctrl = "DeviceSelectMobileCtrl";
		$scope.showMessageFlag = true;
		
		function init() {
			
			// 分页参数
			var size = Math.round(CommonService.getViewHeight() / 55);
			$scope.pageInfos = {number: 0, size: size};
			
			$scope.malfunction = angular.copy($stateParams.malfunction) == null ? {} : angular.copy($stateParams.malfunction);
			$scope.qrcodeFlag = true;
			$scope.searchFlag = true;
			
			if (angular.isUndefined($scope.malfunction.device) || $scope.malfunction.device == null) {
				$scope.action = "select";
				$scope.deviceList = [];
				$scope.showDeviceList = false;
				$scope.showNull = false;
				
			} else {
				$scope.deviceList = [];
				$scope.showDeviceList = true;
				$scope.action = "viewDetailFromAdd";
				
				Device.queryDetailById({id: $scope.malfunction.device.id}, function(response) {
					$scope.device = response.id ? response : response.content;
					
				});
			}
			
		}
		
		$scope.$on('$viewContentLoaded', function() {
			
			if ($scope.action == 'select') {
				
				var deviceMescroll = new MeScroll('deviceMescroll', {
					
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
						offset: 40,
						callback: function(ms) {
							deviceMescroll.endErr();
						}
					}
					
				});
			}
			
		});
		
		$scope.$watch('action', function(newVal, oldVal) {
			if (newVal != 'select') {
				$document.find('.mescroll-upwarp').css('display', 'none');
			}
		});
		
		$scope.$on('mobile-angular-ui.state.changed.deviceList', function(e, newVal, oldVal) {
		    $scope.deviceListFlag = SharedState.isActive('deviceList');
		});
		$scope.$on('mobile-angular-ui.state.changed.deviceRemark', function(e, newVal, oldVal) {
			$scope.deviceRemarkFlag = SharedState.isActive('deviceRemark');
		});
		
		$scope.prevDevice = function(device) {
			$scope.device = device;
			$scope.action = "viewDetail";
		};
		
		$scope.comfirmDevice = function() {
			 $scope.malfunction.device = $scope.device;
			 $state.go('malfunctions.edit', {malfunction: $scope.malfunction});
		}
		
		$scope.backToList = function() {
			$scope.showDeviceList = true;
			$scope.action = 'select';
			SharedState.turnOn('deviceList');
			$scope.deviceListFlag = true;
		}
		
		// 分页查询
		$scope.search = function(currentPage, condition, mescroll){

			if (!currentPage) {
				currentPage = {num: 0};
				$scope.currentPageInfo = null;
			}
			
			if ($scope.showMessageFlag) {
				blockUI.start();
				Device.get({
					scope:'all',
					page: currentPage.num === 0 ? 0 : $scope.pageInfos.number,
					size: currentPage.size ? currentPage.size : $scope.pageInfos.size,
					queryItem: $scope.condition}, function(response) {
					blockUI.stop();
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
			
			$scope.showDeviceList = true;
			SharedState.turnOn('deviceList');
			
		};
		
		function refreshContent(data) {
			if (angular.isUndefined($scope.deviceList)) {
				$scope.deviceList = [];
			}
			
			if (data.first == true) {
				
				$scope.deviceList = data.content
				
			} else {
				
				angular.forEach(data.content, function(newDevice) {
					var isNotExist = true;
					angular.forEach($scope.deviceList, function(oldDevice) {
						if (oldDevice.id == newDevice.id) {
							isNotExist = false;
						}
					});
					if (isNotExist) {
						$scope.deviceList.push(newDevice);
					}
				});
				
			}

			if ($scope.deviceList.length <= 0) {
				$scope.showNull = true;
			}
			
		}
		
		$scope.nextPage = function() {
			$scope.search($scope.condition);
		}
		
		$scope.hideIcons = function() {
			$scope.qrcodeFlag = false;
		}
		
		$scope.showIcons = function() {
			$scope.qrcodeFlag = true;
		}
		
		// 扫描二维码
		$scope.startQRCode = function() {
			try {
				
				if (typeof(JsInterface) == 'undefined') {
					throw 'undefined';
				}
				JsInterface.startQRCode();
				
			} catch(error) {
				
				if (angular.equals(error, 'undefined')) {
					showMessage('请在app内使用');
				}
			}
			
		};
		
		// 获取二维码数据
		$scope.getQRCode = function(deviceNumber) {
			$scope.malfunction.deviceNumber = deviceNumber;
			$state.go('devices.confirm', {malfunction: $scope.malfunction, from: 'edit'});
		}
		
		// 重新选择设备
		$scope.changeDevice = function() {
			$scope.malfunction.device = null;
			$scope.showDeviceList = false;
			$scope.action = 'select';
		}
		
		// 移除设备
		$scope.removeDevice = function() {
			$scope.malfunction.device = null;
			$state.go('malfunctions.edit', {malfunction: $scope.malfunction});
		}
		
		
		init();
	}]);
	
	// 确认设备
	emmsMobile.controller('DeviceConfirmMobileCtrl', ['$scope', '$state', '$stateParams', 'Device', 'SweetAlert', 'CommonService', 'SharedState',
		function($scope, $state, $stateParams, Device, SweetAlert, CommonService, SharedState) {
		
		$scope.ctrl = "DeviceConfirmMobileCtrl";
		
		var mescroll;
		$scope.$on('$viewContentLoaded', function() {
			
			// 内容区域可滑动实例
			mescroll = CommonService.enableContentPullable('confirmDeviceMescroll');

		});
		
		$scope.$on('$destroy', function() {
			
			// 销毁滑动实例
			mescroll.destroy();
		});
		
		$scope.$on('mobile-angular-ui.state.changed.deviceRemark', function(e, newVal, oldVal) {
			$scope.deviceRemarkFlag = SharedState.isActive('deviceRemark');
		});
		
		function init() {
			$scope.malfunction = $stateParams.malfunction == null ? {} : $stateParams.malfunction;
			$scope.from = $stateParams.from;
			
			Device.queryDetailById({id: $scope.malfunction.deviceNumber}, function(response) {
				if (response && response.id) {
					$scope.device = response;
				} else {
					SweetAlert.swal({
						title: '该设备不存在 ',
						text: '标识为 : ' + $scope.malfunction.deviceNumber,
						type: 'error'
					});
					$scope.back();
				}
				
			});	
		
		}
		
		$scope.back = function() {
			if ($scope.from == 'execute') {
				$state.go('malfunctions.execute', {malfunction: $scope.malfunction});
			} else {
				$state.go('malfunctions.edit', {malfunction: $scope.malfunction});
			}
		}
		
		$scope.confirm = function() {
			$scope.malfunction.device = $scope.device;
			$scope.back();
		}
		
		init();
	}]);
	
	// 查看设备详情
	emmsMobile.controller('DeviceDetailMobileCtrl', ['$scope', '$state', '$stateParams', 'Device', 'SweetAlert', 'CommonService', 'SharedState',
		function($scope, $state, $stateParams, Device, SweetAlert, CommonService, SharedState) {
		
		var mescroll;
		$scope.$on('$viewContentLoaded', function() {
			
			// 内容区域可滑动实例
			mescroll = CommonService.enableContentPullable('deviceDetailMescroll');

		});
		
		$scope.$on('$destroy', function() {
			
			// 销毁滑动实例
			mescroll.destroy();
		});
		
		$scope.$on('mobile-angular-ui.state.changed.deviceRemark', function(e, newVal, oldVal) {
			$scope.deviceRemarkFlag = SharedState.isActive('deviceRemark');
		});
		
		function init() {
			
			$scope.malfunction = $stateParams.malfunction;
			if (angular.isDefined($scope.malfunction.device.id) && $scope.malfunction.device.id != null) {
				Device.queryDetailById({id: $scope.malfunction.device.id}, function(response) {
					$scope.device = response;
				});
			}
		}
		
		$scope.back = function() {
			$state.go('malfunctions.execute', {malfunction: $scope.malfunction, taskId: $scope.malfunction.taskId});
		}
		
		init();
	}]);
	
	
	// 流程中选择设备
	emmsMobile.controller('ProcessDeviceSelectMobileCtrl', ['$scope', '$state', '$stateParams', 'SharedState', 'Device', 'CommonService', '$timeout', '$document', 'blockUI',
			function($scope, $state, $stateParams, SharedState, Device, CommonService, $timeout, $document, blockUI) {
		$scope.showMessageFlag = true;
		
		function init() {
			
			$scope.malfunction = angular.copy($stateParams.malfunction) == null ? {} : angular.copy($stateParams.malfunction);
			
			// 分页参数
			var size = Math.round(CommonService.getViewHeight() / 55);
			$scope.pageInfos = {number: 0, size: size};
			
			$scope.deviceList = [];
			$scope.qrcodeFlag = true;
			$scope.searchFlag = true;
			
			if (angular.isUndefined($scope.malfunction.device) || $scope.malfunction.device == null) {
				$scope.action = "select";
				$scope.showDeviceList = false;
			} else {
				$scope.action = "viewDetailFromAdd";
				Device.queryDetailById({id: $scope.malfunction.device.id}, function(response) {
					$scope.device = response;
				});
			}
			
		}
		
		$scope.$on('$viewContentLoaded', function() {
			
			var deviceMescroll = new MeScroll('deviceMescroll', {
				
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
						deviceMescroll.endErr();
					}
				}
				
			});
			
		});

		$scope.$on('mobile-angular-ui.state.changed.deviceList', function(e, newVal, oldVal) {
		    $scope.deviceListFlag = SharedState.isActive('deviceList');
		});
		
		$scope.$on('mobile-angular-ui.state.changed.deviceRemark', function(e, newVal, oldVal) {
			$scope.deviceRemarkFlag = SharedState.isActive('deviceRemark');
		});
		
		$scope.$watch('action', function(newVal, oldVal) {
			if (newVal != 'select') {
				$document.find('.mescroll-upwarp').css('display', 'none');
			}
		});
		
		$scope.prevDevice = function(device) {
			$scope.device = device;
			$scope.action = "viewDetail";
		};
		
		$scope.comfirmDevice = function() {
			 $scope.malfunction.device = $scope.device;
			 $state.go('malfunctions.execute', {malfunction: $scope.malfunction, task: $scope.task});
		}
		
		$scope.back = function() {

			$scope.showDeviceList = true;
			$scope.action = 'select';
			$scope.device = null;
		
		}
		
		// 分页查询
		$scope.search = function(currentPage, condition, mescroll){

			if (!currentPage) {
				currentPage = {num: 0};
				$scope.currentPageInfo = null;
			}
			
			if ($scope.showMessageFlag) {
				blockUI.start();
				Device.get({
					scope:'one',
					page: currentPage.num === 0 ? 0 : $scope.pageInfos.number,
					size: currentPage.size ? currentPage.size : $scope.pageInfos.size,
					queryItem: $scope.condition}, function(response) {
					blockUI.stop();
					$scope.currentPageInfo = response;
					if (mescroll) {
						// 请求成功后关闭加载条
						mescroll.endByPage(response.numberOfElements, response.totalPages);
					}
					if (response.last == false) {
						$scope.pageInfos.number++;
					} else {
						$scope.showMessageFlag = false;
						$timeout(5000).then(function() {
							$scope.showMessageFlag = true;
						});
					}
					refreshContent(response);
				});
			}
			
			// 请求未发起成功， 手动关闭加载条
			if (mescroll) {
				$timeout(2000).then(function() {
					if ($scope.currentPageInfo) {
						mescroll.endByPage($scope.currentPageInfo.numberOfElements, $scope.currentPageInfo.totalPages);
					}
				});
			}
			
			$scope.showDeviceList = true;
			SharedState.turnOn('deviceList');
		
		};
		
		function refreshContent(data) {
			if (angular.isUndefined($scope.deviceList)) {
				$scope.deviceList = [];
			}
			
			if (data.first == true) {
				
				$scope.deviceList = data.content
				
			} else {
				
				angular.forEach(data.content, function(newDevice) {
					var isNotExist = true;
					angular.forEach($scope.deviceList, function(oldDevice) {
						if (oldDevice.id == newDevice.id) {
							isNotExist = false;
						}
					});
					if (isNotExist) {
						$scope.deviceList.push(newDevice);
					}
				});
				
			}

			if ($scope.deviceList.length <= 0) {
				$scope.showNull = true;
			}
			
		}
		
		$scope.nextPage = function() {
			$scope.search($scope.condition);
		}
		
		$scope.hideIcons = function() {
			$scope.qrcodeFlag = false;
		}
		
		$scope.showIcons = function() {
			$scope.qrcodeFlag = true;
		}
		
		// 扫描二维码
		$scope.startQRCode = function() {
			try {
				
				if (typeof(JsInterface) == 'undefined') {
					throw 'undefined';
				}
				JsInterface.startQRCode();
				
			} catch(error) {
				
				if (angular.equals(error, 'undefined')) {
					showMessage('请在app内使用');
				}
			}
			
		};
		
		// 获取二维码数据
		$scope.getQRCode = function(deviceNumber) {
			$scope.malfunction.deviceNumber = deviceNumber;
			$state.go('devices.confirm', {malfunction: $scope.malfunction, from: 'execute'});
		}
		
		// 重新选择设备
		$scope.changeDevice = function() {
			$scope.malfunction.device = null;
			$scope.deviceList = [];
			$scope.showDeviceList = false;
			$scope.action = 'select';
		}
		
		
		init();
	}]);
	
	return mobileApp;
	
}(emmsMobileModule || {}));