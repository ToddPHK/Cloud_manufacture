<%@ WebHandler Language="C#" Class="workFlowHandler" %>

using System;
using System.Web;
using System.Data.SqlClient;
using System.Text;
using System.Data;
using System.Web.SessionState;
using System.Xml;

public class workFlowHandler : IHttpHandler, IRequiresSessionState
{

    public void ProcessRequest(HttpContext context)
    {
        string connectstr = context.Session["connectstr"].ToString();
        string PlatForm_connectstr = context.Session["PlatForm_connectstr"].ToString();
        if (connectstr != "")
        {
            if (context.Request["OperateType"] != null)
            {
                string OperateType = context.Request["OperateType"].ToString();
                string sql;
                if (OperateType.Equals("AddNewWorkFlow"))
                {

                    sql = "insert into workflow (name,creator,chargor,createtime,endtime) values ('" +
                        context.Request["WFName"] + "','" + context.Request["PeopleID"] + "','" + context.Session["userID"].ToString() + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "','" + context.Request["WFEndDate"] + "')";
                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
                    {
                        context.Response.Clear();
                        // context.Response.Write("插入成功！");

                        context.Response.Write("{success:true,msg:'工作流创建成功！',tr:'another inf'}");

                    }
                    else
                    {
                        context.Response.Clear();
                        context.Response.Write("{success:true,msg:'工作流创建失败！',tr:'another inf'}");
                    }

                }

                else if (OperateType.Equals("load"))
                {
                    sql = "select workflow from workflow  where name='" + context.Request["workflowname"] + "'";
                    context.Response.Clear();
                    context.Response.Write(sqlExecute.sqlmanage.GetUniqueRecord(sql, connectstr, new string[] { "workflow" }));

                }
                else if (OperateType.Equals("updateWorkFlowContent"))
                {
                    //  temp = context.Request["id"];

                    string s = context.Request["workflowcontent"];
                    sql = "update workflow set workflow='" + HttpUtility.UrlDecode(s) + "' where ID=" + context.Request["workflowID"];

                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
                    {
                        context.Response.Clear();
                        context.Response.Write("更新成功！");
                    }
                    else
                    {
                        context.Response.Clear();
                        context.Response.Write("更新失败！");
                    }
                }
                else if (OperateType.Equals("RefreshWorkFlowState"))
                {
                    string ENTID = context.Session["ENTID"].ToString();
                    bool flag = true;
                    string IDs = "";
                    SqlConnection con = new SqlConnection(PlatForm_connectstr);
                    SqlCommand cmd = new SqlCommand("(select UserWorkFlowID,WFState from WorkFlow where Publisher=" + ENTID + ") union (select UserWorkFlowID,WFState from WorkFlow_Backup where Publisher=" + ENTID + ")", con);
                    SqlDataAdapter ada = new SqlDataAdapter(cmd);
                    DataSet ds = new DataSet();
                    int counter = ada.Fill(ds, "temptable");
                    if (ds != null)
                    {
                        foreach (DataRow dr in ds.Tables["temptable"].Rows)
                        {
                            if (!sqlExecute.sqlmanage.ExecuteSQL("update  workflow set State=" + dr["WFState"] + " where ID=" + dr["UserWorkFlowID"], connectstr))
                            {
                                flag = false;
                                IDs += dr["UserWorkFlowID"] + ",";
                            }
                        }
                    }

                    if (flag)
                    {
                        context.Response.Clear();
                        context.Response.Write("所有任务的状态已更新成功！");
                    }
                    else
                    {
                        context.Response.Clear();
                        context.Response.Write("ID为" + IDs.Remove(IDs.Length - 1, 1) + "的任务的状态更新失败！");
                    }

                }
                else if (OperateType.Equals("ConfirmWFPass"))
                {
                    context.Response.Clear();
                    string[] WorkFlowIDS = context.Request["WorkFlowID"].ToString().Split(',');
                    foreach (string ID in WorkFlowIDS)
                    {
                        context.Response.Write(PublishTask(ID, connectstr, PlatForm_connectstr, context.Session["userID"].ToString()));
                    }
                }
                else if (OperateType.Equals("ConfirmWFNoPass"))
                {
                    sql = "update workflow set State=8  where ID in (" + context.Request["WorkFlowID"] + ")";
                    string sql1 = "update TaskList set TaskState=2 where WorkFlowID=" + context.Request["WorkFlowID"];//将流程中的任务全部置为待审核

                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr) && sqlExecute.sqlmanage.ExecuteSQL(sql1, connectstr))
                    {
                        context.Response.Clear();
                        context.Response.Write("success");
                    }
                    else
                    {
                        context.Response.Clear();
                        context.Response.Write("failure");
                    }
                }
                else if (OperateType.Equals("delete"))
                {
                    sql = "delete from workflow where ID in (" + context.Request["workflowID"] + ")";
                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
                    {
                        context.Response.Clear();
                        context.Response.Write("删除成功！");
                    }
                    else
                    {
                        context.Response.Clear();
                        context.Response.Write("删除失败！");
                    }
                }
                else if (OperateType.Equals("WorkFlowFinish"))
                {
                    
                    if (sqlExecute.sqlmanage.ExecuteSQL("update  workflow set State=4 where ID in (" + context.Request["WorkFlowID"].ToString() + ")", connectstr))
                    {
                        if (context.Request["State"].ToString().Equals("11"))
                        {
                            sqlExecute.sqlmanage.ExecuteSQL("update  WorkFlow set WFState=4 where Publisher=" + context.Session["ENTID"].ToString() + " and  UserWorkFlowID=" + context.Request["WorkFlowID"].ToString(), PlatForm_connectstr);
                        }
                        context.Response.Clear();
                        context.Response.Write("流程执行完成");
                    }
                    else
                    {
                        context.Response.Clear();
                        context.Response.Write("确认流程执行完成失败");
                    }
                }
                else if (OperateType.Equals("EditWorkFlow"))
                {
                    sql = "update workflow set name='" + context.Request["WFName"] +
                           "', creator='" + context.Request["PeopleID"] +
                           "', endtime='" + context.Request["WFEndDate"] + "'  where ID='" + context.Request["WFID"] + "'";
                    //   sql = "delete from workflow where ID in (" + context.Request["WFID"] + ")";
                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
                    {
                        context.Response.Clear();
                        context.Response.Write("{success:true,msg:'修改成功！',tr:'another inf'}");

                    }
                    else
                    {
                        context.Response.Clear();
                        context.Response.Write("{success:true,msg:'修改失败！',tr:'another inf'}");
                    }
                }


            }
        }

    }
    public string PublishTask(string workflowID, string connectstr, string PlatForm_connectstr, string UserID)
    {

        
        string GetTaskIDsSQL = "select TaskID from  TaskList where WorkFlowID=" + workflowID;
        string TaskID = sqlExecute.sqlmanage.GetUniqueRecord(GetTaskIDsSQL, connectstr, new string[] { "TaskID" });
        string WorkFlowState = sqlExecute.sqlmanage.GetUniqueRecord("select State from workflow where ID=" + workflowID, connectstr, new string[] { "State" });
        bool ErrorFlag = false;
        if (!string.IsNullOrEmpty(TaskID))
        {
            //插入工作流
            string WorkFlow_Name = sqlExecute.sqlmanage.GetUniqueRecord("select workflow,name from workflow where ID=" + workflowID, connectstr, new string[] { "workflow", "name" }).Replace(",","','");
          //  string WorkFlowName = sqlExecute.sqlmanage.GetUniqueRecord("select name from workflow where ID=" + workflowID, connectstr, new string[] { "name" });
          string insertWFSQL=null;
            if(WorkFlowState.Equals("16"))
                  insertWFSQL = " insert into WorkFlow(UserWorkFlowID,WorkFlow,WorkFlowName,PublishTime,WFState,Publisher) " +
                                     "values ('" + workflowID + "','" + WorkFlow_Name + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "','11','" + UserID + "')";
            else if (WorkFlowState.Equals("7"))
             insertWFSQL = " insert into WorkFlow(UserWorkFlowID,WorkFlow,WorkFlowName,PublishTime,WFState,Publisher) " +
                                     "values ('" + workflowID + "','" + WorkFlow_Name + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "','9','" + UserID + "')";
            sqlExecute.sqlmanage.ExecuteSQL(insertWFSQL, PlatForm_connectstr);//

            //获取新插入的流程的ID
            string ID = sqlExecute.sqlmanage.GetUniqueRecord("select ID from WorkFlow where Publisher=" + UserID + " and UserWorkFlowID=" + workflowID, PlatForm_connectstr, new string[] { "ID" });
            string[] TaskIDs = TaskID.Split('|');
            foreach (string s in TaskIDs)
            {
                string temp = sqlExecute.sqlmanage.GetUniqueRecord("select TaskDetailInf,Name from TaskList,ProjectTaskTree where TaskList.BelongProjectTreeNode=ProjectTaskTree.ID and TaskID=" + s, connectstr, new string[] { "TaskDetailInf", "Name" }).Replace(",","','");
                string detailsql =null;

                if (WorkFlowState.Equals("16"))
                    detailsql = " insert into TaskList(UserTaskID,TaskDetailInf,TaskName,PublishTime,TaskState,WorkFlowID,Publisher) " +
                                        "values ('" + s + "','" + temp + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "','10','" + ID + "','" + UserID + "')";
                else if (WorkFlowState.Equals("7"))
                    detailsql = " insert into TaskList(UserTaskID,TaskDetailInf,TaskName,PublishTime,TaskState,WorkFlowID,Publisher) " +
                                     "values ('" + s + "','" + temp + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "','3','" + ID + "','" + UserID + "')";
                if (!sqlExecute.sqlmanage.ExecuteSQL(detailsql, PlatForm_connectstr))
                {
                    //   ErrorTaskMsg.Append(s + ",");
                    ErrorFlag = true;
                }

            }


            if (ErrorFlag)
            {
                return "failure";
                //  return ErrorTaskMsg.Append("提交失败").ToString().Substring(0, ErrorTaskMsg.Append("提交失败").ToString().Length - 1);
            }
            else
            {
                if (WorkFlowState.Equals("16"))
                {
                    sqlExecute.sqlmanage.ExecuteSQL("update TaskList set TaskState=10 where WorkFlowID=" + workflowID, connectstr);//将流程中的任务全部置为待审核
                    sqlExecute.sqlmanage.ExecuteSQL("update workflow set State=11 where ID=" + workflowID, connectstr);//流程状态置为”待审核“
                }

                else if (WorkFlowState.Equals("7"))
                {
                    sqlExecute.sqlmanage.ExecuteSQL("update TaskList set TaskState=3 where WorkFlowID=" + workflowID, connectstr);//将流程中的任务全部置为待审核
                    sqlExecute.sqlmanage.ExecuteSQL("update workflow set State=9 where ID=" + workflowID, connectstr);//流程状态置为”待审核“
                }
                return "success";
            }
        }
        else
        {
            return "failure";
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