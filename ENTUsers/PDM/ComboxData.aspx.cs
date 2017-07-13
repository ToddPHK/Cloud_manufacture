using System;
using System.Text;
using System.Data.SqlClient;
using System.Data;

public partial class ENTUsers_PDM_ComboxData : System.Web.UI.Page
{
    //判断各种操作类型
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Request["OperateType"] != null)
        {
            CloudBLL.Entprise bllEnt = new CloudBLL.Entprise();
            string connectstr = Session["ConnString"].ToString();
            string data = "";
            string OperateType = Request["OperateType"].ToString();
            string sql = "";
            int entId = (int)Session["UserID"];
            if (OperateType.Equals("employee"))
            {
                if (!string.IsNullOrEmpty(Request["TreeNumber"]))//这个好像暂时没有用
                {
                    data = ToArrayString(connectstr, "select 人员ID,人员名称 from EmployeeList where 人员ID not in (select EmployeeID from GroupVSEmploy where PrjGroupID=" + Request["TreeNumber"].ToString() + ") and 归属角色 in (select RoleID from Group_Role where PrjGroupID=" + Request["TreeNumber"].Trim() + ")", "人员ID", "人员名称");
                }
            }
            else if (OperateType.Equals("allemployee"))
            {
                sql = "select 人员ID,人员名称 from EmployeeList WHERE entId=" + entId;
                data = bllEnt.GetComboData(sql, "人员ID", "人员名称", connectstr);
            }
            else if (OperateType.Equals("ProjectList"))
            {
                sql = "select 项目编号,项目名称 from ProjList WHERE entId = " + entId;
                data = bllEnt.GetComboData(sql, "项目编号", "项目名称", connectstr);
            }
            else if (OperateType.Equals("ProjectState"))
            {
                sql = "select StateID,StateText from ProjectState";
                data = bllEnt.GetComboData(sql, "StateID", "StateText", connectstr);
            }
            else if (OperateType.Equals("ProjectType"))
            {
                sql = "select TypeID,TypeText from ProjectType";
                data = bllEnt.GetComboData(sql, "TypeID", "TypeText", connectstr);
            }
            else if (OperateType.Equals("role"))
            {
                sql = "select ID,Name from RoleList WHERE entId = " + entId;
                data = bllEnt.GetComboData(sql, "ID", "Name", connectstr);
            }
            else if (OperateType.Equals("DepartList"))
            {
                sql = "select 部门编号,部门名称 from DeptList WHERE entId = " + entId;
                data = bllEnt.GetComboData(sql, "部门编号", "部门名称", connectstr);
            }
            else if (OperateType.Equals("TaskState"))
            {
                sql = "select TaskStateID,TaskStateName from TaskState";
                data = bllEnt.GetComboData(sql, "TaskStateID", "TaskStateName", connectstr);
            }
            Response.Write(data);
            Response.End();
            Response.Clear();

        }
    }

    //转化成Json格式
    protected string ToArrayString(string connectstr, string SQl, string idfield, string textfield)
    {
        StringBuilder sb = new StringBuilder();
        SqlConnection con = new SqlConnection(connectstr);
        SqlCommand cmd = new SqlCommand(SQl, con);
        SqlDataAdapter ada = new SqlDataAdapter(cmd);
        DataSet ds = new DataSet();
        int counter = ada.Fill(ds, "temptable");
        if (ds != null)
        {
            int i = 1;
            sb.Append("[");
            foreach (DataRow dr in ds.Tables["temptable"].Rows)
            {
                if (counter == 1)
                {
                    sb.Append("['" + dr[idfield].ToString() + "','" + dr[textfield].ToString() + "']");
                }
                else
                {
                    if (i == 1)
                        sb.Append("['" + dr[idfield].ToString() + "','" + dr[textfield].ToString() + "']");
                    else
                        sb.Append(",['" + dr[idfield].ToString() + "','" + dr[textfield].ToString() + "']");

                }
                i++;
            }
            sb.Append("]");
            return sb.ToString();
        }
        return null;
    }
}