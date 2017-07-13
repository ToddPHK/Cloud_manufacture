using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;

public partial class ENTUsers_PDM_PrjManagerAudit_TServiceTable : System.Web.UI.Page
{
    int start = 0;
    int limit = 10;
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

                sql = " select top " + limit +
                    "  Task_Service.*,PrjTaskName.TaskName,PrjTaskName.TaskDetailInf from Task_Service,PrjTaskName where  Task_Service.ID not in (select top " + start
                        + " ID from Task_Service where   Flag=9 )   and Task_Service.TaskID*=PrjTaskName.PTaskID and Flag=9  ";
                getcountSql = "select  Task_Service.ID  from Task_Service where  Flag=9  ";

            }
            else if (Request["OperateType"].Equals("search"))
            {

                string filter = " and BelongProjectTreeNode in ( select ID from ProjectTaskTree where Name like '%" + Request["TaskName"].ToString().Trim() + "%')";

                sql = "Set ARITHABORT ON select top " + limit +
                    " TaskList.*,workflow.name as WorkFlowName,TaskType.TypeName,TaskState.TaskStateName,TaskDetailInf.value('(/Task/@StandardTaskID)[1]','int') as StandardTaskID,TaskDetailInf.value('(/Task/@StandardTaskID)[1]','int') as  TaskTemplateID,EmployeeList.人员名称 as CreatorName,P1.Name as ProjectName,P2.Name as PrjTaskTreeName,P2.Chargor as TaskCreator,ProjList.项目负责人 as ProjectChargorID from TaskList,workflow,TaskState,TaskType,EmployeeList,ProjectTaskTree P1,ProjectTaskTree P2,ProjList where TaskID not in (select top " + start
                        + " TaskID from TaskList where TaskID >-1  " + filter + " order by TaskID) and TaskList.TaskState*= TaskState.TaskStateID and  TaskList.TypeID*=TaskType.TypeID and  TaskList.WorkFlowID*=workflow.ID and P2.Chargor=EmployeeList.人员ID and TaskList.BelongProject=P1.ID and TaskList.BelongProjectTreeNode=P2.ID and P2.ProjectID=ProjList.序号 " + filter + " order by TaskID";
                getcountSql = "Set ARITHABORT ON select  TaskID  from TaskList where TaskID >-1  " + filter;
            }

            //else if (Request["taskOperaType"].Equals("TaskSearch"))
            //{
            //    string s = " ID,State,Project,Task.value('(/Task/@name)[1]','varchar(50)') as  任务名," +
            //  "Task.value('(//Creator)[1]','varchar(50)') as 任务创建人," +
            // "Task.value('(//Batch)[1]','varchar(50)') as  批量," +
            // "Task.value('(//ReleaseTime)[1]','varchar(50)') as  任务释放时间," +
            // "Task.value('(//PlanEndTime)[1]','varchar(50)') as  任务计划结束时间," +
            // "Task.value('(//Description)[1]','varchar(500)') as  任务描述," +
            // "Task.value('(//Accuracy)[1]','varchar(50)') as  精度";
            //    sql = "Set ARITHABORT ON select  " + s + "  from TaskList where Task.value('(/Task/@name)[1]','varchar(50)')='" + Request["taskName"] + "'";
            //    getcountSql = "Set ARITHABORT ON select  " + s + "  from TaskList where Task.value('(/Task/@name)[1]','varchar(50)')='" + Request["taskName"] + "'";

            //}

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