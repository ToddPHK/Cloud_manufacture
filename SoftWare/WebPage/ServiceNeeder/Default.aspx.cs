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
                Response.Write("<script language=javascript>alert('Ȩ�����ޣ�');location='../../../../index.aspx'</script>");
            }
        }
        catch (Exception err) 
        {
            Response.Write("<script language=javascript>alert('ϵͳ��¼����');location='../../../../index.aspx'</script>");
        }
    }
}