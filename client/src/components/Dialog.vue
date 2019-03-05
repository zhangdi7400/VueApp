<template>
   <div class="dialog">
        <el-dialog :title="dialog.title"
        :visible.sync="dialog.show"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        >
        <div class="form">
            <el-form
            ref="form"
            :model="formData"
            :rules="form_rules"
            label-width="120px"
            style="margin:10px;width:auto"
            >
            <el-form-item label="Type">
                <el-select v-model="formData.type" placeholder="Choose a Type">
                  <el-option v-for="(type,index) in format_type_list" :key="index" :label="type" :value="type">
                  </el-option>  
                </el-select>
            </el-form-item>
            <el-form-item prop="description" label="Description">
                <el-input type="description" v-model="formData.description"></el-input>
            </el-form-item>
            <el-form-item prop='income'  label="Income:">
                <el-input type="income" v-model="formData.income"></el-input>
            </el-form-item>

            <el-form-item prop='expense' label="Expense:">
                <el-input type="expense" v-model="formData.expense"></el-input>
            </el-form-item>

            <el-form-item prop='cash' label="Cash:">
                <el-input type="cash" v-model="formData.cash"></el-input>
            </el-form-item>

                <el-form-item label="Remark:">
                <el-input type="textarea" v-model="formData.remark"></el-input>
            </el-form-item>

            <el-form-item  class="text_right">
                <el-button @click="dialog.show = false">Cancel</el-button>
                <el-button type="primary" @click='onSubmit("form")'>Submit</el-button>
            </el-form-item>

            </el-form>
        </div>
        </el-dialog>
   </div>
</template>

<script>
export default {
    name:"dialog",
    props:{
        dialog:Object,
        formData:Object
    },
    data(){
        return {
            
            format_type_list:[
                "Cash Advance",
                "Withdraw",
                "Deposit"
            ],
            form_rules:{
                description:[
                    {required:true,message:"Description can not be empty", trigger:"blur"}
                ],
                income:[
                    {required:true,message:"Income can not be empty", trigger:"blur"}
                ],
                expense:[
                    {required:true,message:"Expense can not be empty", trigger:"blur"}
                ],
                cash:[
                    {required:true,message:"Cash Amount can not be empty", trigger:"blur"}
                ]
            }
            
        }
    },
    methods:{
        onSubmit(form){
            this.$refs[form].validate(valid => {
                if(valid){
                    const url = this.dialog.option == 'add' ? "add" : `edit/${this.formData.id}`
                    
                    this.$axios.post(`/api/profiles/${url}`, this.formData)
                    .then(res=>{
                        this.$message({
                            message:"The data has been saved correctly",
                            type:"success"
                        });
                        this.dialog.show = false;
                        this.$emit('update');
                    }).catch(err=>{

                    });
                }
            });
        }
    }
};
</script>

<style scoped>
</style>
