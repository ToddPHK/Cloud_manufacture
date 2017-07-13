using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Configuration;

public partial class PlatForm_Admin_WebPage_SMLog_DataProcess : System.Web.UI.Page
{



    protected void Page_Load(object sender, EventArgs e)
    {
        string myserver = ConfigurationManager.AppSettings["myserver"];
       // string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        string PlatForm_connectstr = "server=" + myserver + ";Initial Catalog=CloudMDB;User ID=sa;Password=zju308;connect timeout=30";
        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();
            if (OperateType.Equals("DeleteLog"))
            {
                if(sqlExecute.sqlmanage.ExecuteSQL("delete from ShortMessageLog where ID in (" + Request["IDS"].ToString() + ")", PlatForm_connectstr))
                    Response.Write("短信日志删除成功");
                else

                    Response.Write("短信日志删除失败");

            }
        }

        Response.End();
        Response.Clear();

    }

}