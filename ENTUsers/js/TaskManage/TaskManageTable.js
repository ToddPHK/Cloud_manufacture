var taskPageSize = 25, OperateType;
var TaskName_Search = new Ext.form.TextField({
    regex: /^[^\\'‘’]+$/,
    regexText: "不能包含单引号",
    width: 80
});
var ProjectTask_Search = new Ext.tree.TreePanel({
    rootVisible: false,
    autoScroll: false,
    autoHeight: true,
    loader: new Ext.tree.TreeLoader({
        dataUrl: 'DataProcess.aspx?OperateType=ProjectTaskTreeNoCheckBox'
    }),
    root: new Ext.tree.AsyncTreeNode({ id: '0', text: '项目树' })
});
ProjectTask_Search.on('contextmenu', function (node, e) {
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
var ProjectTask_ComboBox = new Ext.ux.ComboBoxTree({
    hiddenName: 'StandardDieClassID',
    resizable: true,
    width: 120,
    autoScroll: false,
    autoLoad: true,
    //listWidth:300, 这是设置下拉框的宽度，默认和comBoxTree的宽度相等   
    tree: ProjectTask_Search,
    selectModel: 'single',
    selectNodeModel: 'all' //只有选叶子时，才设置值 
});
var StandardTask_Search = new Ext.tree.TreePanel({
    rootVisible: false,
    autoScroll: false,
    autoHeight: true,
    loader: new Ext.tree.TreeLoader({
        dataUrl: 'DataProcess.aspx?OperateType=StandardTaskTreeNoCheckBox'
    }),
    root: new Ext.tree.AsyncTreeNode({ id: '0', text: '标准任务' })
});
StandardTask_Search.on('contextmenu', function (node, e) {
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
    hiddenName: 'StandardDieClassID',
    resizable: true,
    width: 120,
    autoScroll: false,
    autoLoad: true,
    //listWidth:300, 这是设置下拉框的宽度，默认和comBoxTree的宽度相等   
    tree: StandardTask_Search,
    selectModel: 'single',
    selectNodeModel: 'all' //只有选叶子时，才设置值 
});

var Task_OperateMenu = new Ext.menu.Menu({
    items: [{
        text: "同步平台审核状态",
        iconCls: 'edit-icon',
        handler: RefreshTaskStateFS
    }, {
        text: "确认发布",
        iconCls: 'edit-icon',
        handler: ConfirmPublish
    }, {
        text: "拒绝发布",
        iconCls: 'edit-icon',
        handler: RefusePublish
    }, /*{
        text: "确认购买服务",
        iconCls: 'edit-icon',
        handler: ConfirmBuy
    }, {
        text: "拒绝购买服务",
        iconCls: 'edit-icon',
        handler: RefuseBuy
    }, */{
        text: "查看服务",
        iconCls: 'edit-icon',
        handler: viewService
    }, {
        text: "挂起任务",
        iconCls: 'edit-icon',
        handler: SuspendTask
    }, {
        text: "解除挂起",
        iconCls: 'edit-icon',
        handler: UnsuspendTask
    }, {
        text: "进度查看",
        iconCls: 'edit-icon',
        handler: ViewTaskProgress
    }, {
        text: "发送信息",
        iconCls: 'edit-icon',
        handler: SendShortMsg
    }]
});
function SendShortMsg() {
    Ext.MessageBox.show({
        title: '短信发送',
        msg: '短信内容:',
        id: "SendShortMsg",
        modal: false,
        width: 300,
        buttons: Ext.MessageBox.OK,
        multiline: true,
        fn: function (btn, text) {
            //--------------------
            if (btn == "ok") {
                if (taskTablePanel_sm.hasSelection()) {
                    var loadMarsk = new Ext.LoadMask('taskTablePanel', {
                        msg: '信息发送中......',
                        removeMask: true// 完成后移除
                    });
                    loadMarsk.show(); //显示
                    var UserIDs = [];
                    var rows = taskTablePanel_sm.getSelections();
                    for (var i = 0; i < rows.length; i++) {
                        UserIDs.push(rows[i].get("TaskCreator"));
                    }
                    alert(UserIDs.join());
                    var jsonData = { OperateType: "SendShortMsg", UserIDs: UserIDs.join(), Message: text };
                    var conn = new Ext.data.Connection();
                    conn.request({
                        url: "DataProcess.aspx",
                        // 传递的参数  
                        params: jsonData,
                        method: 'post',
                        scope: this,
                        callback: function (options, success, response) {
                            if (success) {
                                loadMarsk.hide();
                                Ext.MessageBox.alert("提示", response.responseText);
                            }
                            else {
                                loadMarsk.hide();
                                Ext.MessageBox.alert("提示", "所提交的操作失败！");
                            }

                        }
                    });

                }
                else {
                    App.setAlert(App.STATUS_NOTICE, "还未选择任务！");
                }
            }


            //-----------------------------
        }
    });

}
var ViewTaskProgress_Win = new Ext.Window({
    collapsible: false,
    //    maximizable: false,
    //    resizable: false,
    layout: 'border',
    width: 400,
    height: 250, //15+ -
    modal: false,
    border: false,
    closeAction: "hide",
    plain: true,
    title: '任务进度',
    buttonAlign: 'center',
    items: [{
        id: 'preview',
        region: 'center',
        height: 250,
        // title: '话题回复',
        split: true,
        autoScroll: true,
        bodyStyle: 'padding: 10px; font-family: Arial; font-size: 12px;'
    }]
});
var TopicReply_Template = new Ext.XTemplate(
		 '<tpl for="ReplyData">',
'<p>{#}---------------{Time}---------------</p>',
'<p>进度：<br/>   {Description}</p>',
		 '</tpl>'
);
function ViewTaskProgress() {
    if (taskTablePanel_sm.hasSelection()) {
        var tempRec = taskTablePanel_sm.getSelected();
        if (tempRec.get('TaskState') == 15 || tempRec.get('TaskState') == 16) {//任务状态是已完成或是任务执行中

            var conn1 = Ext.lib.Ajax.getConnectionObject().conn;
            conn1.open("POST", "DataProcess.aspx?OperateType=ViewTaskProgress&TaskID=" + tempRec.get('TaskID'), false);
            conn1.send(null);
            // alert(conn1.responseText);
            ViewTaskProgress_Win.show();
            var responseText = conn1.responseText;
            if (responseText != "") {
                var TaskProgressData = Ext.util.JSON.decode(responseText);
                var detailPanel = Ext.getCmp('preview');

                TopicReply_Template.overwrite(detailPanel.body, TaskProgressData);
            }
            else {
                Ext.getCmp('preview').body.update('<b><u>' + tempRec.get('PrjTaskTreeName') + '</u>  无进度或当前进度无法查看</b>');
            }
        }
        else {
            App.setAlert(App.STATUS_NOTICE, "任务当前状态不能查看进度！");
        }
    }
    else {
        App.setAlert(App.STATUS_NOTICE, "还未选择任务！");
    }
}
function viewService() {
    if (taskTablePanel_sm.hasSelection()) {//rows为""说明没有选择任务
        var TaskID;
        var rec = taskTablePanel.getSelectionModel().getSelected();
        TaskID = rec.get("TaskID");
        window.open("../../../../CloudMfg_SRMS/ServiceView.aspx?TaskID=" + TaskID);
        //  TaskServeChoose_Window.show();
    }
    else {
        App.setAlert(App.STATUS_NOTICE, "请选择一个任务！");
    }
}
var tasktbar = new Ext.Toolbar({
    items: [{
        id: 'taskbtnDel',
        text: "删除",
        iconCls: 'delete-icon',
        handler: function () {
            OperateType = 'DeleteTask';
            rows = taskTablePanel.getSelectionModel().getSelections();
            if (rows.length == 0) {
                App.setAlert(App.STATUS_NOTICE, "请至少选择一行你要删除的数据！");
                return;
            }
            Ext.MessageBox.confirm('提示', '确实要删除所选的记录吗?', taskDelete);

        }

    }, '-', {
        text: "任务操作",
        menu: Task_OperateMenu
    }, '->', "标准任务类:", StandardTask_ComboBox, "项目树:", ProjectTask_ComboBox, '任务名:', TaskName_Search, {
        id: 'taskbtnSearch',
        text: "搜索",
        iconCls: 'search-icon',
        handler: taskDataSearch
    }]

});

function RefreshTaskStateFS() {
    var jsonData = { OperateType: "RefreshTaskStateFServer" };
    TaskTreeOperaMethod('TaskSubmitManage.aspx', jsonData);
    taskStore.load({ params: { start: 0, limit: taskPageSize} });

}
function taskDataSearch() {
    taskStore.removeAll();
    if (StandardTask_ComboBox.node == undefined || StandardTask_ComboBox.getRawValue().match(/^[   |　]+$/) || ProjectTask_ComboBox.getRawValue() == "")
        taskStore.baseParams.StandardTaskID = "";
    else
        taskStore.baseParams.StandardTaskID = StandardTask_ComboBox.node.id;
    if (ProjectTask_ComboBox.node == undefined || ProjectTask_ComboBox.getRawValue().match(/^[   |　]+$/) || ProjectTask_ComboBox.getRawValue() == "")
        taskStore.baseParams.ProjectTaskID = "";
    else
        taskStore.baseParams.ProjectTaskID = ProjectTask_ComboBox.node.id;
    taskStore.baseParams.TaskName = TaskName_Search.getValue();
    taskStore.baseParams.OperateType = "search";

    taskStore.reload();
    taskPageBar.changePage(1);
}
function ConfirmBuy() {
    var TaskID = [];
    var rows = taskTablePanel.getSelectionModel().getSelections();

    if (rows == "")//没有选择任务
    {
        App.setAlert(App.STATUS_NOTICE, " 你还没有选择任务！");
    }
    else {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].get("TaskState") != 6) {
                App.setAlert(App.STATUS_NOTICE, "任务[" + rows[i].get("PrjTaskTreeName") + "]不能进行此操作！");
                return;
            }
            TaskID.push(rows[i].get("TaskID"));
        }
        var jsonData = { OperateType: "ConfirmBuy", TaskID: TaskID.join() };
        TaskTreeOperaMethod('TaskSubmitManage.aspx', jsonData);
        taskStore.reload();
    }
}
function RefuseBuy() {
    var TaskID = [];
    var rows = taskTablePanel.getSelectionModel().getSelections();

    if (rows == "")//没有选择任务
    {
        App.setAlert(App.STATUS_NOTICE, " 你还没有选择任务！");
    }
    else {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].get("TaskState") != 6) {
                App.setAlert(App.STATUS_NOTICE, "任务[" + rows[i].get("PrjTaskTreeName") + "]不能进行此操作！");
                return;
            }
            TaskID.push(rows[i].get("TaskID"));
        }
        var jsonData = { OperateType: "RefuseBuy", TaskID: TaskID.join() };
        TaskTreeOperaMethod('TaskSubmitManage.aspx', jsonData);
        taskStore.reload();
    }
}
function ConfirmPublish() {
    var TaskID = [];
    var rows = taskTablePanel.getSelectionModel().getSelections();

    if (rows == "")//没有选择任务
    {
        App.setAlert(App.STATUS_NOTICE, " 你还没有选择任务！");
    }
    else {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].get("TaskState") != 1) {
                App.setAlert(App.STATUS_NOTICE, "任务[" + rows[i].get("PrjTaskTreeName") + "]不能进行此操作！");
                return;
            }
            TaskID.push(rows[i].get("TaskID"));
        }
        var jsonData = { OperateType: "ConfirmPublish", TaskID: TaskID.join() };
        TaskTreeOperaMethod('TaskSubmitManage.aspx', jsonData);
        taskStore.reload();
    }
}
function RefusePublish() {
    var TaskID = [];
    var rows = taskTablePanel.getSelectionModel().getSelections();

    if (rows == "")//没有选择任务
    {
        App.setAlert(App.STATUS_NOTICE, " 你还没有选择任务！");
    }
    else {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].get("TaskState") != 1) {
                App.setAlert(App.STATUS_NOTICE, "任务[" + rows[i].get("PrjTaskTreeName") + "]不能进行此操作！");
                return;
            }
            TaskID.push(rows[i].get("TaskID"));
        }
        var jsonData = { OperateType: "RefusePublish", TaskID: TaskID.join() };
        TaskTreeOperaMethod('TaskSubmitManage.aspx', jsonData);
        taskStore.reload();
    }
}
function SuspendTask() {
    var TaskID = [];
    var rows = taskTablePanel.getSelectionModel().getSelections();
    if (rows == "")//没有选择任务
    {
        App.setAlert(App.STATUS_NOTICE, " 你还没有选择任务！");
    }
    else {
        for (var i = 0; i < rows.length; i++) {
            TaskID.push(rows[i].get("TaskID"));
        }
        var jsonData = { OperateType: "SuspendTask", TaskID: TaskID.join() };
        TaskTreeOperaMethod('TaskSubmitManage.aspx', jsonData);
        taskStore.reload();
    }
}
function UnsuspendTask() {
    var TaskID = [];
    var rows = taskTablePanel.getSelectionModel().getSelections();
    if (rows == "")//没有选择任务
    {
        App.setAlert(App.STATUS_NOTICE, " 你还没有选择任务！");
    }
    else {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].get("TaskState") > 0) {
                App.setAlert(App.STATUS_NOTICE, "任务[" + rows[i].get("PrjTaskTreeName") + "]不能进行此操作！");
                return;
            }
            TaskID.push(rows[i].get("TaskID"));
        }
        var jsonData = { OperateType: "UnsuspendTask", TaskID: TaskID.join() };
        TaskTreeOperaMethod('TaskSubmitManage.aspx', jsonData);
        taskStore.reload();
    }
}
function taskDelete(btn) {
    if (btn == 'yes') {
        var TaskID = [];
        var rows = taskTablePanel.getSelectionModel().getSelections();
        for (var i = 0; i < rows.length; i++) {
            var state_temp = rows[i].get("TaskState")
            if (state_temp == '0' || state_temp == '16' || state_temp == '20' || state_temp < 0) {
                TaskID.push(rows[i].get("TaskID"));
            }
            else {
                App.setAlert(App.STATUS_NOTICE, "任务[" + rows[i].get("PrjTaskTreeName") + "]的当前状态不能进行删除操作！");
                return;
            }

        }
        var jsonData = { OperateType: OperateType, TaskID: TaskID.join() };
        TaskTreeOperaMethod('TaskSubmitManage.aspx', jsonData);
        taskStore.reload();
    }
}
//-------------------------------------------------------------------------------------
var TaskDicWordconn = Ext.lib.Ajax.getConnectionObject().conn;
TaskDicWordconn.open("POST", "DataProcess.aspx?OperateType=TaskDicWord", false);
TaskDicWordconn.send(null);
var responseText = TaskDicWordconn.responseText;

