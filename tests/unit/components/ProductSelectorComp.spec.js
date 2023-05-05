import { mount } from '@vue/test-utils'
import { describe, expect, it, afterEach } from 'vitest'
import ProductSelectorComp from '../../../src/components/ProductSelectorComp.vue'
import { createPinia } from 'pinia'
import MockAdapter from 'axios-mock-adapter'
import api from '../../../src/utils/httputils'

const mock = new MockAdapter(api)
mock.onPost('/fridge/add').reply(200)
mock.onPost('/shopping-list/add').reply(200)
mock.onPut('/shopping-list/update').reply(200)
mock.onPost('/wished/add').reply(200)

afterEach(() => {
  mock.reset()
})
const pinia = createPinia()
const mockStore = {
  someGetter: 'mockValue'
}
const wrapper = mount(ProductSelectorComp, {
  global: {
    plugins: [pinia],
    mocks: {
      $pinia: pinia,
      $store: mockStore
    }
  },
  props: {
    buttonType: 'fridge'
  }
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
