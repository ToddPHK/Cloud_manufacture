using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;

public partial class DataProcess : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string myserver = ConfigurationManager.AppSettings["myserver"];
        string PlatForm_connectstr = "server=" + myserver + ";Initial Catalog=CloudMDB;User ID=sa;Password=zju308;connect timeout=30";

        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();
            if (OperateType.Equals("EditUserInf"))
            {
                if (!string.IsNullOrEmpty(Request["userName"]) && !string.IsNullOrEmpty(Request["userPass"]))
                {
                    if (!sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserInfor where userName='" + Request["userName"].ToString() + "'  and userPass='" + Request["userPass"] + "'"))
                    {
                        Response.Write("{success:false,msg:'�û��������벻��ȷ��'}");
                        Response.End();
                        return;
                    }
                    else if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserInfor where userName='" + Request["userName"].ToString() + "' and userPass='" + Request["userPass"] + "' and UserState=1"))
                    {

                        Response.Write("{success:false,msg:'��ͨ��ƽ̨��˲����޸���Ϣ��'}");
                        Response.End();

                    }

                    else if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserInfor where userName='" + Request["userName"].ToString() + "' and userPass='" + Request["userPass"] + "' and UserType=0 and (UserState=2 or UserState=0) "))//��?ҵ��??��??��?����?Ϣ?����T��?
                    {
  
                        Response.Write("{success:true,EntUser:true}");
                        Response.End();

                    }
                    else if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserInfor where userName='" + Request["userName"].ToString() + "' and userPass='" + Request["userPass"] + "' and UserType=1 and (UserState=2 or UserState=0) "))//��?�ˡ�?��??��?����?Ϣ?����T��?
                    {

                        Response.Write("{success:true,EntUser:false}");
                        Response.End();
                    }


                }
            }

        }
    }
}