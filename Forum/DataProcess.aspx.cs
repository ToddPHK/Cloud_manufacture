using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using System.Data.SqlClient;
using SQLToTreeJson;
using System.Data;

public partial class PlatForm_Admin_WebPage_StandardTaskTypeTree_DataProcess : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

        // string  connectstr = Session["connectstr"].ToString();
        //  string PlatForm_connectstr = "server=(local);Initial Catalog=CloudMDB;User ID=sa;Password=zju308;connect timeout=30";
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        Session["PlatForm_connectstr"] = PlatForm_connectstr;

        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();
            if (OperateType.Equals("AllStandardTaskType"))
            {
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeFullJson ff = new TreeFullJson.TreeFullJson(PlatForm_connectstr, false);
                sb.AppendFormat("[{0}]", ff.fillTreeView("select NodeId,StandardTaskName,PNodeId from ServiceTree where PNodeId is null ", new string[] { "id", "text" }, "NodeId", "PNodeId"));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();
                return;
            }

            else if (OperateType.Equals("TaskTemplate_AllNode"))
            {
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeFullJson ff = new TreeFullJson.TreeFullJson(PlatForm_connectstr, false);
                sb.AppendFormat("[{0}]", ff.fillTreeView("select  TaskTemplateID,Coalesce(fieldLabel,Chinese) as fieldLabel,Type,TaskTemplateParentID from TaskTemplate,Attributes where TaskTemplate.DicWordID*=Attributes.AttributeID and TaskTemplateParentID is null ", new string[] { "id", "text", "type" }, "TaskTemplateID", "TaskTemplateParentID", " TaskTemplate.DicWordID*=Attributes.AttributeID  "));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();
                return;
            }
            else if (OperateType.Equals("TaskTemplate_CertainNode"))
            {
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeFullJson ff = new TreeFullJson.TreeFullJson(PlatForm_connectstr, false);
                string[] childIDs = new TreeJson().getChildID("ServiceTree", PlatForm_connectstr, "NodeId", "PNodeId", "select NodeId,PNodeId from  ServiceTree  where NodeId=" + Request["StandardTaskID"].ToString());
                sb.AppendFormat("[{0}]", ff.fillTreeView("select TaskTemplateID,Coalesce(fieldLabel,Chinese) as fieldLabel,Type,TaskTemplateParentID from TaskTemplate,Attributes where  TaskTemplate.DicWordID*=Attributes.AttributeID and  TaskTemplateParentID is null and BidingStandardTaskID in (" + string.Join(",", childIDs) + ")", new string[] { "id", "text","type" }, "TaskTemplateID", "TaskTemplateParentID", " TaskTemplate.DicWordID*=Attributes.AttributeID  "));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();
                return;
            }
            else if (OperateType.Equals("ViewReply"))
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
                Response.Write(GetLastReply(PlatForm_connectstr, Request["TopicID"].ToString(), CompanyID, CreatorID));
                Response.End();
                Response.Clear();
                return;
            }
            else if (OperateType.Equals("NewTopic"))
            {

                string temp = "";
                temp += "'" + Request["title"] + "',";
                temp += "'" + Request["TopicContent"] + "',";
                temp += "'" + Request["ID"] + "',";
                temp += "'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "',";
                if (Session["UserType"] == null)
                {
                    temp += "'-1','-1'";
                }
                else if (Session["UserType"].ToString().Equals("ENTUser"))
                {
                    temp += "'" + Session["ENTID"].ToString() + "','-1'";
                }
                else
                {
                    temp += "'" + Session["ENTID"].ToString() + "','" + Session["userID"].ToString() + "'";

                }
                string sql = "insert into Forum_Topic (TopicName,TopicContent,TemplateID,CreateTime,CompanyID,CreatorID) values (" + temp + ")";

                if (sqlExecute.sqlmanage.ExecuteSQL(sql, PlatForm_connectstr))
                    Response.Write("{success:true,msg:'创建成功！'}");
                else
                    Response.Write("{success:false,msg:'创建失败！'}");
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("AddReply"))
            {
                string temp = "";
                temp += "'" + Request["ReplyContent"] + "',";
                temp += "'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "',";
                temp += "'" + Request["ID"].ToString() + "',";
                temp += "'" + Request["Score"].ToString() + "',";
                if (Session["UserType"] == null)
                {
                    temp += "'-1','-1'";
                }
                else if (Session["UserType"].ToString().Equals("ENTUser"))
                {
                    temp += "'" + Session["ENTID"].ToString() + "','-1'";
                }
                else
                {
                    temp += "'" + Session["ENTID"].ToString() + "','" + Session["userID"].ToString() + "'";

                }
                string sql = "insert into Reply_Topic (ReplyContent,ReplyTime,TopicID,Score,CompanyID,UserID) values (" + temp + ")";

                if (sqlExecute.sqlmanage.ExecuteSQL(sql, PlatForm_connectstr))
                    Response.Write("{success:true,msg:'回复成功！'}");
                else
                    Response.Write("{success:false,msg:'回复失败！'}");
                Response.End();
                Response.Clear();
            }


        }
    }
    public string GetLastReply(string PlatForm_connectstr, string topicID, string CompanyID, string ReplerID)
    {
        SqlConnection con = new SqlConnection(PlatForm_connectstr);
        string sql = "select ReplyContent,CompanyID,Score,ReplyTime,userName as  ReplerName,Reply_Topic.UserID as ReplerID from  Reply_Topic,UserInfor where Reply_Topic.CompanyID*=UserInfor.UserID and TopicID=" + topicID + " order by ReplyTime asc";
        try
        {

            SqlCommand cmd = new SqlCommand(sql, con);
            SqlDataAdapter ada = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            int count = ada.Fill(ds, "pppp");

            if (ds.Tables["pppp"].Rows.Count > 0)
            {
                StringBuilder sb = new StringBuilder();
                sb.AppendLine("{ReplyData:[");
                foreach (DataRow dr in ds.Tables["pppp"].Rows)
                {
                    sb.Append("{");
                    sb.AppendFormat("'ReplyContent':'{0}',", dr["ReplyContent"]);
                    sb.AppendFormat("'ReplyTime':'{0}',", dr["ReplyTime"]);
                    sb.AppendFormat("'Score':'{0}',", dr["Score"]);
                    if (dr["CompanyID"].ToString().Equals(CompanyID) && dr["ReplerID"].ToString().Equals(ReplerID))
                    {
                        sb.Append("'ReplerName':'本人'");
                    }
                    else if (dr["CompanyID"].ToString().Equals("-1"))
                    {
                        sb.Append("'ReplerName':'游客'");
                    }
                    else if (dr["ReplerName"].ToString().Equals(""))//已注册的公司注销 ，数据库没了该公司的数据信息
                    {
                        sb.Append("'ReplerName':'未知'");
                    }
                    else if (dr["ReplerID"].ToString().Equals("-1"))
                    {
                        sb.AppendFormat("'ReplerName':'{0}'", dr["ReplerName"]);
                    }
                    else
                    {
                        sb.AppendFormat("'ReplerName':'【{0}】内的人员'", dr["ReplerName"]);
                    }

                    sb.AppendLine("},");
                }
                sb.Remove(sb.ToString().LastIndexOf(','), 1);
                sb.Append("]}");
                return sb.ToString();

            }

            else
            {
                return "";
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