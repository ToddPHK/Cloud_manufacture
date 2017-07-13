var ServiceApplyPageSize = 25, OperateType;
var ServiceApplyName_Search = new Ext.form.TextField({
    regex: /^[^\\'‘’]+$/,
    regexText: "不能包含单引号",
    width: 80
});


var ServiceApply_OperateMenu = new Ext.menu.Menu({
    items: [{
        text: "同意申请",
        iconCls: 'edit-icon',
        handler: ConfirmPass
    }, {
        text: "拒绝申请",
        iconCls: 'edit-icon',
        handler: RefusePass
    }]
});


var ServiceApplytbar = new Ext.Toolbar({
    items: [{
        id: 'ServiceApplybtnDel',
        text: "删除",
        iconCls: 'delete-icon',
        handler: function () {
            OperateType = 'DeleteServiceApply';
            rows = ServiceApplyTablePanel.getSelectionModel().getSelections();
            if (rows.length == 0) {
                Ext.Msg.alert("", "请至少选择一行你要删除的数据！");
                return;
            }
            Ext.MessageBox.confirm('提示', '确实要删除所选的记录吗?', ServiceApplyDelete);

        }

    }, '-', {
        text: "任务操作",
        menu: ServiceApply_OperateMenu
    }, '->', '任务名:', ServiceApplyName_Search, {
        id: 'ServiceApplybtnSearch',
        text: "搜索",
        handler: ServiceApplyDataSearch
    }]

});


function ServiceApplyDataSearch() {
    ServiceApplyStore.removeAll();
    if (StandardServiceApply_ComboBox.node == undefined)
        ServiceApplyStore.baseParams.StandardServiceApplyID = "";
    else
        ServiceApplyStore.baseParams.StandardServiceApplyID = StandardServiceApply_ComboBox.node.id;
    if (ProjectServiceApply_ComboBox.node == undefined)
        ServiceApplyStore.baseParams.ProjectServiceApplyID = "";
    else
        ServiceApplyStore.baseParams.ProjectServiceApplyID = ProjectServiceApply_ComboBox.node.id;
    ServiceApplyStore.baseParams.ServiceApplyName = ServiceApplyName_Search.getValue();
    ServiceApplyStore.baseParams.OperateType = "search";
    ServiceApplyStore.load();
    ServiceApplyStore.reload();
}

function ConfirmPass() {
    var ServiceApplyID = [];
    var rows = ServiceApplyTablePanel.getSelectionModel().getSelections();

    if (rows == "")//没有选择任务
    {
        Ext.Msg.alert("提示", " 你还没有选择任务！");
    }
    else {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].get("ServiceApplyState") != 3) {
                Ext.Msg.alert("提示", "任务[" + rows[i].get("ServiceApplyName") + "]不能进行此操作！");
                return;
            }
            ServiceApplyID.push(rows[i].get("ID"));
        }
        var jsonData = { OperateType: "ConfirmPass", ServiceApplyID: ServiceApplyID.join() };
        CodeOperaMethod('ServiceApplySubmitManage.aspx', jsonData);
    }
}
function RefusePass() {
    var ServiceApplyID = [];
    var rows = ServiceApplyTablePanel.getSelectionModel().getSelections();

    if (rows == "")//没有选择任务
    {
        Ext.Msg.alert("提示", " 你还没有选择任务！");
    }
    else {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].get("ServiceApplyState") != 3) {
                Ext.Msg.alert("提示", "任务[" + rows[i].get("ServiceApplyName") + "]不能进行此操作！");
                return;
            }
            ServiceApplyID.push(rows[i].get("ID"));
        }
        var jsonData = { OperateType: "RefusePass", ServiceApplyID: ServiceApplyID.join() };
        CodeOperaMethod('ServiceApplySubmitManage.aspx', jsonData);
    }
}
function ServiceApplyDelete(btn) {
    if (btn == 'yes') {
        var ServiceApplyID = [];
        var rows = ServiceApplyTablePanel.getSelectionModel().getSelections();
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].get("ServiceApplyCreator") != CurrentUserID) {
                Ext.Msg.alert("提示", "你不是[" + rows[i].get("ServiceApplyName") + "]任务的创建人，不能编辑该任务！");
                return;
            }
            ServiceApplyID.push(rows[i].get("ServiceApplyID"));
        }
        var jsonData = { OperateType: OperateType, ServiceApplyID: ServiceApplyID.join() };
        ServiceApplyTreeOperaMethod('ServiceApplySubmitManage.aspx', jsonData);
        ServiceApplyStore.reload();
        ServiceApplyTablePanel.store.reload();
    }
}
//-------------------------------------------------------------------------------------

