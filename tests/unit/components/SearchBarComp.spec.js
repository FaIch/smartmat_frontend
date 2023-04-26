import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
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
      const input = wrapper.find('#search-input')
      expect(input.exists()).toBe(true)
    })

    it('Should emit a getQuery event when the search button is clicked', async () => {
      const input = wrapper.find('#search-input')
      const button = wrapper.find('#search-button')
      input.setValue('test query')
      await button.trigger('click')

      expect(wrapper.emitted().getQuery).toBeTruthy()
      expect(wrapper.emitted().getQuery[0]).toEqual(['test query'])
    })
})