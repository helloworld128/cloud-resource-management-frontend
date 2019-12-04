<template>
    <div class="container">
        <div align="right">
            <span>Welcome, </span><span style="font-weight: bold;">{{this.username}}</span>
            <el-divider direction="vertical"></el-divider>
            <span v-show="!isadmin">User</span>
            <span v-show="isadmin">Administrator</span>
        </div>
        <div align="right" style="margin-top: 2%;">
            <el-button v-show="isadmin" type="primary" @click="handleOpen"> New Problem </el-button>
            <el-button @click="logout"> Logout </el-button>
        </div>

        <el-dialog title="Create a new problem"
                   :visible.sync="new_problem.visible"
                   width="70%"
                   :before-close="handleClose">
            <div class="new_info">
                <span class="short_input">Title</span><span style="color:red">*</span>:  
                <el-input id="new_title"
                          class="short_input"
                          type="text"
                          placeholder="enter a title name"
                          v-model="new_problem.title"></el-input>
            </div>
            <div class="new_info">
                <span class="short_input">image</span><span style="color:red">*</span>:
                <el-select v-model="new_problem.image_name" placeholder="Select an image" filterable>
                    <el-option
                               v-for="image in image_list"
                               :key="image"
                               :label="image"
                               :value="image">
                    </el-option>
                </el-select>
            </div>
            <br>
            <el-row class="new_info">
                <el-col :span="12" class="short_input_span">
                    <span class="short_input">Description: </span>
                    <el-input id="new_description"
                              class="short_input"
                              type="textarea"
                              placeholder="enter description"
                              :autosize="{minRows: 2, maxRows: 4}"
                              v-model="new_problem.description"></el-input>
                </el-col>
                <el-col :span="12" class="short_input_span">
                    <span class="short_input">judge command</span><span style="color:red">*</span>:
                    <el-input id="new_command"
                              class="short_input"
                              type="textarea"
                              v-model="new_problem.judge_command"></el-input>
                </el-col>
            </el-row>
            <br>
            <el-row class="new_info">
                <el-col :span="8" class="short_input_span">
                    <span class="short_input"> max execution time: </span>
                    <el-input id="new_time"
                              class="number_input"
                              type="number"
                              min="1"
                              v-model="new_problem.max_time">
                        <template slot="append">
                            sec
                        </template>
                    </el-input>

                </el-col>
                <el-col :span="8" class="short_input_span">
                    <span class="short_input"> max memory use: </span>
                    <el-input id="new_memory"
                              class="number_input"
                              type="number"
                              min="1"
                              v-model="new_problem.max_memory"></el-input>
                </el-col>
                <el-col :span="8" class="short_input_span">
                    <span class="short_input"> min instance num: </span>
                    <el-input id="new_instance_num"
                              class="number_input"
                              type="number"
                              min="1"
                              v-model="new_problem.min_instance"></el-input>
                </el-col>
            </el-row>
            <br>

            <input type="file" style="display: none;" 
                   accept="application/zip,application/x-zip,application/x-zip-compressed" 
                   @change="getFile_initial($event)" id="fileInput1" />
            <input type="file" style="display: none;"
                   accept="application/zip,application/x-zip,application/x-zip-compressed" 
                   @change="getFile_judge($event)" id="fileInput2" />

            <el-row class="new_info">
                <span style="margin-left: 2%;"> Upload necessary files: </span>
                <br>
                <el-col :span="12" class="short_input_span">
                    <el-button type="primary" plain onclick="document.getElementById('fileInput1').click();">
                        initial files
                        <i class="el-icon-upload"></i>
                    </el-button>
                    <span> {{this.upload_initial_file_name}} </span>
                </el-col>
                <el-col :span="12" class="short_input_span">
                    <el-button type="primary" plain onclick="document.getElementById('fileInput2').click();">
                        judge script
                        <i class="el-icon-upload"></i>
                    </el-button>
                    <span> {{this.upload_judge_script_name}} </span>
                </el-col>
            </el-row>

            <div slot="footer">
                <el-button type="primary" disabled.sync="this.new_problem.submitDisabled" @click="createNewProblem"> Submit </el-button>
                <el-button @click="handleClose"> Close </el-button>
            </div>
        </el-dialog>

        <div class="homepage">
            <h4 v-show="problems.length>0">
                Open Problems ({{problems.length}})
            </h4>
            <div>
                <el-table :data="problems"
                            v-loading="loading"
                            element-loading-text="Loading..."
                            element-loading-spinner="el-icon-loading"
                            element-loading-background="rgba(0, 0, 0, 0.8)"
                            stripe
                            style="width: 100%;">
                    <el-table-column prop="id"
                                     label="ID"
                                     width="100">
                    </el-table-column>
                    <el-table-column prop="title"
                                     label="Title">
                        <template slot-scope="scope">
                            <p style="cursor:pointer;" @click="viewDetail(scope.row)" title="show Detail"> {{scope.row.title}} </p>
                        </template>
                    </el-table-column>
                    <el-table-column width="100">
                        <template slot-scope="scope">
                            <el-button
                                       v-show="isadmin"
                                       size="small"
                                       type="info"
                                       icon="el-icon-edit"
                                       @click="openEdit(scope.row.id)">Edit</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>

