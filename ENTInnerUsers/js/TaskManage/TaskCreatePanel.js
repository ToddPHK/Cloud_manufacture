
var CardPanel = new Ext.Panel({
    layout: 'card',
    autoScroll: true,
    //   activeItem: 0, //设置默认显示第一个子面板 
    layoutConfig: {
        renderHidden: false,
        deferredRender: true
    },
    frame: true,
    buttonAlign: 'center',
    height: 420,
    autoScroll: true
})

var taskDetailPanel = new Ext.Panel({
    split: true,
    border: true,
    region: 'center',
    autoScroll: true,
    layout: 'auto',
    items: [CardPanel]
});

var TaskCreate_Window = new Ext.Window({
    collapsible: true,
    id: 'TaskCreate_Window',
    maximizable: true,
    layout: 'border',
    width: 850,
    height: 500,
    modal: false,
    closeAction: "hide",
    plain: true,
    title: '编辑对话框',
    buttonAlign: 'center',
    items: [taskDetailPanel, StandardTaskTreePanel],
    buttons: [{
        text: '保存',
        //点击保存按钮后触发事件  
        handler: function () {
            if (OperateType == "Createtask")
                SubmitTask();
            else if (OperateType == "EditTask")
                SaveEditedTask();
        }
    }]
});

function SubmitTask() {

    if (StandardTaskTreePanel.getChecked()[0] == undefined) {
        Ext.Msg.alert("提示", "请在标[准制造任务]中选中一个节点！");
        return;
    }
    var BelongProject;
    function getProjectID(node) {
        if (node.parentNode.id != "ProjectTaskTreeRoot")
            getProjectID(node.parentNode);
        else
            BelongProject = node.id;
    }
    var BelongProjectTreeNode = ProjectTaskTreePanel.getChecked()[0];

  //  return;
 
    getProjectID(BelongProjectTreeNode);

    var h = CardPanel.layout.activeItem.id;
    var TaskForm = Ext.getCmp(h).getForm();
    if (TaskForm.isValid())//判断是否通过客户端验证
    {
        TaskForm.submit({
            waitMsg: '正在提交数据请稍等...', 		//提示信息
            waitTitle: '提示', 					//标题
            url: 'TaskSubmitManage.aspx', //请求的url地址
            method: 'GET',
            params: {
                OperateType: "Createtask",
                StandardTaskID: StandardTaskTreePanel.getChecked()[0].id,
                BelongProjectTreeNode: BelongProjectTreeNode.id,
                BelongProject: BelongProject

            },
            success: function (form, action) {
                App.setAlert(App.STATUS_NOTICE, action.result.msg);
                TaskCreate_Window.hide();
                taskStore.reload();
            },
            failure: function (form, action) {
                App.setAlert(App.STATUS_NOTICE, action.result.msg);
            }
        });
    }
}

function SaveEditedTask() {
    var h = CardPanel.layout.activeItem.id;
    var TaskForm = Ext.getCmp(h).getForm();
    if (TaskForm.isValid())//判断是否通过客户端验证
    {
        TaskForm.submit({
            waitMsg: '正在提交数据请稍等...', 		//提示信息
            waitTitle: '提示', 					//标题
            url: 'TaskSubmitManage.aspx', //请求的url地址
            method: 'GET',
            params: {
                OperateType: "EditTask",
                StandardTaskID: taskTablePanel.getSelectionModel().getSelected().get("TaskTemplateID"),
                TaskID: taskTablePanel.getSelectionModel().getSelected().get("TaskID")
            },
            success: function (form, action) {
                App.setAlert(App.STATUS_NOTICE, action.result.msg);
                TaskCreate_Window.hide();
                taskStore.reload();
            },
            failure: function (form, action) {
                App.setAlert(App.STATUS_NOTICE, action.result.msg);
            }
        });
    }

}










