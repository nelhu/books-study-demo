/**
 *  推送消息监听，监听消息数量
 */
var emmsLib = (function(lib){
	
	lib.amqpMsgListener = function(sockUrl, staffNo, success, error) {
		
	    var ws = new SockJS(sockUrl);
	    var client = Stomp.over(ws);
		client.heartbeat.outgoing = 0;
		client.heartbeat.incoming = 0;
		
		// Close debug output
		client.debug = null;
		
		client.connect('guest','guest',function(frame){
			client.subscribe("/exchange/cqmetro/user." + staffNo + '.#', success, {"auto-delete": true});
			},
			error        
		);
	}
	
	return lib;
	
}(emmsLib || {}));