var ServiceApplyProxy = new Ext.data.HttpProxy({
    url: 'ServiceApplyTableData.aspx'
});

var ServiceApplyReader = new Ext.data.JsonReader(
                    { root: 'rows', totalProperty: 'results' },
                        [
                        { name: "ID" },
                        { name: "ApplicantEntID" },
                        { name: "ApplicantID" },
                        { name: "ApplyDate" },
                        { name: "TaskID" },
                        { name: "ApplyEndDate" },
                        { name: "userName" },
                        { name: "ServiceName" },
                        { name: "userName" },
                        { name: "TaskName" }
                        ]
                    );

var ServiceApplyStore = new Ext.data.Store(
                        { id: 'ServiceApplyStore', proxy: ServiceApplyProxy, reader: ServiceApplyReader }
                    );
var ServiceApplypagenumber = new Ext.data.SimpleStore({
    fields: ['id', 'genre'],
    data: [['0', '25'], ['0', '45'], ['1', '65'], ['2', '80']]
});

var ServiceApplyPageNumberCombo = new Ext.form.ComboBox({
    store: ServiceApplypagenumber,
    id: 'ServiceApplypagenumber',
    displayField: 'genre', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local'
    emptyText: '每页记录数',
    triggerAction: 'all',
    width: 100,
    listeners: {
        "select": function () {
            ServiceApplyPageSize = ServiceApplyPageNumberCombo.getValue();
            ServiceApplyPageBar.pageSize = parseInt(ServiceApplyPageNumberCombo.getValue());
            ServiceApplyStore.reload({ params: { start: 0, limit: ServiceApplyPageSize} });
        }
    }

});

var ServiceApplyPageBar = new Ext.PagingToolbar({
    store: ServiceApplyStore,
    pageSize: ServiceApplyPageSize,
    displayInfo: true,
    displayMsg: '总记录数 {0} - {1} of {2}',
    emptyMsg: "没有记录",
    id: 'ServiceApplyPageBar',
    items: [ServiceApplyPageNumberCombo]
});
var ServiceApplyTablePanel_sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });
var ServiceApplyTable = new Ext.grid.GridPanel({
    title: '任务管理',
    viewConfig: { autoFill: true },
    region: 'center',
    frame: true,
    store: ServiceApplyStore,
    height: 400,
    tbar: ServiceApplytbar,
    bbar: ServiceApplyPageBar,
    sm: ServiceApplyTablePanel_sm,
    loadMask: true,
    //    listeners: {//监听
    //        "rowdblclick": ServiceApplyDataEdit
    //    },
    columns: [
                    new Ext.grid.RowNumberer(),
                    ServiceApplyTablePanel_sm,
                    { header: '服务名', dataIndex: 'ServiceName', sortable: true },
                    { header: '任务名', dataIndex: 'TaskName', sortable: true },
                    { header: '任务归属企业', dataIndex: 'userName', sortable: true },
                    { header: '申请时间', dataIndex: 'ApplyDate', sortable: true },
                    { header: '申请结束日期', dataIndex: 'ApplyEndDate', sortable: true }
            ]
});


function showDescription(val) {
    if (val != null && val != '')
        return unescape(val);
    else
        return "无";
}
ServiceApplyStore.load({ params: { start: 0, limit: ServiceApplyPageSize} });