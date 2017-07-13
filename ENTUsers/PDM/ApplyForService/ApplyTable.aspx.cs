using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using SQLToTreeJson;
using System.Data.SqlClient;

public partial class ENTUsers_PDM_ApplyForService_ApplyTable : System.Web.UI.Page
{
    int start = 0;
    int limit = 10;
    string prjName = "";
    string sql;
    string getcountSql;
    string connectstr;
    protected void Page_Load(object sender, EventArgs e)
    {
        connectstr = Session["connectstr"].ToString();
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        if (connectstr != "")
        {
            //  connectstr = "server=(local);Initial Catalog=" + connectstr + ";User ID=sa;Password=zju308;connect timeout=30";
            if (!string.IsNullOrEmpty(Request["limit"]))
            {
                limit = int.Parse(Request["limit"]);
            }
            if (!string.IsNullOrEmpty(Request["start"]))
            {
                start = int.Parse(Request["start"]);
            }
            if (string.IsNullOrEmpty(Request["OperateType"]))//如果没有传来的projectname的值就显示所有文档EmployeeList
            {

                sql = "select top " + limit +
                    " ApplyForService.*,UserInfor.userName,TaskDetailInf.value('(//TaskName)[1]','varchar(50)') as  TaskName,ServResource.资源名称 as ServiceName  from ApplyForService,UserInfor,TaskList,ServResource where ID not in (select top " + start
                        + " ID from ApplyForService) and  ApplyForService.ApplicantEntID*=UserInfor.UserID and  ApplyForService.TaskID*=TaskList.ID and  ApplyForService.ServiceID*=ServResource.资源编号";
                getcountSql = "select  ID  from ApplyForService";

            }
            else if (Request["OperateType"].Equals("search"))
            {
                TreeJson ss = new TreeJson();

                string filter = "";
                if (Request["StandardTaskID"] != null && !Request["StandardTaskID"].ToString().Equals(""))
                {
                    string[] tempIDs = ss.getChildID("StandardTask", PlatForm_connectstr, "StandardTaskID", "StandardTaskParentID", "select StandardTaskID from StandardTask where StandardTaskID=" + Request["StandardTaskID"].ToString());
                    filter += " and TaskDetailInf.value('(/Task/@StandardTaskID)[1]','int') in (" + string.Join(",", tempIDs) + ")";
                }
                if (Request["ProjectTaskID"] != null && !Request["ProjectTaskID"].ToString().Equals(""))
                {
                    string[] tempIDs = ss.getChildID("ProjectTaskTree", connectstr, "ID", "ParentID", "select ID from ProjectTaskTree where ID=" + Request["ProjectTaskID"].ToString());
                    filter += " and BelongProjectTreeNode in (" + string.Join(",", tempIDs) + ")";
                }
                if (Request["TaskName"] != null && !Request["TaskName"].ToString().Equals(""))
                    filter += " and TaskDetailInf.value('(//TaskName)[1]','varchar(50)') like '%" + Request["TaskName"].ToString().Trim() + "%'";

                sql = "Set ARITHABORT ON select " +
    " TaskList.*,TaskState.TaskStateName,TaskDetailInf.value('(/Task/@StandardTaskID)[1]','int') as  TaskTemplateID,TaskDetailInf.value('(//TaskName)[1]','varchar(50)') as  TaskName,EmployeeList.人员名称 as CreatorName,P1.Name as ProjectName,P2.Name as PrjTaskTreeName " +
    " from TaskList,EmployeeList,TaskState,ProjectTaskTree P1,ProjectTaskTree P2 where TaskList.TaskState= TaskState.TaskStateID and TaskList.TaskCreator=EmployeeList.人员ID and TaskList.BelongProject=P1.ID and TaskList.BelongProjectTreeNode=P2.ID " + filter;
                getcountSql = "Set ARITHABORT ON select  TaskID  from TaskList where TaskID >-1  " + filter;
            }

            SQLToJson.ReaderSQLToJson.SetCount(getcountSql, connectstr);
            Response.Write(GetJsonStr(sql));

            Response.End();
            Response.Clear();
        }
    }
    protected string GetJsonStr(string Sql)
    {
        SqlConnection con = new SqlConnection(connectstr);
        con.Open();
        SqlCommand cmd = new SqlCommand(Sql, con);
        SqlDataReader sdr = cmd.ExecuteReader();
        if (sdr.FieldCount < 1)
            return "";
        else
        {
            string Json = SQLToJson.ReaderSQLToJson.GetJSON(sdr);
            return Json.ToString();
        }
    }
}