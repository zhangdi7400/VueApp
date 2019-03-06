<template>

<div class="fillContainer">
<div>
    <el-form :inline="true" ref="add_data" :model="searchData">
        <el-form-item label="Filter by date">
            <el-date-picker
                v-model="searchData.startTime"
                type="datetime"
                placeholder="Select Start Date"
            >
            </el-date-picker>
            --
            <el-date-picker
                v-model="searchData.endTime"
                type="datetime"
                placeholder="Select End Date"
            >
            </el-date-picker>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" size="small" icon="search" @click="handleSearch()">Search</el-button>
        </el-form-item>
        <el-form-item class="btnRight">
            <el-button type="primary" size="small" v-if="user.identity=='administrator'"  icon="view" @click="handleAdd()">Add</el-button>
        </el-form-item>
    </el-form>
</div>
<div class="tableContainer">
<el-table
        v-if="tableData.length > 0"
        :data='tableData'
        max-height="450"
        border
        :default-sort = "{prop: 'date', order: 'descending'}"
        style="width: 100%">
            <el-table-column
            type="index"
            label="Index"
            align='center'
            width="70">
        </el-table-column>
        <el-table-column
            prop="date"
            label="Creat Date"
            align='center'
            width="250"
            sortable>
            <template slot-scope="scope">
                <el-icon name="time"></el-icon>
                <span style="margin-left: 10px">{{ scope.row.date }}</span>
            </template>
        </el-table-column>
        <el-table-column
            prop="type"
            label="Type"
            align='center'
            width="150">
        </el-table-column>
        <el-table-column
            prop="description"
            label="Description"
            align='center'
            width="180">
        </el-table-column>
        <el-table-column
            prop="income"
            label="Income"
            align='center'
            width="170"> 
            <template slot-scope="scope">  
                <span style="color:#00d053">+ {{ scope.row.income }}</span>
            </template>
        </el-table-column>
        <el-table-column
            prop="expense"
            label="Expense"
            align='center'
            width="170">
            <template slot-scope="scope">  
                <span style="color:#f56767">- {{ scope.row.expense }}</span>
            </template>
        </el-table-column>
        <el-table-column
            prop="cash"
            label="Account Cash"
            align='center'
            width="170">
            <template slot-scope="scope">  
                <span style="color:#4db3ff">{{ scope.row.cash }}</span>
            </template>
        </el-table-column>
            <el-table-column
            prop="remark"
            label="Comment"
            align='center'
            width="220">
        </el-table-column>
        <el-table-column
            prop="operation"
            align='center'
            label="Operation"
            fixed="right"
            v-if="user.identity=='administrator'"
            width="320">
            <template slot-scope='scope'>
                <el-button 
                    type="warning" 
                    icon='edit' 
                    size="small"
                    @click='handleEdit(scope.$index,scope.row)'
                >Edit</el-button>
                <el-button 
                    type="danger" 
                    icon='delete' 
                    size="small"
                    @click='handleDelete(scope.$index,scope.row)'
                >Delete</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-row>
        <el-col :span="24">
            <div class="pagination">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="paginations.page_index"
                :page-sizes="paginations.page_sizes"
                :page-size="paginations.page_size"
                :total="paginations.total"
                layout="total, sizes, prev, pager, next, jumper"
                >
                </el-pagination>
            </div>
        </el-col>
    </el-row>
    </div>
    <FoundDialog :dialog="dialog" :formData="formData" @update="getProfile"></FoundDialog>
</div>
  
</template>

<script>
import FoundDialog from '../components/Dialog';
export default {
    name:"fundList",
    data(){
        return {
            searchData:{
                startTime:"",
                endTime:""
            },
            paginations:{
                page_index:1,
                total:5,
                page_size:5,
                page_sizes:[5,10,15,20],
                layout:"total,size,prev,pager,next,jumper"
            },
            tableData:[],
            allTableData:[],
            filterTableData:[],
            formData:{
                type:"",
                description:"",
                income:"",
                expense:"",
                cash:"",
                remark:"",
                id:""
            },
            dialog:{
                show:false,
                title:'',
                option:'edit'
            }
        };
    },
    computed:{
        user(){
            return this.$store.getters.user;
        }

    },
    created(){
        this.getProfile();

    },

    methods:{
        getProfile(){
            //get table data
            this.$axios.get("/api/profiles")
            .then(res => {
                this.allTableData = res.data;
                this.filterTableData = res.data;
                //set pagination data
                this.setPaginations();
            }).catch(err =>{
                console.log(err);
            });
        },
        handleEdit(index,row){
            this.dialog ={
                show:true,
                title:"Edit the cash flow information",
                option:'edit'
            }

            this.formData = {
                type:row.type,
                description:row.description,
                income:row.income,
                expense:row.expense,
                cash:row.cash,
                remark:row.remark,
                id:row._id
            }
            
        },
        handleDelete(index,row){
            this.$axios.post(`/api/profiles/delete/${row._id}`)
            .then(res => {
                this.$message('Delete Successfully');
                this.getProfile();
            })

        },
        handleAdd(){
            this.dialog ={
                show:true,
                title:"Add a new cash flow",
                option:'add'
            }

            this.formData = {
                type:'',
                description:'',
                income:'',
                expense:'',
                cash:'',
                remark:'',
                id:''
            }
        },
        handleSizeChange(page_size){
            this.paginations.page_index = 1;
            this.paginations.page_size = page_size;
            this.tableData = this.allTableData.filter((item,index) => {
                return index < page_size;
            });

        },
        handleCurrentChange(page){
            
            let index = this.paginations.page_size * (page-1);
            let nums = this.paginations.page_size * page;

            let tables = [];

            for(let i = index; i < nums; i++){
                if(this.allTableData[i]){
                    tables.push(this.allTableData[i]);
                }
                this.tableData = tables;
            }
        },
        setPaginations(){
            this.paginations.total = this.allTableData.length;
            this.paginations.page_index = 1;
            this.paginations.page_size = 5;

            this.tableData = this.allTableData.filter((item,index) => {
                return index < this.paginations.page_size;
            });
        },
        handleSearch(){
            if(!this.searchData.startTime || !this.searchData.endTime){
                this.$message({
                    type:"warning",
                    message:"Please select a valid time"
                });
                this.getProfile();
                return;

            }

            const sTime = this.searchData.startTime.getTime();
            const eTime = this.searchData.endTime.getTime();


            this.allTableData = this.filterTableData.filter(item => {
                let date = new Date(item.date);
                let time = date.getTime();
                return time >= sTime && time <= eTime;
            }); 

            this.setPaginations();
            
        }

    },
    components: {
        FoundDialog
    }
};
</script>

<style scoped>
.fillcontain {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}

.pagination {
    text-align : right;
    margin-top: 10px;

}
</style>

