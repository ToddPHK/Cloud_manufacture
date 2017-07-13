<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="ENTInnerUsers_PDM_TaskManage_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link rel="Stylesheet" type="text/css" href="../../../css/myIcon.css" />
    <link rel="Stylesheet" type="text/css" href="../../../ext-3.2.0/resources/css/ext-all.css" />
    <script type="text/javascript" src="../../../ext-3.2.0/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/ext-all.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/src/locale/ext-lang-zh_CN.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/ComboBoxTree.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/synchro/ext-basex.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/RowExpander.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/TreeCheckNodeUI.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/App.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/ComboPageSize.js"></script>
    <%--  任务面板  --%>
    <%--    --%>

    <script type="text/javascript" src="../../js/TaskManage/FileUpLoadWin.js"></script>
    <script type="text/javascript" src="../../js/TaskManage/CodeOperaMethod.js"></script>
    <script type="text/javascript" src="../../js/TaskManage/ProjectTaskTree.js"></script>
    <script type="text/javascript" src="../../js/TaskManage/standardTaskTree.js"></script>
    <%--    <script type="text/javascript" src="../../js/TaskManage/AdvacedSearchPanel.js"></script>
    <script type="text/javascript" src="../../js/TaskManage/ServiceSearch.js"></script>--%>
    <script type="text/javascript" src="../../js/Constr.js"></script>
    <script type="text/javascript" src="../../js/TaskManage/TaskCreatePanel.js"></script>
    <script type="text/javascript" src="../../js/TaskManage/TaskOperationWin.js"></script>
    <script type="text/javascript" src="../../js/TaskManage/TaskManageTable.js"></script>
    <style type="text/css">
        .download-icon
        {
            height: 16px;
            width: 16px;
            background-image: url(../../../images/download.gif) !important;
        }
        .UnEnabledownload-icon
        {
            height: 16px;
            width: 16px;
            background-image: url(../../../images/downLoadGray.gif) !important;
        }
    </style>
</head>
<script type="text/javascript">
    Ext.util.CSS.swapStyleSheet('theme', '../../' + '<%=Session["StyleSheet"].ToString()%>');
    var App = new Ext.App({});
</script>
<body>
    <script type="text/javascript">
        Ext.QuickTips.init();
        Ext.BLANK_IMAGE_URL = '../../../ext-3.2.0/resources/images/default/s.gif';
        Ext.form.Field.prototype.msgTarget = 'side';
        var CurrentUserID = '<%=Session["userID"]%>';
        Ext.onReady(function () {

            var viewport = new Ext.Viewport({
                layout: 'border', //布局,必须是border
                loadMask: true,
                items: [ProjectTaskTreePanel, taskTablePanel //左
            ]
            });

        });
    </script>
</body>
</html>
