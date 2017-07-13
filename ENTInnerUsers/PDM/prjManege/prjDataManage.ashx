<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Web;
using System.Data.SqlClient;
using System.Text;
using System.Data;
using System.Web.SessionState;
public class Handler : IHttpHandler, IRequiresSessionState
{
    public void ProcessRequest(HttpContext context)
    {

        string sql = null;
        string connectstr = context.Session["connectstr"].ToString();
        if (connectstr != "")
        {
            string rttr = context.Request["prjIntoduction"];
            if (context.Request["prjOperaType"].Equals("add"))
            {
                if (sqlExecute.sqlmanage.HasRecord(connectstr, "select * from ProjList where 项目编号='" + context.Request["prjCodeNumber"].ToString() + "'"))
                {
                    context.Response.Clear();
                    context.Response.Write("{success:false,msg:'项目编号重复！'}");




                }
                else
                {
                    string temp = null;
                    temp += "'" + context.Request["prjName"] + "',";
                    temp += "'" + context.Session["userID"].ToString() + "',";
                    temp += "'" + context.Request["prjChargePeople"] + "',";
                    temp += "'" + context.Request["prjCustomer"] + "',";
                    temp += "'" + context.Request["prjType"] + "',";
                    temp += "'" + context.Request["prjCodeNumber"] + "',";
                    temp += "'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "',";
                    temp += "'1',";
                    temp += "'" + context.Request["prjPlanStartDate"] + "',";
                    temp += "'" + context.Request["prjPlanEndDate"] + "',";
                    temp += "'" + context.Request["prjIntoduction"] + "'";

                    sql = "insert into ProjList (项目名称,项目创建人,项目负责人,项目客户名称,项目类型,项目编号,创建日期,项目状态,项目计划开始日期,项目计划结束日期,项目简介) values (" + temp + ")";
                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
                    {

                        string ProjID = sqlExecute.sqlmanage.GetUniqueRecord("select 序号 from ProjList where 项目编号='" + context.Request["prjCodeNumber"] + "'", connectstr, new string[] { "序号" });
                        sqlExecute.sqlmanage.ExecuteSQL("insert into ProjectTaskTree (Name,CreateDate,Creator,Chargor,ProjectID) values ('" + context.Request["prjName"] + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "','" + context.Session["userID"].ToString() + "','" + context.Request["prjChargePeople"] + "','" + ProjID + "')", connectstr);

                        context.Response.Clear();
                        context.Response.Write("{success:true,msg:'项目添加成功！'}");


                    }
                    else
                    {
                        context.Response.Clear();

                        context.Response.Write("{success:false,msg:'项目添加失败！'}");

                    }
                }

            }


            else if (context.Request["prjOperaType"].Equals("edit"))
            {
                if (sqlExecute.sqlmanage.HasRecord(connectstr, "select * from ProjList where 项目编号='" + context.Request["prjCodeNumber"].ToString() + "' and 序号<>" + context.Request["id"]))
                {
                    context.Response.Clear();
                    context.Response.Write("{success:false,msg:'项目编号重复！'}");




                }
                else
                {
                    sql = "update ProjList set 项目名称='" + context.Request["prjName"] + "', 项目负责人='" + context.Request["prjChargePeople"] +
                        "', 项目客户名称='" + context.Request["prjCustomer"] + "', 项目类型='" + context.Request["prjType"] +
                        "', 项目编号='" + context.Request["prjCodeNumber"] +
                        // "', 项目状态='" + context.Request["prjState"] +
                        "', 项目计划开始日期='" + context.Request["prjPlanStartDate"] +
                        "', 项目计划结束日期='" + context.Request["prjPlanEndDate"] +
                        "', 项目简介='" + context.Request["prjIntoduction"] + "'  where 序号=" + context.Request["id"];
                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
                    {
                        sqlExecute.sqlmanage.ExecuteSQL("update  ProjectTaskTree  set  Chargor='" + context.Request["prjChargePeople"] + "',Name='" + context.Request["prjName"] + "'  where ParentID is null and ProjectID=" + context.Request["id"], connectstr);

                        context.Response.Clear();
                        context.Response.Write("{success:true,msg:'项目修改成功！'}");

                    }
                    else
                    {
                        context.Response.Clear();
                        context.Response.Write("{success:false,msg:'项目修改失败！'}");
                    }
                }
            }
            else if (context.Request["prjOperaType"].Equals("delete"))
            {
                string id = context.Request["id"];
                sql = "delete from ProjList where 序号 in (" + context.Request["id"] + ")";

                if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
                {
                    SQLToTreeJson.TreeJson tj = new SQLToTreeJson.TreeJson();
                    string IDs = String.Join(",", tj.getChildID("ProjectTaskTree", connectstr, "ID", "ParentID", "select * from ProjectTaskTree where ProjectID in(" + context.Request["id"].ToString() + ")"));
                    if (!string.IsNullOrWhiteSpace(IDs))
                    {
                        sqlExecute.sqlmanage.ExecuteSQL("delete from  ProjectTaskTree   where   ID  in  (" + IDs + ")", connectstr);
                        sqlExecute.sqlmanage.ExecuteSQL("delete from  TaskList   where   BelongProjectTreeNode in (" + IDs + ")", connectstr);

                        context.Response.Clear();
                        context.Response.Write("项目信息删除成功！");
                    }

                }
                else
                {
                    context.Response.Clear();
                    context.Response.Write("项目信息删除失败！");
                }
            }
            else if (context.Request["prjOperaType"].Equals("changeState"))
            {

                string target = context.Request["target"].ToString();
                if (target.Equals("-1"))
                {
                    sql = "update  ProjList  set 项目状态= -项目状态   where 序号 in (" + context.Request["id"] + ")";
                }
                else if (target.Equals("1"))
                {
                    sql = "update  ProjList  set 项目状态=" + target + " where 序号 in (" + context.Request["id"] + ")";
                }
                else if (target.Equals("2"))
                {
                    sql = "update  ProjList  set 项目状态=" + target + ",项目实际开始日期='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where 序号 in (" + context.Request["id"] + ")";
                }
                else
                    sql = "update  ProjList  set 项目状态=" + target + ",项目实际结束日期='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where 序号 in (" + context.Request["id"] + ")";




                if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
                {


                    context.Response.Clear();
                    context.Response.Write("项目状态修改成功！");


                }
                else
                {
                    context.Response.Clear();
                    context.Response.Write("项目状态修改失败！");
                }
            }

        }
    }


    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}