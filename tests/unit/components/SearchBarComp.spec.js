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

  it('Can perform a search', async () => {
    const inputField = wrapper.find('#search-input')
    await inputField.setValue('Test')

    const searchButton = wrapper.find('#search-button')
    await searchButton.trigger('click')

    expect(inputField.element.value).toBe('Test')
  })
})
