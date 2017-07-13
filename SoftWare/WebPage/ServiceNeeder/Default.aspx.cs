using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class SoftWare_WebPage_Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            if (!Session["UserType"].ToString().Equals("ENTUser") && !Session["UserType"].ToString().Equals("PersonalUser"))
            {
                Response.Write("<script language=javascript>alert('权限受限！');location='../../../../index.aspx'</script>");
            }
        }
        catch (Exception err) 
        {
            Response.Write("<script language=javascript>alert('系统登录出错！');location='../../../../index.aspx'</script>");
        }
    }
}