<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="PlatForm_Admin_WebPage_TaskStateManage_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link rel="Stylesheet" type="text/css" href="../../../../ext-3.2.0/resources/css/ext-all.css" />
    <link rel="Stylesheet" type="text/css" href="../../../../css/myIcon.css" />
    <script type="text/javascript" src="../../../../ext-3.2.0/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="../../../../ext-3.2.0/ext-all.js"></script>
    <script type="text/javascript" src="../../../../ext-3.2.0/src/locale/ext-lang-zh_CN.js"></script>
    <script type="text/javascript" src="../../../../ext-3.2.0/extjsPlugins/App.js"></script>
    <script type="text/javascript">
        Ext.util.CSS.swapStyleSheet('theme', '../../../' + '<%=Session["StyleSheet"].ToString()%>');
        var App = new Ext.App({});

        var CodeOperaMethod = function (u, p) {
            var successw = false;
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

        //----------------------------------
        Ext.onReady(function () {
            var TaskStateProxy = new Ext.data.HttpProxy({
                url: 'DataProcess.aspx'
            });
            var TaskStateReader = new Ext.data.JsonReader(
                    { root: 'rows', totalProperty: 'results' },
                        [
                        { name: "TaskStateID" },
                        { name: "TaskStateName" },
                        { name: "ColorValue" }
                        ]
                    );

            var TaskStateStore = new Ext.data.Store(
                        { proxy: TaskStateProxy, reader: TaskStateReader }
                    );

            var TaskStatetbar = new Ext.Toolbar({
                items: [{
                text: "更新数据",
                iconCls: 'edit-icon',
                handler: Refresh_TaskState
            }]
        });
        function Refresh_TaskState() {

            CodeOperaMethod('DataProcess.aspx', { OperateType: "RefreshDataFromServer" });
            TaskStateStore.reload();
        }
        var TaskStateTablePanel = new Ext.grid.GridPanel({
            title: '任务状态',
            //id: "TaskStateTablePanel",
            // viewConfig: { autoFill: true },
            region: 'center',
            frame: true,
            store: TaskStateStore,

            height: 400,
            tbar: TaskStatetbar,
            loadMask: true,
            tools: [{
                id: 'refresh',
                handler: function () {
                    TaskStateStore.reload();
                }

            }],
            columns: [
                    new Ext.grid.RowNumberer(),    
                    { header: '状态ID', dataIndex: 'TaskStateID', sortable: true },
                    { header: '名称', dataIndex: 'TaskStateName',width:150, sortable: true },
                    { header: '颜色', dataIndex: 'ColorValue', sortable: true, align: 'center', renderer: showSuspend }

            ]
        });


        TaskStateStore.baseParams.OperateType = "StateData";
        TaskStateStore.load();
        function showSuspend(val) {
            if (val == null || val == '')
                return "挂起中";
            else {
                return '<span style="background:' + val + '"> &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;  </span>';
            }
        }
        Ext.BLANK_IMAGE_URL = '../../../../ext-3.2.0/resources/images/default/s.gif';
        var viewport = new Ext.Viewport({
            layout: 'border', //布局,必须是border
            loadMask: true,
            items: [TaskStateTablePanel
            ]
        });
    });

    </script>
</head>
<body>
    
</body>
</html>
