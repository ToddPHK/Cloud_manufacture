<%@ Page Language="C#" AutoEventWireup="true" CodeFile="LonlyP.aspx.cs" Inherits="LonlyP" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <table style="border: medium solid #FFFFFF; margin-left: 20%;" align="center">
        <tr>
            <th align="right">
                用户名:&nbsp;&nbsp;
            </th>
            <td class="style6">
                <asp:TextBox ID="userName" runat="server"></asp:TextBox>
            </td>
            <td class="style1">
                <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server" ErrorMessage="*必填项"
                    ControlToValidate="userName" ForeColor="#CC0000"></asp:RequiredFieldValidator>
                <asp:RegularExpressionValidator ID="RegularExpressionValidator1" runat="server" ForeColor="#CC0000"
                    ControlToValidate="userName" ErrorMessage="只能输入5-12个字母" ValidationExpression="[(A-Z)|(a-z)]{5,12}"></asp:RegularExpressionValidator>
            </td>
        </tr>
        <tr>
            <th align="right">
                密&nbsp;码:&nbsp;&nbsp;
            </th>
            <td class="style6">
                <asp:TextBox ID="pwd" runat="server" TextMode="Password"></asp:TextBox>
            </td>
            <td class="style1">
                <asp:RequiredFieldValidator ID="pwdRequiredFieldValidator" runat="server" ErrorMessage="*必填项"
                    ControlToValidate="pwd" ForeColor="#CC0000"></asp:RequiredFieldValidator>
                <asp:RegularExpressionValidator ControlToValidate="pwd" ID="RegularExpressionValidator2"
                    ForeColor="#CC0000" runat="server" ErrorMessage="只能输入由数字、26个英文字母组成的字符串,长度在6~12之间"
                    ValidationExpression="[\x21-\x7E]{6,12}"></asp:RegularExpressionValidator>
            </td>
        </tr>
        <tr>
            <th align="right">
                确认密码:&nbsp;&nbsp;
            </th>
            <td class="style6">
                <asp:TextBox ID="Comparepwd" runat="server" TextMode="Password"></asp:TextBox>
            </td>
            <td class="style1">
                <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ErrorMessage="*必填项"
                    ControlToValidate="Comparepwd" ForeColor="#CC0000"></asp:RequiredFieldValidator>
                <asp:CompareValidator ID="CompareValidator1" runat="server" ForeColor="#CC0000" ErrorMessage="两次密码不一致！"
                    ControlToCompare="pwd" ControlToValidate="Comparepwd"></asp:CompareValidator>
            </td>
        </tr>
        <tr>
            <th align="right">
                手机号码:&nbsp;&nbsp;
            </th>
            <td class="style6">
                <asp:TextBox ID="telephone" runat="server"></asp:TextBox>
            </td>
            <td class="style1">
                输入自己的电话号码
                <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" ErrorMessage="*必填项"
                    ControlToValidate="telephone" ForeColor="#CC0000"></asp:RequiredFieldValidator>
                <asp:RegularExpressionValidator ID="RegularExpressionValidator3" runat="server" ControlToValidate="telephone"
                    ForeColor="#CC0000" ErrorMessage="电话号码格式不正确" ValidationExpression="^[1]+[1,2,3,4,5,6,7,8,9]+\d{9}"></asp:RegularExpressionValidator>
            </td>
        </tr>
        <tr>
            <th align="right">
                固定电话:&nbsp;&nbsp;
            </th>
            <td class="style6">
                <asp:TextBox ID="GudingTelephone" runat="server"></asp:TextBox>
            </td>
            <td class="style1">
            </td>
        </tr>
        <tr>
            <th align="right">
                真实姓名:&nbsp;&nbsp;
            </th>
            <td class="style6">
                <asp:TextBox ID="RealName" runat="server"></asp:TextBox>
            </td>
            <td class="style1">
                <asp:RequiredFieldValidator ID="RequiredFieldValidator4" runat="server" ErrorMessage="*必填项"
                    ControlToValidate="RealName" ForeColor="#CC0000"></asp:RequiredFieldValidator>
            </td>
        </tr>
        <tr>
            <th align="right">
                微博地址:&nbsp;&nbsp;
            </th>
            <td class="style6">
                <asp:TextBox ID="Weibo" runat="server"></asp:TextBox>
            </td>
            <td class="style1">
                <asp:RegularExpressionValidator ID="RegularExpressionValidator5" runat="server" ErrorMessage="格式不正确"
                    ForeColor="#CC0000" ControlToValidate="Weibo" ValidationExpression="http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&amp;=]*)?"></asp:RegularExpressionValidator>
            </td>
        </tr>
        <tr>
            <th align="right">
                身份证号:&nbsp;&nbsp;
            </th>
            <td class="style6">
                <asp:TextBox ID="RegisterIDCard" runat="server"></asp:TextBox>
            </td>
            <td class="style1">
                <asp:RequiredFieldValidator ID="RequiredFieldValidator6" runat="server" ErrorMessage="*必填项"
                    ControlToValidate="RegisterIDCard" ForeColor="#CC0000"></asp:RequiredFieldValidator>
                <asp:RegularExpressionValidator ID="RegularExpressionValidatodd" ControlToValidate="RegisterIDCard"
                    runat="server" ForeColor="#CC0000" ErrorMessage="身份证号格式不正确" ValidationExpression="\d{17}[\d|X]|\d{15}"></asp:RegularExpressionValidator>
            </td>
        </tr>
        <tr>
            <th align="right">
                邮箱名:&nbsp;&nbsp;
            </th>
            <td class="style6">
                <asp:TextBox ID="Email" runat="server"></asp:TextBox>
            </td>
            <td class="style1">
                <asp:RequiredFieldValidator ID="RequiredFieldValidator7" runat="server" ErrorMessage="*必填项"
                    ControlToValidate="Email" ForeColor="#CC0000"></asp:RequiredFieldValidator>
                <asp:RegularExpressionValidator ID="RegularExpressionValidator4" runat="server" ForeColor="#CC0000"
                    ErrorMessage="请输入正确的邮件格式（XXXX@XX.XX）" ControlToValidate="Email" ValidationExpression="\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*"></asp:RegularExpressionValidator>
            </td>
        </tr>
        <tr>
            <th align="right">
                地&nbsp;址:&nbsp;&nbsp;
            </th>
            <td class="style6">
                <asp:TextBox ID="address" runat="server"></asp:TextBox>
            </td>
            <td class="style1">
            </td>
        </tr>
        <tr>
            <th align="right">
                所在地区:&nbsp;&nbsp;
            </th>
            <td class="style6">
                <asp:DropDownList ID="LocateRegion" runat="server">
                    <asp:ListItem>--请选择--</asp:ListItem>
                    <asp:ListItem>北京</asp:ListItem>
                    <asp:ListItem>天津</asp:ListItem>
                    <asp:ListItem>上海</asp:ListItem>
                    <asp:ListItem>重庆</asp:ListItem>
                    <asp:ListItem>河北</asp:ListItem>
                    <asp:ListItem>山西</asp:ListItem>
                    <asp:ListItem>内蒙古</asp:ListItem>
                    <asp:ListItem>辽宁</asp:ListItem>
                    <asp:ListItem>吉林</asp:ListItem>
                    <asp:ListItem>黑龙江</asp:ListItem>
                    <asp:ListItem>江苏</asp:ListItem>
                    <asp:ListItem>浙江</asp:ListItem>
                    <asp:ListItem>安徽</asp:ListItem>
                    <asp:ListItem>福建</asp:ListItem>
                    <asp:ListItem>江西</asp:ListItem>
                    <asp:ListItem>山东</asp:ListItem>
                    <asp:ListItem>河南</asp:ListItem>
                    <asp:ListItem>湖北</asp:ListItem>
                    <asp:ListItem>湖南</asp:ListItem>
                    <asp:ListItem>广东</asp:ListItem>
                    <asp:ListItem>广西</asp:ListItem>
                    <asp:ListItem>海南</asp:ListItem>
                    <asp:ListItem>四川</asp:ListItem>
                    <asp:ListItem>贵州</asp:ListItem>
                    <asp:ListItem>云南</asp:ListItem>
                    <asp:ListItem>西藏</asp:ListItem>
                    <asp:ListItem>陕西</asp:ListItem>
                    <asp:ListItem>甘肃</asp:ListItem>
                    <asp:ListItem>青海</asp:ListItem>
                    <asp:ListItem>宁夏</asp:ListItem>
                    <asp:ListItem>新疆</asp:ListItem>
                    <asp:ListItem>香港</asp:ListItem>
                    <asp:ListItem>澳门</asp:ListItem>
                    <asp:ListItem>台湾</asp:ListItem>
                    <asp:ListItem>亚洲</asp:ListItem>
                    <asp:ListItem>欧洲</asp:ListItem>
                    <asp:ListItem>北美洲</asp:ListItem>
                    <asp:ListItem>南美洲</asp:ListItem>
                    <asp:ListItem>大洋洲</asp:ListItem>
                    <asp:ListItem>其他地区</asp:ListItem>
                </asp:DropDownList>
            </td>
            <td class="style1">
                <asp:RequiredFieldValidator ID="RequiredFieldValidator9" runat="server" ErrorMessage="*必填项"
                    ControlToValidate="LocateRegion" ForeColor="#CC0000"></asp:RequiredFieldValidator>
            </td>
        </tr>
        <tr>
            <td colspan="2" align="center">
                <asp:CheckBox ID="ReadContract" runat="server" />
                我已阅读并同意<a href="UpLoadFiles/云平台使用协议.rar">《云制造平台使用协议》</a>
            </td>
        </tr>
        <tr>
            <td colspan="2" align="center">
                <asp:Button ID="Registerbtn" runat="server" Text="提&nbsp;交" OnClick="Registerbtn_Click" />
                &nbsp;
                <input id="Reset1" type="reset" value="重&nbsp;置" />
            </td>
        </tr>
        <tr>
            <td colspan="3" align="center">
            </td>
        </tr>
    </table>
    </form>
</body>
</html>
