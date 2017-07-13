using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using System.Data.SqlClient;
using System.Data;

public partial class PlatForm_Admin_TaskTemplateData : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string data = "";
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        string OperateType = Request["OperateType"].ToString();
        if (!string.IsNullOrEmpty(PlatForm_connectstr) && !string.IsNullOrEmpty(OperateType))
        {
            if (OperateType.Equals("BlankType"))
            {
                data = ToArrayString(PlatForm_connectstr, "select ID,Name from BlankType", "ID", "Name");
            }
            else if (OperateType.Equals("GeoChaType"))
            {
                data = ToArrayString(PlatForm_connectstr, "select ID,Name from GeoChaType", "ID", "Name");
            }
            else if (OperateType.Equals("Material"))
            {
                data = ToArrayString(PlatForm_connectstr, "select ID,Name from Material", "ID", "Name");
            }
            else if (OperateType.Equals("CompSort2"))
            {
                data = ToArrayString(PlatForm_connectstr, "select ID,Name from CompSort2", "ID", "Name");
            }
            else if (OperateType.Equals("PartGeoType"))
            {
                data = ToArrayString(PlatForm_connectstr, "select ID,Name from PartGeoType", "ID", "Name");
            }
            else if (OperateType.Equals("AmountSort"))
            {
                data = ToArrayString(PlatForm_connectstr, "select ID,Name from AmountSort", "ID", "Name");
            }
            else if (OperateType.Equals("IndustrySort"))
            {
                data = ToArrayString(PlatForm_connectstr, "select ID,Name from IndustrySort", "ID", "Name");
            }
            else if (OperateType.Equals("DieClass"))
            {
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeFullJson ff = new TreeFullJson.TreeFullJson(PlatForm_connectstr, false);
                sb.AppendFormat("[{0}]", ff.fillTreeView("select ID,Name,ParentID from DieClass where ParentID is null   ", new string[] { "id", "text" }, "ID", "ParentID"));
                data=sb.ToString();

            }
            else if (OperateType.Equals("Craft"))
            {
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeFullJson ff = new TreeFullJson.TreeFullJson(PlatForm_connectstr, false);
                sb.AppendFormat("[{0}]", ff.fillTreeView("select ID,Name,ParentID from Craft where ParentID is null ", new string[] { "id", "text" }, "ID", "ParentID"));
                data = sb.ToString();

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