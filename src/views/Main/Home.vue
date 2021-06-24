<template>
  <div class="home_container">
    <!-- 头部区域 插槽 -->
    <van-nav-bar fixed>
      <!-- 左侧的插槽 -->
      <template #left>
        <img src="../../assets/toutiao_logo.png" class="logo" alt="logo" />
      </template>
      <!-- 右侧的插槽 -->
      <template #right>
        <!-- 修改颜色样式在cover.less  -->
        <!-- @click="$router.push('/search')"点击跳转到搜索页面 -->
        <van-icon @click="$router.push('/search')" name="search" size="18" />
      </template>
    </van-nav-bar>
    <!-- 导航 列表选择区域 -->
    <!-- v-model="active" 绑定当前激活标签对应的索引值，默认情况下启用第一个标签  -->
    <van-tabs v-model="active" sticky offset-top="1.22667rem">
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <!-- :channel-id="item.id" 推荐的写法，是子组件为小驼峰命名(channelId)，绑定的时候是连字符形式 -->
        <ArtList :channel-id="item.id"></ArtList>
      </van-tab>
    </van-tabs>

    <!-- 添加频道の小按钮 -->
    <!-- 频道管理的小图标 -->
    <van-icon name="plus" size="16" class="plus" @click="show = true" />
    <!-- 频道管理的弹出层 -->
    <!-- :close-on-click-overlay="false"防止点击遮罩层时，弹出层自动关闭的效果 -->
    <!-- @closed="isDel = false" 点击关闭popup面板的时候，内部的编辑状态等全都恢复成关闭状态 -->
    <van-popup
      v-model="show"
      :close-on-click-overlay="false"
      @closed="isDel = false"
    >
      <div class="popup-container">
        <!-- 弹出层的头部区域 -->
        <van-nav-bar title="频道管理">
          <template #right>
            <van-icon
              name="cross"
              size="14"
              color="white"
              @click="show = false"
            />
          </template>
        </van-nav-bar>

        <!-- 弹出层的主体区域 -->
        <div class="pop-body">
          <!-- 我的频道 -->
          <div class="my-channel-box">
            <div class="channel-title">
              <div>
                <span class="title-bold">已添加频道：</span>
                <!-- 提示的文本 -->
                <span class="title-gray">{{
                  isDel ? "点击移除频道" : "点击进入频道"
                }}</span>
              </div>
              <!-- 按钮的文本 -->
              <span class="btn-edit" @click="isDel = !isDel">{{
                isDel ? "完成" : "编辑"
              }}</span>
            </div>
            <!-- 我的频道列表 -->
            <van-row type="flex">
              <van-col span="6" v-for="(item, i) in channels" :key="item.id">
                <!-- 用户的频道 Item 项 -->
                <div
                  @click="onUserChannelClick(item, i)"
                  class="channel-item van-hairline--surround"
                >
                  {{ item.name }}
                  <!-- 删除的图标 -->
                  <van-badge
                    color="transparent"
                    class="cross-badge"
                    v-if="isDel && item.name !== '推荐' && channels.length > 2"
                  >
                    <template #content>
                      <van-icon
                        name="cross"
                        class="badge-icon"
                        color="#cfcfcf"
                        size="12"
                      />
                    </template>
                  </van-badge>
                </div>
              </van-col>
            </van-row>
          </div>

          <!-- 分隔线 -->
          <div class="van-hairline--top sp-line"></div>

          <!-- 更多频道 -->
          <div class="more-channel-box">
            <div class="channel-title">
              <div>
                <span class="title-bold">可添加频道：</span>
                <span class="title-gray">点击添加频道</span>
              </div>
            </div>
            <!-- 更多频道列表 -->
            <van-row type="flex">
              <van-col span="6" v-for="item in moreChannel" :key="item.id">
                <div
                  @click="addToChannel(item)"
                  class="channel-item van-hairline--surround"
                >
                  {{ item.name }}
                </div>
              </van-col>
            </van-row>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
