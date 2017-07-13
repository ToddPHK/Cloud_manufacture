<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Index.aspx.cs" Inherits="Index" %>

<%@ Register Src="../enter.ascx" TagName="enter" TagPrefix="uc1" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link rel="Stylesheet" type="text/css" href="../css/myIcon.css" />
    <link rel="Stylesheet" type="text/css" href="../ext-3.2.0/resources/css/ext-all.css" />
    <link rel="Stylesheet" type="text/css" href="../css/firstPage.css" />
</head>
<body>
    <uc1:enter ID="Enter1" runat="server" />
    <div id="north-div">
        <table id="headTable">
            <tr>
                <td id="title">云端企业信息管理系统</td>
                <td id="showDate">
                    <table width="100%" border="0" cellpadding="0" cellspacing="3" class="banner">
                        <tr align="right">
                            <td>
                                <span id="rTime"></span>
                            </td>
                        </tr>
                        <tr align="right">
                            <td>
                                <table border="0" cellpadding="0" cellspacing="1">
                                    <tr>
                                        <td>
                                            <div id="themeDiv" />
                                        </td>
                                        <td>&nbsp;
                                        </td>
                                        <td>
                                            <div id="configDiv" />
                                        </td>
                                        <td>&nbsp;
                                        </td>
                                        <td>
                                            <div id="closeDiv" />
                                        </td>
                                        <td>
                                            <div id="homeDiv" />
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
    <script type="text/javascript" src="../ext-3.2.0/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="../ext-3.2.0/ext-all.js"></script>
    <script type="text/javascript" src="../ext-3.2.0/src/locale/ext-lang-zh_CN.js"></script>
    <script type="text/javascript" src="../ext-3.2.0/extjsPlugins/synchro/ext-basex.js"></script>
    <script type="text/javascript" src="js/FirstPage.js"></script><!--显示首页内容-->
    <!--显示时间-->
    <script type="text/javascript" language="javascript">
        Ext.util.CSS.swapStyleSheet('theme', '<%=Session["StyleSheet"].ToString()%>');
        var str = '<%=Session["EntFullName"]%>';
        function getDayOfWeek(dayValue) {
            var day = new Date(Date.parse(dayValue.replace(/-/g, '/')));                             //将日期值格式化 
            var today = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"); //创建星期数组
            return today[day.getDay()];                                                              //返一个星期中的某一天，其中0为星期日 
        }
        function showTime() {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var msg = "";
            var h = date.getHours();
            if (h >= 18 || h <= 6)
                msg = "晚上好，";
            else if (h > 6 && h <= 12)
                msg = "早上好，";
            else
                msg = "下午好，";
            h = h < 10 ? '0' + h : h;

            var m = date.getMinutes();
            m = m < 10 ? '0' + m : m;
            var s = date.getSeconds();
            s = s < 10 ? '0' + s : s;

            document.getElementById('rTime').innerHTML = msg + str + '！今天是：' + year + "-" + month + "-" + day + " " + getDayOfWeek(year + "-" + month + "-" + day) + "   " + h + ":" + m + ":" + s;
        }

        window.onload = function () {
            setInterval("showTime()", 1000);
        }
    </script>
    
</body>
</html>
