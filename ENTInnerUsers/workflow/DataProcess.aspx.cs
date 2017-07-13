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
    protected void Page_Load(object sender, EventArgs e)
    {
        string connectstr = Session["connectstr"].ToString();
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();


            if (OperateType.Equals("State_Color"))
            {
                string sql = "select TaskStateID,ColorValue from TaskState";
                string s = GetJsonStr(sql, PlatForm_connectstr, "TaskStateID", "ColorValue");
                Response.Write(s);
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
            else if (OperateType.Equals("Task_State"))
            {
                string sql = "select TaskID,TaskState from TaskList where TaskID in (" + Request["TaskIDs"].ToString() + ")";
                string s = GetJsonStr(sql, connectstr, "TaskID", "TaskState");
                Response.Write(s);
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("TaskDicWord"))
            {
                string sql = "select AttributeName as Name,Chinese as Text from Attributes";
                string s = GetJsonStr(sql, PlatForm_connectstr, "Name", "Text");
                Response.Write(s);
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
            else if (OperateType.Equals("OptimizingMatch"))
            {
                if (sqlExecute.sqlmanage.HasRecord(connectstr, " select TaskID from TaskList where WorkFlowID=" + Request["WorkFID"] + " and TaskState!=4"))
                {

                    Response.Write("流程绑定任务的状态已不能进行此操作！");
                }
                else
                {
                    sqlExecute.sqlmanage.ExecuteSQL("update TaskList set TaskState=8 where WorkFlowID=(select ID from WorkFlow where UserWorkFlowID=" + Request["WorkFID"].ToString() + " and Publisher=" + Session["ENTID"].ToString() + ")", PlatForm_connectstr);
                    sqlExecute.sqlmanage.ExecuteSQL("update TaskList set TaskState=8 where WorkFlowID=" + Request["WorkFID"].ToString(), connectstr);
                    Response.Write("操作成功，系统将会为你的流程进行优化匹配。");
                }
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("WorkFlowTask"))
            {
                string sql = "Set ARITHABORT ON select TaskList.*,workflow.name as WorkFlowName,TaskType.TypeName,TaskState.TaskStateName,TaskDetailInf.value('(/Task/@StandardTaskID)[1]','int') as StandardTaskID,TaskDetailInf.value('(/Task/@StandardTaskID)[1]','int') as  TaskTemplateID,EmployeeList.人员名称 as CreatorName,P1.Name as ProjectName,P2.Name as PrjTaskTreeName,P2.Chargor as TaskCreator,ProjList.项目负责人 as ProjectChargorID from TaskList,workflow,TaskState,TaskType,EmployeeList,ProjectTaskTree P1,ProjectTaskTree P2,ProjList  " +
                    "where  TaskList.TaskState*= TaskState.TaskStateID and  TaskList.TypeID*=TaskType.TypeID and  TaskList.WorkFlowID*=workflow.ID  and TaskList.BelongProject=P1.ID and TaskList.BelongProjectTreeNode=P2.ID and P2.ProjectID=ProjList.序号 and P2.Chargor=EmployeeList.人员ID and  WorkFlowID =(" + Request["WorkFlowID"].ToString() + ") order by TaskCreateDate";
                string getcountSql = "select  TaskID  from TaskList where WorkFlowID=" + Request["WorkFlowID"].ToString();
                SQLToJson.ReaderSQLToJson.SetCount(getcountSql, connectstr);
                Response.Write(GetJsonStr(sql, connectstr));

                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("SendShortMsg"))
            {

                string[] userInfs = sqlExecute.sqlmanage.GetUniqueRecord("select 人员ID as ID,移动电话 as Telephone from EmployeeList where 人员ID in ( select Chargor from ProjectTaskTree where ID in (select BelongProjectTreeNode from TaskList where TaskID in ( " + Request["TaskIDs"].ToString() + ")))", connectstr, new string[] { "Telephone", "ID" }).Split('|');
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

                        ClassLibrary1.WebCloudSendMsg.MySendMsg.sendMsg(userInf.Split(',')[0].Trim(), "来自" + Session["username"] + "的信息：" + msg, Session["userID"].ToString(), Session["ENTID"].ToString(), userInf.Split(',')[1].Trim(), Session["ENTID"].ToString());

                    }
                    Response.Write("发送成功!");
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
            string Json = SQLToJson.ReaderSQLToJson.GetJSON(sdr);
            return Json.ToString();
        }
    }
    protected string GetJsonStr(string Sql, string connectstr,string Field1,string Field2)
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
}