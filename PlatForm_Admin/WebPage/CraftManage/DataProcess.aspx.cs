﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;

public partial class PlatForm_Admin_WebPage_CraftManage_DataProcess : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();
            if (OperateType.Equals("LoadCraftTreeData"))
            {
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeFullJson ff = new TreeFullJson.TreeFullJson(PlatForm_connectstr, false);
                sb.AppendFormat("[{0}]", ff.fillTreeView("select ID,Name,ParentID from Craft  where ParentID is null", new string[] { "id", "text" }, "ID", "ParentID"));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();

            }

            else if (OperateType.Equals("EditNode"))
            {
                if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from Craft where  Name='" + Request["ClassName"].ToString() + "' and  ID<>'" + Request["ID"] + "' "))
                {
                    Response.Write("{success:false,msg:'该工艺类型已被占用！'}");
                    Response.End();
                    Response.Clear();
                }
                else
                {
                    string sql = "";
                    sql = "update Craft set  Name='" + Request["ClassName"] +
                            "'  where  ID='" + Request["ID"] + "'";
                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, PlatForm_connectstr))
                        Response.Write("{success:true,msg:'工艺类型修改成功！'}");
                    else
                        Response.Write("{success:false,msg:'工艺类型修改失败！'}");
                    Response.End();
                    Response.Clear();
                }


            }
            else if (OperateType.Equals("AddNode"))
            {

                if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from Craft where  Name='" + Request["ClassName"].ToString() + "' "))
                {
                    Response.Write("{success:false,msg:'该工艺类型已存在！'}");
                    Response.End();
                    Response.Clear();
                }
                else
                {
                    string temp = "";
                    temp += "'" + Request["ClassName"] + "',";
                    temp += "'" + Request["ID"] + "'";
                    if (sqlExecute.sqlmanage.ExecuteSQL("insert into Craft (Name,ParentID) values (" + temp + ")", PlatForm_connectstr))
                        Response.Write("{success:true,msg:'工艺类型添加成功！'}");
                    else
                        Response.Write("{success:false,msg:'工艺类型添加失败！'}");
                    Response.End();
                    Response.Clear();
                }


            }
            else if (OperateType.Equals("DeleteNode"))
            {

                if (sqlExecute.sqlmanage.ExecuteSQL("delete from  Craft where ID=" + Request["ID"], PlatForm_connectstr))
                    Response.Write("工艺类型删除成功！");
                else
                    Response.Write("工艺类型删除失败！");
                Response.End();
                Response.Clear();

            }
            else if (OperateType.Equals("MoveNode"))
            {

                string sql = "";
                sql = "update Craft set  " +
                        "ParentID='" + Request["TargetNodeID"] + "'  where  ID='" + Request["NodeID"] + "'";
                if (sqlExecute.sqlmanage.ExecuteSQL(sql, PlatForm_connectstr))
                    Response.Write("移动成功！");
                else
                    Response.Write("移动失败！");
                Response.End();
                Response.Clear();

            }

        }
    }
}