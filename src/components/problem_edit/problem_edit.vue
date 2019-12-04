<template>
    <el-container class="edit_container">
        <el-header align="right">
            <el-button type="primary"
                       @click="submitEdit"
                       icon="el-icon-upload2">Submit</el-button>
            <el-button @click="backToHome"
                       icon="el-icon-back">Back</el-button>
        </el-header>

        <el-main>
            <div class="new_info">
                <span class="short_input">Title</span><span style="color:red">*</span>:
                <el-input @change="changeEdited"
                          class="short_input"
                          type="text"
                          placeholder="enter a title name"
                          v-model="edit_title"></el-input>
            </div>
            <div class="new_info">
                <span class="short_input">image</span><span style="color:red">*</span>:
                <el-select v-model="edit_image" placeholder="Select an image" filterable>
                    <el-option v-for="image in image_list"
                               :key="image"
                               :label="image"
                               :value="image">
                    </el-option>
                </el-select>
            </div>
            <el-row class="new_info">
                <span class="short_input">Description: </span>
                <el-input @change="changeEdited"
                          class="short_input"
                          type="textarea"
                          placeholder="enter description"
                          :autosize="{minRows: 2, maxRows: 4}"
                          v-model="edit_description"></el-input>
            </el-row>
            <el-row class="new_info">
                <span class="short_input">judge command</span><span style="color:red">*</span>:
                <el-input @change="changeEdited"
                          class="short_input"
                          type="textarea"
                          v-model="edit_judge"></el-input>
            </el-row>
            <el-row class="new_info">
                <div class="short_input_span">
                    <span class="short_input"> max execution time: </span>
                    <el-input @change="changeEdited"
                              class="short_input"
                              type="number"
                              min="1"
                              v-model="edit_time">
                        <template slot="append">
                            sec
                        </template>
                    </el-input>
                </div>
            </el-row>
            <el-row class="new_info">
                <div class="short_input_span">
                    <span class="short_input"> max memory use: </span>
                    <el-input @change="changeEdited"
                              class="short_input"
                              type="number"
                              min="1"
                              v-model="edit_memory">
                        <template slot="append">
                            MB
                        </template>
                    </el-input>
                </div>
            </el-row>
            <el-row class="new_info">
                <div class="short_input_span">
                    <span class="short_input"> min instance num: </span>
                    <el-input @change="changeEdited"
                              class="short_input"
                              type="number"
                              min="1"
                              v-model="edit_instance"></el-input>
                </div>
            </el-row>
            
            

            <br>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: 'problem_edit',
        data() {
            return {
                edit_id: parseInt(sessionStorage.getItem("edit_id")),
                edit_title: "",
                edit_description: "",
                edit_time: 1,
                edit_memory: 128,
                edit_instance: 1,
                edit_image: "",
                edit_judge: "",

                image_list: [],
                edited: false,
            }
        },

        created() {
            this.image_list = this.getImageList();

            this.edit_id = parseInt(sessionStorage.getItem("edit_id"));
            var idString = this.edit_id.toString();
            this.axios.get(this.baseUrl + '/task/admin/' + idString)
                .then((res) => {
                    this.edit_title = res.data.title;
                    this.edit_description = res.data.description;
                    this.edit_time = res.data.max_execution_time;
                    this.edit_memory = res.data.max_memory_use;
                    this.edit_instance = res.data.minimal_instance_num;
                    this.edit_image = res.data.image_name;
                    this.edit_judge = res.data.judge_command;
                    this.$message({
                        type: 'success',
                        duration: 1000,
                        message: "Get problem info succeeded",
                    })
                })
                .catch((err) => {
                    this.$message({
                        type: 'error',
                        message: "Get problem info failed: " + err.response.status.toString(),
                    })
                })
        },

        methods: {
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

            changeEdited() {
                this.edited = true;
            },

            submitEdit() {
                if (this.edit_title == "") {
                    this.$message.error("Please enter a title for the problem!");
                    return;
                }
                if (this.edit_image == "") {
                    this.$message.error("Please enter an image for the problem!");
                    return;
                }
                if (this.edit_judge == "") {
                    this.$message.error("Please enter a judge command for the problem!");
                    return;
                }

                var idString = this.edit_id.toString();
                this.axios.put(
                    this.baseUrl + '/task/' + idString,
                    {
                        description: this.edit_description,
                        judge_command: this.edit_judge,
                        title: this.edit_title,
                        image_name: this.edit_image,
                        max_memory_use: parseInt(this.edit_memory),
                        minimal_instance_num: parseInt(this.edit_instance),
                        max_execution_time: parseInt(this.edit_time),
                        //id: this.edit_id,
                    }
                )
                    .then((res) => {
                        this.submitSuccessBox();
                    })
            },

            submitSuccessBox() {
                this.$alert(
                    'Your revision have been successfully submitted.',
                    'Success',
                    {
                        confirmButtonText: 'Yes',
                        callback: action => {
                            this.$router.push({ path: '/problem' });
                        }
                    });
            },

            backToHome() {
                if (this.edited) {
                    this.$confirm(
                        'You have unsaved changes.' + '\n' + 'Confirm to leave?',
                        'Warning',
                        {
                            distinguishCancelAndClose: true,
                            confirmButtonText: 'Yes',
                            cancelButtonText: 'No',
                        }
                    ).then(() => {
                        this.$router.push({ path: '/problem' });
                    })
                        .catch(action => { });
                }
                else {
                    this.$router.push({ path: '/problem' });
                }
            }
        }
    }
</script>

<style>
.edit_container {
    padding: 2%;
    width: 80%;
    margin: 0 auto;
}

.header {
    position: fixed;
    right: 10%;
    z-index: 3;
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
    margin-top: 1%;
}

</style>