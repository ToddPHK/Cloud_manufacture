using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Net.Mail;
using System.Configuration;

public partial class PlatForm_Admin_Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            if (!Session["UserType"].ToString().Equals("PlatFormUser"))
            {
                Response.Write("<script language=javascript>alert('权限受限！');location='../Default.aspx'</script>");
            }
        }
        catch (Exception err)
        {
            Response.Write("<script language=javascript>alert('系统登录出错！');location='../Default.aspx'</script>");
        }
    }
}