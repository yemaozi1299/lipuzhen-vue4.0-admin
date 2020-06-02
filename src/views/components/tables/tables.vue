<template>
	<div>
		<Card>
		  	<tables ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete" @on-save-edit="saveEdit"/>
		</Card>

	</div>
</template>

<script>
	import Tables from '@/components/tables';
	import Buttons from '@/components/buttons';
	export default {
		name: 'tables_page',
		components: {
		  	Tables,
		  	Buttons
		},
		data(){
			return{
				columns: [
					{
					    type: 'selection',
					    width: 80,
					    align: 'center'
					},
					{
					    title: '名称',
					    key: 'name',
					    sortable: true,
					    editable: true
					},
					{
					    title: '图片',
					    width: 120,
					    key: 'face',
					    "render": (h, params) =>{
					        return h('img', {
					            attrs: {
					                src: '' + params.row[params.column.key]
					            },
					            style: {
					                width: '100%'
					            },
					            on: {
					                click: () =>{
					                    this.handleView(params.row[params.column.key])
					                }
					            }
					        });
					    }
					},
					{
					    title: '分类',
					    width: 200,
					    key: 'classname'
					},
					{
					    title: '价格',
					    width: 200,
					    key: 'price',
					    sortable: true,
					    editable: true
					},
					{
					    title: '库存',
					    width: 200,
					    key: 'kc',
					    sortable: true,
					    editable: true
					},
					

					{
					    "title": "操作",
					    "key": "action",
					    "align": 'center',
					    "render": (h, params) =>{
					    	var isTop = 0;
					        return h('div', [
					        	h(Buttons, {
					        		props:{
					        			border: true
					        		},
						            style: {
						            },
						            on: {
						                'click': (val) =>{
						                    console.log(val);
						                }
						            }
						        }, '编辑'),
						        h(Buttons, {
						            props:{
					        			border: true,
					        			type: 'error'
					        		},
						            on: {
						                'click': (val) =>{
						                    console.log(val);
						                }
						            }
						        }, '删除'),

						        h(Buttons, {
						            props: {
						            	border: true,
						            	type: params.row.orderid == 1 ? 'info' : ''
						            },
						            style:{
						            },
						            on: {
						                'click': () =>{
						                    console.log();
						                }
						            }
						        },params.row.orderid == 1 ? '已置顶': '置顶'),
						        h(Buttons, {
						            props: {
						            	type: params.row.deleted == 0 ? 'success' : 'warning'
						            },
						            style:{
						            },
						            on: {
						                'click': () =>{
						                    console.log();
						                }
						            }
						        },params.row.deleted == 0 ? '上架': '下架')
						        // h('span', {style: {"margin": '0 10px',}}, '|'),
						        // h('span', {
						        //     style: {
						        //         cursor: "pointer",
						        //         color: '#3091f2'
						        //     },
						        //     on: {
						        //         click: () =>{
						        //             this.remove(params.index)
						        //         }
						        //     }
						        // }, '删除'),
						        // h('span', {style: {"margin": '0 10px',}}, '|'),
						        // h('span', {
    					     //        props: {
    					     //            type: isTop == 0 ? 'dashed': 'success',
    					     //            size: 'small'
    					     //        },
    					     //        style: {
						        //         cursor: "pointer",
						        //         color: '#3091f2'
						        //     },
    					     //        on: {
    					     //            click: () =>{
    					     //                this.setorder(params.index)
    					     //            }
    					     //        }
    					     //    },isTop == 0 ? '置顶': '已置顶')
					        ]);
					    }
					}
				],
				tableData: [{
					face:"a1",
					price: 12,
					sold: 1000
				},{
					face:"a2",
					price: 12,
					sold: 1000
				},{
					face:"a3",
					price: 12,
					sold: 1000
				},{
					face:"a4",
					price: 12,
					sold: 1000
				},]
			}
		},
		methods:{
			handleDelete:function(param){

			},
			saveEdit:function(param){
				this.tableData[param.index][param.column.key] = param.value;
			}
		}
	}
</script>


