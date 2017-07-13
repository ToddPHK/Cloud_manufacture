﻿<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="ENTUsers_PDM_DataManage_ProcessState_Default" %>

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
                var ProcessStateProxy = new Ext.data.HttpProxy({
                    url: 'DataProcess.aspx'
                });
                var ProcessStateReader = new Ext.data.JsonReader(
                    { root: 'rows', totalProperty: 'results' },
                        [
                        { name: "StateID" },
                        { name: "StateName" },
                        { name: "ColorValue" }
                        ]
                    );

                var ProcessStateStore = new Ext.data.Store(
                        { proxy: ProcessStateProxy, reader: ProcessStateReader }
                    );

                var ProcessStatetbar = new Ext.Toolbar({
                    items: [{
                        text: "更新数据",
                        iconCls: 'edit-icon',
                        handler: Refresh_ProcessState
                    }]
                });
                function Refresh_ProcessState() {

                    CodeOperaMethod('DataProcess.aspx', { OperateType: "RefreshDataFromServer" });
                    ProcessStateStore.reload();
                }
                var ProcessStateTablePanel = new Ext.grid.GridPanel({
                    title: '流程状态',
                    //id: "ProcessStateTablePanel",
                    // viewConfig: { autoFill: true },
                    region: 'center',
                    frame: true,
                    store: ProcessStateStore,

                    height: 400,
                    tbar: ProcessStatetbar,
                    loadMask: true,
                    tools: [{
                        id: 'refresh',
                        handler: function () {
                            ProcessStateStore.reload();
                        }

                    }],
                    columns: [
                    new Ext.grid.RowNumberer(),
                    { header: '状态ID', dataIndex: 'StateID', sortable: true },
                    { header: '名称', dataIndex: 'StateName',width:200,sortable: true }
                   // { header: '颜色', dataIndex: 'ColorValue', sortable: true, align: 'center', renderer: showSuspend }

            ]
                });


                ProcessStateStore.baseParams.OperateType = "StateData";
                ProcessStateStore.load();
                function showSuspend(val) {
                    if (val == null || val == '')
                        return "未知";
                    else {
                        return '<span style="background:' + val + '"> &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;  </span>';
                    }
                }
                Ext.BLANK_IMAGE_URL = '../../../../ext-3.2.0/resources/images/default/s.gif';
                var viewport = new Ext.Viewport({
                    layout: 'border', //布局,必须是border
                    loadMask: true,
                    items: [ProcessStateTablePanel
            ]
                });
            });

    </script>
</head>
<body>

</body>
</html>
