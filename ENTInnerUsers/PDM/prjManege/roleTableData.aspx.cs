using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Data;
using System.Text;

public partial class ENTInnerUsers_PDM_rolemanage_roleTableData : System.Web.UI.Page
{
   // string username = "fsdq";


    string sql;
    string getcountSql;
    string connectstr;
    protected void Page_Load(object sender, EventArgs e)
    {
        int start = 0;
        int limit = 15;
        string roletype = "";
         connectstr = Session["connectstr"].ToString();
        if (connectstr != "")
        {
           // connectstr = "server=(local);Initial Catalog=" + connectstr + ";User ID=sa;Password=zju308;connect timeout=30";
            if (!string.IsNullOrEmpty(Request["limit"]))
            {
                limit = int.Parse(Request["limit"]);
            }
            if (!string.IsNullOrEmpty(Request["start"]))
            {
                start = int.Parse(Request["start"]);
            }
            if (!string.IsNullOrEmpty(Request["roletype"]))
            {
                roletype = Request["roletype"];
            }
            if (string.IsNullOrEmpty(roletype))//如果没有传来的projectname的值就显示所有文档EmployeeList
            {
                sql = "select top " + limit + " EmployeeList.*,DeptList.部门名称,R1.Name as Role1Name,R2.Name as Role2Name " +
            " from DeptList,EmployeeList,RoleList R1,RoleList R2 where 人员编号 not in (select top " + start
            + " 人员编号 from EmployeeList) and EmployeeList.归属部门 *=DeptList.部门编号 and EmployeeList.归属角色 *=R1.ID and EmployeeList.第二角色 *=R2.ID";
                getcountSql = "select  人员编号  from EmployeeList";

            }
            else if (roletype.Equals("PeopleSearch"))
            {
                string filter = "";
                if (Request["depart"] != null && !Request["depart"].ToString().Equals(""))
                    filter += " and 归属部门='" + Request["depart"].ToString().Trim() + "'";
                if (Request["PeopleName"] != null && !Request["PeopleName"].ToString().Equals(""))
                    filter += " and 人员名称='" + Request["PeopleName"].ToString().Trim() + "'";
                if (Request["FirstRole"] != null && !Request["FirstRole"].ToString().Equals(""))
                    filter += " and 归属角色='" + Request["FirstRole"].ToString().Trim() + "'";
                if (Request["PeopleNum"] != null && !Request["PeopleNum"].ToString().Equals(""))
                    filter += " and 人员编号='" + Request["PeopleNum"].ToString().Trim() + "'";
                if (Request["PeopleGrade"] != null && !Request["PeopleGrade"].ToString().Equals(""))
                    filter += " and 学历='" + Request["PeopleGrade"].ToString().Trim() + "'";

                sql = "select top " + limit + " ProjList.*,ProjectState.StateText,ProjectType.TypeText,E1.人员名称,E2.人员名称 as PrjCreator " +
    " from ProjList,ProjectState,ProjectType,EmployeeList E1,EmployeeList E2 where 序号 not in (select top " + start
        + " 序号 from ProjList where 序号>-1 " + filter + " order by  序号 ) and ProjList.项目负责人*=E1.人员ID  and ProjList.项目创建人*=E2.人员ID  and  ProjList.项目类型*=ProjectType.TypeID and ProjList.项目状态*=ProjectState.StateID " + filter + " order by  序号";

                //   sql = "select   ProjList.*,ProjectState.StateText,ProjectType.TypeText,E1.人员名称,E2.人员名称 as PrjCreator  from ProjList,ProjectState,ProjectType,EmployeeList E1,EmployeeList E2 where   ProjList.项目负责人*=E1.人员ID and ProjList.项目创建人*=E2.人员ID and  ProjList.项目类型*=ProjectType.TypeID and ProjList.项目状态*=ProjectState.StateID " + filter; ;
                getcountSql = "select  序号  from ProjList where 序号>-1 " + filter;


            }
            else if (roletype.Equals("DepartList"))//80为Craft表中热处理的ID
            {
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeFullJson ff = new TreeFullJson.TreeFullJson(connectstr, true);
                sb.AppendFormat("[{0}]", ff.fillTreeView("select 部门编号,部门名称,上级部门 from DeptList where 上级部门 is null", new string[] { "id", "text" }, "部门编号", "上级部门"));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();
                return;

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
        if (!sdr.HasRows )
            return "";
        else
        {
            string Json = SQLToJson.ReaderSQLToJson.GetJSON(sdr);
            return Json.ToString();
        }
    }

}