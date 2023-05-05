import { shallowMount } from '@vue/test-utils'
import Wishlist from '../../../src/components/WishListComp.vue'
import { describe, expect, it, beforeEach, afterEach } from 'vitest'

import { createPinia } from 'pinia'

const pinia = createPinia()

describe('WishListComp.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Wishlist, {
      global: {
        plugins: [pinia]
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders correctly', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('toggles product selector', async () => {
    expect(wrapper.vm.showProductSelector).toBe(false)
    wrapper.vm.toggleProductSelector()
    expect(wrapper.vm.showProductSelector).toBe(true)
  })

  it('calls handleSelect and closes product selector', async () => {
    wrapper.vm.showProductSelector = true
    wrapper.vm.handleSelect()
    expect(wrapper.vm.showProductSelector).toBe(false)
  })

  it('updates checked status of a product', async () => {
    const product = { id: 1, item: { name: 'Milk' }, quantity: 1 }
    const selected = true

    expect(wrapper.vm.checkedProducts).toEqual({})

    wrapper.vm.updateCheckedStatus({ product, selected })

    expect(wrapper.vm.checkedProducts).toEqual({ 1: true })
  })
})
