//------------加载工作流----------
function LoadNewWorkFlow() {
    LoadWFWindow.show();
}

var WorkFlowtbar = new Ext.Toolbar({
    items: [{
        text: "通过审核",
        handler: ConfirmWFPass
    }, '-', {
        text: "不通过审核",
        handler: ConfirmWFNoPass

    }, '-', {
        id: 'WorkFlowbtnDel',
        text: "删除",
        handler: function () {
            rows = Ext.getCmp("WorkFlowTablePanel").getSelectionModel().getSelections();
            if (rows.length == 0) {
                Ext.Msg.alert("", "请至少选择一行你要删除的数据！");
                return;
            }
            Ext.MessageBox.confirm('提示', '确实要删除所选的记录吗?', WorkFlowDelete);

        }

    }, '-', {
        text: "更新流程状态",
        handler: RefreshWorkFlowState

    }, '->', new Ext.Toolbar.TextItem('工作流名称：'), { xtype: 'textfield', id: 'WorkFlowSearch' }, {
        id: 'WorkFlowSearchBtn',
        text: "搜索",
        iconCls: 'search-icon',
        handler: WorkFlowSearch
    }]

});
function ConfirmWFPass() {
    var WorkFlowID = [];

    if (WorkFlowTablePanel.getSelectionModel().hasSelection()) {
        var rows = WorkFlowTablePanel.getSelectionModel().getSelections();
        for (var i = 0; i < rows.length; i++) {

            if (rows[i].get("State") != 7 && rows[i].get("State") != 16) {
                Ext.Msg.alert("提示", "任务[" + rows[i].get("name") + "]当前的状态不能进行此操作！");
                return;
            }
            WorkFlowID.push(rows[i].get("ID"));
        }
        var TaskDicWordconn = Ext.lib.Ajax.getConnectionObject().conn;
        TaskDicWordconn.open("POST", "workFlowHandler.ashx?OperateType=ConfirmWFPass&WorkFlowID=" + WorkFlowID, false);
        TaskDicWordconn.send(null);
        var responseText = TaskDicWordconn.responseText;
        if (responseText == 'success') {
            Ext.Msg.alert("提示", "操作成功,如果操作的流程含有当前加载的流程，请重新加载！");
            WorkFlowStore.reload();
        }
        else if (responseText == 'failure') {
            Ext.Msg.alert("提示", "操作失败！");
        }
        else
            Ext.Msg.alert("提示", "系统错误！");
    }
    else {
        Ext.Msg.alert("提示", "请选择一个你要操作的流程！");
    }
}
function ConfirmWFNoPass() {
    var WorkFlowID = [];

    if (WorkFlowTablePanel.getSelectionModel().hasSelection()) {
        var rows = WorkFlowTablePanel.getSelectionModel().getSelections();
        for (var i = 0; i < rows.length; i++) {

            if (rows[i].get("State") != 7 && rows[i].get("State") != 16) {
                Ext.Msg.alert("提示", "流程[" + rows[i].get("name") + "]的当前状态不能进行该操作！");
                return;
            }
            WorkFlowID.push(rows[i].get("ID"));
        }
        var TaskDicWordconn = Ext.lib.Ajax.getConnectionObject().conn;
        TaskDicWordconn.open("POST", "workFlowHandler.ashx?OperateType=ConfirmWFNoPass&WorkFlowID=" + WorkFlowID, false);
        TaskDicWordconn.send(null);
        var responseText = TaskDicWordconn.responseText;
        if (responseText == 'success') {
            NodeWindow.WorkFlowState = 8;
            Ext.Msg.alert("提示", "操作成功,如果操作的流程含有当前加载的流程，请重新加载！");
            WorkFlowStore.reload();
        }
        else if (responseText == 'failure') {
            Ext.Msg.alert("提示", "操作失败！");
        }
        else
            Ext.Msg.alert("提示", "系统错误！");
    }
    else {
        Ext.Msg.alert("提示", "请选择一个你要操作的流程！");
    }
}

