using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using SQLToTreeJson;

public partial class PDM_TaskManage_TaskTableData : System.Web.UI.Page
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
            string sss = "select * from ProjectTaskTree where Creator=" + Session["userID"].ToString() + " or Chargor=" + Session["userID"].ToString();
            string[] childIDs = new TreeJson().getChildID("ProjectTaskTree", connectstr, "ID", "ParentID", sss);
            string IDs = string.Join(",", childIDs);
            if (!string.IsNullOrEmpty(Request["limit"]))
            {
                limit = int.Parse(Request["limit"]);
            }
            if (!string.IsNullOrEmpty(Request["start"]))
            {
                start = int.Parse(Request["start"]);
            }
            if (string.IsNullOrEmpty(Request["OperateType"]))
            {


                sql = "Set ARITHABORT ON select top " + limit +
                    " TaskList.*,workflow.name as WorkFlowName,TaskType.TypeName,TaskState.TaskStateName,EmployeeList.人员名称 as CreatorName,P1.Name as ProjectName,P2.Name as PrjTaskTreeName from TaskList,workflow,TaskState,TaskType,EmployeeList,ProjectTaskTree P1,ProjectTaskTree P2,ProjList where TaskID not in  (select top " + start
                        + " TaskID from TaskList where BelongProjectTreeNode in (" + IDs + ") and TaskState=19 and WorkFlowID=-1 order by TaskCreateDate ) and TaskState=19 and WorkFlowID=-1 and  TaskList.TaskState*= TaskState.TaskStateID and  TaskList.TypeID*=TaskType.TypeID and  TaskList.WorkFlowID*=workflow.ID  and TaskList.BelongProject=P1.ID and TaskList.BelongProjectTreeNode=P2.ID and P2.ProjectID=ProjList.序号 and P2.Chargor=EmployeeList.人员ID and  TaskList.BelongProjectTreeNode in (" + IDs + ") order by TaskCreateDate";
                getcountSql = "select  TaskID  from TaskList where BelongProjectTreeNode in (" + IDs + ") and TaskState=19 and WorkFlowID=-1";

            }
            else
            {
               

                string filter = "";
                if (Request["StandardTaskID"] != null && !Request["StandardTaskID"].ToString().Equals(""))
                {
                    TreeJson ss = new TreeJson();
                    string[] tempIDs = ss.getChildID("ServiceTree", PlatForm_connectstr, "NodeId", "PNodeId", "select NodeId,PNodeId from ServiceTree where NodeId=" + Request["StandardTaskID"].ToString());
                    filter += " and TaskDetailInf.value('(/Task/@StandardTaskID)[1]','int') in (" + string.Join(",", tempIDs) + ")";
                }
                if (Request["ProjectTaskID"] != null && !Request["ProjectTaskID"].ToString().Equals(""))
                {
                    TreeJson ss = new TreeJson();
                    string[] tempIDs = ss.getChildID("ProjectTaskTree", connectstr, "ID", "ParentID", "select ID from ProjectTaskTree where ID=" + Request["ProjectTaskID"].ToString());
                    filter += " and BelongProjectTreeNode in (" + string.Join(",", tempIDs) + ")";
                }
                if (Request["TaskName"] != null && !Request["TaskName"].ToString().Equals(""))
                    filter += " and TaskDetailInf.value('(//TaskName)[1]','varchar(50)') like '%" + Request["TaskName"].ToString().Trim() + "%'";

                sql = "Set ARITHABORT ON select top " + limit +
                  " TaskList.*,workflow.name as WorkFlowName,TaskType.TypeName,TaskState.TaskStateName,EmployeeList.人员名称 as CreatorName,P1.Name as ProjectName,P2.Name as PrjTaskTreeName from TaskList,workflow,TaskState,TaskType,EmployeeList,ProjectTaskTree P1,ProjectTaskTree P2,ProjList where TaskID not in  (select top " + start
                      + " TaskID from TaskList where BelongProjectTreeNode in (" + IDs + ") and TaskState=19 and WorkFlowID=-1 " + filter + " order by TaskCreateDate ) and TaskState=19 and WorkFlowID=-1 and  TaskList.TaskState*= TaskState.TaskStateID and  TaskList.TypeID*=TaskType.TypeID and  TaskList.WorkFlowID*=workflow.ID  and TaskList.BelongProject=P1.ID and TaskList.BelongProjectTreeNode=P2.ID and P2.ProjectID=ProjList.序号 and P2.Chargor=EmployeeList.人员ID " + filter + " and  TaskList.BelongProjectTreeNode in (" + IDs + ") order by TaskCreateDate";
                getcountSql = "Set ARITHABORT ON select  TaskID  from TaskList where BelongProjectTreeNode in (" + IDs + ") and TaskState=19 and WorkFlowID=-1 " + filter;
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