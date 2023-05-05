import { mount } from '@vue/test-utils'
import { describe, expect, it, beforeEach } from 'vitest'
import NavbarComp from '../../../src/components/NavbarComp.vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { Role } from '../../../src/components/types.ts'
import { defineComponent } from 'vue'

const pinia = createPinia()
const mockStore = {
  someGetter: 'mockValue',
  role: Role.PARENT
}
const DummyComponent = defineComponent({})

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', redirect: '/savings' },
    { path: '/savings', name: 'savings', component: DummyComponent },
    { path: '/recipes', name: 'recipes' },
    { path: '/weekMenu', name: 'weekMenu' },
    { path: '/shoppinglist', name: 'shoppinglist' },
    { path: '/fridge', name: 'fridge' },
    { path: '/profile', name: 'profile' },
    { path: '/login', name: 'login' }
  ]
})

const wrapper = mount(NavbarComp, {
  global: {
    plugins: [pinia, router],
    provide: {
      userStore: () => mockStore
    },
    stubs: {
      'router-link': true,
      'router-view': true
    }
  }
})

beforeEach(async () => {
  router.push('/')
  await router.isReady()
})

describe('NavbarComp form', async () => {
  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the logo', () => {
    expect(wrapper.find('.logo').exists()).toBe(true)
  })

  it('does not render the hamburger menu when showHamburgerMenu is false', async () => {
    await wrapper.setValue({ showHamburgerMenu: false })
    expect(wrapper.find('.menu-button').exists()).toBe(false)
  })
})
