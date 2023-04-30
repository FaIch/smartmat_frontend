import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
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

describe('NotificationCenterComp', () => {
  it('renders correctly', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  /* it('is hidden by default', async () => {
        expect(wrapper.find('.notifications-popup').isVisible()).toBe(false)
    }) */

  /* it('shows the notifications when the notifiation-button is clicked', async () => {
        await wrapper.find('.notification-button').trigger('click')
        expect(wrapper.find('.notifications-popup').isVisible()).toBe(true)
    }) */
})
