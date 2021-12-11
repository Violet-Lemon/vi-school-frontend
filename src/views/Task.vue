<template>
  <section v-if="task">
    <md-toolbar>
      <h1 class="md-title" style="flex: 1; text-align: left">{{ task.title }}</h1>
      <i :class="`task__text--${task.className}`">{{ task.status.title }}</i>
      <md-button class="task__btn" @click="showEditModal">Редактировать</md-button>
    </md-toolbar>
    <md-content class="container task__container">
      <strong>{{ task.message }}</strong>
    </md-content>
    <md-dialog :md-active.sync="isEditModalShow">
      <md-card class="card">
        <md-card-content>
          <md-field :class="messageClass">
            <label>Заголовок</label>
            <md-input v-model="localTask.title" required @input="deleteErrors"></md-input>
            <span class="md-error">{{ titleError }}</span>
          </md-field>
          <md-field :class="messageClass">
            <label>Описание</label>
            <md-textarea v-model="localTask.message" required @input="deleteErrors"></md-textarea>
            <span class="md-error">{{ messageError }}</span>
          </md-field>
        </md-card-content>

        <md-card-actions>
          <md-button @click="cancel">Отменить</md-button>
          <md-button @click="saveTask">Сохранить</md-button>
        </md-card-actions>
      </md-card>
    </md-dialog>
  </section>
  <section v-else>
    <md-progress-spinner md-mode="indeterminate" class="spinner"></md-progress-spinner>
  </section>
</template>

<script>
export default {
  name: 'Task',
  props: {
    id: [String, Number],
  },
  data() {
    return {
      status: {
        done: 'Выполнено',
        active: 'В работе',
        overdue: 'Просрочено',
      },
      isEditModalShow: false,
      error: '',
      task: null,
      localTask: {},
      titleError: '',
      messageError: '',
    };
  },
  async mounted() {
    try {
      const { data } = await this.$api.post(`request/show/${this.id}`);
      if (data.error) {
        this.$router.push({ name: 'TasksList' });
      }
      this.task = data.data;
    } catch (error) {
      console.error(error);
    }
  },
  computed: {
    messageClass() {
      return {
        'md-invalid': this.error,
      };
    },
  },
  methods: {
    validateForm() {
      let isValid = true;
      this.error = false;
      if (!this.localTask.title) {
        this.titleError = 'Заполните заголовок';
        this.error = true;
        isValid = false;
      }
      if (!this.localTask.message) {
        this.messageError = 'Заполните описание';
        this.error = true;
        isValid = false;
      }
      return isValid;
    },
    deleteErrors() {
      this.titleError = '';
      this.messageError = '';
    },
    cancel() {
      this.isEditModalShow = false;
      this.deleteErrors();
    },
    showEditModal() {
      this.isEditModalShow = true;
      this.localTask = { ...this.task };
    },
    async saveTask() {
      if (!this.validateForm()) return;
      const backup = { ...this.task };
      this.isEditModalShow = false;
      this.task = { ...this.localTask };
      try {
        const { data } = await this.$api.post(`request/edit/${this.id}`, {
          title: this.task.title,
          message: this.task.message,
        });
        if (data.error) {
          this.task = backup;
        }
      } catch (error) {
        this.task = backup;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.task {
  &__container {
    padding-top: 16px;
    text-align: left;
    background: none !important;
  }

  &__btn {
    background-color: #37ce7e;
    border-radius: 4px;

    &::v-deep .md-button-content {
      font-size: 16px;
      font-weight: bold;
      color: #fff;
      text-transform: none;
    }
  }

  &__text {
    &--done {
      color: #37ce7e;
    }

    &--active {
      color: #4c7397;
    }

    &--overdue {
      color: #db545a;
    }
  }
}
.spinner {
  margin: 200px auto 0;
}

.error {
  color: red;
}
</style>
