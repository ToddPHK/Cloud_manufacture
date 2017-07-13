using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Data;

public partial class announcement : System.Web.UI.Page
{

    protected void Page_Load(object sender, EventArgs e)
    {
        //
        Response.Write("    <iframe src='../../../dongtaishangchuan/mht/" + Request["filename"].ToString() + "'   width='100%' height='900' scrolling='yes' frameborder='0'></iframe>");
    }
}