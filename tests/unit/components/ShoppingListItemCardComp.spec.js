import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ShoppingListItemCardComp from '../../../src/components/ShoppingListItemCardComp.vue'
import { createPinia } from 'pinia'
import VueTippy from 'vue-tippy'

const pinia = createPinia()
const product = {
  id: 1,
  item: {
    id: 1,
    name: 'Test',
    category: 'test',
    image: '../../../src/assets/capybara.jpg',
    unit: 'GRAMS',
    price: 50,
    shortDesc: 'desc',
    weightPerUnit: 100,
    baseAmount: 1
  },
  expirationDate: '2023-05-20',
  quantity: 50
}

const wrapper = mount(ShoppingListItemCardComp, {
  props: {
    product,
    onWishlist: true
  },
  global: {
    plugins: [pinia, VueTippy]
  }
})
describe('ShoppingListItemCardComp', async () => {
  it('renders the component', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  it('Renders the product name in the title', () => {
    const title = wrapper.find('.card-title')
    expect(title.text()).toBe('Test')
  })

  it('allows products to be selected', async () => {
    const checkBox = wrapper.find('#checkbox')
    await checkBox.trigger('change')
    expect(checkBox.attributes('checked')).toBeFalsy()
  })
})
