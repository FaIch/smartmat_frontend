import { mount } from '@vue/test-utils'
import { describe, expect, it, beforeEach } from 'vitest'
import ProductSelectorComp from '../../../src/components/ProductSelectorComp.vue'
import { createPinia } from 'pinia'

const pinia = createPinia()
const mockStore = {
  someGetter: 'mockValue'
}
let wrapper

beforeEach(() => {
  wrapper = mount(ProductSelectorComp, {
    global: {
      plugins: [pinia],
      mocks: {
        $pinia: pinia,
        $store: mockStore
      }
    }
  })
})

describe('ProductSelectorComp form', async () => {
  it('renders correctly', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('has 0 selected products by default', async () => {
    const selectedProducts = wrapper.find('h2')
    expect(selectedProducts.text()).toBe('Valgte (0)')
  })
})
