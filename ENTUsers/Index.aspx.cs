using System;

public partial class Index : System.Web.UI.Page
{

    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            if (!Session["UserType"].ToString().Equals("ENTUser"))
            {
                Response.Write("<script language=javascript>alert('Ȩ�����ޣ�');location='../../index.aspx'</script>");
            }
        }
        catch
        {
            Response.Write("<script language=javascript>alert('ϵͳ��¼����');location='../../index.aspx'</script>");
        }
    }



}