<template>
  <div class="input-box">
        <el-dialog width="600px" :visible.sync="dialogFormVisible" :show-close="showClo" :close-on-click-modal="false" >
                <div slot="title" class="title">
                    <img src="@/assets/img/publicPics/logoBlue.png" alt="">
                    <span><b>PLAYS中控管理</b> </span>
                </div>

                <div class="googleContent">Google安全码验证</div>
                <div class="notice">请输入6位数安全码</div>

                <div class="input-content" @keydown="keydown" @keyup="keyup"  @input="inputEvent">
                    <input maxlength="1" data-index="0" v-model.trim.number="input[0]" ref="firstinput"/>
                    <input maxlength="1" data-index="1" v-model.trim.number="input[1]"/>
                    <input maxlength="1" data-index="2" v-model.trim.number="input[2]"/>
                    <input maxlength="1" data-index="3" v-model.trim.number="input[3]"/>
                    <input maxlength="1" data-index="4" v-model.trim.number="input[4]"/>
                    <input maxlength="1" data-index="5" v-model.trim.number="input[5]"/>
                </div>
                <div >
                    <p v-if="btnStatus" class="loginBtn btnEnable googleCodeBtn" @click="googleCheck"> 
                        <b>登录</b>
                    </p>
                    <p v-else class="loginBtn btnDisable googleCodeBtn" > 
                        <b>登录</b>
                    </p>
                </div>


        </el-dialog>



  </div>
</template>


<script>
import * as API from '@/api/login'
export default {
    data() {
      return {
        googleCode : '',
        showClo:false,
        dialogFormVisible : false,
        btnStatus : false,
        pasteResult: [],
        // userName: "",
        // id: 0,
        input: []
      };
    },
    props: ['userName','id'],
    computed: {
      input() {
        // code 是父组件传进来的默认值，必须是6位长度的数组，这里就不再做容错判断处理
        // 最后空数组是默认值
        return this.code || this.pasteResult.length === 6 ? this.pasteResult : ['', '', '', '', '', '']
      }
    },
    mounted() {
      this.input = [];
    },
    methods: {
        googleCheck() {
          let args = new URLSearchParams()
          args.append('id', this.id)
          args.append('googleCode', this.input[0] + this.input[1] + this.input[2] + this.input[3] + this.input[4] + this.input[5])
          
          API.verifyGoogleCode(args).then(res => {
              if(res.code == 0) {
                localStorage.setItem('ms_username', this.userName);
                localStorage.setItem('token', "Bearer " + res.data.token);
                this.$router.push("/")
                this.$message.success(res.message)
              } else {
                this.$message.error(res.message)
              }
          })
        },

      // 解决一个输入框输入多个字符
      inputEvent(e) {
        var index = e.target.dataset.index * 1;
        var el = e.target;
        this.$set(this.input, index, el.value.slice(0, 1))
      },
      keydown(e) {
        var index = e.target.dataset.index * 1;
        var el = e.target;
        if (e.key === 'Backspace') {
          if (this.input[index].length > 0) {
            this.$set(this.input, index, '')
          } else {
            if (el.previousElementSibling) {
              el.previousElementSibling.focus()
              this.$set(this.input, index - 1, '')
            }
          }
        } else if (e.key === 'Delete') {
          if (this.input[index].length > 0) {
            this.$set(this.input, index, '')
          } else {
            if (el.nextElementSibling) {
              this.$set(this.input, index = 1, '')
            }
          }
          if (el.nextElementSibling) {
            el.nextElementSibling.focus()
          }
        } else if (e.key === 'Home') {
          el.parentElement.children[0] && el.parentElement.children[0].focus()
        } else if (e.key === 'End') {
          el.parentElement.children[this.input.length - 1] && el.parentElement.children[this.input.length - 1].focus()
        } else if (e.key === 'ArrowLeft') {
          if (el.previousElementSibling) {
            el.previousElementSibling.focus()
          }
        } else if (e.key === 'ArrowRight') {
          if (el.nextElementSibling) {
            el.nextElementSibling.focus()
          }
        } else if (e.key === 'ArrowUp') {
          if (this.input[index] * 1 < 9) {
            this.$set(this.input, index, (this.input[index] * 1 + 1).toString());
          }
        } else if (e.key === 'ArrowDown') {
          if (this.input[index] * 1 > 0) {
            this.$set(this.input, index, (this.input[index] * 1 - 1).toString());
          }
        }
      },
      keyup(e) {
        var index = e.target.dataset.index * 1;
        var el = e.target;
        if (/Digit|Numpad/i.test(e.code)) {
          this.$set(this.input, index, e.code.replace(/Digit|Numpad/i, ''));
          el.nextElementSibling && el.nextElementSibling.focus();
          if (index === 5) {
            if (this.input.join('').length === 6) {

                document.activeElement.blur();
                this.$emit('complete', this.input);
            }
          }
        } else {
          if (this.input[index] === '') {
            this.$set(this.input, index, '');
          }
        }
      },
      // mousewheel(e) {
      //   var index = e.target.dataset.index;
      //   if (e.wheelDelta > 0) {
      //     if (this.input[index] * 1 < 9) {
      //       this.$set(this.input, index, (this.input[index] * 1 + 1).toString());
      //     }
      //   } else if (e.wheelDelta < 0) {
      //     if (this.input[index] * 1 > 0) {
      //       this.$set(this.input, index, (this.input[index] * 1 - 1).toString());
      //     }
      //   } else if (e.key === 'Enter') {
      //     if (this.input.join('').length === 6) {
      //       document.activeElement.blur();
      //       this.$emit('complete', this.input);
      //     }
      //   }
      // },
      // paste(e) {
      //   // 当进行粘贴时
      //   e.clipboardData.items[0].getAsString(str => {
      //     if (str.toString().length === 6) {
      //       this.pasteResult = str.split('');
      //       document.activeElement.blur();
      //       this.$emit('complete', this.input);
      //     }
      //   })
      // }
    },


    updated() {
        if(
          this.$common.isSet(this.input[0]) &&
          this.$common.isSet(this.input[1]) &&
          this.$common.isSet(this.input[2]) &&
          this.$common.isSet(this.input[3]) &&
          this.$common.isSet(this.input[4]) &&
          this.$common.isSet(this.input[5])
        ) {
          this.btnStatus = true
        } else {
          this.btnStatus = false
        }
    }
  }
</script>
<style scoped>
.title {
    margin-top:10px
}

.googleContent {
    width:100%;
    color:#7E7E7E;
    text-align: center;
    font-size:24px;
    font-weight: 600;
}
.notice {
    width:100%;
    color:#7E7E7E;
    padding-left: 15px;
    font-size:16px;
    margin-top:60px
}

.title img {
    width:30px;
    height:30px;
    vertical-align: middle;
    margin-right:15px
}

.title span {
    color:#2C3B59;
    
}

.input-content {
    width: 100%;
    margin-top:20px
}

.input-content input {
    width:13%;
    height:70px;
    margin-left:15px;
    text-align: center;
    font-size:32px;
    border:1px solid #BDBDBD

}
 
.googleCodeBtn {
    margin-top:50px !important;
    width:80% !important; 
    margin:0 auto;
}
 
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  appearance: none;
  margin: 0;
}

/deep/ .el-dialog__header {
    background: url('../../assets/img/publicPics/googleTitleBg.png');
    background-repeat:no-repeat;
    background-size:100% 15px;
    background-position: 0 -1px;

}

/deep/ .el-dialog { 
    border-radius: 7px;
    height:420px;
}


</style>


