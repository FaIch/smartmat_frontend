import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FridgeItemCardComp from '../../../src/components/FridgeItemCardComp.vue'

describe('FridgeItemCardComp', () => {
  it('Has a name', async () => {
    const product = {
      item: {
        name: 'Eple'
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
  })
})
