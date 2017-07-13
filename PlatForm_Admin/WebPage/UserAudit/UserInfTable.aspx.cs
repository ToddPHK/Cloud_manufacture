using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;

public partial class PlatForm_Admin_WebPage_UserAudit_UserInfTable : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        int start = 0;
        int limit = 25;
        string sql=null;
        string getcountSql=null;
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString(); 
        if (!string.IsNullOrEmpty(Request["limit"]))
        {
            limit = int.Parse(Request["limit"]);
        }
        if (!string.IsNullOrEmpty(Request["start"]))
        {
            start = int.Parse(Request["start"]);
        }

        if (Request["OperateType"] == null)//如¨?果?没?有?D传??来¤??的??projectname的??值??就¨?显?示??所¨?有?D文?档???EmployeeList
        {

            sql = "select top " + limit + " * " +
        " from UserInfor where UserID not in (select top " + start
        + " UserID from UserInfor order by UserID) and UserID>5 order by UserID ";
            getcountSql = "select  UserID  from UserInfor where UserID>5";

        }
        else if (Request["OperateType"].ToString().Equals("UserSearch"))
        {
            string filter = " and UserID>5";
            if (Request["UserName"] != null && !string.IsNullOrWhiteSpace(Request["UserName"].ToString()))
                filter += " and userName like '%" + Request["UserName"].ToString().Trim() + "%'";
            if (Request["UserDataBaseType"] != null && !string.IsNullOrWhiteSpace(Request["UserDataBaseType"].ToString()))
                filter += " and localDatabase='" + Request["UserDataBaseType"].ToString().Trim() + "'";
            if (Request["EntName"] != null && !string.IsNullOrWhiteSpace(Request["EntName"].ToString()))
                filter += " and EntFullName like '%" + Request["EntName"].ToString().Trim() + "%'";
            if (Request["UserStateType"] != null && !string.IsNullOrWhiteSpace(Request["UserStateType"].ToString()))
                filter += " and UserState='" + Request["UserStateType"].ToString().Trim() + "'";
            if (Request["UserType"] != null && !string.IsNullOrWhiteSpace(Request["UserType"].ToString()))
                filter += " and UserType='" + Request["UserType"].ToString().Trim() + "'";

            sql = "select top " + limit + " *  from UserInfor where UserID not in (select top " + start
        + " UserID from UserInfor where UserID>-1 " + filter + " order by UserID) " + filter + " order by UserID ";
            getcountSql = "select  UserID  from UserInfor where UserID>-1 " + filter;
        }

        else
        {
        }
        SQLToJson.ReaderSQLToJson.SetCount(getcountSql, PlatForm_connectstr);
        Response.Write(GetJsonStr(sql, PlatForm_connectstr));

        Response.End();
        Response.Clear();
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
            return SQLToJson.ReaderSQLToJson.GetJSON(sdr).ToString();
        }
    }
}