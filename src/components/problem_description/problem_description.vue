<template>
    <div class = 'expand'>
        <el-container class='expand'>
            <el-aside class='bg-yellow' width='25%'>
                <el-card shadow="hover" class='expand'>
                    <div slot="header">
                        <h2 style="text-align:center"> 题目：{{title}} </h2>
                    </div>
                    <div v-show='hasproblem'>
                        <p style="text-align:center"> {{ description }} </p>
                        <!-- <p> url: {{ wsid }} </p>
                        <p> status: {{ status }} </p> -->
                    </div>
                    <div v-show="!hasproblem">
                        <h1 style="text-align:center"> Please choose a problem first. </h1>
                    </div>
                </el-card>
            </el-aside>
            <el-aside width="20%">
                <el-card shadow="hover" class='expand'>
                    <h2 style="text-align:center">文件树</h2>
                    <el-scrollbar style='height:100%;'>
                        <my-filetree :filetree.sync="filetree" :filepath.sync="filepath"
                                     @removeFile="removeFile"></my-filetree>
                    </el-scrollbar>
                    <span>
                        <el-popover placement="bottom"
                                    title="Create a new file"
                                    trigger="manual"
                                    v-model="new_file_visible">
                            <span style="display: contents;">filename:</span>
                            <span> <el-input type="text" v-model="new_filename"> </el-input> </span>
                            <span style="margin-top: 2px; text-align: right; margin: 0">
                                <el-button type="primary" size="mini" @click="newFile">Create</el-button>
                            </span>
                            <el-button size="mini" type="primary" icon="el-icon-plus"
                                       slot="reference"
                                       circle plain
                                       @click="handlePop"
                                       style="margin-left: 10%; margin-top: 5%;"></el-button>
                        </el-popover>
                    </span>
                </el-card>
            </el-aside>
            <el-container>
                <el-header height='10%'>
                    <el-row class="head_btn">
                        <el-button :type="statusColor" rou> {{ statusMessage }}</el-button>
                        <el-button class="upload_btn" @click.native="upload" type="primary" round rou>提交</el-button>
                        <el-button class="refresh_btn" @click.native="getFiletree" round rou>刷新</el-button>
                        <el-button class="save_btn" @click.native="save" round rou>保存</el-button>
                        <el-button class="back_btn" @click.native="back" round rou>返回</el-button>
                    </el-row>
                </el-header>
                <el-main height='70%'>
                    <el-tabs v-show="hasOpenFiles" v-model="openFilesValue" typeof="card" closable @tab-remove="closeFile">
                        <el-tab-pane
                                     v-for="(file, index) in openFiles"
                                     :key="file.filepath"
                                     :label="file.title"
                                     :name="file.filepath">
                            <my-webeditor :contentFromParent.sync="file.content"></my-webeditor>
                        </el-tab-pane>
                    </el-tabs>
                    <my-webeditor v-show="!hasOpenFiles" :contentFromParent.sync="textcontent"></my-webeditor>
                </el-main>
                <el-footer height='30%'>
                    <my-terminal :terminal="terminal"></my-terminal>
                </el-footer>
            </el-container>
        </el-container>
    </div>
</template>

<script>

import terminal from '../terminal/console'
import filetree from '../filetree/filetree'
import webEditor from '../webIDE/code_mirror'

