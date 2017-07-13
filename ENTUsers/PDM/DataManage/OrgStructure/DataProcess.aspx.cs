using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;

public partial class ENTUsers_PDM_DataManage_OrgStructure_DataProcess : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string connectstr = Session["connectstr"].ToString();
        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();
            if (Request["OperateType"].Equals("OrgStructureTree"))
            {
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeFullJson ff = new TreeFullJson.TreeFullJson(connectstr, false);
                sb.AppendFormat("[{0}]", ff.fillTreeView("select 部门编号,部门名称,部门编号 from DeptList where 上级部门 is null ", new string[] { "id", "text", "qtip" }, "部门编号", "上级部门"));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();
            }
        }
    }
}