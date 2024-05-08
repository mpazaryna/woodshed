Ext.onReady(function(){
    new Ext.Panel({
        renderTo: document.body,
        title: 'Panel with pre-existing content',
        height: 400,
        width: 600,
        cls: 'my-panel-class',
        contentEl: 'main-content'
    });
});
