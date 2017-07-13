<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="PlatForm_Admin_Default" %>
<%@ Register Src="../enter.ascx" TagName="enter" TagPrefix="uc1" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
     <link rel="Stylesheet" type="text/css" href="../css/myIcon.css" />
    <link rel="Stylesheet" type="text/css" href="../ext-3.2.0/resources/css/ext-all.css" />
    <script type="text/javascript" src="../ext-3.2.0/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="../ext-3.2.0/ext-all.js"></script>
    <script type="text/javascript" src="../ext-3.2.0/src/locale/ext-lang-zh_CN.js"></script>
       <script type="text/javascript" src="../ext-3.2.0/extjsPlugins/synchro/ext-basex.js"></script>
    <script type="text/javascript" src="js/FirstPage.js"></script>
</head>
<body>
<uc1:enter ID="Enter1" runat="server" />
    <div id="north-div">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%" background="../images/1.jpg">
            <tr>
                <td style="padding-left: 15px">
                <span style="font-family: 华文彩云; font-size: xx-large; color: #FFFFFF; font-style: normal;letter-spacing:70px;">云平台管理 </span>

                <span style="font-family: 华文彩云; font-size: xx-large; color: #FFFFFF; font-style: normal;">（二）</span>
                    <!--<img class="IEPNG" src="images/1.jpg" />-->
                </td>
                <td style="padding-right: 5px">
                    <table width="100%" border="0" cellpadding="0" cellspacing="3" class="banner">
                        <tr align="right">
                            <td >
                                <span id="rTime" ></span>
                            </td>
                        </tr>
                        <tr align="right">
                            <td>
                                <table border="0" cellpadding="0" cellspacing="1">
                                    <tr>
                                        <td>
                                            <div id="themeDiv" />
                                        </td>
                                        <td>
                                            &nbsp;
                                        </td>
                                        <td>
                                            <div id="configDiv" />
                                        </td>
                                        <td>
                                            &nbsp;
                                        </td>
                                        <td>
                                            <div id="closeDiv" style="background-image: url(/images/home.png)" />
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
    <script type="text/javascript" language="javascript">
        Ext.util.CSS.swapStyleSheet('theme', '<%=Session["StyleSheet"].ToString()%>');
        var str = '<%=Session["username"]%>';
        function getDayOfWeek(dayValue) {
            var day = new Date(Date.parse(dayValue.replace(/-/g, '/')));                             //将日期值格式化 
            var today = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"); //创建星期数组
            return today[day.getDay()];                                                              //返一个星期中的某一天，其中0为星期日 
        }
        function showTime() {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth()+1;
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
