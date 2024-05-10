<template>
  <div class="task-card">
    <div class="head">
      <span class="name">{{ props.task.name }}</span>
      <img
        v-if="props.task.worker"
        class="worker"
        :src="props.task.worker.avatar || defaultAvatar"
        :title="props.task.worker.fullname"
      />
    </div>

    <footer class="footer">
      <div class="attachement">
        <Icon name="material-symbols:attach-file" />
        {{ props.task.attachementList.length }}
      </div>

      <a-button
        data-icon
        class="in-btn"
        @click="$router.push(`/task/${task.id}`)"
      >
        <Icon name="material-symbols:arrow-right-alt-rounded" />
      </a-button>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Types
import type { I_Task } from "@/types/task";

defineOptions({ name: "TaskCard" });

const defaultAvatar = "/image/unauthorized_user_avatar.png";

const props = defineProps<{
  task: I_Task;
}>();
</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.task-card {
  width: 100%;
  border-radius: var(--border-radius);
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0 1px 3px 0, rgba(0, 0, 0, 0.06) 0 1px 2px 0;
  cursor: move;
  @include flex($direction: column);

  .head {
    width: 100%;
    height: 66px;
    padding: 8px;
    @include flex($justifyContent: space-between);

    .name {
      font-size: 16px;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .footer {
    width: 100%;
    padding: 8px;
    margin-top: 16px;
    border-top: 1px solid var(--c-border);
    @include flex($alignItems: center, $gap: 4px);

    .attachement {
      font-size: 16px;
      @include flex($alignItems: center);

      .itisit-icon {
        width: 18px;
        height: 18px;
      }
    }

    .in-btn {
      margin-left: auto;
      .itisit-icon {
        width: 18px;
        height: 18px;
      }
    }
  }
}
</style>
