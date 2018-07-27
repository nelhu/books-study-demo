/**
 * description - resolve malfunctions mobile related operation
 * create - Nelson.Xuezi.Hu
 * date - 2017-9-15
 */
var emmsMobileModule = (function(mobileApp) {
	var emmsMobile = mobileApp.emmsMobile;
	
	// 与我相关
	emmsMobile.controller('AboutMeMobileCtrl', ['$scope', '$state', 'SharedState', 'UserInfo', 'CommonService',
		function($scope, $state, SharedState, UserInfo, CommonService) {
		
		$scope.ctrl = "AboutMeMobileCtrl";
		
		var mescroll;
		$scope.$on('$viewContentLoaded', function() {
			
			// 内容区域可滑动实例
			mescroll = CommonService.enableContentPullable('aboutMeScroll');

		});
		
		$scope.$on('$destroy', function() {
			
			// 销毁滑动实例
			mescroll.destroy();
		});
		
		UserInfo.getLoginName(function(result){
			$scope.userName = result.username;
		})
		
		$scope.toMyDetail = function() {
			$state.go('self.detail');
		};
		$scope.messageIcon = "fa fa-comment-o";
		$scope.fixRecordIcon = "fa fa-calendar";
		$scope.settingIcon = "fa fa-gear";
	
		$scope.toSettings = function() {
			$state.go('settings.menu');
		}
		
		$scope.exitApp = function() {

			try {
				
				if (typeof(JsInterface) == 'undefined') {
					throw 'undefined';
				}
				JsInterface.exitApp();
				
			} catch(error) {
				
				if (angular.equals(error, 'undefined')) {
					showMessage('请在app内使用');
				}
			}
			
		
		}
		
	}]);
	
	// 个人详细信息
	emmsMobile.controller('MyDetailMobileCtrl', ['$scope', 'UserInfo', 'SharedState', 'CommonService',
		function($scope, UserInfo, SharedState, CommonService) {
		
		$scope.ctrl = "MyDetailMobileCtrl";
		
		var mescroll;
		$scope.$on('$viewContentLoaded', function() {
			
			// 内容区域可滑动实例
			mescroll = CommonService.enableContentPullable('myDetailMescroll');

		});
		
		$scope.$on('$destroy', function() {
			
			// 销毁滑动实例
			mescroll.destroy();
		});
		
		$scope.$on('mobile-angular-ui.state.changed.userLevels', function(e, newVal, oldVal) {
		    $scope.userLevelsFlag = SharedState.isActive('userLevels');
		});
		
		$scope.$on('mobile-angular-ui.state.changed.userRoles', function(e, newVal, oldVal) {
		    $scope.userRolesFlag = SharedState.isActive('userRoles');
		});
		
		$scope.$on('mobile-angular-ui.state.changed.userMagScopes', function(e, newVal, oldVal) {
		    $scope.userMagScopesFlag = SharedState.isActive('userMagScopes');
		});
		
		$scope.$on('mobile-angular-ui.state.changed.userSpecialties', function(e, newVal, oldVal) {
		    $scope.userSpecialtiesFlag = SharedState.isActive('userSpecialties');
		});
		
		
	}]);
	
	
	// 设置
	emmsMobile.controller('UserSettingsMobileCtrl', ['$scope', 'UserInfo', '$state', 'CommonService',
		function($scope, UserInfo, $state, CommonService) {
		
		$scope.ctrl = "UserSettingsMobileCtrl";
		
		var mescroll;
		$scope.$on('$viewContentLoaded', function() {
			
			// 内容区域可滑动实例
			mescroll = CommonService.enableContentPullable('settingsMescroll');

		});
		
		$scope.$on('$destroy', function() {
			
			// 销毁滑动实例
			mescroll.destroy();
		});
		
		$scope.toUpdatePassword = function() {
			$state.go('settings.password');
		}
		
	}]);
	
	// 修改密码
	emmsMobile.controller('UpdatePassMobileCtrl', ['$scope', 'UserInfo', '$state', 'SweetAlert', '$location', '$window', 'CommonService',
		function($scope, UserInfo, $state, SweetAlert, $location, $window, CommonService) {
		$scope.ctrl = "UpdatePassMobileCtrl";
		
		var mescroll;
		$scope.$on('$viewContentLoaded', function() {
			
			// 内容区域可滑动实例
			mescroll = CommonService.enableContentPullable('updatePwdMescroll');

		});
		
		$scope.$on('$destroy', function() {
			
			// 销毁滑动实例
			mescroll.destroy();
		});
		
		$scope.backToMenu = function() {
			$state.go('settings.menu');
		};
		
		$scope.updatePassword = function(form) {
			if (angular.isUndefined($scope.pwd) || angular.isUndefined($scope.confirmedPwd) 
					|| (form.pwd.$invalid) || (form.confirmedPwd.$invalid)) {
				SweetAlert.swal({
					title: '请输入正确格式的密码 ',
					type: 'error'
				});
			} else {
				
				if (!angular.equals($scope.pwd, $scope.confirmedPwd)) {
					SweetAlert.swal({
						title: '两次密码不一致 ',
						text: '请确认输入',
						type: 'error'
					});
				}  else {
					UserInfo.updatePassword({simplePwd : $scope.pwd}, function(response) {
						debugger;
						if (response.$status == 201) {
							 SweetAlert.swal({
									title: '更新成功',
									text: '请重新登录',
									type: 'success'
								}, function(isConfirmed) {
									if (isConfirmed) {
										// 重定向到登陆页面
										$window.location.href = $window.location.origin + '/loginPage';
									}
								});
						} else {
							showMessage('请稍后重试');
						}
					});
				}
			}
		}
		
	}]);
	
	return mobileApp;
}(emmsMobileModule || {}));