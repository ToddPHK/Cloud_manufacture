<%@ Page Language="C#" AutoEventWireup="true" CodeFile="UserInfEdit.aspx.cs" Inherits="UserInfEdit"
    EnableEventValidation="false" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
    <style type="text/css">
        a
        {
            text-decoration: none;
        }
        a:hover
        {
            text-decoration: underline;
        }
        
        th
        {
            width: 200px;
        }
        .style1
        {
            width: 1000px;
        }
        .style6
        {
            width: 250px;
        }
    </style>
</head>
<body>
    <asp:HyperLink ID="HyperLink1" runat="server" NavigateUrl="Login.htm">[登录]</asp:HyperLink>
    <br />
    云制造平台用户信息修改：
    <br />
    <hr style="height: 5px; background: ##CC0000; border: 0; color: #CC0000; margin-top: 0px;" />
    <br />
    <form id="form1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>
    <div>
        <table style="border: medium solid #FFFFFF; margin-left: 20%;" align="center">
            <tr>
                <th align="right">
                    合同及公司说明:&nbsp;&nbsp;
                </th>
                <td align="center" colspan="2">
                    <asp:FileUpload ID="FileUpload1" runat="server" />
                    <asp:Label ID="Label1" runat="server" Text=""></asp:Label>
                    <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ControlToValidate="FileUpload1"
                        ForeColor="#CC0000" ErrorMessage="*必须上传有关公司的合法性文件和平台合同">
                    </asp:RequiredFieldValidator>
                </td>
            </tr>
            <tr>
                <th align="right">
                    用户名:&nbsp;&nbsp;
                </th>
                <td class="style6">
                    <asp:TextBox ID="userName" runat="server" Enabled="False"></asp:TextBox>
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
                    <asp:CompareValidator ID="CompareValidator1" runat="server" ForeColor="#CC0000" ErrorMessage="两次密码不一致！"
                        ControlToCompare="pwd" ControlToValidate="Comparepwd"></asp:CompareValidator>
                </td>
            </tr>
            <tr>
                <th align="right">
                    单位全称:&nbsp;&nbsp;
                </th>
                <td class="style6">
                    <asp:TextBox ID="EntFullName" runat="server"></asp:TextBox>
                </td>
                <td class="style1">
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
                    <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" ErrorMessage="*必填项"
                        ControlToValidate="telephone" ForeColor="#CC0000"></asp:RequiredFieldValidator>
                                        <asp:RegularExpressionValidator ID="RegularExpressionValidator33" runat="server" ControlToValidate="telephone"
                        ErrorMessage="电话号码格式不正确" ValidationExpression="^[1]+[1,2,3,4,5,6,7,8,9]+\d{9}"></asp:RegularExpressionValidator>
                    
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
                    <asp:RequiredFieldValidator ID="RequiredFieldValidator5" runat="server" ErrorMessage="*必填项"
                        ControlToValidate="Weibo" ForeColor="#CC0000"></asp:RequiredFieldValidator>
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
                    <asp:RegularExpressionValidator ID="RegularExpressionValidator3" ControlToValidate="RegisterIDCard"
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
                    公司网站:&nbsp;&nbsp;
                </th>
                <td class="style6">
                    <asp:TextBox ID="Entwebsite" runat="server"></asp:TextBox>
                </td>
                <td class="style1">
                    <asp:RequiredFieldValidator ID="RequiredFieldValidator8" runat="server" ErrorMessage="*必填项"
                        ControlToValidate="Entwebsite" ForeColor="#CC0000"></asp:RequiredFieldValidator>
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
                <th align="right">
                    主营范围:&nbsp;&nbsp;
                </th>
                <td>
                    <asp:TextBox ID="BusinessSphere" runat="server"></asp:TextBox>
                </td>
                <td class="style1">
                    <asp:RequiredFieldValidator ID="RequiredFieldValidator10" runat="server" ErrorMessage="*必填项"
                        ControlToValidate="BusinessSphere" ForeColor="#CC0000"></asp:RequiredFieldValidator>
                </td>
            </tr>
            <tr>
                <td colspan="3" align="center">
                </td>
            </tr>
        </table>
    </div>
    <asp:UpdatePanel ID="UpdatePanel1" runat="server">
        <Triggers>
            <asp:PostBackTrigger ControlID="Registerbtn" />
        </Triggers>
        <ContentTemplate>
            <center>
                <div style="border: medium solid #FFFFFF; width: 50%; height: 200px;">
                    是否把数据库放在本地：
                    <asp:RadioButton ID="RadioButton1" GroupName="local" runat="server" Text="是" OnCheckedChanged="RadioButton1_CheckedChanged"
                        AutoPostBack="True" />
                    &nbsp;&nbsp;&nbsp;
                    <asp:RadioButton ID="RadioButton2" GroupName="local" runat="server" Text="否" OnCheckedChanged="RadioButton2_CheckedChanged"
                        AutoPostBack="True" Checked="True" />
                    <asp:Panel ID="Panel1" runat="server" Visible="False">
                        <table style="width: 100%;">
                            <tr>
                                <th align="right">
                                    数据库地址: &nbsp;
                                </th>
                                <td class="style6">
                                    <asp:TextBox ID="DataBaseServe" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <th align="right">
                                    数据库名:&nbsp;
                                </th>
                                <td class="style6">
                                    <asp:TextBox ID="DataBaseName" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <th align="right">
                                    用户名:&nbsp;
                                </th>
                                <td class="style6">
                                    <asp:TextBox ID="DataBaseUserName" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <th align="right">
                                    密码:&nbsp;
                                </th>
                                <td class="style6">
                                    <asp:TextBox ID="DataBasepwd" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                        </table>
                    </asp:Panel>
                    <table style="width: 100%;">
                        <tr>
                            <td align="center">
                                <asp:CheckBox ID="ReadContract" runat="server" />
                                我已阅读并同意<a href="UpLoadFiles/云平台使用协议.rar">《云制造平台使用协议》</a>
                            </td>
                        </tr>
                        <tr>
                            <td align="center">
                                <asp:Button ID="Registerbtn" runat="server" Text="提&nbsp;交" OnClick="Registerbtn_Click" />
                                &nbsp;
                                <input id="Reset1" type="reset" value="重&nbsp;置" />
                            </td>
                        </tr>
                    </table>
                </div>
            </center>
        </ContentTemplate>
    </asp:UpdatePanel>
    </form>
</body>
</html>
