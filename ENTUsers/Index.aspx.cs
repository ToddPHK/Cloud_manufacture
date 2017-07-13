using System;

public partial class Index : System.Web.UI.Page
{

    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            if (!Session["UserType"].ToString().Equals("ENTUser"))
            {
                Response.Write("<script language=javascript>alert('权限受限！');location='../../index.aspx'</script>");
            }
        }
        catch
        {
            Response.Write("<script language=javascript>alert('系统登录出错！');location='../../index.aspx'</script>");
        }
    }



}