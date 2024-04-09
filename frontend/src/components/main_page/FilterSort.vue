<template>
  <div class="filter-sort">
    <ul class="filter">
      <li
        v-for="item in filter"
        :key="item.value"
        class="item"
        :class="{ 'item--active': item.isActive }"
        @click="changeFilter(item.value)"
      >
        {{ item.label }}
      </li>
    </ul>

    <a-select
      class="sort"
      :value="sort.find((item) => item.isActive)"
      :options="sort"
      :bordered="false"
      @change="changeSort"
    />
  </div>
</template>

<script setup lang="ts">
// Vue
import { defineOptions } from "vue";
// Constants
import { PROJECT } from "@/constants/project";

defineOptions({ name: "FilterSort" });

const sort = ref(
  PROJECT.sort.map((item, index) => ({ ...item, isActive: index === 0 }))
);
const filter = ref(
  PROJECT.filter.map((item, index) => ({ ...item, isActive: index === 0 }))
);

const changeFilter = (filterValue: string) => {
  filter.value.forEach((item) => {
    item.isActive = item.value === filterValue;
  });
};

const changeSort = (sortValue: string) => {
  sort.value.forEach((item) => {
    item.isActive = item.value === sortValue;
  });
};
</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.filter-sort {
  width: 100%;
  padding: 0 16px;
  border: 1px solid var(--c-border);
  border-radius: var(--border-radius);
  @include flex($alignItems: center);

  .filter {
    list-style: none;
    @include flex($alignItems: center, $gap: 10px);

    .item {
      padding: 10px 0;
      font-size: 16px;
      color: var(--c-text-secondary);
      cursor: pointer;
      transition: color var(--transition);
      @include flex($alignItems: center, $gap: 8px);

      &::before {
        content: "";
        display: block;
        width: 0;
        height: 0;
        border-radius: 50%;
        background-color: var(--c-text);
        transition: width var(--transition), height var(--transition);
      }

      &--active {
        color: var(--c-text);

        &::before {
          width: 4px;
          height: 4px;
        }
      }
    }
  }

  :deep(.sort) {
    margin-left: auto;

    .ant-select-selector {
      padding: 0;

      .ant-select-selection-item {
        font-size: 16px;
        color: var(--c-text);
      }
    }

    .ant-select-arrow {
      right: 0;
      transform: translateY(2px);

      .ant-select-suffix svg {
        width: 16px;
        height: 16px;
      }
    }
  }

  /* Responsive */
  @media screen and (max-width: 860px) {
    flex-direction: column;
  }
}
</style>
