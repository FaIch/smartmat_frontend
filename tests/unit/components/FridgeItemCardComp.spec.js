import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FridgeItemCardComp from '../../../src/components/FridgeItemCardComp.vue'

describe('FridgeItemCardComp', () => {
  it('Has a name and weight', async () => {
    const product = {
      item: {
        name: 'Eple',
        weight: '100'
      },
      expirationDate: '2023-04-30',
      quantity: 1
    }

    const wrapper = mount(FridgeItemCardComp, {
      props: {
        product
      }
    })

    expect(wrapper.text()).toContain('Eple')
    expect(wrapper.text()).toContain('100')
  })
})
