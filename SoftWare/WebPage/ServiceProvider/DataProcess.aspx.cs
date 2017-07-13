using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class SoftWare_WebPage_DataProcess : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            if (!Session["UserType"].ToString().Equals("ENTUser") && !Session["UserType"].ToString().Equals("PersonalUser"))
            {
                Response.Write("{success:false,Login:false}");


            }
            else
            {
                string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
                if (Request["OperateType"] != null)
                {
                    string OperateType = Request["OperateType"].ToString();
                    if (OperateType.Equals("AddToStore"))
                    {
                        bool Flag = true;
                        string[] SoftIDS = Request["SoftIDS"].ToString().Split(',');
                        string sql = "";
                        foreach (string ID in SoftIDS)
                        {
                            sql = "insert into UserLevel (软件编号,申请企业,加入时间) values " +
          " ('" + ID + "','" + Session["ENTID"].ToString() + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "')";

                            if (sqlExecute.sqlmanage.ExecuteSQL(sql, PlatForm_connectstr))
                            {
                                Flag = true;
                            }
                            else
                            {
                                Flag = false;
                                break;
                            }
                        }
                        if (Flag)
                        {
                            Response.Write("{success:true,Login:true}");
                        }
                        else
                        {
                            Response.Write("{success:false,Login:true}");
                        }
                    }
                }
            }
        }
        catch (Exception err)
        {
            Response.Write("{success:false,Login:false}");
        }

        Response.End();
        Response.Clear();
    }
}