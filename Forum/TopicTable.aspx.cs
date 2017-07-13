using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using System.Data.SqlClient;
using System.Data;
using SQLToTreeJson;

public partial class ENTInnerUsers_PDM_Forum_TopicTable : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        int start = 0;
        int limit = 10;
        string sql;
        string getcountSql;
        // string  connectstr = Session["connectstr"].ToString();
        //  string PlatForm_connectstr = "server=(local);Initial Catalog=CloudMDB;User ID=sa;Password=zju308;connect timeout=30";
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        //  Session["PlatForm_connectstr"] = PlatForm_connectstr;
        if (Request["OperateType"] == null || Request["OperateType"].ToString().Equals("LoadAllTopic"))
        {
            string CompanyID;
            string CreatorID;
            if (Session["UserType"] == null)
            {
                CompanyID = "-2";
                CreatorID = "-2";
            }
            else if (Session["UserType"].ToString().Equals("ENTUser"))
            {
                CompanyID = Session["ENTID"].ToString();
                CreatorID = "-1";

            }
            else
            {
                CompanyID = Session["ENTID"].ToString();
                CreatorID = Session["userID"].ToString();

            }

            sql = "select top " + limit + " Forum_Topic.*,UserInfor.userName as CreatorName,TaskTemplate.fieldLabel as TemplateName " +
" from Forum_Topic,UserInfor,TaskTemplate where ID not in (select top " + start
   + " ID from Forum_Topic) and Forum_Topic.CompanyID *=UserInfor.UserID and Forum_Topic.TemplateID*=TaskTemplate.TaskTemplateID  order by CreateTime desc";
            getcountSql = "select  ID  from Forum_Topic ";
            Response.Write(GetTopicData(sql, getcountSql, PlatForm_connectstr, CompanyID, CreatorID));

            Response.End();
            Response.Clear();

        }
        else if (Request["OperateType"].ToString().Equals("LoadTopicByTempalte"))
        {
            string CompanyID;
            string CreatorID;
            if (Session["UserType"] == null)
            {
                CompanyID = "-2";
                CreatorID = "-2";
            }
            else if (Session["UserType"].ToString().Equals("ENTUser"))
            {
                CompanyID = Session["ENTID"].ToString();
                CreatorID = "-1";

            }
            else
            {
                CompanyID = Session["ENTID"].ToString();
                CreatorID = Session["userID"].ToString();

            }
            string[] childIDs = new TreeJson().getChildID("TaskTemplate", PlatForm_connectstr, "TaskTemplateID", "TaskTemplateParentID", "select TaskTemplateID,TaskTemplateParentID from  TaskTemplate  where TaskTemplateID=" + Request["TempalteID"].ToString());
            sql = "select   Forum_Topic.*,UserInfor.userName as CreatorName,TaskTemplate.fieldLabel as TemplateName " +
" from Forum_Topic,UserInfor,TaskTemplate where  Forum_Topic.CompanyID *=UserInfor.UserID and Forum_Topic.TemplateID*=TaskTemplate.TaskTemplateID and TemplateID in (" + string.Join(",", childIDs) + ") order by CreateTime desc";
            getcountSql = "select  ID  from Forum_Topic where TemplateID in  (" + string.Join(",", childIDs) + ") ";
            Response.Write(GetTopicData(sql, getcountSql, PlatForm_connectstr, CompanyID, CreatorID));

            Response.End();
            Response.Clear();
        }

    }
    public string GetTopicData(string Sql, string CountSql, string PlatForm_connectstr, string CompanyID, string CreatorID)
    {
        int count = 0;
        SqlConnection con = new SqlConnection(PlatForm_connectstr);
        SqlCommand cmd = new SqlCommand(Sql, con);
        con.Open();
        SqlDataReader drValue = cmd.ExecuteReader();
        if (!drValue.HasRows)
        {
            return "";
        }

        else
        {

            StringBuilder sb = new StringBuilder();
            sb.AppendLine(" rows:[");
            try
            {
                while (drValue.Read())
                {
                    sb.Append("{");
                    string sql = "select ReplyContent as LastReplyContent,CompanyID,ReplyTime as LastReplyTime,userName as LastRepler,Reply_Topic.UserID as LastReplerID from  Reply_Topic,UserInfor where Reply_Topic.CompanyID*=UserInfor.UserID and TopicID=" + drValue.GetValue(drValue.GetOrdinal("ID")) + " order by ReplyTime desc";
                    sb.Append(GetLastReply(PlatForm_connectstr, sql, drValue.GetValue(drValue.GetOrdinal("ID")).ToString(), CompanyID, CreatorID));
                    sb.AppendFormat("'ID':'{0}',", drValue.GetValue(drValue.GetOrdinal("ID")));
                    sb.AppendFormat("'TopicName':'{0}',", drValue.GetValue(drValue.GetOrdinal("TopicName")));
                    sb.AppendFormat("'TopicContent':'{0}',", drValue.GetValue(drValue.GetOrdinal("TopicContent")));
                    sb.AppendFormat("'CreateTime':'{0}',", drValue.GetValue(drValue.GetOrdinal("CreateTime")));
                    sb.AppendFormat("'TemplateName':'{0}',", drValue.GetValue(drValue.GetOrdinal("TemplateName")));
                    if (drValue.GetValue(drValue.GetOrdinal("CompanyID")).ToString().Equals(CompanyID) &&
                        drValue.GetValue(drValue.GetOrdinal("CreatorID")).ToString().Equals(CreatorID))
                    {
                        sb.Append("'CreatorName':'本人',");
                    }
                    else if (drValue.GetValue(drValue.GetOrdinal("CompanyID")).ToString().Equals("-1"))//如果企业ID为‘-1’则必是游客创建的topic
                    {
                        sb.Append("'CreatorName':'游客',");
                    }
                    else if (drValue.GetValue(drValue.GetOrdinal("CreatorName")).ToString().Equals(""))//已注册的公司注销 ，数据库没了该公司的数据信息  如果数据库的值为null 这里得到的值为""
                    {
                        sb.Append("'CreatorName':'未知',");
                    }
                    else if (drValue.GetValue(drValue.GetOrdinal("CreatorID")).ToString().Equals("-1"))
                    {
                        sb.AppendFormat("'CreatorName':'{0}',", drValue.GetValue(drValue.GetOrdinal("CreatorName")));

                    }
                    else
                    {
                        sb.AppendFormat("'CreatorName':'【{0}】内的人员',", drValue.GetValue(drValue.GetOrdinal("CreatorName")));
                    }

                    //根据发布企业和发布企业数据库中的流程ID找流程的任务



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
            StringBuilder json = new StringBuilder();


            {
                SqlCommand cmd1 = new SqlCommand(Sql, con);
                SqlDataAdapter ada = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();
                count = ada.Fill(ds, "pppp");

            }

            string str1 = "{results:" + count.ToString() + ",";
            json.AppendLine(str1);
            json.AppendLine(sb.ToString());
            json.AppendLine("}");

            return json.ToString();
        }
    }
    public string GetLastReply(string PlatForm_connectstr, string Sql, string topicID, string CompanyID, string CreatorID)
    {
        SqlConnection con = new SqlConnection(PlatForm_connectstr);
        con.Open();
        try
        {

            SqlCommand cmd = new SqlCommand(Sql, con);
            SqlDataAdapter ada = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            int count = ada.Fill(ds, "pppp");

            if (ds.Tables["pppp"].Rows.Count > 0)
            {
                StringBuilder sb = new StringBuilder();
                DataRow dr = ds.Tables["pppp"].Rows[0];
                sb.AppendFormat("'ReplyCount':'{0}',", count);
                sb.AppendFormat("'LastReplyContent':'{0}',", dr["LastReplyContent"]);
                sb.AppendFormat("'LastReplyTime':'{0}',", dr["LastReplyTime"]);
                if (dr["CompanyID"].ToString().Equals(CompanyID) && dr["LastReplerID"].ToString().Equals(CreatorID))
                {
                    sb.Append("'LastRepler':'本人',");
                }
                else  if (dr["CompanyID"].ToString().Equals("-1"))
                {
                    sb.Append("'LastRepler':'游客',");
                }
                else if (dr["LastRepler"].ToString().Equals(""))//已注册的公司注销 ，数据库没了该公司的数据信息
                {
                    sb.Append("'LastRepler':'未知',");
                }
                else if (dr["LastReplerID"].ToString().Equals("-1"))
                {
                    sb.AppendFormat("'LastRepler':'{0}',", dr["LastRepler"]);
                }
                else
                {
                    sb.AppendFormat("'LastRepler':'【{0}】内的人员',", dr["LastRepler"]);
                }
                {
                    SqlCommand cmd2 = new SqlCommand("select avg(Score) from Reply_Topic where TopicID=" + topicID, con);

                    sb.AppendFormat("'AvgScore':'{0}',", cmd2.ExecuteScalar());

                }
                return sb.ToString();

            }

            else
            {
                return "'LastReplyContent':'','LastReplyTime':'-1','LastRepler':'-1','ReplyCount':'0',AvgScore:'还未评论',";
            }



        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }

        finally
        {
            con.Close();
        }


    }
}