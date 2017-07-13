using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;

public partial class SoftWare_WebPage_SoftWareData : System.Web.UI.Page
{
    int start = 0;
    int limit = 10;
    string sql;
    string getcountSql;
    protected void Page_Load(object sender, EventArgs e)
    {

        //connectstr = Session["connectstr"].ToString();
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString(); ;
        if (PlatForm_connectstr != "")
        {
            if (!string.IsNullOrEmpty(Request["limit"]))
            {
                limit = int.Parse(Request["limit"]);
            }
            if (!string.IsNullOrEmpty(Request["start"]))
            {
                start = int.Parse(Request["start"]);
            }
            if (string.IsNullOrEmpty(Request["OperateType"]))//如果没有传来的projectname的值就显示所有文档EmployeeList
            {

                sql = " select top " + limit +
                    " V_MyFullInfSoftStore.* from V_MyFullInfSoftStore where ID not in (select top " + start
                        + " ID from V_MyFullInfSoftStore)  " ;
                getcountSql = "select  ID  from V_MyFullInfSoftStore  " ;

            }
            else if (Request["OperateType"].Equals("SoftWareSearch"))
            {
                string MyStoreFilter = "";

                string filter = "  ID>-1  ";

                {
                    if (Request["SoftWareName"] != null && !Request["SoftWareName"].ToString().Trim().Equals(""))//
                        MyStoreFilter += " and 软件名称 like '%" + Request["SoftWareName"].ToString() + "%' ";
                    if (Request["SoftWareEnt"] != null && !Request["SoftWareEnt"].ToString().Trim().Equals(""))//
                        MyStoreFilter += " and ProviderEntName like '%" + Request["SoftWareEnt"].ToString() + "%' ";
                    if (Request["SoftWareEvir"] != null && !Request["SoftWareEvir"].ToString().Trim().Equals(""))//
                        MyStoreFilter += " and 系统环境 like '%" + Request["SoftWareEvir"].ToString() + "%' ";
                    if (Request["SoftWareClass"] != null && !Request["SoftWareClass"].ToString().Trim().Equals(""))//
                        MyStoreFilter += " and 软件类别 like '%" + Request["SoftWareClass"].ToString() + "%' ";
                    if (Request["SoftWareKeyWord"] != null && !Request["SoftWareKeyWord"].ToString().Trim().Equals(""))//
                        MyStoreFilter += " and 关键词 like '%" + Request["SoftWareKeyWord"].ToString() + "%' ";
                }
                {
                    if (Request["MySoftWareApplyStartTime"] != null && !Request["MySoftWareApplyStartTime"].ToString().Equals(""))//BETWEEN value1 AND value2
                        MyStoreFilter += " and 申请时间 BETWEEN '" + Request["MySoftWareApplyStartTime"].ToString() + "' AND  '" + Request["MySoftWareApplyEndTime"].ToString() + "' ";
                    if (Request["MyStatus"] != null && !Request["MyStatus"].ToString().Trim().Equals(""))//
                        MyStoreFilter += " and 状态=" + Request["MyStatus"].ToString() + " ";
                    if (Request["MyUserName"] != null && !Request["MyUserName"].ToString().Trim().Equals(""))//
                        MyStoreFilter += " and 用户名 like '%" + Request["MyUserName"].ToString() + "%' ";
                    if (Request["MyApplyEntUserName"] != null && !Request["MyApplyEntUserName"].ToString().Trim().Equals(""))//
                        MyStoreFilter += " and ApplyEntName like '%" + Request["MyApplyEntUserName"].ToString() + "%' ";
                }
                sql = " select top " + limit +
                    " V_MyFullInfSoftStore.*  from V_MyFullInfSoftStore where ID not in (select top " + start
                        + " ID from V_MyFullInfSoftStore where  " + filter + MyStoreFilter + " ) and  " + filter + MyStoreFilter;
                getcountSql = " select  ID  from V_MyFullInfSoftStore where  " + filter + MyStoreFilter;
            }

            SQLToJson.ReaderSQLToJson.SetCount(getcountSql, PlatForm_connectstr);
            Response.Write(GetJsonStr(sql, PlatForm_connectstr));

            Response.End();
            Response.Clear();
        }
    }
    protected string GetJsonStr(string Sql, string PlatForm_connectstr)
    {
        SqlConnection con = new SqlConnection(PlatForm_connectstr);
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