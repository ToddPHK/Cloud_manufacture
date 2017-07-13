<%@ WebHandler Language="C#" Class="roleTree" %>

using System.Web;
using System.Web.SessionState;
using SQLToTreeJson;
using System.Web.Script.Serialization;
public class roleTree : IHttpHandler, IRequiresSessionState
{

    public void ProcessRequest(HttpContext context)
    {
        try
        {
            string connectstr = context.Session["ConnString"].ToString();
            int entId = (int)context.Session["UserID"];
            string sql = "select * from DeptList where entId = " + entId + " AND 上级部门 is null ";
            context.Response.Clear();
            context.Response.Write(ToJson(new TreeJson().filltreeview("DeptList", connectstr, sql, "部门编号", "上级部门", "部门名称")));
            context.Response.End();
        }
        catch
        {
            throw;
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

    protected string ToJson(object o)
    {
        //序列化对象为json数据，很重要！
        JavaScriptSerializer j = new JavaScriptSerializer();
        return j.Serialize(o);
    }
}