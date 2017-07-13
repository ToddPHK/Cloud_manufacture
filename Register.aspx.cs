using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Data;
using System.IO;
using System.Configuration;

public partial class Register : System.Web.UI.Page
{
    string sql;
    string myserver;
    protected void Page_Load(object sender, EventArgs e)
    {
        myserver = ConfigurationManager.AppSettings["myserver"];
    }
    protected void Registerbtn_Click(object sender, EventArgs e)
    {
        string PreIndex = ConfigurationManager.AppSettings["PreIndex"];
         myserver = ConfigurationManager.AppSettings["myserver"];
        if (ReadContract.Checked != true)
        {
            Response.Write("<Script Language='JavaScript'>alert('请首选阅读《云制造平台使用协议》！')</Script>");
            return;
        }
        string tempconnstr = "server=" + myserver + ";Initial Catalog=CloudMDB;User ID=sa;Password=zju308;connect timeout=30";
        Response.Clear();
        if (!sqlExecute.sqlmanage.HasRecord(tempconnstr, "select * from UserInfor where userName='" + userName.Text.ToString().Trim() + "'"))
        {

            string temp = null;
            string fields = null;
            string CheckDatabaseName = null;
            string CheckDatabaseLink = null;
            string msg = null;
            temp += "'" + userName.Text.ToString().Trim() + "',";
            temp += "'" + pwd.Text.ToString() + "',";
            temp += "'" + telephone.Text.ToString() + "',";
            temp += "'" + address.Text.ToString() + "',";
            temp += "'" + Email.Text.ToString() + "',";
            if (RadioButton1.Checked == true)
            {
                temp += "'1',";
            }
            else
            {
                temp += "'0',";

            }
            if (RadioButton1.Checked == true)
            {
                temp += "'" + DataBaseServe.Text.ToString() + "',";
                temp += "'" + DataBaseName.Text.ToString() + "',";
                temp += "'" + DataBaseUserName.Text.ToString() + "',";
                temp += "'" + DataBasepwd.Text.ToString() + "',";
                CheckDatabaseName = " select * from sys.databases where name='" + DataBaseName.Text.ToString() + "'";
                CheckDatabaseLink = "server=" + DataBaseServe.Text.ToString() + ";User ID=" + DataBaseUserName.Text.ToString() + ";Password=" + DataBasepwd.Text.ToString() + ";";
                msg = "数据库[" + DataBaseUserName.Text.ToString() + "]已存在，请更换其它的名称！";
                fields = "userName,userPass,Telephone,Adress,eMail,localDatabase,DataBaseServer,DataBaseName,DataBaseUserID,DataBasePwd,LocateRegion,BusinessSphere,EntWebSite,Microblog,RegisterIDCard,RegisterRealName,EntFullName,GudingTelephone,RegisterTime";
                if (!CheckConnection(CheckDatabaseLink))
                {
                    Response.Write("<Script Language='JavaScript'>alert('数据库无法连接，不能注册！')</Script>");
                    return;
                }
            }
            else
            {

                CheckDatabaseName = " select * from sys.databases where name='" + userName.Text.ToString() + "'";
                CheckDatabaseLink = tempconnstr;
                msg = "所注册的用户名当前不可用，请使用其它的名称！";
                fields = "userName,userPass,Telephone,Adress,eMail,localDatabase,LocateRegion,BusinessSphere,EntWebSite,Microblog,RegisterIDCard,RegisterRealName,EntFullName,GudingTelephone,RegisterTime";
            }
            temp += "'" + LocateRegion.Text.ToString() + "',";
            temp += "'" + BusinessSphere.Text.ToString().Trim() + "',";
            temp += "'" + Entwebsite.Text.ToString() + "',";
            temp += "'" + Weibo.Text.ToString() + "',";
            temp += "'" + RegisterIDCard.Text.ToString() + "',";
            temp += "'" + RealName.Text.ToString() + "',";
            temp += "'" + EntFullName.Text.ToString() + "',";
            temp += "'" + GudingTelephone.Text.ToString() + "',";
            temp += "'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "'";
            sql = "insert into UserInfor (" + fields + ") values (" + temp + ")";

            if (sqlExecute.sqlmanage.HasRecord(CheckDatabaseLink, CheckDatabaseName))
            {
                Response.Write("<Script Language='JavaScript'>alert('" + msg + "')</Script>");
                return;
            }
            else
            {
                if (UpLoadFileForPlatForm())
                {
                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, tempconnstr))
                    {
                        Response.Write("<Script Language='JavaScript'>alert('注册成功!')</Script>");
                        //if (RadioButton1.Checked == true)//本地
                        //{
                        //    if (CreateDataBase(DataBaseName.Text.ToString(), DataBaseUserName.Text.ToString(), DataBasepwd.Text.ToString(), DataBaseServe.Text.ToString()))
                        //    {
                        //        Response.Write("<Script Language='JavaScript'>alert('注册成功!')</Script>");
                        //        Directory.CreateDirectory(Server.MapPath("~/UpLoadFiles/") + userName.Text.ToString().Trim());
                        //        return;
                        //    }
                        //}
                        //else if (RadioButton2.Checked == true)//平台
                        //{
                        //    if (CreateDataBase(PreIndex+userName.Text.ToString(), tempconnstr))
                        //    {
                        //        Response.Write("<Script Language='JavaScript'>alert('注册成功!')</Script>");
                        //        Directory.CreateDirectory(Server.MapPath("~/UpLoadFiles/") + userName.Text.ToString().Trim());

                        //        return;
                        //    }
                        //}
                    }

                }
                else
                {
                    Response.Write("<Script Language='JavaScript'>alert('注册失败!')</Script>");
                    return;
                }
            }

        }
        else
            Response.Write("<Script Language='JavaScript'>alert('该用户名已存在!')</Script>");
    }
    #region
    /*
    public bool CreateDataBase(string hosid, string userID, string pwd, string dataBaseLink)
    {
        string cmdText = "if exists(select * from sys.databases where name='" + hosid + "') drop database " + hosid + " create " +
            "database " + hosid;
        try
        {
            using (SqlConnection con = new SqlConnection("server=" + dataBaseLink + ";User ID=" + userID + ";Password=" + pwd + ";"))
            {
                con.Open();
                SqlCommand cmd = new SqlCommand(cmdText, con);
                cmd.ExecuteScalar();
                Createtable("server=" + dataBaseLink + ";Initial Catalog=" + hosid + ";User ID=" + userID + ";Password=" + pwd + ";");
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
            "database " + hosid;

        try
        {
            using (SqlConnection con = new SqlConnection(ConStr))
            {
                con.Open();
                SqlCommand cmd = new SqlCommand(cmdText, con);
                cmd.ExecuteScalar();
                Createtable("server=" + myserver + ";Initial Catalog=" + hosid + ";User ID=sa;Password=zju308;");
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


        string cmdText1 = @"

CREATE TABLE [dbo].[WorkFlowState](
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
	[State] [nvarchar](50) NULL,
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
	[TaskCreator] [int] NULL,
	[TaskCreateDate] [nvarchar](50) NULL,
	[WorkFlowID] [int] NULL,
	[FileName] [nvarchar](500) NULL,
	[TypeID] [int] NULL
) 

CREATE TABLE [dbo].[Task_Service](
	[TaskID] [int] NULL,
	[ServiceID] [nvarchar](50) NULL,
	[ID] [int] IDENTITY(1,1) NOT NULL
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
	[密码] [nvarchar](50) NULL,
	[添加时间] [nvarchar](50) NULL,
	[StyleSheet] [nvarchar](350) NULL,
	[Microblog] [nvarchar](40) NULL,
) 

CREATE TABLE [dbo].[DeptList](
	[部门编号] [varchar](20) NOT NULL,
	[部门名称] [varchar](50) NOT NULL,
	[上级部门] [varchar](20) NULL,
	[职能描述] [ntext] NULL
) 

;";
        #endregion//
        try
        {
            using (SqlConnection con = new SqlConnection(link))
            {
                con.Open();
                SqlCommand cmd = new SqlCommand(cmdText1, con);
                cmd.ExecuteScalar();
                return true;
            }
        }
        catch (Exception err)
        {
            return false;
        }
    }
    */
