<template>
	<div>
		<div class="card_company">
			<div class="container">
				<!-- <div class="star-inserted">
					<div class="card-box">
						
					</div>
					<div class="bottom"></div>
					<div class="mark">
						
					</div>
				</div>
				<div class="add-part">
					<Icon type="md-add" />
					<div class="text">新增销售人员</div>
				</div> -->
				<Table :columns="columns" :data="data"></Table>
                <div class="page-wrap" v-if="activeTotal > 10">
                    <Page :total="activeTotal" :current="activePage" :page-size="10" show-total show-elevator @on-change="skippage" ></Page>
                </div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default {
		data(){
			return{
				activeTotal: 10,
				activePage: 1,
				columns:[
					{
                        title: '头像',
                        align: 'center',
                        render:(h, params) => {
                            return h('img',{
                                attrs:{
                                    src: "/static/images/applogo.png"
                                },
                                style: {
                                    margin: '10px',
                                    width:'50px',
                                    height:'50px'
                                }
                            });
                        }

                    },
                    {
						title: '姓名',
						align: 'left',
                        render:(h, params) => {
                            return h('span', {}, params.row.nick_name);
                        }

					},
					{
						title: '职务',
						align: 'left',
						key: 'title'
					},
					{
						title: '所属部门',
						align: 'left',
						key: 'company'
					},
					{
						title: '电话',
						align: 'left',
						key: 'card_phone'
					},
					{
						title: 'AI雷达',
						align: 'center',
						width: 100,
						render: (h, params) => {
                            return h('div', [
                                h('i-switch', {

                                    on: {
                                        click: () => {

                                        }
                                    }
                                })
                            ]);
                        }
					},
					{
						title: 'BOSS雷达',
						align: 'center',
						width: 100,
						render: (h, params) => {
                            return h('div', [
                                h('i-switch', {
                                    on: {
                                        click: () => {

                                        }
                                    }
                                })
                            ]);
                        }
					},
					{
						title: '操作',
						align: 'center',
						width: 140,
						render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    style: {
                                        cursor: "pointer",
                                        "margin-right": '5px',
                                        color: '#3091f2'
                                    },
                                    on: {
                                        click: () => {

                                        }
                                    }
                                },'编辑名片'),
                                h('span', {
                                    style: {
                                        cursor: "pointer",
                                        color: '#3091f2'
                                    },
                                    on: {
                                        click: () => {

                                        }
                                    }
                                },'取消身份')
                            ]);
                        }
					}
				],
				data:[
					{
                		"user_id": "11975",
                		"is_admin_user": "1",
                		"num": "0",
                		"saved_num": "4",
                		"title": "销售经理",
                		"company": "销售部门",
                		"phone": "13144815885",
                		"card_phone": "13144815885",
                		"nick_name": "李白",
                		"card_name": "李白",
                		"card_id": "1032",
                		"is_official": "1",
                		"is_admin": "1",
                		"is_default": "1",
                		"is_deleted": "0",
                		"user_is_deleted": "0",
                		"add_time": "2019-01-18 10:44:00",
                		"is_allow_show_book": "1",
                		"audit_status": "2",
                		"audit_content": null
                	}, {
                		"user_id": "11976",
                		"is_admin_user": "1",
                		"num": "0",
                		"title": "销售总监",
                		"company": "销售部门",
                		"saved_num": "1",
                		"phone": "13144815884",
                		"card_phone": "13144815884",
                		"nick_name": "张三",
                		"card_name": "张三",
                		"card_id": "1033",
                		"is_official": "0",
                		"is_admin": "1",
                		"is_default": "0",
                		"is_deleted": "0",
                		"user_is_deleted": "0",
                		"add_time": "2019-01-18 10:46:04",
                		"is_allow_show_book": "1",
                		"audit_status": "2",
                		"audit_content": null
                	},
				]
			}
		},
		methods:{

		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	.card_company{
		width: 100%;
		box-sizing border-box;
		padding: 18px 0 0 20px;
	}
</style>