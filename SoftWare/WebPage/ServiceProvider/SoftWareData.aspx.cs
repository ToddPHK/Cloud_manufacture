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
            if (string.IsNullOrEmpty(Request["OperateType"]))//���û�д�����projectname��ֵ����ʾ�����ĵ�EmployeeList
            {

                sql = " select top " + limit +
                    " ������, �������, ����汾, �汾��������, ���������, ������ҵ, ��ѯ�绰, ����ٷ���վ, ϵͳ����, �������, ���ģʽ, ������, " +
                    "  �Ƿ��ƽ̨����, �ؼ���, �����ĵ���ַ, ���ӵ�ַ, �ṩ��ѵ����, �ṩ�������, ��Դ���, ��Ȩ��ʽ, ����������Ϣ, ע������, ��ҵ���, ����ʽ, " +
                      "��ҵ����, �Ƿ������, ע��ʱ��, ���״̬, ʹ�ô���, ͼƬ,UserInfor.EntFullName" +
 " from Software,UserInfor where ������ not in (select top " + start
                        + " ������ from Software) and  Software.��ҵ���*=UserInfor.UserID ";
                getcountSql = "select  ������  from Software";

            }
            else if (Request["OperateType"].Equals("SoftWareSearch"))
            {
                string filter = "";

                if (Request["SoftWareName"] != null && !Request["SoftWareName"].ToString().Trim().Equals(""))//
                    filter += " and ������� like '%" + Request["SoftWareName"].ToString() + "%' ";
                if (Request["SoftWareEnt"] != null && !Request["SoftWareEnt"].ToString().Trim().Equals(""))//
                    filter += " and ��ҵ��� in (select UserID from  UserInfor where EntFullName like '%" + Request["SoftWareEnt"].ToString() + "%' ) ";
                if (Request["SoftWareEvir"] != null && !Request["SoftWareEvir"].ToString().Trim().Equals(""))//
                    filter += " and ϵͳ���� like '%" + Request["SoftWareEvir"].ToString() + "%' " ;
                if (Request["SoftWareClass"] != null && !Request["SoftWareClass"].ToString().Trim().Equals(""))//
                    filter += " and ������ like '%" + Request["SoftWareClass"].ToString() + "%' ";
                {
                    if (Request["SoftWareRegStartTime"] != null && !Request["SoftWareRegStartTime"].ToString().Equals(""))//BETWEEN value1 AND value2
                        filter += " and ע��ʱ�� BETWEEN '" + Request["SoftWareRegStartTime"].ToString() + "' AND  '" + Request["SoftWareRegEndTime"].ToString() + "' ";
                    //if (Request["SoftWareEnt"] != null && !Request["SoftWareEnt"].ToString().Equals(""))//
                    //    filter += " and ������� like '%" + Request["SoftWareName"].ToString() + "%'";
                }
                if (Request["SoftWareLaug"] != null && !Request["SoftWareLaug"].ToString().Trim().Equals(""))//
                    filter += " and ������� like '%" + Request["SoftWareLaug"].ToString() + "%' ";
                if (Request["SoftWareKeyWord"] != null && !Request["SoftWareKeyWord"].ToString().Trim().Equals(""))//
                    filter += " and �ؼ��� like '%" + Request["SoftWareKeyWord"].ToString() + "%' ";
                if (Request["GiveTraining"] != null && !Request["GiveTraining"].ToString().Trim().Equals(""))//
                    filter += " and �ṩ��ѵ����=" + Request["GiveTraining"].ToString() + "  ";
                if (Request["GiveDeploy"] != null && !Request["GiveDeploy"].ToString().Trim().Equals(""))//
                    filter += " and �ṩ�������=" + Request["GiveDeploy"].ToString() + " ";

                sql = " select top " + limit +
                    " ������, �������, ����汾, �汾��������, ���������, ������ҵ, ��ѯ�绰, ����ٷ���վ, ϵͳ����, �������, ���ģʽ, ������, " +
                    "  �Ƿ��ƽ̨����, �ؼ���, �����ĵ���ַ, ���ӵ�ַ, �ṩ��ѵ����, �ṩ�������, ��Դ���, ��Ȩ��ʽ, ����������Ϣ, ע������, ��ҵ���, ����ʽ, " +
                      "��ҵ����, �Ƿ������, ע��ʱ��, ���״̬, ʹ�ô���, ͼƬ,UserInfor.EntFullName " +
 " from Software,UserInfor where ������ not in (select top " + start
                        + " ������ from Software where ������>-1  " + filter + " ) and  Software.��ҵ���*=UserInfor.UserID " + filter;
                getcountSql = " select  ������  from Software where ������ >-1  " + filter;
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