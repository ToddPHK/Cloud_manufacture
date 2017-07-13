var taskPageSize = 25, OperateType;
var TaskName_Search = new Ext.form.TextField({
    regex: /^[^\\'‘’]+$/,
    regexText: "不能包含单引号",
    width: 80
});
var TaskEnt_Search = new Ext.form.TextField({
    regex: /^[^\\'‘’]+$/,
    regexText: "不能包含单引号",
    width: 80
});
var StandardTask_Search = new Ext.tree.TreePanel({
    rootVisible: false,
    autoScroll: false,
    autoHeight: true,
    loader: new Ext.tree.TreeLoader({
        baseParams: { OperateType: 'StandardTaskTreeNoCheckBox' },
        dataUrl: 'DataProcess.aspx'
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
        text: "审核通过",
        iconCls: 'edit-icon',
        handler: ConfirmPass
    }, {
        text: "审核不通过",
        iconCls: 'edit-icon',
        handler: RefusePass
    }, {
        text: "确认交易完成",
        iconCls: 'edit-icon',
        handler: CompleteDeal
    }, {
        text: "即时消息",
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

                        UserIDs.push(rows[i].get("Publisher"));

                    }
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
                    App.setAlert(App.STATUS_NOTICE, "还未选择记录！");
                    SendShortMsg();
                }
            }

            //-----------------------------
        }
    });

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
                Ext.Msg.alert("", "请至少选择一行你要删除的数据！");
                return;
            }
            Ext.MessageBox.confirm('提示', '确实要删除所选的记录吗?', taskDelete);

        }

    }, '-', {
        text: "进度查看",
        iconCls: 'edit-icon',
        handler: ViewTaskProgress
    }, '-', {
        text: "任务操作",
        menu: Task_OperateMenu
    }, '->', '发布企业', TaskEnt_Search, "标准任务类:", StandardTask_ComboBox, '任务名:', TaskName_Search, {
        id: 'taskbtnSearch',
        text: "搜索",
        iconCls: 'search-icon',
        handler: taskDataSearch
    }]

});
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
            conn1.open("POST", "DataProcess.aspx?OperateType=ViewTaskProgress&TaskID=" + tempRec.get('ID'), false);
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
                Ext.getCmp('preview').body.update('<b><u>' + tempRec.get('TaskName') + '</u>  无进度或当前进度无法查看</b>');
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
function taskDataSearch() {
    taskStore.removeAll();
    if (StandardTask_ComboBox.node == undefined || StandardTask_ComboBox.getRawValue().match(/^[   |　]+$/) || StandardTask_ComboBox.getRawValue() == "")
        taskStore.baseParams.StandardTaskID = "";
    else
        taskStore.baseParams.StandardTaskID = StandardTask_ComboBox.node.id;
    taskStore.baseParams.TaskName = TaskName_Search.getValue();
    taskStore.baseParams.TaskEnt = TaskEnt_Search.getValue();
    taskStore.baseParams.OperateType = "search";
    taskStore.reload();
    taskPageBar.changePage(1);
}

function ConfirmPass() {
    var TaskID = [];
    var rows = taskTablePanel.getSelectionModel().getSelections();

    if (rows == "")//没有选择任务
    {
        App.setAlert(App.STATUS_NOTICE, " 你还没有选择任务！");
    }
    else {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].get("TaskState") != 3) {
                App.setAlert(App.STATUS_NOTICE, "任务[" + rows[i].get("TaskName") + "]不能进行此操作！");
                return;
            }
            TaskID.push(rows[i].get("ID"));
        }
        var jsonData = { OperateType: "ConfirmPass", TaskID: TaskID.join() };
        CodeOperaMethod('TaskSubmitManage.aspx', jsonData);
        taskStore.reload();
    }
}
function RefusePass() {
    var TaskID = [];
    var rows = taskTablePanel.getSelectionModel().getSelections();

    if (rows == "")//没有选择任务
    {
        App.setAlert(App.STATUS_NOTICE, " 你还没有选择任务！");
    }
    else {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].get("TaskState") != 3) {
                App.setAlert(App.STATUS_NOTICE, "任务[" + rows[i].get("TaskName") + "]不能进行此操作！");
                return;
            }
            TaskID.push(rows[i].get("ID"));
        }
        Ext.MessageBox.show({
            title: '提示',
            msg: '不通过理由:',
            width: 300,
            buttons: Ext.MessageBox.OK,
            multiline: true,
            fn: function (btn, text) {
                //--------------------
                if (btn == "ok") {
                    var jsonData = { OperateType: "RefusePass", TaskID: TaskID.join(), Message: text };
                    CodeOperaMethod('TaskSubmitManage.aspx', jsonData);
                    taskStore.reload();
                }

                //-----------------------------
            }
        });
    }
}


