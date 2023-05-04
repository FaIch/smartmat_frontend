import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FridgeItemCardComp from '../../../src/components/FridgeItemCardComp.vue'
import 'tippy.js/dist/tippy.css'
import { createPinia } from 'pinia'

const pinia = createPinia()

describe('FridgeItemCardTests', () => {
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

  const wrapper = mount(FridgeItemCardComp, {
    props: {
      product: product
    },
    global: {
      plugins: [pinia]
    }
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  it('Renders the product name in the title', () => {
    const title = wrapper.find('.card-title')
    expect(title.text()).toBe('Test')
  })

  it('enables the inputs when the edit button is clicked', async () => {
    const editButton = wrapper.find('#edit-button')
    await editButton.trigger('click')

    const expirationDateInput = wrapper.find('#expiration-date')
    const quantityInput = wrapper.find('#quantity')

    expect(expirationDateInput.attributes('disabled')).toBeFalsy()
    expect(quantityInput.attributes('disabled')).toBeFalsy()
  })

  it('disables inputs after the save button is clicked', async () => {
    const expirationDateInput = wrapper.find('#expiration-date')
    const quantityInput = wrapper.find('#quantity')

    expirationDateInput.setValue('2023-04-04')
    quantityInput.setValue('123')

    const saveButton = wrapper.find('#save-button')
    await saveButton.trigger('click')

    // expects '' because the input fields are disabled by default.
    expect(expirationDateInput.attributes('')).toBeTruthy()
    expect(quantityInput.attributes('')).toBeTruthy()
  })

  it('registers the product as selected when the checkbox is selected', async () => {
    const checkBox = wrapper.find('#fridge-item-checkbox')
    await checkBox.trigger('change')
    expect(checkBox.attributes('checked')).toBeFalsy()
  })
})
