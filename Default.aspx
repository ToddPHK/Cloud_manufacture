<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<script language=javascript>
    function em() {
        form1.txtUsername.value = "";
        form1.txtUserpwd.value = "";
    }
</script>
<head id="Head1" runat="server">
    <title>云制造登录</title>
<style type="text/css">
<!--
body {
	background-color: #d2d2d2;
}
-->
</style></head>
<body>
    <form id="form1" runat="server">
    <div>
    <HTML>
<HEAD>
<TITLE>login</TITLE>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=gb2312">
</HEAD>
<BODY BGCOLOR=#FFFFFF LEFTMARGIN=0 TOPMARGIN=0 MARGINWIDTH=0 MARGINHEIGHT=0>
    <br />
    <br />
    <br />
       <br />
    <br />
    <br />
       <br />
    <br />
    <br />
    <table width="636" height="357" align="center" cellpadding="0" cellspacing="0" background="images/dbg副本.bmp">
      <tr>
        <td width="636" height="357"><table width="430" border="0" cellpadding="0" cellspacing="0" style="text-align: left">
          <tr>
            <td colspan="8">&nbsp;</td>
            <td style="width: 43px"><img src="images/spacer.gif" width="1" height="130" alt="" /></td>
          </tr>
          <tr>
            <td colspan="2" rowspan="4" style="width: 66px">&nbsp;</td>
            <td style="width: 12px"><img src="images/login_3.gif" width="1" height="1" alt="" /></td>
            <td rowspan="3" style="width: 106px">&nbsp;</td>
            <td colspan="3" rowspan="2" style="background-image: url()"><table style="font-size: 12px; width: 235px; height: 78px">
                <tr>
                  <td style="width: 386px"></td>
                  <td style="width: 109px"></td>
                  <td style="width: 100px"></td>
                </tr>
                <tr>
                  <td style=" height: 22px; width: 386px; text-align: right;" align="left"> 用户名：</td>
                  <td style="width: 109px; height: 22px"><asp:TextBox ID="txtUsername" runat="server" Height="15px" Width="130px"></asp:TextBox>
                  </td>
                  <td style="width: 10px; height: 22px"><asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ControlToValidate="txtUsername"
                            ErrorMessage="用户名不能为空">*</asp:RequiredFieldValidator></td>
                </tr>
                <tr>
                  <td style=" height: 23px; width: 386px; text-align: right;" align="left"> 密码：</td>
                  <td style="width: 109px; height: 23px"><asp:TextBox ID="txtUserpwd" runat="server" Height="15px" TextMode="Password" Width="130px"></asp:TextBox>
                  </td>
                  <td style="width: 10px; height: 23px"><asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server" ControlToValidate="txtUserpwd"
                            ErrorMessage="密码不能为空">*</asp:RequiredFieldValidator></td>
                </tr>
            </table></td>
            <td rowspan="3" style="width: 38px">&nbsp;</td>
            <td style="width: 43px"><img src="images/spacer.gif" width="1" height="1" alt="" /></td>
          </tr>
          <tr>
            <td rowspan="2" style="width: 12px"></td>
            <td style="width: 43px"><img src="images/spacer.gif" width="1" height="97" alt="" /></td>
          </tr>
          <tr>
            <td style="width:115px;height:43px; background-image: url();"><table cellspacing="0" style="font-size: 12px">
                <tr>
                  <td style="width: 80px"> 验证码</td>
                  <td style="width: 30px"><asp:TextBox ID="txtValidateNumber" runat="server" Height="15px" Width="30px"></asp:TextBox></td>
                  <td style="width: 30px"><asp:Label ID="Label1" runat="server" Text="1" 
                          ForeColor="White"></asp:Label></td>
                </tr>
            </table></td>
            <td style="width:61px;height:43px;"><asp:ImageButton ID="ImageButton1" runat="server" ImageUrl="images/login_9.gif" OnClick="ImageButton1_Click" /></td>
            <td style="width: 335px; height: 43px;"><img src="images/login_10.gif" width="64" height="26" alt="" onclick="em()" style="cursor:hand" /></td>
            <td style="height: 43px; width: 43px;"><img src="images/spacer.gif" width="1" height="26" alt="" /></td>
          </tr>
          <tr>
            <td colspan="6" rowspan="2">&nbsp;</td>
            <td style="width: 43px"><img src="images/spacer.gif" width="1" height="9" alt="" /></td>
          </tr>
          <tr>
              <td colspan="2" style="width: 66px">
                  &nbsp;&nbsp;</td>
            <td style="width: 43px"><img src="images/spacer.gif" width="1" height="48" alt="" /></td>
          </tr>
        </table>
        </td>
      </tr>
    </table>
</BODY>
</HTML>
    </div>
    </form>
</body>
</html>
