<template>
    <Card>
        <p slot="title">简历</p>
        <Button @click="$router.go(-1)">返回</Button>
        <table width="600" align="center">
            <tbody>
                <tr>
                    <td align="right">发表时间:{{ data.dayandtime }}</td>
                </tr>
            </tbody>
        </table>
        <table
            width="600"
            border="0"
            cellpadding="4"
            align="center"
            cellspacing="1"
            bgcolor="#999999"
        >
            <tbody>
                <tr>
                    <td width="20%" bgcolor="#EAEAEA">姓名:</td>
                    <td width="30%" bgcolor="#FFFFFF">{{ data.name }}</td>
                    <td width="20%" bgcolor="#EAEAEA">性别:</td>
                    <td width="30%" bgcolor="#FFFFFF">
                        {{ data.sex == 0 ? "女士" : "男士" }}
                    </td>
                </tr>
                <tr>
                    <td width="20%" bgcolor="#EAEAEA">年龄:</td>
                    <td width="30%" bgcolor="#FFFFFF">123</td>
                    <td width="20%" bgcolor="#EAEAEA">婚姻状况:</td>
                    <td width="30%" bgcolor="#FFFFFF">
                        {{ data.marriage == 0 ? "未婚" : "已婚" }}
                    </td>
                </tr>
                <tr>
                    <td width="20%" bgcolor="#EAEAEA">户籍:</td>
                    <td width="30%" bgcolor="#FFFFFF">{{ data.huji }}</td>
                    <td width="20%" bgcolor="#EAEAEA">最高学历:</td>
                    <td width="30%" bgcolor="#FFFFFF">{{ data.degree }}</td>
                </tr>
                <tr>
                    <td width="20%" bgcolor="#EAEAEA">毕业学校:</td>
                    <td width="30%" bgcolor="#FFFFFF">{{ data.school }}</td>
                    <td width="20%" bgcolor="#EAEAEA">所学专业:</td>
                    <td width="30%" bgcolor="#FFFFFF">
                        {{ data.speciality }}
                    </td>
                </tr>
                <tr>
                    <td width="20%" bgcolor="#EAEAEA">电话:</td>
                    <td width="30%" bgcolor="#FFFFFF">{{ data.phone }}</td>
                    <td width="20%" bgcolor="#EAEAEA">地址:</td>
                    <td width="30%" bgcolor="#FFFFFF">
                        {{ data.address }}
                    </td>
                </tr>
                <tr>
                    <td width="20%" bgcolor="#EAEAEA">电子邮件:</td>
                    <td width="30%" bgcolor="#FFFFFF">
                        <a :href="'mailto:' + data.email + ''">{{
                            data.email
                        }}</a>
                    </td>
                    <td width="20%" bgcolor="#EAEAEA">期望月薪:</td>
                    <td width="30%" bgcolor="#FFFFFF">{{ data.m_pay }}</td>
                </tr>
                <tr>
                    <td width="20%" bgcolor="#EAEAEA">自我评价:</td>
                    <td colspan="3" bgcolor="#FFFFFF">
                        {{ data.readme }}
                    </td>
                </tr>
                <tr>
                    <td width="20%" bgcolor="#EAEAEA">教育经历:</td>
                    <td colspan="3" bgcolor="#FFFFFF">
                        {{ data.study }}
                    </td>
                </tr>
                <tr>
                    <td width="20%" bgcolor="#EAEAEA">工作经历:</td>
                    <td colspan="3" bgcolor="#FFFFFF">
                        {{ data.work }}
                    </td>
                </tr>
            </tbody>
        </table>
    </Card>
</template>

<script>
export default {
    data () {
        return {
            data: {
                "id": "1",
                "name": "a先生",
                "sex": "0",
                "age": "0",
                "marriage": "0",
                "huji": "",
                "degree": "",
                "school": "",
                "speciality": "",
                "phone": "",
                "address": "",
                "email": "",
                "m_pay": "",
                "readme": "",
                "study": "",
                "work": "",
                "aboutid": "1",
                "dayandtime": "2020-06-22 00:00:00",
                "user": "1",
                "groupid": "0",
                "ip": "",
                "appid": "1"
            }
        }
    },
    created () {
        this.fetchData();
    },
    methods: {
        fetchData () {
            this.id = this.$route.params.resumeid ? parseInt(this.$route.params.resumeid) : 0;
            this.dataInitial()
        },
        dataInitial () {
            this.$http.request({
                method: "POST",
                url: "/block/api_edit.php?action=job_getResume",
                params: {
                    id: this.id,
                }
            }).then((res) => {
                var item = res.data.body;
                this.data = {
                    "id": item.id,
                    "name": item.name,
                    "sex": item.sex,
                    "age": item.age,
                    "marriage": item.marriage,
                    "huji": item.huji,
                    "degree": item.degree,
                    "school": item.school,
                    "speciality": item.speciality,
                    "phone": item.phone,
                    "address": item.address,
                    "email": item.email,
                    "m_pay": item.m_pay,
                    "readme": item.readme,
                    "study": item.study,
                    "work": item.work,
                    "aboutid": item.aboutid,
                    "dayandtime": item.dayandtime,
                    "user": item.user,
                    "groupid": item.groupid,
                    "ip": item.ip,
                    "appid": item.appid
                }
                console.log(res);
            })
        },
    }
}
</script>

<style>
</style>