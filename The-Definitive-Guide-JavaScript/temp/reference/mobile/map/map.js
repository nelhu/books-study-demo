/**
 * description - mobile map related operation
 * create - Nelson.Xuezi.Hu
 * date - 2017-9-26
 */
var emmsMobileModule = (function(mobileApp) {
	var emmsMobile = mobileApp.emmsMobile;

	var MapCtrl = function($scope,Line, $rootScope,MapLevel){
		
		function init() {
			$scope.getLines();
		}
		
		$scope.getLines = function() {
			Line.query(function(lines) {
				$scope.lines = lines;
			});
		};
		//地图配置
		$scope.options = {
			center: {
				lng: 106.502387,
				lat: 29.634582,
			},
			zoom:13,
			layers: [
				{type: 'default'}
			],
		/*    bounds:[
		    	[103.443566,27.732118],
                [110.150719,31.742142]
		    ],*/
			mapStyle: 'amap://styles/b4dbe0b2d7e52af85ecf5a333bbf1073'
		};
		
		$scope.indoor = {
				show: false,
				position : { position : 'bottomleft'},
				options: {
					zoomControl: false,
					zoomPosition: 'bottomleft',
					center: { 
						lat: 0,
						lng: 0
					},
					indoor: true,
					zoom: 7,
					minZoom: 7,
					maxZoom:13,
	                bounds: {
	                	   southWest :{
	                           lat: 0.0097,//上
	                           lng: -0.0//右
	                      },
	                      northEast:{
	                           lat: 0.7,//下
	                           lng: 2.2//左
	                      }
	                 },
				},
			}
		$scope.baseControl = {
				position :{
					top:'45px',
			        right:'10px'
			    },
				theme:'self',
		}
		
		init();
		
	}
	
	emmsMobile.MapCtrl = MapCtrl;
	
	
	// 故障定位controller
	emmsMobile.controller('LocationSelectedMapMobileCtrl', 
			['$scope', '$rootScope', '$state', '$stateParams', 'Line', 'MapLevel', 'Map', 'SweetAlert',
		    function($scope,$rootScope, $state, $stateParams, Line, MapLevel, Map, SweetAlert) {
		
		$scope.ctrl = "LocationSelectedMapMobileCtrl";
		
		$scope.object = angular.copy($stateParams.param.source);
		$scope.state = angular.copy($stateParams.param.state);
		$scope.paramType = angular.copy($stateParams.param.type);
		$scope.location = angular.copy($stateParams.param.source.location);
		
		function init(){
			//是否可以点击
			$scope.selectedMarker = true;
			//create 是否是新增
			$scope.create = $scope.state.action;
			//故障描述内容
			$scope.poi = $scope.location.poi;
			$scope.longitude = $scope.location.longitude;
			$scope.latitude = $scope.location.latitude;
			$scope.floor = "1";
			$scope.type = $scope.location.type;
			//地下地图标注配置信息
			$scope.leafletOptions = {
					content:$scope.state.markerContent,
					closeButton: false,
					color : "green",
			}
			//没有位置标注
			if( $scope.create == true ){
					// 获取当前位置
					$scope.currentLocation = $rootScope.getCurrentLocation();
					if( $scope.currentLocation ){
						$scope.marker={
								content:$scope.state.markerContent,
								onShow: true,
								inShow: false,
								lng: $scope.currentLocation.longitude, 
								lat: $scope.currentLocation.latitude
						};
						$scope.longitude = $scope.currentLocation.latitude;
						$scope.latitude = $scope.currentLocation.latitude;
					}
					
					//初始化地下标注
					$scope.leafletMarker = {lng: 0, lat: 0}
			}
			
			if(  $scope.create == false != null && $scope.location.type == "indoor"){
				
				$scope.stationId=$scope.location.building;
				MapLevel.query({id: $scope.stationId}, function(levels) {
			    			$scope.indoor.levels = levels;
			    			$scope.indoor.show = true;
			    			$scope.marker={inShow: true};
			    			if ($scope.floor ==  $scope.location.floor   && $scope.stationId == $scope.location.building){
			    				$scope.leafletMarker = {lng: $scope.location.longitude, lat: $scope.location.latitude};
			    			}else{  
			    				$scope.leafletMarker = {lng: null,lat: null};
			    			} 
	    		});
			    $scope.type = "indoor"; 
			}else if( $scope.create == false && ($scope.location.type == "outdoor"  || $scope.location.type == "route")) {
				$scope.marker={
						content : $scope.state.markerContent,
						onShow : true,
						lng : $scope.location.longitude,
						lat : $scope.location.latitude
				};
				$scope.type = "outdoor"; 
			}
		}
		
		
		//选择位置
		$scope.selectLocation = function(isIndoor){
			$scope.lineDistances = null;
			$scope.formattedAddress = null;
			$scope.showSwitchPoint = true;
			$scope.selectedMarker = true;
			$scope.distance = null;
    		$scope.route = null;
			if (isIndoor == true){
				
				$scope.marker = {onShow: false,inShow: true};
				$scope.leafletMarker = {lng: 0,lat: 0};
				$scope.longitude = 0;
	    		$scope.latitude = 0;
	    		$scope.isIndoor = false;
	    		$scope.type = "indoor"; 
			}else{
				$scope.currentLocation = $rootScope.getCurrentLocation();
				$scope.marker = {	
						content: $scope.state.markerContent,
						inShow: false,
						onShow:true,
						lng: $scope.currentLocation.longitude,
						lat: $scope.currentLocation.latitude
				};
		 		$scope.longitude = $scope.currentLocation.longitude;
	    		$scope.latitude = $scope.currentLocation.latitude;
	    		$scope.isIndoor = false;
	    		$scope.type = "outdoor";
			}
		}
		
		
	    //展示地下地图  
	    $scope.showStation = function(station) {
			if (station === undefined) {
	    		$scope.indoor.show = false;
	    	} else {
	    		$scope.stationId = station.id;
	    		$scope.stationName = station.name;
	    		MapLevel.query({id: station.id}, function(levels) {
	    			$scope.showSwitchPoint = true;
	    			$scope.indoor.levels = levels;
	    			$scope.indoor.show = true;
	    			if ($scope.floor ==  $scope.location.floor && $scope.stationId ==  $scope.location.building){
    					$scope.leafletMarker = {lng: $scope.location.longitude,lat: $scope.location.latitude};
	    			}else{
	    			    $scope.leafletMarker = {lng:null,lat: null};
	    		    }
	    		});
	    		$scope.$apply();
	    	}
	    } 
	    
	    
		//取消选择
		$scope.cancelLocation = function(isIndoor){
			
			$scope.selectedMarker = false;
    		if (isIndoor == true){
    			$scope.marker.inShow = false;
			}else{
				$scope.marker.onShow = false;
			}
    		$scope.type = undefined;
    		$scope.longitude = undefined;
		}
		
		
	    //点击地图 更新标注位置
	    $scope.onMapClick=function(e,fuc){
	    	if (!$scope.selectedMarker){
	    		return;
	    	}
	    	$scope.showSwitchPoint = true;
	    	if (!$scope.indoor.show){
	    		$scope.marker = {
	    				content: $scope.state.markerContent,
	    				inShow: false,
	    				onShow:true,
	    				lng: e.lnglat.lng,
	    				lat: e.lnglat.lat,
	    		}
	    		$scope.type = "outdoor";
	    		//poi详情查询
	    		fuc.getAddress([e.lnglat.lng, e.lnglat.lat], function(status, result){
	    			if (status === 'complete' && result.info === 'OK') {
	    				$scope.formattedAddress = result.regeocode.formattedAddress;
	    			}
	    			//打开提示框
	    			Map.lineDistance({lng:e.lnglat.lng,lat:e.lnglat.lat}, function(lineDistance){
	    				$scope.lineDistances = lineDistance;
	    				$scope.order = "distance";
	    			});
	    		});
	    		
	    		$scope.longitude = e.lnglat.lng;
	    		$scope.latitude = e.lnglat.lat;
	    	}else{
	    		if( fuc == null ){
	    			SweetAlert.swal({
						title: '提示',
						text: '该站室内地图还未开放',
						type: 'error'
					});
	    			return;
	    		}
	    		if(fuc.contains(e.latlng)){
					$scope.leafletMarker = e.latlng ;
					$scope.longitude = e.latlng.lng;
					$scope.latitude = e.latlng.lat;
		    		$scope.location.floor = $scope.floor;
		    		$scope.location.stationDTO = {id: $scope.stationId};
				}
	    		if( $scope.floor == 1){
	    			$scope.poi = $scope.stationName + "站厅";
	    		}else{
	    			$scope.poi = $scope.stationName + "站台";
	    		}
	    		$scope.type = "indoor";
	    	}
	    	$scope.$apply();
	   }
	    
	    
	    //switchPoint
		$scope.switchPoint = function(lineDistance, isOrigin, address){
			    $scope.showSwitchPoint = false;
			    $scope.poi = address;
			    if(!isOrigin){
			    	$scope.marker={
			    			content: $scope.state.markerContent,
			    			inShow: false,
			    			onShow:true,
			    			lng: lineDistance.longitude,
			    			lat: lineDistance.latitude
			    	}
			    	$scope.distance = lineDistance.distance;
		    		$scope.route = lineDistance.route;
			    	$scope.type = "route";
			    }
			    $scope.lineDistances = null;
			    $scope.formattedAddress = null;
				$scope.longitude = $scope.marker.lng;
				$scope.latitude = $scope.marker.lat;
		}
	    
	    
	    //改变图层时 保存url地址
		$scope.changed = function (e){
		    var urlArr = $(e._level.el.outerHTML).get(0).childNodes[0].src.split('/');
		    var length = urlArr.length-1;
		    $scope.floor = urlArr[length-3];
		    if ($scope.floor ==   $scope.location.floor && $scope.stationId == $scope.location.building){
		    	$scope.leafletMarker = {lng: $scope.location.longitude ,lat: $scope.location.latitude};
		    }else{
		    	$scope.leafletMarker = {lng:null,lat: null};
		    }
			$scope.$apply();
	    }
		
	    //保存location信息 并关闭modal
		$scope.construcateLocation = function() {
			if( $scope.poi == undefined || $scope.poi == "" || $scope.longitude == undefined || $scope.type == undefined){
					showMessage('请输入位置描述并选择位置');
					return;
			 }
		     $scope.location = {
		    		 
		    		 distance: $scope.distance,
		    		 route: $scope.route,
		    		 
		    		 type:$scope.type,
		    		 
	    			 id:$scope.location.id,
	    			
	    			 building: $scope.stationId,
		    		 floor:$scope.floor,
		    		 
		    		 longitude:$scope.longitude,
		    		 latitude:$scope.latitude,
		    		 
		    		 poi:$scope.poi,
		    }; 
		    
		     $scope.object.location = $scope.location;
		    if ($scope.paramType == "patrolEvent") {
				$state.go('patrols.event.edit', {event: $scope.object});
		    }  else {
			    $state.go('malfunctions.edit', {malfunction: $scope.object});
		    }
			
		};
			
	    $scope.back = function() {
	    	 if ($scope.paramType == "patrolEvent") {
	    		 $state.go('patrols.event.edit', {event: $scope.object});
	    	 }else{
	    		 $state.go('malfunctions.edit', {malfunction: $scope.object});
	    	 }
		};
		
		init();
		
		return MapCtrl($scope,Line,$rootScope,MapLevel);
	
	}]);
	
	
	
	
	// 故障位置展示(包括故障附近人员)
	emmsMobile.controller('LocationShowMapMobileCtrl',
			['$scope','$rootScope', '$state', '$stateParams', 'Line', 'MapLevel', 'Map', '$interval', 'UserInfo', 'SharedState', 'CommonService',
		function($scope, $rootScope, $state, $stateParams, Line, MapLevel, Map ,$interval, UserInfo, SharedState,  CommonService) {
	
		$scope.type = angular.copy($stateParams.type);
		$scope.object = angular.copy($stateParams.object);
		$scope.location = angular.copy($stateParams.location);
		$scope.isShowNear = angular.copy($stateParams.isShowNear);
		
		function init () {
			getCurrentLocation();
			// 获取当前位置
			$scope.poi = $scope.location.poi;
			//地下地图标注配置信息
			$scope.leafletOptions = {
					content: $scope.location.marker.content,
					color : $scope.location.marker.iconStyle,
					closeButton: false,
			}
			if($scope.location.type == "indoor"){
				$scope.floor = "1";
				$scope.stationId = "1";
				selectedLevel($scope.location.building);
			}else{
				$scope.indoor = {show:false};
	    		$scope.marker = $scope.location.marker;
	    		$scope.marker.onShow = true;
	    		$scope.marker.inShow = false;
	    		$scope.leafletMarker = {lng: null,lat: null};
			}
			if($scope.isShowNear){
				$scope.pointData = $scope.object.locations;
				$scope.pointSimplifier = {show : true};
				$scope.pointsStyle = pointStyle();
			}
		}
	    
	    //改变图层时 保存url地址
		$scope.changed = function (e){
		    var urlArr = $(e._level.el.outerHTML).get(0).childNodes[0].src.split('/');
		    var length = urlArr.length-1;
		    $scope.stationId = urlArr[length-4];
		    $scope.floor = urlArr[length-3];
		    selectedLevel( $scope.stationId);
			$scope.$apply();
	    }
	    
		
		//开始导航
		$scope.startNavi = function(){
			var locationNavi = $scope.location;
			if($scope.location.type == "indoor"){
				locationNavi.longitude = $scope.location.marker.longitude; 
				locationNavi.latitude =  $scope.location.marker.latitude; 
			}
			if (typeof(JsInterface) == 'undefined') {
				showMessage('请在app内使用');
				return ;
			}
			var locationStr = JSON.stringify(locationNavi);
			JsInterface.startNavi(locationStr);
		}
		
		
		//展示地下地图  
		$scope.showStation = function(station) {
			if (station === undefined) {
				$scope.indoor.show = false;
				$scope.marker = $scope.location.marker;
				$scope.marker.onShow = true;
				$scope.marker.inShow = false;
				$scope.pointSimplifier = {show : true};
				$scope.leafletMarker = {lng: null,lat: null};
			} else {
				$scope.pointSimplifier = {show : false};
					selectedLevel(station.id);
			}
		} 
		
		function selectedLevel(stationId){
			MapLevel.query({id: stationId }, function(levels) {
				$scope.indoor.levels = levels;
				$scope.indoor.show = true;
				if($scope.location.type == "indoor"){
					$scope.marker = {inShow: true, onShow: false};
					if ($scope.floor ==  $scope.location.floor   &&  $scope.stationId == $scope.location.building){
						$scope.leafletMarker = {lng: $scope.location.longitude, lat: $scope.location.latitude};
					}else{  
						$scope.leafletMarker = {lng: null,lat: null};
					} 
				}else{
					$scope.marker = {inShow: false, onShow: false};
				}
			});
		}
		
		var getCurrentLocation = function(){
			var position = $rootScope.getCurrentLocation();
			if(position != undefined && position.longitude != undefined){		
				$scope.myMarker = {
						iconTheme: 'numv1',
						iconStyle: 'start',
						content: '我的位置',
						showPositionPoint: true,
						longitude: position.longitude,
						latitude : position.latitude
				};
			}
		}
		

		//点击人员位置事件
		$scope.click = function(e,record){
			UserInfo.nearInfoShow({objectId: record.data.objectId}, function(response){
				$scope.userInfo = response;
				SharedState.turnOn('MalfunctionMapNearNumber');
			});
		}
		
		// 打电话
		$scope.call = function(phone) {
			return CommonService.call(phone);
		}
		
		// 查看抢修智囊团
		$scope.showEmergencyGroup = function() {
			var param = {
	        		location: $scope.location,
	        		isShowNear: $scope.isShowNear
	        };
			$state.go('malfunctions.emergencyGroup', {malfunction: $scope.object, param: param});
		}
		
	    $scope.back = function() {
	        $interval.cancel(timer);
	        if($scope.type == 'malfunction'){
	        	
	        	$state.go('malfunctions.execute', {malfunction: $scope.object});
	        }else{
	        	//TODO
	        	$state.go('patrols.event.execute', {object: $scope.object});
	        }
		};
		
		init();
		
		var timer = $interval(getCurrentLocation,2000,-1);
		
		return MapCtrl($scope,Line,$rootScope,MapLevel);
		
	}]);
	
	
	// 巡查计划人员， 故障、 执法事件分布图
	emmsMobile.controller('LocationPointsMapMobileCtrl', ['$scope','$rootScope',  
		'$state', '$stateParams', 'Line', 'MapLevel', 'Map', 'UserInfo', 'SharedState', 'CommonService', '$interval',
		function($scope, $rootScope, $state, $stateParams, Line, MapLevel, Map, UserInfo, SharedState, CommonService, $interval) {
		
		$scope.type = angular.copy($stateParams.type);
		$scope.locations = angular.copy($stateParams.locations);

		function initial () {
			getCurrentLocation();
			$scope.pointsimplifier = {outShow : true, inShow: false};
			$scope.pointsStyle = pointStyle();
			$scope.leafletStyle = {
					closeButton: false,
			};
			
			//故障点数据
			if($scope.type == "user"){
				Map.locations({type: $scope.type}, function (response){
					$scope.pointsData = response;
				})
			}else{
				//故障点数据
				Map.query({type: $scope.type}, function (response){
					$scope.pointsData = response;
				})
			}
		}
		
		//  海量点  点击事件  打开staff modal
		$scope.clickPoint = function (e, point){
			$interval.cancel(timer);
			open(point.id);
		}
		
		//点击人员位置事件
		$scope.click = function(e, record){
			$interval.cancel(timer);

			if($scope.type == "user"){
				UserInfo.nearInfoShow({objectId: record.data.objectId}, function(response){
					$scope.userInfo = response;
					SharedState.turnOn('MalfunctionMapNearNumber');
				});
			}else{
				 open(record.data.id);
			}
		}

		
		function open(objectId){
			if($scope.type == "patrolEvent"){
				$state.go('patrols.event.execute', {param: {id: objectId}, fromMap: true});
			}else if($scope.type == "malfunction"){
				$state.go('malfunctions.execute',  {param : {id: objectId}, fromMap: true});
			}
		}
		
	    //展示地下地图  
	    $scope.showStation = function(station) {
			if (station === undefined) {
	    		$scope.indoor.show = false;
	    		$scope.myPosition.show = true;
	    		initial();
	    	} else {
	    		$scope.myPosition = {show: false};
	    		MapLevel.query({id: station.id}, function(levels) {
	    			$scope.indoor.levels = levels;
	    			if($scope.type == "patrolEvent" || $scope.type == "malfunction"){
		    			Map.query({type: $scope.type, id: station.id, floor: "1"},function (response){
		    				$scope.pointsData = response;
		    				$scope.indoor.show = true;
		    				$scope.pointsimplifier = {outShow : false, inShow : true};
		    			})
	    			}
	    		});
	    	}
	    } 
    
	    //改变图层时 保存url地址
		$scope.changed = function (e){
			
			$scope.pointsData = [];

			var urlArr = $(e._level.el.outerHTML).get(0).childNodes[0].src.split('/');
		    var length = urlArr.length-1;
		    $scope.stationId = urlArr[length-4];
		    $scope.floor = urlArr[length-3];
		    Map.query({type: $scope.type, id: $scope.stationId, floor:  $scope.floor},function (response){
		    	$scope.indoor.show = true;
				$scope.pointsData = response;
				$scope.pointsimplifier = {outShow : false, inShow : true};
			})
			$scope.$apply();
	    }
	    
	    
		var getCurrentLocation = function(){
			var position = $rootScope.getCurrentLocation();
			if(position != undefined && position.longitude != undefined){
			    $scope.marker = {
						iconTheme: 'numv1',
						iconStyle: 'start',
						content: '我的位置',
						showPositionPoint: true,
						longitude : position.longitude,
						latitude : position.latitude
				};
			}else{
				showMessage("未能获取位置");
			}	
		}
		
		var timer = $interval(getCurrentLocation,2000,-1);
		
		$scope.back = function(){
			$interval.cancel(timer);
			if($scope.type == "patrolEvent"){
				
				$state.go('patrols.list', {destination: 'tab2'});
			}else if($scope.type == "malfunction"){
		
				$state.go('malfunctions.list');
			}else if ($scope.type == "user") {
				
				$state.go('patrols.list', {destination: 'tab1'});
			}
		}

		
		// 打电话
		$scope.call = function(phone) {
			return CommonService.call(phone);
		}
	
		initial();

		return MapCtrl($scope,Line,$rootScope,MapLevel);
		
	}]);
	
	
	
	//巡查线路
	emmsMobile.controller('LocationRouteShowMobileCtrl', 
			['$scope','Line', '$rootScope', '$state','$stateParams','MapLevel',
		function($scope, Line, $rootScope, $state, $stateParams, MapLevel) {
		
		$scope.locations = $stateParams.locations;
		$scope.id = $stateParams.id;
	    //折线图数据
	    if($scope.locations && $scope.locations.length > 0){
				$scope.polylineData =[];
				$scope.pois = $scope.locations;
				angular.forEach($scope.locations, function(lnglat, $index){
					$scope.polylineData.push([lnglat.longitude, lnglat.latitude]) ;
				});
		}
	    //多边形折线图配置
		$scope.polylineStyle = {
					strokeColor: "#0000ff",
					strokeOpacity: 2,
					strokeWeight: 5,
					fillColor: "#badbef",
					fillOpacity: 0.55
		};
		
		
	    //展示地下地图  
	    $scope.showStation = function(station) {
	    	if (station === undefined) {
	    		$scope.indoor.show = false;
	    	} else {
	    		Level.query({id: station.id, floor:'1'}, function(levels) {
	    			$scope.indoor.levels = levels;
	    			$scope.indoor.show = true;
	    		});
	    	}
	    }  
	    
		$scope.back = function() {
			$state.go('patrols.task.execute', {param: {id: $scope.id}});
		}
	    return MapCtrl($scope, Line, $rootScope, MapLevel);
	}]);
	
	
	// 查看人员轨迹
    emmsMobile.controller('LocationPathShowMobileCtrl', 
    	['$scope', 'Line', '$rootScope', '$stateParams', 'Map', 'MapLevel', '$state',
			function($scope, Line, $rootScope, $stateParams, Map, MapLevel, $state) {
			
			//轨迹图速度设置
			$scope.speed = 100;
			$scope.minTime = new Date();
			$scope.id = $stateParams.id;
			$scope.path = [$stateParams.locations];
			$scope.endTime = $stateParams.endTime;
			$scope.startTime = $stateParams.startTime;
			
			//轨迹 配置
		    $scope.pathStyle ={
		    		colors: [ "#7B68EE",  "#6495ED", "#9932CC","#1E90FF", "#00FFFF",
		                     "#00FF7F", "#FFFF00","#191970", "#FFA500", "#FF4500", "#696969", "#FFB6C1"
		               ],
		 	     	keyPoint : {
		   				radius: 9,
		    			fillStyle: null,
		    			lineWidth: 4,
		    		    strokeStyle: "#9F79EE"
		  		    },
		  		    keyPointTolerance:1,
		  		    renderAllPointslfNumberBelow:1000
		  		  
		 	};
		    
		    //展示地下地图  
		    $scope.showStation = function(station) {
		    	if (station === undefined) {
		    		$scope.indoor.show = false;
		    	} else {
		    		MapLevel.query({id: station.id}, function(levels) {
		    			$scope.indoor.levels = levels;
		    			$scope.indoor.show = true;
		    		});
		    	}
		    } 
		
		$scope.back = function() {
			if ($stateParams.from == 'jobOrderView') {
				$state.go('jobOrders.view', {param: {id: $scope.id}});
			} else if ($stateParams.from == 'jobOrderExecute') {
				$state.go('jobOrders.execute.main', {param: {id: $scope.id}});
			} else {
				$state.go('patrols.task.execute', {param: {id: $scope.id}});
			}
			
		}
		
		return MapCtrl($scope,Line,$rootScope,MapLevel);
	}]);
	
	

	
	function pointStyle(){
		return	{
				  "pointStyle": {
					    "content":function (ctx, x, y, width, height) {

	                        var yPos = 1 / 3;

	                        var top = [x + width / 2, y],
	                            right = [x + width, y + height * yPos],
	                            bottom = [x + width / 2, y + height],
	                            left = [x, y + height * yPos];

	                        ctx.moveTo(left[0], left[1]);
	                        ctx.arcTo(top[0], top[1], right[0], right[1], width / 3);
	                        ctx.lineTo(right[0], right[1]);
	                        ctx.lineTo(bottom[0], bottom[1]);
	                        ctx.lineTo(left[0], left[1]);
							},
					    "width": 15,
					    "height": 24,
					    "fillStyle": "#1f77b4",
					    "lineWidth": 10,
					    "strokeStyle": null
				  },
				  "topNAreaStyle": {
					    "autoGlobalAlphaAlpha": true,
					    "content": "rect",
					    "fillStyle": "#e25c5d",
					    "lineWidth": 7,
					    "strokeStyle": null
				  },
				  "pointHardcoreStyle": {
					    "content": "none",
					    "width": 5,
					    "height": 5,
					    "lineWidth": 5,
					    "fillStyle": null,
					    "strokeStyle": null
				  },
				  "pointPositionStyle": {
					    "content": "circle",
					    "width": 2,
					    "height": 2,
					    "lineWidth": 1,
					    "strokeStyle": null,
					    "fillStyle": "#cc0000"
				  },
				  "pointHoverStyle": {
					    "width": 30,
					    "height": 30,
					    "content": "circle",
					    "fillStyle": null,
					    "lineWidth": 3,
					    "strokeStyle": "#ffa500"
				  },
		};
	}
    
    
    
	return mobileApp;
	
}(emmsMobileModule || {}));