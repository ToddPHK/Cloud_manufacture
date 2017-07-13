using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;

public partial class ENTInnerUsers_PDM_PrjManagerAudit_DataProcess : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string connectstr = Session["connectstr"].ToString();
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();
            if (OperateType.Equals("Task_ServiceTableData"))
            {
                string sql = "select * from Task_Service where Flag=7 and TaskID=" + Request["TaskID"].ToString();
                SQLToJson.ReaderSQLToJson.SetCount(sql, connectstr);
                Response.Write(GetTableJsonStr(sql, connectstr));

                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("TServiceAgree"))
            {

                if (sqlExecute.sqlmanage.ExecuteSQL("update Task_Service set Flag=9 ,PrjAuditTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where ID in (" + Request["ID"].ToString() + ")", connectstr))
                {

                    Response.Write("服务审核成功！");
                }
                else
                {

                    Response.Write("服务审核失败！");
                }
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("TServiceNoAgree"))
            {

                if (sqlExecute.sqlmanage.ExecuteSQL("update Task_Service set Flag=8 ,PrjAuditTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where ID in (" + Request["ID"].ToString() + ")", connectstr))
                {

                    Response.Write("服务审核成功！");
                }
                else
                {

                    Response.Write("服务审核失败！");
                }
                Response.End();
                Response.Clear();
            }
        }

    }
    protected string GetTableJsonStr(string Sql, string connectstr)
    {
        SqlConnection con = new SqlConnection(connectstr);
        con.Open();
        SqlCommand cmd = new SqlCommand(Sql, con);
        SqlDataReader sdr = cmd.ExecuteReader();
        if (sdr.FieldCount < 1)
            return "";
        else
        {
            string Json = SQLToJson.ReaderSQLToJson.GetJSON(sdr);
            return Json.ToString();
        }
    }
}