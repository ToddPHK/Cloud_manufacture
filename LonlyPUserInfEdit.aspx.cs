using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;

public partial class LonlyPUserInfEdit : System.Web.UI.Page
{
    string sql;
    string myserver;
    string UserID;
    protected void Page_Load(object sender, EventArgs e)
    {
        myserver = "server=" + ConfigurationManager.AppSettings["myserver"] + ";Initial Catalog=CloudMDB;User ID=sa;Password=zju308;connect timeout=30";
        UserID = sqlExecute.sqlmanage.GetUniqueRecord("select UserID from UserInfor where userName='" + Request["userName"].ToString() + "'  and userPass='" + Request["userPass"] + "'", myserver, new string[] { "UserID" });

        if (!IsPostBack)
        {

            LoaUserData(UserID);
        }
        
    }
    protected void Registerbtn_Click(object sender, EventArgs e)
    {

        if (ReadContract.Checked != true)
        {
            Response.Write("<Script Language='JavaScript'>alert('请首选阅读《云制造平台使用协议》！')</Script>");
            return;
        }
     
        if (!sqlExecute.sqlmanage.HasRecord(myserver, "select * from UserInfor where userName='" + userName.Text.ToString().Trim() + "' and UserID<>=" + UserID))
        {

            string temp = null;
            temp += "EntFullName='个人—" + userName.Text.ToString().Trim() + "',";
            temp += "userName='" + userName.Text.ToString().Trim() + "',";
            temp += "userPass='" + pwd.Text.ToString() + "',";
            temp += "Telephone='" + telephone.Text.ToString() + "',";
            temp += "GudingTelephone='" + GudingTelephone.Text.ToString() + "',";
            temp += "RegisterRealName='" + RealName.Text.ToString() + "',";
            temp += "Microblog='" + Weibo.Text.ToString() + "',";
            temp += "RegisterIDCard='" + RegisterIDCard.Text.ToString() + "',";
            temp += "eMail='" + Email.Text.ToString() + "',";
            temp += "Adress='" + address.Text.ToString() + "',";
            temp += "LocateRegion='" + LocateRegion.Text.ToString() + "',";
            temp += "UserType='1',";
            temp += "UserState=0,";
            temp += "UserLastEditTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "'";
            sql = "update  UserInfor set " + temp + " where UserID=" + UserID;
            Response.Clear();
            if (sqlExecute.sqlmanage.ExecuteSQL(sql, myserver))
            {
                Response.Write("<Script Language='JavaScript'>alert('修改成功!')</Script>");

            }


            else
            {
                Response.Write("<Script Language='JavaScript'>alert('修改失败!')</Script>");
                return;
            }


        }
        else
            Response.Write("<Script Language='JavaScript'>alert('该用户名已存在!')</Script>");

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
            telephone.Text = dr["Telephone"].ToString();
            GudingTelephone.Text = dr["GudingTelephone"].ToString();
            RealName.Text = dr["RegisterRealName"].ToString();
            Weibo.Text = dr["Microblog"].ToString();
            RegisterIDCard.Text = dr["RegisterIDCard"].ToString();
             Email.Text = dr["eMail"].ToString();         
            address.Text = dr["Adress"].ToString();
 
            LocateRegion.Text = dr["LocateRegion"].ToString();






        }

    }
}