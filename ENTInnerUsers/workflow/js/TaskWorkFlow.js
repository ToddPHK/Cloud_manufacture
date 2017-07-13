var taskPageSize = 10, taskOperaType;
var WorkFlowIDHidden = new Ext.form.Hidden({
    // xtype: 'hidden',
    name: 'WorkFlowID'
});
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
var tasktbar = new Ext.Toolbar({
    items: ['->', "标准任务类:", StandardTask_ComboBox, "项目树:", ProjectTask_ComboBox, '任务名：', TaskName_Search, {
        id: 'taskbtnSearch',
        text: "搜索",
        handler: taskDataSearch
    }]
});
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
    taskStore.load();
    taskStore.reload();
}
var taskProxy = new Ext.data.HttpProxy({
    url: 'TaskTableData.aspx'
    //method: 'GET'
});
var taskReader = new Ext.data.JsonReader(
                    { root: 'rows', totalProperty: 'results' },
                        [
                        { name: "TaskID" },
                        { name: "TaskTemplateID" },
                        { name: "TaskDetailInf" },
                        { name: "BelongProjectTreeNode" },
                        { name: "PrjTaskTreeName" },
                        { name: "BelongProject" },
                        { name: "ProjectName" },
                        { name: "TaskState" },
                        { name: "TaskStateName" },
                        { name: "TaskCreator" },
                        { name: "CreatorName" },
                        { name: "TaskCreateDate" }
                        ]
                    );
var taskStore = new Ext.data.Store(
                        { id: 'taskStore', proxy: taskProxy, reader: taskReader }
                    );
//var taskpagenumber = new Ext.data.SimpleStore({
//    fields: ['id', 'genre'],
//    data: [['0', '10'], ['0', '20'], ['1', '30'], ['2', '40'], ['3', '50']]
//});

//var taskPageNumberCombo = new Ext.form.ComboBox({
//    store: taskpagenumber,
//    id: 'taskpagenumber',
//    displayField: 'genre', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
//    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
//    emptyText: '每页记录数',
//    triggerAction: 'all',
//    width: 100


//});

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
    })
var taskPageBar = new Ext.PagingToolbar({
    store: taskStore,
    pageSize: taskPageSize,
    plugins: new Ext.ui.plugins.ComboPageSize(),
    displayInfo: true,
    displayMsg: '总记录数 {0} - {1} of {2}',
    emptyMsg: "没有记录",
    id: 'taskPageBar'
});
var taskTablePanel_sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: true });
var taskTablePanel = new Ext.grid.GridPanel({
    // title: '任务管理',
    id: "taskTablePanel",
    store: taskStore,
    height: 400,
    frame:false,
    tbar: tasktbar,
    bbar: taskPageBar,
    plugins: TaskDicWordexpander,
     sm: taskTablePanel_sm,
    loadMask: true,
    columns: [TaskDicWordexpander,
                    new Ext.grid.RowNumberer(),
                    taskTablePanel_sm,
                    { header: '任务名', dataIndex: 'PrjTaskTreeName', sortable: true },
                    { header: '归属项目', dataIndex: 'ProjectName', sortable: true },
                    { header: '任务状态', dataIndex: 'TaskStateName', sortable: true },
                    { header: '创建人', dataIndex: 'CreatorName', sortable: true },
                    { header: '创建时间', dataIndex: 'TaskCreateDate', sortable: true }
            ]
});

taskStore.load({ params: { start: 0, limit: taskPageSize} });


function BindingTask(cell) {
    var TaskListWindow = new Ext.Window({
        title: '任务列表',
        modal: true,
        width: 700,
        height: 400,
        minWidth: 300,
        minHeight: 100,
        layout: 'fit',
        closeAction: 'hide',
        plain: true,
        bodyStyle: 'padding:5px;',
        buttonAlign: 'center',
        items: taskTablePanel,
        buttons: [{
            text: '绑定',
            handler: function () {
                if (NodeWindow.creator != CurrentUserID) {
                    App.setAlert(App.STATUS_NOTICE, "你不是该流程的创建人，无权进行此操作！");
                    return;
                }
                var Rec = Ext.getCmp("taskTablePanel").getSelectionModel().getSelected();
                var PreTaskID = cell.getTaskID();
                if (PreTaskID == null)
                    PreTaskID = "NoPreTask";
                var TaskID = Rec.get('TaskID');
                cell.setTask(Rec.get('PrjTaskTreeName'));
                cell.setAttribute('label', Rec.get('PrjTaskTreeName'));
                cell.setTaskID(TaskID);
                cell.setMyState(Rec.get('TaskState'));
                graph.setCellStyles(mxConstants.STYLE_GRADIENTCOLOR, State_Color[Rec.get('TaskState')], graph.setSelectionCell(cell));
                graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, State_Color[Rec.get('TaskState')], graph.setSelectionCell(cell));
                var WorkFlowID = NodeWindow.CurrentWorkFlowID;

                var TaskDicWordconn = Ext.lib.Ajax.getConnectionObject().conn;
                TaskDicWordconn.open("POST", "workFlowHandler.ashx?OperateType=BadingTask&WorkFlowID=" + WorkFlowID + "&TaskID=" + Rec.get('TaskID') + "&PreTaskID=" + PreTaskID, false);
                TaskDicWordconn.send(null);
                var responseText = TaskDicWordconn.responseText;
                if (responseText == 'failure') {
                    App.setAlert(App.STATUS_NOTICE, "操作失败！");
                }
                else if (responseText == 'success') {
                    TaskListWindow.hide();
                }

                else
                    App.setAlert(App.STATUS_NOTICE, "系统错误！");

            }
        }]
    });
    TaskListWindow.show();
}
