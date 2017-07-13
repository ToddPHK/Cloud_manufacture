var NewTopic_FormPanel = new Ext.form.FormPanel({
    autoHeight: true,
    frame: true,
    layout: "form", // 整个大的表单是form布局
    labelAlign: "right",
    items: [{
        xtype: "textfield",
        fieldLabel: "标题",
        // labelWidth: 20,
        regex: /^[^\\'‘’]+$/,
        regexText: "不能包含单引号",
        name: 'title',
        width: 300
    }, {
        xtype: "htmleditor",
        fieldLabel: "内容",
       // labelWidth: 20,
        name: 'content',
        height: 200,
        enableSourceEdit: false,
        submitValue:false,
        width: 550
    }, {
        xtype: "hidden",
        name: 'ID'
    }
     ]
});

var NewTopic_Window = new Ext.Window({
    layout: 'fit',
    width: 800,
    height: 300,
    modal: true,
    closeAction: "hide",
    title: '新话题',
    buttonAlign: 'center',
    items: [NewTopic_FormPanel],
    buttons: [{
        text: '保存',
        //点击保存按钮后触发事件  
        handler: function () {
            SaveTopic();
            // alert(WindowVote.Grade) 

        }
    }]
});
NewTopic_Window.on('hide', function () {
    NewTopic_FormPanel.getForm().findField('title').setValue('');
    NewTopic_FormPanel.getForm().findField('content').setValue('');
})
function SaveTopic() {
    if (NewTopic_FormPanel.form.isValid())//判断是否通过客户端验证   encodeURIComponent/decodeURIComponent： 

    { 
        NewTopic_FormPanel.form.submit({
            waitMsg: '正在提交数据请稍等...', 		//提示信息
            waitTitle: '提示', 					//标题
            url: 'DataProcess.aspx', //请求的url地址
            method: 'POST',
            params: {
                OperateType: "NewTopic",
                TopicContent: encodeURIComponent(NewTopic_FormPanel.getForm().findField('content').getValue())
            },
            success: function (form, action) {
                NewTopic_Window.hide();

                TopicStore.load({ params: { start: 0, limit: 25} });
                App.setAlert(App.STATUS_NOTICE, action.result.msg);
                
                //  refreshTreeGrid();

            },
            failure: function (form, action) {
                App.setAlert(App.STATUS_NOTICE, action.result.msg);
                //  Ext.Msg.alert('提示', '对模板行的操作失败');

            }
        });

    }
}
