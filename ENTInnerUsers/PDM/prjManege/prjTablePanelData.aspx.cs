using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Data;
using System.Collections;

public partial class ENTInnerUsers_PDM_prjManege_prjTablePanelData : System.Web.UI.Page
{
   // string username = "fsdq";
    int start = 0;
    int limit = 10;
    string prjName = "";
    string sql;
    string getcountSql;
    string connectstr;
    protected void Page_Load(object sender, EventArgs e)
    {
         connectstr = Session["connectstr"].ToString();
         string userID = Session["userID"].ToString();
        if (connectstr != "")
        {
            TreeFullJson.GetTopParent ProjectNode= new TreeFullJson.GetTopParent(connectstr);
           // ArrayList ProjectNodeIDs = ProjectNode.GetTopNodes("select ID,ParentID from ProjectTaskTree where Creator=" + userID + " or Chargor=" + userID, "ID", "ParentID", "ProjectTaskTree");
           //string projectIDs= string.Join(",", ProjectNodeIDs);
            // connectstr = "server=(local);Initial Catalog=" + connectstr + ";User ID=sa;Password=zju308;connect timeout=30";
            if (!string.IsNullOrEmpty(Request["limit"]))
            {
                limit = int.Parse(Request["limit"]);
            }
            if (!string.IsNullOrEmpty(Request["start"]))
            {
                start = int.Parse(Request["start"]);
            }
            if (string.IsNullOrEmpty(Request["prjOperaType"]))//如果没有传来的projectname的值就显示所有文档EmployeeList
            {
                sql = "select top " + limit + " ProjList.*,ProjectState.StateText,ProjectType.TypeText,E1.人员名称,E2.人员名称 as PrjCreator" +
                    " from ProjList,ProjectState,ProjectType,EmployeeList E1,EmployeeList E2 where 序号 not in (select top " + start
                        + " 序号 from ProjList) and ProjList.项目负责人*=E1.人员ID and ProjList.项目创建人*=E2.人员ID and  ProjList.项目类型*=ProjectType.TypeID and ProjList.项目状态*=ProjectState.StateID ";
                getcountSql = "select  序号  from ProjList";

            }
            else if (Request["prjOperaType"].Equals("search"))
            {
                string filter = "";
                if (Request["PrjName"] != null && !Request["PrjName"].ToString().Equals(""))
                    filter += " and 项目名称 like '%" + Request["PrjName"].ToString().Trim() + "%'";
                if (Request["PrjCustomer"] != null && !Request["PrjCustomer"].ToString().Equals(""))
                    filter += " and 项目客户名称 like '%" + Request["PrjCustomer"].ToString().Trim() + "%'";
                if (Request["PrjState"] != null && !Request["PrjState"].ToString().Equals(""))
                    filter += " and 项目状态='" + Request["PrjState"].ToString().Trim() + "'";
                if (Request["PrjDutyPeople"] != null && !Request["PrjDutyPeople"].ToString().Equals(""))
                    filter += " and 项目负责人='" + Request["PrjDutyPeople"].ToString().Trim() + "'";
                if (Request["PrjType"] != null && !Request["PrjType"].ToString().Equals(""))
                    filter += " and 项目类型='" + Request["PrjType"].ToString().Trim() + "'";


                sql = "select top " + limit + " ProjList.*,ProjectState.StateText,ProjectType.TypeText,E1.人员名称,E2.人员名称 as PrjCreator " +
    " from ProjList,ProjectState,ProjectType,EmployeeList E1,EmployeeList E2 where 序号 not in (select top " + start
        + " 序号 from ProjList where 序号>-1 " + filter + " order by  序号 ) and ProjList.项目负责人*=E1.人员ID  and ProjList.项目创建人*=E2.人员ID  and  ProjList.项目类型*=ProjectType.TypeID and ProjList.项目状态*=ProjectState.StateID " + filter + " order by  序号";

                //   sql = "select   ProjList.*,ProjectState.StateText,ProjectType.TypeText,E1.人员名称,E2.人员名称 as PrjCreator  from ProjList,ProjectState,ProjectType,EmployeeList E1,EmployeeList E2 where   ProjList.项目负责人*=E1.人员ID and ProjList.项目创建人*=E2.人员ID and  ProjList.项目类型*=ProjectType.TypeID and ProjList.项目状态*=ProjectState.StateID " + filter; ;
                getcountSql = "select  序号  from ProjList where 序号>-1 " + filter;

            }

            else
            {
                //sql = "select top " + limit + "  人员编号,人员名称,性别,出生年月,学历,移动电话,固定电话,Email,QQ号,通讯地址,进厂日期,归属部门,归属角色,第二角色,档案号,培训情况,密码,所属工作组" +
                //    " from EmployeeList where 人员编号 not in (select top " + start
                //    + " 人员编号 from EmployeeList) and 归属角色='" + roletype + "'";
                //getcountSql = "select  人员编号" + " from EmployeeList where  归属角色='" + roletype + "')";
            }
            //context.Response.ContentType = "text/plain";
            //context.Response.Write("Hello World");
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
        if (!sdr.HasRows)
            return "";
        else
        {
            string Json = SQLToJson.ReaderSQLToJson.GetJSON(sdr);
            return Json.ToString();
        }
    }
}