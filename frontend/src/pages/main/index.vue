<template>
  <main class="main-page">
    <HeaderComp />

    <div class="itisit-container actions">
      <a-button
        class="add-prj-btn"
        type="primary"
        @click="projectDrawer.isOpen = true"
      >
        <Icon name="material-symbols:add-rounded" />
        Жаңа жоба
      </a-button>

      <FilterSort />
    </div>

    <ProjectDrawer
      :isOpen="projectDrawer.isOpen"
      :project="projectDrawer.project"
      @close="projectDrawer.isOpen = false"
      @create="handleCreateProject"
    />

    <div class="itisit-container project-list">
      <ProjectCard
        v-for="project in projectList"
        :key="project.id"
        :project="project"
        @edit="
          (project) => {
            projectDrawer.project = project;
            projectDrawer.isOpen = true;
          }
        "
      />
    </div>
  </main>
</template>

<script setup lang="ts">
// Types
import type { I_Project } from "~/types/project";

// Vue
import { ref } from "vue";
// Hooks
import { useRequest } from "vue-hooks-plus";
// API
import { API_FetchProjectList } from "@/service/api/project-api";
// Component
import HeaderComp from "@/components/common/HeaderComp.vue";
import FilterSort from "@/components/main_page/FilterSort.vue";
import ProjectCard from "@/components/business/ProjectCard/index.vue";
import ProjectDrawer from "@/components/business/ProjectDrawer.vue";

defineOptions({ name: "MainPage" });

const projectDrawer = ref<{ isOpen: boolean; project: I_Project | null }>({
  isOpen: false,
  project: null,
});
const projectList = ref<I_Project[]>([]);

const { loading: loadingFetchProjectList, run: fetchProjectList } = useRequest(
  API_FetchProjectList,
  {
    onSuccess(response) {
      projectList.value = response.data;
    },
  }
);

const handleCreateProject = (project: I_Project) => {
  projectList.value.unshift(project);
  projectDrawer.value.isOpen = false;
};
</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.actions {
  margin-top: 32px;
  margin-bottom: 32px;
  @include flex($alignItems: center, $gap: 24px);

  .add-prj-btn {
    height: 44px;
    border-radius: 26px;
  }

  /* Responsive */
  @media screen and (max-width: 1140px) {
    flex-direction: column;
  }
}

.project-list {
  padding-bottom: 40px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media screen and (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media screen and (max-width: 886px) {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