function RefreshWorkFlowState() {
    var jsonData = { OperateType: 'RefreshWorkFlowState' };
    CodeOperaMethod('workFlowHandler.ashx', jsonData, null);
    WorkFlowStore.reload();
    //alert('你要查找的工作流名是：' + WorkFlowName);
}
function WorkFlowSearch() {
    WorkFlowStore.removeAll();
    var WorkFlowName = WorkFlowtbar.findById('WorkFlowSearch').getValue();
    WorkFlowStore.load({ params: { operatype: 'search', WorkFlowName: WorkFlowName} });
    //alert('你要查找的工作流名是：' + WorkFlowName);
}
function WorkFlowDelete(btn) {
    if (btn == 'yes') {
        var workflowID = [];
        var rows = Ext.getCmp("WorkFlowTablePanel").getSelectionModel().getSelections();

        for (var i = 0, len = rows.length; i < len; i++) {
            var state = rows[i].get('State');
            if (state == 4 || state<0 || state == 6 || state == 0) {//初始、挂起、执行完成、异常终止
                workflowID.push(rows[i].get('ID'));
            }
            else {
                App.setAlert(App.STATUS_NOTICE, '流程[' + rows[i].get('name') + "]当前的状态不能进行删除操作！");
                return;
            }
        }
        var jsonData = { OperateType: 'delete', workflowID: workflowID.join() };
        CodeOperaMethod('workFlowHandler.ashx', jsonData, null);
        //重新加载store信息
        WorkFlowStore.reload();
        // WorkFlowTablePanel.store.reload();
    }
}


var WorkFlowProxy = new Ext.data.HttpProxy({
    url: 'WorkFlowTableData.aspx'
});

var WorkFlowReader = new Ext.data.JsonReader(
                    { root: 'rows', totalProperty: 'results' },
                        [
                        { name: "ID" },
                         { name: "name" },
                         { name: "workflow" },
                         { name: "ProjectID" },
                         { name: "State" },
                         { name: "StateName" },
                         { name: "creator" },
                          { name: "creatorName" },
                         { name: "chargor" },
                         { name: "ProjectName" },
                         { name: "createtime" },
                         { name: "ActualEndtime" },
                         { name: "endtime" }
                        ]
                    );

var WorkFlowStore = new Ext.data.Store({ id: 'WorkFlowStore',
    proxy: WorkFlowProxy,
    reader: WorkFlowReader
});


var WorkFlowPageBar = new Ext.PagingToolbar({
    store: WorkFlowStore,
    pageSize: 10,
    displayInfo: true,
    displayMsg: '总记录数 {0} - {1} of {2}',
    emptyMsg: "没有记录"
});
var WorkFlowTablePanel_sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: true });
var WorkFlowTablePanel = new Ext.grid.GridPanel({
    id: "WorkFlowTablePanel",
    frame: false,
    store: WorkFlowStore,
    height: 400,
    tbar: WorkFlowtbar,
    bbar: WorkFlowPageBar,
    sm: WorkFlowTablePanel_sm,
    loadMask: true,
    columns: [
                    new Ext.grid.RowNumberer(),
                   WorkFlowTablePanel_sm,
                    { header: 'ID', dataIndex: 'ID', sortable: true, hidden: true },
                    { header: '工作流名', dataIndex: 'name', sortable: true },
                    { header: '创建人', dataIndex: 'creatorName', sortable: true },
                    { header: '归属项目', dataIndex: 'ProjectName', sortable: true },
                    { header: '状态', dataIndex: 'StateName', sortable: true },
                    { header: '创建时间', dataIndex: 'createtime', sortable: true },
                    { header: '计划结束时间', dataIndex: 'endtime', sortable: true },
                    { header: '实际结束时间', dataIndex: 'ActualEndtime', sortable: true }

            ]
});

WorkFlowStore.load({ params: { start: 0, limit: 10} });
var LoadWFWindow = new Ext.Window({
    title: '加载工作流',
    // modal: true,
    width: 600,
    height: 370,
    minWidth: 300,
    minHeight: 100,
    loadMask: true,
    layout: 'fit',
    closeAction: 'hide',
    plain: true,
    bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: [WorkFlowTablePanel],
    buttons: [{
        text: '加载',
        handler: function () {

            graph.getModel().beginUpdate();
            graph.selectAll();
            graph.removeCells();
            graph.refresh();
            rec = Ext.getCmp("WorkFlowTablePanel").getSelectionModel().getSelected();
            NodeWindow.setTitle("工作流——" + rec.get('name'));
            NodeWindow.CurrentWorkFlowID = rec.get('ID');
            NodeWindow.WorkFlowState = rec.get('State');
            var xmlDocument = mxUtils.parseXml(rec.get('workflow'));
            var decoder = new mxCodec(xmlDocument);
            var node = xmlDocument.documentElement;
            decoder.decode(node, graph.getModel());
            graph.getModel().endUpdate();
            graph.setCellsLocked(true);
            graph.setConnectable(false);
            graph.setCellsDeletable(false);
            graph.refresh();

            //------------------------------------
        }
    }]
});





