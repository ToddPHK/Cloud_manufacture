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
var Task_EditMenu = new Ext.menu.Menu({
    items: [{
        id: 'taskbtnAdd',
        text: "添加",
        iconCls: 'add-icon',
        handler: TaskCreate
    }, '-', {
        id: 'taskbtnEdit',
        text: "编辑",
        iconCls: 'edit-icon',
        handler: taskDataEdit
    }, '-', {
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

    }]
});
var button2 = new Ext.Button({
    text: "查找服务",
    listeners: {
        "click": tt
    }
})
function tt() {
    alert("Hello");
}
var button3 = new Ext.Button({
    text: "发布流程任务",
    listeners: {
        "click": function () {

        }
    }
})



var tasktbar = new Ext.Toolbar({
    items: [{
        text: "任务编辑",
        menu: Task_EditMenu
    }, '-', {
        text: "任务操作",
        pressed: false,
        enableToggle: true,
        id: 'Task_Operate',
        iconCls: 'edit-icon',
        toggleHandler: ShowTaskOperateWin
        //   menu: Task_OperateMenu
    }, '-', {
        text: "上传",
        iconCls: 'upload-icon',
        handler: UploadFile
    }, '->', "标准任务类:", StandardTask_ComboBox, "项目树:", ProjectTask_ComboBox, '任务名:', TaskName_Search, {
        id: 'taskbtnSearch',
        text: "搜索",
        iconCls: 'search-icon',
        handler: taskDataSearch
    }]

});
function ShowTaskOperateWin(btn, pressed) {
    //   var preview = Ext.getCmp('Task_Operate');
    TaskOperationWin[pressed ? 'show' : 'hide']();
    //   preview.ownerCt.doLayout();
    //    TaskOperationWin.show();
}
function UploadFile() {

    if (!taskTablePanel.getSelectionModel().hasSelection())//没有选择任务
    {
        App.setAlert(App.STATUS_NOTICE, " 你还没有选择任务！");
    }
    else {
        var TaskID = [];
        var rows = taskTablePanel.getSelectionModel().getSelections();
        if (rows.length > 1) {
            App.setAlert(App.STATUS_NOTICE, " 一次只能为一个任务上传文件！");
        }
        else {
            FileUpLoadWindow.TaskID = rows[0].get("TaskID");
            FileUpLoadWindow.FileName = rows[0].get("FileName");
            FileUpLoadWindow.show();
        }

    }
}

function TaskCreate() {
    if (ProjectTaskTreePanel.getChecked()[0] == undefined) {
        App.setAlert(App.STATUS_NOTICE, "请在[企业项目任务]中选中一个节点！");
    }
    else {
        OperateType = 'Createtask';
        TaskCreate_Window.setTitle("任务创建");
        TaskCreate_Window.show();
    }
}
function taskDataEdit() {
    var rec = taskTablePanel.getSelectionModel().getSelected();

    if (rec == undefined) {
        App.setAlert(App.STATUS_NOTICE, "请你选择一个要编辑的任务！");

    }
    else {
        if (rec.get("TaskCreator") != CurrentUserID) {
            App.setAlert(App.STATUS_NOTICE, "你不是[" + rec.get("PrjTaskTreeName") + "]任务的创建人，不能编辑该任务！");
            return;
        }
        var TaskStateTemp = rec.get("TaskState");
        if (TaskStateTemp <= 0 || TaskStateTemp == 2 || TaskStateTemp == 5 || TaskStateTemp == 7 || TaskStateTemp == 11 || TaskStateTemp == 23 || TaskStateTemp == 24) {
            OperateType = 'EditTask';
            TaskCreate_Window.setTitle("编辑任务——" + rec.get("PrjTaskTreeName"));
            TaskCreate_Window.show();
            //-----------------------------
            StandardTaskTreePanel.expandAll();
            var nodetemp = StandardTaskTreePanel.getNodeById(rec.get("StandardTaskID"));
            alert(nodetemp.id);
            nodetemp.getUI().checkbox.checked = true;
            nodetemp.attributes.checked = true;
           // StandardTaskTreePanel.fireEvent('check', nodetemp, true);
            //--------------------------------------
            var conn1 = Ext.lib.Ajax.getConnectionObject().conn;
            conn1.open("POST", "DataProcess.aspx?OperateType=GetTaskTemplateName&TaskTemplateID=" + rec.get("TaskTemplateID"), false);
            conn1.send(null);
            var TaskTemplateName = conn1.responseText;
            if (TaskTemplateName != "Erro") {
                var TaskDetailInf = rec.get("TaskDetailInf");

                var xmlDoc;
                if (window.DOMParser) {
                    parser = new DOMParser();
                    xmlDoc = parser.parseFromString(TaskDetailInf, "text/xml");
                }
                else // Internet Explorer
                {
                    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async = "false";
                    xmlDoc.loadXML(TaskDetailInf);
                }
                var nodes = xmlDoc.firstChild.childNodes;

                clearInterval(IntervalID);

                LoadTaskTemplateInti(TaskTemplateName, nodes)
                //                for (i = 0; i < nodes.length; i++) {
                //                    if (Ext.getCmp(TaskTemplateName).getForm().findField(nodes[i].nodeName) != null)
                //                        Ext.getCmp(TaskTemplateName).getForm().findField(nodes[i].nodeName).setValue(nodes[i].text);
                //                }

            }
            else
                App.setAlert(App.STATUS_NOTICE, "数据加载出错，请刷新！");
        }
        else {
            App.setAlert(App.STATUS_NOTICE, "该任务的状态不能进行编辑操作！");
        }

    }


}



