<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Forum_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link rel="Stylesheet" type="text/css" href="../../../css/myIcon.css" />
    <link rel="Stylesheet" type="text/css" href="../../../ext-3.2.0/resources/css/ext-all.css" />

    <script type="text/javascript" src="../../../ext-3.2.0/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/ext-all.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/src/locale/ext-lang-zh_CN.js"></script>
       <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/App.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/synchro/ext-basex.js"></script>
     <script type="text/javascript" src="../../js/CodeOperaMethod.js"></script>
    <script type="text/javascript" src="TopicReplyWin.js"></script>
    <script type="text/javascript" src="TopicWin.js"></script>
    <script type="text/javascript" src="forum.js"></script>
    <script type="text/javascript" src="../../../js/jsScoreStar/score.js"></script>
    <link rel="stylesheet" type="text/css" href="forum.css" />
        <script type="text/javascript">
            Ext.util.CSS.swapStyleSheet('theme', '../../' + '<%=Session["StyleSheet"].ToString()%>');
            var UserType = '<%=Session["UserType"]%>';
            var App = new Ext.App({});
    </script>
</head>
<body>
  <table id="score" style="width: 200;">
        <tr>
            <td  style="width: 90px;">
            </td>
            <td>
                <div id="GradeVoteArea">
                </div>
            </td>
            <td style="width: 10px;">
            </td>
            <td align="center">
            <center>
                <div id="GradeVoteScore" style="width: 100;align:center;">
                    请您评分</div>
                    </center>
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
</body>
</html>
