using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;

public partial class ENTUsers_PDM_ApplyForService_DataProcess : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string connectstr = Session["connectstr"].ToString();
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();
            if (OperateType.Equals("ProjectTaskTree"))
            {
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeFullJson ff = new TreeFullJson.TreeFullJson(connectstr, true);
                string tempsql = "select  ID,Name,ParentID,Chargor,TaskList.BelongProjectTreeNode  from ProjectTaskTree,TaskList where ParentID is null  and ProjectTaskTree.ID*=TaskList.BelongProjectTreeNode";
                sb.AppendFormat("[{0}]", ff.fillTreeView(tempsql, new string[] { "id", "text" }, "ID", "ParentID", " ProjectTaskTree.ID*=TaskList.BelongProjectTreeNode "));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("ProjectTaskTreeNoCheckBox"))
            {
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeFullJson ff = new TreeFullJson.TreeFullJson(connectstr, false);
                string tempsql = "select  ID,Name,ParentID,Chargor  from ProjectTaskTree where ParentID is null ";
                sb.AppendFormat("[{0}]", ff.fillTreeView(tempsql, new string[] { "id", "text" }, "ID", "ParentID"));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();
            }
        }

    }
}