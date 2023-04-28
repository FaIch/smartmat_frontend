import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ShoppingListItemCardComp from '../../../src/components/ShoppingListItemCardComp.vue'

describe('ShoppingListItemCardComp form', async () => {
  it('Renders correctly', () => {
    const product = {
      item: {
        name: 'Eple',
        weight: '100'
      },
      expirationDate: '2023-04-30',
      quantity: 1
    }

    const wrapper = mount(ShoppingListItemCardComp, {
      props: {
        product
      }
    })
    expect(wrapper.exists()).toBe(true)
  })  
})
