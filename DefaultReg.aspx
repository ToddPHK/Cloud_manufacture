<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DefaultReg.aspx.cs" Inherits="DefaultReg" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="asp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <div style="height: 40px">
        <div style="font-family: 微软雅黑; font-size: large; font-weight: bolder; color: #000080;
            float: left">
            云制造平台注册
        </div>
        <div style="float: right">
            <a id="A1" href="Login.htm" style="font-family: 微软雅黑; font-size: Small; font-weight: bold;">
                登录</a>
        </div>
        <div style="float: right">
            &nbsp; &nbsp;
        </div>
        <div style="float: right">
            <a id="A2" href="../index.aspx" style="font-family: 微软雅黑; font-size: Small; font-weight: bold;">
                首页</a></div>
    </div>
    <hr style="height: 5px; background: ##CC0000; border: 0; color: #CC0000; margin-top: 0px;" />
    <form id="form1" runat="server" height="100%">
    <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>
    <asp:TabContainer runat="server" ActiveTabIndex="0" Width="100%" Height="500">
        <asp:TabPanel runat="server" HeaderText="企业注册" ID="TabPanel1">
            <ContentTemplate>
                <iframe src="Register.aspx" width="100%" height="700" scrolling="no" frameborder="0">
                </iframe>
            </ContentTemplate>
        </asp:TabPanel>
        <asp:TabPanel runat="server" HeaderText="个人注册" ID="TabPanel2">
            <ContentTemplate>
                <iframe src="LonlyP.aspx" width="100%" height="700" scrolling="no" frameborder="0">
                </iframe>
            </ContentTemplate>
        </asp:TabPanel>
    </asp:TabContainer>
    </form>
</body>
</html>
