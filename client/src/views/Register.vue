<template>
  <div class="register">
    <section class="form_container">
        <div class="manage_tip">
            <span class="title">Backend Management System</span>
            <el-form :model="registerUser" :rules="rules" ref="registerForm" label-width="150px" class="registerForm">
                <el-form-item label="UserName" prop="name">
                    <el-input v-model="registerUser.name" placeholder="Please enter the username here" class="input"></el-input>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                    <el-input v-model="registerUser.email" placeholder="Please enter the email address here" class="input"></el-input>
                </el-form-item>
                <el-form-item label="Password" prop="password">
                    <el-input type = "password" v-model="registerUser.password" placeholder="Please enter the password here" class="input"></el-input>
                </el-form-item>
                <el-form-item label="Re-enter Password" prop="password2">
                    <el-input type = "password" v-model="registerUser.password2" placeholder="Please re-enter the username here" class="input"></el-input>
                </el-form-item>
                <el-form-item label="Identity">
                    <el-select v-model="registerUser.identity" placeholder="Please select your identity here" class="input">
                        <el-option label="Administrator" value="administrator"></el-option>
                        <el-option label="Employee" value="employee"></el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item>                  
                    <el-button type="primary" class="submit_btn" @click="submitForm('registerForm')">Register</el-button>
                </el-form-item>
            </el-form>

        </div>
    </section>
  </div>
</template>

<script>
export default {
    name:"register",
    components:{},
    data(){
        var validatePass2 = (rule, value, callback) => {
            if (value !== this.registerUser.password) {
                callback(new Error('Two inputs don\'t match!'));
            } else {
                callback();
            }
        };
        return {

            registerUser:{
                name:"",
                email:"",
                password:"",
                password2:"",
                identity:""
            },

            rules:{
                name: [
                    { required:true, message:"User name can not be empty", trigger: 'blur' },
                    { min:2, max:30, message:"User name length can be less than 2 or greater than 30",trigger: 'blur' }
                ],
                email: [
                    { type: "email", required:true, message:"Email address format is incorrect",trigger: 'blur' }
                ],
                password: [
                    {  required:true, message:"password can not be empty",trigger: 'blur' },
                    { min:6, max:30, message:"Password length can be less than 2 or greater than 30",trigger: 'blur' }
                ],
                password2: [
                    { required:true, message:"Confirm password can not be empty",trigger: 'blur' },
                    { min:6, max:30, message:"Password length can be less than 2 or greater than 30",trigger: 'blur' },
                    { validator: validatePass2, trigger: 'blur' }
                ],
            }
        }
    },

    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post('api/users/register',this.registerUser)
            .then(function (response) {
                this.$message({
                    message:"Register successfully",
                    type:'success'
                });
            });
            this.$router.push('/login');
          }
        });
      }
    }
  
};
</script>

<style scoped>
    .register {
    position: relative;
    width: 100%;
    height: 100%;
    background: url(../assets/bg.jpg) no-repeat center center;
    background-size: 100% 100%;
    }
    .form_container {
    width: 550px;
    height: 220px;
    position: absolute;
    top: 10%;
    left: 34%;
    padding: 25px;
    border-radius: 5px;
    text-align: center;
    }
    .form_container .manage_tip .title {
    font-family: "Microsoft YaHei";
    font-weight: bold;
    font-size: 26px;
    color: #fff;
    overflow: hidden;
    white-space: nowrap;
    }
    .registerForm {
    margin-top: 20px;
    background-color: #fff;
    padding: 20px 40px 20px 20px;
    border-radius: 5px;
    box-shadow: 0px 5px 10px #cccc;
    width:500px;
    }

    .submit_btn {
    width: 100%;
    } 
    
</style>
