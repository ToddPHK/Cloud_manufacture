<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="PlatForm_Admin_WebPage_TaskStateManage_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link rel="Stylesheet" type="text/css" href="../../../ext-3.2.0/resources/css/ext-all.css" />
    <link rel="Stylesheet" type="text/css" href="../../../css/myIcon.css" />
    <script type="text/javascript" src="../../../ext-3.2.0/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/ext-all.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/src/locale/ext-lang-zh_CN.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/App.js"></script>
    <script type="text/javascript" src="../../js/CodeOperaMethod.js"></script>
    <script type="text/javascript">
        Ext.util.CSS.swapStyleSheet('theme', '../../' + '<%=Session["StyleSheet"].ToString()%>');
        //  var UserType = '<%=Session["UserType"]%>';
        var App = new Ext.App({});

        //-------------------------------

        var TaskState_FormPanel = new Ext.form.FormPanel({
            autoHeight: true,
            frame: true,
            // layout: "form", // 整个大的表单是form布局
            labelAlign: "left",
            items: [{
                regex: /^[^\\'‘’]+$/,
                regexText: "不能包含单引号",
                xtype: "textfield",
                fieldLabel: "名称",
                labelWidth: 20,
                name: 'TaskStateName',
                width: 120
            }, {
                xtype: "textfield",
                readOnly :true,
                fieldLabel: "颜色值",
                labelWidth: 20,
                name: 'ColorValue',
                width: 120
            }, {
                xtype: "hidden",
                name: 'TaskStateID'
            }]
        });

        //----------------------------------
        Ext.onReady(function () {
            var TaskState_Window = new Ext.Window({
                //layout: 'fit',
                width: 400,
                height: 400,
                modal: true,
                closeAction: "hide",
                title: '任务状态编辑',
                buttonAlign: 'center',
                contentEl: 'Color_State', //面板包含的内容
                items: [TaskState_FormPanel],
                buttons: [{
                    text: '保存',
                    //点击保存按钮后触发事件  
                    handler: function () {
                        SaveTaskState();

                    }
                }, {
                    text: '原颜色',
                    //点击保存按钮后触发事件  
                    handler: function () {
                        var rec = TaskStateTablePanel_sm.getSelected();
                        TaskState_FormPanel.form.findField("ColorValue").setValue(rec.get("ColorValue"));

                    }
                }]
            });

            function SaveTaskState() {
               
               // return;
                if (TaskState_FormPanel.form.isValid())//判断是否通过客户端验证
                {
                    TaskState_FormPanel.form.submit({
                        waitMsg: '正在提交数据请稍等...', 		//提示信息
                        waitTitle: '提示', 					//标题
                        url: 'DataProcess.aspx', //请求的url地址
                        method: 'GET',
                        params: {
                            OperateType: "TaskStateEdit"
                        },
                        success: function (form, action) {
                            TaskState_Window.hide();
                            App.setAlert(App.STATUS_NOTICE, action.result.msg);
                            TaskStateStore.load();

                        },
                        failure: function (form, action) {
                            App.setAlert(App.STATUS_NOTICE, action.result.msg);
                            //  Ext.Msg.alert('提示', '对模板行的操作失败');

                        }
                    });

                }
            }
            var TaskStateProxy = new Ext.data.HttpProxy({
                url: 'DataProcess.aspx'
            });

            var TaskStateReader = new Ext.data.JsonReader(
                    { root: 'rows', totalProperty: 'results' },
                        [
                        { name: "TaskStateID" },
                        { name: "TaskStateName" },
                        { name: "ColorValue" }
                        ]
                    );

            var TaskStateStore = new Ext.data.Store(
                        { proxy: TaskStateProxy, reader: TaskStateReader }
                    );



            var TaskStateTablePanel_sm = new Ext.grid.CheckboxSelectionModel({
                singleSelect: true
            });
            var TaskStatetbar = new Ext.Toolbar({
                items: [/* {
                    text: "添加",
                    iconCls: 'upload-icon',
                    handler: UploadFile
                }, '-', {
                    text: "删除",
                    iconCls: 'download-icon',
                    handler: DownloadFile
                }, '-', */{
                text: "编辑",
                iconCls: 'edit-icon',
                handler: Edit_TaskState
            }]
        });
        function Edit_TaskState() {
            if (TaskStateTablePanel_sm.hasSelection())//没有选择任务
            {
                var rec = TaskStateTablePanel_sm.getSelected();
                TaskState_FormPanel.form.findField("TaskStateName").setValue(rec.get("TaskStateName"));
                TaskState_FormPanel.form.findField("ColorValue").setValue(rec.get("ColorValue"));
                TaskState_FormPanel.form.findField("TaskStateID").setValue(rec.get("TaskStateID"));

                TaskState_Window.show();
            }
            else {
                App.setAlert(App.STATUS_NOTICE, " 你还没有选择任务！");
            }


        }
        var TaskStateTablePanel = new Ext.grid.GridPanel({
            title: '任务状态管理',
            //id: "TaskStateTablePanel",
            // viewConfig: { autoFill: true },
            region: 'center',
            frame: true,
            store: TaskStateStore,
            sm: TaskStateTablePanel_sm,
            height: 400,
            tbar: TaskStatetbar,
            loadMask: true,
            tools: [{
                id: 'refresh',
                handler: function () {
                    TaskStateStore.load();
                }

            }],
            columns: [
                    new Ext.grid.RowNumberer(),
                    TaskStateTablePanel_sm,
                    { header: '状态ID', dataIndex: 'TaskStateID', sortable: true },
                    { header: '名称', dataIndex: 'TaskStateName', sortable: true },
                    { header: '颜色', dataIndex: 'ColorValue', sortable: true, align: 'center', renderer: showSuspend }

            ]
        });


        TaskStateStore.baseParams.OperateType = "StateData";
        TaskStateStore.load();
        function showSuspend(val) {
            if (val == null || val == '')
                return "挂起中";
            else {
                return '<span style="background:' + val + '"> &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;  </span>';
            }
        }
        Ext.BLANK_IMAGE_URL = '../../../ext-3.2.0/resources/images/default/s.gif';
        var viewport = new Ext.Viewport({
            layout: 'border', //布局,必须是border
            loadMask: true,
            items: [TaskStateTablePanel
            ]
        });
    });




    </script>
</head>
<body>
    <table id="Color_State" border="0" cellspacing="0" cellpadding="0">
        <tbody>
            <tr>
                <td bgcolor="#fffff3" height="71%" width="593" colspan="2" align="middle">
                    <p class="style2">
                        <script language="JavaScript" type="text/javascript">
                            var SelRGB = '';
                            var DrRGB = '';
                            var SelGRAY = '120';

                            var hexch = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F');

                            function ToHex(n) {
                                var h, l;

                                n = Math.round(n);
                                l = n % 16;
                                h = Math.floor((n / 16)) % 16;
                                return (hexch[h] + hexch[l]);
                            }

                            function DoColor(c, l) {
                                var r, g, b;

                                r = '0x' + c.substring(1, 3);
                                g = '0x' + c.substring(3, 5);
                                b = '0x' + c.substring(5, 7);

                                if (l > 120) {
                                    l = l - 120;

                                    r = (r * (120 - l) + 255 * l) / 120;
                                    g = (g * (120 - l) + 255 * l) / 120;
                                    b = (b * (120 - l) + 255 * l) / 120;
                                } else {
                                    r = (r * l) / 120;
                                    g = (g * l) / 120;
                                    b = (b * l) / 120;
                                }

                                return '#' + ToHex(r) + ToHex(g) + ToHex(b);
                            }

                            function EndColor() {
                                var i;

                                if (DrRGB != SelRGB) {
                                    DrRGB = SelRGB;
                                    for (i = 0; i <= 30; i++)
                                        GrayTable.rows(i).bgColor = DoColor(SelRGB, 240 - i * 8);
                                }

                                SelColor.value = DoColor(RGB.innerText, GRAY.innerText);
                                ShowColor.bgColor = SelColor.value;
                                TaskState_FormPanel.form.findField("ColorValue").setValue(SelColor.value);
                            }
                        </script>
                        <script language="JavaScript" for="ColorTable" type="text/javascript" event="onclick">
  SelRGB = event.srcElement.bgColor;
  EndColor();
                        </script>
                        <script language="JavaScript" for="ColorTable" type="text/javascript" event="onmouseover">
  RGB.innerText = event.srcElement.bgColor;
  EndColor();
                        </script>
                        <script language="JavaScript" for="ColorTable" type="text/javascript" event="onmouseout">
  RGB.innerText = SelRGB;
  EndColor();
                        </script>
                        <script language="JavaScript" for="GrayTable" type="text/javascript" event="onclick">
  SelGRAY = event.srcElement.title;
  EndColor();
                        </script>
                        <script language="JavaScript" for="GrayTable" type="text/javascript" event="onmouseover">
  GRAY.innerText = event.srcElement.title;
  EndColor();
                        </script>
                        <script language="JavaScript" for="GrayTable" type="text/javascript" event="onmouseout">
  GRAY.innerText = SelGRAY;
  EndColor();
                        </script>

                    </p>
                    <!--[if IE]>
                  <TABLE   border=0 cellSpacing=1 width="100%">
                    <TBODY>
                    <TR>
                      <TD width="100%"></TD></TR>
                    <TR>
                      <TD width="100%" align=middle>色阶板</TD></TR></TBODY></TABLE>
                  <DIV align=center>
                  <CENTER>
                  <TABLE border=0 cellSpacing=10 cellPadding=0>
                    <TBODY>
                    <TR>
                      <TD>
                        <TABLE style="CURSOR: hand" id=ColorTable border=0 
                        cellSpacing=0 cellPadding=0>
                          <SCRIPT language=JavaScript type=text/javascript>
function wc(r, g, b, n)
{
	r = ((r * 16 + r) * 3 * (15 - n) + 0x80 * n) / 15;
	g = ((g * 16 + g) * 3 * (15 - n) + 0x80 * n) / 15;
	b = ((b * 16 + b) * 3 * (15 - n) + 0x80 * n) / 15;

	document.write('<TD BGCOLOR=#' + ToHex(r) + ToHex(g) + ToHex(b) + ' height=8 width=8></TD>');
}

var cnum = new Array(1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0);

  for(i = 0; i < 16; i ++)
  {
     document.write('<TR>');
     for(j = 0; j < 30; j ++)
     {
     	n1 = j % 5;
     	n2 = Math.floor(j / 5) * 3;
     	n3 = n2 + 3;

     	wc((cnum[n3] * n1 + cnum[n2] * (5 - n1)),
     		(cnum[n3 + 1] * n1 + cnum[n2 + 1] * (5 - n1)),
     		(cnum[n3 + 2] * n1 + cnum[n2 + 2] * (5 - n1)), i);
     }

     document.writeln('</TR>');
  }
  </SCRIPT>
                        </TABLE></TD>
                      <TD>
                        <TABLE style="CURSOR: hand" id=GrayTable border=0 
                        cellSpacing=0 cellPadding=0>
                          <SCRIPT language=JavaScript type=text/javascript>
  for(i = 255; i >= 0; i -= 8.5)
     document.write('<TR BGCOLOR=#' + ToHex(i) + ToHex(i) + ToHex(i) + '><TD TITLE=' + Math.floor(i * 16 / 17) + ' height=4 width=20></TD></TR>');
  </SCRIPT>
                        </TABLE></TD></TR></TBODY></TABLE></CENTER></DIV>
                  <DIV align=center>
                  <CENTER>
                  <TABLE border=0 cellSpacing=10 cellPadding=0>
                    <TBODY>
                    <TR>
                      <TD rowSpan=2 align=middle>选中色彩 
                        <TABLE id=ShowColor border=1 cellSpacing=0 cellPadding=0 
                        width=40 height=30>
                          <TBODY>
                          <TR>
                            <TD></TD></TR></TBODY></TABLE></TD>
                      <TD rowSpan=2>基色: <SPAN id=RGB></SPAN><SPAN 
                        style="FONT-SIZE: 9pt"><FONT color=#666666><BR>亮度: <SPAN 
                        id=GRAY>120</SPAN><BR>代码: <INPUT id=SelColor size=7 
                        type=text name=TEXT> </FONT></SPAN></TD>
                      <TD> </TD></TR>
                    <TR>
                      <TD>
                      </TD></TR></TBODY></TABLE></CENTER></DIV><![endif]-->
                    <!--[if !IE]>-->
                    <h3>
                        因为兼容性问题，色阶板功能只能在IE浏览器中运行</h3>
                    <!--<![endif]-->

                    <!--
                  <SCRIPT language=JavaScript type=text/javascript>
  //  document.write("<img src='http://counter.yesky.com/servlet/counter.counter?CID=12&AID=-1&refer="+escape(document.referrer)+"&cur="+escape(document.URL)+"' border='0' alt='' width='0' height='0'/>");
    </SCRIPT>-->
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>
