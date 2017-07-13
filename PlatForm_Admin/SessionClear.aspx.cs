using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class PlatForm_Admin_SessionClear : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Request["OperateType"] != null)
        {
            string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
            string OperateType = Request["OperateType"].ToString();


            if (OperateType.Equals("ClearAllSession"))
            {
                Session.Clear();
            }
            else if (OperateType.Equals("SwapStyleSheet"))
            {
                //sqlExecute.sqlmanage.ExecuteSQL("update UserInfor set StyleSheet='" + Request["StyleSheet"] + "' where UserID=" + Session["userID"].ToString(), PlatForm_connectstr)
                if (sqlExecute.sqlmanage.ExecuteSQL("update yunyingshang set StyleSheet='" + Request["StyleSheet"] + "' where ID=" + Session["userID"].ToString(), PlatForm_connectstr))
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
                string s = sqlExecute.sqlmanage.GetUniqueRecord("select Microblog from UserInfor  where UserID=" + Session["userID"].ToString(), PlatForm_connectstr, new string[] { "Microblog" });

                Response.Write(s);
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("EditPassWord"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update UserInfor set userPass='" + Request["password"] + "' where UserID=" + Session["userID"].ToString(), PlatForm_connectstr))
                {
                    Response.Clear();
                    Response.Write("{success:true,msg:'密码修改成功！'}");
                }
                else
                {
                    Response.Write("{success:true,msg:'密码修改失败！'}");
                }
                Response.End();
            }
        }
    }
}