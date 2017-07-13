using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.IO;
using System.Configuration;
using System.Data;

public partial class UserInfEdit : System.Web.UI.Page
{
    string sql;
    string myserver;
    string UserID;
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            myserver = "server=" + ConfigurationManager.AppSettings["myserver"] + ";Initial Catalog=CloudMDB;User ID=sa;Password=zju308;connect timeout=30";
            UserID = sqlExecute.sqlmanage.GetUniqueRecord("select UserID from UserInfor where userName='" + Request["userName"].ToString() + "'  and userPass='" + Request["userPass"] + "'", myserver, new string[] { "UserID" });

            LoaUserData(UserID);
        }


    }
    protected void Registerbtn_Click(object sender, EventArgs e)
    {
        myserver = "server=" + ConfigurationManager.AppSettings["myserver"] + ";Initial Catalog=CloudMDB;User ID=sa;Password=zju308;connect timeout=30";
        UserID = sqlExecute.sqlmanage.GetUniqueRecord("select UserID from UserInfor where userName='" + Request["userName"].ToString() + "'  and userPass='" + Request["userPass"] + "'", myserver, new string[] { "UserID" });
        if (ReadContract.Checked != true)
        {
            Response.Write("<Script Language='JavaScript'>alert('请首选阅读《云制造平台使用协议》！')</Script>");
            return;
        }
        string temp = null;
        string CheckDatabaseLink = null;
        string msg = null;
        temp += "userPass='" + pwd.Text.ToString() + "',";
        temp += "Telephone='" + telephone.Text.ToString() + "',";
        temp += "Adress='" + address.Text.ToString() + "',";
        temp += "eMail='" + Email.Text.ToString() + "',";

        if (RadioButton1.Checked == true)//使用自己的数据库
        {
            temp += "DataBaseServer='" + DataBaseServe.Text.ToString() + "',";
            temp += "DataBaseName='" + DataBaseName.Text.ToString() + "',";
            temp += "DataBaseUserID='" + DataBaseUserName.Text.ToString() + "',";
            temp += "DataBasePwd='" + DataBasepwd.Text.ToString() + "',";
            CheckDatabaseLink = "server=" + DataBaseServe.Text.ToString() + ";User ID=" + DataBaseUserName.Text.ToString() + ";Password=" + DataBasepwd.Text.ToString() + ";";
            msg = "数据库[" + DataBaseUserName.Text.ToString() + "]已存在，请更换其它的名称！";
            if (!CheckConnection(CheckDatabaseLink))
            {
                Response.Write("<Script Language='JavaScript'>alert('数据库无法连接，不能修改！')</Script>");
                return;
            }
        }
        if (RadioButton1.Checked == true)
        {
            temp += "localDatabase='1',";
        }
        else
        {
            temp += "localDatabase='0',";
        }

        temp += "LocateRegion='" + LocateRegion.Text.ToString() + "',";
        temp += "BusinessSphere='" + BusinessSphere.Text.ToString().Trim() + "',";
        temp += "EntWebSite='" + Entwebsite.Text.ToString() + "',";
        temp += "Microblog='" + Weibo.Text.ToString() + "',";
        temp += "RegisterIDCard='" + RegisterIDCard.Text.ToString() + "',";
        temp += "RegisterRealName='" + RealName.Text.ToString() + "',";
        temp += "EntFullName='" + EntFullName.Text.ToString() + "',";
        temp += "GudingTelephone='" + GudingTelephone.Text.ToString() + "',";
        temp += "UserState=0,";
        temp += "UserLastEditTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "'";
        sql = "update  UserInfor set " + temp + " where UserID=" + UserID;

        if (UpLoadFileForPlatForm())
        {
            if (sqlExecute.sqlmanage.ExecuteSQL(sql, myserver))
            {
                Response.Write("<Script Language='JavaScript'>alert('修改成功!')</Script>");
                return;
            }


        }
        else
        {
            Response.Write("<Script Language='JavaScript'>alert('修改失败!')</Script>");
            return;
        }



    }



    bool CheckConnection(string Link)
    {
        SqlConnection con = new SqlConnection(Link);
        try
        {
            con.Open();
            return true;
        }
        catch (Exception err)
        {
            return false;
        }
        finally
        {
            con.Close();
        }

    }
    protected void RadioButton1_CheckedChanged(object sender, EventArgs e)
    {
        Panel1.Visible = true;
    }
    protected void RadioButton2_CheckedChanged(object sender, EventArgs e)
    {
        Panel1.Visible = false;
    }


    void LoaUserData(string UserID)
    {
        SqlConnection con = new SqlConnection(myserver);
        SqlCommand cmd = new SqlCommand("select * from UserInfor where UserID=" + UserID, con);
        SqlDataAdapter ada = new SqlDataAdapter(cmd);
        DataSet ds = new DataSet();
        int counter = ada.Fill(ds, "temptable");
        if (counter > 0)
        {
            DataRow dr = ds.Tables["temptable"].Rows[0];
            userName.Text = dr["userName"].ToString();
            //   pwd.Text = dr[""].ToString();
            telephone.Text = dr["Telephone"].ToString();
            address.Text = dr["Adress"].ToString();
            Email.Text = dr["eMail"].ToString();
            if (dr["localDatabase"].ToString().Equals("0"))
            {
                RadioButton1.Checked = false;
                RadioButton2.Checked = true;

            }
            else
            {
                Panel1.Visible = true;
                RadioButton1.Checked = true;
                RadioButton2.Checked = false;
                DataBaseServe.Text = dr["DataBaseServer"].ToString();
                DataBaseName.Text = dr["DataBaseName"].ToString();
                DataBaseUserName.Text = dr["DataBaseUserID"].ToString();
                DataBasepwd.Text = dr["DataBasePwd"].ToString();
            }

            LocateRegion.Text = dr["LocateRegion"].ToString();
            BusinessSphere.Text = dr["BusinessSphere"].ToString();
            Entwebsite.Text = dr["EntWebSite"].ToString();
            Weibo.Text = dr["Microblog"].ToString();
            RegisterIDCard.Text = dr["RegisterIDCard"].ToString();
            GudingTelephone.Text = dr["GudingTelephone"].ToString();
            RealName.Text = dr["RegisterRealName"].ToString();
            EntFullName.Text = dr["EntFullName"].ToString();



        }

    }
    bool UpLoadFileForPlatForm()
    {
        bool fileIsValid = false;
        //如果确认了文件上传，则判断文件类型是否符合要求
        string fileExtension = "";
        if (this.FileUpload1.HasFile)
        {
            //获取上传文件的后缀名
            fileExtension = System.IO.Path.GetExtension(this.FileUpload1.FileName).ToLower();//ToLower是将Unicode字符的值转换成它的小写等效项
            //定义一个数组，把文件后缀名的的类型总结出来
            String[] restrictExtension = { ".rar", ".zip" };
            //判断文件类型是否符合要求
            for (int i = 0; i < restrictExtension.Length; i++)
            {
                if (fileExtension == restrictExtension[i])
                {
                    fileIsValid = true;
                }
            }
        }
        //如果文件类型符合要求，则用SaveAs方法实现上传，并显示信息
        if (fileIsValid == true)
        {
            try
            {
                this.FileUpload1.SaveAs(Server.MapPath("~/UpLoadFiles/adminCloudMDBUserAudit/") + userName.Text.ToString().Trim() + fileExtension);
                this.Label1.Text = "文件上传成功";
                return true;
            }
            catch
            {
                this.Label1.Text = "文件上传不成功";
                return false;
            }
            finally
            {

            }
        }
        else
        {
            this.Label1.Text = "文件的后缀名只能为.zip、.rar、";
            return false;
        }
    }
}