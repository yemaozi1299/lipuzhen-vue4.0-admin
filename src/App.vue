<template>
    <div id="app">
		<router-view />
	</div>
</template>

<script>
export default {
    name: 'app'
}
</script>

<style lang="stylus">
html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
}
body, h1, h2, h3, h4, h5, h6, dl, dt, dd, ol, ul, li, p, form, legend, button, select, input, textarea, table {
    margin: 0;
    padding: 0;
}
body, input, button, textarea, select {
    font-family: 'Hiragino Sans GB', 'Tahoma', 'microsoft yahei ui', 'microsoft yahei', 'simsun';
}
label, button, input[type='button'], input[type='submit'], input[type='reset'] {
    -webkit-user-select: none;
}
button {
    border: 0;
    cursor: pointer;
}
li {
    list-style: none;
}
em, i, b {
    font-style: normal;
    font-weight: normal;
}
a {
    text-decoration: none;
    color: #0071ce;
}
img {
    border: 0;
}
.mg-l-10 {
    margin-left: 10px;
}
.mg-l-20 {
    margin-left: 20px;
}
.mg-r-10 {
    margin-right: 10px;
}
.mg-r-20 {
    margin-right: 20px;
}
#app {
    width: 100%;
    height: 100%;
}
body {
    width: 100%;
    height: 100%;
    .layout-wrapper {
        background: #FFF;
    }
    .header-wrapper {
        padding: 0px 0 20px 0px;
        background: #FFF;
        height: auto;
        overflow: hidden;
        line-height: 0px;
        .menu-box {
            margin-bottom: 20px;
            height: 40px;
            line-height: 20px;
        }
    }
    .sider-wrapper {
        width: 150px;
        border: 1px solid #d9d9d9;
        margin: 0 15px 0 0px;
        min-height: 600px;
        background: #FFF;
        .category {
            background: #F6F7FB;
            line-height: 42px;
            padding-left: 24px;
        }
        .menu-item {
            background: #FFF;
        }
        .add-class-container {
            text-align: center;
            padding: 10px 0;
            border-top: 1px solid #e4e2e2;
            .class-btn {
                color: #2b85e4;
                background-color: #fff;
                border-color: #2b85e4;
            }
        }
        .add-class-dialog {
            border-top: 1px solid #e4e2e2;
        }
    }
    .table-footer {
        padding: 0 0 0 17px;
        line-height: 39px;
        background: rgba(218, 237, 255, 0.35);
        margin-top: 10px;
        .table-checkbox {
            font-size: 12px;
            padding-right: 25px;
        }
    }
    .sider-menu-template {
        .ant-radio-button-wrapper:hover {
            .ant-icon {
                display: block;
            }
        }
        .ant-radio-button-wrapper {
            padding: 14px 30px;
            font-size: 12px;
            span {
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .ant-icon {
                display: none;
                position: absolute;
                top: 0;
                width: 30px;
                font-size: 16px;
                line-height: 47px;
                text-align: center;
            }
            &.ivu-menu-item-selected {
                .ant-icon {
                    display: block;
                }
            }
        }
    }
    .notes {
        margin: 0 10px;
        font-size: 13px;
        color: #666;
    }
    .app-upload-list {
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        overflow: hidden;
        position: relative;
        img {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            max-width: 100%;
            max-height: 100%;
        }
    }
}
</style>

