using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using System.Data.SqlClient;
using System.Data;

public partial class PlatForm_Admin_WebPage_ComboData : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string data="";
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString(); 
        //string connectstr = Session["connectstr"].ToString();
        if (PlatForm_connectstr != "" && Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();

            if (OperateType.Equals("DicWordList"))
            {
                string filter = "select DicWordID from TaskTemplate where TaskTemplateID in (select TaskTemplateID from  TaskTemplate where TaskTemplateParentID in (select TaskTemplateID from TaskTemplate where TaskTemplateParentID  =" + Request["ID"].ToString() + "))";
                data = ToArrayString(PlatForm_connectstr, "select AttributeID,Chinese from Attributes where WordState=1 and AttributeID not in (" + filter + " )", "AttributeID", "Chinese");
            }

            else if (OperateType.Equals("DistinctDicWordList"))
            {
                string filter = "select DicWordID from TaskTemplate where TaskTemplateID!=" + Request["DicWordID"].ToString() + " and TaskTemplateID in (select TaskTemplateID from  TaskTemplate where TaskTemplateParentID in (select TaskTemplateID from TaskTemplate where TaskTemplateParentID  =" + Request["ID"].ToString() + "))";
                data = ToArrayString(PlatForm_connectstr, "select AttributeID,Chinese from Task_AttributeDictionary where WordState=1  and AttributeID not in (" + filter + " )", "AttributeID", "Chinese");
            }
            //else if (OperateType.Equals("employee"))
            //{
            //    if (!string.IsNullOrEmpty(Request["TreeNumber"]))
            //    {
            //        data = ToArrayString(connectstr, "select 人员ID,人员名称 from EmployeeList where 人员ID not in (select EmployeeID from GroupVSEmploy where PrjGroupID=" + Request["TreeNumber"].ToString() + ") and 归属角色 in (select RoleID from Group_Role where PrjGroupID=" + Request["TreeNumber"].Trim() + ")", "人员ID", "人员名称");
            //    }
            //}
            Response.Write(data);
            Response.End();
            Response.Clear();
        }
    }
    protected string ToArrayString(string connectstr, string SQl, string idfield, string textfield)
    {
        StringBuilder sb = new StringBuilder();
        SqlConnection con = new SqlConnection(connectstr);
        SqlCommand cmd = new SqlCommand(SQl, con);
        SqlDataAdapter ada = new SqlDataAdapter(cmd);
        DataSet ds = new DataSet();
        ada.Fill(ds, "temptable");
        if (ds != null)
        {

            sb.Append("[");
            foreach (DataRow dr in ds.Tables["temptable"].Rows)
            {
                sb.Append("['" + dr[idfield].ToString() + "','" + dr[textfield].ToString() + "'],");


            }
            sb.Remove(sb.ToString().LastIndexOf(','), 1);
            sb.Append("]");
            return sb.ToString();
        }
        return null;
    }
}