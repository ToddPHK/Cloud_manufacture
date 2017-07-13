using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Text;
using System.Data;

public partial class PlatForm_Admin_WebPage_TaskManage_WFTableData : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        int start = 0;
        int limit = 10;
        string sql = "";
        string getcountSql = "";
        //connectstr = Session["connectstr"].ToString();
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        if (PlatForm_connectstr != "")
        {
            //  connectstr = "server=(local);Initial Catalog=" + connectstr + ";User ID=sa;Password=zju308;connect timeout=30";
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

                sql = "select top " + limit +
                    " WorkFlow.*,WorkFlowState.StateName,UserInfor.userName as PublisherName  from WorkFlow,WorkFlowState,UserInfor where ID not in (select top " + start
                        + " ID from WorkFlow order by PublishTime) and WorkFlow.WFState*= WorkFlowState.StateID and WorkFlow.Publisher*=UserInfor.UserID  order by PublishTime";
                getcountSql = "select  ID  from WorkFlow";

            }
            else if (Request["OperateType"].Equals("search"))
            {
                string filter = "";
                if (Request["WorkFlowName"] != null && !Request["WorkFlowName"].ToString().Equals(""))
                    filter += " and WorkFlowName like '%" + Request["WorkFlowName"].ToString().Trim() + "%'";
                if (Request["WorkFlowEnt"] != null && !Request["WorkFlowEnt"].ToString().Equals(""))
                    filter += " and Publisher in (select UserID from UserInfor where userName like '%" + Request["WorkFlowEnt"].ToString().Trim() + "%' )";
                sql = "select top " + limit +
                    " WorkFlow.*,WorkFlowState.StateName,UserInfor.userName as PublisherName  from WorkFlow,WorkFlowState,UserInfor where ID not in (select top " + start
                        + " ID from WorkFlow where ID>-1 " + filter+"  order by PublishTime) and WorkFlow.WFState*= WorkFlowState.StateID and WorkFlow.Publisher*=UserInfor.UserID  " + filter+"  order by PublishTime";
                getcountSql = "select  ID  from WorkFlow where ID>-1 " + filter;
            }

            Response.Write(GetWorkFlowData(sql, getcountSql, PlatForm_connectstr));
            Response.End();
            Response.Clear();
        }

    }

    public string GetWorkFlowData(string Sql, string CountSql, string PlatForm_connectstr)
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
                    string sql = "Set ARITHABORT ON select  " +
" TaskList.ID,TaskList.TaskDetailInf,TaskState.TaskStateName,ServiceTree.StandardTaskName,TaskName  from TaskList,ServiceTree,TaskState where  " +
" TaskList.TaskState*= TaskState.TaskStateID and  TaskList.TaskDetailInf.value('(/Task/@StandardTaskID)[1]','int')*= ServiceTree.NodeId and  WorkFlowID=" + drValue.GetValue(drValue.GetOrdinal("ID"));
                    sb.AppendFormat("'WFTaskInfo':'{0}',", GetWF_TaskData(PlatForm_connectstr, sql));
                    for (int i = 0; i < drValue.FieldCount; i++)
                    {
                        sb.AppendFormat("'{0}':'{1}',", drValue.GetName(i), drValue.GetValue(i));
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
               // SqlConnection con = new SqlConnection(PlatForm_connectstr);
                SqlCommand cmd1 = new SqlCommand(CountSql, con);
                SqlDataAdapter ada = new SqlDataAdapter(cmd1);
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
    public string GetWF_TaskData(string PlatForm_connectstr, string Sql)
    {
        SqlConnection con = new SqlConnection(PlatForm_connectstr);
        SqlCommand cmd = new SqlCommand(Sql, con);
        con.Open();
        SqlDataReader drValue = cmd.ExecuteReader();
        if (!drValue.HasRows)
            return "";
        else
        {
            StringBuilder sb = new StringBuilder();

            try
            {
                sb.Append("[");
                while (drValue.Read())
                {
                    sb.Append("[");
                    for (int i = 0; i < drValue.FieldCount; i++)
                    {
                       // sb.AppendFormat("'{0}':'{1}',", drValue.GetName(i), drValue.GetValue(i));
                        sb.AppendFormat("'{0}',",  drValue.GetValue(i));
                    }
                    sb.Remove(sb.ToString().LastIndexOf(','), 1);
                    sb.AppendLine("],");
                }
                sb.Remove(sb.ToString().LastIndexOf(','), 1);
                sb.Append("]");
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                drValue.Close();
            }
    
             return  Server.UrlEncode(sb.ToString()).Replace("+", "%20"); 
            // return  HttpUtility.UrlEncode(sb.ToString()).Replace("+", "%20"); 
        }
    }

}