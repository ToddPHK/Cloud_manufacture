var taskPageSize = 10;


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
    if (Description == "") {
        return "无";
    }
    else {
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
                        { name: "FileName" },
                        { name: "TaskDetailInf" },
                        { name: "TaskCreateDate" },
                        { name: "TaskStateName" },
                         { name: "TypeName" },
                        { name: "NodeCreateDate" },
                        { name: "WorkFlowName" },
                        { name: "ProjectName" },
                        { name: "PrjTaskTreeName" },
                        { name: "CreatorName" },
                        { name: "ChargorName" }
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



var taskTablePanel = new Ext.grid.GridPanel({
   // title: '任务纵览',
    //id: "taskTablePanel",
    viewConfig: { autoFill: true },
    region: 'center',
    frame: true,
    store: taskStore,
    plugins: TaskDicWordexpander,
    height: 400,
    bbar: taskPageBar,
    sm: taskTablePanel_sm,
    loadMask: true,
    columns: [TaskDicWordexpander,
                    new Ext.grid.RowNumberer(),
                    taskTablePanel_sm,
                    { header: '任务名', dataIndex: 'PrjTaskTreeName', sortable: true },
                     { header: '任务状态', dataIndex: 'TaskStateName', sortable: true, renderer: showSuspend },
                      { header: '任务类型', dataIndex: 'TypeName', sortable: true },
                       { header: '归属流程', dataIndex: 'WorkFlowName', sortable: true },
                        { header: '归属项目', dataIndex: 'ProjectName', sortable: true },
                    { header: '任务创建人', dataIndex: 'CreatorName', sortable: true },
                     { header: '节点创建人', dataIndex: 'ChargorName', sortable: true },
                       { header: '任务创建时间', dataIndex: 'TaskCreateDate', sortable: true },
                    { header: '节点创建时间', dataIndex: 'NodeCreateDate', sortable: true},
                    { header: '任务文件', dataIndex: 'FileName', sortable: true, renderer: showFileName }

            ]
});


function showSuspend(val) {
    if (val <0)
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

var ViewTask_Window = new Ext.Window({
    layout: 'fit',
    width: 1000,
    minHeight: 200,
    modal: true,
    closeAction: "hide",
    plain: true,
    title: '任务纵览',
    bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: taskTablePanel,
    buttons: [{
        text: '关闭',
        //点击保存按钮后触发事件  
        handler: function () {

            ViewTask_Window.close();
        }
    }]
});