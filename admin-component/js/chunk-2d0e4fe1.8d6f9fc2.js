(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0e4fe1"],{"931b":function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("Card",[a("p",{attrs:{slot:"title"},slot:"title"},[t._v("添加管理员")]),a("Form",{ref:"editAdmin",attrs:{model:t.editAdmin,rules:t.adminLine,"label-position":"right","label-width":150}},[a("FormItem",{attrs:{label:"管理名姓名：",prop:"realname"}},[a("Input",{attrs:{type:"text"},model:{value:t.editAdmin.realname,callback:function(e){t.$set(t.editAdmin,"realname",e)},expression:"editAdmin.realname"}})],1),a("FormItem",{attrs:{label:"手机：",prop:"mobile"}},[a("Input",{attrs:{type:"text"},model:{value:t.editAdmin.mobile,callback:function(e){t.$set(t.editAdmin,"mobile",e)},expression:"editAdmin.mobile"}})],1),a("FormItem",{attrs:{label:"密码：",prop:"password"}},[a("Input",{attrs:{type:"password"},model:{value:t.editAdmin.password,callback:function(e){t.$set(t.editAdmin,"password",e)},expression:"editAdmin.password"}})],1),a("FormItem",{attrs:{label:"确认密码：",prop:"isPassword"}},[a("Input",{attrs:{type:"password"},model:{value:t.editAdmin.isPassword,callback:function(e){t.$set(t.editAdmin,"isPassword",e)},expression:"editAdmin.isPassword"}})],1),a("FormItem",{attrs:{label:"管理员等级：",prop:"sort"}},[a("Select",{model:{value:t.editAdmin.sort,callback:function(e){t.$set(t.editAdmin,"sort",e)},expression:"editAdmin.sort"}},[a("Option",{attrs:{value:"0"}},[t._v("普通管理员")]),a("Option",{attrs:{value:"1"}},[t._v("高级管理员")])],1)],1),a("FormItem",{directives:[{name:"show",rawName:"v-show",value:0==t.editAdmin.sort,expression:"editAdmin.sort == 0"}],attrs:{label:"可管理的应用 （点击设置权限）："}},[a("Row",{attrs:{gutter:10}},t._l(t.applist,(function(e,i){return 1==e.status?a("Col",{staticStyle:{"padding-bottom":"10px"},attrs:{xs:12,lg:6}},[a("div",{on:{click:function(a){return t.editCompanyData(e,i)}}},[a("Card",[a("div",[t._v(t._s(e.name))]),e.p_code?a("div",[a("span",[t._v("可用功能：")]),t._l(e.p_code,(function(e){return a("span",[t._v(t._s(e.p_name)+"，")])}))],2):t._e()])],1)]):t._e()})),1)],1),a("Form-item",[a("Button",{attrs:{type:"primary",loading:t.loading},on:{click:function(e){return t.handleSubmit("editAdmin")}}},[t.loading?a("span",[t._v("Loading...")]):a("span",[t._v("提交")])]),a("Button",{staticStyle:{"margin-left":"8px"},on:{click:t.cancel}},[t._v("取消")])],1)],1),a("Modal",{attrs:{title:"添加权限管理应用"},on:{"on-ok":t.managerAdd,"on-cancel":function(t){}},model:{value:t.addCompanyData.isModal,callback:function(e){t.$set(t.addCompanyData,"isModal",e)},expression:"addCompanyData.isModal"}},[a("Form",{attrs:{"label-position":"left","label-width":100}},[a("FormItem",{attrs:{label:"功能选择："}},[a("CheckboxGroup",{model:{value:t.addCompanyData.p_code_arr,callback:function(e){t.$set(t.addCompanyData,"p_code_arr",e)},expression:"addCompanyData.p_code_arr"}},t._l(t.codeList,(function(e){return a("Checkbox",{staticStyle:{"margin-bottom":"10px"},attrs:{border:"",label:e.p_code}},[t._v(t._s(e.p_name))])})),1)],1)],1)],1)],1)},o=[],n=(a("422c"),a("1f90"),{data:function(){return{editAdmin:{searchPoptip:!1,id:"",total:0,page:1,realname:"",mobile:"",password:"",isPassword:"",loading:!0,body:[],sort:"0",userid:0},addCompanyData:{isModal:!1,p_code_arr:[],p_code:[],index:""},adminLine:{realname:[{required:!0,message:"必填",trigger:"blur"}],mobile:[{required:!0,message:"必填",trigger:"blur"}],password:[{required:!0,message:"必填",trigger:"blur"}],isPassword:[{required:!0,message:"必填",trigger:"blur"}]},codeList:[],applist:[],loading:!1,accreditArr:{}}},created:function(){this.fetchData()},methods:{fetchData:function(){this.editAdmin.userid=this.$route.query.userid,this.getAppList()},getAppList:function(t){var e=this,a=this,i={action:"wxapplistof",page:t||1,pageno:100,apptype:0,user:this.editAdmin.userid};a.$http.post("/api_admin.php",a.$qs.stringify(i)).then((function(t){console.log(t),e.applist=t.data.body||[]})).catch((function(t){e.$Notice.error({title:"错误提示",desc:t})}))},getPrivilege:function(t){var e=this;this.$http.request({method:"POST",url:"/api_admin.php?action=app_accredit_listof",params:{appid:t}}).then((function(t){e.codeList=t.data.body||[],console.log(t)})).catch((function(t){e.$Notice.error({title:"错误提示",desc:t})}))},handleSubmit:function(t){var e=this,a=this.editAdmin;this.$refs[t].validate((function(t){if(t){if(a.password!=a.isPassword)return e.editAdmin.loading=!1,e.$nextTick((function(){e.editAdmin.loading=!0})),e.$Message.warning("两次密码不一致，请重新输入");var i={realname:a.realname,mobile:a.mobile,password:a.password,sort:a.sort,user:a.userid,accreditArr:e.accreditArr};console.log(i),e.$http.post("/api_admin.php?action=manager_add",e.$qs.stringify(i)).then((function(t){e.$Message.info("添加成功"),e.$router.go(-1),console.log(t)})).catch((function(t){e.$Notice.error({title:"错误提示",desc:t})}))}else e.$Message.error("表单验证失败!")}))},editCompanyData:function(t,e){this.addCompanyData.isModal=!0,this.addCompanyData.p_code_arr=t.p_code_arr||[],this.addCompanyData.index=e,console.log(t),this.getPrivilege(t.id)},managerAdd:function(){var t=this.addCompanyData.p_code_arr,e=this.applist[this.addCompanyData.index],a=[];this.codeList.forEach((function(e,i){t.forEach((function(t,i){t==e.p_code&&a.push(e)}))})),this.applist[this.addCompanyData.index].p_code_arr=this.addCompanyData.p_code_arr,this.applist[this.addCompanyData.index].p_code=a,t.length>=1?this.accreditArr[e.id]=t:delete this.accreditArr[e.id]},cancel:function(){this.$router.go(-1)}}}),r=n,s=a("c701"),d=Object(s["a"])(r,i,o,!1,null,"25cbe4d6",null);e["default"]=d.exports}}]);