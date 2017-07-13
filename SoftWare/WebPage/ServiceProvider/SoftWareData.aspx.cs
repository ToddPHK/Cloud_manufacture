using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Configuration;

public partial class SoftWare_WebPage_SoftWareData : System.Web.UI.Page
{
    int start = 0;
    int limit = 10;
    string sql;
    string getcountSql;
    protected void Page_Load(object sender, EventArgs e)
    {
        //connectstr = Session["connectstr"].ToString();
        string myserver = ConfigurationManager.AppSettings["myserver"];
        string PlatForm_connectstr = "server=" + myserver + ";Initial Catalog=CloudMDB;User ID=sa;Password=zju308;connect timeout=30";
        if (PlatForm_connectstr != "")
        {
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

                sql = " select top " + limit +
                    " 软件编号, 软件名称, 软件版本, 版本发布日期, 软件负责人, 开发企业, 咨询电话, 软件官方网站, 系统环境, 软件语言, 软件模式, 软件类别, " +
                    "  是否对平台公开, 关键词, 帮助文档地址, 链接地址, 提供培训服务, 提供部署服务, 资源简介, 授权方式, 其他参数信息, 注意事项, 企业编号, 共享方式, " +
                      "企业名称, 是否可链接, 注册时间, 审核状态, 使用次数, 图片,UserInfor.EntFullName" +
 " from Software,UserInfor where 软件编号 not in (select top " + start
                        + " 软件编号 from Software) and  Software.企业编号*=UserInfor.UserID ";
                getcountSql = "select  软件编号  from Software";

            }
            else if (Request["OperateType"].Equals("SoftWareSearch"))
            {
                string filter = "";

                if (Request["SoftWareName"] != null && !Request["SoftWareName"].ToString().Trim().Equals(""))//
                    filter += " and 软件名称 like '%" + Request["SoftWareName"].ToString() + "%' ";
                if (Request["SoftWareEnt"] != null && !Request["SoftWareEnt"].ToString().Trim().Equals(""))//
                    filter += " and 企业编号 in (select UserID from  UserInfor where EntFullName like '%" + Request["SoftWareEnt"].ToString() + "%' ) ";
                if (Request["SoftWareEvir"] != null && !Request["SoftWareEvir"].ToString().Trim().Equals(""))//
                    filter += " and 系统环境 like '%" + Request["SoftWareEvir"].ToString() + "%' " ;
                if (Request["SoftWareClass"] != null && !Request["SoftWareClass"].ToString().Trim().Equals(""))//
                    filter += " and 软件类别 like '%" + Request["SoftWareClass"].ToString() + "%' ";
                {
                    if (Request["SoftWareRegStartTime"] != null && !Request["SoftWareRegStartTime"].ToString().Equals(""))//BETWEEN value1 AND value2
                        filter += " and 注册时间 BETWEEN '" + Request["SoftWareRegStartTime"].ToString() + "' AND  '" + Request["SoftWareRegEndTime"].ToString() + "' ";
                    //if (Request["SoftWareEnt"] != null && !Request["SoftWareEnt"].ToString().Equals(""))//
                    //    filter += " and 软件名称 like '%" + Request["SoftWareName"].ToString() + "%'";
                }
                if (Request["SoftWareLaug"] != null && !Request["SoftWareLaug"].ToString().Trim().Equals(""))//
                    filter += " and 软件语言 like '%" + Request["SoftWareLaug"].ToString() + "%' ";
                if (Request["SoftWareKeyWord"] != null && !Request["SoftWareKeyWord"].ToString().Trim().Equals(""))//
                    filter += " and 关键词 like '%" + Request["SoftWareKeyWord"].ToString() + "%' ";
                if (Request["GiveTraining"] != null && !Request["GiveTraining"].ToString().Trim().Equals(""))//
                    filter += " and 提供培训服务=" + Request["GiveTraining"].ToString() + "  ";
                if (Request["GiveDeploy"] != null && !Request["GiveDeploy"].ToString().Trim().Equals(""))//
                    filter += " and 提供部署服务=" + Request["GiveDeploy"].ToString() + " ";

                sql = " select top " + limit +
                    " 软件编号, 软件名称, 软件版本, 版本发布日期, 软件负责人, 开发企业, 咨询电话, 软件官方网站, 系统环境, 软件语言, 软件模式, 软件类别, " +
                    "  是否对平台公开, 关键词, 帮助文档地址, 链接地址, 提供培训服务, 提供部署服务, 资源简介, 授权方式, 其他参数信息, 注意事项, 企业编号, 共享方式, " +
                      "企业名称, 是否可链接, 注册时间, 审核状态, 使用次数, 图片,UserInfor.EntFullName " +
 " from Software,UserInfor where 软件编号 not in (select top " + start
                        + " 软件编号 from Software where 软件编号>-1  " + filter + " ) and  Software.企业编号*=UserInfor.UserID " + filter;
                getcountSql = " select  软件编号  from Software where 软件编号 >-1  " + filter;
            }

            SQLToJson.ReaderSQLToJson.SetCount(getcountSql, PlatForm_connectstr);
            Response.Write(GetJsonStr(sql, PlatForm_connectstr));

            Response.End();
            Response.Clear();
        }
    }
    protected string GetJsonStr(string Sql, string PlatForm_connectstr)
    {
        SqlConnection con = new SqlConnection(PlatForm_connectstr);
        con.Open();
        SqlCommand cmd = new SqlCommand(Sql, con);
        SqlDataReader sdr = cmd.ExecuteReader();
        if (!sdr.HasRows)
            return "";
        else
        {
            return SQLToJson.ReaderSQLToJson.GetJSON(sdr).ToString();
        }
    }
}