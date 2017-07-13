<%@ WebHandler Language="C#" Class="GetComboxData" %>
using System.Web;
using System.Data;
using System.Web.SessionState;

public class GetComboxData : IHttpHandler, IRequiresSessionState
{

    public void ProcessRequest(HttpContext context)
    {
        if (context.Request.Form["OperateType"] != null)
        {
            CloudBLL.Entprise bllEnt = new CloudBLL.Entprise();
            string data = "";
            string operateType = context.Request.Form["OperateType"].ToString();
            int entId = (int)context.Session["UserID"];
            string connString = context.Session["ConnString"].ToString();
            DataTable dt;
            switch (operateType)
            {
                case "allemployee":
                    dt = bllEnt.SelectAllEmployee(connString, entId);
                    data = WebCloud.ToArrayString(dt, "人员ID", "人员名称");
                    break;
                case "ProjectList":
                    dt = bllEnt.SelectAllProject(connString, entId);
                    data = WebCloud.ToArrayString(dt, "项目编号", "项目名称");
                    break;
                case "ProjectState":
                    dt = bllEnt.SelectProjectState(connString);
                    data = WebCloud.ToArrayString(dt, "StateID", "StateText");
                    break;
                case "ProjectType":
                    dt = bllEnt.SelectProjectType(connString);
                    data = WebCloud.ToArrayString(dt, "TypeID", "TypeText");
                    break;
                case "role":
                    dt = bllEnt.SelectAllRole(connString, entId);
                    data = WebCloud.ToArrayString(dt, "ID", "Name");
                    break;
                case "DepartList":
                    dt = bllEnt.SelectAllDepartment(connString, entId);
                    data = WebCloud.ToArrayString(dt, "部门编号", "部门名称");
                    break;
                case "TaskState":
                    dt = bllEnt.SelectTaskState(connString);
                    data = WebCloud.ToArrayString(dt, "TaskStateID", "TaskStateName");
                    break;

            }
            context.Response.Write(data);
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