#endregion
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
    protected void RadioButton1_CheckedChanged(object sender, EventArgs e)
    {
        Panel1.Visible = true;
    }
    protected void RadioButton2_CheckedChanged(object sender, EventArgs e)
    {
        Panel1.Visible = false;
    }


    bool UpLoadFileForPlatForm()
    {
        bool fileIsValid = false;
        //如果确认了文件上传，则判断文件类型是否符合要求
        string fileExtension = "";
        if (this.FileUpload1.HasFile)
        {
            //获取上传文件的后缀名
            fileExtension = System.IO.Path.GetExtension(this.FileUpload1.FileName).ToLower();//ToLower是将Unicode字符的值转换成它的小写等效项
            //定义一个数组，把文件后缀名的的类型总结出来
            String[] restrictExtension = { ".rar", ".zip" };
            //判断文件类型是否符合要求
            for (int i = 0; i < restrictExtension.Length; i++)
            {
                if (fileExtension == restrictExtension[i])
                {
                    fileIsValid = true;
                }
            }
        }
        //如果文件类型符合要求，则用SaveAs方法实现上传，并显示信息
        if (fileIsValid == true)
        {
            try
            {
                this.FileUpload1.SaveAs(Server.MapPath("~/UpLoadFiles/adminCloudMDBUserAudit/") + userName.Text.ToString().Trim() + fileExtension);
                this.Label1.Text = "文件上传成功";
                return true;
            }
            catch( Exception err)
            {
               // this.Label1.Text =err.Message "文件上传不成功";
                this.Label1.Text ="文件上传不成功";
                return false;
            }
            finally
            {

            }
        }
        else
        {
            this.Label1.Text = "文件的后缀名只能为.zip、.rar、";
            return false;
        }
    }
}