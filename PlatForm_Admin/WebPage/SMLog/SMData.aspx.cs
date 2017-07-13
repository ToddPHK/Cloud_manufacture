using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Configuration;

public partial class PlatForm_Admin_WebPage_SMLog_SMData : System.Web.UI.Page
{
    int start = 0;
    int limit = 10;
    string sql;
    string getcountSql;
    string connectstr;
    protected void Page_Load(object sender, EventArgs e)
    {
        string myserver = ConfigurationManager.AppSettings["myserver"];
        string PlatForm_connectstr = "server=" + myserver + ";Initial Catalog=CloudMDB;User ID=sa;Password=zju308;connect timeout=30";
        connectstr = PlatForm_connectstr;
        if (!string.IsNullOrEmpty(Request["limit"]))
        {
            limit = int.Parse(Request["limit"]);
        }
        if (!string.IsNullOrEmpty(Request["start"]))
        {
            start = int.Parse(Request["start"]);
        }
        if (string.IsNullOrEmpty(Request["OperateType"]))//如果没有传来的projectname的值就显示所有文档EmployeeList
        {
            sql = "select top " + limit + " ID, SenderID, SenderENTID, SMContent, ReceiverTelephone, ReceiverID, ReceiverENTID, SendTime,Sender.userName as SenderENT,Receiver.userName as ReceiverENT " +
                " from ShortMessageLog,UserInfor Sender,UserInfor Receiver where ID not in (select top " + start
                    + " ID from ShortMessageLog) and ShortMessageLog.SenderENTID*=Sender.UserID  and ShortMessageLog.ReceiverENTID*=Receiver.UserID ";
            getcountSql = "select  ID  from ShortMessageLog";

        }
        else if (Request["OperateType"].Equals("SMLogSearch"))
        {
            string filter = "";
            if (Request["SenderENTName"] != null && !Request["SenderENTName"].ToString().Trim().Equals(""))
                filter += " and SenderENTID in (select UserID from UserInfor where userName like '%" + Request["SenderENTName"].ToString().Trim() + "%')";
            if (Request["RecieverENTName"] != null && !Request["RecieverENTName"].ToString().Trim().Equals(""))
                filter += " and ReceiverENTID in (select UserID from UserInfor where userName like '%" + Request["RecieverENTName"].ToString().Trim() + "%')";
            if (Request["SenderEndTime"] != null && !Request["SenderEndTime"].ToString().Equals(""))//BETWEEN value1 AND value2
                filter += " and SendTime BETWEEN '" + Request["SenderStartTime"].ToString() + "' AND  '" + Request["SenderEndTime"].ToString() + "' ";

            sql = "select top " + limit + " ID, SenderID, SenderENTID, SMContent, ReceiverTelephone, ReceiverID, ReceiverENTID, SendTime,Sender.userName as SenderENT,Receiver.userName as ReceiverENT " +
" from ShortMessageLog,UserInfor Sender,UserInfor Receiver where ID not in (select top " + start
    + " ID from ShortMessageLog where ID>-1 " + filter + " order by  SendTime ) and ShortMessageLog.SenderENTID*=Sender.UserID  and ShortMessageLog.ReceiverENTID*=Receiver.UserID " + filter + " order by  SendTime";

            //   sql = "select   ProjList.*,ProjectState.StateText,ProjectType.TypeText,E1.人员名称,E2.人员名称 as PrjCreator  from ProjList,ProjectState,ProjectType,EmployeeList E1,EmployeeList E2 where   ProjList.项目负责人*=E1.人员ID and ProjList.项目创建人*=E2.人员ID and  ProjList.项目类型*=ProjectType.TypeID and ProjList.项目状态*=ProjectState.StateID " + filter; ;
            getcountSql = "select  ID  from ShortMessageLog where ID>-1 " + filter;

        }
        SQLToJson.ReaderSQLToJson.SetCount(getcountSql, connectstr);
        Response.Write(GetJsonStr(sql));

        Response.End();
        Response.Clear();

    }
    protected string GetJsonStr(string Sql)
    {
        SqlConnection con = new SqlConnection(connectstr);
        con.Open();
        SqlCommand cmd = new SqlCommand(Sql, con);
        SqlDataReader sdr = cmd.ExecuteReader();
        if (!sdr.HasRows)
            return "";
        else
        {
            string Json = SQLToJson.ReaderSQLToJson.GetJSON(sdr);
            return Json.ToString();
        }
    }
}