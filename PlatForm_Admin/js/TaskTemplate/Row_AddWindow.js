
var Row_FormPanel = new Ext.form.FormPanel({
    autoHeight: true,
    frame: true,
    // layout: "form", // 整个大的表单是form布局
    labelAlign: "left",
    items: [{
        regex: /^[^\\'‘’]+$/,
        regexText: "不能包含单引号",
        xtype: "textfield",
        fieldLabel: "行名",
        labelWidth: 20,
        name: 'RowName',
        width: 120
    }, {
        xtype: "hidden",
        name: 'ID'
    },{
        xtype: "hidden",
        name: 'ParentID'
    }
     ]
});

var Row_Window = new Ext.Window({
    //layout: 'fit',
    width: 300,
    height: 100,
    modal: true,
    closeAction: "hide",
    // plain: true,
    title: '编辑对话框',
    //bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: [Row_FormPanel],
    buttons: [{
        text: '保存',
        //点击保存按钮后触发事件  
        handler: function () {
            SaveRow();

        }
    }]
});
Row_Window.on('hide', function () {
    Row_FormPanel.form.findField("RowName").setValue("");
});
function SaveRow() {
    if (Row_FormPanel.form.isValid())//判断是否通过客户端验证
    {
        Row_FormPanel.form.submit({
            waitMsg: '正在提交数据请稍等...', 		//提示信息
            waitTitle: '提示', 					//标题
            url: 'DataProcess.aspx', //请求的url地址
            method: 'POST',
            params: {
                OperateType: OperateType
            },
            success: function (form, action) {
                Row_Window.hide();

                App.setAlert(App.STATUS_NOTICE, action.result.msg);
                refreshTreeGrid();

            },
            failure: function (form, action) {
                App.setAlert(App.STATUS_NOTICE, action.result.msg);
                //  App.setAlert(App.STATUS_NOTICE, '对模板行的操作失败');

            }
        });

    }
}
//---------------------------模板Row评价-------------------------------
var TaskTemplate_RowComment = new Ext.XTemplate('<b>[ID]</b>: {INNERID}<br/>',
		'<b>[名称]</b>: {NAME}<br/>',
		'<b>[所有人]</b>: {USER_TEXT}<br/>',
		'<b>[注册时间]</b>: {REGISTE_TIME}<br/>',
		'<b>[资源类型]</b>: {TYPE_TEXT}<br/>',
		'<b>[资源得分]</b>: {AVEEVALUATION}<br/>',
		'<b>[状态]</b>: {STATE}<br/>',
		'<b>[资源入口]</b>: {GATE}<br/>',
//'<b>[监控状态]</b>: {MONITORSTATE_TEXT}<br/>',
		'<b>[描述]</b>: {DESCRIPTION}<br/>',
		'<b>[资源评论]</b>:<br/>',
		 '<tpl for="Assess">',
		 '{#}------------------<b>[评论时间]</b>: {EVA_TIME}------------------<br/>',
		'<b>[评论人]</b>: {EVA_USER_ID}<br/>',
//'<b>[评论时间]</b>: {EVA_TIME}<br/>',		
		'<b>[得分]</b>: {EVA_VALUE}<br/>',
		 '<tpl if="this.isnullde(EVA_DESCRIPTION)">',
            '<b>[评论]</b>: 未评论<br/>',
        '</tpl>',
        '<tpl if="this.isAcess(EVA_DESCRIPTION) == true">',
            '<b>[评论]</b>: {EVA_DESCRIPTION}<br/>',
        '</tpl>',
		'</br>',
		 '</tpl>',
		 {
		     isnullde: function (EVA_DESCRIPTION) {
		         return EVA_DESCRIPTION == 'undefined';
		     },
		     isAcess: function (EVA_DESCRIPTION) {
		         return EVA_DESCRIPTION != 'undefined';
		     }
		 }
		);
var TaskTemplate_RowComment_Panel = new Ext.Panel({
    id: 'TaskTemplate_RowComment_Panel',
    frame: false,
    autoScroll: true,
    region: 'north',
    bodyStyle: {
        background: '#ffffff',
        padding: '7px'
    },
    html: 'Please select a book to see additional details.<div id="dsaas"></div>'
});
var TaskTemplate_RowComment_Win = new Ext.Window({				//创建弹出窗口
    title: "资源详细信息",
    layout: 'fit',
    width: 400,
    height: 320,
    //autoHeight: true,
    closeAction: 'hide',
    resizable: false,
    shadow: true,
    //modal: true,
    closable: true,
    bodyStyle: 'padding:5 5 5 5',
    animCollapse: true,
    items: TaskTemplate_RowComment_Panel

});

function ShowTemplate_RowComment() {
    var nodes = TaskMudole_TreeGrid.getChecked();
    if (nodes.length > 0) {
        node.attributes.ID
        var node = nodes[0];
        var conn1 = Ext.lib.Ajax.getConnectionObject().conn;
        conn1.open("POST", "TaskTemplate.aspx?OperateType=ViewRowComment&ID=" + node.attributes.TaskTemplateID, false);
        conn1.send(null);
        var CommentData = Ext.util.JSON.decode(response.responseText);
        // var TaskTemplates = conn1.responseText;
        var Templates = TaskTemplates.split('|');
        TaskTemplate_RowComment_Win.show();
        var detailPanel = Ext.getCmp('TaskTemplate_Comment_panel');
        TaskTemplate_RowComment.overwrite(detailPanel.body, CommentData);
    }

}