using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using SQLToTreeJson;
using System.Data.SqlClient;

public partial class ENTInnerUsers_PDM_prjManege_TaskTableData : System.Web.UI.Page
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



            }
            else if (Request["OperateType"].Equals("LoadTaskByPrj"))
            {


                string filter = "";

                if (Request["PrjID"].ToString().Equals("all"))
                    filter = "";
                else
                    filter += " and ProjectID in (" + Request["PrjID"].ToString() + ")";

                sql = "Set ARITHABORT ON select top " + limit +
                    " E1.人员名称 as CreatorName,E2.人员名称 as ChargorName,ProjectTaskTree.CreateDate as NodeCreateDate ,TaskTable.FileName,TaskTable.TaskDetailInf,TaskTable.TaskCreateDate,TaskTable.TaskStateName,TaskTable.TypeName,TaskTable.WorkFlowName,ProjList.项目名称 as ProjectName,ProjectTaskTree.Name as PrjTaskTreeName  from ProjectTaskTree,(select TaskList.*,TaskType.TypeName,TaskState.TaskStateName,workflow.name as WorkFlowName from TaskList,workflow,TaskState,TaskType where TaskList.TypeID*=TaskType.TypeID and TaskList.WorkFlowID*=workflow.ID and TaskList.TaskState*= TaskState.TaskStateID) TaskTable ,EmployeeList E1,EmployeeList E2,ProjList  where ProjectTaskTree.ID not in (select top " + start
                        + " ID from ProjectTaskTree where ID >-1 " + filter + " order by ID) and  ProjectTaskTree.ID*=TaskTable.BelongProjectTreeNode and ProjectTaskTree.ProjectID*= ProjList.序号 and ProjectTaskTree.Chargor*=E1.人员ID and ProjectTaskTree.Creator*=E2.人员ID   " + filter + " order by ID  ";
                getcountSql = "Set ARITHABORT ON select  ID  from ProjectTaskTree where ID >-1   " + filter;
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