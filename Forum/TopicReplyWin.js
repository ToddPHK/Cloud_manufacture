var TemplateScore_FormPanel = new Ext.form.FormPanel({
    autoHeight: true,
    frame: true,
    layout: "form", // 整个大的表单是form布局
    labelAlign: "left",
    contentEl: 'score',
    items: [{
        xtype: "htmleditor",
        enableSourceEdit: false,
        submitValue: false,
        fieldLabel: "评论内容",
        labelWidth: 20,
        name: 'CommentContent',
        height: 200,
        width: 500
    }, {
        xtype: "hidden",
        name: 'ID'
    }
     ]
});

var TemplateScore_Window = new Ext.Window({
    layout: 'fit',
    width:750,
    height: 330,
    modal: true,
    closeAction: "hide",
    title: '话题回复',
    buttonAlign: 'center',
    items: [TemplateScore_FormPanel],
    buttons: [{
        text: '保存',
        //点击保存按钮后触发事件  
        handler: function () {
            SaveTemplateScore();
            // alert(WindowVote.Grade) 

        }
    }]
});
TemplateScore_Window.on('hide', function () {
    TemplateScore_FormPanel.getForm().findField('CommentContent').setValue('');
})
function SaveTemplateScore() {
    if (TemplateScore_FormPanel.form.isValid())//判断是否通过客户端验证
    {
        TemplateScore_FormPanel.form.submit({
            waitMsg: '正在提交数据请稍等...', 		//提示信息
            waitTitle: '提示', 					//标题
            url: 'DataProcess.aspx', //请求的url地址
            method: 'POST',
            params: {
                OperateType: "AddReply",
                Score: WindowVote.Grade,
                ReplyContent: encodeURIComponent(TemplateScore_FormPanel.getForm().findField('CommentContent').getValue())
            },
            success: function (form, action) {
                TemplateScore_Window.hide();
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