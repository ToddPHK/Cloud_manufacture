using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;


public partial class PlatForm_Admin_WebPage_LoginLog_DataProcess : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

        string  connectstr = Session["connectstr"].ToString(); ;
        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();
            if (OperateType.Equals("DeleteloginLog"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("delete from LoginLog where ID in (" + Request["IDS"].ToString() + ")", connectstr))
                    Response.Write("用户登录日志删除成功！");
                else

                    Response.Write("用户登录日志删除失败！");

            }
        }

        Response.End();
        Response.Clear();

    }
}