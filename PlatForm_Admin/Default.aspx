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
                <span style="font-family: ���Ĳ���; font-size: xx-large; color: #FFFFFF; font-style: normal;letter-spacing:70px;">��ƽ̨���� </span>

                <span style="font-family: ���Ĳ���; font-size: xx-large; color: #FFFFFF; font-style: normal;">������</span>
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
            var day = new Date(Date.parse(dayValue.replace(/-/g, '/')));                             //������ֵ��ʽ�� 
            var today = new Array("������", "����һ", "���ڶ�", "������", "������", "������", "������"); //������������
            return today[day.getDay()];                                                              //��һ�������е�ĳһ�죬����0Ϊ������ 
        }
        function showTime() {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var day = date.getDate();
            var msg = "";
            var h = date.getHours();
            if (h >= 18 || h <= 6)
                msg = "���Ϻã�";
            else if (h > 6 && h <= 12)
                msg = "���Ϻã�";
            else
                msg = "����ã�";
            h = h < 10 ? '0' + h : h;

            var m = date.getMinutes();
            m = m < 10 ? '0' + m : m;
            var s = date.getSeconds();
            s = s < 10 ? '0' + s : s;

            document.getElementById('rTime').innerHTML = msg + str + '�������ǣ�' + year + "-" + month + "-" + day + " " + getDayOfWeek(year + "-" + month + "-" + day) + "   " + h + ":" + m + ":" + s;
        }

        window.onload = function () {
            setInterval("showTime()", 1000);

        }
    </script>
</body>
</html>
