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
                    //���ж���ҵ�����ݿ������ƽ̨��
                    if (local.Equals("0"))//���ݿ������ƽ̨��
                    {
                        connectstr = "server=" + myserver + ";Initial Catalog=" + PreIndex + Request["databasename"].ToString() + ";User ID=sa;Password=zju308;connect timeout=30";
                    }
                    else if (local.Equals("1"))//���ݿ�ʹ���Լ���ҵ�ڲ���
                    {
                        string linkInf = sqlExecute.sqlmanage.GetUniqueRecord("select * from UserInfor where userName='" + Request["databasename"] + "'", PlatForm_connectstr, new string[] { "DataBaseServer", "DataBaseName", "DataBaseUserID", "DataBasePwd" });
                        if (linkInf.Contains("|") || !linkInf.Contains(","))//linkInf�а�����|���ַ�˵����½��ҵ�û�ע���������
                        {
                            Response.Write("{success:false,msg:'ϵͳ���������ʱ�������'}");
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
                        Response.Write("{success:false,msg:'ϵͳ���������ʱ�������'}");
                        Response.End();
                        return;
                    }
                }
                else
                {
                    if (LoginType.Equals("ENTInnerUsers"))//��ҵ�ڲ��û���½
                    {
                        Response.Write("{success:false,msg:'��˾ע���������ڣ�������ҵ���ܻ�δע��'}");
                        Response.End();
                        return;
                    }
                    else
                    {
                        Response.Write("{success:false,msg:'�û���������'}");
                        Response.End();
                        return;
                    }
                }
            }

            #region
            if (LoginType.Equals("ENTInnerUsers"))//��ҵ�ڲ��û���½
            {
                //��½��֤
                if (!string.IsNullOrEmpty(Request["userName"]) && !string.IsNullOrEmpty(Request["userPass"]) && !string.IsNullOrEmpty(Request["databasename"]))
                {
                    if (sqlExecute.sqlmanage.HasRecord( connectstr, "select * from EmployeeList where ��Ա����='" + Request["username"].ToString() + "' and ����="+Request["userPass"].ToString()) && sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserInfor where userName='" + Request["databasename"].ToString() + "' and UserState=1 "))
                    {
//  Session.Clear();

                        string s1 = sqlExecute.sqlmanage.GetUniqueRecord("select name,fieldLabel from TaskTemplate where state in (2,3)", PlatForm_connectstr, new string[] { "name", "fieldLabel" });
                        Session["connectstr"] = connectstr;
                        Session["UserType"] = "ENTInnerUser";
                        Session["PlatForm_connectstr"] = PlatForm_connectstr;
                        Session["username"] = Request["userName"];
                        Session["adminname"] = Request["databasename"];//"databasename"�ǹ�˾ע����,���ʹ�õ��ǹ�˾�ڲ������ݿ⣬Ҳ�ǹ�˾ʹ�õ����ݿ�
                        Session["userID"] = sqlExecute.sqlmanage.GetUniqueRecord("select * from EmployeeList where ��Ա����='" + Request["userName"] + "'", connectstr, new string[] { "��ԱID" });
                        Session["StyleSheet"] = sqlExecute.sqlmanage.GetUniqueRecord("select StyleSheet from EmployeeList where ��ԱID=" + Session["userID"].ToString(), connectstr, new string[] { "StyleSheet" });
                        Session["ENTID"] = sqlExecute.sqlmanage.GetUniqueRecord("select * from UserInfor where userName='" + Request["databasename"] + "'", PlatForm_connectstr, new string[] { "UserID" });
                        sqlExecute.sqlmanage.ExecuteSQL("insert into LoginLog (LoginIP, LoginTime, UserID) values ('" + Page.Request.UserHostAddress + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "','" + Session["userID"].ToString() + "')", connectstr);
                        Response.Write("{success:true,msg:'OK'}");
                        Response.End();
                        return;
                    }
                       else if (!sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserInfor where userName='" + Request["databasename"].ToString() + "'  "))
                    {
                        Response.Write("{success:false,msg:'��˾ע����������'}");
                        Response.End();
                        return;
                    }

                    else if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserInfor where userName='" + Request["databasename"].ToString() + "' and UserState=-1"))
                    {
                        Response.Write("{success:false,msg:'����ҵ�û��ѽ��ã��������Ա��ϵ��'}");
                        Response.End();
                        return;
                    }
                    else if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserInfor where userName='" + Request["databasename"].ToString() + "' and UserState=0"))
                    {
                        Response.Write("{success:false,msg:'����ҵ�û���δͨ����ˣ��������Ա��ϵ��'}");
                        Response.End();
                        return;
                    }
                    else if (!sqlExecute.sqlmanage.HasRecord( connectstr, "select * from EmployeeList where ��Ա����='" + Request["username"].ToString() + "' and ����="+Request["userPass"].ToString()))
                    {
                        Response.Write("{success:false,msg:'�û��������벻��ȷ��'}");
                        Response.End();
                        return;
                    }
                }
                else
                {
                    Response.Write("{success:false,msg:'ϵͳ������ˢ�º�����',tr:'another inf'}");
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
                        Response.Write("{success:false,msg:'�û��������벻��ȷ��'}");
                        Response.End();
                        return;
                    }
                    else if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserInfor where userName='" + Request["userName"].ToString() + "' and UserState=-1"))
                    {
                        Response.Write("{success:false,msg:'���û��ѽ��ã��������Ա��ϵ��'}");
                        Response.End();
                        return;
                    }
                    else if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserInfor where userName='" + Request["userName"].ToString() + "' and UserState=0"))
                    {
                        Response.Write("{success:false,msg:'���û���δ��ˣ��������Ա��ϵ��'}");
                        Response.End();
                        return;
                    }
                    else if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserInfor where userName='" + Request["userName"].ToString() + "' and UserState=2"))
                    {
                        Response.Write("{success:false,msg:'���û�δͨ����ˣ��������Ա��ϵ��'}");
                        Response.End();
                        return;
                    }

                }
                else
                {
                    Response.Write("{success:false,msg:'ϵͳ������ˢ�º�����',tr:'another inf'}");
                    Response.End();
                    return;
                }

            }
            #endregion

        }
        else
        {
            Response.Write("{success:false,msg:'ϵͳ������ˢ�º�����',tr:'another inf'}");
            Response.End();
            return;
        }

    }
    protected bool checklogin(string username, string password, string connStr, string tablename)//�û���¼��֤
    {
        string connectstr = connStr;
        SqlConnection con = new SqlConnection(connectstr);
        try
        {
            SqlCommand cmd = new SqlCommand("select count(*) from " + tablename + " where ��Ա����='" + username + "' and ����='" + password + "'  ", con);
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