using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Data;
using System.Text;

public partial class ENTInnerUsers_PDM_prjManege_ProjectTree : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string connectstr = Session["connectstr"].ToString();

        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();
            if (OperateType.Equals("ProjectTaskTree_Data"))
            {
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeFullJson ff = new TreeFullJson.TreeFullJson(connectstr, true);
                string tempsql = "select  Name,ID, ParentID, CreateDate, Creator, Chargor, ProjectID,E1.人员名称 as CreatorPeopleName,E2.人员名称 as ChargorPeopleName,DeptList.部门名称 as Department,ProjList.项目名称 as ProjectName  from ProjectTaskTree,EmployeeList E1,EmployeeList E2,ProjList,DeptList where ParentID is null and ProjectTaskTree.Creator=E1.人员ID and ProjectTaskTree.Chargor=E2.人员ID and ProjectTaskTree.ProjectID=ProjList.序号 and E2.归属部门=DeptList.部门编号 and ProjectID=" + Request["ProjectID"].ToString();
                sb.AppendFormat("[{0}]", ff.fillTreeView(tempsql, new string[] { "Name" }, "ID", "ParentID", " ProjectTaskTree.Creator=E1.人员ID and ProjectTaskTree.Chargor=E2.人员ID and ProjectTaskTree.ProjectID *=ProjList.序号 and E2.归属部门=DeptList.部门编号 "));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("AddProjectTaskTreeNode"))
            {
                string sql1 = "insert into ProjectTaskTree (ParentID,Name,CreateDate,Creator,Chargor,ProjectID) values ('" + Request["ID"].ToString() + "','" + Request["Name"].ToString() + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "','" + Session["userID"].ToString() + "','" + Request["Chargor"].ToString() + "','" + Request["ProjectID"].ToString() + "')";
                if (sqlExecute.sqlmanage.ExecuteSQL(sql1, connectstr))
                    Response.Write("{success:true,msg:'节点添加成功！',tr:'another inf'}");
                else
                    Response.Write("{success:false,msg:'节点行添加失败！',tr:'another inf'}");
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("EditProjectTaskTreeNode"))
            {

                string sql = "update ProjectTaskTree set   Name='" + Request["Name"].ToString() +
                        "', Chargor='" + Request["Chargor"].ToString() +
                        "'  where ID='" + Request["ID"].ToString() + "'";

                if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
                    Response.Write("{success:true,msg:'节点修改成功！',tr:'another inf'}");
                else
                    Response.Write("{success:true,msg:'节点修改失败！',tr:'another inf'}");
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("DeleteProjectTaskTreeNode"))
            {

                SQLToTreeJson.TreeJson tj = new SQLToTreeJson.TreeJson();
                string IDs = String.Join(",", tj.getChildID("ProjectTaskTree", connectstr, "ID", "ParentID", "select * from ProjectTaskTree where ID in(" + Request["IDs"].ToString() + ")"));

                if (sqlExecute.sqlmanage.ExecuteSQL("delete from ProjectTaskTree where ID in (" + IDs + ")", connectstr))
                    Response.Write("删除成功！");
                else
                    Response.Write("删除失败！");
                Response.End();
                Response.Clear();
            }
        }
    }
   
}