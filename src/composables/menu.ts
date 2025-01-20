const menuOpen = ref(false)

export function useMenu() {
  function toggleMenu() {
    menuOpen.value = !menuOpen.value
  }

  return {
    menuOpen,
    toggleMenu,
  }
}
