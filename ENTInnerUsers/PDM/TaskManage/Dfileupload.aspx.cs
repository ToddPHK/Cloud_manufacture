using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;

public partial class _Default : System.Web.UI.Page
{
    //string databasename = "fsdq";
    protected void Page_Load(object sender, EventArgs e)
    {
        string connectstr = Session["connectstr"].ToString();
        if (connectstr != "")
        {
            Response.Clear();

            Response.Write(this.SaveFiles(connectstr, Request["TaskID"].ToString()));

            Response.End();
        }
    }
    public string SaveFiles(string connectstr, string TaskID)
    {
        ///'遍历File表单元素
        HttpFileCollection files = HttpContext.Current.Request.Files;
        string sql;
        try
        {
            for (int iFile = 0; iFile < files.Count; iFile++)
            {
                ///'检查文件扩展名字
                HttpPostedFile postedFile = files[iFile];
                string fileName;

                double fileSizer = postedFile.ContentLength;
                if (fileSizer > 104857600)
                    return "{success:true,msg:'文件不能大于100M',tr:'another inf'}";

                fileName = System.IO.Path.GetFileName(postedFile.FileName);


                if (fileName != "")
                {
                    if (sqlExecute.sqlmanage.HasRecord(connectstr, "select * from TaskList where TaskID <>" + TaskID + " and FileName='" + fileName+"'"))
                    {
                        return "{success:true,msg:'已有同名文件',tr:'another inf'}";
                    }
                    else
                    {
                        sql = "update TaskList Set FileName='" + fileName + "' where TaskID=" + TaskID;
                        //获取企业注册的用户名
                        // postedFile.SaveAs(System.Web.HttpContext.Current.Request.MapPath("myWebDisk/") + fileName);

                        if (sqlExecute.sqlmanage.ExecuteSQL(sql, connectstr))
                        {
                          
                             //postedFile.SaveAs(Server.MapPath("/") + "/WebCloud/UpLoadFiles/" + Session["adminname"].ToString().Trim() + "/" + fileName);
                            postedFile.SaveAs(Server.MapPath("~") + "/UpLoadFiles/" + Session["adminname"].ToString().Trim() + "/" + fileName);
                            if (!string.IsNullOrEmpty(Request["DelFileName"].ToString().Trim()))
                            File.Delete(Server.MapPath("~") + "/UpLoadFiles/" + Session["adminname"].ToString().Trim() + "/" + Request["DelFileName"].ToString().Trim());   //删除原有文件
                        }
                    }
                }
            }
            return "{success:true,msg:'文件上传成功',tr:'another inf'}";
        }
        catch (System.Exception Ex)
        {
            return "{success:false,msg:'文件上传失败!'}";
        }
    }
}