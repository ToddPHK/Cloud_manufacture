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
        //��ȡ�û���¼��
        string username = txtUsername.Text.Trim();
        //��ȡ�û���¼����
        string userpwd = txtUserpwd.Text.Trim();
        string myserver = ConfigurationManager.AppSettings["myserver"];
        string PlatForm_connectstr = "server=" + myserver + ";Initial Catalog=CloudMDB;User ID=sa;Password=zju308;connect timeout=30";
        string UserType = "NoUser";

        if (!this.txtValidateNumber.Text.Equals(this.Label1.Text))
        {
            Response.Write("<script>alert('��֤�����');history.back()</script>");
        }
        else
        {
            if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from yunyingshang where ��Ӫ��ID='" + username + "' and ��½����='" + userpwd + "'"))
            {
                UserType = sqlExecute.sqlmanage.GetUniqueRecord("select ��ɫȨ�� from yunyingshang where ��Ӫ��ID='" + username + "' and ��½����='" + userpwd + "'", PlatForm_connectstr, new string[] { "��ɫȨ��" });
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
                    Session["EtprName"] = "��ƽ̨";
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
                    Session["EtprName"] = "��ƽ̨";
                    Response.Redirect("../yunyingshang5.aspx");
                }


                else
                {
                    Response.Write("<script>alert('ϵͳ����')</script>");

                }
            }
            else
            {
                Response.Write("<script>alert('�û�����������������������룡')</script>");
            }

            //�ж��û����������Ƿ����

        }
    }
}