using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;


public partial class PlatForm_Admin_WebPage_LoginLog_LoginData : System.Web.UI.Page
{
    int start = 0;
    int limit = 10;
    string sql;
    string getcountSql;
    string PlatForm_connectstr;
    protected void Page_Load(object sender, EventArgs e)
    {

        PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        if (!string.IsNullOrEmpty(Request["limit"]))
        {
            limit = int.Parse(Request["limit"]);
        }
        if (!string.IsNullOrEmpty(Request["start"]))
        {
            start = int.Parse(Request["start"]);
        }
        if (string.IsNullOrEmpty(Request["OperateType"]))
        {
            sql = "select top " + limit + " LoginLog.ID, LoginLog.LoginIP, LoginLog.LoginTime,UserInfor.userName  " +
                " from LoginLog,UserInfor where LoginLog.ID not in (select top " + start
                    + " ID from LoginLog) and LoginLog.UserID*=UserInfor.UserID   order by  LoginTime desc";
            getcountSql = "select  ID  from LoginLog";

        }
        else if (Request["OperateType"].Equals("LoginLogSearch"))
        {
            string filter = "";
            if (Request["LoginEntTime"] != null && !Request["LoginEntTime"].ToString().Equals(""))//BETWEEN value1 AND value2
                filter += " and LoginTime BETWEEN '" + Request["LoginStartTime"].ToString() + "' AND  '" + Request["LoginEntTime"].ToString() + "' ";
            if (Request["LoginEntName"] != null && !Request["LoginEntName"].ToString().Trim().Equals(""))
                filter += " and LoginLog.UserID in (select UserID from UserInfor where userName like '%" + Request["LoginEntName"].ToString().Trim() + "%')";

            sql = "select top " + limit + " LoginLog.ID, LoginLog.LoginIP, LoginLog.LoginTime,UserInfor.userName " +
" from LoginLog,UserInfor where LoginLog.ID not in (select top " + start
    + " ID from LoginLog where ID>-1 " + filter + " order by  LoginTime ) and LoginLog.UserID*=UserInfor.UserID " + filter + " order by  LoginTime desc";

            getcountSql = "select  ID  from LoginLog where ID>-1 " + filter;

        }
        SQLToJson.ReaderSQLToJson.SetCount(getcountSql, PlatForm_connectstr);
        Response.Write(GetJsonStr(sql));

        Response.End();
        Response.Clear();

    }
    protected string GetJsonStr(string Sql)
    {
        SqlConnection con = new SqlConnection(PlatForm_connectstr);
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