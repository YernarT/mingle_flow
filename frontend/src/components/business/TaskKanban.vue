<template>
  <div class="itisit-container task-kanban">
    <div v-for="column in columns" :key="column.value" class="column">
      <p class="column__head">
        {{ column.label }} {{ column.taskList.length }}
      </p>
      <VueDraggableNext
        :list="column.taskList"
        :animation="200"
        class="column__list"
        :data-state="column.value"
        group="taskList"
        @end="handleMoveCard"
      >
        <TaskCard v-for="task in column.taskList" :key="task.id" :task="task" />
      </VueDraggableNext>
    </div>
  </div>
</template>

<script setup lang="ts">
// Types
import type { I_Task } from "@/types/task";

// Vue
import { computed } from "vue";
// Components
import TaskCard from "@/components/business/TaskCard/index.vue";
import { VueDraggableNext } from "vue-draggable-next";
// Constants
import { TASK } from "@/constants/task";
// Utils
import _ from "lodash";

defineOptions({ name: "TaskKanban" });

const props = defineProps<{
  taskList: {
    backlog: I_Task[];
    analyze: I_Task[];
    develop: I_Task[];
    test: I_Task[];
    finish: I_Task[];
  };
}>();

const emit = defineEmits(["changeState"]);

const columns = computed(() => {
  return TASK.statusOptions.map((status) => {
    const statusKey = _.findKey(
      TASK.status,
      (statusValue) => statusValue === status.value
    );

    // @ts-ignore
    return { ...status, taskList: props.taskList[statusKey] };
  });
});

const handleMoveCard = (event: any) => {
  const fromState = event.from.getAttribute("data-state");
  const toState = event.to.getAttribute("data-state");
  if (fromState === toState) return;

  const statusKey = _.findKey(
    TASK.status,
    (statusValue) => statusValue === Number(toState)
  );

  // @ts-ignore
  const task = props.taskList[statusKey][event.newIndex];
  emit("changeState", task, Number(toState));
};
</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.task-kanban {
  width: 100%;
  margin-bottom: 24px;
  flex: 1 1 100%;
  @include flex($gap: 8px);

  .column {
    flex: 1 1 calc((100% - 8px * 4) / 5);

    &__head {
      font-size: 18px;
      margin-bottom: 8px;
    }

    &__list {
      width: 100%;
      max-height: 100dvh;
      overflow: hidden auto;
      @include flex($direction: column, $gap: 16px);
    }
  }
}
</style>
