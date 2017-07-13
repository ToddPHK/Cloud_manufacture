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
    <%--  任务面板  --%>
    <%--    --%>
    <script type="text/javascript" src="../../js/CodeOperaMethod.js"></script>
    <script type="text/javascript" src="../../js/ApplyForService/ServiceApplyTable.js"></script>

</head>
<body>
    <script type="text/javascript">
        Ext.util.CSS.swapStyleSheet('theme', '../../' + '<%=Session["StyleSheet"].ToString()%>');
        Ext.QuickTips.init();
        Ext.form.Field.prototype.msgTarget = 'side';
        var CurrentUserID = '<%=Session["userID"]%>';
        Ext.onReady(function () {

            var viewport = new Ext.Viewport({
                layout: 'border', //布局,必须是border
                loadMask: true,
                items: [ServiceApplyTable //左
            ]
            });

        });
    </script>
</body>
</html>
