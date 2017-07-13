using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Data;
using System.Configuration;

public partial class userSession : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string PreIndex = ConfigurationManager.AppSettings["PreIndex"];
        string myserver = ConfigurationManager.AppSettings["myserver"];
        string PlatForm_connectstr = "server=" + myserver + ";Initial Catalog=CloudMDB;User ID=sa;Password=zju308;connect timeout=30";

        string username = Request.Form["userName"];
        string password = Request.Form["userPass"];
        string dataBaseName = Request.Form["databasename"];

        if (Request["LoginType"] != null)
        {
            string LoginType = Request["LoginType"].ToString();
            string connectstr = null;
            if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserInfor where userName='" + Request["databasename"] + "'  and UserType=0"))
            {

                if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserInfor where userName='" + Request["databasename"] + "'"))
                {
                    string local = sqlExecute.sqlmanage.GetUniqueRecord("select * from UserInfor where userName='" + Request["databasename"] + "'", PlatForm_connectstr, new string[] { "localDatabase" });
                    //先判断企业的数据库放在云平台上
                    if (local.Equals("0"))//数据库放在云平台上
                    {
                        connectstr = "server=" + myserver + ";Initial Catalog=" + PreIndex + Request["databasename"].ToString() + ";User ID=sa;Password=zju308;connect timeout=30";
                    }
                    else if (local.Equals("1"))//数据库使用自己企业内部的
                    {
                        string linkInf = sqlExecute.sqlmanage.GetUniqueRecord("select * from UserInfor where userName='" + Request["databasename"] + "'", PlatForm_connectstr, new string[] { "DataBaseServer", "DataBaseName", "DataBaseUserID", "DataBasePwd" });
                        if (linkInf.Contains("|") || !linkInf.Contains(","))//linkInf中包含“|”字符说明登陆企业用户注册的有重名
                        {
                            Response.Write("{success:false,msg:'系统出错，请过段时间后再试'}");
                            Response.End();
                            return;

                        }
                        else
                        {
                            connectstr = "server=" + linkInf.Split(',')[0] + ";Initial Catalog=" + linkInf.Split(',')[1] + ";User ID=" + linkInf.Split(',')[2] + ";Password=" + linkInf.Split(',')[3] + ";connect timeout=30";
                        }
                    }
                    else
                    {
                        Response.Write("{success:false,msg:'系统出错，请过段时间后再试'}");
                        Response.End();
                        return;
                    }
                }
                else
                {
                    if (LoginType.Equals("ENTInnerUsers"))//企业内部用户登陆
                    {
                        Response.Write("{success:false,msg:'公司注册名不存在，您的企业可能还未注册'}");
                        Response.End();
                        return;
                    }
                    else
                    {
                        Response.Write("{success:false,msg:'用户名不存在'}");
                        Response.End();
                        return;
                    }
                }
            }

            #region
            if (LoginType.Equals("ENTInnerUsers"))//企业内部用户登陆
            {
                //登陆验证
                if (!string.IsNullOrEmpty(Request["userName"]) && !string.IsNullOrEmpty(Request["userPass"]) && !string.IsNullOrEmpty(Request["databasename"]))
                {
                    if (sqlExecute.sqlmanage.HasRecord( connectstr, "select * from EmployeeList where 人员名称='" + Request["username"].ToString() + "' and 密码="+Request["userPass"].ToString()) && sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserInfor where userName='" + Request["databasename"].ToString() + "' and UserState=1 "))
                    {
//  Session.Clear();

                        string s1 = sqlExecute.sqlmanage.GetUniqueRecord("select name,fieldLabel from TaskTemplate where state in (2,3)", PlatForm_connectstr, new string[] { "name", "fieldLabel" });
                        Session["connectstr"] = connectstr;
                        Session["UserType"] = "ENTInnerUser";
                        Session["PlatForm_connectstr"] = PlatForm_connectstr;
                        Session["username"] = Request["userName"];
                        Session["adminname"] = Request["databasename"];//"databasename"是公司注册名,如果使用的是公司内部的数据库，也是公司使用的数据库
                        Session["userID"] = sqlExecute.sqlmanage.GetUniqueRecord("select * from EmployeeList where 人员名称='" + Request["userName"] + "'", connectstr, new string[] { "人员ID" });
                        Session["StyleSheet"] = sqlExecute.sqlmanage.GetUniqueRecord("select StyleSheet from EmployeeList where 人员ID=" + Session["userID"].ToString(), connectstr, new string[] { "StyleSheet" });
                        Session["ENTID"] = sqlExecute.sqlmanage.GetUniqueRecord("select * from UserInfor where userName='" + Request["databasename"] + "'", PlatForm_connectstr, new string[] { "UserID" });
                        sqlExecute.sqlmanage.ExecuteSQL("insert into LoginLog (LoginIP, LoginTime, UserID) values ('" + Page.Request.UserHostAddress + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "','" + Session["userID"].ToString() + "')", connectstr);
                        Response.Write("{success:true,msg:'OK'}");
                        Response.End();
                        return;
                    }
                       else if (!sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserInfor where userName='" + Request["databasename"].ToString() + "'  "))
                    {
                        Response.Write("{success:false,msg:'公司注册名不存在'}");
                        Response.End();
                        return;
                    }

                    else if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserInfor where userName='" + Request["databasename"].ToString() + "' and UserState=-1"))
                    {
                        Response.Write("{success:false,msg:'该企业用户已禁用，请与管理员联系！'}");
                        Response.End();
                        return;
                    }
                    else if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserInfor where userName='" + Request["databasename"].ToString() + "' and UserState=0"))
                    {
                        Response.Write("{success:false,msg:'该企业用户还未通过审核，请与管理员联系！'}");
                        Response.End();
                        return;
                    }
                    else if (!sqlExecute.sqlmanage.HasRecord( connectstr, "select * from EmployeeList where 人员名称='" + Request["username"].ToString() + "' and 密码="+Request["userPass"].ToString()))
                    {
                        Response.Write("{success:false,msg:'用户名或密码不正确！'}");
                        Response.End();
                        return;
                    }
                }
                else
                {
                    Response.Write("{success:false,msg:'系统出错，请刷新后再试',tr:'another inf'}");
                    Response.End();
                    return;
                }

            }
            #endregion
            #region
            else if (LoginType.Equals("ENTUsers"))
            {
                if (!string.IsNullOrEmpty(Request["userName"]) && !string.IsNullOrEmpty(Request["userPass"]))
                {
                    if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserInfor where userName='" + Request["userName"].ToString() + "' and userPass='" + Request["userPass"] + "' and UserState=1 and UserType=0"))
                    {
//  Session.Clear();


                        string s1 = sqlExecute.sqlmanage.GetUniqueRecord("select name,fieldLabel from TaskTemplate where state  in (2,3) ", PlatForm_connectstr, new string[] { "name", "fieldLabel" });
                        Session["connectstr"] = connectstr;
                        Session["UserType"] = "ENTUser";
                        Session["PlatForm_connectstr"] = PlatForm_connectstr;
                        Session["userName"] = Request["userName"];
                        Session["adminname"] = Request["userName"];
                        Session["userID"] = sqlExecute.sqlmanage.GetUniqueRecord("select * from UserInfor where userName='" + Request["databasename"] + "'", PlatForm_connectstr, new string[] { "UserID" });
                        Session["StyleSheet"] = sqlExecute.sqlmanage.GetUniqueRecord("select StyleSheet from UserInfor where UserID=" + Session["userID"].ToString(), PlatForm_connectstr, new string[] { "StyleSheet" });
                        Session["ENTID"] = Session["userID"];
                        //-------------------
                        Session["User"] = Request["userName"];
                        Session["EtprNum"] = Session["userID"];
                        Session["EtprName"] = sqlExecute.sqlmanage.GetUniqueRecord("select EntFullName from UserInfor where UserID='" + Session["userID"] + "'", PlatForm_connectstr, new string[] { "EntFullName" });
                        //-------------


                        sqlExecute.sqlmanage.ExecuteSQL("insert into LoginLog (LoginIP, LoginTime, UserID) values ('" + Page.Request.UserHostAddress + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "','" + Session["userID"].ToString() + "')", PlatForm_connectstr);
                        sqlExecute.sqlmanage.ExecuteSQL("update UserInfor set Count=Count+1 where UserID=" + Session["userID"].ToString(), PlatForm_connectstr);
                        Response.Write("{success:true,msg:'OK',tr:'another inf'}");
                        Response.End();

                        return;


                    }
                    else if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserInfor where userName='" + Request["userName"].ToString() + "' and userPass='" + Request["userPass"] + "' and UserState=1 and UserType=1"))
                    {
  //Session.Clear();

                        string s1 = sqlExecute.sqlmanage.GetUniqueRecord("select name,fieldLabel from TaskTemplate where state  in (2,3) ", PlatForm_connectstr, new string[] { "name", "fieldLabel" });
                        Session["connectstr"] = "";
                        Session["UserType"] = "PersonalUser";
                        Session["PlatForm_connectstr"] = PlatForm_connectstr;
                        Session["userName"] = Request["userName"];
                        Session["adminname"] = Request["userName"];
                        Session["userID"] = sqlExecute.sqlmanage.GetUniqueRecord("select * from UserInfor where userName='" + Request["databasename"] + "'", PlatForm_connectstr, new string[] { "UserID" });
                        Session["StyleSheet"] = sqlExecute.sqlmanage.GetUniqueRecord("select StyleSheet from UserInfor where UserID=" + Session["userID"].ToString(), PlatForm_connectstr, new string[] { "StyleSheet" });
                        Session["ENTID"] = Session["userID"];
                        //-------------------
                        Session["User"] = Request["userName"];
                        Session["EtprNum"] = Session["userID"];
                        Session["EtprName"] = sqlExecute.sqlmanage.GetUniqueRecord("select EntFullName from UserInfor where UserID='" + Session["userID"] + "'", PlatForm_connectstr, new string[] { "EntFullName" });

                        //-------------
                        sqlExecute.sqlmanage.ExecuteSQL("insert into LoginLog (LoginIP, LoginTime, UserID) values ('" + Page.Request.UserHostAddress + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "','" + Session["userID"].ToString() + "')", PlatForm_connectstr);
                        sqlExecute.sqlmanage.ExecuteSQL("update UserInfor set Count=Count+1 where UserID=" + Session["userID"].ToString(), PlatForm_connectstr);
                        Response.Write("{success:true,msg:'OK',tr:'another inf'}");
                        Response.End();

                        return;

                    }
                    else if (!sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserInfor where userName='" + Request["userName"].ToString() + "'  and userPass='" + Request["userPass"] + "'"))
                    {
                        Response.Write("{success:false,msg:'用户名或密码不正确！'}");
                        Response.End();
                        return;
                    }
                    else if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserInfor where userName='" + Request["userName"].ToString() + "' and UserState=-1"))
                    {
                        Response.Write("{success:false,msg:'该用户已禁用，请与管理员联系！'}");
                        Response.End();
                        return;
                    }
                    else if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserInfor where userName='" + Request["userName"].ToString() + "' and UserState=0"))
                    {
                        Response.Write("{success:false,msg:'该用户还未审核，请与管理员联系！'}");
                        Response.End();
                        return;
                    }
                    else if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserInfor where userName='" + Request["userName"].ToString() + "' and UserState=2"))
                    {
                        Response.Write("{success:false,msg:'该用户未通过审核，请与管理员联系！'}");
                        Response.End();
                        return;
                    }

                }
                else
                {
                    Response.Write("{success:false,msg:'系统出错，请刷新后再试',tr:'another inf'}");
                    Response.End();
                    return;
                }

            }
            #endregion

        }
        else
        {
            Response.Write("{success:false,msg:'系统出错，请刷新后再试',tr:'another inf'}");
            Response.End();
            return;
        }

    }
    protected bool checklogin(string username, string password, string connStr, string tablename)//用户登录验证
    {
        string connectstr = connStr;
        SqlConnection con = new SqlConnection(connectstr);
        try
        {
            SqlCommand cmd = new SqlCommand("select count(*) from " + tablename + " where 人员名称='" + username + "' and 密码='" + password + "'  ", con);
            con.Open();
            int count = -1;
            count = Convert.ToInt32(cmd.ExecuteScalar());
            if (count < 1)
                return false;
            //else if (count == 1)
            return true;
        }
        catch (Exception e)
        {
            return false;
        }
        finally
        {
            con.Close();
        }
    }

}