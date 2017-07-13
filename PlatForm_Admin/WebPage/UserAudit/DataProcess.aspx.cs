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
                        if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select UserType from UserInfor where UserType=0 and UserID=" + UserID))//�������ҵ�û�
                        {
                            string localDatabase = sqlExecute.sqlmanage.GetUniqueRecord("select localDatabase from UserInfor where UserID=" + UserID, PlatForm_connectstr, new string[] { "localDatabase" });
                            if (localDatabase.Equals("1"))//���ء����û��������ݿ����ƽ̨
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
                        string msg = "���" + userInf.Split(',')[1] + "������ͨ����ƽ̨����ˣ�����������ѯƽ̨�ͷ�������ʹ��IE�����������ʹ�����ļ���ģʽ";
                        ClassLibrary1.WebCloudSendMsg.MySendMsg.sendMsg(userInf.Split(',')[0].Trim(), msg, "-1", Session["userID"].ToString(), "-1", userInf.Split(',')[2].Trim());
                        // sendmail.SendSMTPEMail(userInf.Split(',')[0], "��ƽ̨���ͨ��֪ͨ", msg);

                    }
                    Response.Clear();
                    Response.Write("�û����ͨ�������ɹ���");
                }
                else
                {
                    Response.Clear();
                    Response.Write("�û����ͨ������ʧ�ܣ�");
                }
            }
            else if (OperateType.Equals("NoPassAudit"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  UserInfor set UserState=2,OperateTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where UserID in (" + Request["UserID"].ToString() + ")", PlatForm_connectstr))
                {
                    string[] userInfs = sqlExecute.sqlmanage.GetUniqueRecord("select userName,Telephone,UserID from UserInfor where UserID in (" + Request["UserID"].ToString() + ")", PlatForm_connectstr, new string[] { "Telephone", "userName", "UserID" }).Split('|');
                    foreach (string userInf in userInfs)
                    {
                        string msg = "���" + userInf.Split(',')[1] + "����δͨ����ƽ̨����ˣ���ͨ��ԭ��" + Request["Message"].ToString() + "������������ѯƽ̨�ͷ������ǻᾡ�촦��";
                        ClassLibrary1.WebCloudSendMsg.MySendMsg.sendMsg(userInf.Split(',')[0].Trim(), msg, "-1", Session["userID"].ToString(), "-1", userInf.Split(',')[2].Trim());

                    }
                    Response.Clear();
                    Response.Write("�û������ͨ�������ɹ���");
                }
                else
                {
                    Response.Clear();
                    Response.Write("�û������ͨ������ʧ�ܣ�");
                }
            }
            else if (OperateType.Equals("ForbideUser"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  UserInfor set UserState=-UserState,OperateTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where UserID in (" + Request["UserID"].ToString() + ")", PlatForm_connectstr))
                {
                    string[] userInfs = sqlExecute.sqlmanage.GetUniqueRecord("select userName,Telephone,UserID from UserInfor where UserID in (" + Request["UserID"].ToString() + ")", PlatForm_connectstr, new string[] { "Telephone", "userName", "UserID" }).Split('|');
                    foreach (string userInf in userInfs)
                    {
                        string msg = "���" + userInf.Split(',')[1] + "��������ƽ̨�˻��ѱ����ã�����ԭ��" + Request["Message"].ToString() + "������������ѯƽ̨�ͷ������ǻᾡ�촦��";
                        ClassLibrary1.WebCloudSendMsg.MySendMsg.sendMsg(userInf.Split(',')[0].Trim(), msg, "-1", Session["userID"].ToString(), "-1", userInf.Split(',')[2].Trim());

                    }
                    Response.Clear();
                    Response.Write("�û����ò����ɹ���");
                }
                else
                {
                    Response.Clear();
                    Response.Write("�û����ò���ʧ�ܣ�");
                }
            }
            else if (OperateType.Equals("StartUsingUser"))
            {
                if (sqlExecute.sqlmanage.ExecuteSQL("update  UserInfor set UserState=-UserState,OperateTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where UserID in (" + Request["UserID"].ToString() + ")", PlatForm_connectstr))
                {
                    string[] userInfs = sqlExecute.sqlmanage.GetUniqueRecord("select userName,Telephone,UserID from UserInfor where UserID in (" + Request["UserID"].ToString() + ")", PlatForm_connectstr, new string[] { "Telephone", "userName", "UserID" }).Split('|');
                    foreach (string userInf in userInfs)
                    {
                        string msg = "���" + userInf.Split(',')[1] + "��������ƽ̨�˻������ã���������ƽ̨�����Э��,������������ѯƽ̨�ͷ�������ʹ��IE�����������ʹ�����ļ���ģʽ";
                        ClassLibrary1.WebCloudSendMsg.MySendMsg.sendMsg(userInf.Split(',')[0].Trim(), msg, "-1", Session["userID"].ToString(), "-1", userInf.Split(',')[2].Trim());

                    }
                    Response.Clear();
                    Response.Write("�û����ò����ɹ���");
                }
                else
                {
                    Response.Clear();
                    Response.Write("�û����ò���ʧ�ܣ�");
                }
            }
            else if (OperateType.Equals("SendShortMsg"))
            {

                string[] userInfs = sqlExecute.sqlmanage.GetUniqueRecord("select  Telephone,UserID from UserInfor where UserID in (" + Request["UserIDs"].ToString() + ")", PlatForm_connectstr, new string[] { "Telephone", "UserID" }).Split('|');
                string msg = Request["Message"].ToString();
                if (msg.Trim().Equals(""))
                {
                    Response.Write("���ܷ��Ϳ�����!");
                    Response.End();
                    Response.Clear();
                    return;
                }
                else
                {
                    foreach (string userInf in userInfs)
                    {

                        ClassLibrary1.WebCloudSendMsg.MySendMsg.sendMsg(userInf.Split(',')[0].Trim(), "������ƽ̨����Ϣ��" + msg, "-1", Session["userID"].ToString(), "-1", userInf.Split(',')[1].Trim());

                    }
                    Response.Write("���ͳɹ�!");
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
                    Response.Write("��ȷ����!");
                }
                else
                {

                    Response.Write("���Ӵ���!");
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
        //�������ݿ��б���ַ���
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
	[���] [int] IDENTITY(1,1) NOT NULL,
	[��Ŀ���] [varchar](50) NOT NULL,
	[��Ŀ����] [varchar](50) NULL,
	[��Ŀ�ͻ�����] [varchar](50) NULL,
	[��Ŀ״̬] [int] NULL,
	[��Ŀ�ƻ���ʼ����] [nvarchar](30) NULL,
	[��Ŀʵ�ʿ�ʼ����] [nvarchar](30) NULL,
	[��Ŀ�ƻ���������] [nvarchar](30) NULL,
	[��Ŀʵ�ʽ�������] [nvarchar](30) NULL,
	[��Ŀ������] [int] NULL,
	[��Ŀ���] [text] NULL,
	[��Ŀ����] [int] NULL,
	[��������] [datetime] NULL,
	[��Ŀ������] [int] NULL,
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
	[��ԱID] [int] IDENTITY(1,1) NOT NULL,
	[��Ա���] [nvarchar](50) NOT NULL,
	[��Ա����] [varchar](20) NOT NULL,
	[�Ա�] [char](2) NULL,
	[��������] [varchar](20) NULL,
	[ѧ��] [varchar](10) NULL,
	[�ƶ��绰] [varchar](20) NULL,
	[�̶��绰] [varchar](20) NULL,
	[Email] [varchar](50) NULL,
	[QQ��] [varchar](20) NULL,
	[ͨѶ��ַ] [varchar](50) NULL,
	[��������] [varchar](20) NULL,
	[��������] [varchar](50) NULL,
	[������ɫ] [varchar](20) NULL,
	[�ڶ���ɫ] [varchar](20) NULL,
	[������] [varchar](20) NULL,
	[��ѵ���] [varchar](50) NULL,
	[����] [nvarchar](50) DEFAULT ((111111)) NULL,
	[���ʱ��] [nvarchar](50) NULL,
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
	[���ű��] [varchar](20) NOT NULL,
	[��������] [varchar](50) NOT NULL,
	[�ϼ�����] [varchar](20) NULL,
	[ְ������] [ntext] NULL
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
insert into  [TaskType] ([TypeID],[TypeName]) values (1,'����');
insert into  [TaskType] ([TypeID],[TypeName]) values (2,'��Э');
insert into  [ProjectType] ([TypeText]) values ('��ҵЭ����');
insert into  [ProjectType] ([TypeText]) values ('�ڲ���Ŀ');
insert into  [DeptList] ([���ű��],[��������]) values ('10001','�ɶ����');
insert into  [DeptList] ([���ű��],[��������],[�ϼ�����]) values ('10002','���»�','10001');
insert into  [DeptList] ([���ű��],[��������],[�ϼ�����]) values ('10003','���»�','10002');
insert into  [DeptList] ([���ű��],[��������],[�ϼ�����]) values ('10004','���»�����','10002');
insert into  [DeptList] ([���ű��],[��������],[�ϼ�����]) values ('10005','�ܾ���','10002');
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