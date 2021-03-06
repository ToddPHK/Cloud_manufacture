﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class SoftWare_WebPage_DataProcess : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            if (String.IsNullOrEmpty(Session["PlatForm_connectstr"].ToString()))
            {
                Response.Write("{success:false,Login:false}");


            }
            else
            {
                string PlatForm_connectstr = Session["PlatForm_connectstr"].ToString();
                if (Request["OperateType"] != null)
                {
                    string OperateType = Request["OperateType"].ToString();
                    if (OperateType.Equals("DeleteFromStore"))
                    {
                        List<string> NoDelete = new List<string>();
       
                        string[] IDS = Request["IDS"].ToString().Split(',');
                        foreach (string ID in IDS)
                        {
                            string NowTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                            if (sqlExecute.sqlmanage.HasRecord(PlatForm_connectstr, "select * from UserLevel where ID=" + ID + " and 状态=2  and 起止日期<='" + NowTime + "' and 终止日期>='" + NowTime + "' "))
                                NoDelete.Add(ID);

                        }


                        string[] NoDelete_FeedBack = NoDelete.ToArray();
                        string sql = "";
                        if (NoDelete_FeedBack.Length>0)
                            sql="delete from UserLevel where ID in (" + Request["IDS"].ToString() + ") and ID not in (" + string.Join(",", NoDelete_FeedBack) + ")";
                        else
                            sql = "delete from UserLevel where ID in (" + Request["IDS"].ToString() + ") ";

                        if (sqlExecute.sqlmanage.ExecuteSQL(sql, PlatForm_connectstr))
                        {
                            if (NoDelete_FeedBack.Length < 1)
                            {
                                Response.Write("{success:true,HasNoDelete:false}");
                            }
                            else
                            {
                                Response.Write("{success:true,HasNoDelete:true,NoDeleteID:'" + string.Join(",", NoDelete_FeedBack) + "'}");
                            }

                        }
                        else
                        {
                            Response.Write("{success:false,Login:true}");
                        }

                    }
                    else if (OperateType.Equals("PassApply"))
                    {
                        if (sqlExecute.sqlmanage.ExecuteSQL("update UserLevel set 状态=2,审核时间='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where ID in (" + Request["IDS"].ToString() + ")", PlatForm_connectstr))
                        {

                            Response.Write("{success:true,msg:'审核成功'}");
                        }
                        else
                        {
                            Response.Write("{success:false,msg:'审核失败！'}");
                        }

                    }
                    else if (OperateType.Equals("NoPassApply"))
                    {
                        if (sqlExecute.sqlmanage.ExecuteSQL("update UserLevel set 状态=3,审核时间='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where ID in (" + Request["IDS"].ToString() + ")", PlatForm_connectstr))
                        {

                            Response.Write("{success:true,msg:'审核成功'}");
                        }
                        else
                        {
                            Response.Write("{success:false,msg:'审核失败！'}");
                        }

                    }
                }
            }
        }
        catch (Exception err)
        {
            Response.Write("{success:false,Login:false}");
        }

        Response.End();
        Response.Clear();
    }
}