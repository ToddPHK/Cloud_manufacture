using System;
using System.Data.SqlClient;

public partial class PDM_prjManege_prjTablePanelData : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        int start = 0;
        int limit = 10;
        string sql="";
        string connectstr = Session["ConnString"].ToString();
        if (connectstr != "")
        {
        //    connectstr = "server=(local);Initial Catalog=" + connectstr + ";User ID=sa;Password=zju308;connect timeout=30";
            if (!string.IsNullOrEmpty(Request["limit"]))
            {
                limit = int.Parse(Request["limit"]);
            }
            if (!string.IsNullOrEmpty(Request["start"]))
            {
                start = int.Parse(Request["start"]);
            }
            if (string.IsNullOrEmpty(Request["OperateType"]))//没有参数，显示所有的项目
            {
                sql = "SELECT table1.*, ProjectState.StateText, ProjectType.TypeText, Person1.人员名称, Person2.人员名称 AS PrjCreator FROM (SELECT *, ROW_NUMBER() OVER(order BY 序号) as rowNo FROM ProjList WHERE entId = 19) AS table1 INNER JOIN ProjectState ON table1.项目状态 = ProjectState.StateID INNER JOIN EmployeeList AS Person1 ON (table1.entId = Person1.entId AND Person1.人员id = table1.项目负责人) INNER JOIN EmployeeList AS Person2 ON (table1.entId = Person2.entId AND Person2.人员id = table1.项目创建人) INNER JOIN ProjectType ON ProjectType.TypeID = table1.项目类型 WHERE rowNo between "+ start +" AND "+ (start + limit)+";";
            }
            else if (Request["OperateType"].Equals("search"))
            {
                string filter = "";
                if (!string.IsNullOrEmpty(Request["PrjName"]) && Filter.SqlFilter(Request["PrjName"]))
                    filter += " and 项目名称 like '%" + Request["PrjName"].Trim() + "%'";
                if (!string.IsNullOrEmpty(Request["PrjCustomer"])&& Filter.SqlFilter(Request["PrjCustomer"]))
                    filter += " and 项目客户名称 like '%" + Request["PrjCustomer"].Trim() + "%'";
                if (!string.IsNullOrEmpty(Request["PrjState"]))
                    filter += " and 项目状态='" + Request["PrjState"].Trim() + "'";
                if (!string.IsNullOrEmpty(Request["PrjDutyPeople"]))
                    filter += " and 项目负责人='" + Request["PrjDutyPeople"].ToString().Trim() + "'";
                if (!string.IsNullOrEmpty(Request["PrjType"]))
                    filter += " and 项目类型='" + Request["PrjType"].ToString().Trim() + "'";

                sql = "SELECT table1.*, ProjectState.StateText, ProjectType.TypeText, Person1.人员名称, Person2.人员名称 AS PrjCreator FROM ( SELECT *, ROW_NUMBER() OVER(order BY 序号) as rowNo FROM ProjList WHERE entId = 19) AS table1 INNER JOIN ProjectState ON table1.项目状态 = ProjectState.StateID INNER JOIN EmployeeList AS Person1 ON (table1.entId = Person1.entId AND Person1.人员id = table1.项目负责人) INNER JOIN EmployeeList AS Person2 ON (table1.entId = Person2.entId AND Person2.人员id = table1.项目创建人) INNER JOIN ProjectType ON ProjectType.TypeID = table1.项目类型 WHERE (rowNo between " + start + " AND " + (start + limit) + ") " + filter + ";";
            }
            Response.Write(GetJsonStr(sql,connectstr));
            Response.End();
            Response.Clear();
        }
    }
    protected string GetJsonStr(string Sql, string connString)
    {
        SqlConnection con = new SqlConnection(connString);
        con.Open();
        SqlCommand cmd = new SqlCommand(Sql, con);
        SqlDataReader sdr = cmd.ExecuteReader();
        if (!sdr.HasRows)
            return "";
        else
        {
            return SqlToJson.ConvertReaderToJson(sdr);
        }
    }
}