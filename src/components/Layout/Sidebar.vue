<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import SidebarLinks from '@/components/Layout/SidebarLinks.vue'

const links = [
  {
    title: 'Dashboard',
    to: '/',
    icon: 'lucide:house',
  },
  {
    title: 'Projects',
    to: '/projects',
    icon: 'lucide:building-2',
  },
  {
    title: 'My Tasks',
    to: '/tasks',
    icon: 'lucide:badge-check',
  },
]

const accountLinks = [
  {
    title: 'Profile',
    to: '/profile',
    icon: 'lucide:user',
  },
  {
    title: 'Settings',
    to: '/settings',
    icon: 'lucide:settings',
  },
  {
    title: 'Sign Out',
    to: '/signout',
    icon: 'lucide:log-out',
  },
]
</script>

<template>
  <aside
    class="flex flex-col h-screen gap-2 border-r fixed bg-muted/40 lg:w-52 w-16 transition-[width]"
  >
    <div class="flex items-center justify-between h-16 gap-1 px-2 border-b lg:px-4 shrink-0">
      <Button variant="outline" size="icon" class="size-8">
        <iconify-icon icon="lucide:menu"></iconify-icon>
      </Button>

      <Button variant="outline" size="icon" class="size-8">
        <iconify-icon icon="lucide:plus"></iconify-icon>
      </Button>
    </div>

    <nav class="relative flex flex-col justify-between h-full gap-2">
      <div>
        <SidebarLinks :links="links" />
      </div>

      <div class="py-3 text-center border-y bg-background">
        <SidebarLinks :links="accountLinks" />
      </div>
    </nav>
  </aside>
</template>
