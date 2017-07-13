using System;

public partial class ENTUsers_SessionClear : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Request["OperateType"] != null)
        {
            string PlatForm_connectstr = Session["ConnString"].ToString();
            string OperateType = Request["OperateType"].ToString();

            if (OperateType.Equals("ClearAllSession"))
            {
                Session.Clear();
            }
            else if (OperateType.Equals("EditPassWord"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update UserInfor set userPass='" + Request["PassWord"] + "' where UserID=" + Session["userID"], PlatForm_connectstr))
                {
                    Response.Write("{success:true,msg:'密码修改成功！'}");
                }
                else
                    Response.Write("{success:false,msg:'密码修改失败！'}");
                Response.End();
                Response.Clear();
            }
        }
    }
}