using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;

public partial class ENTUsers_PDM_DataManage_ProjectType_ProjectTypeData : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string connectstr = null;
        if (Session["connectstr"] != null)
        {
            connectstr = Session["connectstr"].ToString();
            string sql = null;
            string getcountSql = null;
            if (Request["OperateType"].Equals("LoadData"))//如果没有传来的projectname的值就显示所有文档EmployeeList
            {

                sql = "select   * from ProjectType ";
                getcountSql = "select  TypeID  from ProjectType";
                SQLToJson.ReaderSQLToJson.SetCount(getcountSql, connectstr);
                Response.Write(GetJsonStr(sql, connectstr));

                Response.End();
                Response.Clear();
            }
            else if (Request["OperateType"].Equals("DataSearch"))
            {
                string filter = null;
                if (Request["TypeName"] != null && !Request["TypeName"].ToString().Equals(""))
                    filter = " and TypeText like '%" + Request["TypeName"].ToString().Trim() + "%'";
                sql = "select   *  from ProjectType where  TypeID >-1 " + filter;
                getcountSql = "select  TypeID  from ProjectType where   TypeID >-1 " + filter;
                SQLToJson.ReaderSQLToJson.SetCount(getcountSql, connectstr);
                Response.Write(GetJsonStr(sql, connectstr));

                Response.End();
                Response.Clear();
            }
            else if (Request["OperateType"].Equals("DataAdd"))
            {
                if (sqlExecute.sqlmanage.HasRecord(connectstr, "select * from ProjectType where TypeText='" + Request["Name"] + "'"))
                {
                    Response.Write("{success:false,msg:'项目类型名已存在！'}");
                }
                else
                {
                    sql = "insert into  ProjectType (TypeText,TypeDescribe,AddTime)  values  ('" + Request["Name"] + "','" + Request["Description"] + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "')";

                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
                    {
                        Response.Clear();
                        Response.Write("{success:true,msg:'项目类型添加成功！'}");

                    }
                    else
                    {
                        Response.Clear();
                        Response.Write("{success:false,msg:'项目类型添加失败！'}");
                    }
                }
                Response.End();


            }
            else if (Request["OperateType"].Equals("DataDelete"))
            {

                sql = "delete from  ProjectType where TypeID in (" + Request["IDS"] + ")";
                if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
                {
                    Response.Clear();
                    Response.Write("项目类型删除成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("项目类型删除失败！");
                }
                Response.End();

            }
            else if (Request["OperateType"].Equals("DataEdit"))
            {
                if (sqlExecute.sqlmanage.HasRecord(connectstr, "select * from ProjectType where TypeText='" + Request["Name"] + "' and TypeID<>" + Request["ID"]))
                {
                    Response.Write("{success:false,msg:'项目类型名已存在！'}");
                }
                else
                {

                    sql = "update  ProjectType   set TypeText='" + Request["Name"] + "', TypeDescribe='" + Request["Description"] + "' where TypeID =" + Request["ID"];
                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
                    {
                        Response.Clear();
                        Response.Write("{success:true,msg:'项目类型修改成功！'}");

                    }
                    else
                    {
                        Response.Clear();
                        Response.Write("{success:false,msg:'项目类型修改失败！'}");
                    }
                }
                Response.End();
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