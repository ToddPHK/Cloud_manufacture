using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;

public partial class ENTUsers_PDM_PrjManagerAudit_DataProcess : System.Web.UI.Page
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

                if (TSRelation(Request["ID"].ToString().Split(','), Session["ENTID"].ToString(), connectstr, PlatForm_connectstr))
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

                if (sqlExecute.sqlmanage.ExecuteSQL("update Task_Service set Flag=10 ,EntAuditTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where ID in (" + Request["ID"].ToString() + ")", connectstr))
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
        if (!sdr.HasRows )
            return "";
        else
        {
            string Json = SQLToJson.ReaderSQLToJson.GetJSON(sdr);
            return Json.ToString();
        }
    }
    public bool TSRelation( string[] IDS, string ENTID, string connectstr,string PlatForm_connectstr )
    {
        bool flag = true;
        if (IDS.Length > 0)
        {
            foreach (string ID in IDS)
            {
                string[] TSID = sqlExecute.sqlmanage.GetUniqueRecord("select TaskID,ServiceID,Price from Task_Service where ID=" + ID, connectstr, new string[] { "TaskID", "ServiceID", "Price" }).Split(',');

                if (sqlExecute.sqlmanage.ExecuteSQL("insert into Service_Task(TaskID,ServiceID,TaskPrice,Applicant,flag,AppDate) (select ID,'" + TSID[1] + "'," + TSID[2] + "," + ENTID + ",0,'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' from TaskList where UserTaskID =" + TSID[0] + " and Publisher=" + ENTID + ")", PlatForm_connectstr))
                {
                    sqlExecute.sqlmanage.ExecuteSQL("delete from Task_Service where ID=" + ID, connectstr);
                }
                else
                {
                    return false;
                }
            }
            return flag;
        }
        else
        {
            return false;
        }

    }
}