using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;

public partial class PlatForm_Admin_WebPage_DieClassManage_DataProcess : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();
            if (OperateType.Equals("LoadDieClassTreeData"))
            {
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeFullJson ff = new TreeFullJson.TreeFullJson(PlatForm_connectstr, false);
                sb.AppendFormat("[{0}]", ff.fillTreeView("select ID,Name,ParentID from DieClass  where ParentID is null", new string[] { "id", "text" }, "ID", "ParentID"));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();

            }

            else if (OperateType.Equals("EditNode"))
            {
                if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from DieClass where  Name='" + Request["ClassName"].ToString() + "' and  ID<>'" + Request["ID"] + "' "))
                {
                    Response.Write("{success:false,msg:'该模具类名已被占用！'}");
                    Response.End();
                    Response.Clear();
                }
                else
                {
                    string sql = "";
                    sql = "update DieClass set  Name='" + Request["ClassName"] +
                            "'  where  ID='" + Request["ID"] + "'";
                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, PlatForm_connectstr))
                        Response.Write("{success:true,msg:'模具类名修改成功！'}");
                    else
                        Response.Write("{success:false,msg:'模具类名修改失败！'}");
                    Response.End();
                    Response.Clear();
                }


            }
            else if (OperateType.Equals("AddNode"))
            {

                if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from DieClass where  Name='" + Request["ClassName"].ToString() + "' "))
                {
                    Response.Write("{success:false,msg:'该模具类名已存在！'}");
                    Response.End();
                    Response.Clear();
                }
                else
                {
                    string temp = "";
                    temp += "'" + Request["ClassName"] + "',";
                    temp += "'" + Request["ID"] + "'";
                    if (sqlExecute.sqlmanage.ExecuteSQL("insert into DieClass (Name,ParentID) values (" + temp + ")", PlatForm_connectstr))
                        Response.Write("{success:true,msg:'模具类名添加成功！'}");
                    else
                        Response.Write("{success:false,msg:'模具类名添加失败！'}");
                    Response.End();
                    Response.Clear();
                }


            }
            else if (OperateType.Equals("DeleteNode"))
            {

                if (sqlExecute.sqlmanage.ExecuteSQL("delete from  DieClass where ID=" + Request["ID"], PlatForm_connectstr))
                    Response.Write("模具类名删除成功！");
                else
                    Response.Write("模具类名删除失败！");
                Response.End();
                Response.Clear();

            }
            else if (OperateType.Equals("MoveNode"))
            {

                string sql = "";
                sql = "update DieClass set  " + 
                        "ParentID='" + Request["TargetNodeID"] + "'  where  ID='" + Request["NodeID"] + "'";
                if (sqlExecute.sqlmanage.ExecuteSQL(sql, PlatForm_connectstr))
                    Response.Write("移动成功！");
                else
                    Response.Write("移动失败！");
                Response.End();
                Response.Clear();

            }

        }
    }
}