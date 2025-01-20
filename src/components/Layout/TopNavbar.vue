<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'

const { profile } = storeToRefs(useAuthStore())

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <nav class="flex items-center justify-between h-16 px-6 border-b bg-muted/40">
    <form class="relative w-full h-fit max-w-96">
      <iconify-icon
        class="absolute top-[50%] translate-y-[-50%] left-2.5 text-muted-foreground"
        icon="lucide:search"
      ></iconify-icon>
      <Input class="w-full pl-8 bg-background" type="text" placeholder="Search..." />
    </form>
    <div class="flex items-center justify-center gap-1">
      <Button @click="toggleDark()" class="size-8">
        <Transition name="scale" mode="out-in">
          <iconify-icon v-if="isDark" icon="lucide:sun" />
          <iconify-icon v-else icon="lucide:moon" />
        </Transition>
      </Button>
      <div class="w-8">
        <DropdownMenu v-if="profile">
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                :src="profile.avatar_url || ''"
                :alt="`${profile.full_name} profile picture`"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <RouterLink
                :to="{
                  name: '/users/[username]',
                  params: { username: profile.username },
                }"
                class="w-full h-full"
              >
                Profile
              </RouterLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </nav>
</template>
