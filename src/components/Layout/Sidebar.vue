<script lang="ts" setup>
const { profile } = storeToRefs(useAuthStore())

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
    to: `/user/${profile.value?.username}`,
    icon: 'lucide:user',
  },
  {
    title: 'Sign Out',
    icon: 'lucide:log-out',
  },
]

const router = useRouter()

defineEmits(['task-clicked'])

async function executeAction(linkTitle: string) {
  if (linkTitle === 'Sign Out') {
    const { logout } = await import('@/utils/supaAuth')
    const isLoggedOut = await logout()

    if (isLoggedOut) {
      router.replace('/login')
    }
  }
}
</script>

<template>
  <aside
    class="flex flex-col h-screen gap-2 border-r fixed bg-muted/40 lg:w-52 w-16 transition-[width]"
  >
    <div class="flex items-center justify-between h-16 gap-1 px-2 border-b lg:px-4 shrink-0">
      <Button variant="outline" size="icon" class="size-8">
        <iconify-icon icon="lucide:menu"></iconify-icon>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" size="icon" class="size-8">
            <iconify-icon icon="lucide:plus"></iconify-icon>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem @click="$emit('task-clicked')"> Task </DropdownMenuItem>
          <DropdownMenuItem>Project</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <nav class="relative flex flex-col justify-between h-full gap-2">
      <div>
        <SidebarLinks :links="links" />
      </div>

      <div class="py-3 text-center border-y bg-background">
        <SidebarLinks :links="accountLinks" @action-clicked="executeAction" />
      </div>
    </nav>
  </aside>
</template>
