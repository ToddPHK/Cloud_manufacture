<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Taskmudule_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link rel="Stylesheet" type="text/css" href="../../../ext-3.2.0/resources/css/ext-all.css" />
    <link rel="Stylesheet" type="text/css" href="../../../css/myIcon.css" />
    <script type="text/javascript" src="../../../ext-3.2.0/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/ext-all.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/src/locale/ext-lang-zh_CN.js"></script>
    <link rel="stylesheet" type="text/css" href="../../../ext-3.2.0/extjsPlugins/treegrid/treegrid.css" />
    <%--treegrid插件--%>
    <script type="text/javascript" src="../../../js/jsScoreStar/score.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/synchro/ext-basex.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/treegrid/TreeGridSorter.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/treegrid/TreeGridColumnResizer.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/treegrid/TreeGridNodeUI.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/treegrid/TreeGridLoader.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/treegrid/TreeGridColumns.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/treegrid/TreeGrid.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/ComboBoxTree.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/TreeCheckNodeUI.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/App.js"></script>
    <%--自己的js文件--%>
    <script type="text/javascript" src="../../js/CodeOperaMethod.js"></script>
    <script type="text/javascript" src="../../js/TaskTemplate/Element_AddWindow.js"></script>
    <script type="text/javascript" src="../../js/TaskTemplate/Row_AddWindow.js"></script>
    <script type="text/javascript" src="../../js/TaskTemplate/TaskMould_AddWindow.js"></script>
    <script type="text/javascript" src="../../js/TaskTemplate/TemplateComment_window.js"></script>
    <script type="text/javascript" src="../../js/TaskTemplate/TempalteInherit_Window.js"></script>
    <script type="text/javascript" src="../../js/TaskTemplate/TaskMould_TreeGrid.js"></script>
    <script type="text/javascript">
        Ext.util.CSS.swapStyleSheet('theme', '../../' + '<%=Session["StyleSheet"].ToString()%>');
        var App = new Ext.App({});
        Ext.onReady(function () {


            Ext.BLANK_IMAGE_URL = '../../../ext-3.2.0/resources/images/default/s.gif';
            Ext.QuickTips.init();
            var viewport = new Ext.Viewport({
                layout: 'border', //布局,必须是border
                loadMask: true,
                items: [TaskMudole_TreeGrid
            ]
            });

        });

        var UserType = '<%=Session["UserType"].ToString()%>';

        if (UserType == 'PlatFormUser') {
            var CompanyID = '<%=Session["ENTID"].ToString()%>';
            var CreatorID = '-1';
            taskMould_tbar.add({
                text: '模板操作',
                menu: TaskTemplate_OperateMenu  // assign menu by instance
            }, '-');
            taskMould_tbar.doLayout();
        }
        else if (UserType == 'ENTUser') {
            var CompanyID = '<%=Session["ENTID"].ToString()%>';
            var CreatorID = '-1';
        }
        else if (UserType == 'ENTInnerUser') {
            var CompanyID = '<%=Session["ENTID"].ToString()%>';
            var CreatorID = '<%=Session["userID"].ToString()%>';
        }
        else {
            Ext.Msg.alert("提示","系统出错，请重新登录！");
        }
        taskMould_tbar.add( /*{
            text: "显示模板所有相关评论",
            iconCls: 'edit-icon',
            handler: ShowAll_templateComment
        }, '-', {

            text: "显示所有",
            iconCls: 'edit-icon',
            handler: taskMould_ShowAll
        },*/ '->', '模板名称：', TaskTemplate_Search, {
            id: 'taskbtnSearch',
            text: "搜索",
            iconCls: 'search-icon',
            handler: taskMould_Search
        });
        taskMould_tbar.doLayout();
    </script>
</head>
<body>
    <table id="score" style="width: 200;">
        <tr>
            <td style="width: 90px;">
            </td>
            <td>
                <div id="GradeVoteArea">
                </div>
            </td>
            <td style="width: 10px;">
            </td>
            <td align="justify">
                <div id="GradeVoteScore">
                    请您评分</div>
            </td>
        </tr>
    </table>
    <script type="text/javascript">
        var WindowVote = new GradeVote();
        WindowVote.GradeVoteImage1 = "../../../images/star_mark_big.gif";
        WindowVote.GradeVoteImage2 = "../../../images/star_unmark_big.gif";
        WindowVote.CreateVote(5, 2);
        WindowVote.AddContent("很差");
        WindowVote.AddContent("一般了");
        WindowVote.AddContent("还不错");
        WindowVote.AddContent("挺好的");
        WindowVote.AddContent("非常好！");
    </script>
    <form id="form1" runat="server">
    <div>
    </div>
    </form>
</body>
</html>
