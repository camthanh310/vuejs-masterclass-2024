<script lang="ts" setup>
const errorStore = useErrorStore()

onErrorCaptured((error) => {
  errorStore.setError({ error })
})

onMounted(() => {
  useAuthStore().trackAuthChanges()
})

const { user } = storeToRefs(useAuthStore())

const AuthLayout = defineAsyncComponent(() => import('@/components/Layout/main/AuthLayout.vue'))

const GuestLayout = defineAsyncComponent(() => import('@/components/Layout/main/GuestLayout.vue'))
</script>

<template>
  <Transition name="fade" mode="out-in">
    <Component :is="user ? AuthLayout : GuestLayout">
      <AppErrorPage v-if="errorStore.activeError" />
      <RouterView v-slot="{ Component, route }">
        <Suspense v-if="Component" :timeout="0">
          <Component :is="Component" :key="route.name" />
          <template #fallback>
            <span>Loading...</span>
          </template>
        </Suspense>
      </RouterView>
    </Component>
  </Transition>
</template>
