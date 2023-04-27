import { mount } from '@vue/test-utils'
import { describe, expect, it, beforeEach } from 'vitest'
import SearchBarComp from '../../../src/components/SearchBarComp.vue'
import { createPinia } from 'pinia'

const pinia = createPinia()
const mockStore = {
  someGetter: 'mockValue'
}
let wrapper

beforeEach(() => {
  wrapper = mount(SearchBarComp, {
    global: {
      plugins: [pinia],
      mocks: {
        $pinia: pinia,
        $store: mockStore
      }
    }
  })
})

describe('SearchBarComp form', async () => {
  it('Renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
  })
})

describe('SearchBarComp functionality', async () => {
  it('Should render a search input', () => {
    const input = wrapper.find('.search-bar input[type="text"]')
    expect(input.exists()).toBe(true)
  })
})
