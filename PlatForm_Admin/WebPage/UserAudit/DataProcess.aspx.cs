using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Configuration;
using System.IO;


public partial class PlatForm_Admin_WebPage_UserAudit_DataProcess : System.Web.UI.Page
{

    protected void Page_Load(object sender, EventArgs e)
    {
        string PreIndex = ConfigurationManager.AppSettings["PreIndex"];
        //  myserver = ConfigurationManager.AppSettings["myserver"];
        // SendEMail.SendMail sendmail = new SendEMail.SendMail(Session["MailsmtpServer"].ToString(), Session["MailFrom"].ToString(), Session["MailPassWord"].ToString());
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();
            if (OperateType.Equals("PassAudit"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  UserInfor set UserState=1,OperateTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where UserID in (" + Request["UserID"].ToString() + ")", PlatForm_connectstr))
                {
                    // SendEMail.SendMail sendmail = new SendEMail.SendMail("smtp.sina.com", "world745420@sina.com", "13508901");
                    string[] UserIDS = Request["UserID"].ToString().Split(',');
                    foreach (string UserID in UserIDS)
                    {
                        if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select UserType from UserInfor where UserType=0 and UserID=" + UserID))//如果是企业用户
                        {
                            string localDatabase = sqlExecute.sqlmanage.GetUniqueRecord("select localDatabase from UserInfor where UserID=" + UserID, PlatForm_connectstr, new string[] { "localDatabase" });
                            if (localDatabase.Equals("1"))//本地——用户不把数据库放在平台
                            {
                                string[] UserDataBaseInf = sqlExecute.sqlmanage.GetUniqueRecord("select * from UserInfor where UserID=" + UserID, PlatForm_connectstr, new string[] { "DataBaseName", "DataBaseUserID", "DataBasePwd", "DataBaseServer", "userName" }).Split(',');
                                if (CreateDataBase(UserDataBaseInf[0], UserDataBaseInf[1], UserDataBaseInf[2], UserDataBaseInf[3]))
                                {

                                    Directory.CreateDirectory(Server.MapPath("~/UpLoadFiles/") + UserDataBaseInf[4].Trim());

                                }
                            }
                            else
                            {
                                string userName = sqlExecute.sqlmanage.GetUniqueRecord("select userName from UserInfor where UserID=" + UserID, PlatForm_connectstr, new string[] { "userName" });
                                if (CreateDataBase(PreIndex + userName, PlatForm_connectstr))
                                {

                                    Directory.CreateDirectory(Server.MapPath("~/UpLoadFiles/") + userName);

                                }
                            }
                        }

                    }
                    string[] userInfs = sqlExecute.sqlmanage.GetUniqueRecord("select userName,Telephone,UserID from UserInfor where UserID in (" + Request["UserID"].ToString() + ")", PlatForm_connectstr, new string[] { "Telephone", "userName", "UserID" }).Split('|');
                    foreach (string userInf in userInfs)
                    {
                        string msg = "你好" + userInf.Split(',')[1] + "，您已通过云平台的审核，如有疑问咨询平台客服。建议使用IE浏览器，并且使用它的兼容模式";
                        ClassLibrary1.WebCloudSendMsg.MySendMsg.sendMsg(userInf.Split(',')[0].Trim(), msg, "-1", Session["userID"].ToString(), "-1", userInf.Split(',')[2].Trim());
                        // sendmail.SendSMTPEMail(userInf.Split(',')[0], "云平台审核通过通知", msg);

                    }
                    Response.Clear();
                    Response.Write("用户审核通过操作成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("用户审核通过操作失败！");
                }
            }
            else if (OperateType.Equals("NoPassAudit"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  UserInfor set UserState=2,OperateTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where UserID in (" + Request["UserID"].ToString() + ")", PlatForm_connectstr))
                {
                    string[] userInfs = sqlExecute.sqlmanage.GetUniqueRecord("select userName,Telephone,UserID from UserInfor where UserID in (" + Request["UserID"].ToString() + ")", PlatForm_connectstr, new string[] { "Telephone", "userName", "UserID" }).Split('|');
                    foreach (string userInf in userInfs)
                    {
                        string msg = "你好" + userInf.Split(',')[1] + "，您未通过云平台的审核，不通过原因：" + Request["Message"].ToString() + "。如有疑问咨询平台客服，我们会尽快处理";
                        ClassLibrary1.WebCloudSendMsg.MySendMsg.sendMsg(userInf.Split(',')[0].Trim(), msg, "-1", Session["userID"].ToString(), "-1", userInf.Split(',')[2].Trim());

                    }
                    Response.Clear();
                    Response.Write("用户不审核通过操作成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("用户不审核通过操作失败！");
                }
            }
            else if (OperateType.Equals("ForbideUser"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  UserInfor set UserState=-UserState,OperateTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where UserID in (" + Request["UserID"].ToString() + ")", PlatForm_connectstr))
                {
                    string[] userInfs = sqlExecute.sqlmanage.GetUniqueRecord("select userName,Telephone,UserID from UserInfor where UserID in (" + Request["UserID"].ToString() + ")", PlatForm_connectstr, new string[] { "Telephone", "userName", "UserID" }).Split('|');
                    foreach (string userInf in userInfs)
                    {
                        string msg = "你好" + userInf.Split(',')[1] + "，您的云平台账户已被禁用，禁用原因：" + Request["Message"].ToString() + "。如有疑问咨询平台客服，我们会尽快处理";
                        ClassLibrary1.WebCloudSendMsg.MySendMsg.sendMsg(userInf.Split(',')[0].Trim(), msg, "-1", Session["userID"].ToString(), "-1", userInf.Split(',')[2].Trim());

                    }
                    Response.Clear();
                    Response.Write("用户禁用操作成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("用户禁用操作失败！");
                }
            }
            else if (OperateType.Equals("StartUsingUser"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  UserInfor set UserState=-UserState,OperateTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where UserID in (" + Request["UserID"].ToString() + ")", PlatForm_connectstr))
                {
                    string[] userInfs = sqlExecute.sqlmanage.GetUniqueRecord("select userName,Telephone,UserID from UserInfor where UserID in (" + Request["UserID"].ToString() + ")", PlatForm_connectstr, new string[] { "Telephone", "userName", "UserID" }).Split('|');
                    foreach (string userInf in userInfs)
                    {
                        string msg = "你好" + userInf.Split(',')[1] + "，您的云平台账户已启用，请遵守云平台的相关协议,如有疑问请咨询平台客服。建议使用IE浏览器，并且使用它的兼容模式";
                        ClassLibrary1.WebCloudSendMsg.MySendMsg.sendMsg(userInf.Split(',')[0].Trim(), msg, "-1", Session["userID"].ToString(), "-1", userInf.Split(',')[2].Trim());

                    }
                    Response.Clear();
                    Response.Write("用户启用操作成功！");
                }
                else
                {
                    Response.Clear();
                    Response.Write("用户启用操作失败！");
                }
            }
            else if (OperateType.Equals("SendShortMsg"))
            {

                string[] userInfs = sqlExecute.sqlmanage.GetUniqueRecord("select  Telephone,UserID from UserInfor where UserID in (" + Request["UserIDs"].ToString() + ")", PlatForm_connectstr, new string[] { "Telephone", "UserID" }).Split('|');
                string msg = Request["Message"].ToString();
                if (msg.Trim().Equals(""))
                {
                    Response.Write("不能发送空内容!");
                    Response.End();
                    Response.Clear();
                    return;
                }
                else
                {
                    foreach (string userInf in userInfs)
                    {

                        ClassLibrary1.WebCloudSendMsg.MySendMsg.sendMsg(userInf.Split(',')[0].Trim(), "来自云平台的信息：" + msg, "-1", Session["userID"].ToString(), "-1", userInf.Split(',')[1].Trim());

                    }
                    Response.Write("发送成功!");
                    Response.End();
                    Response.Clear();
                }


            }
            else if (OperateType.Equals("CheckLink"))
            {
                string[] userInfs = sqlExecute.sqlmanage.GetUniqueRecord("select * from UserInfor where UserID in (" + Request["UserID"].ToString() + ")", PlatForm_connectstr, new string[] { "DataBaseServer", "DataBaseUserID", "DataBasePwd" }).Split(',');
                string CheckDatabaseLink = "server=" + userInfs[0] + ";User ID=" + userInfs[1] + ";Password=" + userInfs[2] + ";";
                if (CheckConnection(CheckDatabaseLink))
                {
                    Response.Write("正确连接!");
                }
                else
                {

                    Response.Write("连接错误!");
                }
                Response.End();
                Response.Clear();


            }
        }
    }
    bool CheckConnection(string Link)
    {
        SqlConnection con = new SqlConnection(Link);
        try
        {
            con.Open();
            return true;
        }
        catch (Exception err)
        {
            return false;
        }
        finally
        {
            con.Close();
        }

    }
    public bool CreateDataBase(string hosid, string userID, string pwd, string dataBaseLink)
    {
        string cmdText = "if exists(select * from sys.databases where name='" + hosid + "') drop database " + hosid + " create " +
            "database " + hosid + ";ALTER DATABASE [" + hosid + "] SET COMPATIBILITY_LEVEL = 80";
        try
        {
            using (SqlConnection con = new SqlConnection("server=" + dataBaseLink + ";User ID=" + userID + ";Password=" + pwd + ";"))
            {
                con.Open();
                SqlCommand cmd = new SqlCommand(cmdText, con);
                cmd.ExecuteScalar();
                Createtable("server=" + dataBaseLink + ";Initial Catalog=" + hosid + ";User ID=" + userID + ";Password=" + pwd + ";");
                con.Close();
                return true;
            }
        }
        catch (Exception err)
        {
            return false;
        }
    }
    public bool CreateDataBase(string hosid, string ConStr)
    {

        string cmdText = "if exists(select * from sys.databases where name='" + hosid + "') drop database " + hosid + " create " +
            "database " + hosid + ";ALTER DATABASE [" + hosid + "] SET COMPATIBILITY_LEVEL = 80";

        try
        {
            using (SqlConnection con = new SqlConnection(ConStr))
            {
                con.Open();
                SqlCommand cmd = new SqlCommand(cmdText, con);
                cmd.ExecuteScalar();
                Createtable("server=" + ConfigurationManager.AppSettings["myserver"] + ";Initial Catalog=" + hosid + ";User ID=sa;Password=zju308;");
                con.Close();
                return true;
            }
        }
        catch (Exception err)
        {
            return false;
        }
    }
    public bool Createtable(string link)
    {
        //创建数据库中表的字符串
        #region


        string cmdText1 = @"CREATE TABLE [dbo].[WorkFlowState](
	[StateID] [int] NULL,
	[StateName] [nvarchar](50) NULL,
	[ColorValue] [nvarchar](20) NULL
) 
CREATE TABLE [dbo].[workflow](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](50) NULL,
	[creator] [int] NULL,
	[createtime] [nvarchar](30) NULL,
	[endtime] [nvarchar](30) NULL,
	[workflow] [xml] NULL,
	[State] [nvarchar](50) DEFAULT ((0)) NULL,
	[ProjectID] [int] NULL,
	[ActualEndtime] [nvarchar](30) NULL
)

CREATE TABLE [dbo].[TaskType](
	[TypeID] [int] NULL,
	[TypeName] [nvarchar](50) NULL
) 

CREATE TABLE [dbo].[TaskState](
	[TaskStateID] [int] NULL,
	[TaskStateName] [nvarchar](50) NULL,
	[ColorValue] [nvarchar](20) NULL
) 

CREATE TABLE [dbo].[TaskList](
	[TaskID] [int] IDENTITY(1,1) NOT NULL,
	[TaskDetailInf] [xml] NULL,
	[BelongProjectTreeNode] [int] NULL,
	[BelongProject] [int] NULL,
	[TaskState] [int] NULL,
	[TaskCreateDate] [nvarchar](50) NULL,
	[WorkFlowID] [int] DEFAULT ((-1)) NULL,
	[FileName] [nvarchar](500) DEFAULT ((-1)) NULL,
	[TypeID] [int] DEFAULT ((-1)) NULL
) 

CREATE TABLE [dbo].[RoleList](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NULL,
	[Description] [nvarchar](500) NULL,
	[CreateDate] [nvarchar](50) NULL
) 

CREATE TABLE [dbo].[ProjList](
	[序号] [int] IDENTITY(1,1) NOT NULL,
	[项目编号] [varchar](50) NOT NULL,
	[项目名称] [varchar](50) NULL,
	[项目客户名称] [varchar](50) NULL,
	[项目状态] [int] NULL,
	[项目计划开始日期] [nvarchar](30) NULL,
	[项目实际开始日期] [nvarchar](30) NULL,
	[项目计划结束日期] [nvarchar](30) NULL,
	[项目实际结束日期] [nvarchar](30) NULL,
	[项目负责人] [int] NULL,
	[项目简介] [text] NULL,
	[项目类型] [int] NULL,
	[创建日期] [datetime] NULL,
	[项目创建人] [int] NULL,
) 
CREATE TABLE [dbo].[ProjectType](
	[TypeID] [int] IDENTITY(1,1) NOT NULL,
	[TypeText] [nvarchar](50) NULL,
	[TypeDescribe] [nvarchar](50) NULL,
	[AddTime] [nvarchar](30) NULL
) 

CREATE TABLE [dbo].[ProjectTaskTree](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ParentID] [int] NULL,
	[Name] [nvarchar](50) NULL,
	[CreateDate] [nvarchar](25) NULL,
	[Creator] [int] NULL,
	[Chargor] [int] NULL,
	[ProjectID] [int] NULL
) 
CREATE TABLE [dbo].[ProjectState](
	[StateID] [int] NOT NULL,
	[StateText] [nvarchar](50) NULL,
	[StateDescribe] [nvarchar](50) NULL
) 

CREATE TABLE [dbo].[EmployeeList](
	[人员ID] [int] IDENTITY(1,1) NOT NULL,
	[人员编号] [nvarchar](50) NOT NULL,
	[人员名称] [varchar](20) NOT NULL,
	[性别] [char](2) NULL,
	[出生年月] [varchar](20) NULL,
	[学历] [varchar](10) NULL,
	[移动电话] [varchar](20) NULL,
	[固定电话] [varchar](20) NULL,
	[Email] [varchar](50) NULL,
	[QQ号] [varchar](20) NULL,
	[通讯地址] [varchar](50) NULL,
	[进厂日期] [varchar](20) NULL,
	[归属部门] [varchar](50) NULL,
	[归属角色] [varchar](20) NULL,
	[第二角色] [varchar](20) NULL,
	[档案号] [varchar](20) NULL,
	[培训情况] [varchar](50) NULL,
	[密码] [nvarchar](50) DEFAULT ((111111)) NULL,
	[添加时间] [nvarchar](50) NULL,
	[StyleSheet] [nvarchar](350) NULL,
	[Microblog] [nvarchar](40) NULL,
) 
CREATE TABLE [dbo].[LoginLog](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[LoginIP] [varchar](100) NULL,
	[LoginTime] [varchar](50) NULL,
	[UserID] [int] NULL
) 
CREATE TABLE [dbo].[DeptList](
	[部门编号] [varchar](20) NOT NULL,
	[部门名称] [varchar](50) NOT NULL,
	[上级部门] [varchar](20) NULL,
	[职能描述] [ntext] NULL
) 
CREATE TABLE [dbo].[Task_Service](
	[TaskID] [int] NULL,
	[ServiceID] [nvarchar](50) NULL,
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Flag] [int] NULL,
	[AddTime] [nvarchar](30) NULL,
	[ApplyTime] [nvarchar](30) NULL,
	[PrjAuditTime] [nvarchar](30) NULL,
	[EntAuditTime] [nvarchar](30) NULL,
	[DealDate] [nvarchar](30) NULL,
	[FinDate] [nvarchar](30) NULL,
	[ServiceName] [nvarchar](500) NULL,
	[Price] [real] DEFAULT ((0)) NULL
)
insert into  [TaskType] ([TypeID],[TypeName]) values (1,'本地');
insert into  [TaskType] ([TypeID],[TypeName]) values (2,'外协');
insert into  [ProjectType] ([TypeText]) values ('企业协作型');
insert into  [ProjectType] ([TypeText]) values ('内部项目');
insert into  [DeptList] ([部门编号],[部门名称]) values ('10001','股东大会');
insert into  [DeptList] ([部门编号],[部门名称],[上级部门]) values ('10002','董事会','10001');
insert into  [DeptList] ([部门编号],[部门名称],[上级部门]) values ('10003','监事会','10002');
insert into  [DeptList] ([部门编号],[部门名称],[上级部门]) values ('10004','董事会秘书','10002');
insert into  [DeptList] ([部门编号],[部门名称],[上级部门]) values ('10005','总经理','10002');
";
        string cmdText2 = @"CREATE VIEW [dbo].[PrjTaskName]
AS
SELECT     dbo.ProjectTaskTree.Name AS TaskName, dbo.TaskList.TaskID AS PTaskID, dbo.TaskList.TaskDetailInf
FROM         dbo.ProjectTaskTree INNER JOIN
                      dbo.TaskList ON dbo.ProjectTaskTree.ID = dbo.TaskList.BelongProjectTreeNode
";
        #endregion
        try
        {
            using (SqlConnection con = new SqlConnection(link))
            {
                con.Open();
                SqlCommand cmd = new SqlCommand(cmdText1, con);
                cmd.ExecuteScalar();
                SqlCommand cmd1 = new SqlCommand(cmdText2, con);
                cmd1.ExecuteScalar();
  con.Close();
                return true;
            }
        }
        catch (Exception err)
        {
            return false;
        }

    }
}