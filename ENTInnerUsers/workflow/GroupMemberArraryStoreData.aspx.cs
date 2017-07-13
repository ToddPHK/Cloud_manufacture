using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Data;
using System.Text;

public partial class PDM_prjManege_employeeArraryStoreData : System.Web.UI.Page
{
    string connectstr ;
    string data;
    protected void Page_Load(object sender, EventArgs e)
    {
        connectstr = Session["connectstr"].ToString();
        // string employee = "[['123', 'One Hundred Twenty Three'],['1', 'One'], ['2', 'Two'], ['3', 'Three'], ['4', 'Four'], ['5', 'Five'],['6', 'Six'], ['7', 'Seven'], ['8', 'Eight'], ['9', 'Nine']]";
        if (Request["type"].Equals("GroupMember"))
        {
            if (!string.IsNullOrEmpty(Request["TreeNumber"]))
            {
                if (!string.IsNullOrEmpty(GetGroupMember(Request["TreeNumber"].Trim())))
                    data = ToArrayString(connectstr, "select 人员编号,人员名称 from EmployeeList where 人员编号 in (" + GetGroupMember(Request["TreeNumber"].Trim()) + ")", "人员编号", "人员名称");
                else
                    data = "[]";
            }
        }
        else if (Request["type"].Equals("employee"))
        {

            data = ToArrayString(connectstr, "select 人员编号,人员名称 from EmployeeList", "人员编号", "人员名称");

        }
        else if (Request["type"].Equals("ProjectList"))
        {
            data = ToArrayString(connectstr, "select 项目编号,项目名称 from ProjList", "项目编号", "项目名称");
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
    protected string ToArrayString(string connectstr, string SQl, string idfield, string textfield)
    {//"select " + idfield + "," + textfield + " from " + tablename + " where 父节点号 is null"
        StringBuilder sb = new StringBuilder();
        //string connectstr = "server=(local);Initial Catalog=" + databasename + ";User ID=sa;Password=zju308;connect timeout=30";
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
    protected string GetGroupMember(string TreeNumber)
    {
        string sb = "";
       
        SqlConnection con = new SqlConnection(connectstr);
        SqlCommand cmd = new SqlCommand("select 项目组成员 from ProjectGroup where ID='" + int.Parse(Request["TreeNumber"]) + "'", con);
        SqlDataAdapter ada = new SqlDataAdapter(cmd);
        DataSet ds = new DataSet();
        int counter = ada.Fill(ds, "temptable");
        if (ds != null)
        {
            foreach (DataRow dr in ds.Tables["temptable"].Rows)
            {
                sb = dr["项目组成员"].ToString();
            }
        }
        return sb;
    }

}