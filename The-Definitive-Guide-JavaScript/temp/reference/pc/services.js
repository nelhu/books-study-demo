/**
 * description - 系统常用的工具类服务
 * create - Nelson.Xuezi.hu
 * date - 2017-8-31
 */

var emmsModule = (function(app) {
	var emms = app.emms;
	
	// 日期类服务
	emms.factory('dateService', ['$filter', function($filter){
		
		var now = new Date();
		var mondayGap = now.getDay() - 1;
		var sundayGap = (7 - mondayGap) - 1;
		
		return {
			getMonday: function() { // 获取当前周的周一
				return new Date(new Date().setDate(now.getDate() - mondayGap));
			},
			getSunday: function() { // 获取当前周的周末
				return new Date(new Date().setDate(now.getDate() + sundayGap));
			},
			getDate: function(timeStr) {
				var dt = new Date(timeStr.substr(0, 10));
				return dt;
			},
			getHour: function(timeStr) {
				var hour = timeStr.substr(timeStr.indexOf(' ') + 1, 2);
				if (hour.startsWith('0')) {
					return hour.substr(-1, 1);
				}
				return hour;
			},
			getMinute: function(timeStr) {
				return timeStr.substr(timeStr.indexOf(' ') + 4, 2);
			},
			getMonthBegin: function(year, month) {
				return new Date(year, month, 1)
			},
			getMonthEnd: function(year, month) {
				return new Date(year, month + 1, 0);
			},
			getWeekOfYear: function() {
				  var firstDay = new Date(now.getFullYear(),0, 1);
				  var dayOfWeek = firstDay.getDay(); 
				  var spendDay = 1;
				  if (dayOfWeek != 0) {
				    spendDay = 7 - dayOfWeek + 1;
				  }
				  firstDay = new Date(now.getFullYear(), 0, 1 + spendDay);
				  var d = Math.ceil((now.valueOf() - firstDay.valueOf()) / 86400000);
				  var result = Math.ceil(d / 7);
				  return result + 1;
			},
			getTomorrow:  function() {
				var startMaxDate = $filter("date")(new Date(), 'yyyy-MM-dd HH:mm:ss');
				return $filter("date")(new Date().setDate(new Date().getDate()+1),'yyyy-MM-dd HH:mm:ss');
			}
		};
	}]);
	
	
	
	emms.service('commenModal', ['$uibModal', '$stateParams', 'toastr', function($uibModal,$stateParams, toastr) {
		 
		this.sureStart = function(resource, id) { // 任务id
			
			return $uibModal.open({
			 	backdrop:"static",
	            templateUrl :'/vehicles/applications/template/sureStart',
	            controller : 'CommonSureStartCtrl', 
	            size: 'md',
	            resolve : {
	    	 		param : function() {
	                    return angular.copy({resource: resource, id: id});         
	                 }
	              }
          })
			
		}
		
		// 只有提供模板的确认对话框
		this.sureStartOnlyModal = function(resource, id) { // 任务id
			
			return $uibModal.open({
			 	backdrop:"static",
	            templateUrl :'/vehicles/applications/template/sureStart',
	            controller : ['$scope', function($scope) {
					$scope.start = function() {
						$scope.$close('confirm');
					}
					
					$scope.dismiss = function() {
						$scope.$dismiss("cancel");
					}
					
				}], 
	            size: 'md',
	            resolve : {
	    	 		param : function() {
	                    return angular.copy({resource: resource, id: id});         
	                 }
	              }
          })
			
		}
		
		// 选择调度部门控制器
		this.selectAssignDept = function() {
			
			return $uibModal.open({
				backdrop:"static",
				templateUrl :'/malfunctions/template/assignDept',
				controller : 'MalfunctionSelectAssignDeptCtrl', 
				size: 'md'
			})
			
		}
	
		//人员详细信息
		  this.staffBaseInfoModal=function(staffId){
			return 	$uibModal.open({
						backdrop:"static",
				    	templateUrl: "/system/staffs/staffBaseInfo",
				    	controller: 'StaffBaseInfoModalCtrl',
				    	resolve:{
				    		header : function() { 
				    			return angular.copy(staffId); 
				    		}
				    	}
			    	})
		    }
		 
		  //设备详情
		 this.deviceDetailModel=function(deviceId){
			 return $uibModal.open({
					 	backdrop:"static",
			            templateUrl :'/devices/show/details',
			            controller : 'DeviceDetailsCtrl', 
			            resolve : {
			    	 		id : function() {
			                    return angular.copy(deviceId);         
			                 }
			              }
		          })
		 }
		
		 // 打开地图模态框
		 this.viewMapModel= function(params,ctrl){
	    	return $uibModal.open({
			    		backdrop:"static",
				        templateUrl: "/maps",
				        controller: ctrl,
				        windowClass:'mapSize',
				        resolve: {
				        	params: function() {return params;}
				        }
		    	})
	    }
		 
		// 图片预览
		this.previewPicture = function(index, images) {
			return $uibModal.open({
				    	backdrop:"static",
				        templateUrl: "/images/preview",
				        controller: "PreviewPictureCtrl",
				        resolve: {
				        	params : function() {
				        		return {
				        			images: images,
				        			active: index,
				        		};
				        	}
				        }, 
			    });
			};
			
			
	  // 图片预览
	  this.MalfunctionImageView = function(objectId, img, ctrl, data) {	
			$uibModal.open({
		    	backdrop:"static",
		        templateUrl: "/images/preview",
		        controller: ctrl,
		        resolve: {
		        	 params: function() {
			        		return {
			        			objectId: objectId,
			        			img: img,
			        			data: data
			        		};
			         }
		        }
		    });
	  }
			
		// 删除
		this.deleted = function(instance, flag, ctrl){
			return $uibModal.open({
						templateUrl: '/home/commonDelete',
						controller: ctrl,
						backdrop: 'static',
						animation: true,
						size: 'sm',
						resolve: {
							instance: function() {
								      return instance;
								},
							flag: function() {
									return flag;
							}
						}
			});
		}
		
		this.deleted1 = function(Resource, id) {
			return $uibModal.open({
						templateUrl: '/home/commonDelete',
						controller: ['$scope', Resource, function($scope, Resource) {
							$scope.confirm = function() {
								Resource.delete({id: id},function(response){
									$scope.$close(response);
								}, function(response) {
									$scope.$dismiss("failed");
								})
							}
							$scope.cancel = function() {
								$scope.$dismiss("cancel");
							}
						}],
						backdrop: 'static',
						animation: true,
						size: 'sm',
			});
		}
		
		// 只提供删除的确认对话框
		this.sureDeleteOnlyPrompt = function() {
			
			return	$uibModal.open({
			 	backdrop:"static",
	            templateUrl :'/home/commonDelete',
	            controller : ['$scope', function($scope) {
					$scope.confirm = function() {
						$scope.$close('confirm');
					}
					
					$scope.cancel = function() {
						$scope.$dismiss("cancel");
					}
					
				}], 
	            size: 'sm',
	      });
		}
		
		// 只提供确认信息对话框
		this.onlyPrompt = function(content) {
			
			return	$uibModal.open({
				backdrop:"static",
				templateUrl :'/home/promptNoInput',
				controller : ['$scope', function($scope) {
					
					$scope.content = content;
					
					$scope.confirm = function() {
						$scope.$close('confirm');
					}
					
					$scope.cancel = function() {
						$scope.$dismiss("cancel");
					}
					
				}], 
				size: 'sm',
			});
		}
		
		// 无用户处理任务对话框
		this.noAssignee = function() {
			
			return	$uibModal.open({
				backdrop:"static",
				templateUrl :'/home/noAssignee',
				controller : ['$scope', function($scope) {
					$scope.confirm = function() {
						$scope.$close('confirm');
					}
				}], 
				size: 'sm',
			});
		}

		
		// 打开模态框
		/**
		 * templateUrl: 模板路径
		 * ctrl: 控制器
		 * size: 模态框的尺寸
		 * param: 参数
		 */
		this.openModal = function(templateUrl, ctrl, size, param) {
			
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
			});
			
			return uibModalInstance;
			
		}
		
		// 提示输入
		this.prompt = function(params) {
			
			var uibModalInstance = $uibModal.open({
				backdrop:"static",
				templateUrl: '/home/prompt',
				controller: ['$scope', function($scope) {
					
		        	$scope.prompt = params.prompt;
		        	$scope.label = params.label;
		        	
		        	$scope.dismiss = function() {
		        		$scope.$dismiss();
		        	};
		        	
		        	$scope.confirm = function() {
		        		if ($scope.form.$invalid) {
		        			$scope.form.$setSubmitted();
		        		} else {
		        			$scope.$close($scope.reason);
		        		}
		        	};
		        }],
				size: 'sm'
			});
			
			return uibModalInstance;
			
		}
		
		// 打开车辆详情模态框
		this.viewVehicleModel = function(id){
			
			return 	$uibModal.open({
				backdrop: 'static',
		    	templateUrl: '/vehicles/template/view',
		    	controller: 'CarEditCtrl',
		    	resolve:{
					param : function() { 
						return angular.copy({id: id});  
					}
				}
	    	})
         }
		
		// 查看车辆申请单
		this.viewVehicleApplicationModel = function(param){
			
			return 	$uibModal.open({
				backdrop: 'static',
		    	templateUrl: '/vehicles/applications/template/view',
		    	resolve: {
					param: function() {
						return angular.copy(param);
					}
		    	},
		    	controller: 'VehicleApplicationsCtrl'
	    	})
         }
		
		// 选择员工模态框
		this.selectStaffModel = function(param){
			
			var uibModalInstance = $uibModal.open({
				templateUrl: "/system/depts/staffModel",
				controller: 'DeptAndStaffModalCtrl',
				backdrop: 'static',
				size:'lg',
				resolve:{
					param : function() { 
						return angular.copy(param ? param : {});  
					}
				}
			});
			
			return uibModalInstance;
			
		}
		
		// 查看检修计划
		this.viewMaintenanceSchedule = function(id) {
			var uibModalInstance = $uibModal.open({
				templateUrl: "/maintenanceSchedules/template/edit",
				controller: 'MaintenanceScheduleCtrl',
				backdrop: 'static',
				size:'lg',
				resolve:{
					param : function() { 
						return angular.copy({id: id, action: 'view'});  
					}
				}
			});
			
			return uibModalInstance;
		}
		
		// 查看故障单
		this.viewMalfunction = function(id) {
			var uibModalInstance = $uibModal.open({
				templateUrl: "/malfunctions/template/view",
				controller: 'ViewMalfunctionFlowCtrl',
				backdrop: 'static',
				size:'lg',
				resolve:{
					param : function() { 
						return {id: id};  
					}
				}
			});
			
			return uibModalInstance;
		}
		
		// 查看检修项目
		this.viewMaintenanceProcedureContent = function(id) {
			var uibModalInstance = $uibModal.open({
				templateUrl: "/maintenanceProcedure/maintenanceProcedureContents/template/viewContent",
				controller: 'MaintenanceProcedureContentViewCtrl',
				backdrop: 'static',
				size:'lg',
				resolve:{
					param : function() { 
						return angular.copy({id: id});  
					}
				}
			});
			
			return uibModalInstance;
		}
		
	  }]);
	
	emms.service('CommonFunction', ['$window', '$document', 'toastr', function($window, $document, toastr) {
		
		return {
			
			/**
			 * description 获取选中的复选框
			 */
			getSelected: function() {
				var selected = [];
				var current_multile_select_table_element = $document.find('.table-multiple-select')[0];
				var all = angular.element(current_multile_select_table_element).find('.checkItem');
				angular.forEach(all, function(obj) {
					if (obj.checked && !obj.disabled) {
						var valueStr = obj.getAttribute('ng-value');
						var selectedObj = JSON.parse(valueStr);
						selected.push(selectedObj);
					}
				})
				return selected;
			},
			/**
			 * description 选中所有复选框
			 */
			selectAllCheckbox: function(selected) {
				var all = $document.find('.checkItem');
				var hasItemSelected;
				if (selected) {
					angular.forEach(all, function(obj) {
						obj.checked = true;
					})
				} else {
					angular.forEach(all, function(obj) {
						obj.checked = false;
					})
				}
				
				if (all.length > 0 && selected) {
					hasItemSelected = true;
				} else {
					hasItemSelected = false;
				}
				
				return hasItemSelected;
			},
			
			promptWithBackendMsg: function(response) {

				var errorMsg;
				if (response.errorMsg || (response.data && response.data.errorMsg)) {
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
				}
			
			
			}
			
		}
		
	}]);
	
	return app;
}(emmsModule || {}));

