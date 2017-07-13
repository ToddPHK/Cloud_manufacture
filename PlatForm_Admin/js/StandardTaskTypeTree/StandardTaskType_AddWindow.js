var StandardTaskType_FormPanel = new Ext.form.FormPanel({
    autoHeight: true,
    frame: true,
    // layout: "form", // 整个大的表单是form布局
    labelAlign: "left",
    items: [{
        regex: /^[^\\'‘’]+$/,
        regexText: "不能包含单引号",
        xtype: "textfield",
        fieldLabel: "标准任务名",
        labelWidth: 20,
        name: 'StandardTaskTypeName',
        width: 220
    }, {
        regex: /^[^\\'‘’]+$/,
        regexText: "不能包含单引号",
        xtype: "textfield",
        fieldLabel: "标准服务名",
        labelWidth: 20,
        name: 'StandardServiceTypeName',
        width: 220
    }, {
        regex: /^[^\\'‘’]+$/,
        regexText: "不能包含单引号",
        xtype: "textfield",
        fieldLabel: "编号",
        labelWidth: 20,
        name: 'CodingInit',
        width: 220
    }, {
        xtype: "htmleditor",
        fieldLabel: "描述",
        submitValue:false,
        name: 'Description',
        height: 150,
        width: 350
    }, {
        xtype: "hidden",

        name: 'ID'
    }
     ]
});

var StandardTaskType_Window = new Ext.Window({
    //layout: 'fit',
    width: 550,
    height: 305,
    modal: true,
    closeAction: "hide",
    // plain: true,
    title: '编辑对话框',
    //bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: [StandardTaskType_FormPanel],
    buttons: [{
        text: '保存',
        //点击保存按钮后触发事件  
        handler: function () {
            SaveStandardTaskType();

        }
    }]
});
StandardTaskType_Window.on('hide', function () {
    StandardTaskType_FormPanel.form.findField("StandardTaskTypeName").setValue("");
    StandardTaskType_FormPanel.form.findField("StandardServiceTypeName").setValue("");
    StandardTaskType_FormPanel.form.findField("CodingInit").setValue("");
    StandardTaskType_FormPanel.form.findField("Description").setValue("");
});
function SaveStandardTaskType() {
    var Description = encodeURIComponent(StandardTaskType_FormPanel.form.findField("Description").getValue());
    if (Description.toString().length > 500) {
        App.setAlert(App.STATUS_NOTICE, "输入的字符过多");
        return;
    }
    if (StandardTaskType_FormPanel.form.isValid())//判断是否通过客户端验证
    {
        StandardTaskType_FormPanel.form.submit({
            waitMsg: '正在提交数据请稍等...', 		//提示信息
            waitTitle: '提示', 					//标题
            url: 'DataProcess.aspx', //请求的url地址
            method: 'POST',
            params: {
                OperateType: OperateType,
                Description: Description
            },
            success: function (form, action) {
                StandardTaskType_Window.hide();

                App.setAlert(App.STATUS_NOTICE, action.result.msg);
                refreshTreeGrid();

            },
            failure: function (form, action) {
                App.setAlert(App.STATUS_NOTICE, action.result.msg);
                //  Ext.Msg.alert('提示', '对模板行的操作失败');

            }
        });

    }
}
