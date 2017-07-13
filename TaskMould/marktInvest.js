var marktInvest = new Ext.form.FormPanel({title:'市场调研',id:'marktInvest',autoHeight: true,
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
fieldLabel:'报告形式',
width:120,
name:'ReportType'

}]
                            },{
                            layout:'form',
                             items:[{xtype:'textfield',
fieldLabel:'论证方式',
width:120,
name:'ArguType'

}]
                            }]
                            },
{ // 行D2
                            layout:'column',
                            items:[{
                            layout:'form',
                             items:[{xtype:'textfield',
fieldLabel:'数据来源',
width:120,
name:'DataSource'

}]
                            }]
                            }
]
                            });
