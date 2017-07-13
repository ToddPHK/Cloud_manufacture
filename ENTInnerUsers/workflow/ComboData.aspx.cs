using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class workflow_ComboData : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
       // string datanasename = "fsdq";

        if (Request["type"].ToString().Equals("People"))
        {
            Response.Clear();

            Response.Write(SQLToJson.SQLToArrayJson.ToArrayString(Session["connectstr"].ToString(), "select 人员ID,人员名称 from EmployeeList", "人员ID", "人员名称"));
            Response.End();
        }
        else if (Request["type"].ToString().Equals("Project"))
        {
            Response.Clear();

            Response.Write(SQLToJson.SQLToArrayJson.ToArrayString(Session["connectstr"].ToString(), "select 序号,项目名称 from ProjList where 项目状态!=3 and 项目状态>=0", "序号", "项目名称"));
            Response.End();
        }

    }
}