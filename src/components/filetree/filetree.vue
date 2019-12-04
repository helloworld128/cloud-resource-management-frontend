<template>
    <div>
        <el-tree ref="tree" :data="filetree" @node-click="handleNodeClick">
            <span class="filetree_node" slot-scope="{node, data}">
                <span> {{node.data.label}} </span>
                    <span>
                        <el-button size="mini" type="danger" icon="el-icon-delete"
                                   @click="()=>remove(node, data)"
                                   circle plain
                                   style=""></el-button>
                    </span>
                </span>
        </el-tree>
    </div>

</template>

<script>
export default {
    name: 'filetree',
    props: {
        filetree: {
            type: Array,
            default: {}
        },
        filepath: {
            type: String,
            default: {}
        },
    },
    watch: {
            myfiletree (newvalue, oldvalue) {
                this.$emit('update:filetree', newvalue)
            },
            filetree (newvalue) {
                this.myfiletree = newvalue;
            },
            myfilepath (newvalue, oldvalue) {
                this.$emit('update:filepath', newvalue)
            },
            filepath (newvalue) {
                this.myfilepath = newvalue;
            },
        },
    data() {
        return {
            myfiletree: this.filetree,
            myfilepath: this.filepath,
        };
    },
    methods: {
        handleNodeClick(data, node) {
            var str = node.data.label;
            while(node.parent.data['label']) {
                str = node.parent.data['label'] + '/' + str;
                node = node.parent;
            }
            if(!data.hasOwnProperty("children")) {
                this.myfilepath = str;
            }
        },

        remove(node, data) {
            var str = node.data.label;
            while(node.parent.data['label']) {
                str = node.parent.data['label'] + '/' + str;
                node = node.parent;
            }
            this.$emit('removeFile', str);
        }
    }
}
</script>

<style scoped>
    .filetree_node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .filetree_node div{
        text-align: right;
        margin: 0;
        margin-top: 2px;
    }

</style>