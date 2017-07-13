using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;

public partial class PDM_TaskManage_Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        //string userName = Session["username"].ToString();
        //string connectstr = Session["connectstr"].ToString();
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();

            if (OperateType.Equals("DeleteTask"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("delete from TaskList_Backup where ID in (" + Request["TaskID"].ToString() + ")", PlatForm_connectstr))
                {
                    Response.Clear();
                    Response.Write("任务删除成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("任务删除失败！");
                }
            }
            else  if (OperateType.Equals("DeleteWorkFlow"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("delete from WorkFlow_Backup where ID in (" + Request["WorkFlowID"].ToString() + ");delete from TaskList_Backup where WorkFlowID in (" + Request["WorkFlowID"].ToString() + ")", PlatForm_connectstr))
                {
                    Response.Clear();
                    Response.Write("流程删除成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("流程删除失败！");
                }
            }

        }
        else
            Response.Write("{success:true,msg:'未知错误！'}");
        Response.End();
    }

}