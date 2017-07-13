<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ProjectManege.aspx.cs" Inherits="ENTInnerUsers_PDM_prjManege_ProjectManege" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="Stylesheet" type="text/css" href="../../../css/myIcon.css" />
    <link rel="Stylesheet" type="text/css" href="../../../ext-3.2.0/resources/css/ext-all.css" />
    <link rel="Stylesheet" type="text/css" href="../../../ext-3.2.0/extjsPlugins/HtmlEditorPlugins/resources/css/htmleditorplugins.css" />
    <script type="text/javascript" src="../../../ext-3.2.0/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/ext-all.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/src/locale/ext-lang-zh_CN.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/ComboPageSize.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/RowExpander.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/ComboBoxTree.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/synchro/ext-basex.js"></script>
    <!--   插件-->
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/HtmlEditorPlugins/src/Ext.form.HtmlEditor.MidasCommand.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/HtmlEditorPlugins/src/Ext.form.HtmlEditor.SpecialCharacters.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/HtmlEditorPlugins/src/Ext.form.HtmlEditor.Table.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/treegrid/TreeGridSorter.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/treegrid/TreeGridColumnResizer.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/treegrid/TreeGridNodeUI.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/treegrid/TreeGridLoader.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/treegrid/TreeGridColumns.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/treegrid/TreeGrid.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/App.js"></script>
    <!--    项目管理-->
    <script type="text/javascript" src="../../js/PrjManage/CodeOperaMethod.js"></script>
    <script type="text/javascript" src="../../js/PrjManage/PrjTableEditWindow.js"></script>
    <script type="text/javascript" src="../../js/PrjManage/ProjTreeView.js"></script>
    <script type="text/javascript" src="../../js/PrjManage/TaskView.js"></script>
    <script type="text/javascript" src="../../js/PrjManage/ProjectTree.js"></script>
    <script type="text/javascript" src="../../js/PrjManage/PrjTablePanel.js"></script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <script type="text/javascript">
            var App = new Ext.App({});
            Ext.util.CSS.swapStyleSheet('theme', '../../' + '<%=Session["StyleSheet"].ToString()%>');
            Ext.QuickTips.init();
            Ext.form.Field.prototype.msgTarget = 'side';
            var CurrentUserID = '<%=Session["userID"]%>';
            // Ext.util.CSS.swapStyleSheet('theme', '../../ext-3.2.0/resources/css/xtheme-olive.css');
            Ext.onReady(function () {
                var rolemanagePanel = new Ext.Viewport({
                    layout: 'border',
                    items: [prjTableTanel]
                });
            });
        </script>
    </div>
    </form>
</body>
</html>
