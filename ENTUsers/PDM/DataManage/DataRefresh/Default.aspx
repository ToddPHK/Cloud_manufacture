<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="ENTUsers_PDM_DataManage_DataRefresh_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
        <link rel="Stylesheet" type="text/css" href="../../../../css/myIcon.css" />
    <link rel="Stylesheet" type="text/css" href="../../../../ext-3.2.0/resources/css/ext-all.css" />
    <script type="text/javascript" src="../../../../ext-3.2.0/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="../../../../ext-3.2.0/ext-all.js"></script>
    <script type="text/javascript" src="../../../../ext-3.2.0/src/locale/ext-lang-zh_CN.js"></script>

</head>
<body>
    <script type="text/javascript">
//        var App = new Ext.App({});
        Ext.util.CSS.swapStyleSheet('theme', '../../../' + '<%=Session["StyleSheet"].ToString()%>');
        Ext.onReady(function () {


            Ext.BLANK_IMAGE_URL = '../../../ext-3.2.0/resources/images/default/s.gif';
            Ext.QuickTips.init();
            Ext.form.Field.prototype.msgTarget = 'side';
            //    var CurrentUserID = '<%=Session["userID"]%>';
            var MyMaintabPanel = new Ext.TabPanel({
                activeTab: 0, //初始显示第几个Tab页  
                region: "center",
                deferredRender: false, //是否在显示每个标签的时候再渲染标签中的内容.默认true      
                tabPosition: 'bottom', //表示TabPanel头显示的位置,只有两个值top和bottom.默认是top.           
                items: [{//Tab的个数      
                    title: '任务状态',
                    html: ' <iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="../TaskStateManage/Default.aspx" > </iframe>'
                }, {
                    title: '流程状态',
                    html: ' <iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="../ProcessState/Default.aspx" > </iframe>'
                }, {
                    title: '项目状态',
                    html: ' <iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="../ProjectState/Default.aspx" > </iframe>'
                }]
            });

            var viewport = new Ext.Viewport({
                layout: 'border', //布局,必须是border
                loadMask: true,
                items: [MyMaintabPanel
            ]
            });
        });
    </script>
</body>
</html>