// 导入接口API
import { getUserChannelsApi, getAllChannelApi, updateUserChannelApi } from '@/api/homeApi'
// 导入文章列表组件
import ArtList from '@/components/ArtList/ArtList.vue'
// 导入组件,提示用户更新频道成功的提示组件
// import { Notify } from 'vant'
export default {
  name: 'Home',
  components: {
    ArtList
  },
  data () {
    return {
      // 标签页的激活项，当前选中的那一项
      active: 0,
      // 用户的频道列表数据(已添加的)
      channels: [],
      //  控制频道管理弹出层的展示与隐藏
      show: false,
      // 所有频道列表数据
      allChannel: [],
      // 频道的删除状态
      isDel: false
    }
  },
  computed: {
    // 动态计算出未关注频道列表的数据
    moreChannel () {
      // 未添加的频道的新数组
      const newArr = []
      // 循环全部频道
      this.allChannel.forEach(item => {
        // 判断是否在channels数组中
        // 若不在添加到新数组中 r ---> 是一个布尔值
        const r = this.channels.every(x => x.id !== item.id)
        if (r) {
          newArr.push(item)
        }
      })
      // return结果
      return newArr
    }
  },
  created () {
    this.initUserChannels()
    this.initAllChannel()
  },
  methods: {
    // 初始化用户频道列表的数据
    async initUserChannels () {
      // { data: res }解构出data且重命名为res
      const { data: res } = await getUserChannelsApi()
      // console.log(res)
      if (res.message === 'OK') {
        // 若数据获取成功 将数据存储到data中,供渲染模板使用
        this.channels = res.data.channels
      }
    },
    // 初始化所有频道列表的数据
    async initAllChannel () {
      const { data: res } = await getAllChannelApi()
      // console.log(res)
      if (res.message === 'OK') {
        this.allChannel = res.data.channels
      }
    },
    // 点击未关注的频道，将其添加到已关注的频道列表中
    addToChannel (item) {
      this.channels.push(item)
      this.updateChannel()
    },
    // 将用户添加的频道数据提交到数据库中
    async updateChannel () {
      // 将“推荐”从频道列表中过滤出去
      const newChannels = this.channels
        .filter(item => item.name !== '推荐')
        .map((item, i) => { return { id: item.id, seq: i } })
      // 调用API接口
      const { data: res } = await updateUserChannelApi(newChannels)
      // console.log(res)
      if (res.message === 'OK') {
        // 通过弹窗提示用户添加成功
        this.$notify({ type: 'warning', message: '更新成功' })
        // // 或者使用vant的组件引入也可以实现 提示
        // Notify({ type: 'warning', message: '更新成功' })
      }
    },
    // 用户点击删除频道列表 移除指定的ID
    onUserChannelClick (id, i) {
      // 若用户开启了删除状态才可以删除频道
      if (this.isDel) {
        // 处于删除的状态
        // 1.若点击的名字是推荐则不允许删除 2.当数组长度为2时，不允许再删除
        if (id.name === '推荐' || this.channels.length === 2) return
        this.channels = this.channels.filter(item => item.id !== id.id)
        this.updateChannel()
      } else {
        // 不在删除的状态
        this.active = i
        this.show = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  padding-top: 46px;
  padding-bottom: 50px;
}
.logo {
  height: 80%;
}

// 为 tabs 容器设置右 padding
/deep/ .van-tabs__wrap {
  padding-right: 36px;
  background-color: white;
}

// 频道管理小图标的定位
.plus {
  position: fixed;
  top: 58px;
  right: 10px;
  z-index: 999;
}

.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
    .title-bold {
      font-weight: bold;
    }
    .title-gray {
      color: gray;
      font-size: 12px;
    }
  }
}

.btn-edit {
  border: 1px solid #a3a2a2;
  padding: 0 10px;
  line-height: 20px;
  height: 20px;
  border-radius: 6px;
  font-size: 12px;
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 6px;
}

.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

.sp-line {
  margin: 10px 0 20px 0;
}
</style>
