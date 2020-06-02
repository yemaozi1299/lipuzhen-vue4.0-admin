<template>
	<div class="tables-edit-outer">
	    <div v-if="!isEditting" class="tables-edit-con">
	        <span class="value-con">{{ value }}</span>
	        <Button v-if="editable" @click="startEdit" class="tables-edit-btn"  ghost style="padding: 2px 4px;" type="text">
	            <Icon type="md-create" />
	        </Button>
	    </div>
	    <div v-else class="tables-editting-con">
	        <Input :value="value" @input="handleInput" class="tables-edit-input"/>
	        <Button @click="saveEdit" style="padding: 6px 4px;color:#2d8cf0;box-shadow:none" type="text" ghost>
	            <Icon type="md-checkmark"></Icon>
	        </Button>
	        <Button @click="canceltEdit" style="padding: 6px 4px;color:#2d8cf0;box-shadow:none" type="text" ghost>
	            <Icon type="md-close"></Icon>
	        </Button>
	    </div>
	</div>
</template>

<script type="text/javascript">
	export default {
		name: 'TablesEdit',
		props: {
		  value: [String, Number],
		  edittingCellId: String,
		  params: Object,
		  editable: Boolean
		},
		data(){
			return{

			}
		},
		computed: {
		    isEditting() {
		        return this.edittingCellId === `editting-${ this.params.index }-${ this.params.column.key }`
		    }
		},
		methods: {
		    handleInput(val) {
		        this.$emit('input', val)
		    },
		    startEdit() {
		        this.$emit('on-start-edit', this.params)
		    },
		    saveEdit() {
		        this.$emit('on-save-edit', this.params)
		    },
		    canceltEdit() {
		        this.$emit('on-cancel-edit', this.params)
		    }
		}
	}

</script>

<style lang="stylus" rel="stylesheet/stylus">
	.tables-edit-outer{
	  height: 100%;
	  .tables-edit-con{
	    position: relative;
	    height: 100%;
	    .value-con{
	      vertical-align: middle;
	    }
	    .tables-edit-btn{
	    	color:#2d8cf0;
	    	margin-left: 10px;
	      	display: none;
	      	box-shadow:none
	    }
	  }
	  .tables-editting-con{
	    .tables-edit-input{
	      	width: calc(100% - 50px);
	      	input{
	      		border-radius: 0;
	      		outline: none;
	      		box-shadow:none
	      	}
	    }
	  }
	  
	}
	
</style>