function LoadTaskTemplateInti(TemplateName, nodes) {
    var loadMarsk = new Ext.LoadMask('TaskCreate_Window', {
        msg: '正在加载模板，请稍候......',
        removeMask: true// 完成后移除
    });
    loadMarsk.show(); //显示
    function taskMould_Add() {
        s = document.createElement("script");
        s.type = "text/javascript";
        s.id = TemplateName + "Template_Now";
        s.src = "../../../TaskMould/" + TemplateName + ".js";
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(s);
    }


    var tag = document.getElementById(TemplateName + "Template_Now");

    if (tag == null) {
        taskMould_Add();
        tag = document.getElementById(TemplateName + "Template_Now");
        //-----------------
        var start = new Date().getTime();


        //---------------------------
        IntervalID = setInterval(function () {
            if (Ext.getCmp(TemplateName) != undefined) {
                CardPanel.add(Ext.getCmp(TemplateName));
                CardPanel.doLayout();
                CardPanel.layout.setActiveItem(Ext.getCmp(TemplateName));
                for (i = 0; i < nodes.length; i++) {
                    if (Ext.getCmp(TemplateName).getForm().findField(nodes[i].nodeName) != null)
                        Ext.getCmp(TemplateName).getForm().findField(nodes[i].nodeName).setValue(nodes[i].text);
                }
                loadMarsk.hide(); //隐藏
                clearInterval(IntervalID);

            }
            else {
                if (new Date().getTime() - start > 30000) {
                    Ext.MessageBox.confirm('提示', '加载时间过长，继续加载?', NoLoad);
                }
            }
        }, 3000)

        function NoLoad(btn) {

            if (btn == 'no') {
                loadMarsk.hide(); //隐藏
                tag.removeNode();
                clearInterval(IntervalID);
            }
            else {
                tag.removeNode();
                taskMould_Add();
                start = new Date().getTime();
            }

        }
        //-------------------------------
    }
    else {
        CardPanel.layout.setActiveItem(Ext.getCmp(TemplateName));
        for (i = 0; i < nodes.length; i++) {
            if (Ext.getCmp(TemplateName).getForm().findField(nodes[i].nodeName) != null)
                Ext.getCmp(TemplateName).getForm().findField(nodes[i].nodeName).setValue(nodes[i].text);
        }
        loadMarsk.hide(); //隐藏
    }

}


