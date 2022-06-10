<template>
<div class="content-box">
  <div class="container">
      <div class="headContent">
        <p class="title">用户基本信息</p>
        <p>
          <span>用户名：</span>
          <span>{{ userInfo.username }}</span>
        </p>
        <p>
          <span>所属商户：</span>
          <span>{{ userInfo.balance }}</span>
        </p>
        <p>
          <span>注册时间：</span>
          <span>{{ userInfo.registerTime }}</span>
        </p>
        <p>
          <span>累计登录次数：</span>
          <span>{{ userInfo.allLoginNum }}</span>
        </p>
        <p>
          <span>用户ID：</span>
          <span>{{ userInfo.userId }}</span>
        </p>
        <p>
          <span>用户币种：</span>
          <span>{{ userInfo.allBetAmount }}</span>
        </p>
        <p>
          <span>可用余额：</span>
          <span>{{ userInfo.allBetNum }}</span>
        </p>
        <p>
          <span>最后登录时间：</span>
          <span>{{ userInfo.lastLoginTime }}</span>
        </p>
        <p>
          <span>累计转入额：</span>
          <span>{{ $common.currencyList[userInfo.settleCurrency - 1] }}</span>
        </p>
        <p>
          <span>累计转出额：</span>
          <span>{{ userInfo.allProfitLossAmount }}</span>
        </p>
        <p>
          <span>交易单数量：</span>
          <span>{{ userInfo.merchantName }}</span>
        </p>
        <p>
          <span>最后交易时间：</span>
          <span>{{ userInfo.lastBetTime }}</span>
        </p>



      </div>

      <div class="changeTab">
        <p :class="active == 1 ? 'active' : ''" @click="changeTabActive(1)">账变记录</p>
        <p :class="active == 2 ? 'active' : ''" @click="changeTabActive(2)">(免转)注单记录</p>
        <p :class="active == 3 ? 'active' : ''" @click="changeTabActive(3)">转账记录</p>
      </div>

      <div v-if="active == 1">

        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item label="账变类型：">
              <el-select v-model="listQuery.type" placeholder="请输入账变类型">
                <el-option v-for="(item,k) in $common.tradeList" :key="k" :label="item" :value="k + 1"/>
              </el-select>
          </el-form-item>
          <el-form-item label="账变时间：">
            <el-date-picker
            v-model="listQuery.timeRange"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="交易单号：">
            <el-input v-model="listQuery.relationId" placeholder="请输入交易单号" class="filter-item"  />
          </el-form-item>
        </el-form>
        <el-button  class="filter-item" type="primary" @click="handleFilter">
          查询
        </el-button>
        <el-button  class="filter-item" @click="reset">
          重置
        </el-button>

        <div class="table-container">
          <el-table ref="Table1"
                    :data="tableList1"
                    style="width: 100%;"
                    @sort-change="changeSort"
                    border>
            <el-table-column label="序号" align="center">
              <template slot-scope="scope">{{scope.row.id}}</template>
            </el-table-column>
            <el-table-column label="账变类型" align="center">
              <template slot-scope="scope">{{$common.tradeList[scope.row.type - 1]}}</template>
            </el-table-column>
            <el-table-column label="交易来源" align="center">
              <template slot-scope="scope">{{$common.tradeSourcesList[scope.row.tradeSources - 1]}}</template>
            </el-table-column>
            <el-table-column label="交易币种" align="center">
              <template slot-scope="scope">{{scope.row.amount}}</template>
            </el-table-column>
            <el-table-column label="账变金额" align="center">
              <template slot-scope="scope">{{scope.row.beforeAmount}}</template>
            </el-table-column>
            <el-table-column label="账变前余额" align="center">
              <template slot-scope="scope">{{scope.row.afterAmount}}</template>
            </el-table-column>
            <el-table-column label="账变后余额" align="center">
              <template slot-scope="scope">{{scope.row.createTime}}</template>
            </el-table-column>
            <el-table-column label="账变时间" align="center" sortable>
              <template slot-scope="scope">{{scope.row.relationId}}</template>
            </el-table-column>
            <el-table-column label="交易单号" align="center">
              <template slot-scope="scope">{{scope.row.relationId}}</template>
            </el-table-column>
          </el-table>
        </div>

        <div v-if="tableList1.length > 0" class="pagination-container">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="listQuery.pageNum"
            :page-size="listQuery.pageSize"
            :page-sizes="[10,20,50,100]"
            :total="total">
          </el-pagination>
        </div>

      </div>
      <div v-else-if="active == 2">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item label="交易单号：">
            <el-input v-model="listQuery.relationId" placeholder="请输入交易单号" class="filter-item"  />
          </el-form-item>
          <el-form-item label="注单号：">
            <el-input v-model="listQuery.relationId" placeholder="请输入注单号" class="filter-item"  />
          </el-form-item>
          <el-form-item label="玩法名称：">
              <el-select v-model="listQuery.type" placeholder="请输入玩法名称">
                <el-option v-for="(item,k) in $common.tradeList" :key="k" :label="item" :value="k + 1"/>
              </el-select>
          </el-form-item>
          <el-form-item label="账变时间：">
            <el-date-picker
            v-model="listQuery.timeRange"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="桌台号：">
            <el-input v-model="listQuery.relationId" placeholder="请输入桌台号" class="filter-item"  />
          </el-form-item>
          <el-form-item label="局号：">
            <el-input v-model="listQuery.relationId" placeholder="请输入局号" class="filter-item"  />
          </el-form-item>

        </el-form>
        <el-button  class="filter-item" type="primary" @click="handleFilter">
          查询
        </el-button>
        <el-button  class="filter-item" @click="reset">
          重置
        </el-button>

        <div class="table-container">
          <el-table ref="Table2"
                    :data="tableList2"
                    style="width: 100%;"
                    border>
            <el-table-column label="交易单号" align="center">
              <template slot-scope="scope">{{scope.row.id}}</template>
            </el-table-column>
            <el-table-column label="关联注单号" align="center">
              <template slot-scope="scope">{{$common.tradeList[scope.row.type - 1]}}</template>
            </el-table-column>
            <el-table-column label="玩法名称" align="center">
              <template slot-scope="scope">{{$common.tradeSourcesList[scope.row.tradeSources - 1]}}</template>
            </el-table-column>
            <el-table-column label="桌台号" align="center">
              <template slot-scope="scope">{{scope.row.amount}}</template>
            </el-table-column>
            <el-table-column label="局号" align="center">
              <template slot-scope="scope">{{scope.row.beforeAmount}}</template>
            </el-table-column>
            <el-table-column label="交易事由" align="center">
              <template slot-scope="scope">{{scope.row.afterAmount}}</template>
            </el-table-column>
            <el-table-column label="交易币种" align="center">
              <template slot-scope="scope">{{scope.row.createTime}}</template>
            </el-table-column>
            <el-table-column label="交易金额" align="center" sortable>
              <template slot-scope="scope">{{scope.row.relationId}}</template>
            </el-table-column>
            <el-table-column label="交易时间" align="center">
              <template slot-scope="scope">{{scope.row.relationId}}</template>
            </el-table-column>
            <el-table-column label="交易单状态" align="center">
              <template slot-scope="scope">{{scope.row.relationId}}</template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="tableList2.length > 0" class="pagination-container">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="listQuery.pageNum"
            :page-size="listQuery.pageSize"
            :page-sizes="[10,20,50,100]"
            :total="total">
          </el-pagination>
        </div>


      </div>
      <div v-else-if="active == 3">

        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item label="注单号：">
            <el-input v-model="listQuery.relationId" placeholder="请输入注单号" class="filter-item"  />
          </el-form-item>

          <el-form-item label="玩法名称：">
              <el-select v-model="listQuery.type" placeholder="请输入玩法名称">
                <el-option v-for="(item,k) in $common.tradeList" :key="k" :label="item" :value="k + 1"/>
              </el-select>
          </el-form-item>
          <el-form-item label="局号：">
            <el-input v-model="listQuery.relationId" placeholder="请输入局号" class="filter-item"  />
          </el-form-item>
          <el-form-item label="投注时间：">
            <el-date-picker
            v-model="listQuery.timeRange"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>

        </el-form>
        <el-button  class="filter-item" type="primary" @click="handleFilter">
          查询
        </el-button>
        <el-button  class="filter-item" @click="reset">
          重置
        </el-button>

        <div class="table-container">
          <el-table ref="Table3"
                    :data="tableList3"
                    style="width: 100%;"
                    border>
            <el-table-column label="交易单号" align="center">
              <template slot-scope="scope">{{scope.row.id}}</template>
            </el-table-column>
            <el-table-column label="交易商户" align="center">
              <template slot-scope="scope">{{$common.tradeList[scope.row.type - 1]}}</template>
            </el-table-column>
            <el-table-column label="转账类型" align="center">
              <template slot-scope="scope">{{$common.tradeSourcesList[scope.row.tradeSources - 1]}}</template>
            </el-table-column>
            <el-table-column label="转账币种" align="center">
              <template slot-scope="scope">{{scope.row.amount}}</template>
            </el-table-column>
            <el-table-column label="交易金额" align="center">
              <template slot-scope="scope">{{scope.row.beforeAmount}}</template>
            </el-table-column>
            <el-table-column label="交易时间" align="center">
              <template slot-scope="scope">{{scope.row.afterAmount}}</template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="tableList3.length > 0" class="pagination-container">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="listQuery.pageNum"
            :page-size="listQuery.pageSize"
            :page-sizes="[10,20,50,100]"
            :total="total">
          </el-pagination>
        </div>

      </div>





    

  </div>
