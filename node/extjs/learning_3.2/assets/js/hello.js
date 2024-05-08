if (Ext.BLANK_IMAGE_URL.substr(0,5) != 'data:') {
  Ext.BLANK_IMAGE_URL = '/ext/resources/images/default/s.gif';
}
Ext.onReady(function() { 
    Ext.Msg.alert('Hi', 'Hello, World!'); 
});
