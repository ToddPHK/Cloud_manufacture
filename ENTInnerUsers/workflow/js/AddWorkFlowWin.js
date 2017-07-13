//------------新建工作流----------
var PeopleStore = new Ext.data.SimpleStore({
    fields: ['ID', 'Name'],
    autoLoad: { params: { type: 'Project'} },
    url: 'ComboData.aspx'
});
var PPeopleListCombo = new Ext.form.ComboBox({
    store: PeopleStore,
    valueField: 'ID',
    fieldLabel: '所属项目',
    displayField: 'Name', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    emptyText: '选择项目',
    editable: false, // 是否允许输入
    forceSelection: true, // 必须选择一个选项
    blankText: '请选择', // 该项如果没有选择，则提示错误信息,
    triggerAction: 'all',
    hiddenName: 'ProjectID',
    anchor: '90%'
});
var NewWFForm = new Ext.form.FormPanel({
    baseCls: 'x-plain',
    labelAlign: "right",
    fileUpload: true,
    defaultType: 'textfield',
    items: [{
        fieldLabel: '工作流名称',
        name: 'WFName',
        allowBlank: false,
        blankText: "不允许为空",
        width: 140
    }, PPeopleListCombo, {
        xtype: "datefield",
        fieldLabel: "工作流计划结束日期",
        minText: "不能小于当前日期",
        name: 'WFEndDate',
        minValue: new Date(),
        format: 'Y-m-d H:i:s',
        width: 140
    }]
});
var NewWFWindow = new Ext.Window({
    title: '新建工作流',
    modal: true,
    closeAction: 'hide',
    width: 300,
    height: 200,
    minWidth: 300,
    minHeight: 100,
    layout: 'fit',
    plain: true,
    bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    listeners: {//监听
        "destroy": function () { NewWFForm.destroy(); }
    },
    items: NewWFForm,
    buttons: [{
        text: '确定',
        handler: function () {
            AddNewWorkFlow();

        }
    }]
});
NewWFWindow.on('hide', function () {
    NewWFForm.getForm().findField('WFName').setValue("");
    PPeopleListCombo.setValue("");
    NewWFForm.getForm().findField('WFEndDate').setValue("");
})
function AddNewWorkFlow() {
    if (NewWFForm.form.isValid()) {
        var parm ;
        if (OperateType == "EditWorkFlow") {
            parm = { OperateType: OperateType, WFID: NewWFWindow.EditWFID };
        }
        else {
            parm = { OperateType: OperateType };
        }
        NewWFForm.getForm().submit({
            url: 'workFlowHandler.ashx',
            method: 'GET',
            params: parm,
            success: function (form, action) {
                App.setAlert(App.STATUS_NOTICE, action.result.msg);
                if (OperateType == "EditWorkFlow") {
                    if (NodeWindow.CurrentWorkFlowID == NewWFWindow.EditWFID) {
                        var WFName = NewWFForm.getForm().findField('WFName').getValue();
                        NodeWindow.setTitle("工作流——" + WFName);
                    }
                }
                NewWFWindow.hide();
                WorkFlowStore.reload();
            },
            failure: function () {
                App.setAlert(App.STATUS_NOTICE, '提交失败！');
            }
        })
    }
}
function addNewWorkFlow(graph) {
    NewWFForm.form.reset();
    NewWFWindow.show();
}
//------------新建工作流结束----------