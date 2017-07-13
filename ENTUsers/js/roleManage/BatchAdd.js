
var BatchAddPanel = new Ext.FormPanel({
    labelWidth: 80,
    labelAlign: 'right',
    frame: true,
    layout: "form",
    width: 300,
    items: [ {
        fieldLabel: '人员名称(基)',
        name: 'Batchpeoplename',
        xtype: "textfield",
        regex: /^[^\\'‘’]+$/,
        regexText: "不能包含单引号",
        width: 150,
        allowBlank: false, //是否允许为空！false不允许  
        blankText: "不允许为空"
    }, {
        fieldLabel: '添加个数',
        width: 150,
        name: 'PeoNumber',
        allowDecimals: true,
        decimalPrecision: 0,
        xtype: 'numberfield',        
        allowNegative: false,
        keyNavEnabled: true,
        selectOnFocus: true,
        step: 5,
        mouseWheelEnabled: true,
        maxValue: 100,
        minValue: 2

    }]
});

var roleBatchAdd_Window = new Ext.Window({
    minHeight: 200,
    height: 130,
    width: 312,
    modal: true,
    closeAction: "hide",
    layout: 'fit', //layout布局方式为form  
    title: '批量添加人员',
    buttonAlign: 'center',
    items: BatchAddPanel,
    buttons: [{
        text: '保存',
        handler: function () {
              BatchAdd_People();

        }
    }, {
        text: '重置',
        handler: function () {
            BatchAddPanel.getForm().reset();
        }
    }]
});
function BatchAdd_People_WinShow() {
    roleBatchAdd_Window.show();
}
function BatchAdd_People() {
    if (BatchAddPanel.form.isValid()) {
        BatchAddPanel.getForm().submit({
            url: 'GetDataProcess.ashx',
            params: { OperateType: 'BatchAdd_People' },
            method: 'GET',
            success: function (form, action) {
                Ext.Msg.alert('提示框', action.result.msg);
                roleTabletore.reload();
                roleBatchAdd_Window.hide();
            },
            failure: function () {
                Ext.Msg.alert('提示', action.result.msg);
            }
        })
    }
}