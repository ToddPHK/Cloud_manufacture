using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
//using System.Web.Mail;
using System.Net.Mail;
using System.Text.RegularExpressions;//提供Regex类


public partial class SendEMail_Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void Button1_Click(object sender, EventArgs e)
    {
        /* 2.介绍使用client.DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network传送邮件。 
 使用该项的话。你的电脑首先必须是直接链接外网的。 
 那就直接把mail.aspx.cs里的client.DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.PickupDirectoryFromIis;换成client.DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network; 
 然后要设定的就是 
 //SendMail(发件者, 收件者, 主旨, 内容, 主机,发件者昵称, 密码 ,附件) 
 SendMail("loeley@gmail.com", "sy4l@163.com", "主旨", "12.37郵件內容", "smtp.163.com", "loeley", "81859505", "");
         * 注意126的域名是smtp.126.com 
 163的域名是smtp.163.com
         */


        string strFrom = "world745420@sina.com";
        string strTo = "world745420@163.com";
        string strSubject = "webtest";
        string strBody = "测试";
        System.Net.Mail.MailMessage message = new System.Net.Mail.MailMessage(strFrom, strTo, strSubject, strBody);
        message.BodyEncoding = System.Text.Encoding.UTF8;
        message.IsBodyHtml = true;
        SendSMTPEMail("smtp.sina.com", "world745420@sina.com", "13508901", message);

    }
    /// <summary>
    /// 
    /// </summary>
    /// <param name="strSmtpServer"></param>
    /// <param name="strFrom">邮箱用户名</param>
    /// <param name="strFromPass">邮箱密码</param>
    /// <param name="message"></param>
    public void SendSMTPEMail(string strSmtpServer, string strFrom, string strFromPass, MailMessage message)
    {
        try
        {
            SmtpClient client = new SmtpClient(strSmtpServer);
            client.UseDefaultCredentials = true;
            client.Credentials = new System.Net.NetworkCredential(strFrom, strFromPass);
            client.DeliveryMethod = SmtpDeliveryMethod.Network;

            client.Send(message);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }
}