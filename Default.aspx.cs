using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;

public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            Random validateN = new Random();
            this.Label1.Text = validateN.Next(9).ToString() + validateN.Next(9).ToString() + validateN.Next(9).ToString() + validateN.Next(9).ToString();
        }
    }
    protected void ImageButton1_Click(object sender, ImageClickEventArgs e)
    {
        //获取用户登录名
        string username = txtUsername.Text.Trim();
        //获取用户登录密码
        string userpwd = txtUserpwd.Text.Trim();
        string myserver = ConfigurationManager.AppSettings["myserver"];
        string PlatForm_connectstr = "server=" + myserver + ";Initial Catalog=CloudMDB;User ID=sa;Password=zju308;connect timeout=30";
        string UserType = "NoUser";

        if (!this.txtValidateNumber.Text.Equals(this.Label1.Text))
        {
            Response.Write("<script>alert('验证码错误');history.back()</script>");
        }
        else
        {
            if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from yunyingshang where 运营商ID='" + username + "' and 登陆密码='" + userpwd + "'"))
            {
                UserType = sqlExecute.sqlmanage.GetUniqueRecord("select 角色权限 from yunyingshang where 运营商ID='" + username + "' and 登陆密码='" + userpwd + "'", PlatForm_connectstr, new string[] { "角色权限" });
  Session.Clear();

                if (UserType.Equals("A"))
                {
                    Session["PlatForm_connectstr"] = PlatForm_connectstr;
                    Session["UserType"] = "PlatFormUser";
                    Session["username"] = username;
                    Session["userID"] = "1";
                    Session["StyleSheet"] = sqlExecute.sqlmanage.GetUniqueRecord("select StyleSheet from yunyingshang where ID=" + Session["userID"].ToString(), PlatForm_connectstr, new string[] { "StyleSheet" });
                    Session["ENTID"] = "1";
                    Session["User"] = username;
                     Response.Redirect("../yunyingshang1.aspx");

                }
                else if (UserType.Equals("B"))
                {
                    Session["PlatForm_connectstr"] = PlatForm_connectstr;
                    Session["UserType"] = "PlatFormUser";
                    Session["username"] = username;
                    Session["userID"] = "2";
                    Session["StyleSheet"] = sqlExecute.sqlmanage.GetUniqueRecord("select StyleSheet from yunyingshang where ID=" + Session["userID"].ToString(), PlatForm_connectstr, new string[] { "StyleSheet" });
                    Session["ENTID"] = "2";
                    Response.Redirect("PlatForm_Admin/Default.aspx");
                }
                else if (UserType.Equals("C"))
                {
                    Session["PlatForm_connectstr"] = PlatForm_connectstr;
                    Session["UserType"] = "PlatFormUser";
                    Session["username"] = username;
                    Session["userID"] = "3";
                    Session["StyleSheet"] = sqlExecute.sqlmanage.GetUniqueRecord("select StyleSheet from yunyingshang where ID=" + Session["userID"].ToString(), PlatForm_connectstr, new string[] { "StyleSheet" });
                    Session["ENTID"] = "3";
                    Session["User"] = username;
                    Session["EtprNum"] = "3";
                    Session["EtprName"] = "云平台";
                    Response.Redirect("../CloudMfg_SRMS/index.aspx");

                }
                else if (UserType.Equals("BC"))
                {
                    Session["PlatForm_connectstr"] = PlatForm_connectstr;
                    Session["UserType"] = "PlatFormUser";
                    Session["username"] = username;
                    Session["userID"] = "4";
                    Session["StyleSheet"] = sqlExecute.sqlmanage.GetUniqueRecord("select StyleSheet from yunyingshang where ID=" + Session["userID"].ToString(), PlatForm_connectstr, new string[] { "StyleSheet" });
                    Session["ENTID"] = "4";
                    Session["User"] = username;
                    Response.Redirect("../yunyingshang4.aspx");
                }
                else if (UserType.Equals("ABC"))
                {
                    Session["PlatForm_connectstr"] = PlatForm_connectstr;
                    Session["UserType"] = "PlatFormUser";
                    Session["username"] = username;
                    Session["userID"] = "3";
                    Session["StyleSheet"] = sqlExecute.sqlmanage.GetUniqueRecord("select StyleSheet from yunyingshang where ID=" + Session["userID"].ToString(), PlatForm_connectstr, new string[] { "StyleSheet" });
                    Session["ENTID"] = "3";
                    Session["User"] = username;
                    Session["EtprNum"] = "3";
                    Session["EtprName"] = "云平台";
                    Response.Redirect("../yunyingshang5.aspx");
                }


                else
                {
                    Response.Write("<script>alert('系统出错！')</script>");

                }
            }
            else
            {
                Response.Write("<script>alert('用户名或者密码错误，请重新输入！')</script>");
            }

            //判断用户名和密码是否存在

        }
    }
}