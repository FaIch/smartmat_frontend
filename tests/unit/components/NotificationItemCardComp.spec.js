import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NotificationItemCardComp from '../../../src/components/NotificationItemCardComp.vue'

describe('NotificationItemCardComp', async () => {
  it('renders item name', () => {
    const product = {
      item: {
        name: 'Eple',
        weight: '100'
      },
      expirationDate: '2023-04-30',
      quantity: 1
    }

    const wrapper = mount(NotificationItemCardComp, {
      props: {
        product
      }
    })
    expect(wrapper.text()).toContain('Eple')
  })

  it('renders item expiration date and quantity', async () => {
    const product = {
      item: {
        name: 'Eple',
        weight: '100'
      },
      expirationDate: '2023-04-30',
      quantity: 500
    }

    const wrapper = mount(NotificationItemCardComp, {
      props: {
        product
      }
    })

    expect(wrapper.text()).toContain('2023-04-30')
    expect(wrapper.text()).toContain('500')
  })

  it('shows image when screen width is wider than 640 px', async () => {
    global.innerWidth = 650
    const product = {
      item: {
        name: 'Eple',
        weight: '100'
      },
      expirationDate: '2023-04-30',
      quantity: 500
    }

    const wrapper = mount(NotificationItemCardComp, {
      props: {
        product
      }
    })

    expect(wrapper.find('.card-image').exists()).toBe(true)
  })
})
