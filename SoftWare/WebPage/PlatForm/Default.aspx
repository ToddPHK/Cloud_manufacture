<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="SoftWare_WebPage_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>软件搜索</title>
    <link rel="Stylesheet" type="text/css" href="../../../css/myIcon.css" />
    <link rel="Stylesheet" type="text/css" href="../../../ext-3.2.0/resources/css/ext-all.css" />
    <script type="text/javascript" src="../../../ext-3.2.0/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/ext-all.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/src/locale/ext-lang-zh_CN.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/synchro/ext-basex.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/ComboPageSize.js"></script>
    <script type="text/javascript" src="../../js/PlatForm/SoftWareTablePanel.js"></script>
    <script type="text/javascript" src="../../js/PlatForm/softWareSearch.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/App.js"></script>
</head>
<body>
    <script type="text/javascript">
        var App = new Ext.App({});

        var northPanel = new Ext.Panel({
            autoScroll: true,
            title: "软件搜索", //实际应用中，通常去掉该属性。
            region: 'north', //北部，即顶部，上面
            layout: 'fit',
            split: true,
            height: 220,
            items: [SearchPanel],
            //  items: [themecombo],
            // border: false, //当面板内容超出面板大小时，是否显示边框
            collapsible: true //是否可以收缩,默认不可以收缩，即不显示收缩箭头

        });
        Ext.onReady(function () {
            Ext.QuickTips.init();
            var rolemanagePanel = new Ext.Viewport({
                layout: 'border',
                items: [northPanel, SoftWareTablepanel]
            });
        });
    </script>
</body>
</html>
