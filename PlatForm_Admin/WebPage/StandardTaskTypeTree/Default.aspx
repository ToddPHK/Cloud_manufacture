<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="PlatForm_Admin_WebPage_StandardTaskTypeTree_Default" %>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link rel="Stylesheet" type="text/css" href="../../../ext-3.2.0/resources/css/ext-all.css" />
    <link rel="Stylesheet" type="text/css" href="../../../css/myIcon.css" />
    <script type="text/javascript" src="../../../ext-3.2.0/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/ext-all.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/src/locale/ext-lang-zh_CN.js"></script>
        <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/ComboBoxTree.js"></script>
    <link rel="stylesheet" type="text/css" href="../../../ext-3.2.0/extjsPlugins/treegrid/treegrid.css" />
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/App.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/synchro/ext-basex.js"></script>
    <%--treegrid插件--%>
       
<%--        <script type="text/javascript" src="../../../js/TreeGridSorter.js"></script>
         <script type="text/javascript" src="../../../js/tree-grid.js"></script>--%>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/treegrid/TreeGridSorter.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/treegrid/TreeGridColumnResizer.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/treegrid/TreeGridNodeUI.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/treegrid/TreeGridLoader.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/treegrid/TreeGridColumns.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/treegrid/TreeGrid.js"></script>
    <%--自己的js文件--%>
    <script type="text/javascript" src="../../js/CodeOperaMethod.js"></script>
    <script type="text/javascript" src="../../js/StandardTaskTypeTree/TaskTemplate_TreeGrid.js"></script>
    <script type="text/javascript" src="../../js/StandardTaskTypeTree/StandardTaskType_AddWindow.js"></script>
    <script type="text/javascript" src="../../js/StandardTaskTypeTree/StandardTaskType_TreeGrid.js"></script>
    <script type="text/javascript" src="../../js/StandardTaskTypeTree/TemplatePreview.js"></script>
    <script type="text/javascript" src="../../js/StandardTaskTypeTree/Panel.js"></script>
    <script type="text/javascript">
        var App = new Ext.App({});

        Ext.util.CSS.swapStyleSheet('theme', '../../' + '<%=Session["StyleSheet"].ToString()%>');
        
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    </div>
    </form>
</body>
</html>
