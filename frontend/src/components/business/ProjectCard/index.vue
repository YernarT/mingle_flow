<template>
  <div class="project-card">
    <div class="head">
      <h3 class="name">{{ project.name }}</h3>

      <div class="actions">
        <!-- @click="emit('edit', project)" -->
        <a-button v-if="isCreator" data-icon>
          <Icon name="material-symbols:edit" />
        </a-button>
        <a-button
          data-icon
          @click="$router.push(`/task?project=${project.id}`)"
        >
          <Icon name="material-symbols:arrow-forward-rounded" />
        </a-button>
      </div>
    </div>

    <Status :status="project.status" />

    <div class="row">
      <div class="start-date">
        <span class="label">Басталу уақыты</span>
        <span class="date">{{ startDate }}</span>
      </div>

      <div class="task-worker">
        <div class="task-worker__item">
          <span class="value">{{ project.taskCount }}</span>
          <span class="label">Тапсырма</span>
        </div>
        <div class="task-worker__split"></div>
        <div class="task-worker__item">
          <span class="value">{{ project.contributorCount }}</span>
          <span class="label">Мүше</span>
        </div>
      </div>
    </div>

    <div class="contributor-list">
      <span class="contributor-list__title">Мүшелер</span>

      <a-avatar-group>
        <a-avatar
          v-for="{ user } in project.contributorList"
          :key="user.id"
          :size="28"
          :src="user.avatar"
        >
          {{ user.fullname[0] }}
        </a-avatar>
        <a-avatar v-if="overflowContributorCount > 0" :size="28">
          {{ overflowContributorCountLabel }}
        </a-avatar>
      </a-avatar-group>
    </div>

    <div class="progress">
      <span class="progress__title"> Прогресс </span>
      <a-progress :percent="project.progress" strokeColor="var(--c-success)" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Types
import type { I_Project } from "@/types/project";

// Vue
import { toRefs, computed } from "vue";
// Store
import { useUserStore } from "@/stores/user";
// Utils
import getMonthName from "@/utils/getMonthName";
import capitalizeFirstLetter from "@/utils/capitalizeFirstLetter";
// Component
import Status from "@/components/business/ProjectCard/Status.vue";

defineOptions({ name: "ProjectCard" });

const emit = defineEmits<{
  (event: "edit", project: I_Project): void;
}>();
const props = defineProps<{ project: I_Project }>();

const { project } = toRefs(props);
const userStore = useUserStore();

const startDate = computed(() => {
  const date = new Date(project.value.createTime);
  const year = date.getFullYear();
  const month = capitalizeFirstLetter(
    getMonthName(date.getMonth() + 1).slice(0, 3)
  );
  const day = date.getDate();

  return `${day} ${month} ${year}`;
});

const isCreator = computed(() => {
  return userStore.id === project.value.creator.id;
});

const overflowContributorCount = computed(() => {
  return project.value.contributorCount - project.value.contributorList.length;
});
const overflowContributorCountLabel = computed(() => {
  if (overflowContributorCount.value < 1000) {
    return `+${overflowContributorCount.value}`;
  }

  return `+999`;
});
</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.project-card {
  height: max-content;
  padding: 24px;
  border-radius: var(--border-radius);
  border: 1px solid #e5e5e5;
  background-color: #fff;
  transition: box-shadow var(--transition);

  &:hover {
    box-shadow: 0 2px 4px 1px rgba(80, 126, 169, 0.12);
  }

  .head {
    width: 100%;
    margin-bottom: 8px;
    @include flex($justifyContent: space-between);

    .name {
      font-weight: 500;
    }

    .actions {
      @include flex($alignItems: center, $gap: 16px);
    }
  }

  .status {
    margin-bottom: 8px;
  }

  .row {
    width: 100%;
    margin-bottom: 8px;
    @include flex($justifyContent: space-between, $alignItems: center);

    .start-date {
      @include flex($direction: column, $gap: 4px);

      .label {
        font-size: 16px;
      }

      .date {
        font-weight: 500;
        font-size: 16px;
      }
    }

    .task-worker {
      padding: 8px;
      border-radius: var(--border-radius);
      background-color: #f9f9f9;
      @include flex($alignItems: center);

      &__item {
        @include flex($direction: column, $alignItems: center);

        .value {
          font-size: 16px;
          font-weight: 500;
        }

        .label {
          font-size: 14px;
        }
      }

      &__split {
        width: 2px;
        height: 40px;
        margin: 0 10px;
        border-radius: var(--border-radius);
        background-color: var(--c-text-secondary);
      }
    }
  }

  .contributor-list {
    margin-bottom: 8px;
    @include flex($direction: column);

    &__title {
      font-size: 16px;
      margin-bottom: 8px;
    }

    :deep(.ant-avatar) {
      background-color: var(--c-text);

      .ant-avatar-string {
        font-size: 14px;
      }
    }
  }

  .progress {
    &__title {
      font-size: 16px;
      margin-bottom: 8px;
    }

    :deep(.ant-progress-text) {
      font-size: 16px;
      color: var(--c-text);

      .anticon {
        color: var(--c-success);
      }
    }
  }
}
</style>
