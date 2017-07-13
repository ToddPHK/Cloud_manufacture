using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;

public partial class PlatForm_Admin_WebPage_StandardTaskTypeTree_DataProcess : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        // string  connectstr = Session["connectstr"].ToString();
        //string PlatForm_connectstr = "server=(local);Initial Catalog=CloudMDB;User ID=sa;Password=zju308;connect timeout=30";
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();
            if (OperateType.Equals("AllStandardTaskType"))
            {
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeFullJson ff2 = new TreeFullJson.TreeFullJson(PlatForm_connectstr, true);
                sb.AppendFormat("[{0}]", ff2.fillTreeView("select ServiceTree.*,TaskTemplate.fieldLabel as TemplateDisplayName from ServiceTree,TaskTemplate where PNodeId is null and ServiceTree.TemplateID *=TaskTemplate.TaskTemplateID ", new string[] { }, "NodeId", "PNodeId", " ServiceTree.TemplateID *=TaskTemplate.TaskTemplateID "));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();
                return;
            }
            else if (OperateType.Equals("StandardTask_Search"))
            {
                string fileter = "";
                if (!string.IsNullOrWhiteSpace(Request["Name"].ToString()))
                {
                 //   fileter = " and StandardTaskName like '%" + Request["Name"].ToString() + "%' ";
                    fileter = " and (StandardTaskName like '%" + Request["Name"].ToString() + "%' or NodeName like '%" + Request["Name"].ToString() + "%')";
                }
                else
                {
                    fileter = " and PNodeId is null ";
                }

                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeCurrentSql ff1 = new TreeFullJson.TreeCurrentSql(PlatForm_connectstr, true);
                sb.AppendFormat("[{0}]", ff1.fillTreeView("select ServiceTree.*,TaskTemplate.fieldLabel as TemplateDisplayName from ServiceTree,TaskTemplate where ServiceTree.TemplateID *=TaskTemplate.TaskTemplateID " + fileter, new string[] { }, "NodeId", "PNodeId" ));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();
                return;
            }
            else if (OperateType.Equals("LoadByStandardTaskID"))
            {
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeFullJson ff3 = new TreeFullJson.TreeFullJson(PlatForm_connectstr, true);
                sb.AppendFormat("[{0}]", ff3.fillTreeView("select  Coalesce(fieldLabel,Chinese) as DisplayName,name,emptyText,width,height,Type,BidingStandardTaskID,State,TaskTemplateID,TaskTemplateParentID,TaskTemplateCreateDate,DicWordID,ServiceTree.StandardTaskName from TaskTemplate,ServiceTree,Attributes where TaskTemplate.BidingStandardTaskID*=ServiceTree.NodeId and TaskTemplate.DicWordID*=Attributes.AttributeID and State=2 and TaskTemplateParentID is null and BidingStandardTaskID=" + Request["StandardTaskID"].ToString(), new string[] { }, "TaskTemplateID", "TaskTemplateParentID", " TaskTemplate.DicWordID*=Attributes.AttributeID  and TaskTemplate.BidingStandardTaskID*=ServiceTree.NodeId "));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();
                return;
            }
            else if (OperateType.Equals("TaskTemplate_Search"))
            {
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeFullJson ff4 = new TreeFullJson.TreeFullJson(PlatForm_connectstr, true);
                sb.AppendFormat("[{0}]", ff4.fillTreeView("select  Coalesce(fieldLabel,Chinese) as DisplayName,name,emptyText,width,height,Type,BidingStandardTaskID,State,TaskTemplateID,TaskTemplateParentID,TaskTemplateCreateDate,DicWordID,ServiceTree.StandardTaskName from TaskTemplate,ServiceTree,Attributes where TaskTemplate.BidingStandardTaskID*=ServiceTree.NodeId and TaskTemplate.DicWordID*=Attributes.AttributeID and TaskTemplateParentID is null and State=2  and BidingStandardTaskID=" + Request["StandardTaskID"].ToString() + " and  fieldLabel like '%" + Request["Name"].ToString() + "%'", new string[] { }, "TaskTemplateID", "TaskTemplateParentID", " TaskTemplate.DicWordID*=Attributes.AttributeID  and TaskTemplate.BidingStandardTaskID*=ServiceTree.NodeId "));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();
                return;

            }
            else if (OperateType.Equals("AddTaskType"))
            {
                string temp = "";

                if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from ServiceTree where  StandardTaskName='" + Request["StandardTaskTypeName"].ToString() + "' or NodeName='" + Request["StandardServiceTypeName"].ToString() + "' or CodingInit='" + Request["CodingInit"].ToString() + "'"))
                {
                    Response.Write("{success:false,msg:'该任务名或服务名或编号已被使用！',tr:'another inf'}");
                    Response.End();
                    Response.Clear();
                }

                else
                {

                    temp += "'" + Request["StandardTaskTypeName"] + "',";
                    temp += "'" + Request["StandardServiceTypeName"] + "',";
                    temp += "'" + Request["CodingInit"] + "',";
                    temp += "'" + Request["Description"] + "',";
                    temp += "'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "',";
                    temp += "'" + Request["ID"] + "'";
                    if (sqlExecute.sqlmanage.ExecuteSQL("insert into ServiceTree (StandardTaskName,NodeName,CodingInit,Description,CreateDate,PNodeId) values (" + temp + ")", PlatForm_connectstr))
                        Response.Write("{success:true,msg:'标准任务/服务添加成功！',tr:'another inf'}");
                    else
                        Response.Write("{success:false,msg:'标准任务/服务添加失败！',tr:'another inf'}");
                    Response.End();
                    Response.Clear();
                }


            }

            else if (OperateType.Equals("EditTaskType"))
            {


                if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from ServiceTree where  (StandardTaskName='" + Request["StandardTaskTypeName"].ToString() + "' or NodeName='" + Request["StandardServiceTypeName"].ToString() + "' or CodingInit='" + Request["CodingInit"].ToString() + "') and NodeId<>'" + Request["ID"] + "' "))
                {

                    Response.Write("{success:false,msg:'该任务名或服务名或编号已被使用！',tr:'another inf'}");
                    Response.End();
                    Response.Clear();

                }
                else
                {
                    string sql = "";

                    sql = "update ServiceTree set  StandardTaskName='" + Request["StandardTaskTypeName"] +
                         "', NodeName='" + Request["StandardServiceTypeName"] +
                          "', CodingInit='" + Request["CodingInit"] +
                            "', Description='" + Request["Description"] + "'  where NodeId='" + Request["ID"] + "'";

                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, PlatForm_connectstr))
                        Response.Write("{success:true,msg:'标准任务/服务修改成功！',tr:'another inf'}");
                    else
                        Response.Write("{success:false,msg:'标准任务/服务修改失败！',tr:'another inf'}");
                    Response.End();
                    Response.Clear();
                }
            }
            else if (OperateType.Equals("DeleteNodes"))
            {


                SQLToTreeJson.TreeJson tj = new SQLToTreeJson.TreeJson();
                string IDs = String.Join(",", tj.getChildID("ServiceTree", PlatForm_connectstr, "NodeId", "PNodeId", "select * from ServiceTree where NodeId in(" + Request["IDs"].ToString() + ")"));
                if (sqlExecute.sqlmanage.ExecuteSQL("delete from ServiceTree where NodeId in (" + IDs + ")", PlatForm_connectstr))
                    Response.Write("标准任务/服务修改成功！");
                else
                    Response.Write("标准任务/服务修改失败！");
                Response.End();
                Response.Clear();
            }

            else if (OperateType.Equals("TaskTempalteBiding"))
            {

                string sql = "";

                sql = "update ServiceTree set  TemplateID='" + Request["TemplateID"].ToString() +
                        "'  where NodeId=" + Request["ID"].ToString();

                if (sqlExecute.sqlmanage.ExecuteSQL(sql, PlatForm_connectstr))
                {
                    sqlExecute.sqlmanage.ExecuteSQL("update TaskTemplate set state=3 where TaskTemplateID=" + Request["TemplateID"].ToString(), PlatForm_connectstr);
                    Response.Write("模板绑定成功！");
                }
                else
                    Response.Write("模板绑定失败！");
                Response.End();
                Response.Clear();
            }
        }
    }
}