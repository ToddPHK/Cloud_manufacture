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
    string sql;
    string getcountSql;
    protected void Page_Load(object sender, EventArgs e)
    {
        //connectstr = Session["connectstr"].ToString();
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        if (PlatForm_connectstr != "")
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

                sql = "Set ARITHABORT ON select top " + limit +
                    " TaskList_Backup.*,WorkFlow_Backup.WorkFlowName,TaskState.TaskStateName,TaskName,ServiceTree.StandardTaskName,UserInfor.userName as EntName from TaskList_Backup,WorkFlow_Backup,TaskState,UserInfor,ServiceTree where TaskList_Backup.ID not in (select top " + start
                        + " ID from TaskList_Backup) and  TaskList_Backup.WorkFlowID*=WorkFlow_Backup.ID  and TaskList_Backup.TaskState*= TaskState.TaskStateID and TaskList_Backup.Publisher*=UserInfor.UserID  and TaskDetailInf.value('(/Task/@StandardTaskID)[1]','int')*=ServiceTree.NodeId";
                getcountSql = "select  ID  from TaskList_Backup";

            }
            else if (Request["OperateType"].Equals("search"))
            {
                string filter = "";
                if (Request["StandardTaskID"] != null && !Request["StandardTaskID"].ToString().Equals(""))
                {
                    TreeJson ss = new TreeJson();
                    string[] tempIDs = ss.getChildID("ServiceTree", PlatForm_connectstr, "NodeId", "PNodeId", "select NodeId,PNodeId from ServiceTree where NodeId=" + Request["StandardTaskID"].ToString());
                    filter += " and TaskDetailInf.value('(/Task/@StandardTaskID)[1]','int') in (" + string.Join(",", tempIDs) + ")";
                }
                if (Request["TaskName"] != null && !Request["TaskName"].ToString().Equals(""))
                    filter += " and TaskName like '%" + Request["TaskName"].ToString() + "%'";
                if (Request["TaskEnt"] != null && !Request["TaskEnt"].ToString().Equals(""))
                    filter += " and TaskList_Backup.Publisher in ( select UserID from UserInfor where userName like '%" + Request["TaskEnt"].ToString() + "%' )";

                sql = "Set ARITHABORT ON select top " + limit +
                    " TaskList.*,WorkFlow.WorkFlowName,TaskState.TaskStateName,TaskName,ServiceTree.StandardTaskName,UserInfor.userName as EntName from TaskList,WorkFlow,TaskState,UserInfor,ServiceTree where TaskList.ID not in (select top " + start
                        + " ID from TaskList where  ID >-1 " + filter + " order by ID ) and  TaskList.WorkFlowID*=WorkFlow.ID  and TaskList.TaskState*= TaskState.TaskStateID and TaskList.Publisher*=UserInfor.UserID  and TaskDetailInf.value('(/Task/@StandardTaskID)[1]','int')*=ServiceTree.NodeId " + filter + " order by TaskList.ID";
                getcountSql = " select  *  from TaskList_Backup where ID >-1  " + filter;
            }
            SQLToJson.ReaderSQLToJson.SetCount(getcountSql, PlatForm_connectstr);
            Response.Write(GetJsonStr(sql, PlatForm_connectstr));

            Response.End();
            Response.Clear();
        }
    }
    protected string GetJsonStr(string Sql,string  PlatForm_connectstr)
    {
        SqlConnection con = new SqlConnection(PlatForm_connectstr);
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