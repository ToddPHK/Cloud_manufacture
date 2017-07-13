var failureAnalysis = new Ext.form.FormPanel({title:'失效分析',id:'failureAnalysis',autoHeight: true,
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
fieldLabel:'预算',
width:120,
name:'Bedget'

}]
                            },{
                            layout:'form',
                             items:[{xtype:'textfield',
fieldLabel:'报告形式',
width:120,
name:'ReportType'

}]
                            }]
                            }
]
                            });
