using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Data;

public partial class PDM_DataManage_RoleManage_RoleTableData : System.Web.UI.Page
{
    int start = 0;
    int limit = 10;
    string sql;
    string getcountSql;
    string connectstr;
    protected void Page_Load(object sender, EventArgs e)
    {

        if (Session["connectstr"] != null)
        {
            connectstr = Session["connectstr"].ToString();
            string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
            if (!string.IsNullOrEmpty(Request["limit"]))
            {
                limit = int.Parse(Request["limit"]);
            }
            if (!string.IsNullOrEmpty(Request["start"]))
            {
                start = int.Parse(Request["start"]);
            }
            if (string.IsNullOrEmpty(Request["RoleDataManageOperaType"]))//如果没有传来的projectname的值就显示所有文档EmployeeList
            {

                sql = "select top " + limit + " *" +
                    " from RoleList where ID not in (select top " + start
                        + " ID from RoleList ) ";
                getcountSql = "select  ID  from RoleList";

            }
            else if (Request["RoleDataManageOperaType"].Equals("GroupSearch"))
            {
                string filter = null;
                if (Request["RoleDataManageName"] != null && !Request["RoleDataManageName"].ToString().Equals(""))
                    filter = " and Name like '%" + Request["RoleDataManageName"].ToString().Trim() + "%'";
                sql = "select top " + limit + " *" +
    " from RoleList where ID not in (select top " + start
        + " ID from RoleList where ID>-1  " + filter + "  ) " + filter + " order by ID";

                getcountSql = "select  ID  from RoleList where  ID>-1  " + filter;

            }
            else if (Request["RoleDataManageOperaType"].Equals("RoleDataManageAdd"))
            {
                if (sqlExecute.sqlmanage.HasRecord(connectstr, "select * from RoleList where Name='" + Request["Name"] + "'"))
                {
                    Response.Write("{success:false,msg:'角色已存在！'}");

                }
                else
                {
                    sql = "insert into  RoleList (Name,Description,CreateDate)  values  ('" + Request["Name"] + "','" + Request["Description"] + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "')";
                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
                    {
                        Response.Clear();
                        Response.Write("{success:true,msg:'角色添加成功！'}");

                    }
                    else
                    {
                        Response.Clear();
                        Response.Write("{success:false,msg:'角色添加失败！'}");

                    }

                }
                Response.End();
                return;

            }
            else if (Request["RoleDataManageOperaType"].Equals("DeleteRole"))
            {

                sql = "delete from  RoleList where ID in (" + Request["IDS"] + ")";
                if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
                {
                    Response.Clear();
                    Response.Write("角色删除成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("角色删除失败！");
                }
                Response.End();
                return;

            }
            else if (Request["RoleDataManageOperaType"].Equals("RoleDataManageEdit"))
            {
                if (sqlExecute.sqlmanage.HasRecord(connectstr, "select * from RoleList where Name='" + Request["Name"] + "' and ID<>" + Request["ID"]))
                {
                    Response.Write("{success:false,msg:'角色已存在！'}");

                }
                else
                {
                    sql = "update    RoleList   set Name='" + Request["Name"] + "', Description='" + Request["Description"] + "' where ID ='" + Request["ID"] + "'";
                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
                    {
                        Response.Clear();
                        Response.Write("{success:true,msg:'角色修改成功！'}");

                    }
                    else
                    {
                        Response.Clear();
                        Response.Write("{success:false,msg:'角色修改失败！'}");

                    }
                }
                Response.End();
                return;

            }
            else if (Request["RoleDataManageOperaType"].Equals("RefreshDataFromServer"))
            {
                if (ReFreshDataFromServer(PlatForm_connectstr, connectstr))
                {
                    Response.Clear();
                    Response.Write("角色数据更新成功！");

                    Response.End();

                }
                else
                {
                    Response.Clear();
                    Response.Write("角色数据更新失败！");

                    Response.End();
                }
                return;
            }
            SQLToJson.ReaderSQLToJson.SetCount(getcountSql, connectstr);
            Response.Write(GetJsonStr(sql));

            Response.End();
            Response.Clear();
        }
    }
    protected string GetJsonStr(string Sql)
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
    bool ReFreshDataFromServer(string PlatForm_connectstr, string connectstr)
    {
        try
        {
            string[] IDNameColors = sqlExecute.sqlmanage.GetUniqueRecord("select Name,Description from RoleList", PlatForm_connectstr, new string[] { "Name", "Description" }).Split('|');
            foreach (string IDNameColor in IDNameColors)
            {
                if (!sqlExecute.sqlmanage.ExecuteSQL("insert into RoleList(Name,Description,CreateDate) values ('" + IDNameColor.Replace(",", "','") + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "')", connectstr))
                    return false;
            }
            return true;

        }
        catch (Exception e)
        {
            return false;
        }

    }
}