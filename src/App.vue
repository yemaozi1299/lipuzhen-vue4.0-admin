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
        height: 700px;
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
}
</style>