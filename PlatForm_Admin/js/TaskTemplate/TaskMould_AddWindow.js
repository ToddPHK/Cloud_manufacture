var StandardTaskTreeLoader = new Ext.tree.TreeLoader({
    baseParams: { OperateType: 'StandardTaskTypeTree' },
    dataUrl: 'DataProcess.aspx'
});
var StandardTaskTree = new Ext.tree.TreePanel({
    rootVisible: false,
    autoScroll: false,
    autoHeight: true,
    loader: StandardTaskTreeLoader,
    root: new Ext.tree.AsyncTreeNode({ id: '0', text: '模具分类' })
});
StandardTaskTree.on('contextmenu', function (node, e) {
    menu = new Ext.menu.Menu([{
        text: "展开",

        handler: function () {
            node.expand(true, false);
            //  alert(node.text + '|' + node.id);
        }
    }, {
        text: "收缩",
        handler: function () {
            node.collapse(true, true);
        }
    }])
    menu.showAt(e.getPoint());
});
var StandardTask_ComboBox = new Ext.ux.ComboBoxTree({
    // hiddenName: 'StandardTaskID',
    resizable: true,
    width: 120,
    autoScroll: false,
    autoLoad: true,
    fieldLabel: "标准任务名",
    submitValue: false,
    //listWidth:300, 这是设置下拉框的宽度，默认和comBoxTree的宽度相等   
    tree: StandardTaskTree,
    selectModel: 'single',
    selectNodeModel: 'all' //只有选叶子时，才设置值 
});
var Mould_FormPanel = new Ext.form.FormPanel({
    autoHeight: true,
    frame: true,
    layout: "form", // 整个大的表单是form布局
    labelAlign: "right",
    items: [StandardTask_ComboBox, {
        regex: /^[^\\'‘’]+$/,
        regexText: "不能包含单引号",
        xtype: "textfield",
        fieldLabel: "模板显示名",
        allowBlank: false,
        labelWidth: 20,
        name: 'MouldDisplayName',
        width: 120
    }, {
        regex: /^[A-Za-z]+$/,
        regexText: "只能填写字母",
        xtype: "textfield",
        fieldLabel: "模板使用名",
        allowBlank: false,
        labelWidth: 20,
        name: 'MouldName',
        width: 120
    }, {

        xtype: "hidden",
        name: 'ID'
    }
     ]
});

var Mould_Window = new Ext.Window({
    // layout: 'fit',
    width: 300,
    height: 160,
    modal: true,
    closeAction: "hide",
    // plain: true,
    title: '编辑对话框',
    // bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: [Mould_FormPanel],
    buttons: [{
        text: '保存',
        //点击保存按钮后触发事件  
        handler: function () {
            //   alert( StandardTask_ComboBox.node.id);
            SaveMould();
        }
    }]
});

Mould_Window.on('hide', function () {
    StandardTask_ComboBox.clearValue();
    Mould_FormPanel.form.findField("MouldDisplayName").setValue("");
    Mould_FormPanel.form.findField("MouldName").setValue("");
});
//Mould_Window.on('show', function () {
//    clearInterval(IntervalID);
//    StandardTask_ComboBox.clearValue();
//    Mould_FormPanel.form.findField("MouldDisplayName").setValue("");
//    Mould_FormPanel.form.findField("MouldName").setValue("");
//});
function SaveMould() {
    var StandardTaskID;
    if (StandardTask_ComboBox.node == undefined) {
        StandardTaskID = TaskMudole_TreeGrid.getChecked()[0].attributes.BidingStandardTaskID;
    }
    else {
        StandardTaskID = StandardTask_ComboBox.node.id;
    }
    if (Mould_FormPanel.form.isValid())//判断是否通过客户端验证
    {
        Mould_FormPanel.form.submit({
            waitMsg: '正在提交数据请稍等...', 		//提示信息
            waitTitle: '提示', 					//标题
            url: 'DataProcess.aspx', //请求的url地址
            method: 'POST',
            params: {
                OperateType: OperateType,
                StandardTaskID: StandardTaskID
            },
            success: function (form, action) {

                Mould_Window.hide();

                App.setAlert(App.STATUS_NOTICE, action.result.msg);
                refreshTreeGrid();

            },
            failure: function (form, action) {

                App.setAlert(App.STATUS_NOTICE, action.result.msg);

            }
        });

    }
}
