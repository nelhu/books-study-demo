/**
 * description - mobile common methods service
 * create - Nelson.Xuezi.Hu
 * date - 2017-10-12
 */
var emmsMobileModule = (function(mobileApp) {
	var emmsMobile = mobileApp.emmsMobile;
	
	emmsMobile.factory('MalfunctionService', ['$http', function($http) {
		
		return {
			convertImg: function(imgId) {
				if (typeof(JsInterface) != 'undefined') {
					var img = {};
					var originalImgStr = JsInterface.getOriginalImage(imgId);
					var originalImg = JSON.parse(originalImgStr);
					img.base64Str = originalImg.data;
					return img;
				}
			},
			getNewMsgCount: function() {
				return $http.get('/amqp/mobile/count');
			}
		}
		
	}]);
	
	emmsMobile.factory('CommonService', ['$window', '$document', function($window, $document) {
		
		return {
			
			getViewHeight: function() {
				
				// 屏幕显示区域高度
				var screenHeight = $window.screen.availHeight;
				
				// 视图区域高度
				var viewHeight = Math.round(screenHeight * 0.9);
				
				return viewHeight;
			},
			
			enableContentPullable: function(contentId) {
				
				var mescroll = new MeScroll(contentId, {
	                
	                up: {
	                    use: false // 不配置上拉
	                },
	                down: {
	                    auto: false, 
	                    htmlContent: '&nbsp;', // 下拉内容设为空
	                    callback: function(ms) {
	                       mescroll.endErr();
	                    }
	                }
	                
	            });
				
				return mescroll;
				
			},
			call: function(phone) { // 打电话
				
				try {
					
					if (typeof(JsInterface) == 'undefined') {
						throw 'undefined';
					}
					JsInterface.startCall(phone);
					
				} catch(error) {
					if (angular.equals(error, 'undefined')) {
						showMessage('请在app内使用');
					}
				}
				
			
			},
			getSelected: function() { // 或许复选框业务对象
				var selected = [];
				var all = $document.find('.checkItem');
				angular.forEach(all, function(obj) {
					if (obj.checked) {
						var valueStr = obj.getAttribute('ng-value');
						var selectedObj = JSON.parse(valueStr);
						selected.push(selectedObj);
					}
				})
				return selected;
			}
		
		}
		
	}]);
	
	// 数据字典service 获取系统可配置参数
	emmsMobile.factory('VehicleConfigurationService', ['Stations', function(Stations) {
		
		return {
			getStations: function() {
				Stations.query(function(response) {
					// response.push({ "id" : "", "name" : "其他"});
					return response;
				});
			}
		}
		
	}]);
	
	
	// mobile异步处理service
	emmsMobile.factory('mobileAsyncService', ['$q', function($q) {
		
		return {
			
			getPromise: function(flag) {
				
				var deferred = $q.defer();
				
				if (flag) {
					deferred.resolve();
				} else {
					deferred.reject();
				}
				
				return deferred.promise;
			}
		
		}
		
	}]);
	
	
	return mobileApp;
}(emmsMobileModule || {}));