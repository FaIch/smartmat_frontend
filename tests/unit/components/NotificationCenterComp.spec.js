import { mount } from '@vue/test-utils'
import { describe, expect, it, beforeEach } from 'vitest'
import NotificationCenterComp from '../../../src/components/NotificationCenterComp.vue'
import { createPinia } from 'pinia'

const pinia = createPinia()
const mockStore = {
  someGetter: 'mockValue'
}
let wrapper

beforeEach(() => {
  wrapper = mount(NotificationCenterComp, {
    global: {
      plugins: [pinia],
      mocks: {
        $pinia: pinia,
        $store: mockStore
      }
    }
  })
})

describe('NotificationCenterComp form', async () => {
  it('renders correctly', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('hides notification view by default', async () => {
    expect(wrapper.vm.showNotifications).toBe(false)
  })
})
