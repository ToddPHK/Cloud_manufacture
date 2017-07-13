<%@ WebHandler Language="C#" Class="Indexhandler" %>

using System;
using System.Web;
using System.Web.SessionState;

public class Indexhandler : IHttpHandler, IRequiresSessionState
{

    public void ProcessRequest(HttpContext context)
    {
        if (context.Request.QueryString["OperateType"] != null)
        {
            string OperateType = context.Request["OperateType"];
            string connString = context.Session["ConnString"].ToString();
            int entId = (int)context.Session["UserID"];
            CloudBLL.Entprise bllEnt = new CloudBLL.Entprise();

            switch (OperateType)
            {
                case "SwapStyleSheet":
                    string stylesheet = context.Request.QueryString["StyleSheet"];
                    if (bllEnt.UpdateStyleSheet(entId, stylesheet) == 1)
                    {
                        context.Session["StyleSheet"] = stylesheet;
                        context.Response.Write("{success:true,msg:'模板标签元素修改成功！',tr:'another inf'}");
                    }
                    else
                        context.Response.Write("{success:false,msg:'模板标签元素修改失败！',tr:'another inf'}");
                    context.Response.End();
                    context.Response.Clear();
                    break;
                case "ClearAllSession":
                        context.Session.Clear();
                        break;
            }
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}