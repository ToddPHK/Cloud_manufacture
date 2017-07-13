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
            if (string.IsNullOrEmpty(Request["OperateType"]))//如果没有传来的projectname的值就显示所有文档EmployeeList
            {


                sql = "Set ARITHABORT ON select top " + limit +
                    " TaskList.*,TaskState.TaskStateName,TaskDetailInf.value('(/Task/@StandardTaskID)[1]','int') as  TaskTemplateID,TaskDetailInf.value('(//TaskName)[1]','varchar(50)') as  TaskName,EmployeeList.人员名称 as CreatorName,P1.Name as ProjectName,P2.Name as PrjTaskTreeName from TaskList,TaskState,EmployeeList,ProjectTaskTree P1,ProjectTaskTree P2 where TaskID not in (select top " + start
                        + " TaskID from TaskList where BelongProjectTreeNode in (" + IDs + ") and TaskState=0 order by TaskCreateDate ) and TaskState=0 and TaskList.TaskState= TaskState.TaskStateID and TaskList.TaskCreator=EmployeeList.人员ID and TaskList.BelongProject=P1.ID and TaskList.BelongProjectTreeNode=P2.ID and  TaskList.BelongProjectTreeNode in (" + IDs + ") order by TaskCreateDate";
                getcountSql = "select  TaskID  from TaskList where BelongProjectTreeNode in (" + IDs + ") and TaskState=0";

            }
            else
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
    " from TaskList,EmployeeList,TaskState,ProjectTaskTree P1,ProjectTaskTree P2 where TaskList.TaskState= TaskState.TaskStateID and TaskList.TaskCreator=EmployeeList.人员ID and TaskList.BelongProject=P1.ID and TaskList.BelongProjectTreeNode=P2.ID and  TaskList.BelongProjectTreeNode in (" + IDs + ") " + filter + " order by TaskCreateDate";
                getcountSql = "Set ARITHABORT ON select  TaskID  from TaskList where BelongProjectTreeNode in (" + IDs + ") and TaskState=0 " + filter;
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