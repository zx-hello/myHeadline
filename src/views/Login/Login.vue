<template>
  <div class="login_container">
    <!-- 顶部标题 -->
    <van-nav-bar title="Headline" fixed />
    <!-- 表单登录 -->
    <van-form @submit="onSubmit">
      <!-- label="手机号" 表示左侧描述性质的文本 -->
      <!-- required 用于渲染label左侧的星号✳，表示必填项 -->
      <van-field
        v-model="form.mobile"
        type="text"
        label="手机号"
        placeholder="请输入手机号"
        :rules="rules.mobile"
        required
      />
      <van-field
        v-model="form.code"
        type="password"
        label="登录密码"
        placeholder="请输入密码"
        :rules="rules.code"
        required
      />
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
// 按需导入API接口
import { loginApi } from '../../api/userApi'
// 从vuex中按需导入
import { mapMutations } from 'vuex'
export default {
  // 组件的name属性的值需要首字母大写(推荐)
  name: 'Login',
  data () {
    return {
      form: {
        // 手机号码
        mobile: '',
        // 登录密码
        code: ''
      },
      // 校验规则
      rules: {
        // 手机号的校验规则
        mobile: [
          { required: true, message: '请填写您的手机号', trigger: 'onBlur' },
          // 11 位手机号的校验规则
          { pattern: /^1\d{10}$/, message: '请填写正确的手机号', trigger: 'onBlur' }
        ],
        // 密码的校验规则
        code: [{ required: true, message: '请填写您的密码', trigger: 'onBlur' }]
      }
    }
  },
  methods: {
    ...mapMutations(['updateTokenInfo']),
    async onSubmit () {
      // 只有当表单数据校验通过之后，才会调用此 onSubmit 函数
      // console.log(this.form)
      // TODO：调用 API 接口，发起登录的请求
      // 若调用某个方法，若返回值是promise对象，则可以在方法之前加await关键字
      // await 只可以用在aysnc修饰的方法内
      const res = await loginApi(this.form)
      // console.log(res, res.data.data)
      if (res.data.message === 'OK') {
        // // 以前的普通方式保存token
        // localStorage.setItem('token', JSON.stringify(res.data.data))
        // // 证明登录成功 1.将token保存到本地
        // 保存在store/index.js文件中 mapMutations中的updateTokenInfo函数内
        this.updateTokenInfo(res.data.data)
        // // 2.跳转到首页
        // 动态获取登录成功后需要跳转的页面
        /**
         * 用户在登陆前直接访问了一个有权限才可以访问的页面
         * 那么在他登陆后,会直接跳转到其想访问的页面
         * 若用户直接点击的是登录页面，登陆后，直接跳转到首页即可
         */
        const navPath = this.$route.query.pre || '/'
        // 使用replace去跳转不会直接跳转到登录页面
        // 而push跳转回去会跳转到登录页面
        // 但是其实用户已经登录了 这样可以增强用户体验
        this.$router.replace(navPath)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  padding-top: 46px;
}
</style>
