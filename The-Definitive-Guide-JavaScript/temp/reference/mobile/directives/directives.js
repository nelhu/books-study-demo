/**
  * description - 移动端指令
  * create - Nelson.Xuezi.hu
  * date - 2017-9-17
  */
var emmsMobileModule = (function(mobileApp) {
	var emmsMobile = mobileApp.emmsMobile;

	// 菜单项
	emmsMobile.directive('menuItemBar', function() {
		return {
			restrict: 'AE',
			replace: false,
			templateUrl: '/mobile/common/template/menuItemBar',
			scope: {
				prevIcon: '@icon',
				title: '@title',
				content: '@content',
				head: '@head',
				toDestnation: '&onTouch',
				showRightArrow: '@showRightArrow',
				rightIcon: '@rightIcon',
				isAfter: '@isAfter'
			},
			controller: ['$scope', function($scope) {
				
			}]
		}
	});
	
	// 实体展示项
	emmsMobile.directive('entityItemBar', function() {
		return {
			restrict: 'AE',
			replace: false,
			templateUrl: '/mobile/common/template/entityItemBar',
			scope: {
				imgId: '@img',
				title: '@title',
				middle: '@middle',
				description: '@description',
				level: '@level',
				status: '@status',
				afterAudit:'@afterAudit', 
				isRead: '@isRead',
				toDestnation: '&onTouch'
			},
			controller: ['$scope', function($scope) {
				
				function init() {
					if ($scope.afterAudit == 'true' && $scope.level == '紧急') {
						$scope.levelColor = {'color': 'red'};
						$scope.urgencyFlag = true;
					}
					if ($scope.afterAudit == 'true' && ($scope.status == '修复' || $scope.status == '确认')) {
						if ($scope.isRead == 'true') {
							$scope.newMsgFlag = false;
						}
						if ($scope.isRead == 'false') {
							$scope.newMsgFlag = true;
						}
					}
					
				}
				init();
				
			}]
		}
	});
	
	emmsMobile.directive('mobileLogout', function() {
		return {
			restrict: 'C',
			link: function(scope, elem, attr) {
				elem.on('click', function() {
					logout();
				})
			}
		}
	});
	
	// 监听键盘回车事件
	emmsMobile.directive('searchablebar', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.bind('keypress', function($event) {
					if ($event.key == 'Enter' || $event.keyCode == '13') {
						scope.search();
					}
	            });
			}
		}
	});
	
	emmsMobile.directive('tabCtrl', function() {
		return {
			restrict: 'C',
			controller: function() {
				
				this.menuToggle = true;
				this.someMethod = function() {
					alert('method');
				}
				
			}
		}
	});
	
	// 移动端选项卡菜单
	emmsMobile.directive('tabCtrlItem', function() {
		return {
			restrict: 'C',
			require: '^tabCtrl',
			link: function(scope, element, attrs, tabCtrl) {
				element.bind('click', function() {
					if (tabCtrl.menuToggle) {
						element.css('color', '#007aff');
						element.css('border-bottom', '1px solid #007aff');
					}
					
				});
				element.bind('blur', function() {
					element.css('color', 'red');
					element.css('border-bottom', '1px solid #007aff');
				
					
				});
			}
		}
	});
	
	
	// ngRepeat生命周期触发
	emmsMobile.directive('repeatCycle', ['$document', function($document) {
		
		return {
			restrict: 'A',
			link: function(scope, element, attr) {
				if (scope.$first) {
					if (attr.repeatBegin) {
						scope.$eval(attr.repeatBegin);
					}
				}
				if (scope.$middle) {
					if (attr.repeatMiddle) {
						scope.$eval(attr.repeatMiddle);
					}
				}
				if (scope.$last) {
					if (attr.repeatEnd) {
						scope.$eval(attr.repeatEnd);
					}
				}
			}
		}
		
	}]);
	
	// 移动端下拉选择器： 单选 + 二级联动
	emmsMobile.directive('dropdownSelect', [function() {
		
		return {
			restrict: 'A',
			scope: {
				trigger: '@id',
				title: '@title',
				child: '@',
				source: '=',
				selected: '=',
				onSelect: '&',
			},
			controller: ['$scope', '$element', '$attrs', '$timeout', function($scope, $element, $attr, $timeout) {
				
				var selectorName = $scope.trigger + 'Trigger';
				$scope.$watch('source', function(newVal, oldVal) {
					if (newVal) {
						if ($scope[selectorName]) {
							// 刷新单选项(第一个轮子)的数据
							$scope[selectorName].updateWheel(0, newVal);
						} else {
							init();
						}
					}
				});
				function init() {
					transformSource();
					try {
						var selector = new MobileSelect({
							trigger: '#' + $scope.trigger,
							title: $scope.title,
							wheels: $scope.wheelsData,
							position: [0],
							triggerDisplayData: false,
							callback: function(indexs, selected) {
								$scope.$apply(function() {
									if ($scope.isMultiWheels) {
										$scope.selected = selected[selected.length - 1]
									} else {
										$scope.selected = selected[0];
									}
									if ($scope.onSelect && $attr.onSelect) {
										$timeout(function() {
											$scope.onSelect()(selected);
										}, 100);
									}
								});
							},
							keyMap: {
								id:'id',
					            value: 'name',
					            childs : $scope.child ? $scope.child : 'childs'
							}
						});
						$scope[selectorName] = selector;
					} catch (error) {
						
					}
				}
				
				
				function transformSource() {
					$scope.wheelsData = [
										{data: []}
									 ];
					$scope.wheelsData[0].data = $scope.source;
					$scope.isMultiWheels = false;
					for (var property in $scope.wheelsData[0].data[0]) {
							if (Array.isArray($scope.wheelsData[0].data[0][property])) {
								$scope.isMultiWheels = true;
							}
						}
					return $scope.wheelsData;
				}
				
			}]
		}
		
	}]);
	
	// 移动端下拉日期选择器
	emmsMobile.directive('datetimeDropdownSelect', [function() {
		
		return {
			restrict: 'A',
			scope: {
				trigger: '@id',
				title: '@title',
				selected: '=',
				onSelect: '&',
				previous: '@previous'
			},
			controller: ['$scope', '$element', '$attrs', '$timeout', function($scope, $element, $attr, $timeout) {
				
				function init() {
					var wheelsData = transformSource();
					try {
						var selector = new MobileSelect({
							trigger: '#' + $scope.trigger,
							title: $scope.title,
							wheels: wheelsData,
							position: [0, 7, 0],
							triggerDisplayData: false,
							callback: function(indexs, selected) {
								$scope.$apply(function() {
									var date = selected[0].substr(0, 10)
									var hourValue = selected[1].substr(0, selected[1].length - 1);
									var hour = hourValue < 10 ? '0' + hourValue : hourValue;
									var minute = selected[2].substr(0, 2);
									
									$scope.selected = date + ' ' + hour + ":" + minute + ':00';
									
									if ($scope.onSelect && $attr.onSelect) {
										$timeout(function() {
											$scope.onSelect()($scope.selected);
										}, 100);
									}
									
								});
							},
							keyMap: {
								id:'id',
					            value: 'name',
					            childs :'children'
							}
						});
					} catch (error) {
						//console.log(error);
					}
					
				}
				
				
				function transformSource() {
					$scope.wheelsData = [
										{data: []},
										{data: []},
										{data: []}
									 ];
					$scope.wheelsData[0].data = generateMonthday();
					$scope.wheelsData[1].data = generateHour();
					$scope.wheelsData[2].data = ['00分', '15分', '30分', '45分'];
					
					
					return $scope.wheelsData;
				}
				
				function generateMonthday() {
					$scope.monthDays = [];
					var todayDate = new Date();
					
					// 可选今天以前的时间
					if ($scope.previous) {
						var yesterday = new Date(new Date().setDate(todayDate.getDate() - 1));
						var yesterdayDescription = yesterday.toJSON().substr(0, 10) + ' 昨天';
						var beforeYesterday = new Date(new Date().setDate(todayDate.getDate() - 2));
						var beforeYesterdayDescription = beforeYesterday.toJSON().substr(0, 10) + ' 前天';
						$scope.monthDays.push(beforeYesterdayDescription);
						$scope.monthDays.push(yesterdayDescription);
					}
					
					var todayDescription = todayDate.toJSON().substr(0, 10) + ' 今天';
					var tomorrowDate = new Date(new Date().setDate(todayDate.getDate() + 1));
					var tomorrowDescription = tomorrowDate.toJSON().substr(0, 10) + ' 明天';
					$scope.monthDays.push(todayDescription);
					$scope.monthDays.push(tomorrowDescription);
					
					for (var i = 2; i < 29; i++) {
						var currentDate = new Date(new Date().setDate(todayDate.getDate() + i));
						var dateDescription = currentDate.toJSON().substr(0, 10);
						if (i <= 6) {
							var description = ' 周' + '一二三四五六日'.charAt(currentDate.getDay() - 1);	
							var currentDateDescription = dateDescription + description;
							$scope.monthDays.push(currentDateDescription);
						} else {
							$scope.monthDays.push(dateDescription);
						}
						
					}
					return $scope.monthDays;
				}
				
				function generateHour() {
					$scope.hours = [];
					 for (var i = 0; i <= 23; i++) {
	   					$scope.hours.push('' + i + '点');
	   				 }
					 return $scope.hours;
				}
				
				
				init();
			}]
		}
		
	}]);
	
	
	// 移动端下拉年份月份选择器
	emmsMobile.directive('monthdateDropdownSelect', [function() {
		
		return {
			restrict: 'A',
			scope: {
				trigger: '@id',
				title: '@title',
				selected: '=',
				onClick: '&'
			},
			controller: ['$scope', '$element', '$attrs', function($scope, $element, $attr) {
				
				function init() {
					var wheelsData = transformSource();
					try {
						var selector = new MobileSelect({
							trigger: '#' + $scope.trigger,
							title: $scope.title,
							wheels: wheelsData,
							position: [0, 0],
							triggerDisplayData: false,
							callback: function(indexs, selected) {
								$scope.$apply(function() {
									var year = selected[0].substr(0, selected[0].length -1)
									var monthValue = selected[1].substr(0, selected[1].length -1);
									var month = monthValue < 10 ? '0' + monthValue : monthValue;
									var monthStart = year + '-' + month + "-01" + ' 00:00:00';
									var monthEnd = new Date(year, monthValue, 1).toJSON().substr(0, 10) + ' 00:00:00';
									$scope.selected = {monthStart: monthStart, monthEnd: monthEnd};
									if ($scope.onClick) {
										$scope.onClick()($scope.selected);
									}
								});
								
							},
							keyMap: {
								id:'id',
					            value: 'name',
					            childs :'children'
							}
						});
					} catch (error) {
						//console.log(error);
					}
					
				}
				
				
				function transformSource() {
					$scope.wheelsData = [
										{data: []},
										{data: []}
									 ];
					$scope.wheelsData[0].data = generateYear();
					$scope.wheelsData[1].data = generateMonth();
					
					
					return $scope.wheelsData;
				}
				
				function generateYear() {
					
					var years = [];
					for(var i = 2018; i < 2028; i++) {
						years.push('' + i + '年');
					}
					return years;
				}
				
				function generateMonth() {
					var months = [];
					for(var i = 1; i < 13; i++) {
						months.push('' + i + '月');
					}
					return months;
				}
				
				
				init();
			}]
		}
		
	}]);
	
	
	// 移动端折叠显示
	emmsMobile.directive('areaAccordion', ['$compile', function($compile) {
		
		return {
			restrict: 'AE',
			template: `<p class="list-group-item row" ui-state="accordionFlag"  ui-toggle="accordionFlag">
							<span>{{title}}</span><span class="pull-right"><i ng-class="{'fa fa-angle-right mobile-common-icon-color': !flag, 'fa fa-angle-down mobile-common-icon-color': flag}"></i></span>
						</p>`,
			scope: {
				title: '@title',
				source: '='
			},
			controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
				$scope.$on('mobile-angular-ui.state.changed.accordionFlag', function(e, newVal, oldVal) {
					  if (newVal === true) {
						  $scope.flag = true;
					  } else {
						  $scope.flag = false;
					  }
					});
			}],
			link: function($scope, $element, $attr) {
				$scope.aa = true;
				var content = `<div class="list-group row" ui-if="accordionFlag">
									<p class="list-group-item" ui-if="accordionFlag" ng-repeat="area in source" style="text-align: right">
										<span>{{area.original ? area.original.name : area.originalDescription}}</span> - 
										<span>{{area.destination ? area.destination.name : area.destinationDescription}}</span>
									</p>
								</div>`;
				var contentDom = $compile(angular.element(content))($scope);
				$element.after(contentDom);
			}
		}
		
	}]);
	
	return mobileApp;
}(emmsMobileModule || {}));
