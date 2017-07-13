using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Text;

public partial class workflow_ServeList : System.Web.UI.Page
{

    protected void Page_Load(object sender, EventArgs e)
    {
        string connectstr = Session["connectstr"].ToString();
        string sql = "";
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString(); 
        if (Request["OperateType"] != null && !string.IsNullOrEmpty(Request["OperateType"].ToString()))
        {
            string OperateType = Request["OperateType"].ToString();
            if (OperateType.Equals("AllServe"))
            {
                string s = "资源编号 as ServeID, 资源名称 as ServeName, " +//,Task.value('(/Task/@name)[1]','varchar(50)') as  任务名," +
                             "资源详细信息.value('(//Layer)[1]','varchar(50)') as ServeType," +
                            "资源详细信息.value('(//LifeCycle)[1]','varchar(50)') as   LifeCycle ";
                //"Task.value('(//LifeCycle)[1]','varchar(50)') as  任务释放时间," +
                //"Task.value('(//PlanEndTime)[1]','varchar(50)') as  任务计划结束时间," +
                //"Task.value('(//Description)[1]','varchar(500)') as  任务描述," +
                //"Task.value('(//Accuracy)[1]','varchar(50)') as  精度";
                string ServiceIDs = sqlExecute.sqlmanage.GetUniqueRecord("select * from Service_Task where TaskID=" + Request["TaskID"].ToString(), connectstr, new string[] { "ServiceID" });
                sql = "Set ARITHABORT ON select  " + s + "  from ServResource where 资源编号 not in ('" + string.Join("','", ServiceIDs.Split('|')) + "')";
                // sql = "Set ARITHABORT ON select  " + s + "  from ServResource where Task.value('(/Task/@name)[1]','varchar(50)')='" + Request["taskName"] + "'";
                Response.Write(GetJsonStr(sql, PlatForm_connectstr));

                Response.End();
                Response.Clear();

            }
            else if (OperateType.Equals("AlreadyChoosedService"))
            {
                string s = "资源编号 as ServeID, 资源名称 as ServeName, " +//,Task.value('(/Task/@name)[1]','varchar(50)') as  任务名," +
                             "资源详细信息.value('(//Layer)[1]','varchar(50)') as ServeType," +
                            "资源详细信息.value('(//LifeCycle)[1]','varchar(50)') as   LifeCycle ";
                //"Task.value('(//LifeCycle)[1]','varchar(50)') as  任务释放时间," +
                //"Task.value('(//PlanEndTime)[1]','varchar(50)') as  任务计划结束时间," +
                //"Task.value('(//Description)[1]','varchar(500)') as  任务描述," +
                //"Task.value('(//Accuracy)[1]','varchar(50)') as  精度";
                string ServiceIDs = sqlExecute.sqlmanage.GetUniqueRecord("select * from Service_Task where TaskID=" + Request["TaskID"].ToString(), connectstr, new string[] { "ServiceID" });
                sql = "Set ARITHABORT ON select  " + s + "  from ServResource where 资源编号  in ('" + string.Join("','", ServiceIDs.Split('|')) + "')";
                // sql = "Set ARITHABORT ON select  " + s + "  from ServResource where Task.value('(/Task/@name)[1]','varchar(50)')='" + Request["taskName"] + "'";
                Response.Write(GetJsonStr(sql, PlatForm_connectstr));

                Response.End();
                Response.Clear();

            }
            else if (Request["OperateType"].ToString().Equals("SearchServe"))
            {
                string s = "资源编号 as ServeID, 资源名称 as ServeName, " +//,Task.value('(/Task/@name)[1]','varchar(50)') as  任务名," +
                             "资源详细信息.value('(//Layer)[1]','varchar(50)') as ServeType," +
                            "资源详细信息.value('(//LifeCycle)[1]','varchar(50)') as   LifeCycle ";
                string filter = "";
                if (Request["key1_serveName"] != null && !Request["key1_serveName"].ToString().Equals(""))
                    filter += " and 资源名称 like '%" + Request["key1_serveName"].ToString().Trim() + "%' ";
                if (Request["key2_Type"] != null && !Request["key2_Type"].ToString().Equals(""))
                {
                    if (Request["key1_Condition1"].ToString().Trim().Equals("not"))
                        filter += " and  资源详细信息.value('(//Layer)[1]','varchar(50)') not like '%" + Request["key2_Type"].ToString().Trim() + "%' ";
                    else
                        filter += Request["key1_Condition1"].ToString().Trim() + "  资源详细信息.value('(//Layer)[1]','varchar(50)') like '%" + Request["key2_Type"].ToString().Trim() + "%' ";
                }
                if (Request["key3_Region"] != null && !Request["key3_Region"].ToString().Equals(""))
                {
                    if (Request["key1_Condition1"].ToString().Trim().Equals("not"))
                        filter += " and  资源详细信息.value('(//Address)[1]','varchar(50)') not like '%" + Request["key3_Region"].ToString().Trim() + "%' ";
                    else
                        filter += Request["key2_Condition2"].ToString().Trim() + "  资源详细信息.value('(//Address)[1]','varchar(50)') like '%" + Request["key3_Region"].ToString().Trim() + "%' ";
                }
                if (Request["key4_RegisterDate"] != null && !Request["key4_RegisterDate"].ToString().Equals(""))
                    filter += Request["key3_Condition3"].ToString().Trim() + "  注册时间 " + Request["key4_DateCondition4"].ToString() + "'" + Request["key4_RegisterDate"].ToString().Trim() + "' ";

                sql = "select " + s + " from ServResource where 资源编号 is not null  " + filter;
                Response.Write(GetJsonStr(sql, PlatForm_connectstr));

                Response.End();
                Response.Clear();

            }
            else if (OperateType.Equals("AddServiceForTask"))
            {
                string msg = null;
                bool allsuccess = true;
                if (!string.IsNullOrEmpty(Request["TaskID"]))
                {
                    int TaskID = int.Parse(Request["TaskID"]);
                    if (!string.IsNullOrEmpty(Request["NeedAddServiceIDs"]))
                    {

                        string[] temp = Request["NeedAddServiceIDs"].ToString().Split(',');
                        foreach (string s in temp)
                        {
                            sql = "insert into Service_Task (TaskID,ServiceID) values (" + TaskID + ",'" + s + "')";
                            if (!sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
                            {

                                allsuccess = false;
                                msg += s + ",";
                            }
                            if (allsuccess)
                            {
                                msg = "任务绑定的服务添加成功！";
                            }
                            else
                            {
                                msg = msg.Remove(msg.LastIndexOf(','), 1) + "添加失败！";
                            }
                        }
                    }
                    if (!string.IsNullOrEmpty(Request["NeedDeleteServiceIDs"]))
                    {

                        string NeedDeleteServiceIDs = string.Join("','", Request["NeedDeleteServiceIDs"].ToString().Split(','));
                        sql = "delete from   Service_Task where ServiceID in  ('" + NeedDeleteServiceIDs + "') and TaskID=" + TaskID;
                        if (!sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
                        {
                            msg += "任务绑定的服务删除失败！";
                        }

                    }
                }

                Response.Clear();
                Response.Write(msg.Remove(msg.LastIndexOf(','), 1) + msg);
                return;


            }

        }



    }
    protected string GetJsonStr(string Sql, string connectstr)
    {
        SqlConnection con = new SqlConnection(connectstr);
        con.Open();
        SqlCommand cmd = new SqlCommand(Sql, con);
        SqlDataReader sdr = cmd.ExecuteReader();
        return GetJSON(sdr);
    }


    public string GetJSON(SqlDataReader drValue)
    {
        int count = 0;
        if (!drValue.HasRows)
            return "";
        else
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine(" rows:[");
            try
            {
                while (drValue.Read())
                {
                    count++;
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
            StringBuilder json = new StringBuilder();
            string str1 = "{results:" + count.ToString() + ",";
            json.AppendLine(str1);
            json.AppendLine(sb.ToString());
            json.AppendLine("}");

            return json.ToString();

        }
    }
}