function CompleteDeal() {
    var TaskID = [];
    var rows = taskTablePanel.getSelectionModel().getSelections();

    if (rows == "")//没有选择任务
    {
        App.setAlert(App.STATUS_NOTICE, " 你还没有选择任务！");
    }
    else {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].get("TaskState") != 25) {
                App.setAlert(App.STATUS_NOTICE, "任务[" + rows[i].get("TaskName") + "]不能进行此操作！");
                return;
            }
            TaskID.push(rows[i].get("ID"));
        }
        var jsonData = { OperateType: "CompleteDeal", TaskID: TaskID.join() };
        CodeOperaMethod('TaskSubmitManage.aspx', jsonData);
        taskStore.reload();

    }

}
function taskDelete(btn) {
    if (btn == 'yes') {
        var TaskID = [];
        var rows = taskTablePanel.getSelectionModel().getSelections();

        for (var i = 0; i < rows.length; i++) {
            var TaskStateTemp = rows[i].get("TaskState");
            if (TaskStateTemp < 0 || TaskStateTemp == 0 || TaskStateTemp == 2 || TaskStateTemp == 5 || TaskStateTemp == 7 || TaskStateTemp == 11 || TaskStateTemp == 16 || TaskStateTemp == 20 || TaskStateTemp == 23 || TaskStateTemp == 24) {
                TaskID.push(rows[i].get("ID"));

            }
            else {
                App.setAlert(App.STATUS_NOTICE, "[" + rows[i].get("TaskName") + "]任务当前不能进行删除操作！");
                return;
            }

        }
        var jsonData = { OperateType: OperateType, TaskID: TaskID.join() };
        CodeOperaMethod('TaskSubmitManage.aspx', jsonData);
        taskStore.reload();
        taskTablePanel.store.reload();
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

    var TaskDicWordJson = Ext.util.JSON.decode(responseText); //responseText  见 Panel.js

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
                        { name: "ID" },
                        { name: "Publisher" },
                        { name: "EntName" },
                        { name: "TaskDetailInf" },
                        { name: "TaskName" },
                        { name: "Publisher" },
                        { name: "WorkFlowName" },
                        { name: "PublishTime" },
                        { name: "OperateTime" },
                        { name: "TaskState" },
                        { name: "StandardTaskName" },
                        { name: "FileName" },
                        { name: "TaskStateName" }
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
    title: '任务管理',
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
                    { header: '任务名', dataIndex: 'TaskName', sortable: true },
                    { header: '发布企业', dataIndex: 'EntName', sortable: true },
                    { header: '归属流程', dataIndex: 'WorkFlowName', sortable: true },
                    { header: '归属标准任务', dataIndex: 'StandardTaskName', sortable: true },
                    { header: '任务状态', dataIndex: 'TaskStateName', sortable: true },
                    { header: '发布时间', dataIndex: 'PublishTime', sortable: true },
                    { header: '最新操作时间', dataIndex: 'OperateTime', sortable: true },
                    { header: '任务文件', dataIndex: 'FileName', sortable: true, renderer: showFileName },
                                        {
                                            xtype: 'actioncolumn',
                                            width: 40,
                                            header: '文件操作',
                                            items: [{
                                                //icon: '../../../images/add.png',
                                                //tooltip: '启用字典词',
                                                getClass: function (val, meta, record, rowindex, colindex) {
                                                    var status = record.get('FileName');
                                                    if (status != '-1' && status != '') {
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
                                                        FileDownLoad(rec.get('FileName'), rec.get('EntName'))
                                                }
                                            }]
                                        }

            ]
});

function FileDownLoad(filename, EntName) {

    var jsonData = { fileOperateType: 'download', filename: filename, EntName: EntName }
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
function showDescription(val) {
    if (val != null && val != '')
        return unescape(val);
    else
        return "无";
}
function showFileName(val) {
    if (val == '-1')
        return '';
    else
        return val;
}
taskStore.load({ params: { start: 0, limit: taskPageSize} });