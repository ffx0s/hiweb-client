<template>
  <div>
    <slot :show="show" />
    <Modal
      v-model="visible"
      v-transfer-dom
      title="番茄钟设置"
      show-cancel-button
      @confirm="submit"
      @cancel="cancel"
    >
      <p class="gap-margin-bottom font14">权限状态: {{ permissionState }}</p>
      <p class="gap-margin-bottom font14">{{ pomodoroState }}</p>
      <Validator ref="form" :model="form" :rules="rules">
        <Group
          :border="false"
          label-align="left"
          label-width="150"
          value-align="left"
        >
          <Cell required title="专注时间（分钟）">
            <input v-model.number="form.notifyTime" type="number" />
          </Cell>
          <Cell required title="休息时间（分钟）">
            <input v-model.number="form.restTime" type="number" />
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

function countDown(countDownDate, countDownCallback, endCallback) {
  const timer = setInterval(function () {
    const now = new Date().getTime()
    const distance = countDownDate - now
    const minutes = Math.floor(distance / 1000 / 60)
    const seconds = Math.floor((distance / 1000) % 60)

    if (distance < 0) {
      clearInterval(timer)
      endCallback()
    } else {
      countDownCallback(minutes, seconds, distance)
    }
  }, 1000)

  return timer
}

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
        notifyTime: 30,
        restTime: 5,
        enabled: false,
        title: '🍅',
        content: '皇上该休息啦！',
      },
      // 时间倒计时
      countDownText: '',
      // 当前通知权限的状态
      permissionState: '',
      // 是否为休息状态
      isRest: false,
      // 番茄数量
      count: 0,
    }
  },
  computed: {
    // 当前番茄钟状态（处于哪个阶段：专注中/休息中）
    pomodoroState() {
      const count = ' 🍅 ' + this.count
      if (this.countDownText) {
        return (
          (this.isRest ? '休息中 ' : '专注中 ') + this.countDownText + count
        )
      }
      return this.form.enabled ? '待启动' : '已关闭'
    },
  },
  mounted() {
    try {
      const settings = JSON.parse(localStorage.POMODORO_SETTINGS)
      this.form = { ...this.form, ...settings }
    } catch (err) {}

    // 计时器
    this.timer = null

    this.permissionState = Notification?.permission || '不支持'

    // 开始计时通知
    this.startCountDown(0, { ...this.form })
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
        this.requestPermission().then(() => {
          this.countDownText = ''
          this.countDownText = ''
          this.startCountDown(0, { ...this.form })
        })
        this.$toast({ type: 'success' })
      }
    },
    // 请求权限
    async requestPermission() {
      if (!window.Notification) return
      await Notification.requestPermission()
      this.permissionState = Notification.permission
      return Notification.permission
    },
    createNotify(options = { ...this.form }) {
      return this.requestPermission().then((permission) => {
        if (permission === 'granted') {
          return new Notification(options.title, {
            body: options.content,
            icon: 'http://localhost:3000/favicon-32x32.png?v=WG23BK35Xy',
          })
        }
      })
    },
    startCountDown(state, options) {
      if (!window.Notification) return

      clearTimeout(this.timer)

      // 拒绝授予通知权限或为关闭状态则不执行
      if (Notification.permission === 'denied' || !options.enabled) return

      this.isRest = state === 1

      const time =
        (this.isRest ? options.restTime : options.notifyTime) * 60 * 1000

      this.timer = countDown(
        new Date().getTime() + time,
        (minutes, seconds) => {
          this.countDownText =
            String(minutes).padStart(2, 0) +
            ':' +
            String(seconds).padStart(2, 0)
        },
        () => {
          if (this.isRest) {
            this.startCountDown(0, options)
          } else {
            // 检查用户是否同意接受通知
            if (Notification.permission === 'granted') {
              this.createNotify(options)
              this.count++
            }
            this.startCountDown(1, options)
          }
        }
      )
    },
  },
}
</script>