var TaskDicWordtpl = new Ext.Template(
         '<br>',
            '<p><b>任务详细信息:</b> {TaskDetailInf:this.ShowDes()}</p>'
        );

TaskDicWordtpl.ShowDes = function (Description) {

    var TaskDicWordJson = Ext.util.JSON.decode(responseText);

    var xmlDoc;
    if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(Description, "text/xml");
    }
    else // Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(Description);
    }
    var s = "";
    var nodes = xmlDoc.firstChild.childNodes;
    var k;
    for (i = 0; i < nodes.length; i++) {
        s += "<b>[" + (TaskDicWordJson[nodes[i].nodeName] == undefined ? "未知属性" : TaskDicWordJson[nodes[i].nodeName]) + "]:</b>" + nodes[i].text + ",";
    }
    return s.substr(0, s.length - 1);
}
var TaskDicWordexpander = new Ext.ux.grid.RowExpander({
    tpl: TaskDicWordtpl

});
var taskProxy = new Ext.data.HttpProxy({
    url: 'TaskTableData.aspx'
});

var taskReader = new Ext.data.JsonReader(
                    { root: 'rows', totalProperty: 'results' },
                        [
                        { name: "TaskID" },
                        { name: "TaskTemplateID" },
                        { name: "TaskDetailInf" },
                        { name: "WorkFlowName" },
                        { name: "BelongProjectTreeNode" },
                        { name: "PrjTaskTreeName" },
                        { name: "BelongProject" },
                        { name: "ProjectName" },
                        { name: "TaskState" },
                        { name: "TaskStateName" },
                        { name: "TaskCreator" },
                        { name: "FileName" },
                        { name: "CreatorName" },
                        { name: "TaskCreateDate" }
                        ]
                    );

