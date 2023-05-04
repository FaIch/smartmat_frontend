import { mount } from '@vue/test-utils'
import { describe, expect, it, beforeEach } from 'vitest'
import ProductGrid from '../../../src/components/ProductGrid.vue'
import { createPinia } from 'pinia'

const pinia = createPinia()
const mockStore = {
  someGetter: 'mockValue'
}
let wrapper

beforeEach(() => {
  wrapper = mount(ProductGrid, {
    global: {
      plugins: [pinia],
      mocks: {
        $pinia: pinia,
        $store: mockStore
      }
    }
  })
})

describe('ProductGrid form', async () => {
  it('renders correctly', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('displays products', async () => {
    expect(wrapper.findAll('.grid-item')).toHaveLength(wrapper.vm.displayedProducts.length)
  })

  it('displays the correct default page', async () => {
    const currPage = wrapper.find('span')
    expect(currPage.text()).toContain('Side 1')
  })

  it('allows selecting products', async () => {
    const product = wrapper.vm.displayedProducts[0]
    await wrapper.vm.toggleProductSelection(product)
    expect(wrapper.vm.selectedProducts).toContain(product)
    await wrapper.vm.toggleProductSelection(product)
    expect(wrapper.vm.selectedProducts).not.toContain(product)
  })
})
