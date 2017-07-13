Ext.onReady(function () {
    Ext.QuickTips.init();
    Ext.BLANK_IMAGE_URL = '../../../ext-3.2.0/resources/images/default/s.gif';
    var viewport = new Ext.Viewport({
        layout: 'border', //布局,必须是border
        loadMask: true,
        items: [StandardTaskType_TreeGrid
            ]
    });
});