<template>
  <div class="container">
    <el-menu
      :default-active="$route.path"
      class="el-menu-demo"
      mode="horizontal"
      router
    >
      <template v-for="item in menu">
        <el-menu-item v-if="item.smallTitle === ''" :key="item.url" :index="item.url">
          {{ item.label }}
        </el-menu-item>
        <el-submenu v-if="item.smallTitle !== ''" :key="item.url" :index="item.url">
          <template #title>
            {{ item.label }}
          </template>
          <template v-for="item2 in item.smallTitle">
            <el-menu-item :key="item2.url" :index="item2.url">
              {{ item2.label }}
            </el-menu-item>
          </template>
        </el-submenu>
      </template>
    </el-menu>
    <slot :name="nowTag" class="notlink"></slot>
  </div>
</template>

<script>
export default {
  name: 'navMenu',
  props: {
    menu: Array,
    nowTag: String,
    nowSmallTag: String,
    slotone: Boolean,
  },
  methods: {
  },
};
</script>