export default {
    name: "problem_description",
    data() {
        return {
            token: sessionStorage.getItem("token"),
            isadmin: sessionStorage.getItem("isadmin"),
            title: sessionStorage.getItem("problem_title"),
            description: sessionStorage.getItem("problem_description"),
            taskid: sessionStorage.getItem("problem_id"),
            // wsid: sessionStorage.getItem("problem_wsid"),
            // status: sessionStorage.getItem("problem_status"),
            hasproblem: true,
            textcontent: "",
            terminal: {
                pid: 1,
                name: 'terminal',
                cols: 400,
                rows: 400
            },
            filetree: [],
            filepath: "",
            timer1: "",
            statusMessage: "",
            statusColor: "",
            new_filename: "",
            new_file_visible: false,
            new_filename: "",
            new_file_visible: false,
            openFilesValue: "",
            openFiles: [
                
            ],
            hasOpenFiles: false,
        };
    },
    watch: {
        //当filepath发生改变，读取相应文件内容并放到编辑器中
        filepath : function (newvalue, oldvalue) {
            let files = this.openFiles;
            var hasNewFile = false;
            files.forEach((file, index) => {
                if (file.filepath == newvalue) {
                    hasNewFile = true;
                }
            });
            if (!hasNewFile && newvalue != "") {
                var token = sessionStorage.getItem("token").toString();
                this.axios.get(this.baseUrl + '/editor/file', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.token,
                        id: this.taskid,
                        name: newvalue,
                    },
                }).then((res) => {
                    var newContent = res.data.content;
                    var newFilepath = newvalue;
                    var arr = newFilepath.split("/")
                    var newTitle = arr[arr.length - 1];
                    this.openFiles.push({
                        filepath: newFilepath,
                        title: newTitle,
                        content: newContent,
                    });
                    this.hasOpenFiles = true;
                    this.openFilesValue = newvalue;
                }).catch(function (err) {
                    console.log(err);
                })
            }
            else {
                this.openFilesValue = newvalue;
            }
        },
    },
    components: {
        'my-terminal': terminal,
        'my-filetree': filetree,
        'my-webeditor': webEditor,
    },
    created() {
        if ( sessionStorage.getItem("problem_title") ) {
            this.title = sessionStorage.getItem("problem_title");
            this.description = sessionStorage.getItem("problem_description");
            // this.wsid = sessionStorage.getItem("problem_wsid");
            this.hasproblem = true;
        } else {
            this.hasproblem = false;
        }
        this.getFiletree();
    },
    mounted() {
        this.timer1 = setInterval(this.getStatus, 1000);
    },
    beforeDestroy() {
        clearInterval(this.timer1);
    },
    methods: {
        getStatus() {
            //to get the status of the judging result
            this.axios.get(this.baseUrl + '/judge/result/' + this.taskid, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization : this.token,
                },
            })
            .then((res) => {
                this.statusMessage = res.data.data;
                switch (res.data.data) {
                    case "Accepted":
                        this.statusColor = 'success';
                        break;
                    case "    ":
                        this.statusColor = 'info';
                        break;
                    case "Judging":
                    case "judging":
                        this.statusColor = 'info';
                        break;
                    default:
                        this.statusColor = 'danger'
                        break;
                }
            })
            .catch((err) => {
                this.$message({
                    type : 'error',
                    message: '获取题目状态失败'
                })
            })
        },
        getFiletree() {
            this.axios.get(this.baseUrl + '/editor/filetree', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization : this.token,
                    id : this.taskid
                },
            })
            .then((res) => {
                this.filetree = res.data.filetree;
                return res.data;
            })
            .catch((err) => {
                this.$message({
                    type : 'error',
                    message: '获取文件树失败'
                })
                return [];
            })
        },
        back() {
            this.$router.push({path:"/problem"});
        },
        upload() {
            this.getFiletree();
            this.axios.get(this.baseUrl+'/judge/submit/'+this.taskid, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization : this.token,
                }
            })
            .then((res) => {
                this.$message({
                    type : 'success',
                    message: '评测完毕',
                })
                this.getStatus()
            })
            .catch((err) => {
                this.$message({
                    type : 'error',
                    message: '提交失败'
                })
            })
        },
        //当按下保存按钮，将编辑区中的信息上传到服务器
        save() {
            const that = this;
            let files = this.openFiles;
            var saveContent = "";
            files.forEach((file, index) => {
                if (file.filepath == this.openFilesValue) {
                    saveContent = file.content;
                }
            });
            this.axios.put(
                this.baseUrl+'/editor/file',
                {
                    name: this.openFilesValue,
                    content: saveContent,
                    id: this.taskid,
                },
                {
                    headers: { 
                        "Content-Type": "application/json",
                        Authorization: this.token,
                    }
                }
            ).
            then( function(res) {
                that.$message.success("保存成功");
            })
            .catch( function(err) {
                that.$message.error("保存失败");
            })
        },

        removeFile(filename) {
            let files = this.openFiles;
            var fileOpen = false;
            files.forEach((file, index) => {
                if (file.filepath == filename) {
                    fileOpen = true;
                }
            });
            if (fileOpen) {
                this.$message({
                    type: 'error',
                    duration: 1000,
                    message: '删除前请先保存并关闭文件',
                });
                return;
            }
            this.axios.delete(
                this.baseUrl + '/editor/file',
                {
                    headers: {
                        Authorization: this.token,
                    },
                    data: {
                        name: filename,
                        id: this.taskid,
                    }
                }
            ).then((res) => {
                this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
            }).catch((err) => {
                this.$message.error("删除失败：" + err.response.status.toString());
            })
            setTimeout(this.getFiletree(), 1000);
        },

        newFile() {
            if (this.new_filename == "") {
                this.$message.error('Please enter a name for your new file!');
                return;
            }
            var filename = this.new_filename;
            this.axios.post(
                this.baseUrl + '/editor/file',
                {
                    name: filename,
                    id: this.taskid,
                },
                {
                    headers: {
                        Authorization: this.token,
                    }
                }
            ).then((res) => {
                this.$message({
                            type: 'success',
                            message: '新建成功'
                        })
            }).catch((err) => {
                this.$message.error("新建失败：" + err.response.status.toString());
            })
            setTimeout(this.getFiletree(), 1000);
            this.new_file_visible = false;
            this.new_filename = "";
        },

        handlePop() {
            this.new_filename = "";
            this.new_file_visible = !this.new_file_visible;
        },

        closeFile(targetName) {
            let files = this.openFiles;
            let activeName = this.openFilesValue;
            if (activeName == targetName) {
                files.forEach((file, index) => {
                    if (file.filepath == targetName) {
                        let nextTab = files[index + 1] || files[index - 1];
                        if (nextTab) {
                            activeName = nextTab.filepath;
                        }
                    }
                });
            }
            this.openFilesValue = activeName;
            this.filepath = activeName;
            this.openFiles = files.filter(file => file.filepath != targetName);
            if (this.openFiles.length == 0) {
                this.hasOpenFiles = false;
                this.filepath = "";
            }
        }
    },
}
</script>
<style scoped>

    .head_btn{
        margin-top: 1%;
        margin-bottom: 1%;
        text-align: right;
    }

    .expand {
        padding: 0px;
        margin: 0px;
        height: 100%;
        width: 100%;
    }

    .el-card {
        padding: 0px;
        margin: 0px;
        height: 98%;
        width: 98%;
    }
    .bg-yellow {
        background: #F7EED6;
    }

    .el-header {
        background-color: #B3C0D1;
        color: #333;
    }

    .el-footer {
        background-color: #B3C0D1;
        color: #333;
    }

    .el-aside {
        display: block;
        position: relative;
        overflow-y: scroll;
        background-color: #D3DCE6;
        color: #333;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
    }

</style>
