using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Data;

public partial class WorkFlowTableData : System.Web.UI.Page
{

    int start = 0;
    int limit = 5;
    string sql;
    string getcountSql;
    string connectstr;
    protected void Page_Load(object sender, EventArgs e)
    {
        connectstr = Session["connectstr"].ToString();
        if (!string.IsNullOrEmpty(Request["limit"]))
        {
            limit = int.Parse(Request["limit"]);
        }
        if (!string.IsNullOrEmpty(Request["start"]))
        {
            start = int.Parse(Request["start"]);
        }

        if (string.IsNullOrEmpty(Request["operatype"]))
        {
            sql = "select top " + limit + "  workflow.*,E1.人员名称 as creatorName,ProjList.项目名称 as ProjectName,ProjList.项目负责人 as chargor,WorkFlowState.StateName" +
                " from workflow,WorkFlowState,EmployeeList E1,ProjList where ID not in (select top " + start
                    + " ID from workflow) and workflow.State*=WorkFlowState.StateID and workflow.creator*=E1.人员ID and workflow.ProjectID*=ProjList.序号 ";
            getcountSql = "select  ID  from  workflow";
        }

        else if (Request["operatype"].Equals("search"))
        {
            string filter = "";
            if (Request["WorkFlowName"] != null && !Request["WorkFlowName"].ToString().Equals(""))
                filter += " and name like '%" + Request["WorkFlowName"].ToString().Trim() + "%'";
            sql = "select  workflow.*,E1.人员名称 as creatorName,ProjList.项目名称 as ProjectName,ProjList.项目负责人 as chargor,WorkFlowState.StateName " +
                   " from workflow,EmployeeList E1,ProjList,WorkFlowState where " +
                   " workflow.State*=WorkFlowState.StateID and workflow.creator*=E1.人员ID and workflow.ProjectID*=ProjList.序号 " + filter;

            getcountSql = "select  ID  from workflow where ID>-1 " + filter;

        }

        SQLToJson.ReaderSQLToJson.SetCount(getcountSql, connectstr);
        Response.Write(GetJsonStr(sql));

        Response.End();
        Response.Clear();

    }
    protected string GetJsonStr(string Sql)
    {
        SqlConnection con = new SqlConnection(connectstr);
        con.Open();
        SqlCommand cmd = new SqlCommand(Sql, con);
        SqlDataReader sdr = cmd.ExecuteReader();
        string Json = SQLToJson.ReaderSQLToJson.GetJSON(sdr);
        return Json.ToString();
    }
}