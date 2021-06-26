<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
    />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <!-- 用户的头像 -->
          <van-image
            @click="$refs.iptFile.click()"
            round
            class="avatar"
            :src="userProfile.photo"
          />
          <!-- 文件的选择框
              accept="image/*" 选择指定文件类型
              文件选择器中的change事件 可以监听到用户选择文件的操作
          -->
          <input
            v-show="false"
            type="file"
            accept="image/*"
            @change="onFileChange"
            ref="iptFile"
          />
        </template>
      </van-cell>
      <van-cell
        @click="showName"
        title="昵称"
        is-link
        :value="userProfile.name"
      />
      <van-cell
        @click="showBirth"
        title="破壳日"
        is-link
        :value="userProfile.birthday"
      />
    </van-cell-group>

    <!-- 修改用户名称的对话框 -->
    <van-dialog
      v-model="showNameDialog"
      title="修改你的昵称"
      show-cancel-button
      :before-close="beforeClose"
    >
      <!-- 用户输入的input -->
      <van-field
        v-model.trim="name"
        placeholder="请输入用户名"
        input-align="center"
        maxlength="11"
        ref="iptNameRef"
      />
    </van-dialog>

    <!-- 修改生日的对话框 -->
    <van-action-sheet v-model="showBirthSheet">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择出生日期"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showBirthSheet = false"
        @confirm="onConfirm"
      />
    </van-action-sheet>
  </div>
</template>

<script>
// 导入辅助函数
import { mapActions, mapState } from 'vuex'
// 导入接口
import { updateUserProfileApi, updateUserAvatarApi } from '@/api/userApi'
// 导入dayjs进行日期格式化
import dayjs from 'dayjs'
export default {
  name: 'UserEdit',
  data () {
    return {
      // 是否显示修改姓名的弹框
      showNameDialog: false,
      // 用户输入的姓名
      name: '',
      // 是否展示修改生日的弹框
      showBirthSheet: false,
      // 最小可选日期（0 表示 1月份）
      minDate: new Date(1000, 0, 1),
      // 最大可选日期（11 表示 12月份）
      maxDate: new Date(2500, 11, 31),
      // 当前日期
      currentDate: new Date()
    }
  },
  computed: {
    // 获取用户的编辑信息
    ...mapState(['userProfile'])
  },
  created () {
    // 调用用户编辑信息的请求
    this.initUserProfile()
  },
  methods: {
    // 导入初始化用户编辑信息的操作
    ...mapActions(['initUserProfile']),
    showName () {
      // 将用户的原本的姓名填入到输入框内
      this.name = this.userProfile.name
      // 是否展示修改姓名的弹窗
      this.showNameDialog = true
      // 输入框自动获取焦点
      this.$nextTick(() => this.$refs.iptNameRef.focus())
    },
    // 修改姓名昵称
    // 用于处理用户点击取消还是确认时的处理函数
    async beforeClose (action, done) {
      // action 值有两个：cancel(取消) 和 confirm(确认)
      // console.log(action)

      // 点击了取消按钮 【调用 done() 时会关闭对话框】
      if (action === 'cancel') {
        return done()
      } else {
        // 当用户输入的是空值或者超过长度时
        if (this.name === '' || this.name.length > 11) {
          this.$notify({
            type: 'warning',
            message: '名称的长度为1-11个字符',
            duration: 2000
          })
          // 让输入框持续获得焦点
          this.$refs.iptNameRef.focus()
          // 阻止对话框的关闭 【调用 done(false) 时会阻止对话框关闭】
          return done(false)
        } else {
          // 内容合法
          // 发送请求，并最终关闭弹窗
          const { data: res } = await updateUserProfileApi({ name: this.name })
          if (res.message === 'OK') {
            this.$notify({ type: 'primary', message: '更新成功！' })
            done()
            // 调用映射过来actions方法，刷新用户的简介信息
            this.initUserProfile()
          }
        }
      }
    },
    // 修改生日
    showBirth () {
      // 如果用户生日的值存在，则初始值为用户的生日；否则为当前日期
      this.currentDate = this.userProfile.birthday ? new Date(this.userProfile.birthday) : new Date()
      this.showBirthSheet = true
    },
    // 点击了日期组件的确认按钮
    async onConfirm (value) {
      /**
       * console.log(value) 得到的是Date的一个时间对象
       * 基于value创建出一个dayjs的日期对象
       * 调用dayjs日期对象 的 .format()方法进行格式化
       * 返回值就是格式化好的时间字符串
       */
      const birthday = dayjs(value).format('YYYY-MM-DD')
      // console.log(birthday)
      const { data: res } = await updateUserProfileApi({ birthday: birthday })
      if (res.message === 'OK') {
        // 隐藏ActionSheet
        this.showBirthSheet = false
        // 更新用户数据
        this.initUserProfile()
        // 提示用户更新成功
        this.$notify({ type: 'primary', message: '更新成功！' })
      }
    },
    // 选中的文件发生了变化
    async onFileChange (e) {
      // 获取到用户选择的文件列表(伪数组) 存储用户选择的文件
      const files = e.currentTarget.files
      // 如果没有选择任何文件，则不执行后续操作
      if (files.length === 0) return
      /**
       * 打印用户选择的第一个文件
       * console.log(files[0])
       */
      // new一个文件对象 但是内部是空的
      const fd = new FormData()
      // 在fd中追加文件对象
      fd.append('photo', files[0])
      const { data: res } = await updateUserAvatarApi(fd)
      if (res.message === 'OK') {
        // 头像更新成功
        this.initUserProfile()
        // 提示用户
        this.$notify({ type: 'primary', message: '更新成功！' })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
}

.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
</style>