</div>
</template>

<script>
import * as API from '@/api/sysCenter'

export default {
  data(){
    return{
      active: 1, //1账变记录 2（免转）注单记录 3转账记录
      listQuery: {
        pageNum: 1,
        pageSize: this.$common.defaultPage,
        rowId: '',
        userId: '',
        createTimeSort: '',
        startTime: '',
        endTime: '',
        timeRange: '',
        type: '',
        relationId: '',
      },
      userInfolistQuery: {
        id : ''
      },
      tableList1: [],
      tableList2: [],
      tableList3: [],
      userInfo: [],
      total: 0,
      listLoading: true,
    }
  },
  created() {
    this.userInfolistQuery.id = this.$route.query.rowId;
    this.listQuery.userId = this.$route.query.userId;
    this.listQuery.merchantId = this.$route.query.merchantId;
    this.fetchData();
    this.userInfoData();
  },
  methods:{
    changeSort(column) {},
    
    changeTabActive(type) {
      this.active = type
    },
    handleSizeChange(val) {  // 改变列表显示条数
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {  // 改变列表显示页数
      this.listQuery.pageNum = val;
      this.fetchData();
    },


    handleFilter() { //搜索
      this.listQuery.pageNum = 1

      if(this.listQuery.timeRange != '') {
        this.listQuery.startTime = this.listQuery.timeRange[0]
        this.listQuery.endTime = this.listQuery.timeRange[1]
      }
      this.fetchData()
    },
    reset() {
      this.$common.resetArgs(this.listQuery)
      this.listQuery.userId = this.$route.query.userId;
      this.listQuery.merchantId = this.$route.query.merchantId;
      this.listQuery.pageNum = 1
      this.fetchData()  
    },

    userInfoData() {
      let args = this.$common.transferToSearchParams(this.userInfolistQuery)
      API.getUserDetail(args).then(res => {
        if(res.code == 0) {
          this.userInfo = res.data
        }
      })
    },
    fetchData() {
      this.listLoading = true
      let args = this.$common.transferToSearchParams(this.listQuery)
      API.getBillRecord(args).then(res => {
        this.listLoading = false
        if(res.code == 0) {
          this.billRecordList = res.data.records
          this.total = res.data.total
        }
      })
    },
  }
}
</script>

<style scoped>
.changeTab {
  float:left;
  width:100%;
  margin-bottom: 15px;
  margin-top:60px;
}
.changeTab p {
  float:left;
  margin-right:20px;
  font-size:16px;
  cursor:pointer
}

.active {
  font-weight: 600;
  font-size: 18px !important;
  text-decoration: underline;
}

.headContent {
   width: 100%;
   float:left;
}

.headContent .title {
  width: 100%;
  font-size:16px;
  font-weight: 600;

}

.headContent p {
  float: left;
  width:25%;
  margin-top:5px
}
</style>




