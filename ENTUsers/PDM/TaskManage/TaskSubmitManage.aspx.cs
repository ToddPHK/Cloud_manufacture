using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using System.Data.SqlClient;
using System.Data;

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

            if (OperateType.Equals("DeleteTask"))
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

            else if (OperateType.Equals("ApplyPublish"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=1 where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr))
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

            else if (OperateType.Equals("RefreshTaskStateFServer"))//使用服务器中的任务状态更新用户数据库中的任务状态
            {
                bool flag = true;
                string ENTID = Session["ENTID"].ToString();
                string IDs = "";
                SqlConnection con = new SqlConnection(PlatForm_connectstr);
                SqlCommand cmd = new SqlCommand("(select UserTaskID,TaskState from TaskList where Publisher=" + ENTID + ") union (select UserTaskID,TaskState from TaskList_Backup where Publisher=" + ENTID + ")", con);//parentnode父节点号
                SqlDataAdapter ada = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();
                int counter = ada.Fill(ds, "temptable");
                if (ds != null)
                {
                    foreach (DataRow dr in ds.Tables["temptable"].Rows)
                    {
                        if (!sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=" + dr["TaskState"] + " where TaskID=(" + dr["UserTaskID"] + ")", connectstr))
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
            else if (OperateType.Equals("ConfirmPublish"))
            {
                if (sqlExecute.sqlmanage.HasRecord(connectstr, "select * from TaskList where TaskState<>1 and TaskID  in (" + Request["TaskID"].ToString() + ")"))
                {
                    Response.Clear();
                    Response.Write("所选任务中含有状态不为‘申请发布’的任务");
                    return;

                }
                else
                {
                    Response.Clear();
                    Response.Write(PublishTask(Request["TaskID"].ToString(), connectstr, PlatForm_connectstr, "3"));//服务购买申请通过企业管理员审核后把任务状态设置为“待审核”，即3
                    return;
                }
            }
            else if (OperateType.Equals("RefusePublish"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=2 where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr))
                {
                    string[] userInfs = sqlExecute.sqlmanage.GetUniqueRecord("select ProjectTaskTree.Name as TaskName, ProjectTaskTree.Chargor as UserID,人员名称 as UserName,移动电话 as Telephone from TaskList,EmployeeList,ProjectTaskTree where TaskList.BelongProjectTreeNode=ProjectTaskTree.ID and ProjectTaskTree.Chargor=EmployeeList.人员ID  and TaskList.TaskID in (" + Request["TaskID"].ToString() + ")", connectstr, new string[] { "Telephone", "UserName", "TaskName", "UserID" }).Split('|');
                    foreach (string userInf in userInfs)
                    {
                        string msg = "你好" + userInf.Split(',')[1] + "，您的任务[" + userInf.Split(',')[2] + "]未通过企业管理员的服务发布审核，请及时处理。";
                        ClassLibrary1.WebCloudSendMsg.MySendMsg.sendMsg(userInf.Split(',')[0].Trim(), msg, "-1", Session["ENTID"].ToString(), userInf.Split(',')[3].Trim(), Session["ENTID"].ToString());
                        //System.Threading.Thread.Sleep(10000);
                    }
                    Response.Clear();
                    Response.Write("任务发布拒绝成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("任务发布拒绝失败！");
                }
            }
            else if (OperateType.Equals("ConfirmBuy"))
            {
                //if (TSRelation(Request["TaskID"].ToString(), Session["ENTID"].ToString(), PlatForm_connectstr))
                //{
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=13 where UserTaskID in (" + Request["TaskID"].ToString() + ") and Publisher=" + Session["ENTID"].ToString(), PlatForm_connectstr)
                    && sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=13 where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr))
                {

                    string[] userInfs = sqlExecute.sqlmanage.GetUniqueRecord("select ProjectTaskTree.Name as TaskName, ProjectTaskTree.Chargor as UserID,人员名称 as UserName,移动电话 as Telephone from TaskList,EmployeeList,ProjectTaskTree where TaskList.BelongProjectTreeNode=ProjectTaskTree.ID and ProjectTaskTree.Chargor=EmployeeList.人员ID  and TaskList.TaskID in (" + Request["TaskID"].ToString() + ")", connectstr, new string[] { "Telephone", "UserName", "TaskName", "UserID" }).Split('|');
                    foreach (string userInf in userInfs)
                    {
                        string msg = "你好" + userInf.Split(',')[1] + "，您的任务[" + userInf.Split(',')[2] + "]已通过企业管理员的服务购买审核，请及时处理。";
                        ClassLibrary1.WebCloudSendMsg.MySendMsg.sendMsg(userInf.Split(',')[0].Trim(), msg, "-1", Session["ENTID"].ToString(), userInf.Split(',')[3].Trim(), Session["ENTID"].ToString());
                        //System.Threading.Thread.Sleep(10000);
                    }
                    Response.Clear();
                    Response.Write("同意购买服务成功！");

                }
                else
                {
                    Response.Clear();
                    Response.Write("同意购买服务失败！");
                }
                //}
                //else
                //{
                //    Response.Clear();
                //    Response.Write("系统错误！");
                //}
                //Response.Clear();
                //Response.Write(PublishTask(Request["TaskID"].ToString(), connectstr, PlatForm_connectstr, "10"));//服务购买申请通过企业管理员审核后把任务状态设置为“服务申请中”，即10
                //return;
            }
            else if (OperateType.Equals("RefuseBuy"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=7 where UserTaskID in (" + Request["TaskID"].ToString() + ") and Publisher=" + Session["ENTID"].ToString(), PlatForm_connectstr)
                    && sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=7 where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr))
                {
                    string[] userInfs = sqlExecute.sqlmanage.GetUniqueRecord("select ProjectTaskTree.Name as TaskName, ProjectTaskTree.Chargor as UserID,人员名称 as UserName,移动电话 as Telephone from TaskList,EmployeeList,ProjectTaskTree where TaskList.BelongProjectTreeNode=ProjectTaskTree.ID and ProjectTaskTree.Chargor=EmployeeList.人员ID  and TaskList.TaskID in (" + Request["TaskID"].ToString() + ")", connectstr, new string[] { "Telephone", "UserName", "TaskName", "UserID" }).Split('|');
                    foreach (string userInf in userInfs)
                    {
                        string msg = "你好" + userInf.Split(',')[1] + "，您的任务[" + userInf.Split(',')[2] + "]未通过企业管理员的服务购买审核，请及时处理。";
                        ClassLibrary1.WebCloudSendMsg.MySendMsg.sendMsg(userInf.Split(',')[0].Trim(), msg, "-1", Session["ENTID"].ToString(), userInf.Split(',')[3].Trim(), Session["ENTID"].ToString());
                        //System.Threading.Thread.Sleep(10000);
                    }

                    Response.Clear();
                    Response.Write("任务所需服务购买拒绝成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("任务所需服务购买拒绝失败！");
                }
            }
            else if (OperateType.Equals("SuspendTask"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=-TaskState where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr))
                {
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
                if (sqlExecute.sqlmanage.ExecuteSQL("update  TaskList set TaskState=-TaskState where TaskID in (" + Request["TaskID"].ToString() + ")", connectstr))
                {
                    Response.Clear();
                    Response.Write("任务解除挂起成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("任务解除挂起失败！");
                }
            }
        }
        else
            Response.Write("{success:true,msg:'任务创建失败！'}");
    }
    //public bool TSRelation(string TaskID, string ENTID, string PlatForm_connectstr)
    //{
    //    if (sqlExecute.sqlmanage.ExecuteSQL("insert into Service_Task(ServiceID,TaskID) (select ServiceID,TaskID from Task_Service where TaskID in (select ID from TaskList where UserTaskID in (" + TaskID + ") and Publisher=" + ENTID + "));delete from  Task_Service where TaskID in (select ID from TaskList where UserTaskID in (" + TaskID + ") and Publisher=" + ENTID + ")", PlatForm_connectstr))
    //    {
    //        return true;
    //    }
    //    else
    //    {
    //        return false;
    //    }

    //}
    //public bool SendShortMsg(string TaskID, string connectstr)
    //{
    //    string[] userInfs = sqlExecute.sqlmanage.GetUniqueRecord("select ProjectTaskTree.Name as TaskName,人员名称 as UserName,移动电话 as Telephone from TaskList,EmployeeList,ProjectTaskTree where TaskList.BelongProjectTreeNode=ProjectTaskTree.ID and ProjectTaskTree.Chargor=EmployeeList.人员ID  and TaskList.TaskID in (" + TaskID + ")", connectstr, new string[] { "Telephone", "UserName", "TaskName" }).Split('|');
    //    foreach (string userInf in userInfs)
    //    {
    //        string msg = "你好" + userInf.Split(',')[1] + "，您的任务[" + userInf.Split(',')[2] + "]未通过企业管理员的审核，请及时处理。";
    //        ClassLibrary1.WebCloudSendMsg.MySendMsg.sendMsg(userInf.Split(',')[0].Trim(), msg, Session["userID"].ToString(), Session["ENTID"].ToString(), userInf.Split(',')[2].Trim(), Session["ENTID"].ToString());
    //        //System.Threading.Thread.Sleep(10000);
    //    }
    //    return true;
    //}
    public string PublishTask(string TaskID, string connectstr, string PlatForm_connectstr, string State)
    {

        StringBuilder ErrorTaskMsg = new StringBuilder();
        bool ErrorFlag = false;
        ErrorTaskMsg.Append("任务");
        if (!string.IsNullOrEmpty(TaskID))
        {
            string[] TaskIDs = TaskID.Split(',');
            foreach (string s in TaskIDs)
            {
                string temp = sqlExecute.sqlmanage.GetUniqueRecord("select TaskDetailInf,Name from TaskList,ProjectTaskTree where TaskList.BelongProjectTreeNode=ProjectTaskTree.ID and TaskID=" + s, connectstr, new string[] { "TaskDetailInf", "Name" }).Replace(",", "','");
                string detailsql = " insert into TaskList(UserTaskID,TaskDetailInf,TaskName,PublishTime,TaskState,Publisher) " +
                                     "values ('" + s + "','" + temp + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "','" + State + "','" + Session["userID"].ToString() + "')";

                string sql = "update TaskList set TaskState=" + State + " where TaskID=" + s;
                if (!sqlExecute.sqlmanage.ExecuteSQL(detailsql, PlatForm_connectstr) || !sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
                {
                    ErrorTaskMsg.Append(s + ",");
                    ErrorFlag = true;
                }

            }
            if (ErrorFlag)
            {

                return ErrorTaskMsg.Append("提交失败").ToString().Substring(0, ErrorTaskMsg.Append("提交失败").ToString().Length - 1);
            }
            else
            {
                string[] userInfs = sqlExecute.sqlmanage.GetUniqueRecord("select ProjectTaskTree.Name as TaskName, ProjectTaskTree.Chargor as UserID,人员名称 as UserName,移动电话 as Telephone from TaskList,EmployeeList,ProjectTaskTree where TaskList.BelongProjectTreeNode=ProjectTaskTree.ID and ProjectTaskTree.Chargor=EmployeeList.人员ID  and TaskList.TaskID in (" + TaskID + ")", connectstr, new string[] { "Telephone", "UserName", "TaskName", "UserID" }).Split('|');
                foreach (string userInf in userInfs)
                {
                    string msg = "你好" + userInf.Split(',')[1] + "，您的任务[" + userInf.Split(',')[2] + "]已通过企业管理员的发布审核，请及时处理。";
                    ClassLibrary1.WebCloudSendMsg.MySendMsg.sendMsg(userInf.Split(',')[0].Trim(), msg, "-1", Session["ENTID"].ToString(), userInf.Split(',')[3].Trim(), Session["ENTID"].ToString());
                    //System.Threading.Thread.Sleep(10000);
                }
                return "任务" + TaskID + "的数据发布成功";
            }
        }
        else
        {
            return "请确认已选择任务！";
        }

    }

}