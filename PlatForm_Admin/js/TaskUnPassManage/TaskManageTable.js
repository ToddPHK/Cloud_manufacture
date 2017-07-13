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

    }, '->', '发布企业', TaskEnt_Search, "标准任务类:", StandardTask_ComboBox, '任务名:', TaskName_Search, {
        id: 'taskbtnSearch',
        text: "搜索",
        iconCls: 'search-icon',
        handler: taskDataSearch
    }]

});


function taskDataSearch() {
    taskStore.removeAll();
    if (StandardTask_ComboBox.node == undefined)
        taskStore.baseParams.StandardTaskID = "";
    else
        taskStore.baseParams.StandardTaskID = StandardTask_ComboBox.node.id;
    taskStore.baseParams.TaskName = TaskName_Search.getValue();
    taskStore.baseParams.TaskEnt = TaskEnt_Search.getValue();
    taskStore.baseParams.OperateType = "search";
    taskStore.reload();
    taskPageBar.changePage(1);
}


function taskDelete(btn) {
    if (btn == 'yes') {
        var TaskID = [];
        var rows = taskTablePanel.getSelectionModel().getSelections();
        for (var i = 0; i < rows.length; i++) {
            TaskID.push(rows[i].get("ID"));
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
                        { name: "EntName" },
                        { name: "TaskDetailInf" },
                        { name: "TaskName" },
                        { name: "Publisher" },
                        { name: "WorkFlowName" },
                        { name: "PublishTime" },
                         { name: "TDeleteTime" },
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
    plugins: new Ext.ui.plugins.ComboPageSize(),
    store: taskStore,
    pageSize: taskPageSize,
    displayInfo: true,
    displayMsg: '总记录数 {0} - {1} of {2}',
    emptyMsg: "没有记录",
    id: 'taskPageBar'
});
var taskTablePanel_sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });
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
                    { header: '任务名', dataIndex: 'TaskName', sortable: true },
                    { header: '发布企业', dataIndex: 'EntName', sortable: true },
                    { header: '归属流程', dataIndex: 'WorkFlowName', sortable: true },
                    { header: '归属标准任务', dataIndex: 'StandardTaskName', sortable: true },
                    { header: '任务状态', dataIndex: 'TaskStateName', sortable: true },
                    { header: '发布时间', dataIndex: 'PublishTime', sortable: true },
                    { header: '审核不通过时间', dataIndex: 'TDeleteTime', sortable: true },
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