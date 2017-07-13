using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;

public partial class PlatForm_Admin_WebPage_TaskStateManage_DataProcess : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();
            if (OperateType.Equals("StateData"))
            {
                string sql = "select * from TaskState order by TaskStateID  ";
                string getcountSql = sql;
                SQLToJson.ReaderSQLToJson.SetCount(getcountSql, PlatForm_connectstr);
                Response.Write(GetJsonStr(sql, PlatForm_connectstr));

                Response.End();
                Response.Clear();
            }

            else if (OperateType.Equals("TaskStateEdit"))
            {

                if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from TaskState where  TaskStateName='" + Request["TaskStateName"].ToString() + "' and TaskStateID<>'" + Request["TaskStateID"] + "' "))
                {

                    Response.Write("{success:false,msg:'该状态名已被占用！'}");
                    Response.End();
                    Response.Clear();

                }
                else
                {
                    string sql = "";

                    sql = "update TaskState set  TaskStateName='" + Request["TaskStateName"] +

                            "', ColorValue='" + Request["ColorValue"] + "'  where TaskStateID='" + Request["TaskStateID"] + "'";

                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, PlatForm_connectstr))
                        Response.Write("{success:true,msg:'状态修改成功！'}");
                    else
                        Response.Write("{success:false,msg:'状态修改失败！'}");
                    Response.End();
                    Response.Clear();
                }


            }

        }
    }
    protected string GetJsonStr(string Sql, string connectstr)
    {
        SqlConnection con = new SqlConnection(connectstr);
        con.Open();
        SqlCommand cmd = new SqlCommand(Sql, con);
        SqlDataReader sdr = cmd.ExecuteReader();
        if (!sdr.HasRows)
            return "";
        else
        {
            string Json = SQLToJson.ReaderSQLToJson.GetJSON(sdr);
            return Json.ToString();
        }
    }
}