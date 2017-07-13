//------------加载工作流----------
function LoadNewWorkFlow() {
    LoadWFWindow.show();
}
var WF_EditMenu = new Ext.menu.Menu({
    items: [{
        id: 'WFtbar',
        text: "添加",
        handler: function () {
            NewWFWindow.setTitle("流程新建");
            OperateType = "AddNewWorkFlow";
            addNewWorkFlow();
        }

    }, '-', {
        id: 'WorkFlowDataEdit',
        text: "编辑",
        handler: WorkFlowDataEdit
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

    }]
});
var WorkFlowtbar = new Ext.Toolbar({
    items: [{
        text: "流程编辑",
        menu: WF_EditMenu
    }, '-', {
        text: "更新流程状态",
        handler: RefreshWorkFlowState

    }, '-', {
        text: "优化匹配",
        handler: OptimizingMatch

    }, '->', new Ext.Toolbar.TextItem('工作流名称：'), { xtype: 'textfield', id: 'WorkFlowSearch' }, {
        id: 'WorkFlowSearchBtn',
        text: "搜索",
        handler: WorkFlowSearch
    }]

});
function OptimizingMatch() {
    if (WorkFlowTablePanel_sm.hasSelection()) {

        var rec = WorkFlowTablePanel_sm.getSelected();
        if (rec.get('creator') == CurrentUserID) {
            if (rec.get("State") == 11) {
                var conn1 = Ext.lib.Ajax.getConnectionObject().conn;
                conn1.open("POST", "DataProcess.aspx?OperateType=OptimizingMatch&WorkFID=" + rec.get("ID"), false);
                conn1.send(null);
                var temp = conn1.responseText;
                //    var result = Ext.util.JSON.decode(result);
                App.setAlert(App.STATUS_NOTICE, temp);

            }
            else {
                App.setAlert(App.STATUS_NOTICE, "只有状态为‘外协中’的流程才能进行此操作！");
            }
        }
        else {
            App.setAlert(App.STATUS_NOTICE, "你不是流程[" + rec.get("name") + "]的创建人，不能进行此操作！");
        }
    }
    else {
        App.setAlert(App.STATUS_NOTICE, "还未选择流程！");
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
            if (rec.get('creator') != CurrentUserID) {
                App.setAlert(App.STATUS_NOTICE, "你不是该流程的创建人，无权进行此操作！");
                return;
            }
            var state = rows[i].get('State');
            if (state == 4 || state < 0 || state == 6 || state == 0) {
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
function WorkFlowDataEdit() {
    OperateType = "EditWorkFlow";
    rec = Ext.getCmp("WorkFlowTablePanel").getSelectionModel().getSelected();
    if (rec == undefined) {
        Ext.Msg.alert("提示", "请你选择一行数据进行操作！");
    }
    else {
        if ( rec.get('creator') != CurrentUserID) {
            App.setAlert(App.STATUS_NOTICE, "你不是该流程的创建人，无权进行此操作！");
            return;
        }
        var state = rec.get('State');
        if (state == 0 || state == 1 || state == 2) {
            NewWFForm.getForm().findField('WFName').setValue(rec.get('name'));
            PPeopleListCombo.setValue(rec.get('ProjectID'));
            NewWFForm.getForm().findField('WFEndDate').setValue(rec.get("endtime"));
            NewWFWindow.EditWFID = rec.get('ID');
            NewWFWindow.setTitle("流程编辑");
            NewWFWindow.show();

        }
        else {
            App.setAlert(App.STATUS_NOTICE, '流程[' + rec.get('name') + "]当前的状态不能进行编辑操作！");
        }

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
var WorkFlowTablePanel_sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });
var WorkFlowTablePanel = new Ext.grid.GridPanel({
    id: "WorkFlowTablePanel",
    frame: false,
    store: WorkFlowStore,
    height: 400,
    tbar: WorkFlowtbar,
    bbar: WorkFlowPageBar,
    sm: WorkFlowTablePanel_sm,
    loadMask: true,
    listeners: {//监听
        "rowdblclick": WorkFlowDataEdit
    },
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


var LoadWFWindow = new Ext.Window({
    title: '加载工作流',
    // modal: true,
    width: 800,
    height: 470,
    minWidth: 300,
    minHeight: 100,
    loadMask: true,
    layout: 'fit',
    closeAction: 'hide',
    plain: true,
    bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: [WorkFlowTablePanel],
    listeners: {//监听
        "show": function () { WorkFlowStore.load({ params: { start: 0, limit: 10} }); }
    },
    buttons: [{
        text: '加载',
        handler: function () {
            if (WorkFlowTablePanel_sm.hasSelection()) {
                rec = WorkFlowTablePanel_sm.getSelected();

                if (rec.get('creator') != CurrentUserID && rec.get('chargor') != CurrentUserID) {
                    App.setAlert(App.STATUS_NOTICE, "你不是该流程的创建人或流程归属项目的负责人，无权进行此操作！");
                    return;
                }

                graph.getModel().beginUpdate();
                graph.selectAll();
                graph.removeCells();
                graph.refresh();

                NodeWindow.setTitle("工作流——" + rec.get('name'));
                NodeWindow.CurrentWorkFlowID = rec.get('ID');
                NodeWindow.creator = rec.get('creator');
                NodeWindow.ProjectChargor = rec.get('chargor');
                NodeWindow.WorkFlowState = rec.get('State');
                //--------------------------------
                var xmlDocument = mxUtils.parseXml(rec.get('workflow'));
                var decoder = new mxCodec(xmlDocument);
                var node = xmlDocument.documentElement;
                decoder.decode(node, graph.getModel());
                graph.getModel().endUpdate();
                if (rec.get('State') > 0) {
                    graphLock();

                }
                else {
                    graphUnLock();
                }
                graph.refresh();
            }
            else
                App.setAlert(App.STATUS_NOTICE, '请选择您要加载的流程！')
            //------------------------------------
        }
    }]
});
function graphLock() {
    library.disable();
    graph.setCellsLocked(true);
    graph.setConnectable(false);
    graph.setCellsDeletable(false);
}
function graphUnLock() {
    library.enable();
    graph.setCellsLocked(false);
    graph.setConnectable(true);
    graph.setCellsDeletable(true);
}




