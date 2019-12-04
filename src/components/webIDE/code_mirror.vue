<template>
    <div class="container">
        <codemirror
                    class="editor"
                    v-model="content"
                    :options="cmOptions"
                    ></codemirror>
        <div class="select">
            <el-select v-model="language" filterable placeholder="Choose your language" @change="changeLanguage()">
                <el-option
                           v-for="item in languageOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
    import { codemirror } from 'vue-codemirror'

    require("codemirror/mode/python/python.js");
    require("codemirror/mode/javascript/javascript.js");
    require("codemirror/mode/clike/clike.js");
    require("codemirror/mode/shell/shell.js");
    require("codemirror/theme/blackboard.css");
    require("codemirror/addon/hint/show-hint.css");
    require("codemirror/addon/hint/show-hint.js");
    require("codemirror/addon/hint/javascript-hint.js");
    require('codemirror/addon/fold/foldcode.js');
    require('codemirror/addon/fold/foldgutter.js');
    require('codemirror/addon/fold/brace-fold.js');
    require('codemirror/addon/fold/xml-fold.js');
    require('codemirror/addon/fold/indent-fold.js');
    require('codemirror/addon/fold/markdown-fold.js');
    require('codemirror/addon/fold/comment-fold.js');

    export default {
        name: 'webEditor',
        props: {
            contentFromParent: {
                type: String,
                default: {}
            }
        },
        watch: {
            content (newvalue, oldvalue) {
                this.$emit('update:contentFromParent', newvalue)
            },
            contentFromParent (newvalue) {
                this.content = newvalue;
            }
        },
        data() {
            return {
                content: this.contentFromParent,
                language: "python",
                cmOptions: {
                    value: "",
                    mode: "python",
                    theme: "blackboard",
                    lineNumbers: true,
                    smartIndent: true,
                    indentUnit: 4,
                    indentWithTabs: true,
                },
                languageOptions: [{
                        value: 'python',
                        label: 'python'
                    }, {
                        value: 'javascript',
                        label: 'javascript'
                    }, {
                        value: 'text/x-java',
                        label: 'java'
                    }, {
                        value: 'text/x-sh',
                        label: 'shell'
                    }
                ]
            }
        },

        methods: {

            changeLanguage() {
                this.cmOptions.mode = this.language;
            }
        },

        components: {
            codemirror
        }
    };
</script>

<style>
    .container {
        padding: 0px;
    }

    .editor {
        width: 100%;
        margin: 0 auto;
    }

    .select {
        text-align: right;
        margin-right: 10%;
        margin-top: 5px;
    }
</style>