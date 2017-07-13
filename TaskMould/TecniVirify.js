var TecniVirify = new Ext.form.FormPanel({title:'技术论证',id:'TecniVirify',autoHeight: true,
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
                             items:[{xtype:'combo',
fieldLabel:'应用行业',
width:120,
name:'AppIndustry',
 
                store: new Ext.data.ArrayStore({url: '../../../PlatForm_Admin/TaskTemplateData.aspx?OperateType=IndustrySort',autoLoad:true,
                    fields: ['value', 'text'],
                    sortInfo: {
                        field: 'value',
                        direction: 'ASC'
                    }
                }),
                mode:'local',//数据加载模式，'local'本地加载，'remote'远程加载
                valueField : 'value',   
                displayField : 'text',  
               // value:'1001',   
                mode : 'local', //数据加载模式，local代表本地数据  
                triggerAction : 'all',  
                readOnly : false,   //只读，为true时不能编辑不能点击  
                editable:false
}]
                            },{
                            layout:'form',
                             items:[{xtype:'textfield',
fieldLabel:'调研类型',
width:120,
name:'ResearchType'

}]
                            },{
                            layout:'form',
                             items:[{xtype:'textfield',
fieldLabel:'数据来源',
width:120,
name:'DataSource'

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
name:'Bedget'

}]
                            },{
                            layout:'form',
                             items:[{xtype:'textfield',
fieldLabel:'工期',
width:120,
name:'Pduration'

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
