Ext.onReady(function () {


    Ext.BLANK_IMAGE_URL = '../../../ext-3.2.0/resources/images/default/s.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side';
    //    var CurrentUserID = '<%=Session["userID"]%>';
    var MyMaintabPanel = new Ext.TabPanel({
        activeTab: 0, //初始显示第几个Tab页  
        region: "center",
        deferredRender: false, //是否在显示每个标签的时候再渲染标签中的内容.默认true      
        tabPosition: 'bottom', //表示TabPanel头显示的位置,只有两个值top和bottom.默认是top.           
        items: [{//Tab的个数      
            title: '任务',
            layout: "border",
            items: taskTablePanel
        }, {
            title: '流程任务',
            layout: "border",
            items: ProcessTaskGrid,
            listeners: {//监听
                "deactivate": function (panel) {
                    WorkFlowPreviewWin.hide();
                }
            }
        }/*, {
            title: '不通过流程/任务',
            html: ' <iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="../TaskUnPassManage/Default.aspx" > </iframe>'
        }*/]
    });

    var viewport = new Ext.Viewport({
        layout: 'border', //布局,必须是border
        loadMask: true,
        items: [MyMaintabPanel
            ]
    });
});