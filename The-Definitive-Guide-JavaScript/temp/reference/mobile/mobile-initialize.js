/**
 * description - mobile related initialize operation
 * create - Nelson.Xuezi.Hu
 * date - 2017-11-4
 */
var emmsMobileModule = (function(mobileApp, emmsLib) {
	var emmsMobile = mobileApp.emmsMobile;
	
	// 初始化全局数据
	emmsMobile.run(['$window', '$rootScope', '$state' ,'SharedState', 'Malfunction', 'UserInfo', '$templateCache', '$http',
		function($window, $rootScope, $state, SharedState, Malfunction, UserInfo, $templateCache, $http){
		
		// 触发ui-router
		$rootScope.$on('$stateChangeStart', function(){
			$rootScope.broadcast('$routeChangeStart');
		});
		
		// 初始化部分模板
		function initTemplate() {
			var quickaddTpl, addTpl;;

			$http.get('/mobile/malfunctions/quickadd').then(function(response) {
				quickaddTpl = response.data;
				$templateCache.put('quickadd.tpl', quickaddTpl);
			});
		
			$http.get('/mobile/malfunctions/edit').then(function(response) {
				addTpl = response.data;
				$templateCache.put('add.tpl', addTpl);
			});
		}
		initTemplate();
		
		// 全局Icon
		$rootScope.icons = {
				numIcon: 'fa fa-book',
				nameIcon: 'fa fa-bookmark',
				levelIcon: 'fa fa-exchange',
				userIcon: 'fa fa-user',
				dateIcon: 'fa fa-calendar',
				malfunctionIcon: 'fa fa-puzzle-piece',
				resonIcon: 'fa fa-question-circle',
				locationIcon: 'fa fa-map-marker',
				descriptionIcon: 'fa fa-commenting-o',
				remarkIcon: 'fa fa-pencil-square-o',
				statusIcon: 'fa fa-lightbulb-o',
				cameraIcon: 'fa fa-camera-retro',
				deptIcon: 'fa fa-building'
		};
		
		// 模态框变量初始化
		SharedState.initialize($rootScope, 'MalfunctionImgView');
		SharedState.initialize($rootScope, 'MalfunctionUploadedImgView');
		SharedState.initialize($rootScope, 'MalfunctionNewImgView');
		SharedState.initialize($rootScope, 'AllMalfunctionImgView');
		SharedState.initialize($rootScope, 'deviceList');
		SharedState.initialize($rootScope, 'logoutOptions');
		SharedState.initialize($rootScope, 'MalfunctionMapNearNumber');
		SharedState.initialize($rootScope, 'emergencyGroupStaffDetail');
		SharedState.initialize($rootScope, 'JobOrderAllStatusFilter');
		
		// 大图预览
		$rootScope.previewImage = function(imgId, imgs) {
			$rootScope.selectedImg = imgId;
			   SharedState.turnOn('MalfunctionImgView');
		};
		
		// 中心位置坐标
//		$rootScope.centerPoint = {
//			longitude: '106.502387',
//			latitude: '29.634582',
//			type: 'outdoor'
//		};
		
		// App端获取当前位置
		$rootScope.getCurrentLocation = function() {
			
			try {
				
				if (typeof(JsInterface) == 'undefined') {
					throw 'undefined';
				}
				
				 var locationStr =  JsInterface.getUserLocation();
				 var locationObj = JSON.parse(locationStr);
				 var location = locationObj.location;
				 location.poi = (locationObj.address != null && locationObj.address != '') ? locationObj.address : '';
				 location.type = locationObj.onroute ? 'route' : 'outdoor';
				 return location;
				
			} catch(error) {
				
				if (angular.equals(error, 'undefined')) {
					showMessage('请在app内使用');
				}
			}
			
		}
		
		// 用户信息
		UserInfo.get(function(response) {
			$rootScope.user = response.user;
			$rootScope.userType = response.type;
		});
		   
		// 故障导航
		$rootScope.toNavigate = function(destination) {
			JsInterface.startNavi(destination);
		};
		
		// 监视网络情况
		$rootScope.online = $window.navigator.onLine;
		$window.addEventListener('online', function() {
			$rootScope.$apply(function() {
				$rootScope.online = true;
			});
		});
		
		$window.addEventListener('offline', function() {
			$rootScope.$apply(function() {
				$rootScope.online = false;
			});
		});
		$rootScope.$watch('online', function(newVal, oldval) {
			if (newVal == false) {
				showMessage('网络连接失败,请稍后重试');
			}
		});
		
	}]);
	
	// App框架控制器
	emmsMobile.controller('AppCtrl', ['$scope','$document', '$http', 'mobileAsyncService', 'AmqpMsg', '$state', 'SweetAlert',
		function($scope, $document, $http, mobileAsyncService, AmqpMsg, $state, SweetAlert) {
		
		$scope.newMsgCount = 0;
		
		function init() {
			
			var malfunctionElement = $document.find('#malfunction');
			malfunctionElement.css('color', '#007aff');
			malfunctionElement.css('font-size', 'larger');
			
		}
		
		// active样式
		$scope.activeStyle = function(key) {

			// 清除消息提示
			clearHint(key);
			
			var malfunctionElement = $document.find('#malfunction');
			var vehicleElement = $document.find('#vehicle');
			var jobOrderElement = $document.find('#jobticket');
			var patrolElement = $document.find('#patrol');
			var meElement = $document.find('#me');
			
			if(key == 'malfunction') {
				
				meElement.css('color', 'gray');
				meElement.css('font-size', 'unset');
				vehicleElement.css('color', 'gray');
				vehicleElement.css('font-size', 'unset');
				jobOrderElement.css('color', 'gray');
				jobOrderElement.css('font-size', 'unset');
				patrolElement.css('color', 'gray');
				patrolElement.css('font-size', 'unset');
				
				malfunctionElement.css('color', '#007aff');
				malfunctionElement.css('font-size', 'larger');
				
			} else if (key == 'vehicle') {
				
				meElement.css('color', 'gray');
				meElement.css('font-size', 'unset');
				malfunctionElement.css('color', 'gray');
				malfunctionElement.css('font-size', 'unset');
				jobOrderElement.css('color', 'gray');
				jobOrderElement.css('font-size', 'unset');
				patrolElement.css('color', 'gray');
				patrolElement.css('font-size', 'unset');
				
				vehicleElement.css('color', '#007aff');
				vehicleElement.css('font-size', 'larger');
				
			} else if (key == 'jobticket') {
				
				meElement.css('color', 'gray');
				meElement.css('font-size', 'unset');
				malfunctionElement.css('color', 'gray');
				malfunctionElement.css('font-size', 'unset');
				vehicleElement.css('color', 'gray');
				vehicleElement.css('font-size', 'unset');
				patrolElement.css('color', 'gray');
				patrolElement.css('font-size', 'unset');
				
				jobOrderElement.css('color', '#007aff');
				jobOrderElement.css('font-size', 'larger');
				
			} else if (key == 'patrol') {
				
				meElement.css('color', 'gray');
				meElement.css('font-size', 'unset');
				malfunctionElement.css('color', 'gray');
				malfunctionElement.css('font-size', 'unset');
				vehicleElement.css('color', 'gray');
				vehicleElement.css('font-size', 'unset');
				jobOrderElement.css('color', 'gray');
				jobOrderElement.css('font-size', 'unset');
				
				patrolElement.css('color', '#007aff');
				patrolElement.css('font-size', 'larger');
				
			} 
			else {
				
				malfunctionElement.css('color', 'gray');
				malfunctionElement.css('font-size', 'unset');
				vehicleElement.css('color', 'gray');
				vehicleElement.css('font-size', 'unset');
				jobOrderElement.css('color', 'gray');
				jobOrderElement.css('font-size', 'unset');
				patrolElement.css('color', 'gray');
				patrolElement.css('font-size', 'unset');
				
				meElement.css('color', '#007aff');
				meElement.css('font-size', 'larger');
				
			}
		}
		
		
		// 清除消息提示
		function clearHint(key) {
			if ($scope.msg) {
				if (key == $scope.msg.category) {
					$scope.msg = {};
				}
			}
		}
		
		// 提醒消息
		$scope.hint = function(msg) {
			
			// 消息红点提示
			$scope.msg = msg;
			
			// 处于任务列表页时就刷新
			if ($state.$current.name.endsWith('list')) {
	    		$scope.$broadcast('refreshTaskCounts', {key: '', value: ''});
	    	}
			
			$scope.$apply();
		}
		
		// 读取手机端通知栏故障任务消息并跳转
		$scope.readMalfunctionTaskMsg = function(msgObj) {
			
			if (msgObj.amqpMessageDTO != null) {
				
				// 消息是否已读
				$http.get('/malfunctions/isExist/' + msgObj.amqpMessageDTO.relateId)
				.then(function(response) {
					
					if (!response.data) {
						SweetAlert.swal({
							title: '当前任务已处理',
							text: '可查看其他任务',
							type: 'success'
						});
						$state.go('malfunctions.list');
						return ;
						
					} else {
						
						mobileAsyncService.getPromise(true)
						.then(function() {
							
							// 将消息设为已读
							AmqpMsg.read({id: msgObj.amqpMessageDTO.id});
							
						})
						.then(function() {
							
							// 更新消息数量
//							$http.get('/amqp/mobile/count')
//					        .success(function(data) {
//							    $scope.newMsgCount = data.count;
//							    $scope.isEmergency = data.isEmergency;
//					        });
							
						})
						.then(function() {
							
							// 跳转到任务执行页面
							$state.go('malfunctions.execute', {taskId: msgObj.amqpMessageDTO.relateId});
						});
						
					}
				});
				
			}
			
		}
		
		$scope.test1 = function() {
			
			
		}
		
		init();
		
	}]);
	
	// http拦截器
	emmsMobile.factory('EmmsAsyncInterceptor', ['$window', '$log', '$rootScope', '$q', 'blockUI', 'mobileAsyncService', '$timeout',
		function($window, $log, $rootScope, $q, blockUI, mobileAsyncService, $timeout) {
		
		var showMessageFlag = true;
		
		return {
			
			// 请求前处理
			request: function(config) {
				
				var flag = true;
				var deferred = $q.defer();
				
				mobileAsyncService.getPromise(true)
				.then(function() {
					
					// 检查网络情况
					if (flag && !$rootScope.online) {
						blockUI.stop();
						if (showMessageFlag) {
							showMessage('网络连接失败,请稍后重试');
							showMessageFlag = false;
							$timeout(5000).then(function() {
								showMessageFlag = true;
							});
						}
						flag = false;
					};
					
				})
				.then(function() {
					
					// 检查发送到服务器的参数中是否包含表情字符
					var emojiRegExp = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
					if (emojiRegExp.test(JSON.stringify(config.data))) {
						showMessage('不能包含表情哦');
						flag = false;
					}
					
				})
				.then(function() {
					
					// 传递请求
					if (flag) {
						deferred.resolve(config)
					} else {
						deferred.reject(config)
					}
					
				});
				
				return deferred.promise;
			},
			
			// 获取响应后处理
			response: function(response) {
				blockUI.stop();
				return $q.resolve(response);
				
			},
			
			// 请求失败处理
			requestError: function(reason) {
				blockUI.stop();
				return $q.reject(reason);
				
			},
			
			// 响应失败处理
			responseError: function(response) {
				
				if (response.status >= 500 && response.status <= 505) {
					showMessage('请稍后重试');
				} else if (response.status == -1){
					showMessage('请稍后重试');
				} else if (response.status == 400) {
					
					// 统一处理后台DTO校验错误
					if (response.data.errors) {
						showMessage(response.data.errors[0].defaultMessage);
					}
					
				} else if(response.status === 404){
	            	  $timeout(1000).then(function() {
	            		$window.location.href = '/';
	            	  });
				} else if (response.status === 401) {
					$window.location.href = '/loginPage';
					// session失效， 关掉APP服务
					JsInterface.sessionInvalid();
				} else {
					// 不处理
				}
				blockUI.stop();
				return $q.reject(response);
				
			}
			
		}
		
	}]);
	
	
	
	return mobileApp;
}(emmsMobileModule || {}, emmsLib || {}));