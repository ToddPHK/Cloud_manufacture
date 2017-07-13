using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Data;
using System.Text;

public partial class PDM_rolemanage_roleTableData : System.Web.UI.Page
{


    protected void Page_Load(object sender, EventArgs e)
    {


        string connectstr = Session["connectstr"].ToString();

        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        if (!String.IsNullOrEmpty(connectstr))
        {

            if (!string.IsNullOrEmpty(Request["OperarteType"]))//如果没有传来的projectname的值就显示所有文档EmployeeList
            {
                string OperarteType = Request["OperarteType"].ToString();
                if (OperarteType.Equals("PersonInf"))
                {
                    Response.Write(GetJsonStr("select * from EmployeeList where 人员ID=" + Session["userID"].ToString(), connectstr));
                    Response.End();
                    Response.Clear();
                }
                else if (OperarteType.Equals("EditPersonInf"))
                {
                    string sql = "update EmployeeList set  人员名称='" + Request["peoplename"] +
                         "', 性别='" + Request["sex"] + "', 出生年月='" + Request["birthday"] +
                         "', 学历='" + Request["education"] + "', 移动电话='" + Request["mobilenumber"] +
                         "', 固定电话='" + Request["fixtelephone"] + "', Email='" + Request["Email"] +
                          "', Microblog='" + Request["Microblog"] + 
                         "', QQ号='" + Request["QQ"] + "', 通讯地址='" + Request["address"] +
                         "', 进厂日期='" + Request["comeDate"] + "', 培训情况='" + Request["training"] +
                          "', 密码='" + Request["secretnumber"] + "'  where 人员ID=" + Session["userID"].ToString();
   
                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
                    {

                        Response.Write("{success:true,msg:'个人信息更新成功！',tr:'another inf'}");
                        Response.End();
                        Response.Clear();
      

                    }
                    else
                    {

                        Response.Write("{success:false,msg:'个人信息更新成功！',tr:'another inf'}");
                        Response.End();
                        Response.Clear();


                    }
                }
                else if (OperarteType.Equals("PublishMessage"))
                {
                    Response.Write(GetJsonStr("select top 20   ID,动态标题 as Title,动态发布时间 as PublishTime,动态文件 as filename from news order by PublishTime desc ", PlatForm_connectstr));
                    Response.End();
                    Response.Clear();
                }
            }

        }
    }
    protected string GetJsonStr(string Sql, string connectstr)
    {
        SqlConnection con = new SqlConnection(connectstr);
        con.Open();
        SqlCommand cmd = new SqlCommand(Sql, con);
        SqlDataReader sdr = cmd.ExecuteReader();
        if (!sdr.HasRows)
            return "";
        else
        {
            string Json = GetJSON(sdr);
            return Json.ToString();
        }
    }
    public static string GetJSON(SqlDataReader drValue)
    {
        if (!drValue.HasRows)
            return "";
        else
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("{Root:[");
            try
            {
                while (drValue.Read())
                {
                    sb.Append(" {");
                    for (int i = 0; i < drValue.FieldCount; i++)
                    {
                        sb.AppendFormat("'{0}':'{1}',", drValue.GetName(i), drValue.GetValue(i));
                    }
                    sb.Remove(sb.ToString().LastIndexOf(','), 1);
                    sb.Append("},");
                }
                sb.Remove(sb.ToString().LastIndexOf(','), 1);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                drValue.Close();
            }
            sb.Append("]}");

            return sb.ToString();
        }
    }

}