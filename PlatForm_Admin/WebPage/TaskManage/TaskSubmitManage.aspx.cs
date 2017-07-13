using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;

public partial class PDM_TaskManage_Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
       // SendEMail.SendMail sendmail = new SendEMail.SendMail(Session["MailsmtpServer"].ToString(), Session["MailFrom"].ToString(), Session["MailPassWord"].ToString());
        //string userName = Session["username"].ToString();
        //string connectstr = Session["connectstr"].ToString();
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();

            if (OperateType.Equals("DeleteTask"))
            {
                if (MoveTask(Request["TaskID"].ToString(), PlatForm_connectstr))
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
            if (OperateType.Equals("DeleteWorkFlow"))
            {
                if (MoveWorkFlow(Request["WorkFlowID"].ToString(), PlatForm_connectstr))
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
            else if (OperateType.Equals("ConfirmPass"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=4,OperateTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where ID in (" + Request["TaskID"].ToString() + ")", PlatForm_connectstr))
                {
                    string[] userInfs = sqlExecute.sqlmanage.GetUniqueRecord("select TaskName,userName,Telephone,UserID from TaskList,UserInfor where TaskList.Publisher=UserInfor.UserID and ID in (" + Request["TaskID"].ToString() + ")", PlatForm_connectstr, new string[] { "Telephone", "userName", "TaskName", "UserID" }).Split('|');
                    foreach (string userInf in userInfs)
                    {
                        string msg = "你好" + userInf.Split(',')[1] + "，您企业发布的[" + userInf.Split(',')[2] + "]任务已通过云平台的审核。";
                        ClassLibrary1.WebCloudSendMsg.MySendMsg.sendMsg(userInf.Split(',')[0].Trim(), msg, "-1", Session["userID"].ToString(),  "-1",userInf.Split(',')[3].Trim());
                       // sendmail.SendSMTPEMail(userInf.Split(',')[0], "云平台任务审核通过通知", msg);

                    }
                    Response.Clear();
                    Response.Write("任务审核成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("任务审核失败！");
                }
            }
            else if (OperateType.Equals("CompleteDeal"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=14,OperateTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where ID in (" + Request["TaskID"].ToString() + ")", PlatForm_connectstr))
                {
                    string[] userInfs = sqlExecute.sqlmanage.GetUniqueRecord("select TaskName,userName,Telephone,UserID from TaskList,UserInfor where TaskList.Publisher=UserInfor.UserID and ID in (" + Request["TaskID"].ToString() + ")", PlatForm_connectstr, new string[] { "Telephone", "userName", "TaskName", "UserID" }).Split('|');
                    foreach (string userInf in userInfs)
                    {
                        string msg = "你好" + userInf.Split(',')[1] + "，您企业发布的[" + userInf.Split(',')[2] + "]任务平台已确认交易完成。如有疑问请与平台联系。";
                        ClassLibrary1.WebCloudSendMsg.MySendMsg.sendMsg(userInf.Split(',')[0].Trim(), msg, "-1", Session["userID"].ToString(), "-1", userInf.Split(',')[3].Trim());
                        //  sendmail.SendSMTPEMail(userInf.Split(',')[0], "云平台任务审核不通过通知", msg);

                    }
                    Response.Clear();
                    Response.Write("确认交易完成成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("确认交易完成失败！");
                }
            }
            else if (OperateType.Equals("RefusePass"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=5,OperateTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where ID in (" + Request["TaskID"].ToString() + ")", PlatForm_connectstr))
                {
                    string[] userInfs = sqlExecute.sqlmanage.GetUniqueRecord("select TaskName,userName,Telephone,UserID from TaskList,UserInfor where TaskList.Publisher=UserInfor.UserID and ID in (" + Request["TaskID"].ToString() + ")", PlatForm_connectstr, new string[] { "Telephone", "userName", "TaskName", "UserID" }).Split('|');
                    foreach (string userInf in userInfs)
                    {
                        string msg = "你好" + userInf.Split(',')[1] + "，您企业发布的[" + userInf.Split(',')[2] + "]任务未通过云平台的审核，原因：" + Request["Message"].ToString() + "。如有疑问请与平台联系。";
                        ClassLibrary1.WebCloudSendMsg.MySendMsg.sendMsg(userInf.Split(',')[0].Trim(), msg,"-1", Session["userID"].ToString(),  "-1",userInf.Split(',')[3].Trim());
                      //  sendmail.SendSMTPEMail(userInf.Split(',')[0], "云平台任务审核不通过通知", msg);

                    }
                    MoveTask(Request["TaskID"].ToString(), PlatForm_connectstr);
                    Response.Clear();
                    Response.Write("任务审核不通过成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("任务审核不通过失败！");
                }
            }
            else if (OperateType.Equals("WorkFlow_ConfirmPass"))
            {

                if (sqlExecute.sqlmanage.ExecuteSQL("update  WorkFlow set WFState=11,OperateTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where ID in (" + Request["WFlowID"].ToString() + ");update  TaskList set TaskState=4,OperateTime='" + DateTime.Now.ToString() + "' where WorkFlowID in (" + Request["WFlowID"].ToString() + ")", PlatForm_connectstr))
                {
                    string[] userInfs = sqlExecute.sqlmanage.GetUniqueRecord("select TaskName,userName,Telephone,UserID from TaskList,UserInfor where TaskList.Publisher=UserInfor.UserID and ID in (" + Request["TaskID"].ToString() + ")", PlatForm_connectstr, new string[] { "Telephone", "userName", "TaskName", "UserID" }).Split('|');
                    foreach (string userInf in userInfs)
                    {
                        string msg = "你好" + userInf.Split(',')[1] + "，您企业发布的[" + userInf.Split(',')[2] + "]流程任务已通过云平台的审核，如有疑问请与平台联系。";
                        ClassLibrary1.WebCloudSendMsg.MySendMsg.sendMsg(userInf.Split(',')[0].Trim(), msg,"-1", Session["userID"].ToString(),  "-1",userInf.Split(',')[3].Trim());
                        //sendmail.SendSMTPEMail(userInf.Split(',')[0], "云平台流程审核通过通知", msg);

                    }
                    Response.Clear();
                    Response.Write("流程审核成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("流程审核失败！");
                }
            }
            else if (OperateType.Equals("WorkFlow_RefusePass"))
            {

                if (sqlExecute.sqlmanage.ExecuteSQL("update  WorkFlow set WFState=10,OperateTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where ID in (" + Request["WFlowID"].ToString() + ");update  TaskList set TaskState=5,OperateTime='" + DateTime.Now.ToString() + "' where WorkFlowID in (" + Request["WFlowID"].ToString() + ")", PlatForm_connectstr))
                {
                    string[] userInfs = sqlExecute.sqlmanage.GetUniqueRecord("select TaskName,userName,Telephone,UserID from TaskList,UserInfor where TaskList.Publisher=UserInfor.UserID and ID in (" + Request["TaskID"].ToString() + ")", PlatForm_connectstr, new string[] { "Telephone", "userName", "TaskName", "UserID" }).Split('|');
                    foreach (string userInf in userInfs)
                    {
                        string msg = "你好" + userInf.Split(',')[1] + "，您企业发布的[" + userInf.Split(',')[2] + "]流程任务未通过云平台的审核，原因：" + Request["Message"].ToString() + "。如有疑问请与平台联系。";
                        ClassLibrary1.WebCloudSendMsg.MySendMsg.sendMsg(userInf.Split(',')[0].Trim(), msg, "-1", Session["userID"].ToString(), "-1",userInf.Split(',')[3].Trim());
                       // sendmail.SendSMTPEMail(userInf.Split(',')[0], "云平台流程审核不通过通知", msg);

                    }
                    MoveWorkFlow(Request["WFlowID"].ToString(), PlatForm_connectstr);
                    Response.Clear();
                    Response.Write("流程审核不通过成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("流程审核不通过失败！");
                }
            }
        }
        else
            Response.Write("{success:true,msg:'任务创建失败！'}");
        Response.End();
    }
    /// <summary>
    /// 
    /// </summary>
    /// <param name="TaskIDs">TaskID,TaskID</param>
    /// <returns></returns>
    bool MoveTask(string TaskIDs, string PlatForm_connectstr)
    {
        string RemoveSql = "insert into TaskList_Backup " +
    " ( UserTaskID, Publisher, PublishTime, TaskDetailInf, ActualStartDate, TaskState, ActualEndtDate, WorkFlowID, CreatorID, FileName, TaskName, TDeleteTime)  " +
    "(select  UserTaskID, Publisher, PublishTime, TaskDetailInf, ActualStartDate, TaskState, ActualEndtDate, WorkFlowID, CreatorID, FileName, TaskName,'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' from TaskList where ID in (" + TaskIDs + ")) ;" +
    " delete from TaskList where ID in  (" + TaskIDs + ") ";
        try
        {
            if (sqlExecute.sqlmanage.ExecuteSQL(RemoveSql, PlatForm_connectstr))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        catch (Exception e)
        {
            return false;
        }

    }
    bool MoveWorkFlow(string WorkFlowIDs, string PlatForm_connectstr)
    {
        bool flag = true;
        try
        {
            string[] WorkFlowID = WorkFlowIDs.Split(',');
            foreach (string ID in WorkFlowID)
            {
                string RemoveTaskSql = "insert into WorkFlow_Backup " +
                 " ( UserWorkFlowID, WorkFlow, Publisher, PublishTime, WFState, WorkFlowName, WDeleteTime)  " +
                 "(select  UserWorkFlowID, WorkFlow, Publisher, PublishTime, WFState, WorkFlowName,'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' from WorkFlow where ID=" + ID + ") ;" +
                 "insert into TaskList_Backup " +
                " ( UserTaskID, Publisher, PublishTime, TaskDetailInf, ActualStartDate, TaskState, ActualEndtDate, WorkFlowID, CreatorID, FileName, TaskName, TDeleteTime)  " +
                "(select  UserTaskID, Publisher, PublishTime, TaskDetailInf, ActualStartDate, TaskState, ActualEndtDate,(SELECT IDENT_CURRENT('WorkFlow_Backup')), CreatorID, FileName, TaskName,'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' from TaskList where WorkFlowID=" + ID + ");" +
                " delete from TaskList where WorkFlowID=" + ID + " ;" +
                " delete from WorkFlow where ID=" + ID + " ;";
                if (!sqlExecute.sqlmanage.ExecuteSQL(RemoveTaskSql, PlatForm_connectstr))
                {
                    flag = false;
                }
            }

        }
        catch (Exception e)
        {
            flag = false;
        }
        return flag;

    }
}