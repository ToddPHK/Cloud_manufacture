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
    url: 'DataProcess.aspx'
});

var taskReader = new Ext.data.JsonReader(
                    { root: 'rows', totalProperty: 'results' },
                        [
                        { name: "TaskID" },
                        { name: "TaskTemplateID" },
                        { name: "TaskDetailInf" },
                        { name: "TaskName" },
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





var taskTablePanel = new Ext.grid.GridPanel({
  //  title: '任务管理',
    //id: "taskTablePanel",
    viewConfig: { autoFill: true },
    region: 'center',
    frame: false,
    store: taskStore,
    plugins: TaskDicWordexpander,
    height: 400,
    loadMask: true,
    columns: [TaskDicWordexpander,
                    new Ext.grid.RowNumberer(),
                    { header: '任务名', dataIndex: 'PrjTaskTreeName', sortable: true },
                    { header: '归属项目', dataIndex: 'ProjectName', sortable: true },
                    { header: '任务状态', dataIndex: 'TaskStateName', sortable: true, renderer: showSuspend },
                    { header: '创建人', dataIndex: 'CreatorName', sortable: true },
                    { header: '创建时间', dataIndex: 'TaskCreateDate', sortable: true }
            ]
});


function showSuspend(val) {
    if (val == null || val == '')
        return "挂起中";
    else
        return val;
}

taskTablePanel.on("rowcontextmenu", function (grid, rowIndex, e) {
    taskTablePanel.getSelectionModel().selectRow(rowIndex);
    menu = new Ext.menu.Menu([{
        text: "查看服务",
        handler: function () {
            var rec = taskTablePanel.getSelectionModel().getSelected();
            TaskID = rec.get("TaskID");
            window.open("../../../../../CloudMfg_SRMS/ServiceSearch.aspx?TaskID=" + TaskID);
        }
    }])
    menu.showAt(e.getPoint());
});


var TaskServeChoose_Window = new Ext.Window({
    layout: 'border',
    title: '任务列表',
    width: 800,
    height: 600,
    closeAction: 'hide',
    draggable: true,
    resizable: false,
    shadow: true,
    modal: true,
    closable: true,
    animCollapse: true,
    items: taskTablePanel
});
function showService_EditWindow(cell) {
    TaskServeChoose_Window.show();

        taskStore.load({ params: { OperateType: 'WorkFlowTask', WorkFlowID: NodeWindow.CurrentWorkFlowID} });

  

}


