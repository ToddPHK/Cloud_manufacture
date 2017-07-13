<%@ Page Language="C#" AutoEventWireup="true" CodeFile="TestTemplate.aspx.cs" Inherits="TestTemplate" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link rel="Stylesheet" type="text/css" href="ext-3.2.0/resources/css/ext-all.css" />
    <script type="text/javascript" src="ext-3.2.0/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="ext-3.2.0/ext-all.js"></script>
    <script type="text/javascript" src="ext-3.2.0/src/locale/ext-lang-zh_CN.js"></script>
    <script type="text/javascript" src="ext-3.2.0/extjsPlugins/ComboBoxTree.js"></script>
    <script type="text/javascript" src="ext-3.2.0/extjsPlugins/TreeCheckNodeUI.js"></script>
    <script type="text/javascript" src="TaskMould/DieManuF.js"></script>
</head>
<body>
    <script type="text/javascript">
     Ext.require([ 
    'Ext.data.*', 
    'Ext.grid.*', 
    'Ext.tree.*' 
]); 

var ptag = false; 
var ptag2=0; 
var partyName; 
var companyNumber; 
Ext.onReady(function() { 
   
    Ext.define('Task', { 
        extend: 'Ext.data.Model', 
        fields: [ 
        {name:'totalCount', type:'string'}, 
            {name: 'groupName',     type: 'string'},  //集团名称 
            {name: 'company_Leader',     type: 'string'},//公司领导 5 
            {name: 'info_Tech', type: 'string'},//信息技术  0 
            {name: 'core_Business',    type: 'string'},//核心业务  1 
            {name: 'finance_Purchase',    type: 'string'}, //财务采购 2 
            {name: 'administrative_Department',    type: 'string'},//行政部门 3 
            {name: 'regulatory_Department',    type: 'string'},// 纪检部门 4 
            {name: 'other',    type: 'string'}, //其它 
            {name: 'province',    type: 'string'}, //所在省 
            {name: 'partyid', type:'string'} //parytId 
            
        ], 
        idProperty:"partyid" 
    }); 
//treegird 的store 
    var store = Ext.create('Ext.data.TreeStore', { 
        model: 'Task', 
        proxy: { 
            type: 'ajax', 
            url: 'memberTreeODS.do', //memberTreeGrid JSON 
             reader: { 
            type: 'json', 
            root: 'children', 
            totalProperty:'totalCount' 
           
        } 
            
        }, 
       autoLoad:false 
    }); 
    
  
    
    var itemsPerPage = 1;   // set the number of items you want per page 
    
    var storePage = Ext.create('Ext.data.Store', { 
        id:'simpsonsStore', 
        autoLoad: false, 
        fields:[], 
        pageSize: itemsPerPage, // items per page 
        proxy: { 
            type: 'ajax', 
            url: 'memberTreeODS.do',  // url that will load data with respect to start and limit params 
            reader: { 
                type: 'json', 
                root: 'children', 
                totalProperty: 'totalCount' 
            } 
        } 
    }); 
    if(ptag2==0){ 
alert(1); 
    storePage.load({ 
    
        params:{ 
            start:0,    
            limit: itemsPerPage, 
            partyName1:'Test' 
            
        } 
    });}else{ 
   alert(2); 
    storePage.load({ 
        params:{ 
            start:0,    
            limit: itemsPerPage, 
             partyName:Ext.getCmp('party').getValue(), 
             companyNumber:Ext.getCmp('companyCode').getValue() 
        } 
    }); 
    }; 
    var bbarModel=new Ext.PagingToolbar({ 
        id:'pageTool', 
        pageSize:pageSize, 
        store:storePage , //分页的STORE 
        displayInfo:true, 
        displayMsg:'显示{0}---{1}条,共{2}条', 
        emptyMsg:"没有记录", 
        listeners:{ 
change:function(obj,pdata,options){ 
//store3.removeAll( ) ; 
if(pdata.currentPage==1){ 
if(ptag2 ==0){ 
return; 

} 
} 
ptag2++; 
partyName=Ext.getCmp('party').getValue(); 
companeyNumber=Ext.getCmp('companyCode').getValue(); 
store.on('beforeload',function(){        // =======翻页时 查询条件 
               store.baseParams={ 
                        partyName:Ext.getCmp('party').getValue(),companyNumber:Ext.getCmp('companyCode').getValue() 
                       } 
            }); 

store.load({ 
params:{ 
            start:pdata.fromRecord,  
             page:pdata.currentPage, 
            limit: itemsPerPage 
        } 
}); 
//var x=pdata; 
} 

        } 
        
        
        } 
        
        ) 
    
    
    
    
    

    var companyOptions = new Ext.data.Store({ 
fields: ['id','name'], 
proxy: new Ext.data.HttpProxy({ 
    url: rootPath + '/vip/getCompany.do' 
}), 

reader: new Ext.data.JsonReader({ 
    type: "json" 
}), 
autoLoad:true 
}); 
     var combo =   Ext.create('Ext.form.ComboBox',{ 
       id:"companyCode", 
store:companyOptions, 
valueField:'id', 

displayField:'name', 
fieldLabel:'所属省份', 
labelAlign:'right', 
emptyText: '请选择...', 
editable: false, 

multiSelect:false 

       
    }); 
var pageSize=1; 
    //Ext.ux.tree.TreeGrid is no longer a Ux. You can simply use a tree.TreePanel 
    var tree = Ext.create('Ext.tree.Panel', { 
    id:'trPanel', 
        title: '重要成员信息', 
    //    width: 1000, 
        height: 400, 
       // renderTo: treegrid, 
        collapsible: true, 
     border:'1 1 1 1', 
        useArrows: true, 
        rootVisible: false, 
        store: store, 
        multiSelect: false, 
        singleExpand: true, 
        align: 'center', 
        bbar: new Ext.PagingToolbar({ 
        partyName:partyName, 
companyNumber:companyNumber, 
        id:'pageTool', 
        pageSize:pageSize, 
        store:storePage , //分页的STORE 
        displayInfo:true, 
        displayMsg:'显示{0}---{1}条,共{2}条', 
        emptyMsg:"没有记录", 
        listeners:{ 
change:function(obj,pdata,options){ 
//store3.removeAll( ) ; 
if(pdata.currentPage==1){ 
if(ptag2 ==0){ 
return; 

} 
} 
ptag2++; 


store.load({ 
params:{ 
  partyName:Ext.getCmp('party').getValue(), 
  companyNumber:Ext.getCmp('companyCode').getValue(), 
            start:pdata.fromRecord,  
             page:pdata.currentPage, 
            limit: itemsPerPage 
        } 
}); 

} 

        } 
        
        
        } 
        
        ), 
        columns: [{ 
            xtype: 'treecolumn', //this is so we know which column will show the tree 
            text: '集团名称', 
            flex: 1, 
            sortable: false, 
             align: 'center', 
            dataIndex: 'groupName'   //?????????? 
        },{ 
            text: '公司领导', 
            flex: 1, 
            dataIndex: 'company_Leader', 
              align: 'center', 
              renderer:function(v,v2,rec){ 
              return '<span style="color:blue;" onclick="openItems(\'5\',\''+rec.data.partyid+'\')">'+v+'</span>'; 
              }, 
            sortable: false 
            
        },{ 
            text: '信息技术', 
            flex: 1, 
            dataIndex: 'info_Tech', 
              align: 'center', 
                renderer:function(v,v2,rec){ 
              return '<span style="color:blue;" onclick="openItems(\'0\',\''+rec.data.partyid+'\')">'+v+'</span>'; 
              }, 
            sortable: false 
        },{ 
            text: '核心业务', 
            flex: 1, 
            dataIndex: 'core_Business', 
              align: 'center', 
                renderer:function(v,v2,rec){ 
              return '<span style="color:blue;" onclick="openItems(\'1\',\''+rec.data.partyid+'\')">'+v+'</span>'; 
              }, 
            sortable: false 
        },{ 
            text: '财务采购', 
            flex: 1, 
            dataIndex: 'finance_Purchase', 
              align: 'center', 
                renderer:function(v,v2,rec){ 
              return '<span style="color:blue;" onclick="openItems(\'2\',\''+rec.data.partyid+'\')">'+v+'</span>'; 
              }, 
            sortable: false 
        },{ 
            text: '行政部门', 
            flex: 1, 
            dataIndex: 'administrative_Department', 
              align: 'center', 
                renderer:function(v,v2,rec){ 
              return '<span style="color:blue;" onclick="openItems(\'3\',\''+rec.data.partyid+'\')">'+v+'</span>'; 
              }, 
            sortable: false 
        },{ 
            text: '纪检剖门', 
            flex: 1, 
            dataIndex: 'regulatory_Department', 
            align: 'center', 
              renderer:function(v,v2,rec){ 
              return '<span style="color:blue;" onclick="openItems(\'4\',\''+rec.data.partyid+'\')">'+v+'</span>'; 
              }, 
            sortable: false 
        },{ 
            text: '其它', 
            flex: 1, 
            dataIndex: 'other', 
             align: 'center', 
               renderer:function(v,v2,rec){ 
              return '<span style="color:blue;" onclick="openItems(\'9\',\''+rec.data.partyid+'\')">'+v+'</span>'; 
              }, 
            sortable: false 
        },{ 
            text: '所在省', 
            flex: 1, 
            dataIndex: 'province', 
             align: 'center', 
            sortable: false 
        } 
        ] 

    }); 
    
    var layout=Ext.create('Ext.panel.Panel', 
   
    { 
      bodyStyle:{ 
     style:'border-left: 0 solid #8db2e3;' 
     }, 
    items:[ 
    { 
    xtype:'panel', 
    layout:{ 
    type:'table', 
    columns:3 
    }, 
       
    defaults:{labelAlign:'right',fieldWidth:100,margin:'10px 5px 10px 10px'}, 
    items:[ 
    combo, 
    { 
    xtype:'textfield', 
    fieldLabel:'集团客户', 
    id:'party' 
    },{ 
    xtype:'button', 
    text:'查询', 
       handler:function(){ 
    ptag = false; 
    ptag2=0; 
    var obj=Ext.getCmp("pageTool"); 
    //var objTP=Ext.getCmp("trPanel"); 
    //objTP.bbar=bbarModel; 
    store.load({ 
    params:{ 
    start:0, 
            page:1,   
            limit: itemsPerPage, 
            partyName:Ext.getCmp('party').getValue(), 
            companyNumber:Ext.getCmp('companyCode').getValue() 
            }, 
        callback:function(r,options,success){ 
        
        var r=r; 
        var options=options; 
         var storePageObj=Ext.getCmp('simpsonsStore'); 
         storePage.load({ 
         params:{ 
    start:0, 
            page:1,   
            limit: itemsPerPage, 
            partyName:Ext.getCmp('party').getValue(), 
            companyNumber:Ext.getCmp('companyCode').getValue() 
            } 
         }); 
          obj.moveFirst(); 
    
        
        } 
            
    
    }); 
    
    /*storePage.load({ 
    params:{ 
    start:0, 
            page:1,   
            limit: itemsPerPage, 
            partyName:Ext.getCmp('party').getValue(), 
            companyNumber:Ext.getCmp('companyCode').getValue() 
            }, 
        callback:function(r,options,success){ 
        
        var r=r; 
        var options=options; 
         var storePageObj=Ext.getCmp('simpsonsStore'); 
         
    
        
        } 
            
    
    }); 
    
    */ 
    
    //还是没执行,分页还是没到初始化 
    /* 
    storePage.on('beforeload',function(){        // =======翻页时 查询条件 
               storePage.baseParams={ 
                        partyName:Ext.getCmp('party').getValue(),companyNumber:Ext.getCmp('companyCode').getValue() 
                       }; 
                     
                          
            });  */ 
    } 
    } 
    
    ] 
    }, 
    tree 
    
    ] 
    }); 
    layout.render(document.body); 
}); 


function openItems(six,partyid,countno){ 
countno=1; 
window.open('../memberInfo/memberListView.do?party '详细信息', 'height=600, width=800, top=100, status=no') ; 

} 


    </script>
</body>
</html>