</template>

<script>
	export default {
		name: 'problem',
		data() {
            return {
                loading: false,
                token: null,
                username: sessionStorage.getItem("email"),
                isadmin: this.getAdmin(),

                problems: [{
                    id: Number,
                    title: String,
                    description: String
                }],
                problem_num: 0,

                image_list: [],
                new_problem: {
                    title: "",
                    description: "",
                    max_time: 1,
                    max_memory: 128,
                    min_instance: 1,
                    image_name: "",
                    judge_command: "",
                    visible: false,
                    submitDisabled: false
                },

                upload_initial_file: null,
                upload_initial_file_name: "",
                upload_judge_script: null,
                upload_judge_script_name: "",
                upload_files: [],
                upload_data: {
                    id: 0
                }
			};
        },

        created() {
            this.getProblems();
        },
		
		methods: {
            getAdmin() {
                var str = sessionStorage.getItem("isadmin");
                if (str == "true") {
                    return true;
                }
                else {
                    return false;
                }
            },

            handleOpen() {
                this.upload_initial_file = null;
                this.upload_initial_file_name = "";
                this.upload_judge_script = null;
                this.upload_judge_script_name = "";
                this.upload_files = [];
                this.new_problem.visible = true;
                this.image_list = this.getImageList();
            },

            handleClose(done) {
                this.$confirm('Confirm to close?')
                    .then(_ => {
                        this.clearNewProblem();
                        done();
                    })
                    .catch(_ => { });
            },

            logout() {
                sessionStorage.setItem("email", '');
                sessionStorage.setItem("token", '');
                sessionStorage.setItem("problem_title", '');
                sessionStorage.setItem("problem_description", '');
                sessionStorage.setItem("problem_wsid", '');
                sessionStorage.setItem("problem_status", '');
                sessionStorage.setItem("isadmin", false);
                this.$router.push({ path: '/' });
                this.$message({
                    type: 'success',
                    message: 'You have logged out.'
                });
            },

            clearNewProblem() {
                this.new_problem = {
                    title: "",
                    description: "",
                    max_time: 1,
                    max_memory: 128,
                    min_instance: 1,
                    image_name: "",
                    judge_command: "",
                    visible: false,
                    submitDisabled: false
                };
            },

            getImageList() {
                this.axios.get(this.baseUrl + '/task/images')
                    .then((res) => {
                        this.image_list = res.data;
                    })
                    .catch((err) => {
                        this.$message({
                        type: 'error',
                        message: 'Get image list failed: ' + err.response.status.toString()
                    })
                    })
            },

            getFile_initial(event) {
                var file = event.target.files;
                this.upload_initial_file = file[0];
                this.upload_initial_file_name = file[0].name;
            },

            getFile_judge(event) {
                var file = event.target.files;
                this.upload_judge_script = file[0];
                this.upload_judge_script_name = file[0].name;
            },

            openEdit(problem_id) {
                sessionStorage.setItem("edit_id", problem_id);
                this.$router.push({ path: '/problem_edit' });
            },

            submitFile() {
                if (this.upload_initial_file == null) {
                    this.$message({
                        type: 'error',
                        message: 'Please upload your initial files'
                    })
                    return false;
                }
                if (this.upload_judge_script == null) {
                    this.$message({
                        type: 'error',
                        message: 'Please upload your judge script'
                    })
                    return false;
                }

                this.upload_files.push(this.upload_initial_file);
                this.upload_files.push(this.upload_judge_script);

                let formData = new FormData();
                for (var i = 0; i < this.upload_files.length; i++) {
                    formData.append('fileUpload', this.upload_files[i]);
                }
                formData.append('targetId', this.upload_data.id);
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                };
                var idString = this.upload_data.id.toString();
                var appendUrl = '/task/upload/' + idString;

                const instance = this.axios.create({
                    withCredentials: true
                })

                instance.post(this.baseUrl + appendUrl,
                    formData,
                    config)
                    .then((res) => {
                        if (res.data.info == "success") {
                            this.$message({
                                type: 'success',
                                message: 'Upload success'
                            });
                            return true;
                        }
                    })
                    .catch((err) => {
                        this.$message({
                            type: 'error',
                            message: 'Upload failed: ' + err.response.status.toString()
                        })
                        return false;
                    })
            },

            submitUpload() {
                this.submitFile();
            },

            viewDetail(problem) {
                this.loading = true;
                var token = sessionStorage.getItem("token").toString();
                var idString = problem.id.toString();
                var queryUrl = '/task/' + idString;
                this.axios.get(this.baseUrl + queryUrl, {
                        params:{id: problem.id}, 
                        headers: {
                            "Content-Type": "application/json",
                            Authorization : token,
                        },
                    })
                    .then((res) => {
                        sessionStorage.setItem("problem_id", idString);
                        sessionStorage.setItem("problem_title", problem.title);
                        sessionStorage.setItem("problem_description", res.data.description);
                        sessionStorage.setItem("problem_wsid", res.data.socketid);
                        sessionStorage.setItem("problem_status", res.data.status);
                        this.$router.push({ path: '/problem_description' });
                        this.loading = false;
                    })
                    .catch((err) => {
                        this.$message.error("check detail failed: " + err.response.status.toString());
                        this.loading = false;
                    })
            },

            getProblems() {
                this.axios.get(this.baseUrl + '/task/')
                    .then((res) => {
                        this.problems = res.data;
                        this.problem_num = this.problems.length;
                        return res.data;
                    })
                    .catch((err) => {
                        this.$message({
                            type: 'error',
                            message: 'Get problems failed, please try again.'
                        })
                        return [];
                    })
            },

            createNewProblem() {
                if (this.new_problem.title == "") {
                    this.$message.error("Please enter a title for the new problem!");
                    return;
                }
                if (this.new_problem.image_name == "") {
                    this.$message.error("Please enter an image for the new problem!");
                    return;
                }
                if (this.new_problem.judge_command == "") {
                    this.$message.error("Please enter a judge command for the new problem!");
                    return;
                }
                if (this.new_problem.description == "") {
                    this.new_problem.description = "";
                }
                if (this.new_problem.max_time.toString() == "") {
                    this.new_problem.max_time = 1;
                }
                if (this.new_problem.max_memory.toString() == "") {
                    this.new_problem.max_memory = 128;
                }
                if (this.new_problem.min_instance.toString() == "") {
                    this.new_problem.min_instance = 1;
                }

                this.axios.post(
                    this.baseUrl + '/task/',
                    {
                        title: this.new_problem.title,
                        description: this.new_problem.description,
                        max_execution_time: parseInt(this.new_problem.max_time),
                        max_memory_use: parseInt(this.new_problem.max_memory),
                        image_name: this.new_problem.image_name,
                        minimal_instance_num: parseInt(this.new_problem.min_instance),
                        judge_command: this.new_problem.judge_command
                    },
                    {
                        headers: { "Content-Type": "application/json" }
                    }
                )
                    .then((res) => {                       
                        this.upload_data.id = this.problems.length + 1;
                        this.submitUpload();
                        this.$message({
                            type: 'success',
                            message: "succesfully created"
                        })
                })
                    .catch((err) => {
                        this.$message({
                            type: 'error',
                            message: err.response.status.toString()
                        })
                        return;
                    })
                this.getProblems();
                this.clearNewProblem();
            }
        },

        computed: {

        },

        components: {
            
        }
	};

</script>


<style>
    .container {
        padding: 2%;
        width: 80%;
        margin: 0 auto;
    }

.number {
  width: 10%;
  text-align: center;
  float: right;
  font-weight: bold;
}

.new_info {
    margin-bottom: 3%;
}

.short_input_span {
    display: inline-block;
    width: 30%;
    margin-left: 1%;
}

.short_input {  

    margin-left: 1%;
}

.number_input {

}


</style>