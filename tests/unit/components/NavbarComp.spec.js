import { mount } from '@vue/test-utils'
import { describe, expect, it, beforeEach } from 'vitest'
import NavbarComp from '../../../src/components/NavbarComp.vue'
import { createPinia } from 'pinia'

const pinia = createPinia()
const mockStore = {
  someGetter: 'mockValue'
}
let wrapper

beforeEach(() => {
  wrapper = mount(NavbarComp, {
    global: {
      plugins: [pinia],
      mocks: {
        $pinia: pinia,
        $store: mockStore
      },
      stubs: {
        RouterLink: true
      }
    }
  })
})

describe('NavbarComp form', async () => {
  it('Renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('Updates screen width on window resize', async () => {
    const screenWidthBefore = wrapper.vm.screenWidth
    expect(screenWidthBefore).toBe(window.innerWidth)

    window.dispatchEvent(new Event('resize'))

    const screenWidthAfter = wrapper.vm.screenWidth
    expect(screenWidthAfter).toBe(window.innerWidth)
  })
})
