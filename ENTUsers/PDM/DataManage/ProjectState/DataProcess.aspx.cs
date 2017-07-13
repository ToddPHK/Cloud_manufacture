using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;

public partial class ENTUsers_PDM_DataManage_ProjectState_DataProcess : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string connectstr = Session["connectstr"].ToString();
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();
            if (OperateType.Equals("StateData"))
            {
                string sql = "select StateID, StateText from ProjectState order by StateID  ";
                string getcountSql = sql;
                SQLToJson.ReaderSQLToJson.SetCount(getcountSql, connectstr);
                Response.Write(GetJsonStr(sql, connectstr));

                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("RefreshDataFromServer"))
            {
                if (ReFreshDataFromServer(PlatForm_connectstr, connectstr))
                {
                    Response.Clear();
                    Response.Write("项目状态数据更新成功！");

                    Response.End();

                }
                else
                {
                    Response.Clear();
                    Response.Write("项目状态数据更新失败！");

                    Response.End();
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
            string Json = SQLToJson.ReaderSQLToJson.GetJSON(sdr);
            return Json.ToString();
        }
    }
    bool ReFreshDataFromServer(string PlatForm_connectstr, string connectstr)
    {
        try
        {
            if (sqlExecute.sqlmanage.ExecuteSQL("delete from ProjectState", connectstr))
            {
                string[] IDNameColors = sqlExecute.sqlmanage.GetUniqueRecord("select StateID, StateText from ProjectState", PlatForm_connectstr, new string[] { "StateID", "StateText" }).Split('|');
                foreach (string IDNameColor in IDNameColors)
                {
                    if (!sqlExecute.sqlmanage.ExecuteSQL("insert into ProjectState(StateID, StateText) values('" + IDNameColor.Replace(",", "','") + "')", connectstr))
                        return false;
                }
                return true;
            }
            else
            {
                return false;
            }
        }
        catch (Exception e)
        {
            return false;
        }

    }
}