var taskStore = new Ext.data.Store(
                        { id: 'taskStore', proxy: taskProxy, reader: taskReader }
                    );


var taskPageBar = new Ext.PagingToolbar({
    store: taskStore,
    pageSize: taskPageSize,
    plugins: new Ext.ui.plugins.ComboPageSize(),
    displayInfo: true,
    displayMsg: '总记录数 {0} - {1} of {2}',
    emptyMsg: "没有记录",
    id: 'taskPageBar'
});
var taskTablePanel_sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });
var taskTablePanel = new Ext.grid.GridPanel({
    title: '任务列表',
    id: "taskTablePanel",
    viewConfig: { autoFill: true },
    region: 'center',
    frame: true,
    store: taskStore,
    plugins: TaskDicWordexpander,
    height: 400,
    tbar: tasktbar,
    bbar: taskPageBar,
    sm: taskTablePanel_sm,
    loadMask: true,
    //    listeners: {//监听
    //        "rowdblclick": taskDataEdit
    //    },
    columns: [TaskDicWordexpander,
                    new Ext.grid.RowNumberer(),
                    taskTablePanel_sm,
                    { header: '任务名', dataIndex: 'PrjTaskTreeName', sortable: true },
                    { header: '已绑定的流程', dataIndex: 'WorkFlowName', sortable: true },
                    { header: '归属项目', dataIndex: 'ProjectName', sortable: true },
                    { header: '任务状态', dataIndex: 'TaskStateName', sortable: true, renderer: showSuspend },
                    { header: '创建人', dataIndex: 'CreatorName', sortable: true },
                    { header: '创建时间', dataIndex: 'TaskCreateDate', sortable: true },
                                        {
                                            xtype: 'actioncolumn',
                                            width: 40,
                                            header: '文件操作',
                                            items: [{
                                                //icon: '../../../images/add.png',
                                                //tooltip: '启用字典词',
                                                getClass: function (val, meta, record, rowindex, colindex) {
                                                    var status = record.get('FileName');
                                                    if (status != '-1') {
                                                        this.items[0].tooltip = status;
                                                        return 'download-icon';

                                                    }
                                                    else {
                                                        this.items[0].tooltip = '无文件!';
                                                        return 'UnEnabledownload-icon';

                                                    }
                                                },
                                                handler: function (grid, rowIndex, colIndex) {
                                                    var rec = taskStore.getAt(rowIndex);
                                                    if (rec.get('FileName') != '-1')
                                                        FileDownLoad(rec.get('FileName'))
                                                }
                                            }]
                                        }
            ]
});

function FileDownLoad(filename) {
    //  window.open("10.15.43.242");
    //   filename = rows[0].get('name');
    var jsonData = { fileOperateType: 'download', filename: filename }
    if (!Ext.fly('test')) {
        var frm = document.createElement('form');
        frm.id = 'test';
        frm.name = id;
        frm.style.display = 'none';
        document.body.appendChild(frm);
    }
    Ext.Ajax.request({
        url: 'DfileDownLoad.aspx',
        form: Ext.fly('test'),
        method: 'POST',
        params: jsonData,
        isUpload: true
    });

}
function showSuspend(val) {
    if (val == null || val == '')
        return "挂起中";
    else
        return val;
}
taskStore.load({ params: { start: 0, limit: taskPageSize} });