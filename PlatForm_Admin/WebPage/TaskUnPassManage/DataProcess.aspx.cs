using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using SQLToTreeJson;
using System.Web.Script.Serialization;
using System.Text;
using System.Data.SqlClient;

public partial class PDM_TaskTreeData : System.Web.UI.Page
{
    string gg;
    protected void Page_Load(object sender, EventArgs e)
    {
        //  string connectstr = Session["connectstr"].ToString();
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();
            if (OperateType.Equals("StandardTaskTreeNoCheckBox"))
            {
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeFullJson ff = new TreeFullJson.TreeFullJson(PlatForm_connectstr, false);
                sb.AppendFormat("[{0}]", ff.fillTreeView("select NodeId,StandardTaskName,TaskTemplate.name as TemplateName,PNodeId from ServiceTree,TaskTemplate where PNodeId is null and ServiceTree.TemplateID*=TaskTemplate.TaskTemplateID  ", new string[] { "id", "text", "TemplateName" }, "NodeId", "PNodeId", " ServiceTree.TemplateID*=TaskTemplate.TaskTemplateID "));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();
            }

            else if (OperateType.Equals("TaskDicWord"))
            {
                string sql = "select AttributeName as Name,Chinese as Text from Attributes";
                string s = GetJsonStr(sql, PlatForm_connectstr);
                Response.Write(s);
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("GetTaskTemplateName"))
            {
                string WordsInf = sqlExecute.sqlmanage.GetUniqueRecord("select name from TaskTemplate where TaskTemplateID =( select TemplateID from StandardTask where StandardTaskID=" + Request["TaskTemplateID"].ToString() + ")", PlatForm_connectstr, new string[] { "name" });
                if (WordsInf.Contains(",") || WordsInf.Contains("|"))
                    Response.Write("Erro");
                else
                    Response.Write(WordsInf);
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("State_Name"))
            {
                string sql = "select TaskStateID,TaskStateName from TaskState";
                string s = GetJsonStr(sql, PlatForm_connectstr, "TaskStateID", "TaskStateName");
                Response.Write(s);
                Response.End();
                Response.Clear();
            }

        }
    }
    protected string GetJsonStr(string Sql, string connectstr, string Field1, string Field2)
    {
        SqlConnection con = new SqlConnection(connectstr);
        con.Open();
        SqlCommand cmd = new SqlCommand(Sql, con);
        SqlDataReader sdr = cmd.ExecuteReader();
        if (!sdr.HasRows)
            return "";
        else
        {
            string Json = GetJSON(sdr, Field1, Field2);
            return Json.ToString();
        }
    }
    protected string GetJSON(SqlDataReader drValue, string Field1, string Field2)
    {

        StringBuilder sb = new StringBuilder();
        try
        {
            sb.Append(" {");
            while (drValue.Read())
            {

                sb.AppendFormat("{0}:'{1}',", drValue[Field1], drValue[Field2]);



            }
            sb.Remove(sb.ToString().LastIndexOf(','), 1);
            sb.AppendLine("}");
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
        finally
        {
            drValue.Close();
        }
        return sb.ToString();
    }
    protected string GetJsonStr(string Sql, string connectstr)
    {
        SqlConnection con = new SqlConnection(connectstr);
        con.Open();
        SqlCommand cmd = new SqlCommand(Sql, con);
        SqlDataReader sdr = cmd.ExecuteReader();
        if (sdr.FieldCount < 1)
            return "";
        else
        {
            string Json = GetJSON(sdr);
            return Json.ToString();
        }
    }
    protected string GetJSON(SqlDataReader drValue)
    {

        StringBuilder sb = new StringBuilder();
        try
        {
            sb.Append(" {");
            while (drValue.Read())
            {

                sb.AppendFormat("{0}:'{1}',", drValue["Name"], drValue["Text"]);



            }
            sb.Remove(sb.ToString().LastIndexOf(','), 1);
            sb.AppendLine("}");
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
        finally
        {
            drValue.Close();
        }
        return sb.ToString();
    }
}