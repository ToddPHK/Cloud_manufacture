<%@ WebHandler Language="C#" Class="roleTableData" %>

using System.Web;
using System.Web.SessionState;

public class roleTableData : IHttpHandler, IRequiresSessionState
{

    public void ProcessRequest(HttpContext context)
    {
        int limit = 10;     //每页显示的数量
        int start = 0;      //开始的数量
        string roleType = "";   //要搜索的角色类型，空表示所有，
        int entId = (int)context.Session["UserID"];
        string connString = context.Session["ConnString"].ToString();
        CloudBLL.Entprise bllEnt = new CloudBLL.Entprise();
        if (!string.IsNullOrEmpty(context.Request["limit"]))
        {
            limit = int.Parse(context.Request["limit"]);
        }
        if (!string.IsNullOrEmpty(context.Request["start"]))
        {
            start = int.Parse(context.Request["start"]);
        }
        if (!string.IsNullOrEmpty(context.Request["roletype"]))
        {
            roleType = context.Request["roletype"].ToString();
        }

        if (string.IsNullOrEmpty(roleType))     //显示所有成员
        {
            string resultJson = bllEnt.SelectEmployee(limit, start, entId, connString);
            context.Response.Write(resultJson);
            context.Response.End();
            context.Response.Clear();
        }
        else if (roleType.Equals("PeopleSearch"))   //对雇员进行搜索
        {
            string filter = "";
            if (!string.IsNullOrEmpty(context.Request.Form["PeopleName"]) && Filter.SqlFilter(context.Request.Form["PeopleName"]))
                filter += " and 人员名称 like '%" + context.Request.Form["PeopleName"].Trim() + "%'";
            if (!string.IsNullOrEmpty(context.Request.Form["FirstRole"]))
                filter += " and 归属角色='" + context.Request.Form["FirstRole"].Trim() + "'";
            if (!string.IsNullOrEmpty(context.Request.Form["PeopleNum"]) && Filter.SqlFilter(context.Request.Form["PeopleNum"]))
                filter += " and 人员编号='" + context.Request.Form["PeopleNum"].Trim() + "'";
            if (!string.IsNullOrEmpty(context.Request.Form["PeopleGrade"]))
                filter += " and 学历='" + context.Request.Form["PeopleGrade"].Trim() + "'";

            string resultJson = bllEnt.SelectEmployee(limit, start, entId, connString, filter);
            context.Response.Write(resultJson);
            context.Response.End();
            context.Response.Clear();
        }
        else    //显示某个部门的成员
        {
            //得到一个部门所有的子部门序列
            SQLToTreeJson.TreeJson ff = new SQLToTreeJson.TreeJson();
            string departIds = string.Join("','", ff.getChildID("DeptList", connString, "部门编号", "上级部门", "select * from DeptList where 部门编号='" + roleType + "'"));
            string resultJson = bllEnt.SelectOneDepartEmployee(limit, start, entId, connString, departIds);
            context.Response.Write(resultJson);
            context.Response.End();
            context.Response.Clear();
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