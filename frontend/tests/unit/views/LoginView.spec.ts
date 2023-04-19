import { describe, it, expect, beforeEach } from 'vitest'
import LoginView from '../../../src/views/LoginView.vue'
import { mount } from '@vue/test-utils'
import { createPinia, Pinia } from 'pinia'

describe('MyComponent', () => {
  let pinia: Pinia

  beforeEach(() => {
    pinia = createPinia()
  })

  it('renders correctly', () => {
    const mockStore = {
      someGetter: 'mockValue'
    }

    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia],
        mocks: {
          $pinia: pinia,
          $store: mockStore
        }
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
