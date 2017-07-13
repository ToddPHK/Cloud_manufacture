Ext.onReady(function() {
	Ext.BLANK_IMAGE_URL = 'extjs/resources/images/default/s.gif';

	var tree = new Ext.tree.ColumnTree({
				// el:'tree-ct',
				width : 630,
				autoHeight : true,
				rootVisible : false,
				autoScroll : true,
				expandable : false,
				enableDD : false, // 是否允许拖动
				title : '配置单详细信息',
				tbar : [{
					text : '保存配置单',
					tooltip : 'Save Menu',
					iconCls : 'save-icon',
					listeners : {
						'click' : function() {
							var json = tree.toJsonString(null, function(key,
											val) {
										return (key == 'name' || key == 'count'
												|| key == 'price1' || key == 'price2');
									}, {
										name : 'name',
										count : 'count',
										price1 : 'price1',
										price2 : 'price2'
									});
							alert(json);
						},
						scope : this
					}
				}],
				columns : [{
							header : '产品编号',
							width : 180,
							dataIndex : 'task'
						}, {
							header : '产品名称',
							width : 110,
							dataIndex : 'name'
						}, {
							header : '数量',
							width : 110,
							dataIndex : 'count'
						}, {
							header : '单价(日期1)',
							width : 110,
							dataIndex : 'price1'
						}, {
							header : '单价(日期2)',
							width : 110,
							dataIndex : 'price2'
						}],

				loader : new Ext.tree.TreeLoader({
							preloadChildren : true,
							dataUrl : 'data.jsp',
							uiProviders : {
								'col' : Ext.tree.ColumnNodeUI
							}
						}),

				root : new Ext.tree.AsyncTreeNode({
							text : 'Tasks'
						})

			});
	// tree.render();
	tree.expandAll();
	var te = new Ext.tree.ColumnTreeEditor(tree, {
				completeOnEnter : true,
				autosize : true,
				ignoreNoChange : true
			});

	var detailWin = new Ext.Window({
				el : 'tree-ct',
				title : 'window',
				modal : true,
				width : 800,
				height : 400,
				items : [tree]
			});
	detailWin.show();
});