using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using System.Data.SqlClient;

public partial class PlatForm_Admin_WebPage_TaskTemplate_CommentData : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
       // string PlatForm_connectstr = "server=(local);Initial Catalog=CloudMDB;User ID=sa;Password=zju308;connect timeout=30";
           string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString(); 
        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();
            if (OperateType.Equals("ViewTemplateComment"))
            {

                string s1 = GetElementComment("select CommentDate,Comment,Company,CompanyUser,Score from TaskTempelate_Comment where AttributeID=" + Request["ID"].ToString() + " order by CommentDate desc", PlatForm_connectstr, "Comments");

                Response.Write("{" + s1 + "}");
            }
            else if (OperateType.Equals("ViewTemplateAllComment"))
            {
                string s1 = GetElementComment("select CommentDate,Comment,Company,CompanyUser,Score from TaskTempelate_Comment where  AttributeID=" + Request["ID"].ToString() + " order by CommentDate desc", PlatForm_connectstr, "TemplateComments");
                string s2 = GetElementComment("select CommentDate,Comment,Company,CompanyUser,Score,TaskTemplate.fieldLabel from TaskTempelate_Comment,TaskTemplate where TaskTempelate_Comment.AttributeID=TaskTemplate.TaskTemplateID and  AttributeID in (select TaskTemplateID from TaskTemplate where TaskTemplateParentID in (select TaskTemplateID from TaskTemplate where TaskTemplateParentID=" + Request["ID"].ToString() + "))" + " order by TaskTemplate.fieldLabel", PlatForm_connectstr, "ElementComments");
                if (!s1.Equals("") && !s2.Equals(""))
                    Response.Write("{" + s1 + "," + s2 + "}");
                else if (s1.Equals("") && s2.Equals(""))
                {
                    Response.Write("{}");
                }
                else
                {
                    if(!s1.Equals(""))
                        Response.Write("{" + s1 + "}");
                    else
                        Response.Write("{" + s2 + "}");
                }
            }

            Response.End();
            Response.Clear();
        }
    }

    protected string GetElementComment(string Sql, string connectstr, string str)
    {
        SqlConnection con = new SqlConnection(connectstr);
        con.Open();
        SqlCommand cmd = new SqlCommand(Sql, con);
        try
        {
            SqlDataReader sdr = cmd.ExecuteReader();
            if (!sdr.HasRows)
                return "";
            else
            {
                return GetJSON(sdr, str);

            }
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
        finally
        {
        }
    }

    protected string GetAllTempalteComment(string ID, string Sql, string connectstr)
    {
        StringBuilder sb = new StringBuilder();
        SqlConnection con = new SqlConnection(connectstr);
        con.Open();
        SqlCommand cmd = new SqlCommand("select CommentDate,Comment,Company,CompanyUser,Score from TaskTempelate_Comment where AttributeID=" + ID, con);
        try
        {
            SqlDataReader sdr = cmd.ExecuteReader();
            if (!sdr.HasRows)
                return "";
            else
            {
                return GetJSON(sdr, "Comments");

            }
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
        finally
        {
        }
    }
    protected string GetJSON(SqlDataReader drValue, string str)
    {

        StringBuilder sb = new StringBuilder();
        sb.AppendLine(str + ":[");
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
                sb.AppendLine("},");
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
        sb.AppendLine(" ]");
        return sb.ToString();


    }
  
}