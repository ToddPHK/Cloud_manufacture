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
using System.Data;
using System.Xml;

public partial class PDM_TaskTreeData : System.Web.UI.Page
{
    string gg;
    protected void Page_Load(object sender, EventArgs e)
    {
        string connectstr = Session["connectstr"].ToString();
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();
            if (OperateType.Equals("ProjectTaskTree"))
            {
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeFullJson ff = new TreeFullJson.TreeFullJson(connectstr, true);
                string tempsql = "select  ID,Name,ParentID,Chargor,TaskList.BelongProjectTreeNode  from ProjectTaskTree,TaskList where ParentID is null  and ProjectTaskTree.ID*=TaskList.BelongProjectTreeNode";
                sb.AppendFormat("[{0}]", ff.fillTreeView(tempsql, new string[] { "id", "text" }, "ID", "ParentID", " ProjectTaskTree.ID*=TaskList.BelongProjectTreeNode "));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("ProjectTaskTreeNoCheckBox"))
            {
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeFullJson ff = new TreeFullJson.TreeFullJson(connectstr, false);
                string tempsql = "select  ID,Name,ParentID,Chargor  from ProjectTaskTree where ParentID is null ";
                sb.AppendFormat("[{0}]", ff.fillTreeView(tempsql, new string[] { "id", "text" }, "ID", "ParentID"));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("StandardTaskTreeNoCheckBox"))
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
            else if (OperateType.Equals("ViewTaskProgress"))
            {
                Response.Write(GetTaskProgress(PlatForm_connectstr, Request["TaskID"].ToString()));
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("SendShortMsg"))
            {

                string[] userInfs = sqlExecute.sqlmanage.GetUniqueRecord("select 人员ID as ID,移动电话 as Telephone from EmployeeList where 人员ID in (" + Request["UserIDs"].ToString() + ")", connectstr, new string[] { "Telephone", "ID" }).Split('|');
                string msg = Request["Message"].ToString();
                if (msg.Trim().Equals(""))
                {
                    Response.Write("不能发送空内容!");
                    Response.End();
                    Response.Clear();
                    return;
                }
                else
                {
                    foreach (string userInf in userInfs)
                    {

                        ClassLibrary1.WebCloudSendMsg.MySendMsg.sendMsg(userInf.Split(',')[0].Trim(), "来自企业管理员的信息：" + msg, "-1", Session["userID"].ToString(), userInf.Split(',')[1].Trim(), Session["ENTID"].ToString());

                    }
                    Response.Write("发送成功!");
                    Response.End();
                    Response.Clear();
                }


            }

        }
    }
    public string GetTaskProgress(string PlatForm_connectstr, string TaskID)
    {
        StringBuilder TaskProgressData = new StringBuilder();
        SqlConnection con = new SqlConnection(PlatForm_connectstr);
        string sql = "select Schedule  from  TaskList where UserTaskID=" + TaskID + " and Publisher=" + Session["ENTID"].ToString();
        string TaskProgress = sqlExecute.sqlmanage.GetUniqueRecord(sql, PlatForm_connectstr, new string[] { "Schedule" });
        XmlDocument xmlDoc = new XmlDocument();
        try
        {
            xmlDoc.LoadXml(TaskProgress);
            XmlNodeList Nodes = xmlDoc.SelectNodes("/root/Schedule");
            if (Nodes.Count > 0)
            {
                TaskProgressData.AppendLine("{ReplyData:[");
                foreach (XmlNode Node in Nodes)
                {
                    XmlNodeList nodes_temp = Node.ChildNodes;
                    TaskProgressData.AppendLine("{");
                    foreach (XmlNode NDtemp in nodes_temp)
                    {
                        XmlElement xe = (XmlElement)NDtemp;

                        //if (((XmlElement)Node).GetAttribute("style") == null || !((XmlElement)Node).GetAttribute("style").Contains("fillColor=#FF0000"))
                        //{
                        //    Nodes.Add(Node.ParentNode);
                        //}

                        TaskProgressData.AppendFormat("'{0}':'{1}',", xe.Name, xe.InnerText);
                    }
                    TaskProgressData.Remove(TaskProgressData.ToString().LastIndexOf(','), 1);
                    TaskProgressData.AppendLine("},");

                }
                TaskProgressData.Remove(TaskProgressData.ToString().LastIndexOf(','), 1);
                TaskProgressData.Append("]}");
                return TaskProgressData.ToString();
            }
            else
            {
                return "";
            }
        }
        catch (Exception err)
        {
            return "";
        }



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
    //public string GetLastReply(string PlatForm_connectstr, string topicID)
    //{
    //    SqlConnection con = new SqlConnection(PlatForm_connectstr);
    //    string sql = "select ReplyContent,CompanyID,Score,ReplyTime,userName as  ReplerName,Reply_Topic.UserID as ReplerID from  Reply_Topic,UserInfor where Reply_Topic.CompanyID*=UserInfor.UserID and TopicID=" + topicID + " order by ReplyTime asc";
    //    try
    //    {

    //        SqlCommand cmd = new SqlCommand(sql, con);
    //        SqlDataAdapter ada = new SqlDataAdapter(cmd);
    //        DataSet ds = new DataSet();
    //        int count = ada.Fill(ds, "pppp");

    //        if (ds.Tables["pppp"].Rows.Count > 0)
    //        {
    //            StringBuilder sb = new StringBuilder();
    //            sb.AppendLine("{ReplyData:[");
    //            foreach (DataRow dr in ds.Tables["pppp"].Rows)
    //            {
    //                sb.Append("{");
    //                sb.AppendFormat("'ReplyContent':'{0}',", dr["ReplyContent"]);
    //                sb.AppendFormat("'ReplyTime':'{0}',", dr["ReplyTime"]);
    //                sb.AppendFormat("'Score':'{0}',", dr["Score"]);
    //                if (dr["CompanyID"].ToString().Equals("-1"))
    //                {
    //                    sb.Append("'ReplerName':'游客'");
    //                }
    //                else if (dr["ReplerName"].ToString().Equals(""))//已注册的公司注销 ，数据库没了该公司的数据信息
    //                {
    //                    sb.Append("'ReplerName':'未知'");
    //                }
    //                else if (dr["ReplerID"].ToString().Equals("-1"))
    //                {
    //                    sb.AppendFormat("'ReplerName':'{0}'", dr["ReplerName"]);
    //                }
    //                else
    //                {
    //                    sb.AppendFormat("'ReplerName':'【{0}】内的人员'", dr["ReplerName"]);
    //                }

    //                sb.AppendLine("},");
    //            }
    //            sb.Remove(sb.ToString().LastIndexOf(','), 1);
    //            sb.Append("]}");
    //            return sb.ToString();

    //        }

    //        else
    //        {
    //            return "";
    //        }

    //    }
    //    catch (Exception ex)
    //    {
    //        throw new Exception(ex.Message);
    //    }

    //    finally
    //    {
    //        con.Close();
    //    }


    //}
}