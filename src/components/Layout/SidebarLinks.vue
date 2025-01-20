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

const { menuOpen } = useMenu()
</script>

<template>
  <template v-for="link in links" :key="link.title">
    <RouterLink
      v-if="link.to"
      exact-active-class="text-primary bg-muted"
      :to="link.to"
      class="nav-link"
      :class="{ 'justify-normal': menuOpen, 'justify-center': !menuOpen }"
    >
      <iconify-icon :icon="link.icon"></iconify-icon>
      <span class="hidden" :class="{ block: menuOpen, hidden: !menuOpen }">{{ link.title }}</span>
    </RouterLink>

    <div
      v-else
      class="cursor-pointer nav-link"
      :class="{ 'justify-normal': menuOpen, 'justify-center': !menuOpen }"
      @click="emitActionClicked(link.title)"
    >
      <iconify-icon :icon="link.icon"></iconify-icon>
      <span class="text-nowrap" :class="{ block: menuOpen, hidden: !menuOpen }">
        {{ link.title }}
      </span>
    </div>
  </template>
</template>

<style scoped>
.nav-link {
  @apply flex items-center gap-3 px-4 py-2 mx-2 transition-colors rounded-lg hover:text-primary text-muted-foreground;
}
</style>
