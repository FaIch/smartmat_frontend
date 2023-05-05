import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NotificationItemCardComp from '../../../src/components/NotificationItemCardComp.vue'
import { createRouter, createMemoryHistory } from 'vue-router'

const DummyComponent = {
  template: '<div></div>'
}

const product = {
  item: {
    name: 'Eple',
    weight: '100'
  },
  expirationDate: '2023-04-30',
  quantity: 1
}

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/fridge', name: 'fridge' },
    { path: '/:catchAll(.*)', component: DummyComponent }
  ]
})
const wrapper = mount(NotificationItemCardComp, {
  global: {
    plugins: [router]
  },
  props: {
    product
  }
})

describe('NotificationItemCardComp', async () => {
  it('renders item name', () => {
    expect(wrapper.text()).toContain('Eple')
  })

  it('renders item expiration date and quantity', async () => {
    expect(wrapper.text()).toContain('2023-04-30')
    expect(wrapper.text()).toContain('1')
  })

  it('shows image when screen width is wider than 640 px', async () => {
    global.innerWidth = 650

    expect(wrapper.find('.card-image').exists()).toBe(true)
  })
})
