<%@ WebHandler Language="C#" Class="DataProcess" %>

using System;
using System.Web;
using System.Web.SessionState;
using System.Collections.Generic;
using System.Text;

public class DataProcess : IHttpHandler, IRequiresSessionState
{

    public void ProcessRequest(HttpContext context)
    {
        if (context.Request["OperateType"] != null) //有可能在json里，有可能在url里
        {
            CloudBLL.Entprise bllEnt = new CloudBLL.Entprise();
            string operateType = context.Request["OperateType"].ToString();
            int entId = (int)context.Session["UserID"];
            string connString = context.Session["ConnString"].ToString();
            string msg = "";
            switch (operateType)
            {
                case "SendShortMsg":
                    msg = context.Request.Form["Message"].ToString();
                    if (msg != "")
                    {
                        List<CloudModel.EntInnerUser> innerUsers = bllEnt.SelectInnerUsersTele(entId, context.Request.Form["UserIDs"].ToString(), connString);
                        foreach (CloudModel.EntInnerUser user in innerUsers)
                        {
                            ClassLibrary1.WebCloudSendMsg.MySendMsg.sendMsg(user.Telephone, "来自企业管理员的信息：" + msg, "-1", entId.ToString(), user.UserId.ToString(), entId.ToString());
                        }
                        context.Response.Write("{success:true; msg:'发送成功!'}");
                        context.Response.End();
                        context.Response.Clear();
                    }
                    else
                    {
                        context.Response.Write("{success:true; msg:'不能发送空消息！'}");
                        context.Response.End();
                        context.Response.Clear();
                    }
                    break;
                case "OrgStructureTreeNoCheckBox":
                    StringBuilder sb = new StringBuilder();
                    TreeFullJson.TreeFullJson ff = new TreeFullJson.TreeFullJson(connString, false);
                    string tempsql = "select  部门编号,部门名称,上级部门  from DeptList where 上级部门 is null AND entId = 19";
                    sb.AppendFormat("[{0}]", ff.fillTreeView(tempsql, new string[] { "id", "text" }, "部门编号", "上级部门"));
                    context.Response.Write(sb.ToString());
                    context.Response.End();
                    context.Response.Clear();
                    break;
                case "delete":
                    int flag = bllEnt.DeleteInnerUsers(entId, context.Request["deleteId"], connString);
                    if (flag > 0)
                    {
                        context.Response.Clear();
                        context.Response.Write("{success:true,msg:'人员删除成功！'}");
                    }
                    else
                    {
                        context.Response.Clear();
                        context.Response.Write("{success:false,msg:'人员删除成功！'}");
                    }
                    context.Response.End();
                    break;
                case "add":
                    CloudModel.EntInnerUser user1 = GetInnerUserFormInfo(context);
                    msg = ValidInnerUserInfo(user1);
                    if (msg == "")  //不包含非法信息时
                    {
                        user1.EntId = entId;
                        msg = bllEnt.InsertInnerUser(user1, connString);
                        context.Response.Clear();
                        context.Response.Write(msg);
                        context.Response.End();
                    }
                    else
                    {
                        context.Response.Clear();
                        context.Response.Write("{success:false,msg:'" + msg + "'}");
                        context.Response.End();
                    }
                    break;
                case "edit":
                    CloudModel.EntInnerUser user2 = GetInnerUserFormInfo(context);
                    user2.UserId = int.Parse(context.Request["ID"]);
                    msg = ValidInnerUserInfo(user2);
                    if (msg == "")
                    {
                        user2.EntId = entId;
                        msg = bllEnt.UpdateInnerUser(user2, connString);
                        context.Response.Clear();
                        context.Response.Write(msg);
                        context.Response.End();
                    }
                    else
                    {
                        context.Response.Clear();
                        context.Response.Write("{success:false,msg:'" + msg + "'}");
                        context.Response.End();
                    }
                    break;
                case "BatchAdd_People":
                    int num = int.Parse(context.Request["PeoNumber"]);
                    string tempName = context.Request["Batchpeoplename"];
                    bool result = bllEnt.InsertBatchInnerUser(entId, tempName, num, connString);
                    if (result)
                    {
                        context.Response.Clear();
                        context.Response.Write("{success:true,msg:'人员批量添加成功！'}");
                    }
                    else
                    {
                        context.Response.Clear();
                        context.Response.Write("{success:false,msg:'人员批量添加失败,请查证后操作！'}");
                    }
                    context.Response.End();
                    break;
            }
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

    /// <summary>
    /// 获取表单中的EntInnerUser信息
    /// </summary>
    /// <param name="context">httpContext</param>
    /// <returns>包含表单信息的InnerUser类</returns>
    protected CloudModel.EntInnerUser GetInnerUserFormInfo(HttpContext context)
    {
        CloudModel.EntInnerUser innerUser = new CloudModel.EntInnerUser();
        innerUser.InnerUserId = context.Request.Form["Peopleid"];//需要验证是否唯一
        innerUser.DocId = context.Request.Form["archive"];//需要验证是否唯一
        innerUser.Username = context.Request.Form["peoplename"];
        innerUser.Gender = context.Request.Form["sex"];
        innerUser.Birthday = context.Request.Form["birthday"];
        innerUser.Degree = context.Request.Form["education"];
        innerUser.Telephone = context.Request.Form["mobilenumber"];
        innerUser.PhoneNum = context.Request.Form["fixtelephone"];
        innerUser.Email = context.Request.Form["Email"];
        innerUser.QQNum = context.Request.Form["QQ"];
        innerUser.Address = context.Request.Form["address"];
        innerUser.Department = context.Request.Form["department"];
        innerUser.WorkDate = context.Request.Form["comeDate"];
        innerUser.FirstRole = context.Request.Form["role"];
        innerUser.SecondRole = context.Request.Form["secondrole"];
        innerUser.TrainState = context.Request.Form["training"];
        innerUser.Password = context.Request.Form["secretnumber"];
        innerUser.RegistDate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        return innerUser;
    }

    protected string ValidInnerUserInfo(CloudModel.EntInnerUser user)
    {
        string[] validInputs = { user.InnerUserId, user.DocId, user.Birthday, user.Telephone, user.PhoneNum, user.Email, user.QQNum, user.Address, user.WorkDate, user.TrainState, user.Password };
        return Filter.ValidSqlInput(validInputs);
    }

}