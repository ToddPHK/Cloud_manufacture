using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using System.Data.SqlClient;
using System.Data;
using System.Collections;
using System.Xml;

public partial class PDM_TaskManage_Default : System.Web.UI.Page
{

    protected void Page_Load(object sender, EventArgs e)
    {
        string userName = Session["username"].ToString();
        string connectstr = Session["connectstr"].ToString();
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();
            if (OperateType.Equals("Createtask"))
            {
                if (sqlExecute.sqlmanage.HasRecord(connectstr, "select * from TaskList where BelongProjectTreeNode=" + Request["BelongProjectTreeNode"].ToString()))
                {
                    // sqlExecute.sqlmanage.ExecuteSQL("update ProjectTaskTree set State=1 where ID=" + Request["BelongProjectTreeNode"].ToString(), connectstr);
                    Response.Clear();
                    Response.Write("{success:false,msg:'任务已创建！'}");
                    Response.End();
                }
                else
                {
                    //string[] ComboxSubmitNames=  sqlExecute.sqlmanage.GetUniqueRecord("select AttributeName from Attributes where TableName is not null and xtype='combo'", PlatForm_connectstr, new string[] { "AttributeName" }).Split('|');
                    //string[] ComboTreeSubmitNames = sqlExecute.sqlmanage.GetUniqueRecord("select AttributeName from Attributes where TableName is not null and xtype='combotree'", PlatForm_connectstr, new string[] { "AttributeName" }).Split('|');
                    //ArrayList ComboxSubmitNamesAR = new ArrayList(ComboxSubmitNames);
                    //ArrayList ComboTreeSubmitNamesAR = new ArrayList(ComboTreeSubmitNames);
                    Hashtable HT_SubmitName_TableName = new Hashtable();
                    string[] SubmitName_TableName = sqlExecute.sqlmanage.GetUniqueRecord("select AttributeName,TableName from Attributes where TableName is not null", PlatForm_connectstr, new string[] { "AttributeName", "TableName" }).Split('|');

                    foreach (string s in SubmitName_TableName)
                    {
                        HT_SubmitName_TableName.Add(s.Split(',')[0], s.Split(',')[1]);
                    }
                    string sql = "";
                    StringBuilder sb = new StringBuilder();
                    sb.Append("<Task StandardTaskID =\"" + Request["StandardTaskID"].ToString() + "\">");
                    for (int i = 0; i < Request.QueryString.Count; i++)
                    {

                        string s = Request.QueryString.Keys[i].ToString();
                        if (!s.Equals("_dc") && !s.Equals("StandardTaskID") && !s.Equals("BelongProject") && !s.Equals("BelongProjectTreeNode") && !s.Equals("OperateType"))
                        {
                            if (HT_SubmitName_TableName.ContainsKey(s))
                            {
                                string ID = sqlExecute.sqlmanage.GetUniqueRecord("select ID from " + HT_SubmitName_TableName[s] + " where Name='" + Request[s].ToString() + "'", PlatForm_connectstr, new string[] { "ID" });
                                sb.Append("<" + s + " id=\"" + ID + "\">" + Request[s].ToString() + "</" + s + ">");
                            }

                            else
                            {
                                sb.Append("<" + s + ">" + Request[s].ToString() + "</" + s + ">");
                            }

                        }

                    }
                    sb.Append("</Task>");
                    sql = "insert into TaskList (TaskDetailInf,BelongProject,BelongProjectTreeNode,TaskState,TaskCreateDate) values " +
                        " ('" + sb.ToString() + "','" + Request["BelongProject"].ToString() + "','" + Request["BelongProjectTreeNode"].ToString() + "','" + "0','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "')";
                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
                    {
                        // sqlExecute.sqlmanage.ExecuteSQL("update ProjectTaskTree set State=1 where ID=" + Request["BelongProjectTreeNode"].ToString(), connectstr);
                        Response.Clear();
                        Response.Write("{success:true,msg:'任务创建成功！'}");
                        Response.End();
                    }
                    else
                    {
                        Response.Clear();
                        Response.Write("{success:true,msg:'任务创建失败！'}");
                        Response.End();
                    }
                }
            }
            else if (OperateType.Equals("EditTask"))
            {
                string sql = "";
                StringBuilder sb = new StringBuilder();
                sb.Append("<Task StandardTaskID =\"" + Request["StandardTaskID"].ToString() + "\">");
                for (int i = 0; i < Request.QueryString.Count; i++)
                {

                    string s = Request.QueryString.Keys[i].ToString();
                    if (!s.Equals("_dc") && !s.Equals("OperateType") && !s.Equals("TaskID") && !s.Equals("StandardTaskID"))
                    {
                        sb.Append("<" + s + ">" + Request[s].ToString() + "</" + s + ">");
                    }



                }
                sb.Append("</Task>");
                sql = "update TaskList set TaskDetailInf='" + sb.ToString() + "',TaskState=0 where TaskID=" + Request["TaskID"].ToString();
                if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
                {
                    Response.Clear();
                    Response.Write("{success:true,msg:'任务修改成功！'}");
                    sqlExecute.sqlmanage.ExecuteSQL("delete from  TaskList  where UserTaskID=" + Request["TaskID"].ToString() + " and Publisher=" + Session["ENTID"].ToString(), PlatForm_connectstr);
                    Response.End();
                }
                else
                {
                    Response.Clear();
                    Response.Write("{success:true,msg:'任务修改失败！'}");
                    Response.End();
                }
            }
            else if (OperateType.Equals("DeleteTask"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("delete from TaskList where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr))
                {
                    Response.Clear();
                    Response.Write("任务删除成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("任务删除失败！");
                }
            }
            else if (OperateType.Equals("RefreshTaskStateFServer"))//使用服务器中的任务状态更新用户数据库中的任务状态
            {
                string ENTID = Session["ENTID"].ToString();
                if (Request["TaskID"] != null)
                {
                    if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, " select UserTaskID from TaskList where Publisher=" + ENTID + " and UserTaskID=" + Request["TaskID"]))
                    {
                        string[] TaskID_State = sqlExecute.sqlmanage.GetUniqueRecord("select UserTaskID,TaskState from TaskList where Publisher=" + ENTID + " and UserTaskID=" + Request["TaskID"], PlatForm_connectstr, new string[] { "UserTaskID", "TaskState" }).Split(',');
                        if (TaskID_State.Length == 2)
                        {
                            if (sqlExecute.sqlmanage.ExecuteSQL("update TaskList set TaskState=" + TaskID_State[1] + " where TaskID=" + TaskID_State[0], connectstr))
                            {
                                Response.Clear();
                                Response.Write("所选任务状态已更新！");
                            }
                            else
                            {
                                Response.Clear();
                                Response.Write("所选任务状态更新失败！");
                            }
                        }
                        else
                        {
                            Response.Clear();
                            Response.Write("系统获取数据错误，请刷新或重新登录后重试！");
                        }
                    }
                    else if (Request["TaskState"].Equals("3"))
                    {


                        if (sqlExecute.sqlmanage.ExecuteSQL("update TaskList set TaskState=5 where TaskID=" + Request["TaskID"], connectstr))
                        {
                            Response.Clear();
                            Response.Write("所选任务状态已更新！");
                        }
                        else
                        {
                            Response.Clear();
                            Response.Write("所选任务状态更新失败！");
                        }


                    }
                    else
                    {
                        Response.Clear();
                        Response.Write("当前任务还未发布！");
                    }
                }
                else
                {

                    bool flag = true;
                    string IDs = "";
                    string MyTaskIDs = sqlExecute.sqlmanage.GetUniqueRecord("select TaskID from TaskList where BelongProjectTreeNode in ( select ID from ProjectTaskTree where Chargor=" + Session["userID"].ToString() + ")", connectstr, new string[] { "TaskID" }).Replace("|", ",");
                    SqlConnection con = new SqlConnection(PlatForm_connectstr);
                    SqlCommand cmd = new SqlCommand("(select UserTaskID,TaskState from TaskList where Publisher=" + ENTID + " and UserTaskID in (" + MyTaskIDs + ")) union (select UserTaskID,TaskState from TaskList_Backup where Publisher=" + ENTID + " and UserTaskID in (" + MyTaskIDs + "))", con);
                    SqlDataAdapter ada = new SqlDataAdapter(cmd);
                    DataSet ds = new DataSet();
                    int counter = ada.Fill(ds, "temptable");
                    if (ds != null)
                    {
                        foreach (DataRow dr in ds.Tables["temptable"].Rows)
                        {
                            if (!sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=" + dr["TaskState"] + " where TaskID=" + dr["UserTaskID"], connectstr))
                            {
                                flag = false;
                                IDs += dr["UserTaskID"] + ",";
                            }
                        }
                    }

                    if (flag)
                    {
                        Response.Clear();
                        Response.Write("所有任务的状态已更新成功！");
                    }
                    else
                    {
                        Response.Clear();
                        Response.Write("ID为" + IDs.Remove(IDs.Length - 1, 1) + "的任务的状态更新失败！");
                    }


                }

            }
            else if (OperateType.Equals("TaskCreateFinish"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=19 where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr))
                {
                    Response.Clear();
                    Response.Write("操作成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("操作失败！");
                }
            }
            else if (OperateType.Equals("ApplyPublish"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=21 where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr))
                {
                    Response.Clear();
                    Response.Write("申请发布操作成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("申请发布操作失败！");
                }
            }
            //确认服务选择完成
            else if (OperateType.Equals("ConfirmServiceChosed"))
            {


                if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from Task_Service where TaskID=( select ID from TaskList where UserTaskID=" + Request["TaskID"].ToString() + " and Publisher=" + Session["ENTID"].ToString() + ")"))
                {
                    if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=18 where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr)
                        && sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=18 where UserTaskID=" + Request["TaskID"].ToString() + " and Publisher=" + Session["ENTID"].ToString(), PlatForm_connectstr))
                    {
                        Response.Clear();
                        Response.Write("确认服务选择完成操作成功！");
                    }
                    else
                    {
                        Response.Clear();
                        Response.Write("确认服务选择完成操作失败！");
                    }
                }
                else
                {
                    Response.Clear();
                    Response.Write("还未选择服务！");
                }
            }
            //申请购买服务
            else if (OperateType.Equals("BuyServiceComplete"))
            {
                if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from Service_Task where flag=1 and  TaskID=( select ID from TaskList where UserTaskID=" + Request["TaskID"].ToString() + " and Publisher=" + Session["ENTID"].ToString() + ")"))
                {
                    if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=25 where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr)
                         && sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=25 where UserTaskID=" + Request["TaskID"].ToString() + " and Publisher=" + Session["ENTID"].ToString(), PlatForm_connectstr))
                    {
                        Response.Clear();
                        Response.Write("申请购买服务操作成功！");
                    }
                    else
                    {
                        Response.Clear();
                        Response.Write("申请购买服务操作失败！");
                    }
                }
                else
                {
                    Response.Clear();
                    Response.Write("您申请的服务中还没有服务方接受！");
                }
            }
            else if (OperateType.Equals("ErrorEnd"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=20 where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr)
                     && sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=20 where UserTaskID=" + Request["TaskID"].ToString() + " and Publisher=" + Session["ENTID"].ToString(), PlatForm_connectstr))
                {
                    Response.Clear();
                    Response.Write("异常终止操作成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("异常终止操作失败！");
                }
            }
            else if (OperateType.Equals("ApplyService"))//向服务提供方？？？？？？？？？？？？？？？？？
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=10 where UserTaskID=" + Request["TaskID"].ToString() + " and Publisher=" + Session["ENTID"].ToString(), PlatForm_connectstr)
                     && sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=10 where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr))
                {

                    Response.Clear();
                    Response.Write("申请服务操作成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("申请服务操作失败！");
                }
            }
            else if (OperateType.Equals("MatchAgain"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=4 where UserTaskID=" + Request["TaskID"].ToString() + " and Publisher=" + Session["ENTID"].ToString(), PlatForm_connectstr)
                     && sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=4 where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr))
                {

                    Response.Clear();
                    Response.Write("再次匹配服务操作成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("再次匹配服务操作失败！");
                }
            }
            else if (OperateType.Equals("AutoFindS"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=8 where UserTaskID=" + Request["TaskID"].ToString() + " and Publisher=" + Session["ENTID"].ToString(), PlatForm_connectstr)
                     && sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=8 where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr))
                {

                    Response.Clear();
                    Response.Write("再次匹配服务操作成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("再次匹配服务操作失败！");
                }
            }
            else if (OperateType.Equals("StartDeal"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=13 where UserTaskID=" + Request["TaskID"].ToString() + " and Publisher=" + Session["ENTID"].ToString(), PlatForm_connectstr)
                    && sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=13 where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr))
                {

                    Response.Clear();
                    Response.Write("开始交易操作成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("开始交易操作失败！");
                }
            }
            else if (OperateType.Equals("CompleteDeal"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=14 where UserTaskID=" + Request["TaskID"].ToString() + " and Publisher=" + Session["ENTID"].ToString(), PlatForm_connectstr)
                    && sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=14 where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr))
                {

                    Response.Clear();
                    Response.Write("确认交易完成操作成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("确认交易完成操作失败！");
                }
            }
            else if (OperateType.Equals("ExecuteTask"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=15 where UserTaskID=" + Request["TaskID"].ToString() + " and Publisher=" + Session["ENTID"].ToString(), PlatForm_connectstr)
                     && sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=15 where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr))
                {

                    Response.Clear();
                    Response.Write("确认任务执行中操作成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("确认任务执行中操作失败！");
                }
            }
            else if (OperateType.Equals("FinishTask"))
            {
                if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from Service_Task where TaskID in( select ID from TaskList where  UserTaskID=" + Request["TaskID"].ToString() + " and Publisher=" + Session["ENTID"].ToString()+") and flag=1"))
                {

                    Response.Clear();
                    Response.Write("任务申请的服务含有未执行完成的服务，操作失败！");

                }
                else
                {
                    if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=15 where UserTaskID=" + Request["TaskID"].ToString() + " and Publisher=" + Session["ENTID"].ToString(), PlatForm_connectstr)
                          && sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=16 where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr))
                    {

                        Response.Clear();
                        Response.Write("确认任务完成操作成功！");
                    }
                    else
                    {
                        Response.Clear();
                        Response.Write("确认任务完成操作失败！");
                    }
                }
            }
            else if (OperateType.Equals("SuspendTask"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=-TaskState where UserTaskID=" + Request["TaskID"].ToString() + " and Publisher=" + Session["ENTID"].ToString(), PlatForm_connectstr))
                {
                    sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=-TaskState where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr);
                    Response.Clear();
                    Response.Write("任务挂起成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("任务挂起失败！");
                }
            }
            else if (OperateType.Equals("UnsuspendTask"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=-TaskState where UserTaskID=" + Request["TaskID"].ToString() + " and Publisher=" + Session["ENTID"].ToString(), PlatForm_connectstr))
                {
                    sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=-TaskState where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr);
                    Response.Clear();
                    Response.Write("任务解除挂起成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("任务解除挂起失败！");
                }
            }
            else if (OperateType.Equals("RefreshTaskState"))
            {


            }
            else if (OperateType.Equals("Tag_LocalTask"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TypeID=1 where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr))
                {
                    Response.Clear();
                    Response.Write("本地任务标记成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("本地任务标记失败！");
                }
            }
            else if (OperateType.Equals("Tag_OutSource"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TypeID=2 where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr))
                {
                    Response.Clear();
                    Response.Write("外协任务标记成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("外协任务标记失败！");
                }
            }
            else if (OperateType.Equals("AgreePublish"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=1 where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr))
                {
                    Response.Clear();
                    Response.Write("同意发布操作成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("同意发布操作失败！");
                }
            }
            else if (OperateType.Equals("NoAgreePublish"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=23 where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr))
                {
                    Response.Clear();
                    Response.Write("拒绝发布操作成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("拒绝发布操作失败！");
                }
            }
            else if (OperateType.Equals("AgreeBuy"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=6 where UserTaskID=" + Request["TaskID"].ToString() + " and Publisher=" + Session["ENTID"].ToString(), PlatForm_connectstr)
                    && sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=6 where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr))
                {
                    Response.Clear();
                    Response.Write("同意购买操作成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("同意购买操作失败！");
                }
            }
            else if (OperateType.Equals("NoAgreeBuy"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=24 where UserTaskID=" + Request["TaskID"].ToString() + " and Publisher=" + Session["ENTID"].ToString(), PlatForm_connectstr)
                    && sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=24 where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr))
                {
                    Response.Clear();
                    Response.Write("拒绝购买操作成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("拒绝购买操作失败！");
                }
            }
            else if (OperateType.Equals("ReleaseBinding"))
            {
                bool flag = true;
                string[] TaskIDs = Request["TaskID"].ToString().Split(',');
                string sql = "";
                foreach (string TaskID in TaskIDs)
                {
                    sql = "Set ARITHABORT ON update workflow set workflow.modify('delete /mxGraphModel/root/Rect/mxCell[@taskID=\"" + TaskID + "\"]/@taskID') where ID=(select WorkFlowID from TaskList where TaskID=" + TaskID + ")";

                    if (!sqlExecute.sqlmanage.ExecuteSQL(new StringBuilder().Append(sql).ToString(), connectstr))
                    {
                        flag = false;
                    }
                }


                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set WorkFlowID=-1 where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr) && flag)
                {
                    Response.Clear();
                    Response.Write("任务解除绑定成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("任务解除绑定失败！");
                }
            }
        }
        else
            Response.Write("{success:true,msg:'任务创建失败！'}");
    }

}