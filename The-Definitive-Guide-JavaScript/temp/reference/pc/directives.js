/**
	 * description - 单独日期选择框指令，默认参数
	 * create - Nelson.Xuezi.hu
	 * date - 2017-8-23
	 */
var emmsModule = (function(app) {
	var emms = app.emms;
	
	emms.directive('repeatFinish',function($timeout){
		return {
			restrict: 'A',
			link : function(scope,element,attr){
				if(scope.$last == true){
					 $timeout(function() {
						 scope.$eval(attr.repeatFinish)
					 });
				}
			}
		}
	});

	emms.directive('emmsSingleDatepicker', [function() {
		
		return {
			restrict: 'AE',
			replace: false,
			template: 
			`<div class="single-datepicker">
				<span ng-model="dateValue" name="{{formFieldName}}" required></span>
				<div class="input-group input-group-xs">
					<input type="text" class="form-control" uib-datepicker-popup="{{'yyyy-MM-dd'}}" ng-model="date" is-open="opened" on-open-focus="false"  id="date"
						clear-text="清空" current-text="今天" ng-required="formFieldName ? true : false" close-text="关闭" ng-click="open()" ng-change="transformDate()" placeholder="{{holder}}" datepicker-options="dateOptions"/>
					<span class="input-group-addon" ng-click="open()">
						<i class="glyphicon glyphicon-calendar"></i>
					</span>
				</div>
			</div>`,
			scope: {
				dateValue: '=ngModel',
				holder: '@placeholder',
				minDate: '=minDate',
				maxDate: '=maxDate',
				formFieldName: '@'
			},
			controller: ['$scope', '$filter', function($scope, $filter) {
				 $scope.altInputFormats = ['yyyy-M!-d!'];
				 $scope.open = function() {
					 $scope.dateOptions = {
						minDate: $scope.minDate,
				    	maxDate: new Date(2099, 12, 30)
				  	};
					 if($scope.maxDate){
						 $scope.dateOptions.maxDate = new Date($scope.maxDate);
					 }
	    			$scope.opened = true;
	 			 };
	 			 $scope.transformDate = function() {
	 				 if ($scope.date) {
	 					 $scope.dateValue = $filter('date')($scope.date, 'yyyy-MM-dd HH:mm:ss').substr(0, 10) + ' 00:00:00';
	 				 } else {
	 					 $scope.dateValue = '';
	 				 }
	    		 };
	    		 $scope.$watch('dateValue', function(newVal, oldVal) {
	    			 if (angular.isUndefined(newVal) || newVal == null || newVal == '') {
	    				 $scope.date = null;
	    			 } else {
	    				 $scope.date = new Date(newVal.substr(0, 10));
	    			 }
	    		 });
	    		 
			}]
		}
	}]);
	
	emms.directive('emmsDatetimepicker', ['dateService', function(dateService) {
		
		return {
			restrict: 'AE',
			replace: false,
			template: ` 
				<div class="form-inline" style="text-align: left;">	
						<span ng-model="datetimeValue" name="{{formFieldName}}" required></span>
						<div class="form-group">
							<label class="sr-only" for="date">date</label>
								<div class="input-group">
								<span class="input-group-addon" ng-click="open()">
		            				<i class="glyphicon glyphicon-calendar"></i>
								</span>
								<input type="text" class="form-control" uib-datepicker-popup="yyyy-MM-dd" ng-model="single" is-open="opened" id="date"
									clear-text="清空" current-text="今天" datepicker-options="dateOptions" ng-required="true" close-text="关闭" ng-change="transformTime()" ng-click="open()" placeholder="{{holder}}" style="width:120px"/>
							</div>
							<label class="sr-only" for="hour">hour</label>
							<div class="input-group" style="margin-left: -5px">
								<select id="hour" ng-model="hour"  ng-options="hour for hour in hours" ng-change="transformTime()" placeholder="小时" class="form-control" style="width:70px"></select>
								<div class="input-group-addon">时</div>
							</div>
							<label class="sr-only" for="minute">minute</label>
							<div class="input-group" style="margin-left: -5px">
								<select ng-model="minute" ng-options="minute for minute in minutes" ng-change="transformTime()" placeholder="分钟" class="form-control" style="width:70px"></select>
								<div class="input-group-addon">分</div>
							</div>
						</div>
						<span style="margin-left: 2px" class="form-field-validation-sty" ng-if="showerror">填写时间</span>
						<span style="margin-left: 2px" class="form-field-validation-sty" ng-if="!datetimeValue && showDetailMsg">{{detailMsg}}</span>
					</div>
					<br/>
			`,
			scope: {
				datetimeValue: '=ngModel',
				defaultTime: '@defaultime',
				minDate: '=minDate',
				maxDate: '=maxDate',
				holder: '@placeholder',
				showerror: '@showerror',
				hour: '@hour',
				minute: '@minute',
				formFieldName: '@'
			},
			controller: ['$scope', '$filter', 'dateService', '$element', function($scope, $filter, dateService, $element) {
				 $scope.altInputFormats = ['yyyy-M!-d!'];
				 $scope.open = function() {
					 $scope.dateOptions = {
						minDate: $scope.minDate,
				    	maxDate: new Date(2099, 12, 30)
				  	};
					 if($scope.maxDate){
						 $scope.dateOptions.maxDate = new Date($scope.maxDate);
					 }
					if ($element[0].attributes.hasOwnProperty('min-date') && ($scope.minDate == undefined || $scope.minDate == null)) {
						$scope.opened = false;
						$scope.showDetailMsg = true;
						$scope.detailMsg = '请选择开始时间';
						
					} else {
						$scope.opened = true;
					}
	    			
	 			 };
	   			 $scope.transformTime = function() {
	   				 if ($scope.datetimeValue) {
	   					$scope.datetimeValue = null;
	   				 }
	   				 if (checkHourMinute()) {
	   					$scope.datetimeValue = buildSelectedTime();
		   			 	$scope.showerror = false;
	   				 }
	   			 };
	   			 function checkHourMinute(){
	   				 if (angular.isUndefined($scope.single) ||angular.isUndefined($scope.hour) || angular.isUndefined($scope.minute)) {
	   					$scope.showerror = true;
	   					return false;
	   				 }
	   				 if ($element[0].attributes.hasOwnProperty('min-date') && $scope.minDate) {
	   					var tempTime = buildSelectedTime();
	   					if (tempTime.localeCompare($scope.minDate) <= 0) {

							$scope.showDetailMsg = true;
							$scope.detailMsg = '需大于' + $scope.minDate;
								
	   						$scope.hour = '';
	   						$scope.minute = '';
	   						return false;
	   					}
	   				 }
	   				 return true;
	   			 };
	   			 
	   			 function buildSelectedTime() {
	   				var dateValue = $filter('date')($scope.single, 'yyyy-MM-dd');
	   				if($scope.hour == "") {
	   					$scope.hour = "0";
	   				}
	   				var hourValue = $scope.hour < 10 ? '0' + $scope.hour : $scope.hour;
	   				if($scope.minute == "") {
	   					$scope.minute = "00";
	   				}
	   			 	var minuteValue = $scope.minute;
	   			 var hehe = '' + dateValue + ' ' + hourValue + ':' + minuteValue + ':00';
	   			 	return hehe;
	   			 }
	   			 
	   			 $scope.hours = [];
	   			 $scope.minutes = ['00', '15', '30', '45'];
	   			 function hours() {
	   				 for (var i = 0; i <= 23; i++) {
	   					$scope.hours.push("" + i);
	   				 }
	   			 }
	   			hours();
	   			
	   			// 显示默认时间
	   			$scope.$watch('defaultTime', function() {
	   				showDefaultTime();
	   			});
	   			function showDefaultTime() {
	   				if (!angular.isUndefined($scope.defaultTime)) {
	   					$scope.single = dateService.getDate($scope.defaultTime);
	   					$scope.hour = dateService.getHour($scope.defaultTime);
	   					$scope.minute = dateService.getMinute($scope.defaultTime);
	   				}
	   			};
	   			
			}]
		}
	}]);
	
	
	emms.directive('emmsSingleDaypicker', [function() {
		
		return {
			restrict: 'AE',
			replace: false,
			template: 
			`<div>
				<span class="input-group input-group-xs" style="width:200px;margin:0 auto;">
					<input type="text" class="form-control" uib-datepicker-popup="{{'yyyy-MM-dd'}}" ng-model="date" is-open="opened"  id="date"
						clear-text="清空" current-text="今天" ng-required="true" close-text="关闭" ng-click="open()" ng-change="transformDate()" placeholder="{{holder}}" datepicker-options="dateOptions"/>
					<span class="input-group-addon">
						<i class="glyphicon glyphicon-calendar" ng-click="open()"></i>
					</span>
				</span>
			</div>`,
			scope: {
				dateValue: '=ngModel',
				holder: '@placeholder',
				minDate: '=minDate',
			},
			controller: ['$scope', '$filter', function($scope, $filter) {
				 $scope.altInputFormats = ['yyyy-M!-d!'];
				 $scope.open = function() {
					 $scope.dateOptions = {
						minDate: $scope.minDate,
				    	maxDate: new Date(2099, 12, 30)
				  	};
	    			$scope.opened = true;
	 			 };
	 			 $scope.transformDate = function() {
	    			 $scope.dateValue = $filter('date')($scope.date, 'yyyy-MM-dd');
	    		 };
	    		 $scope.$watch('dateValue', function(newVal, oldVal) {
	    			 if (angular.isUndefined(newVal) || newVal == null || newVal == '') {
	    				 $scope.date = null;
	    			 } else {
	    				 $scope.date = new Date(newVal.substr(0, 10));
	    			 }
	    		 });
	    		 
			}]
		}
	}]);	
	
	
	emms.directive('select2PageSearchShow', [function() {
        function link(scope, element) {
        	var deviceId = scope.id;
            element.select2({
            	language: "zh-CN",
                delay: 500,
            	ajax: {
            		url: 'baseMaterialInfos/materialNames',
            	    dataType: 'json',
            	    data: function(params) {
            	    
            	    	return {
            	    	    name: params.term, 
                            pagesize: 10,  
                            page: params.page
            	    	}
            	    },
            	    processResults: function (data, params) {
                        params.page = params.page || 1;
                    	angular.forEach(data.content, function(node){
            	    		node.text = node.name;
            	    	})
                        return {
                            results: data.content,
                            pagination: {
                                more: (params.page * 10) < data.totalElements
                            }
                        };
                    }
            	}
            });
          }
          return {
            restrict: 'A',
            link: link
          };
	}]);	
	
	emms.directive('select2PageSearch', [function() {
        function link(scope, element) {
            element.select2({
            	language: "zh-CN",
                delay: 500,
            	ajax: {
            		url: 'baseMaterialInfos/materialNames/type',
            	    dataType: 'json',
            	    data: function(params) {
            	    	return {
            	    	    name: params.term, 
                            pagesize: 10,  
                            page: params.page
            	    	}
            	    },
            	    processResults: function (data, params) {
                        params.page = params.page || 1;
                        angular.forEach(data.content, function(node){
            	    		node.text = node.name;
            	    	})
                        return {
                            results: data.content,
                            pagination: {
                                more: (params.page * 10) < data.totalElements
                            }
                        };
                    }
            	}
            });
          }
          return {
            restrict: 'A',
            link: link
          };
	}]);	
	
	emms.directive('select2Search', [function() {
        function link(scope, element) {
            element.select2({
            	language: "zh-CN",
                cache: true
            });
          }
          return {
            restrict: 'A',
            link: link
          };
	}]);
	
	//部门结构树指令
	emms.directive('deptTree', ['Dept', 'toastr', function(Dept, toastr){
		
		var helper = {
			init: function(types) {
				     return Dept.queryDeptTree({type:types, deptId : 1});
				 }
		   }
	    return {
	        restrict: 'A',
	        scope: {
	        	nodeid: '=',
	        	nodesSelected: '=',
	        	multiple: '<multiple',
	        	multipleType: '<multipleType',
	        	maxCount: '<maxCount',
	        	selected: '=selected',
	        },
	        template: `<treecontrol style='white-space:nowrap;'  order-by='orderBy' tree-select='treeSelect' 
	                      reverse-order='false'  ng-model='nodeid' class='tree-light' 
	        		      tree-model='dataForTheTree'  expanded-nodes='nodeExpanded' options='treeOptions'
	        		      on-selection='showSelected (node,selected)' on-node-toggle="showToggle(node)" > 
	        			
	        			<label style="font-weight: normal;"  ng-show="multiple && !multipleType && node.id != 1 &&  node.num !== '00066' &&   node.num !== '00067' &&  node.num !== '00068' &&   node.num !== '00069'">
	        			   <input type="checkbox" ng-model="node.check" ng-click="multipleNode(node)">
	        			   <span>{{node.name}}</span>
	        			</label>
	        			<label style="font-weight: normal;"  ng-show="multiple && multipleType =='gongBan' && node.children == null">
	        				<input type="checkbox" ng-model="node.check" ng-click="multipleNode(node)">
	        				<span>{{node.name}}</span>
	        			</label>
	        			<span ng-show="multiple && !multipleType && ( node.id == 1 ||  node.num == '00066' ||   node.num == '00067' || node.num == '00068' || node.num == '00069')">{{node.name}}</span>
	        			<span ng-show="multiple &&  multipleType =='gongBan' && node.children != null">{{node.name}}</span>
	        	        <span ng-show="!multiple">{{node.name}}</span>&nbsp;&nbsp;&nbsp;
	        		   </treecontrol>`,
				
			link:function(scope,element,attributes){
					
					scope.nodeid = 1;
				    var type = attributes.deptTree;
				    if (type == ""){
				    	 type="one";//all
				    }
				    if (scope.multiple != true){
				    	scope.multiple = false;
				    	var dirSelectable = false;
				    }else{
				    	if(scope.nodesSelected == null){
				    		scope.nodesSelected = [];
				    	}
				        var labelSelected = "tree-mullabelSelected";
				        var dirSelectable = true;
				    }
					helper.init(type).$promise.then(function(depts){
						//初始化tree配置
						scope.treeOptions = {  
								nodeChildren: "children",  
								dirSelectable: dirSelectable,
								injectClasses: {  
									ul: "a1",  
									li: "a2",  
									liSelected: "a7",  
									iExpanded: "a3",  
									iCollapsed: "a4",  
									iLeaf: "a5",  
									label: "a6",  
									labelSelected: labelSelected 
								}  
						}  
						//初始化tree数据
						scope.dataForTheTree = depts;
						scope.nodeExpanded = [depts[0]];
					});
					//选择node节点时
					scope.showSelected = function (node, selectes){
						selected(node, selectes);
					}
					//点击节点时
					scope.showToggle = function (node){
						selected(node, false);
					}
					
				    scope.multipleNode = function(node){
				    	if(node.check){
				    		if(scope.nodesSelected.length >= scope.maxCount){
				    			node.check = false;
				    			toastr.error("最多选取" +scope.maxCount+ "个");
				    		}else{
				    			scope.nodesSelected.push(node);
				    		}
				    	}else{
				    		//从数组中找出对应的下标
			    			var indexOf = -1;
			    			angular.forEach(scope.nodesSelected,function(dept, index) {
			    				if (dept.id == node.id){
			    					indexOf = index;
			    					return indexOf;	
			    				}
			    			})
			    			scope.nodesSelected.splice(indexOf, 1);
				    	}
				    }
				    
				   function selected(node,selected){
						scope.nodeid = node.id;
						scope.selected = selected;
						if(node.children != null && node.id != 1){
							node.children = [];
							Dept.queryDeptTree({type: type, deptId : node.id}, function(response){
								angular.forEach(response, function(dept){
									if(scope.nodesSelected != undefined && scope.nodesSelected.length >0){
										angular.forEach(scope.nodesSelected, function(check){
											if(check.id == dept.id){
												dept.check = check.check;
											}
										})
									}
									node.children.push(dept);
								});
							});
						}
				  };
					
				},
				
				controller: ['$scope', function($scope) {
					$scope.orderBy="rank";
				}]
	    };
	}]);
	
	
	emms.directive('emmsEditableDropdown', ['$document', function($document) {
		
		return {
			restrict: 'E',
			replace: true,
			scope: {
				items: '=dropDownList',
				selected: '=currentSelect',
				other: '@',
				formFieldName: '@',
				maxLength: '@'
			},
			template: 
				`<div class="from-group has-feedback">
					<label class="control-label sr-only">label</label>
					<input type="text" class="form-control" ng-model="selected.name" name="{{formFieldName}}" 
						ng-value="selected.name ? selected.name : selected.name" ng-blur="loseFocus()" 
						data-toggle="dropdown" readonly style="background-color: white;" maxlength="{{maxLength}}" required/>
						<span class="glyphicon glyphicon-menu-down form-control-feedback"></span>
						<ul class="dropdown-menu dropdown-menu-align">
							<li ng-repeat="item in items" ng-click="select(item)"><a>{{item.name}}</a></li>
							<li ng-click="select()" ng-if="showOther"><a>其他</a></li>
						</ul>
				</div>`,
			controller: ['$scope', '$element', function(scope, element) {
				
				scope.showOther = scope.other ? false : true;
				
				var inputElement = element[0].children[1];
				var inputJqElement = angular.element(inputElement);
				
				scope.select = function(item) {
					if (item) {
						scope.selected = item;
						inputJqElement.attr('readonly', 'readonly');
					} else {
						scope.selected = null;
						inputJqElement.removeAttr('readonly');
						inputJqElement.addClass('emms-text-focus');
						inputElement.focus();
						inputJqElement.attr('placeholder', '请输入...');
					}
				}
				
				scope.loseFocus = function() {
					inputJqElement.removeClass('emms-text-focus');
				}
				
				scope.$watch('selected', function(newVal, oldVal) {
					if (newVal) {
						if (!newVal.name) {
							scope.selected = {name: newVal};
						}
					}
				});
			}]
		}
	}]);
	
	
	
	// 树选择器：设备树 修程树,...
	emms.directive('treeSelector', ['Device', 'Major', 'MaintenanceProcedure','AnnualSchedule', 
		function(Device, Major, MaintenanceProcedure, AnnualSchedule){
		
		var helper = {
			init: function(type, showScope) {
				if(type == "device"){
					return Device.deviceTree({scope: showScope});
				}
				if(type == "maintenanceProcedure"){
					return MaintenanceProcedure.getTreeData();
				}
				if(type == "major"){
					return Major.showTree();
				} 
			}
		   }
	    return {
	        restrict: 'A',
	        scope: {
	        	node: '=', // 当前选中的节点
	        	selected: '=', // 是否选中
	        	isOpened: '=', // 
	        	nodes: '=',// 多选节点
	        	multiple: '@multiple', // 是否多选
	        	treeType: '<treeType', // 树的类型
	        },
	        template: 
	        	`<treecontrol  tree-select="multiple"  ng-model="node"
	        		 class="tree-light"  tree-model="dataForTheTree"  expanded-nodes="nodeExpanded" options="treeOptions" 
	        		 on-selection="showSelected(node,selected)" selected-nodes="selectedNodes"  on-node-toggle="showToggle(node)">
	        		 {{node.name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</treecontrol>`,
				
			link:function(scope,element,attributes){
					
				    scope.showScope = attributes.treeSelector;
				    if ( scope.showScope == ""){
				    	scope.showScope = "one";
				    }
				    var dirSelectable = false;
				    // 默认设备树
				    if(scope.treeType == ""  || scope.treeType == null){
				    	scope.treeType = "device";
				    }
				    if (scope.multiple != true){
				    	scope.multiple = false;
				    }
				    
				    //初始化tree配置
					helper.init(scope.treeType, scope.showScope).$promise.then(function(areas){
						
						scope.treeOptions = {  
								nodeChildren: "children",  
								dirSelectable: dirSelectable,
								multiSelection: scope.multiple, 
								injectClasses: {  
									ul: "a1",  
									li: "a2",  
									liSelected: "a7",  
									iExpanded: "a3",  
									iCollapsed: "a4",  
									iLeaf: "a5",  
									label: "a6",  
									labelSelected: "tree-labelSelected"  
								}  
						}  
						
						//初始化tree数据
						scope.dataForTheTree = areas;
					   // scope.nodeExpanded = [areas[0]];
					});
					
					//选择node节点时 
					scope.showSelected = function (node,selected){
						scope.node = node;
						scope.selected = selected;
						if(scope.isOpened != undefined ){
							scope.isOpened = false;
						}
						scope.nodes = scope.selectedNodes;
					
					};
					
					scope.showToggle = function(node){
						scope.showSelected(node, true);
						if (node.children != null && node.id != 1 && scope.treeType == 'dept') {
							node.children = [];
							Dept.queryDeptTree({type: scope.showScope, deptId : node.id}, function(response){
								angular.forEach(response, function(child){
									node.children.push(child);
								});
							});
					    }
						
						if (node.children != null  && scope.treeType == 'device'){
					    	node.children = [];
					    	Device.deviceTree({scope: scope.showScope}, node, function(response){
								angular.forEach(response, function(child){
									node.children.push(child);
								});
							});
					    }
					}
			}
	    };
	}]);
	
	return app;
	
}(emmsModule || {}));
