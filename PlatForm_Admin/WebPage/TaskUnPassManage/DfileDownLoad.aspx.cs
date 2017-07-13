using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;

public partial class MyDisk_DfileDownLoad : System.Web.UI.Page
{
    // string databasename = "fsdq";
    protected void Page_Load(object sender, EventArgs e)
    {

        if (Request["fileOperateType"].Equals("download"))
        {
            string filename = Request["filename"].ToString().Trim();
            string EntName = Request["EntName"].ToString().Trim();
            if (!string.IsNullOrEmpty(filename) && !filename.Equals(""))
            {
                string downloadfilepath = Server.MapPath("~") + "/UpLoadFiles/" + EntName.Trim() + "/" + filename;

                downLoadFile(filename, downloadfilepath);

            }
        }

    }
    public bool downLoadFile(string fileName, string downloadfilepath)
    {

        if (downloadfilepath != "")
        {
            try
            {
                FileInfo fileInfo = new FileInfo(downloadfilepath);
                Response.Clear();
                Response.ClearContent();
                Response.ClearHeaders();
                Response.AddHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode(fileName, System.Text.Encoding.UTF8));
                Response.AddHeader("Content-Length", fileInfo.Length.ToString());//告诉浏览器是下载文件，而不是打开文件
                Response.AddHeader("Content-Transfer-Encoding", "binary");
                Response.ContentType = "application/msword";
                Response.Charset = "UTF-8";
                Response.ContentEncoding = System.Text.Encoding.Default;
                // Response.ContentEncoding = System.Text.Encoding.GetEncoding("gb2312");
                Response.WriteFile(fileInfo.FullName);
                Response.Flush();
                // Response.End();
                HttpContext.Current.ApplicationInstance.CompleteRequest();
            }
            catch (Exception err)
            {
                Response.Write("<script>alert(" + "'" + "出错信息：" + err.Message + "'" + ")</script>");

                return false;
            }
            return true;
        }
        else
        {
            Response.Write("<script>alert('你好没选择要下载的文件！')</script>");

            return false;
        }
    }

}
