<%@ Page Language="C#" AutoEventWireup="true" CodeFile="index.aspx.cs" Inherits="index" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>云制造</title>
    <link rel="Stylesheet" type="text/css" href="ext-3.2.0/resources/css/ext-all.css" />
    <link rel="Stylesheet" type="text/css" href="ext-3.2.0/extjsPlugins/GroupTabPanel/GroupTab.css" />
    <script type="text/javascript" src="ext-3.2.0/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="ext-3.2.0/ext-all.js"></script>
    <script type="text/javascript" src="ext-3.2.0/src/locale/ext-lang-zh_CN.js"></script>
    <script type="text/javascript" src="ext-3.2.0/extjsPlugins/GroupTabPanel/GroupTabPanel.js"></script>
    <script type="text/javascript" src="ext-3.2.0/extjsPlugins/GroupTabPanel/GroupTab.js"></script>
    <style type="text/css">
        /* styles for iconCls */.x-icon-tickets
        {
            background-image: url('images/tickets.png');
        }
        .x-icon-subscriptions
        {
            background-image: url('images/subscriptions.png');
        }
        .x-icon-users
        {
            background-image: url('images/group.png');
        }
        .x-icon-templates
        {
            background-image: url('images/templates.png');
        }
    </style>
</head>
<body>
    <script type="text/javascript">
        Ext.onReady(function () {
            Ext.QuickTips.init();
            Ext.apply(Ext.form.VTypes, {
                password: function (val, field) {//val指这里的文本框值，field指这个文本框组件，大家要明白这个意思
                    if (field.confirmTo) {//confirmTo是我们自定义的配置参数，一般用来保存另外的组件的id值
                        var pwd = Ext.get(field.confirmTo); //取得confirmTo的那个id的值
                        return (val == pwd.getValue());
                    }
                    return true;
                }
            });

            var EditPassWord_Panel = new Ext.Panel({
                layout: 'form',
                border: false,
                items: [{
                    xtype: "textfield",
                    id: "pass1",
                    fieldLabel: "密码",
                    inputType: 'password',
                    name: 'PassWord',
                    regex: /[\x21-\x7E]{6,12}/,
                    regexText: "只能输入由数字、26个英文字母组成的字符串,长度在6~12之间",
                    width: 120
                }, {
                    xtype: "textfield",
                    fieldLabel: "确认密码",
                    inputType: 'password',
                    submitValue: false,
                    vtype: "password", //自定义的验证类型
                    vtypeText: "两次密码不一致！",
                    confirmTo: "pass1", //要比较的另外一个的组件的id
                    width: 120
                }]
            });
            var EditPassWord_Win = new Ext.Window({
                collapsible: false,
                maximizable: false,
                resizable: false,
                layout: 'fit',
                width: 260,
                height: 125, //15+ -
                modal: false,
                border: false,
                closeAction: "hide",
                plain: true,
                title: '密码修改',
                buttonAlign: 'center',
                buttons: [{ text: "确认修改", handler: EditPassWord}],
                items: [EditPassWord_Panel]
            });
            var btbar = new Ext.Toolbar({
                items: ['->', {
                    text: "修改密码",
                    handler: ShowEditPassWord_Win
                }]

            });
            function ShowEditPassWord_Win() {
                EditPassWord_Win.show();
            }
            function EditPassWord() {
                if (EditPassWord_Panel.form.isValid())//判断是否通过客户端验证
                {
                    EditPassWord_Panel.form.submit({
                        waitMsg: '正在提交数据请稍等...', 		//提示信息
                        waitTitle: '提示', 					//标题
                        url: 'DataProcess.aspx', //请求的url地址
                        method: 'GET',
                        params: {
                            OperateType: "EditPassWord"
                        },
                        success: function (form, action) {
                            EditPassWord_Win.hide();
                            // App.setAlert(App.STATUS_NOTICE, action.result.msg);
                            Ext.Msg.alert('提示', action.result.msg);

                        },
                        failure: function (form, action) {
                            //App.setAlert(App.STATUS_NOTICE, action.result.msg);
                            Ext.Msg.alert('提示', action.result.msg);

                        }
                    });

                }
            }

            var MyMaintabPanel = new Ext.TabPanel({
                //resizeTabs:true,宽度能自动变化,但是影响标题的显示
                region: 'center',
                activeTab: 0,
                tabPosition: 'top', //表示TabPanel头显示的位置,只有两个值top和bottom.默认是top.    
                frame: true,
                tbar: btbar,
                items: [{
                    title: "项目任务",
                    html: ' <iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="ENTUsers/Index.aspx" > </iframe>'
                }, {
                    title: "资源服务",
                    html: ' <iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="../CloudMfg_SRMS/index.aspx" > </iframe>'
                }]
            });
            var viewport = new Ext.Viewport({
                layout: 'border', //布局,必须是border
                loadMask: true,
                items: [MyMaintabPanel]
            });
        });
    </script>
</body>
</html>
