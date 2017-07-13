using System;
using System.Text;
using System.Data.SqlClient;

public partial class ENTUsers_PDM_prjManege_DataProcess : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        //string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();   云平台数据库
        if (Request["OperateType"] != null)
        {
            string connectstr = Session["ConnString"].ToString();      //企业内部数据库
            string sql = "";
            string OperateType = Request["OperateType"];
            if (OperateType.Equals("delete"))
            {
                string id = Request["id"];
                sql = "delete from ProjList where 序号 in (" + Request["id"] + ")";   //通过点击得到的id，安全

                if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))   //Nonquery方法
                {
                    SQLToTreeJson.TreeJson tj = new SQLToTreeJson.TreeJson();
                    string IDs = string.Join(",", tj.getChildID("ProjectTaskTree", connectstr, "ID", "ParentID", "select * from ProjectTaskTree where ProjectID in(" + id + ")"));
                    if (!string.IsNullOrWhiteSpace(IDs))
                    {
                        sqlExecute.sqlmanage.ExecuteSQL("delete from  ProjectTaskTree   where   ID  in  (" + IDs + ")", connectstr);
                        sqlExecute.sqlmanage.ExecuteSQL("delete from  TaskList   where   BelongProjectTreeNode in (" + IDs + ")", connectstr);

                        Response.Clear();
                        Response.Write("项目信息删除成功！");
                    }

                }
                else
                {
                    Response.Clear();
                    Response.Write("项目信息删除失败！");
                }

                Response.End();
            }
            else if (OperateType.Equals("ProjectTaskTree_Data"))
            {
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeFullJson ff = new TreeFullJson.TreeFullJson(connectstr, true);
                string tempsql = "select  Name,ID, ParentID, CreateDate, Creator, Chargor, ProjectID,E1.人员名称 as CreatorPeopleName,E2.人员名称 as ChargorPeopleName,ProjList.项目名称 as ProjectName  from ProjectTaskTree,EmployeeList E1,EmployeeList E2,ProjList where ParentID is null and ProjectTaskTree.Creator=E1.人员ID and ProjectTaskTree.Chargor=E2.人员ID and ProjectTaskTree.ProjectID=ProjList.序号 and ProjectID=" + Request["ProjectID"].ToString();
                sb.AppendFormat("[{0}]", ff.fillTreeView(tempsql, new string[] { "Name" }, "ID", "ParentID", " ProjectTaskTree.Creator=E1.人员ID and ProjectTaskTree.Chargor=E2.人员ID and ProjectTaskTree.ProjectID *=ProjList.序号 "));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("TaskDicWord"))
            {
                CloudBLL.Entprise bllEnt = new CloudBLL.Entprise();
                string s = bllEnt.GetAttrNameJson();
                Response.Write(s);
                Response.End();
                Response.Clear();
            }
        }

    }
}