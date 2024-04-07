<template>
  <div class="project-card">
    <div class="head">
      <h3 class="name">{{ project.name }}</h3>

      <div class="actions">
        <a-button data-icon>
          <Icon name="material-symbols:edit" />
        </a-button>
        <a-button data-icon>
          <Icon name="mdi:dots-vertical" />
        </a-button>
      </div>
    </div>

    <Status :status="project.status" />

    <div class="row">
      <div class="start-date">
        <span class="label">Басталу уақыты</span>
        <span class="date">{{ startDate }}</span>
      </div>

      <div class="task-member">
        <div class="task-member__item">
          <span class="value">93</span>
          <span class="label">Тапсырма</span>
        </div>
        <div class="task-member__split"></div>
        <div class="task-member__item">
          <span class="value">461</span>
          <span class="label">Мүше</span>
        </div>
      </div>
    </div>

    <div class="members">
      <span class="members__title">Мүшелер</span>

      <a-avatar-group
        :max-count="7"
        :max-style="{ color: '#f56a00', backgroundColor: '#fde3cf' }"
      >
        <a-avatar
          v-for="i in 'aksdjbkjasbdkabdk'"
          style="background-color: #1890ff"
          :size="28"
        >
          K
        </a-avatar>
        <a-tooltip title="Ant User" placement="top">
          <a-avatar style="background-color: #87d068">
            <template #icon><UserOutlined /></template>
          </a-avatar>
        </a-tooltip>
      </a-avatar-group>
    </div>

    <div class="progress">
      <span class="progress__title"> Прогресс </span>
      <a-progress :percent="86" strokeColor="var(--c-success)" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Types
import type { I_Project } from "@/types/project";

// Vue
import { defineComponent, toRefs, computed } from "vue";
// Utils
import getMonthName from "@/utils/getMonthName";
import capitalizeFirstLetter from "@/utils/capitalizeFirstLetter";
// Component
import Status from "@/components/business/ProjectCard/Status.vue";

defineComponent({ name: "ProjectCard" });

const props = defineProps<{ project: I_Project }>();

const { project } = toRefs(props);

const startDate = computed(() => {
  const date = new Date(project.value.createTime);
  const year = date.getFullYear();
  const month = capitalizeFirstLetter(
    getMonthName(date.getMonth() + 1).slice(0, 3)
  );
  const day = date.getDate();

  return `${day} ${month} ${year}`;
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

    .task-member {
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

  .members {
    margin-bottom: 8px;
    @include flex($direction: column);

    &__title {
      font-size: 16px;
      margin-bottom: 8px;
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
    }
  }
}
</style>
