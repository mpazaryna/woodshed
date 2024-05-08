if (Ext.BLANK_IMAGE_URL.substr(0,5) != 'data:') {
  Ext.BLANK_IMAGE_URL = 'http://wisesmile-dev.s3.amazonaws.com/ext/3/ext-3.4.0/resources/images/default/s.gif';
}
Ext.onReady(function() { 
	Ext.Msg.alert('Hi', 'Hello, World!'); 
});
