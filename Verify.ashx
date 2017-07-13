<%@ WebHandler Language="C#" Class="Verify" %>

using System.Web;
using CloudModel;
using System.Web.SessionState;

public class Verify : IHttpHandler, IRequiresSessionState
{
    public void ProcessRequest(HttpContext context)
    {
        string loginType = context.Request["LoginType"];
        int flag;//指示用户登录状态，下方作说明

        //企业内部用户登录
        if (loginType == "ENTInnerUsers")
        {
            if (Filter.SqlFilter(context.Request["userName"]) && Filter.SqlFilter(context.Request["userPass"]) && Filter.SqlFilter(context.Request["databasename"]))
            {
                EntInnerUser innerUser = new EntInnerUser(username: context.Request["userName"], password: context.Request["userPass"], database: context.Request["databasename"], userType: "ENTInnerUser");
                innerUser = VerifyInnerUser(innerUser);
                switch (innerUser.UserState)//UserState指用户所在企业，企业状态不正常，则直接略过对用户的验证
                {
                    case -100:
                        Request(context, "{success:false,msg:'公司注册名不存在！'}");
                        return;
                    case -1:
                        Request(context, "{success:false,msg:'该企业用户已禁用，请与管理员联系！'}");
                        return;
                    case 0:
                        Request(context, "{success:false,msg:'该企业用户还未通过审核，请与管理员联系！'}");
                        return;
                    case 2:
                        Request(context, "{success:false,msg:'该用户未通过审核，请与管理员联系！'}");
                        return;
                    case 1:
                        if (innerUser.InnerUserState == 1)
                        {
                            context.Session["UserType"] = innerUser.UserType;
                            context.Session["UserName"] = innerUser.Username;
                            context.Session["UserID"] = innerUser.UserId;
                            context.Session["StyleSheet"] = innerUser.StyelSheet;
                            context.Session["EntFullName"] = innerUser.EntFullName;
                            context.Session["ConnString"] = innerUser.ConnString;
                            context.Session["EntId"] = innerUser.EntId;

                            CloudBLL.User bllUser = new CloudBLL.User();
                            bllUser.BLLUpdateLoginLog(innerUser.EntId, context.Request.UserHostAddress);
                            Request(context, "{success:true,msg:'OK'}");
                            return;
                        }
                        else
                        {
                            Request(context, "{success:false,msg:'用户名或密码不正确！'}");
                            return;
                        }
                }
            }
            else
            {
                Request(context, "{success:false,msg:'含有非法字符！'}");
                return;
            }
        }
        else if (loginType == "ENTUsers")   //企业用户也需要内部连接字符串信息
        {
            if (Filter.SqlFilter(context.Request["userName"]) && Filter.SqlFilter(context.Request["userPass"]))
            {
                User user = new User(context.Request["userName"], context.Request["userPass"], "ENTUser");
                flag = VerifyAdmin(user);//flag值含义：* -100 用户不存在*   * -1 已禁用 *   * 0 未审核 *  * 1 正常 *  * 2 审核不通过 *
                switch (flag)
                {
                    case -100:
                        Request(context, "{success:false,msg:'用户名或密码不正确！'}");
                        return;
                    case -1:
                        Request(context, "{success:false,msg:'该用户已禁用，请与管理员联系！'}");
                        return;
                    case 0:
                        Request(context, "{success:false,msg:'该用户还未审核，请与管理员联系！'}");
                        return;
                    case 1:
                        context.Session["UserType"] = user.UserType;
                        context.Session["UserName"] = user.Username;
                        context.Session["UserID"] = user.UserId;
                        context.Session["StyleSheet"] = user.StyelSheet;
                        context.Session["EntFullName"] = user.EntFullName;
                        context.Session["ConnString"] = user.ConnString;

                        CloudBLL.User bllUser = new CloudBLL.User();
                        bllUser.BLLUpdateLoginLog(user.UserId, context.Request.UserHostAddress);
                        Request(context, "{success:true,msg:'OK',tr:'another inf'}");
                        return;
                    case 2:
                        Request(context, "{success:false,msg:'该用户未通过审核，请与管理员联系！'}");
                        return;
                    default:
                        Request(context, "{success:false,msg:'用户状态异常，请与管理员联系！'}");
                        return;
                }
            }
            else
            {
                Request(context, "{success:false,msg:'含有非法字符！'}");
                return;
            }
        }
        else
        {
            Request(context, "{success:false,msg:'系统出错，请刷新后再试',tr:'another inf'}");
            return;
        }

    }

    public static EntInnerUser VerifyInnerUser(EntInnerUser user)
    {
        CloudBLL.User bllUser = new CloudBLL.User();
        user = bllUser.BLLSelectEntInnerUser(user);
        return user;
    }

    public static int VerifyAdmin(User user)
    {
        CloudBLL.User bllUser = new CloudBLL.User();
        user = bllUser.BLLSelectAdminUser(user);
        return user.UserState;
    }

    public static void Request(HttpContext context, string msg)
    {
        context.Response.Write(msg);
        context.Response.End();
        return;
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}