<template>
  <div>
    <slot :show="show" />
    <Modal
      v-model="visible"
      v-transfer-dom
      title="设置时间"
      show-cancel-button
      @confirm="submit"
      @cancel="cancel"
    >
      <p class="gap-margin-bottom font14">权限状态: {{ currentState }}</p>
      <Validator ref="form" :model="form" :rules="rules">
        <Group
          :border="false"
          label-align="left"
          label-width="150"
          value-align="left"
        >
          <Cell required title="提醒间隔（分钟）">
            <input v-model.number="form.time" type="number" />
          </Cell>
          <Cell required title="通知标题">
            <input v-model="form.title" type="text" />
          </Cell>
          <Cell required title="通知内容">
            <input v-model="form.content" type="text" />
          </Cell>
          <Cell required title="开启">
            <VSwitch v-model="form.enabled" size="20" />
          </Cell>
        </Group>
      </Validator>
      <VButton type="primary" outline small @click="createNotify">
        测试通知样式
      </VButton>
    </Modal>
  </div>
</template>

<script>
import Modal from 'lvan/modal'
import Group from 'lvan/cell/group.vue'
import Cell from 'lvan/cell'
import VSwitch from 'lvan/switch'
import Validator from 'lvan/validator'
import VButton from 'lvan/button'

export default {
  components: {
    Modal,
    Group,
    Cell,
    VSwitch,
    Validator,
    VButton,
  },
  data() {
    return {
      visible: false,
      rules: {
        title: [{ required: true, message: '请填写通知标题' }],
        content: [{ required: true, message: '请填写通知内容' }],
      },
      form: {
        time: 0.1,
        enabled: false,
        title: '🍅',
        content: '皇上该休息啦！',
      },
      // 当前通知权限的状态
      currentState: '',
    }
  },
  mounted() {
    try {
      const settings = JSON.parse(localStorage.POMODORO_SETTINGS)
      this.form = settings
    } catch (err) {}

    // 计时器
    this.timer = null

    this.currentState = Notification?.permission || '不支持'

    // 开始计时通知
    this.notifyMe()
  },
  methods: {
    show() {
      // 先检查浏览器是否支持
      if (!('Notification' in window)) {
        this.$modal({ title: '提示', content: '当前浏览器不支持此功能' })
      } else {
        this.visible = true
      }
    },
    cancel() {
      this.visible = false
    },
    submit(modal) {
      const callback = (errors) => this.$toast(errors[0])

      if (this.$refs.form.checkAll(callback)) {
        localStorage.POMODORO_SETTINGS = JSON.stringify(this.form)
        this.requestPermission().then(this.notifyMe)
        this.visible = false
      }
    },
    // 请求权限
    async requestPermission() {
      await Notification.requestPermission()
      this.currentState = Notification.permission
      return Notification.permission
    },
    createNotify() {
      return this.requestPermission().then((permission) => {
        if (permission === 'granted') {
          return new Notification(this.form.title, {
            body: this.form.content,
            icon: 'http://localhost:3000/favicon-32x32.png?v=WG23BK35Xy',
          })
        }
      })
    },
    notifyMe() {
      clearTimeout(this.timer)

      // 拒绝授权通知权限或为关闭状态则不执行
      if (Notification.permission === 'denied' || !this.form.enabled) return

      const time = this.form.time * 60 * 1000

      this.timer = setTimeout(() => {
        // 检查用户是否同意接受通知
        if (Notification.permission === 'granted') {
          this.createNotify()
          this.notifyMe()
        }
      }, time)
    },
  },
}
</script>
