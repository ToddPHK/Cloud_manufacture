<%@ WebHandler Language="C#" Class="OrgStructure" %>

using System;
using System.Web;
using System.Web.SessionState;
public class OrgStructure : IHttpHandler, IRequiresSessionState
{

    public void ProcessRequest(HttpContext context)
    {
        string sql = "";
        string connectstr = context.Session["connectstr"].ToString();
        string msg = "";

        if (context.Request["OrgStructureOperaType"].Equals("MoveNode"))//项目组节点之间的拖放
        {
            if (!string.IsNullOrEmpty(context.Request["NodeID"]) && !string.IsNullOrEmpty(context.Request["TargetNodeID"]))
            {

                msg = "组织移动";
                if (context.Request["TargetNodeID"].ToString().Equals("OrgStructuretreeroot"))
                    sql = "update DeptList set 上级部门=null  where 部门编号='" + context.Request["NodeID"] + "'";
                else
                sql = "update DeptList set 上级部门='" + context.Request["TargetNodeID"].ToString().Trim() + "'  where 部门编号='" + context.Request["NodeID"] + "'";
            }
        }
        else if (context.Request["OrgStructureOperaType"].Equals("EditNode"))//项目组节点之间的拖放
        {
            if (sqlExecute.sqlmanage.HasRecord(connectstr, "select * from DeptList where    部门名称='" + context.Request["newName"] + "' and 部门编号<>'" + context.Request["NodeID"] + "' "))
            {
                context.Response.Clear();
                context.Response.Write("部门名称已被占用");

                return;
            }
            else if (sqlExecute.sqlmanage.HasRecord(connectstr, "select * from DeptList where  部门编号='" + context.Request["NewID"].ToString() + "' and 部门名称<>'" + context.Request["newName"] + "' "))
            {
                context.Response.Clear();
                context.Response.Write("部门编号已被占用");

                return;
            }
            if (!string.IsNullOrEmpty(context.Request["NodeText"]) && !string.IsNullOrEmpty(context.Request["NodeID"]))
            {
                msg = "组织修改";
                sql = "update DeptList set 部门名称='" + context.Request["NodeText"].ToString().Trim() + "',部门编号='" + context.Request["NewID"].ToString().Trim() + "'  where 部门编号='" + context.Request["NodeID"] + "'";
                sql += ";update DeptList set 上级部门='" + context.Request["NewID"].ToString().Trim() + "' where 上级部门='" + context.Request["NodeID"]+"'";
            }
        }
        else if (context.Request["OrgStructureOperaType"].Equals("DeleteNode"))
        {
            msg = "组织删除";
            sql = "delete from DeptList    where 部门编号='" + context.Request["NodeID"] + "'";

        }
        else if (context.Request["OrgStructureOperaType"].Equals("AddNode"))
        {
            if (sqlExecute.sqlmanage.HasRecord(connectstr, "select * from DeptList where    部门名称='" + context.Request["newName"] + "' "))
            {
                context.Response.Clear();
                context.Response.Write("部门名称已被占用");

                return;
            }
            else if (sqlExecute.sqlmanage.HasRecord(connectstr, "select * from DeptList where  部门编号='" + context.Request["CodeNum"].ToString() + "' "))
            {
                context.Response.Clear();
                context.Response.Write("部门编号已被占用");

                return;
            }

            msg = "组织增加";
            if (context.Request["ParentNodeID"].ToString().Equals("OrgStructuretreeroot"))
                sql = "insert  into DeptList   (部门名称,部门编号,上级部门) values ('" + context.Request["newName"] + "','" + context.Request["CodeNum"] + "',null)";
            else
                sql = "insert  into DeptList   (部门名称,部门编号,上级部门) values ('" + context.Request["newName"] + "','" + context.Request["CodeNum"] + "','" + context.Request["ParentNodeID"] + "')";

        }
        if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
        {
            context.Response.Clear();
            context.Response.Write(msg + "成功！");
        }
        else
        {
            context.Response.Clear();
            context.Response.Write(msg + "失败！");
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