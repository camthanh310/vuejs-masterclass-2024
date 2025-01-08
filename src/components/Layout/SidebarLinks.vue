<script lang="ts" setup>
interface LinkProp {
  title: string
  to?: string
  icon: string
}

defineProps<{ links: LinkProp[] }>()

const emit = defineEmits<{
  'action-clicked': [string]
}>()

function emitActionClicked(linkTitle: string) {
  emit('action-clicked', linkTitle)
}
</script>

<template>
  <template v-for="link in links" :key="link.title">
    <RouterLink
      v-if="link.to"
      exact-active-class="text-primary bg-muted"
      :to="link.to"
      class="nav-link"
    >
      <iconify-icon :icon="link.icon"></iconify-icon>
      <span class="hidden lg:block text-nowrap">{{ link.title }}</span>
    </RouterLink>

    <div v-else class="cursor-pointer nav-link" @click="emitActionClicked(link.title)">
      <iconify-icon :icon="link.icon"></iconify-icon>
      <span class="hidden lg:block text-nowrap">{{ link.title }}</span>
    </div>
  </template>
</template>

<style scoped>
.nav-link {
  @apply flex items-center justify-center gap-3 px-4 py-2 mx-2 transition-colors rounded-lg hover:text-primary lg:justify-normal text-muted-foreground;
}
</style>
