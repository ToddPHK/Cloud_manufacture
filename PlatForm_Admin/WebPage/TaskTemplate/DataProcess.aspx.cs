using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using System.Data.SqlClient;
using System.Data;

public partial class Taskmudule_DataProcess : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
        if (Request["OperateType"] != null)
        {
            string OperateType = Request["OperateType"].ToString();
            if (OperateType.Equals("TaskTemplate_TreeGrid_Data"))
            {
                string IdentityFilter = "";
                string userType = Session["UserType"].ToString();
                TreeFullJson.GetTopParent TNff = new TreeFullJson.GetTopParent(PlatForm_connectstr);
                if (userType.Equals("PlatFormUser"))
                {
                    IdentityFilter = "";
                }
                else if (userType.Equals("ENTUser"))
                {
                    string IDs = string.Join(",", TNff.GetTopNodes("select TaskTemplateID,TaskTemplateParentID from TaskTemplate where CreatorID=-1 and CompanyID=" + Session["ENTID"].ToString(), "TaskTemplateID", "TaskTemplateParentID", "TaskTemplate").ToArray());
                    if (string.IsNullOrWhiteSpace(IDs))
                        IdentityFilter = " and State=0 and Establish_Wiki=1 ";
                    else
                        IdentityFilter = " and State=0 and (Establish_Wiki=1 or TaskTemplateID in(" + IDs + "))";
                }
                else if (userType.Equals("ENTInnerUser"))
                {
                    string IDs = string.Join(",", TNff.GetTopNodes("select TaskTemplateID,TaskTemplateParentID from TaskTemplate where CreatorID=" + Session["userID"].ToString() + " and CompanyID=" + Session["ENTID"].ToString(), "TaskTemplateID", "TaskTemplateParentID", "TaskTemplate").ToArray());
                    //    IdentityFilter = " and (Establish_Wiki=1 or ( CompanyID=" + Session["ENTID"].ToString() + " and CreatorID=" + Session["userID"].ToString() + ") or TaskTemplateID in(" + IDs + "))";
                    if (string.IsNullOrWhiteSpace(IDs))
                        IdentityFilter = " and State=0 and Establish_Wiki=1 ";
                    else
                        IdentityFilter = " and State=0 and (Establish_Wiki=1 or TaskTemplateID in(" + IDs + "))";
                }
                else
                {
                    return;
                }
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TemplateTreeData ff = new TreeFullJson.TemplateTreeData(PlatForm_connectstr, true);
                sb.AppendFormat("[{0}]", ff.fillTreeView("select  Coalesce(fieldLabel,Chinese) as DisplayName,LastEditTime,Establish_Wiki,UserInfor.userName as CreatorName,CompanyID,CreatorID,Coalesce(name,AttributeName) as name,allowBlank,TemplateStateName,blankText,regex,regexText,emptyText,width,height,Type,BidingStandardTaskID,State,TaskTemplateID,TaskTemplateParentID,TaskTemplateCreateDate,DicWordID,ServiceTree.StandardTaskName from TaskTemplate,ServiceTree,Attributes,TemplateState,UserInfor where TaskTemplate.BidingStandardTaskID*=ServiceTree.NodeId and TaskTemplate.CompanyID*=UserInfor.UserID and TaskTemplate.State*=TemplateState.TemplateStateID and TaskTemplate.DicWordID*=Attributes.AttributeID and TaskTemplateParentID is null " + IdentityFilter, new string[] { }, "TaskTemplateID", "TaskTemplateParentID", " TaskTemplate.DicWordID*=Attributes.AttributeID  and TaskTemplate.CompanyID*=UserInfor.UserID and  TaskTemplate.State*=TemplateState.TemplateStateID and  TaskTemplate.BidingStandardTaskID*=ServiceTree.NodeId "));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();
                return;
            }
            else if (OperateType.Equals("TaskTemplate_Search"))
            {
                string IdentityFilter = "";
                string userType = Session["UserType"].ToString();
                TreeFullJson.GetTopParent TNff = new TreeFullJson.GetTopParent(PlatForm_connectstr);
                if (userType.Equals("PlatFormUser"))
                {
                    IdentityFilter = "";
                }
                else if (userType.Equals("ENTUser"))
                {
                    string IDs = string.Join(",", TNff.GetTopNodes("select TaskTemplateID,TaskTemplateParentID from TaskTemplate where CreatorID=-1 and CompanyID=" + Session["ENTID"].ToString(), "TaskTemplateID", "TaskTemplateParentID", "TaskTemplate").ToArray());
                    if (string.IsNullOrWhiteSpace(IDs))
                        IdentityFilter = " and State=0 and Establish_Wiki=1 ";
                    else
                        IdentityFilter = " and State=0 and (Establish_Wiki=1 or   TaskTemplateID in(" + IDs + ")";
                }
                else if (userType.Equals("ENTInnerUser"))
                {
                    string IDs = string.Join(",", TNff.GetTopNodes("select TaskTemplateID,TaskTemplateParentID from TaskTemplate where CreatorID=" + Session["userID"].ToString() + " and CompanyID=" + Session["ENTID"].ToString(), "TaskTemplateID", "TaskTemplateParentID", "TaskTemplate").ToArray());
                    if (string.IsNullOrWhiteSpace(IDs))
                        IdentityFilter = " and State=0 and Establish_Wiki=1 ";
                    else
                        IdentityFilter = " and State=0 and (Establish_Wiki=1  or TaskTemplateID in(" + IDs + ")";

                }
                else
                {
                    return;
                }
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TemplateTreeData ff = new TreeFullJson.TemplateTreeData(PlatForm_connectstr, true);
                if (Request["Name"].ToString().Equals(""))
                    sb.AppendFormat("[{0}]", ff.fillTreeView("select  Coalesce(fieldLabel,Chinese) as DisplayName,LastEditTime,Establish_Wiki,UserInfor.userName as CreatorName,CompanyID,CreatorID,Coalesce(name,AttributeName) as name,allowBlank,TemplateStateName,blankText,regex,regexText,emptyText,width,height,Type,BidingStandardTaskID,State,TaskTemplateID,TaskTemplateParentID,TaskTemplateCreateDate,DicWordID,ServiceTree.StandardTaskName from TaskTemplate,ServiceTree,Attributes,TemplateState,UserInfor where TaskTemplate.BidingStandardTaskID*=ServiceTree.NodeId and TaskTemplate.CompanyID*=UserInfor.UserID and  TaskTemplate.State*=TemplateState.TemplateStateID and  TaskTemplate.DicWordID*=Attributes.AttributeID and TaskTemplateParentID is null" + IdentityFilter, new string[] { }, "TaskTemplateID", "TaskTemplateParentID", " TaskTemplate.DicWordID*=Attributes.AttributeID  and TaskTemplate.CompanyID*=UserInfor.UserID and  TaskTemplate.State*=TemplateState.TemplateStateID and  TaskTemplate.BidingStandardTaskID*=ServiceTree.NodeId "));
                else
                    sb.AppendFormat("[{0}]", ff.fillTreeView("select  Coalesce(fieldLabel,Chinese) as DisplayName,LastEditTime,Establish_Wiki,UserInfor.userName as CreatorName,CompanyID,CreatorID,Coalesce(name,AttributeName) as name,allowBlank,TemplateStateName,regex,blankText,regexText,emptyText,width,height,Type,BidingStandardTaskID,State,TaskTemplateID,TaskTemplateParentID,TaskTemplateCreateDate,DicWordID,ServiceTree.StandardTaskName from TaskTemplate,ServiceTree,Attributes,TemplateState,UserInfor where TaskTemplate.BidingStandardTaskID*=ServiceTree.NodeId and TaskTemplate.CompanyID*=UserInfor.UserID and  TaskTemplate.State*=TemplateState.TemplateStateID and  TaskTemplate.DicWordID*=Attributes.AttributeID and TaskTemplateParentID is null and fieldLabel like '%" + Request["Name"].ToString() + "%'" + IdentityFilter, new string[] { }, "TaskTemplateID", "TaskTemplateParentID", " TaskTemplate.DicWordID*=Attributes.AttributeID  and TaskTemplate.CompanyID*=UserInfor.UserID and  TaskTemplate.State*=TemplateState.TemplateStateID and  TaskTemplate.BidingStandardTaskID*=ServiceTree.NodeId "));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();
                return;
            }
            else if (OperateType.Equals("StandardTaskTypeTree"))
            {
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeFullJson ff = new TreeFullJson.TreeFullJson(PlatForm_connectstr, false);
                sb.AppendFormat("[{0}]", ff.fillTreeView("select NodeId,StandardTaskName,PNodeId from ServiceTree where PNodeId is null ", new string[] { "id", "text" }, "NodeId", "PNodeId"));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();
                return;
            }
            else if (OperateType.Equals("AddElement"))
            {

                string time = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

                string[] WordIDS = Request["WordIDS"].ToString().Split(',');
                bool flag = true;

                foreach (string s in WordIDS)
                {
                    string temp1 = "width,";
                    string temp = "";
                    temp += "'" + Request["width"] + "',";
                    if (Request["AllowEmpty"].Equals("No"))
                    {
                        temp += "'" + Request["blankText"] + "',";
                        temp += "'0',";
                        temp1 += "blankText,allowBlank,";
                    }

                    if (!string.IsNullOrWhiteSpace(Request["emptyText"]))
                    {
                        temp += "'" + Request["emptyText"] + "',";
                        temp1 += "emptyText,";
                    }
                    if (Request["AllowRegex"].Equals("Yes"))
                    {
                        temp += "'" + HttpUtility.UrlEncode(Request["regex"]) + "',";
                        temp += "'" + Request["regexText"] + "',";
                        temp1 += "regex,regexText,";
                    }
                    temp += "'" + time + "',";
                    temp += "'" + Request["ID"] + "',";
                    string userType = Session["UserType"].ToString();
                    if (userType.Equals("PlatFormUser"))
                    {
                        temp += "'-1',";//用户ID
                        temp += "'" + Session["userID"].ToString() + "',";//企业ID
                    }
                    else if (userType.Equals("ENTUser"))
                    {
                        temp += "'-1',";//用户ID
                        temp += "'" + Session["userID"].ToString() + "',";//企业ID
                    }
                    else if (userType.Equals("ENTInnerUser"))
                    {
                        temp += "'" + Session["userID"].ToString() + "',";//用户ID
                        temp += "'" + Session["ENTID"].ToString() + "',";//企业ID

                    }
                    else
                    {
                        return;
                    }


                    temp += "'" + s + "'";

                    temp1 += "TaskTemplateCreateDate,TaskTemplateParentID,CreatorID,CompanyID,DicWordID";
                    if (!sqlExecute.sqlmanage.ExecuteSQL("insert into TaskTemplate (" + temp1 + ") values (" + temp + ")", PlatForm_connectstr))
                    {
                        flag = false;
                    }
                }
                if (flag)
                    Response.Write("{success:true,msg:'模板标签元素添加成功！',tr:'another inf'}");
                else
                    Response.Write("{success:false,msg:'模板标签元素添加失败！',tr:'another inf'}");
                Response.End();
                Response.Clear();

            }
            else if (OperateType.Equals("EditElement"))
            {
                string sql = "update TaskTemplate set";

                sql += " width='" + Request["width"] + "',";
                if (!string.IsNullOrWhiteSpace(Request["emptyText"]))
                {
                    sql += "emptyText='" + Request["emptyText"] + "',";
                }
                else
                {
                    sql += "emptyText=NULL,";
                }
                if (Request["AllowEmpty"].Equals("No"))
                {
                    sql += "allowBlank='0',";
                    sql += "blankText='" + Request["blankText"] + "',";
                }
                else
                {
                    sql += "allowBlank='1',";
                    sql += "blankText=NULL,";
                }
                if (Request["AllowRegex"].Equals("Yes"))
                {
                    sql += "regex='" + HttpUtility.UrlEncode(Request["regex"]) + "',";
                    sql += "regexText='" + Request["regexText"] + "',";

                }
                else
                {
                    sql += "regex=NULL,";
                    sql += "regexText=NULL,";
                }
                sql += "LastEditTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "',";
                sql = sql.Remove(sql.ToString().LastIndexOf(','), 1);
                sql += "  where TaskTemplateID='" + Request["ID"] + "'";

                if (sqlExecute.sqlmanage.ExecuteSQL(sql, PlatForm_connectstr))
                    Response.Write("{success:true,msg:'模板标签元素修改成功！',tr:'another inf'}");
                else
                    Response.Write("{success:false,msg:'模板标签元素修改失败！',tr:'another inf'}");
                Response.End();
                Response.Clear();

            }
            else if (OperateType.Equals("MoveElement"))
            {

                string sql = "update TaskTemplate set  TaskTemplateParentID='" + Request["TargetNodeID"].ToString() +
                        "'  where TaskTemplateID=" + Request["NodeID"].ToString();


                if (sqlExecute.sqlmanage.ExecuteSQL(sql, PlatForm_connectstr))
                    Response.Write("移动成功！");
                else
                    Response.Write("移动失败！");
                Response.End();
                Response.Clear();

            }
            else if (OperateType.Equals("AddRow"))
            {
                if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from TaskTemplate where TaskTemplateParentID=" + Request["ID"].ToString() + " and fieldLabel='" + Request["RowName"].ToString() + "'"))
                {
                    Response.Write("{success:false,msg:'行名重复！',tr:'another inf'}");
                    Response.End();
                    Response.Clear();
                    return;

                }
                else
                {
                    string CompanyID = "";
                    string CreatorID = "";
                    string userType = Session["UserType"].ToString();
                    if (userType.Equals("PlatFormUser"))
                    {
                        CreatorID = "-1";//用户ID
                        CompanyID = Session["userID"].ToString();//企业ID
                    }
                    else if (userType.Equals("ENTUser"))
                    {
                        CreatorID = "-1";//用户ID
                        CompanyID = Session["userID"].ToString();//企业ID
                    }
                    else if (userType.Equals("ENTInnerUser"))
                    {
                        CreatorID = Session["userID"].ToString();//用户ID
                        CompanyID = Session["ENTID"].ToString();//企业ID

                    }
                    else
                    {
                        return;
                    }
                    string sql1 = "insert into TaskTemplate (fieldLabel,TaskTemplateParentID,name,Type,CompanyID,CreatorID,TaskTemplateCreateDate) values ('" + Request["RowName"].ToString() + "','" + Request["ID"].ToString() + "','colum','R','" + CompanyID + "','" + CreatorID + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "')";
                    if (sqlExecute.sqlmanage.ExecuteSQL(sql1, PlatForm_connectstr))
                        Response.Write("{success:true,msg:'模板行添加成功！',tr:'another inf'}");
                    else
                        Response.Write("{success:false,msg:'模板行添加失败！',tr:'another inf'}");
                    Response.End();
                    Response.Clear();
                }
            }
            else if (OperateType.Equals("EditRow"))
            {
                if (!sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from TaskTemplate where TaskTemplateParentID=" + Request["ParentID"].ToString() + "and TaskTemplateID<>" + Request["ID"] + " and fieldLabel='" + Request["RowName"].ToString() + "'"))
                {
                    string sql = "update TaskTemplate set  fieldLabel='" + Request["RowName"] + "',LastEditTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") +
                                     "'  where TaskTemplateID='" + Request["ID"] + "'";

                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, PlatForm_connectstr))
                        Response.Write("{success:true,msg:'模板行修改成功！',tr:'another inf'}");
                    else
                        Response.Write("{success:false,msg:'模板行修改失败！',tr:'another inf'}");
                }
                else
                    Response.Write("{success:false,msg:'行名重复,请检查行名!',tr:'another inf'}");
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("AddMould"))
            {
                bool flag = true;

                if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from TaskTemplate where TaskTemplateParentID is null and fieldLabel='" + Request["MouldDisplayName"].ToString() + "'"))
                {
                    flag = false;

                    Response.Write("{success:false,msg:'该模板[名称]已存在！',tr:'another inf'}");
                    Response.End();
                    Response.Clear();
                    return;
                }
                if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from TaskTemplate where  TaskTemplateParentID is null and name='" + Request["MouldName"].ToString() + "'"))
                {
                    flag = false;
                    Response.Write("{success:false,msg:'该模板[提交名]已存在！',tr:'another inf'}");
                    Response.End();
                    Response.Clear();
                    return;
                }
                if (flag)
                {
                    string CompanyID = "";
                    string CreatorID = "";
                    string userType = Session["UserType"].ToString();
                    if (userType.Equals("PlatFormUser"))
                    {
                        CreatorID = "-1";//用户ID
                        CompanyID = Session["userID"].ToString();//企业ID
                    }
                    else if (userType.Equals("ENTUser"))
                    {
                        CreatorID = "-1";//用户ID
                        CompanyID = Session["userID"].ToString();//企业ID
                    }
                    else if (userType.Equals("ENTInnerUser"))
                    {
                        CreatorID = Session["userID"].ToString();//用户ID
                        CompanyID = Session["ENTID"].ToString();//企业ID

                    }
                    else
                    {
                        return;
                    }
                    string sql = "insert into TaskTemplate (name,BidingStandardTaskID,fieldLabel,Type,State,CompanyID,CreatorID,TaskTemplateCreateDate) values ('" + Request["MouldName"].ToString() + "','" + Request["StandardTaskID"].ToString() + "','" + Request["MouldDisplayName"].ToString() + "','T','0','" + CompanyID + "','" + CreatorID + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "')";
                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, PlatForm_connectstr))
                        Response.Write("{success:true,msg:'模板添加成功！',tr:'another inf'}");
                    else
                        Response.Write("{success:false,msg:'模板添加失败！',tr:'another inf'}");
                    Response.End();
                    Response.Clear();
                }


            }
            else if (OperateType.Equals("EditMould"))
            {
                bool flag = true;

                if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from TaskTemplate where TaskTemplateID<>" + Request["ID"] + "   and fieldLabel='" + Request["MouldDisplayName"].ToString() + "'"))
                {
                    flag = false;

                    Response.Write("{success:false,msg:'该模板[名称]已存在！',tr:'another inf'}");
                    Response.End();
                    Response.Clear();
                    return;
                }
                if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from TaskTemplate where  TaskTemplateID<>" + Request["ID"] + " and name='" + Request["MouldName"].ToString() + "'"))
                {
                    flag = false;
                    Response.Write("{success:false,msg:'该模板[提交名]已存在！',tr:'another inf'}");
                    Response.End();
                    Response.Clear();
                    return;
                }
                if (flag)
                {
                    string sql = "update TaskTemplate set  name='" + Request["MouldName"] +
                    "', fieldLabel='" + Request["MouldDisplayName"] +
                     "', BidingStandardTaskID='" + Request["StandardTaskID"] +
                     "', LastEditTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") +
                    "'  where TaskTemplateID='" + Request["ID"] + "'";
                    if (sqlExecute.sqlmanage.ExecuteSQL(sql, PlatForm_connectstr))
                        Response.Write("{success:true,msg:'模板修改成功！',tr:'another inf'}");
                    else
                        Response.Write("{success:false,msg:'模板修改失败！',tr:'another inf'}");
                    Response.End();
                    Response.Clear();
                }


            }
            else if (OperateType.Equals("DeleteNodes"))
            {

                SQLToTreeJson.TreeJson tj = new SQLToTreeJson.TreeJson();
                string IDs = String.Join(",", tj.getChildID("TaskTemplate", PlatForm_connectstr, "TaskTemplateID", "TaskTemplateParentID", "select * from TaskTemplate where TaskTemplateID in(" + Request["IDs"].ToString() + ")"));

                if (sqlExecute.sqlmanage.ExecuteSQL("delete from TaskTemplate where TaskTemplateID in (" + IDs + ")", PlatForm_connectstr))
                    Response.Write("删除成功！");
                else
                    Response.Write("删除失败！");
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("CreateMould"))
            {

                string path = Server.MapPath("~/") + "\\TaskMould";
                CreateTastMudole.TaskCreate sss = new CreateTastMudole.TaskCreate(Request["ID"].ToString());
                if (sss.CreateTaskTemplate(path))
                {
                    sqlExecute.sqlmanage.ExecuteSQL("update TaskTemplate set state=2 where TaskTemplateID=" + Request["ID"].ToString(), PlatForm_connectstr);
                    Response.Write("模板生成成功！");
                }
                else
                    Response.Write("模板生成失败！");
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("PromoteTemplate"))
            {

                if (sqlExecute.sqlmanage.ExecuteSQL("update TaskTemplate set state=4 where TaskTemplateID=" + Request["ID"].ToString(), PlatForm_connectstr))
                {

                    Response.Write("模板提升成功！");
                }
                else
                    Response.Write("模板提升失败！");
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("ConfirmFinish"))
            {

                if (sqlExecute.sqlmanage.ExecuteSQL("update TaskTemplate set state=1 where TaskTemplateID=" + Request["ID"].ToString(), PlatForm_connectstr))
                {

                    Response.Write("模板创建完成确认成功！");
                }
                else
                    Response.Write("模板创建完成确认失败！");
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("AbolishTemplate"))
            {

                if (sqlExecute.sqlmanage.ExecuteSQL("update TaskTemplate set state=5 where TaskTemplateID=" + Request["ID"].ToString(), PlatForm_connectstr))
                {

                    Response.Write("模板创建完成确认成功！");
                }
                else
                    Response.Write("模板创建完成确认失败！");
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("UseAgain"))
            {

                if (sqlExecute.sqlmanage.ExecuteSQL("update TaskTemplate set state=0 where TaskTemplateID=" + Request["ID"].ToString(), PlatForm_connectstr))
                {

                    Response.Write("模板创建完成确认成功！");
                }
                else
                    Response.Write("模板创建完成确认失败！");
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("NoEditable_Template"))
            {

                if (sqlExecute.sqlmanage.ExecuteSQL("update TaskTemplate set Establish_Wiki=2 where TaskTemplateID=" + Request["ID"].ToString(), PlatForm_connectstr))
                {

                    Response.Write("禁止编辑操作成功！");
                }
                else
                    Response.Write("禁止编辑操作失败！");
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("Use_Wiki"))
            {

                if (sqlExecute.sqlmanage.ExecuteSQL("update TaskTemplate set Establish_Wiki=1 where TaskTemplateID=" + Request["ID"].ToString(), PlatForm_connectstr))
                {

                    Response.Write("wiki启用成功！");
                }
                else
                    Response.Write("wiki启用失败！");
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("UnUse_Wiki"))
            {

                if (sqlExecute.sqlmanage.ExecuteSQL("update TaskTemplate set Establish_Wiki=0 where TaskTemplateID=" + Request["ID"].ToString(), PlatForm_connectstr))
                {

                    Response.Write("wiki禁用成功！");
                }
                else
                    Response.Write("wiki禁用失败！");
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("LoadTemplate"))
            {
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeFullJson ff = new TreeFullJson.TreeFullJson(PlatForm_connectstr, true);
                sb.AppendFormat("[{0}]", ff.fillTreeView("select TaskTemplateID, Coalesce(fieldLabel,Chinese) as fieldLabel,TaskTemplateParentID,Type from TaskTemplate,Attributes where  TaskTemplate.DicWordID*=Attributes.AttributeID and State=4 and  TaskTemplateParentID is null and TaskTemplateID<>" + Request["CheckedTemPlateID"].ToString(), new string[] { "id", "text" }, "TaskTemplateID", "TaskTemplateParentID", " TaskTemplate.DicWordID*=Attributes.AttributeID "));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();
            }
            else if (OperateType.Equals("LoadTemplateByID"))
            {
                StringBuilder sb = new StringBuilder();
                TreeFullJson.TreeFullJson ff = new TreeFullJson.TreeFullJson(PlatForm_connectstr, true);
                sb.AppendFormat("[{0}]", ff.fillTreeView("select TaskTemplateID, Coalesce(fieldLabel,Chinese) as fieldLabel,TaskTemplateParentID,Type from TaskTemplate,Attributes where  TaskTemplate.DicWordID*=Attributes.AttributeID and   TaskTemplateParentID is null and TaskTemplateID=" + Request["CheckedTemPlateID"].ToString(), new string[] { "id", "text" }, "TaskTemplateID", "TaskTemplateParentID", " TaskTemplate.DicWordID*=Attributes.AttributeID "));
                Response.Write(sb.ToString());
                Response.End();
                Response.Clear();
            }

            else if (OperateType.Equals("InheritTemplates"))
            {
                string InheriteTemplateType = Request["InheriteTemplateType"].ToString();
                string Type = Request["Type"].ToString();
                InheritTemplate.InheritTemplate tt = new InheritTemplate.InheritTemplate(PlatForm_connectstr);
                bool flag = true;
                if (Type.Equals("T") && InheriteTemplateType.Equals("T"))
                {
                    if (!CheckRow("select fieldLabel from TaskTemplate where TaskTemplateParentID=" + Request["TemplateID"].ToString(), "select fieldLabel from TaskTemplate where TaskTemplateParentID=" + Request["InheriteTemplateID"].ToString(), PlatForm_connectstr))
                    {
                        Response.Write("{success:false,msg:'要继承的行名和现有行名重复！'}");
                        Response.End();
                        Response.Clear();
                        return;
                    }
                    if (!CheckAtt("select DicWordID from TaskTemplate where TaskTemplateParentID in ( select TaskTemplateID from TaskTemplate where  TaskTemplateParentID=" + Request["TemplateID"].ToString() + ")", "select DicWordID from TaskTemplate where TaskTemplateParentID in ( select TaskTemplateID from TaskTemplate where  TaskTemplateParentID=" + Request["InheriteTemplateID"].ToString() + ")", PlatForm_connectstr))
                    {
                        Response.Write("{success:false,msg:'要继承的属性名和现有属性名重复！'}");

                        Response.End();
                        Response.Clear();
                        return;
                    }
                    flag = tt.InheritTemplateT(Request["TemplateID"].ToString(), Request["InheriteTemplateID"].ToString());
                }
                else if (Type.Equals("T") && InheriteTemplateType.Equals("R"))
                {
                    if (!CheckRow("select fieldLabel from TaskTemplate where TaskTemplateParentID=" + Request["TemplateID"].ToString(), "select fieldLabel from TaskTemplate where TaskTemplateID=" + Request["InheriteTemplateID"].ToString(), PlatForm_connectstr))
                    {
                        Response.Write("{success:false,msg:'要继承的行名和现有行名重复！'}");
                        Response.End();
                        Response.Clear();
                        return;
                    }
                    if (!CheckAtt("select DicWordID from TaskTemplate where TaskTemplateParentID in ( select TaskTemplateID from TaskTemplate where  TaskTemplateParentID=" + Request["TemplateID"].ToString() + ")", "select DicWordID from TaskTemplate where TaskTemplateParentID =" + Request["InheriteTemplateID"].ToString(), PlatForm_connectstr))
                    {
                        Response.Write("{success:false,msg:'要继承的属性名和现有属性名重复！'}");
                        Response.End();
                        Response.Clear();
                        return;
                    }
                    flag = tt.InheritRow(Request["TemplateID"].ToString(), Request["InheriteTemplateID"].ToString());
                }
                else if (Type.Equals("R") && InheriteTemplateType.Equals("R"))
                {
                    if (!CheckAtt("select DicWordID from TaskTemplate where TaskTemplateParentID  in ( select TaskTemplateID from TaskTemplate where  TaskTemplateParentID in ( select TaskTemplateParentID from TaskTemplate where TaskTemplateID=" + Request["TemplateID"].ToString() + " ))", "select DicWordID from TaskTemplate where TaskTemplateParentID =" + Request["InheriteTemplateID"].ToString(), PlatForm_connectstr))
                    {
                        Response.Write("{success:false,msg:'要继承的属性名和现有属性名重复！'}");
                        Response.End();
                        Response.Clear();
                        return;
                    }
                    flag = tt.InheritRow_Row(Request["TemplateID"].ToString(), Request["InheriteTemplateID"].ToString());
                }
                else if (Type.Equals("R") && InheriteTemplateType.Equals("A"))
                {
                    if (!CheckAtt("select DicWordID from TaskTemplate where TaskTemplateParentID  in ( select TaskTemplateID from TaskTemplate where  TaskTemplateParentID in ( select TaskTemplateParentID from TaskTemplate where TaskTemplateID=" + Request["TemplateID"].ToString() + " ))", "select DicWordID from TaskTemplate where TaskTemplateID =" + Request["InheriteTemplateID"].ToString(), PlatForm_connectstr))
                    {
                        Response.Write("{success:false,msg:'要继承的属性名和现有属性名重复！'}");
                        Response.End();
                        Response.Clear();
                        return;
                    }
                    flag = tt.InheritAttribute(Request["TemplateID"].ToString(), Request["InheriteTemplateID"].ToString());
                }
                else
                {
                    Response.Write("{success:false,msg:'不能实现你所选的继承或出现继承出现错误！'}");
                    Response.End();
                    Response.Clear();
                    return;
                }


                if (flag)
                    Response.Write("{success:true,msg:'继承成功！'}");
                else
                    Response.Write("{success:false,msg:'继承失败！'}");
                Response.End();
                Response.Clear();
                return;

            }

        }

    }
    protected bool CheckAtt(string sql, string Inheritesql, string Connectstr)
    {
        try
        {

            string[] DicWordIDs = sqlExecute.sqlmanage.GetUniqueRecord(sql, Connectstr, new string[] { "DicWordID" }).Split('|');
            string[] InheriteDicWordIDs = sqlExecute.sqlmanage.GetUniqueRecord(Inheritesql, Connectstr, new string[] { "DicWordID" }).Split('|');
            foreach (string s in InheriteDicWordIDs)
            {
                foreach (string q in DicWordIDs)
                {
                    if (s.Equals(q))
                        return false;

                }
            }
            return true;
        }
        catch (Exception e)
        {
            return false;
        }

    }
    protected bool CheckRow(string sql, string Inheritesql, string Connectstr)
    {
        try
        {
            string[] RowNames = sqlExecute.sqlmanage.GetUniqueRecord(sql, Connectstr, new string[] { "fieldLabel" }).Split('|');
            string[] InheriteRowNames = sqlExecute.sqlmanage.GetUniqueRecord(Inheritesql, Connectstr, new string[] { "fieldLabel" }).Split('|');
            foreach (string s in InheriteRowNames)
            {
                foreach (string q in RowNames)
                {
                    if (s.Equals(q))
                        return false;

                }
            }
            return true;

        }
        catch (Exception e)
        {
            return false;
        }
    }
}