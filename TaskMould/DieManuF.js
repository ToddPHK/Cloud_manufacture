var DieManuF = new Ext.form.FormPanel({title:'模具制作',id:'DieManuF',autoHeight: true,
    frame: true,
    layout: 'form', 
    defaults: {              
         autoScroll: true

    },
    labelAlign: 'right',
    items: [{ // 行D2
                            layout:'column',
                            items:[{
                            layout:'form',
                             items:[{xtype:'textfield',
fieldLabel:'联系方式',
width:120,
emptyText:'输入手机号码',
name:'ContactUs'

}]
                            },{
                            layout:'form',
                             items:[{xtype:'combotree',
fieldLabel:'模具类型',
width:120,
allowBlank:false,
blankText:'',
name:'MoldType',

                resizable: true,
                autoScroll: false,
                autoLoad: true,
                //listWidth:300, 这是设置下拉框的宽度，默认和comBoxTree的宽度相等   
                tree: new Ext.tree.TreePanel({
                    rootVisible: false,
                    autoScroll: false,
                    autoHeight: true,
                    listeners: {//监听
                        'contextmenu': function (node, e) {
                            // 编辑菜单  
                            menu = new Ext.menu.Menu([{
                                text: '展开',
                                handler: function () {
                                    node.expand(true, false);
                                    //  alert(node.text + '|' + node.id);
                                }
                            }, {
                                text: '收缩',

                                handler: function () {
                                    node.collapse(true, true);
                                }
                            }])
                            menu.showAt(e.getPoint());
                        }
                    },
                    loader: new Ext.tree.TreeLoader({url: '../../../PlatForm_Admin/TaskTemplateData.aspx?OperateType=DieClass'   }),
                    root: new Ext.tree.AsyncTreeNode({ id: '0', text: '标准任务' })
                }),
                selectModel: 'single',
                selectNodeModel: 'all'
}]
                            }]
                            },
{ // 行D2
                            layout:'column',
                            items:[{
                            layout:'form',
                             items:[{xtype:'textfield',
fieldLabel:'预算',
width:120,
emptyText:'单位万元',
name:'Bedget'

}]
                            },{
                            layout:'form',
                             items:[{xtype:'textfield',
fieldLabel:'工期',
width:120,
emptyText:'单位天',
allowBlank:false,
blankText:'',
regex:/^[0-9]*$/,
regexText:'请输入数字',
name:'Pduration'

}]
                            }]
                            },
{ // 行D2
                            layout:'column',
                            items:[{
                            layout:'form',
                             items:[{xtype:'datefield',
fieldLabel:'开始时间',
width:120,
allowBlank:false,
blankText:'',
name:'StartTime',
format:'Y-m-d H:i:s'
}]
                            },{
                            layout:'form',
                             items:[{xtype:'datefield',
fieldLabel:'截止日期',
width:120,
name:'Deadline',
format:'Y-m-d H:i:s'
}]
                            }]
                            }
]
                            });