function taskDataSearch() {
    taskStore.removeAll();
    if (StandardTask_ComboBox.node == undefined || StandardTask_ComboBox.getRawValue().match(/^[   |　]+$/) || StandardTask_ComboBox.getRawValue() == "")
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
function PublishTask() {
    OperateType = 'TaskPublish';
    var TaskID = [];
    var rows = taskTablePanel.getSelectionModel().getSelections();
    for (var i = 0; i < rows.length; i++) {
        TaskID.push(rows[i].get("TaskID"));
    }
    var jsonData = { taskOperaType: taskOperaType, TaskID: TaskID.join() };
    TaskTreeOperaMethod('TaskHandler.ashx', jsonData);
}
function taskDelete(btn) {
    if (btn == 'yes') {
        var TaskID = [];
        var rows = taskTablePanel.getSelectionModel().getSelections();
        for (var i = 0; i < rows.length; i++) {
            var TaskStateTemp = rows[i].get("TaskState");
            if (rows[i].get("TaskCreator") != CurrentUserID) {
                App.setAlert(App.STATUS_NOTICE, "你不是[" + rows[i].get("PrjTaskTreeName") + "]任务的创建人，不能编辑该任务！");
                return;
            }
            if (TaskStateTemp < 0 || TaskStateTemp == 0 || TaskStateTemp == 2 || TaskStateTemp == 5 || TaskStateTemp == 7 || TaskStateTemp == 11 || TaskStateTemp == 16 || TaskStateTemp == 20 || TaskStateTemp == 23 || TaskStateTemp == 24) {

                TaskID.push(rows[i].get("TaskID"));
            }
            else {
                App.setAlert(App.STATUS_NOTICE, "[" + rows[i].get("PrjTaskTreeName") + "]任务当前的状态不能进行删除操作！");
                return;

            }

        }
        var jsonData = { OperateType: OperateType, TaskID: TaskID.join() };
        TaskTreeOperaMethod('TaskSubmitManage.aspx', jsonData);
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
                        { name: "StandardTaskID" },
                        { name: "TypeName" },
                        { name: "TypeID" },
                        { name: "ProjectChargorID" },
                        { name: "TaskDetailInf" },
                        { name: "WorkFlowName" },
                        { name: "WorkFlowID" },
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
    plugins: new Ext.ui.plugins.ComboPageSize(),
    pageSize: taskPageSize,
    displayInfo: true,
    displayMsg: '总记录数 {0} - {1} of {2}',
    emptyMsg: "没有记录",
    id: 'taskPageBar'
});
var taskTablePanel_sm = new Ext.grid.CheckboxSelectionModel({
    singleSelect: true
});
taskTablePanel_sm.on('rowselect', function (sm, rowIndex, rec) {

//    if (rec.get("TaskCreator") == CurrentUserID) {
//        TaskOperation_Panel.getTopToolbar().enable();
        SetOptBtnState(rec);
//    }
//    else {
//        TaskOperation_Panel.getTopToolbar().disable();

//    }
})
taskTablePanel_sm.on('selectionchange', function (sm) {

    if (!sm.hasSelection()) {
        var tbtns = TaskOperation_Panel.getTopToolbar().findByType('button');
        for (i = 0; i < tbtns.length; i++) {
            tbtns[i].disable();
        }
        Btn_RefreashTaskState.enable();
    }

})

function GetSelectedTask_ProjectChargor() {
    if (n == 1) return 1;
    else return n + digui(n - 1);
}
var taskTablePanel = new Ext.grid.GridPanel({
    title: '任务管理',
    //id: "taskTablePanel",
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
                    { header: '任务ID', dataIndex: 'TaskID',width:50, sortable: true },
                    { header: '任务名', dataIndex: 'PrjTaskTreeName', sortable: true },
                    { header: '已绑定的流程', dataIndex: 'WorkFlowName', sortable: true },
                     { header: '归属项目', dataIndex: 'ProjectName', sortable: true },
                       { header: '任务类型', dataIndex: 'TypeName', width: 50, sortable: true },
                    { header: '任务状态', dataIndex: 'TaskStateName', sortable: true, renderer: showSuspend },
                    { header: '创建人', dataIndex: 'CreatorName', width: 70, sortable: true },
                    { header: '创建时间', dataIndex: 'TaskCreateDate', sortable: true },
    //      { header: '文件', dataIndex: 'FileName', sortable: true, renderer: showFileName },
                    {
                    xtype: 'actioncolumn',
                    width: 50,
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


function showSuspend(val) {
    if (val == null || val == '')
        return "挂起中";
    else
        return val;
}
function showFileName(val) {
    if (val == -1)
        return "";
    else
        return val;
}

taskStore.load({ params: { start: 0, limit: taskPageSize} });