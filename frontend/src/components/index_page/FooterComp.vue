<template>
  <footer class="footer">
    <div class="itisit-container top">
      <div class="left">
        <div class="logo">
          <img src="/image/logo.png" alt="Mingle Flow" />
          <span>Mingle Flow</span>
        </div>
        <span>Ұйымның әр минутын үнемдеу</span>
      </div>

      <div class="right">
        <ul
          v-for="(footerEl, index) in footerElements"
          :key="index"
          class="list"
        >
          <li class="item title">{{ footerEl.name }}</li>
          <li v-for="(link, index) in footerEl.links" :key="index" class="item">
            {{ link.name }}
          </li>
        </ul>
      </div>
    </div>

    <div class="bottom">
      <p class="cr">
        Copyright © {{ currentYear }} Mingle Flow All Rights Reserved
      </p>
      <p class="cr">Powered by IT IS IT</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Vue
import { defineOptions } from "vue";

defineOptions({ name: "FooterComp" });

const footerElements = [
  {
    name: "Өнім",
    links: [
      { name: "Жаңарту журналы" },
      { name: "Көмек орталығы" },
      { name: "Бастау қадам" },
      { name: "Blog" },
    ],
  },
  {
    name: "Туралы",
    links: [{ name: "FAQ" }, { name: "Хабарласу" }, { name: "Қосылу" }],
  },
  {
    name: "Ресурс",
    links: [
      { name: "API Документ" },
      { name: "Github Repo" },
      { name: "API Документ" },
      { name: "Github Repo" },
    ],
  },
];

const currentYear = new Date().getFullYear();
</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.footer {
  margin-top: 80px;
  background: rgb(12, 18, 48);

  .top {
    padding-top: 80px;
    padding-bottom: 80px;
    @include flex($justifyContent: space-between);

    .left {
      @include flex($direction: column, $gap: 16px);

      .logo {
        @include flex($alignItems: center, $gap: 8px);

        img {
          width: 34px;
          height: 34px;
          object-fit: cover;
        }

        span {
          font-weight: 500;
          color: #eee;
        }
      }

      span {
        font-weight: 300;
        font-size: 14px;
        color: rgb(203, 208, 234);
      }
    }

    .right {
      @include flex($gap: 56px);

      .list {
        list-style: none;
        @include flex($direction: column, $gap: 24px);

        .item {
          font-weight: 300;
          font-size: 14px;
          color: rgb(127, 133, 163);
          transition: color var(--transition);
          cursor: pointer;

          &:hover {
            color: rgb(128, 102, 255);
          }
        }

        .title {
          color: rgb(128, 102, 255);
        }
      }
    }
  }

  .bottom {
    padding: 32px 0;
    border-top: 1px solid rgb(29, 36, 71);
    text-align: center;
    @include flex($direction: column, $alignItems: center, $gap: 8px);

    .cr {
      font-weight: 300;
      font-size: 14px;
      color: rgb(70, 78, 111);
    }
  }

  /* Responsive */
  @media screen and (max-width: 768px) {
    .top {
      flex-direction: column;
      gap: 40px;

      .right {
        flex-direction: column;
        gap: 32px;
      }
    }
  }

  @media screen and (max-width: 576px) {
    margin-top: 48px;

    .top {
      padding-top: 40px;
      padding-bottom: 40px;
    }

    .bottom {
      padding: 32px 16px;
    }
  }
}
</style>
