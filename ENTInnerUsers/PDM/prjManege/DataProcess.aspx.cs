using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using System.Data.SqlClient;
using System.Data;
using SQLToTreeJson;

public partial class ENTInnerUsers_PDM_prjManege_DataProcess : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string connectstr = Session["connectstr"].ToString();
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();
            if (OperateType.Equals("OrgStructureTreeNoCheckBox"))
            {
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeFullJson ff = new TreeFullJson.TreeFullJson(connectstr, false);
                string tempsql = "select  部门编号,部门名称,上级部门  from DeptList where 上级部门 is null ";
                sb.AppendFormat("[{0}]", ff.fillTreeView(tempsql, new string[] { "id", "text" }, "部门编号", "上级部门"));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("LoadPeopleByDepart"))
            {
                if (Request["DepartID"]==null||string.IsNullOrEmpty(Request["DepartID"].ToString()))
                {
                    Response.Write(ToArrayString(connectstr, "select 人员ID,人员名称 from EmployeeList ", "人员ID", "人员名称"));
                }
                else
                {
                    string sss = "select * from DeptList where 部门编号='" + Request["DepartID"]+"'";
                    string[] childIDs = new TreeJson().getChildID("DeptList", connectstr, "部门编号", "上级部门", sss);
                    Response.Write(ToArrayString(connectstr, "select 人员ID,人员名称 from EmployeeList where 归属部门 in ('" + String.Join("','", childIDs) + "')", "人员ID", "人员名称"));
                }
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("TaskDicWord"))
            {
                string sql = "select AttributeName as Name,Chinese as Text from Attributes";
                string s = GetJsonStr(sql, PlatForm_connectstr);
                Response.Write(s);
                Response.End();
                Response.Clear();
            }
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
    protected string GetJsonStr(string Sql, string connectstr)
    {
        SqlConnection con = new SqlConnection(connectstr);
        con.Open();
        SqlCommand cmd = new SqlCommand(Sql, con);
        SqlDataReader sdr = cmd.ExecuteReader();
        if (sdr.FieldCount < 1)
            return "";
        else
        {
            string Json = GetJSON(sdr);
            return Json.ToString();
        }
    }
    protected string GetJSON(SqlDataReader drValue)
    {

        StringBuilder sb = new StringBuilder();
        try
        {
            sb.Append(" {");
            while (drValue.Read())
            {

                sb.AppendFormat("{0}:'{1}',", drValue["Name"], drValue["Text"]);



            }
            sb.Remove(sb.ToString().LastIndexOf(','), 1);
            sb.AppendLine("}");
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
        finally
        {
            drValue.Close();
        }
        return sb.ToString();
    }
}