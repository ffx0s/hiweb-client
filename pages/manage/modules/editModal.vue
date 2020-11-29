<template>
  <Modal
    v-model="visible"
    :title="form.id ? '修改' : '添加'"
    show-cancel-button
    destroy-on-close
    @confirm="submit"
    @cancel="cancel"
  >
    <Validator ref="form" :model="form" :rules="rules">
      <Group
        v-if="items"
        :border="false"
        label-align="left"
        label-width="100"
        value-align="left"
      >
        <Cell
          v-for="(item, i) in items"
          :key="i"
          :required="item.required"
          :title="item.title"
        >
          <input
            v-if="item.type === 'number'"
            v-model.number="form[item.field]"
            :type="item.type"
            :placeholder="item.title"
          />
          <input
            v-else
            v-model="form[item.field]"
            :type="item.type"
            :placeholder="item.title"
          />
        </Cell>
      </Group>
    </Validator>
  </Modal>
</template>

<script>
import Modal from 'lvan/modal'
import Group from 'lvan/cell/group.vue'
import Cell from 'lvan/cell'
import Validator from 'lvan/validator'
import { getConfig } from './config'

export default {
  components: {
    Modal,
    Group,
    Cell,
    Validator,
  },
  data() {
    return {
      visible: false,
      rules: {},
      form: {},
      items: [],
    }
  },
  methods: {
    cancel() {
      this.visible = false
    },
    submit(modal) {
      const callback = (errors) => this.$toast(errors[0])

      if (this.$refs.form.checkAll(callback)) {
        const { edit, query, field } = getConfig(this.$route.query.type)

        modal.confirmLoading = true

        this.$apollo
          .mutate({
            mutation: edit.mutation,
            variables: {
              [edit.variableName]: this.form,
            },
            update: (store, { data: result }) => {
              const data = store.readQuery({ query })

              if (data) {
                const item = result[Object.keys(result)[0]]
                const items = data[field]
                const curId = this.form.id

                if (curId) {
                  // 编辑
                  const index = items.findIndex(({ id }) => curId === id)
                  items.splice(index, 1, item)
                } else {
                  // 添加
                  items.unshift(item)
                }

                store.writeQuery({ query, data })
              }
            },
          })
          .then(({ data }) => {
            const item = data[Object.keys(data)[0]]
            this.success(modal, item)
          })
          .catch((error) => {
            this.$toast(error.message)
            modal.confirmLoading = false
          })
      }
    },
    reset() {
      this.$refs.form.reset()
    },
    success(modal, item) {
      modal.confirmLoading = false
      this.visible = false
      this.$emit('success', this.form.id, item)
      this.$toast({ type: 'success' })
      this.reset()
    },
    show(row) {
      const { edit } = getConfig(this.$route.query.type)

      this.form = {}
      this.items = [...edit.items]

      if (row) {
        if (row.id) {
          this.form.id = row.id
        }
        edit.items.forEach(({ field, rules = [] }) => {
          this.form[field] = row[field]
          this.rules[field] = [...rules]
        })
      } else {
        edit.items.forEach(({ field, rules, defaultValue }) => {
          this.form[field] = defaultValue !== undefined ? defaultValue : ''
          this.rules[field] = rules
        })
      }

      this.visible = true
    },
  },
}
</script>
