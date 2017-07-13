<%@ Page Language="C#" AutoEventWireup="true" CodeFile="MyWorkTab.aspx.cs" Inherits="ENTInnerUsers_portal_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">

    <title></title>
    <link rel="Stylesheet" type="text/css" href="../../ext-3.2.0/resources/css/ext-all.css" />
    <script type="text/javascript" src="../../ext-3.2.0/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="../../ext-3.2.0/ext-all.js"></script>
    <script type="text/javascript" src="../../ext-3.2.0/src/locale/ext-lang-zh_CN.js"></script>
    <link rel="stylesheet" type="text/css" href="../../ext-3.2.0/extjsPlugins/portal/Portal.css" />
    <!-- overrides to base library -->
    <!-- extensions -->
        <script type="text/javascript" src="../../ext-3.2.0/extjsPlugins/synchro/ext-basex.js"></script>
    <script type="text/javascript" src="../../ext-3.2.0/extjsPlugins/portal/Portal.js"></script>
    <script type="text/javascript" src="../../ext-3.2.0/extjsPlugins/portal/PortalColumn.js"></script>
    <script type="text/javascript" src="../../ext-3.2.0/extjsPlugins/portal/Portlet.js"></script>
     <script type="text/javascript" src="../../ext-3.2.0/extjsPlugins/App.js"></script>
    <!-- page specific -->
    <script type="text/javascript" src="js/PersonInf.js"></script>
    <script type="text/javascript" src="js/EntInnerUser.js"></script>
    <script type="text/javascript" src="js/grouptabs.js"></script>
    <script type="text/javascript">
        Ext.util.CSS.swapStyleSheet('theme', '../' + '<%=Session["StyleSheet"].ToString()%>');
        var App = new Ext.App({});
    </script>
            <style type="text/css">
.f_link {
	TEXT-ALIGN: center; LINE-HEIGHT: 24px; MARGIN: 3px 2px; FLOAT: left; HEIGHT: 24px; OVERFLOW: hidden
}

.yqlj_link {
	WIDTH: 150px
}
    </style>
</head>
<body>

</body>
</html>
