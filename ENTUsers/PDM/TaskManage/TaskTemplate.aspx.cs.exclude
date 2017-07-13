using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class ENTInnerUsers_PDM_TaskManage_TaskTemplate : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
                // string  connectstr = Session["connectstr"].ToString();
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        //   string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString(); 
        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();
            if (OperateType.Equals("TaskTemplateName"))
            {
                string s1 = sqlExecute.sqlmanage.GetUniqueRecord("select name from TaskTemplate where state in (2,3)", PlatForm_connectstr, new string[] { "name" });

                Response.Write(s1);
                Response.End();
                Response.Clear();
     
            }
            else if (OperateType.Equals("PreView"))
            {
                string s1 = sqlExecute.sqlmanage.GetUniqueRecord("select name,fieldLabel from TaskTemplate where state in (2,3)", PlatForm_connectstr, new string[] { "name", "fieldLabel" });

                Response.Write(s1);
                Response.End();
                Response.Clear();
                return;
            }

        }
    }
}