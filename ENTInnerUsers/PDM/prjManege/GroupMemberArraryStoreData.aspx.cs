using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Data;
using System.Text;

public partial class ENTInnerUsers_PDM_prjManege_employeeArraryStoreData : System.Web.UI.Page
{

    protected void Page_Load(object sender, EventArgs e)
    {
        string data="";
        string connectstr = Session["connectstr"].ToString();
        if (connectstr != "")
        {
            if (Request["type"].Equals("GroupMember"))
            {
                if (!string.IsNullOrEmpty(Request["TreeNumber"]))
                {
                    data = ToArrayString(connectstr, "select 人员ID,人员名称 from EmployeeList where 人员ID in (select EmployeeID from GroupVSEmploy where PrjGroupID=" + Request["TreeNumber"].ToString() + ")", "人员ID", "人员名称");
                }
            }
            else if (Request["type"].Equals("employee"))
            {
                if (!string.IsNullOrEmpty(Request["TreeNumber"]))
                {
                    data = ToArrayString(connectstr, "select 人员ID,人员名称 from EmployeeList where 人员ID not in (select EmployeeID from GroupVSEmploy where PrjGroupID=" + Request["TreeNumber"].ToString() + ") and 归属角色 in (select RoleID from Group_Role where PrjGroupID=" + Request["TreeNumber"].Trim() + ")", "人员ID", "人员名称");
                }
            }
            else if (Request["type"].Equals("allemployee"))
            {

                data = ToArrayString(connectstr, "select 人员ID,人员名称 from EmployeeList", "人员ID", "人员名称");

            }
            else if (Request["type"].Equals("ProjectList"))
            {
                data = ToArrayString(connectstr, "select 项目编号,项目名称 from ProjList", "项目编号", "项目名称");
            }
            else if (Request["type"].Equals("ProjectState"))
            {
                data = ToArrayString(connectstr, "select StateID,StateText from ProjectState", "StateID", "StateText");
            }
            else if (Request["type"].Equals("ProjectType"))
            {
                data = ToArrayString(connectstr, "select TypeID,TypeText from ProjectType", "TypeID", "TypeText");
            }
            else if (Request["type"].Equals("role"))
            {
                data = ToArrayString(connectstr, "select ID,Name from RoleList", "ID", "Name");
            }
            else if (Request["type"].Equals("DepartList"))
            {
                data = ToArrayString(connectstr, "select 部门编号,部门名称 from DeptList", "部门编号", "部门名称");
            }
            else if (Request["type"].Equals("GroupList"))
            {
                if (!string.IsNullOrEmpty(Request["prjName"]))
                {
                    data = ToArrayString(connectstr, "select ID,项目组名称 from ProjectGroup where 项目名称='" + Request["prjName"].Trim() + "'", "ID", "项目组名称");
                }
            }
            Response.Write(data);
            Response.End();
            Response.Clear();
        }
    }
    protected string ToArrayString(string connectstr, string SQl, string idfield, string textfield)
    {//"select " + idfield + "," + textfield + " from " + tablename + " where 父节点号 is null"
        StringBuilder sb = new StringBuilder();
       // string connectstr = "server=(local);Initial Catalog=" + databasename + ";User ID=sa;Password=zju308;connect timeout=30";
        SqlConnection con = new SqlConnection(connectstr);
        SqlCommand cmd = new SqlCommand(SQl, con);
        SqlDataAdapter ada = new SqlDataAdapter(cmd);
        DataSet ds = new DataSet();
        int counter = ada.Fill(ds, "temptable");
        if (ds != null)
        {
            int i = 1;
            sb.Append("[");
            foreach (DataRow dr in ds.Tables["temptable"].Rows)
            {
                if (counter == 1)
                {
                    sb.Append("['" + dr[idfield].ToString() + "','" + dr[textfield].ToString() + "']");
                }
                else
                {
                    if (i == 1)
                        sb.Append("['" + dr[idfield].ToString() + "','" + dr[textfield].ToString() + "']");
                    else
                        sb.Append(",['" + dr[idfield].ToString() + "','" + dr[textfield].ToString() + "']");

                }
                i++;

            }
            sb.Append("]");
            return sb.ToString();
        }
        return null;
    }

}