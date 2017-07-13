using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;






public partial class LonlyP : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }
    
    protected void Registerbtn_Click(object sender, EventArgs e)
    {
		
   
        string PreIndex = ConfigurationManager.AppSettings["PreIndex"];
        string myserver = ConfigurationManager.AppSettings["myserver"];
        if (ReadContract.Checked != true)
        {
            Response.Write("<Script Language='JavaScript'>alert('请首选阅读《云制造平台使用协议》！')</Script>");
            return;
        }
        string tempconnstr = "server=" + myserver + ";Initial Catalog=CloudMDB;User ID=sa;Password=zju308;connect timeout=30";
        
        Response.Clear();
        if (!sqlExecute.sqlmanage.HasRecord(tempconnstr, "select * from UserInfor where userName='" + userName.Text.ToString().Trim() + "'"))
        {

            string temp = null;
            temp += "'个人—" + RealName.Text.ToString()+ "',";
            temp += "'" + userName.Text.ToString().Trim() + "',";
            temp += "'" + pwd.Text.ToString() + "',";
            temp += "'" + telephone.Text.ToString() + "',";
            temp += "'" + GudingTelephone.Text.ToString() + "',";
            temp += "'" + RealName.Text.ToString() + "',";
            temp += "'" + Weibo.Text.ToString() + "',";
            temp += "'" + RegisterIDCard.Text.ToString() + "',";
            temp += "'" + Email.Text.ToString() + "',";
            temp += "'" + address.Text.ToString() + "',";
            temp += "'" + LocateRegion.Text.ToString() + "',";
            temp += "'1',";
            temp += "'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "'";
            string sql = "insert into UserInfor (EntFullName,userName,userPass,Telephone,GudingTelephone,RegisterRealName,Microblog,RegisterIDCard,eMail,Adress,LocateRegion,UserType,RegisterTime) values (" + temp + ")";
            if (sqlExecute.sqlmanage.ExecuteSQL(sql, tempconnstr))
            {
                Response.Write("<Script Language='JavaScript'>alert('注册成功!')</Script>");
                   

            }


            else
            {
                Response.Write("<Script Language='JavaScript'>alert('注册失败!')</Script>");
                return;
            }


        }
        else
            Response.Write("<Script Language='JavaScript'>alert('该用户名已存在!')</Script>");
    }
}