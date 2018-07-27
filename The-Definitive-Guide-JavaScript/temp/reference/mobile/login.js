	$(document).ready(function(){
			$.ajax({
				type:"get",
		        async : false,    
				url:"/system/users/isLogin",
			    success: function (result) {
			    	if(result.isLogin == "false"){
			    		JsInterface.login("{'userId':'"+result.userId+"'}");
			    	}
	        }
		});
	});
	
