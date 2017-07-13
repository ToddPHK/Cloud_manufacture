﻿using System;
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
    string connectstr;
    protected void Page_Load(object sender, EventArgs e)
    {

        connectstr = Session["connectstr"].ToString();
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
            sql = "select top " + limit + " LoginLog.ID, LoginLog.LoginIP, LoginLog.LoginTime,EmployeeList.人员名称  " +
                " from LoginLog,EmployeeList where LoginLog.ID not in (select top " + start
                    + " ID from LoginLog) and LoginLog.UserID*=EmployeeList.人员ID   order by  LoginTime desc";
            getcountSql = "select  ID  from LoginLog";

        }
        else if (Request["OperateType"].Equals("LoginLogSearch"))
        {
            string filter = "";
            if (Request["LoginEntTime"] != null && !Request["LoginEntTime"].ToString().Equals(""))//BETWEEN value1 AND value2
                filter += " and LoginTime BETWEEN '" + Request["LoginStartTime"].ToString() + "' AND  '" + Request["LoginEntTime"].ToString() + "' ";
            if (Request["LoginEntName"] != null && !Request["LoginEntName"].ToString().Trim().Equals(""))
                filter += " and LoginLog.UserID in (select 人员ID from EmployeeList where 人员名称 like '%" + Request["LoginEntName"].ToString().Trim() + "%')";

            sql = "select top " + limit + " LoginLog.ID, LoginLog.LoginIP, LoginLog.LoginTime,EmployeeList.人员名称 " +
" from LoginLog,EmployeeList where LoginLog.ID not in (select top " + start
    + " ID from LoginLog where ID>-1 " + filter + " order by  LoginTime ) and LoginLog.UserID*=EmployeeList.人员ID " + filter + " order by  LoginTime desc";

            getcountSql = "select  ID  from LoginLog where ID>-1 " + filter;

        }
        Response.Clear();
        SQLToJson.ReaderSQLToJson.SetCount(getcountSql, connectstr);
        Response.Write(GetJsonStr(sql));

        Response.End();
        Response.Clear();

    }
    protected string GetJsonStr(string Sql)
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