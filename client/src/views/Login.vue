<template>
  <div class="login">
    <section class="form_container">
        <div class="manage_tip">
            <span class="title">Backend Management System</span>
            <el-form :model="loginUser" :rules="rules" ref="loginForm" label-width="150px" class="loginForm">
                <el-form-item label="Email" prop="email">
                    <el-input v-model="loginUser.email" placeholder="Please enter the email address here" class="input"></el-input>
                </el-form-item>
                <el-form-item label="Password" prop="password">
                    <el-input type = "password" v-model="loginUser.password" placeholder="Please enter the password here" class="input"></el-input>
                </el-form-item>
                
                <el-form-item>                  
                    <el-button type="primary" class="submit_btn" @click="submitForm('loginForm')">Login</el-button>
                </el-form-item>
                <div class="tiparea">
                    <p>Not having an account? <router-link to='/register'>Register Now</router-link></p>
                </div>
            </el-form>

        </div>
    </section>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode';

export default {
    name:"login",
    components:{},
    data(){
        return {

            loginUser:{
                email:"",
                password:"",
            },

            rules:{
                
                email: [
                    { type: "email", required:true, message:"Email address format is incorrect",trigger: 'blur' }
                ],
                password: [
                    { required:true, message:"password can not be empty",trigger: 'blur' },
                    { min:6, max:30, message:"Password length can be less than 6 or greater than 30",trigger: 'blur' }
                ]
            }
        }
    },

    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post('/api/users/login',this.loginUser)
            .then(response => {
                const {token} = response.data;
                //store to local storage
                localStorage.setItem('eleToken',token);

                const decoded = jwt_decode(token);
                
                //store the token to Vuex
                this.$store.dispatch("setAuthenticated",!this.isEmpty(decoded));
                this.$store.dispatch("setUser",decoded);

                this.$router.push('/index');
            });
            
          }
        });
      },

      isEmpty(value){
          return (
              value === undefined ||
              value === null ||
              (typeof value === "object" && Object.keys(value).length === 0) ||
              (typeof value === "string" && value.trim().length === 0) 

          );
      }
    }
  
};
</script>

<style scoped>
    .login {
    position: relative;
    width: 100%;
    height: 100%;
    background: url(../assets/bg.jpg) no-repeat center center;
    background-size: 100% 100%;
    }
    .form_container {
    width: 370px;
    height: 210px;
    position: absolute;
    top: 20%;
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
    }
    .loginForm {
    margin-top: 20px;
    background-color: #fff;
    padding: 20px 40px 20px 20px;
    border-radius: 5px;
    box-shadow: 0px 5px 10px #cccc;
    }

    .submit_btn {
    width: 100%;
    }
    .tiparea {
    text-align: right;
    font-size: 12px;
    color: #333;
    }
    .tiparea p a {
    color: #409eff;
    } 
    
</style>
