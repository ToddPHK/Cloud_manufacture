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

        string PlatForm_connectstr = context.Session["PlatForm_connectstr"].ToString();
        string connectstr = context.Session["connectstr"].ToString();
        if (connectstr != "")
        {
            if (context.Request["OperateType"] != null)
            {
                string OperateType = context.Request["OperateType"].ToString();
                string sql = "";
                if (OperateType.Equals("AddNewWorkFlow"))
                {

                    sql = "insert into workflow (name,ProjectID,creator,createtime,endtime) values ('" +
                        context.Request["WFName"] + "','" + context.Request["ProjectID"] + "','" + context.Session["userID"].ToString() + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "','" + context.Request["WFEndDate"] + "')";
                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
                    {
                        context.Response.Clear();
                        // context.Response.Write("插入成功！");

                        context.Response.Write("{success:true,msg:'工作流创建成功！',tr:'another inf'}");

                    }
                    else
                    {
                        context.Response.Clear();
                        context.Response.Write("{success:false,msg:'工作流创建失败！',tr:'another inf'}");
                    }

                }

                else if (OperateType.Equals("load"))
                {
                    sql = "select workflow from workflow  where name='" + context.Request["workflowname"] + "'";
                    context.Response.Clear();
                    context.Response.Write(sqlExecute.sqlmanage.GetUniqueRecord(sql, connectstr, new string[] { "workflow" }));

                }
                else if (OperateType.Equals("RefreshWorkFlowState"))
                {
                    string ENTID = context.Session["ENTID"].ToString();
                    bool flag = true;
                    string IDs = "";
                    string MyWFIDs = sqlExecute.sqlmanage.GetUniqueRecord("select ID from workflow where creator=" + context.Session["userID"].ToString(), connectstr, new string[] { "ID" }).Replace("|", ",");
                    SqlConnection con = new SqlConnection(PlatForm_connectstr);
                    SqlCommand cmd = new SqlCommand("(select UserWorkFlowID,WFState from WorkFlow where Publisher=" + ENTID + " and UserWorkFlowID in (" + MyWFIDs + ")) union (select UserWorkFlowID,WFState from WorkFlow_Backup where Publisher=" + ENTID + " and UserWorkFlowID in (" + MyWFIDs + "))", con);
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
                        context.Response.Write("所有流程的状态已更新成功！");
                    }
                    else
                    {
                        context.Response.Clear();
                        context.Response.Write("ID为" + IDs.Remove(IDs.Length - 1, 1) + "的流程的状态更新失败！");
                    }

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
                else if (OperateType.Equals("publishWorkFlowTask"))//企业内部用户申请发布流程
                {
                    context.Response.Clear();
                    context.Response.Write(publishWorkFlow(context.Request["workflowID"].ToString(), connectstr, context.Session["username"].ToString(), context.Session["adminname"].ToString()));

                }

                else if (OperateType.Equals("delete"))
                {
                    sql = "delete from workflow where ID in (" + context.Request["workflowID"] + ")";
                    string sql1 = "update TaskList set  WorkFlowID=-1 where WorkFlowID in (" + context.Request["workflowID"] + ")";
                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr) && sqlExecute.sqlmanage.ExecuteSQL(sql1, connectstr))
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
                else if (OperateType.Equals("EditWorkFlow"))
                {
                    sql = "update workflow set name='" + context.Request["WFName"] +
                           "', ProjectID='" + context.Request["ProjectID"] +
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
                        context.Response.Write("{success:false,msg:'修改失败！',tr:'another inf'}");
                    }
                }
                else if (OperateType.Equals("ConfirmWFFinish"))
                {
                    if (sqlExecute.sqlmanage.ExecuteSQL("update  workflow set State=1 where ID in (" + context.Request["WorkFlowID"].ToString() + ")", connectstr))
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
                else if (OperateType.Equals("ConfirmWorkFlow"))
                {
                    if (sqlExecute.sqlmanage.ExecuteSQL("update  workflow set State=1 where ID in (" + context.Request["WorkFlowID"].ToString() + ")", connectstr))
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
                else if (OperateType.Equals("WorkF_PassAuDit"))
                {

                    sql = "update  workflow set State=7 where ID in (" + context.Request["WorkFlowID"].ToString() + ");update  TaskList set TaskState=1 where WorkFlowID in (" + context.Request["WorkFlowID"].ToString() + ")";


                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
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
                else if (OperateType.Equals("WorkF_NoPassAuDit"))
                {
                    sql = "update  workflow set State=13 where ID in (" + context.Request["WorkFlowID"].ToString() + ");update  TaskList set TaskState=23 where WorkFlowID in (" + context.Request["WorkFlowID"].ToString() + ")";
                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
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
                else if (OperateType.Equals("ConfirmWFBindingFinish"))
                {
                    if (sqlExecute.sqlmanage.ExecuteSQL("update  workflow set State=2 where ID in (" + context.Request["WorkFlowID"].ToString() + ")", connectstr))
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
                else if (OperateType.Equals("WorkFlowFinish"))
                {
                    if (sqlExecute.sqlmanage.ExecuteSQL("update  workflow set State=4 where ID in (" + context.Request["WorkFlowID"].ToString() + ")", connectstr))
                    {
                        if (context.Request["State"].ToString().Equals("11"))
                        {
                            sqlExecute.sqlmanage.ExecuteSQL("update  WorkFlow set WFState=4 where Publisher=" + context.Session["ENTID"].ToString() + " and  UserWorkFlowID=" + context.Request["WorkFlowID"].ToString(), PlatForm_connectstr);
                        }
                        context.Response.Clear();
                        context.Response.Write("流程执行完成！");
                    }
                    else
                    {
                        context.Response.Clear();
                        context.Response.Write("确认流程执行完成失败！");
                    }
                }
                else if (OperateType.Equals("BadingTask"))
                {
                    bool flag = true;
                    if (!string.IsNullOrEmpty(context.Request["PreTaskID"].ToString()) && !context.Request["PreTaskID"].ToString().Equals("NoPreTask"))
                    {
                        if (!sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set WorkFlowID=-1 where TaskID =(" + context.Request["PreTaskID"].ToString() + ")", connectstr))
                        {
                            flag = false;
                        }

                    }
                    if (!sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set WorkFlowID=" + context.Request["WorkFlowID"].ToString() + " where TaskID =(" + context.Request["TaskID"].ToString() + ")", connectstr))
                    {
                        flag = false;
                    }
                    if (flag)
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
                else if (OperateType.Equals("monitor"))
                {
                    string getworkflowSQL = "select workflow from  workflow where ID=" + context.Request["workflowID"];
                    string WorkFlow = sqlExecute.sqlmanage.GetUniqueRecord(getworkflowSQL, connectstr, new string[] { "workflow" });
                    string statemonitor = null;
                    XmlDocument xmlDoc = new XmlDocument();
                    xmlDoc.LoadXml(WorkFlow);
                    XMLHandler.XmlManage XmlManage = new XMLHandler.XmlManage();
                    XmlNode[] MonitorNodes = XmlManage.GetMonitorNode(xmlDoc);
                    // XmlNodeList Nodes = xmlDoc.SelectNodes("/mxGraphModel/root/Rect");
                    if (MonitorNodes.Length > 0)
                    {
                        int i = 0;
                        foreach (XmlNode xnf in MonitorNodes)
                        {
                            XmlElement xe = (XmlElement)xnf;

                            if (i == 0)
                            {
                                i = 1;
                                statemonitor = xe.GetAttribute("id") + "," + ((XmlElement)xnf.FirstChild).GetAttribute("mystate");
                            }
                            else
                                statemonitor += "|" + xe.GetAttribute("id") + "," + ((XmlElement)xnf.FirstChild).GetAttribute("mystate");

                        }

                        context.Response.Clear();
                        context.Response.Write(statemonitor + "|over");
                    }
                    else
                    {
                        context.Response.Clear();
                        context.Response.Write("ERROR");
                    }
                }
            }
        }

    }
    public string publishWorkFlow(string workflowID, string connectstr, string UserName, string EnterpriseName)
    {

        int count = sqlExecute.sqlmanage.GetCount("select count(*) from TaskList  where TypeID=1 and WorkFlowID=" + workflowID, connectstr);
        if (count > 0)
        {
            return "{success:false,msg:'绑定本地任务的流程不能发布！',tr:'another inf'}";
        }

        int TaskCount = sqlExecute.sqlmanage.GetCount("select count(*) from TaskList  where  WorkFlowID=" + workflowID, connectstr);
        //int Task_ServiceCount = sqlExecute.sqlmanage.GetCount("select count(distinct TaskID) from Task_Service  where TaskID  in (select TaskID from TaskList where  WorkFlowID=" + workflowID + ")", connectstr);
        //if (Task_ServiceCount == 0)
        //{
        //    BindingService = false;
        //}
        //else if (TaskCount == Task_ServiceCount)
        //{
        //    BindingService = true;
        //}
        //else
        //{
        //    return "{success:false,msg:'不是所有的任务都选择了服务！',tr:'another inf'}";
        //}


        if (sqlExecute.sqlmanage.ExecuteSQL("update  workflow set State=12 where ID in (" + workflowID + ")", connectstr) && sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=21 where WorkFlowID in (" + workflowID + ")", connectstr))
        {
            return "{success:true,msg:'申请发布成功！',state:'12'}";
        }
        else
        {
            return "{success:false,msg:'申请发布失败！'}！";
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