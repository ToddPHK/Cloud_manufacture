<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="ENTUsers_PDM_PrjManagerAudit_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link rel="Stylesheet" type="text/css" href="../../../css/myIcon.css" />
    <link rel="Stylesheet" type="text/css" href="../../../ext-3.2.0/resources/css/ext-all.css" />
    <script type="text/javascript" src="../../../ext-3.2.0/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/ext-all.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/src/locale/ext-lang-zh_CN.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/App.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/ComboPageSize.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/synchro/ext-basex.js"></script>
</head>
<body>
    <script type="text/javascript">
        Ext.util.CSS.swapStyleSheet('theme', '../../' + '<%=Session["StyleSheet"].ToString()%>');
        var App = new Ext.App({});
    </script>
    <script type="text/javascript">
        var TaskTreeOperaMethod = function (u, p) {
            var conn = new Ext.data.Connection();
            conn.request({
                //请求的 Url  
                url: u,
                // 传递的参数  
                params: p,
                method: 'post',
                scope: this,
                //回调函数，根据执行结果作不同的操作，如果成功提示操作成功的信息，如果失败提示失败的信息  
                callback: function (options, success, response) {
                    if (success) {
                        App.setAlert(App.STATUS_NOTICE, response.responseText);
                    }
                    else {
                        App.setAlert(App.STATUS_NOTICE, "所提交的操作失败！");
                    }

                }
            });
        };
        Ext.QuickTips.init();
        Ext.BLANK_IMAGE_URL = '../../../ext-3.2.0/resources/images/default/s.gif';
        Ext.form.Field.prototype.msgTarget = 'side';
        var CurrentUserID = '<%=Session["userID"]%>';
        Ext.onReady(function () {

            var Task_ServiceTbar = new Ext.Toolbar({
                items: [{
                    text: "任务详情",
                    handler: TServiceTaskDetail
                }, {
                    text: "服务详情",
                    handler: TServiceDetail
                }, {
                    text: "同意",
                    handler: TServiceAgree
                }, {
                    text: "不同意",
                    handler: TServiceNoAgree
                }]

            });
            var TaskDicWordconn = Ext.lib.Ajax.getConnectionObject().conn;
            TaskDicWordconn.open("POST", "../TaskManage/DataProcess.aspx?OperateType=TaskDicWord", false);
            TaskDicWordconn.send(null);
            var responseText = TaskDicWordconn.responseText;
            function showTaskDetail(Description) {

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
                    s += "<b>[" + (TaskDicWordJson[nodes[i].nodeName] == undefined ? "未知属性" : TaskDicWordJson[nodes[i].nodeName]) + "]:</b>" + nodes[i].text + "</br>";
                }
                return s;

            }
            function TServiceTaskDetail() {

                new Ext.Window({
                    collapsible: false,
                    resizable: true,
                    layout: 'fit',
                    width: 200,
                    height: 200, //15+ -
                    modal: false,
                    border: false,
                    closeAction: "close",
                    plain: true,
                    html: showTaskDetail(Task_ServiceTable_sm.getSelected().get("TaskDetailInf")),
                    title: '任务[' + Task_ServiceTable_sm.getSelected().get("TaskName") + ']的详细信息'
                }).show();
            }
            function TServiceDetail() {
                new Ext.Window({
                    collapsible: false,
                    resizable: true,
                    layout: 'fit',
                    width: 700,
                    height: 500, //15+ -
                    modal: false,
                    border: false,
                    closeAction: "close",
                    plain: true,
                    title: '服务详细信息',
                    html: ' <iframe scrolling=auto frameborder=0 width=100% height=100% src=http://mie.zju.edu.cn/cloud/CloudMfg_SRMS/ServiceShow.aspx?ServResCode=' + Task_ServiceTable_sm.getSelected().get("ServiceID") + ' > </iframe>'
                }).show();

            }
            function TServiceAgree() {
                if (Task_ServiceTable_sm.hasSelection())//没有选择任务
                {
                    var ID = [];
                    var rows = Task_ServiceTable_sm.getSelections();
                    for (var i = 0; i < rows.length; i++) {
                        ID.push(rows[i].get("ID"));
                    }
                    var jsonData = { OperateType: "TServiceAgree", ID: ID.join() };
                    TaskTreeOperaMethod('DataProcess.aspx', jsonData);
                    Task_ServiceStore.removeAll();
                    Task_ServiceStore.reload();
                }
                else {
                    App.setAlert(App.STATUS_NOTICE, " 你还没有选择任务！");
                }

            }
            function TServiceNoAgree() {
                if (Task_ServiceTable_sm.hasSelection())//没有选择任务
                {
                    var ID = [];
                    var rows = Task_ServiceTable_sm.getSelections();
                    for (var i = 0; i < rows.length; i++) {
                        ID.push(rows[i].get("ID"));
                    }
                    var jsonData = { OperateType: "TServiceNoAgree", ID: ID.join() };
                    TaskTreeOperaMethod('DataProcess.aspx', jsonData);
                    Task_ServiceStore.removeAll();
                    Task_ServiceStore.reload();
                }
                else {
                    App.setAlert(App.STATUS_NOTICE, " 你还没有选择任务！");
                }
            }
            var Task_ServiceProxy = new Ext.data.HttpProxy({
                url: 'TServiceTable.aspx'
                //method: 'GET'
            });
            var Task_ServiceReader = new Ext.data.JsonReader(
                    { root: 'rows', totalProperty: 'results' },
                        [
                        { name: "ID" },
                         { name: "TaskID" },
                         { name: "Price" },
                         { name: "ServiceID" },
                         { name: "ServiceName" },
                         { name: "TaskName" },
                         { name: "TaskDetailInf" },
                         { name: "Flag" },
                         { name: "AddTime" },
                         { name: "ApplyTime" },
                         { name: "PrjAuditTime" },
                         { name: "EntAuditTime" },
                         { name: "DealDate" },
                         { name: "FinDate" }
                        ]
                    );

            var Task_ServiceStore = new Ext.data.Store(
                        { proxy: Task_ServiceProxy, reader: Task_ServiceReader }
                    );
            var TServicePageBar = new Ext.PagingToolbar({
                store: Task_ServiceStore,
                plugins: new Ext.ui.plugins.ComboPageSize(),
                pageSize: "25",
                displayInfo: true,
                displayMsg: '总记录数 {0} - {1} of {2}',
                emptyMsg: "没有记录"
            });
            var Task_ServiceTable_sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });
            var Task_ServiceTableTanel = new Ext.grid.GridPanel({
                title: '服务申请列表',
                region: 'center',
                frame: true,
                store: Task_ServiceStore,
                tbar: Task_ServiceTbar,
                bbar: TServicePageBar,
                sm: Task_ServiceTable_sm,
                loadMask: true,
                columns: [
                    new Ext.grid.RowNumberer(),
                   Task_ServiceTable_sm,
                    { header: 'ID', dataIndex: 'ID', width: 30, sortable: true },
                    { header: '任务ID', dataIndex: 'TaskID', width: 50, sortable: true },
                    { header: '服务ID', dataIndex: 'ServiceID', sortable: true },
                    { header: '服务名', dataIndex: 'ServiceName', sortable: true },
                    { header: '价格', dataIndex: 'Price', width: 50, sortable: true },
                    { header: '任务名', dataIndex: 'TaskName', sortable: true },
                    { header: '状态', dataIndex: 'Flag', sortable: true, renderer: showState },
                    { header: '添加日期', dataIndex: 'AddTime', sortable: true },
                    { header: '申请日期', dataIndex: 'ApplyTime', sortable: true },
                    { header: '项目管理员处理日期', dataIndex: 'PrjAuditTime', sortable: true },
                    { header: '企业管理员处理日期', dataIndex: 'EntAuditTime', sortable: true },
                    { header: '交易日期', dataIndex: 'DealDate', sortable: true },
                    { header: '结束日期', dataIndex: 'FinDate', sortable: true }
            ]
            });
            Task_ServiceStore.load({ params: { start: 0, limit: 25} });
            function showState(val) {
                if (val == 6)
                    return "初始";
                else if (val == 7)
                    return "向项目管理员申请中";
                else if (val == 8)
                    return "项目管理员拒绝";
                else if (val == 9)
                    return "向企业管理员申请中";
                else if (val == 10)
                    return "企业管理员拒绝";
                else if (val == 0)
                    return "服务方未处理";
            }


            function PrjMTaskServiceShow() {

            }
            var viewport = new Ext.Viewport({
                title: '项目管理员服务申请审核',
                layout: 'border', //布局,必须是border
                loadMask: true,
                items: [Task_ServiceTableTanel
            ]
            });

        });
    </script>
</body>
</html>
