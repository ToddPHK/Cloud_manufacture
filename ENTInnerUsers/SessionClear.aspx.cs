using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class ENTInnerUsers_SessionClear : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Request["OperateType"] != null)
        {
            string connectstr = Session["connectstr"].ToString();
            string OperateType = Request["OperateType"].ToString();


            if (OperateType.Equals("ClearAllSession"))
            {
                Session.Clear();
            }
            else if (OperateType.Equals("SwapStyleSheet"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update EmployeeList set StyleSheet='" + Request["StyleSheet"] + "' where 人员ID=" + Session["userID"], connectstr))
                {
                    Session["StyleSheet"] = Request["StyleSheet"];
                    Response.Write("{success:true,msg:'模板标签元素修改成功！',tr:'another inf'}");
                }
                else
                    Response.Write("{success:false,msg:'模板标签元素修改失败！',tr:'another inf'}");
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("Microblog"))
            {
                string s = sqlExecute.sqlmanage.GetUniqueRecord("select Microblog from EmployeeList  where 人员ID=" + Session["userID"].ToString(), connectstr, new string[] { "Microblog" });

                Response.Write(s);
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("EditPassWord"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update EmployeeList set 密码='" + Request["PassWord"] + "' where 人员ID=" + Session["userID"], connectstr))
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