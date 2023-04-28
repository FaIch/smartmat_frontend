import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FridgeItemCardComp from '../../../src/components/FridgeItemCardComp.vue'

describe('FridgeItemCardComp', () => {
  it('Renders the product name in the title', () => {
    const product = {
      item: {
        name: 'Test',
        unit: '300g',
        image: 'https://example.com/image.png'
      },
      expirationDate: '2023-05-01',
      quantity: 500
    }
    const wrapper = mount(FridgeItemCardComp, {
      props: { product }
    })
    const title = wrapper.find('.card-title')
    expect(title.text()).toBe('Test')
  })

  it('enables the inputs when the edit button is clicked', async () => {
    const product = {
      item: {
        name: 'Test',
        unit: '300',
        image: 'https://example.com/image.png'
      },
      expirationDate: '2023-05-01',
      quantity: 500
    }
    const wrapper = mount(FridgeItemCardComp, {
      props: { product }
    })

    const editButton = wrapper.find('#edit-button')
    await editButton.trigger('click')

    const expirationDateInput = wrapper.find('#expiration-date')
    const quantityInput = wrapper.find('#quantity')

    expect(expirationDateInput.attributes('disabled')).toBeFalsy()
    expect(quantityInput.attributes('disabled')).toBeFalsy()
  })

  it('disables inputs after the save button is clicked', async () => {
    const product = {
      item: {
        name: 'Test',
        unit: '300',
        image: 'https://example.com/image.png'
      },
      expirationDate: '2023-05-01',
      quantity: 500
    }
    const wrapper = mount(FridgeItemCardComp, {
      props: { product }
    })

    const editButton = wrapper.find('#edit-button')
    await editButton.trigger('click')
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
    const product = {
      item: {
        name: 'Test',
        unit: '300',
        image: 'https://example.com/image.png'
      },
      expirationDate: '2023-05-01',
      quantity: 500
    }
    const wrapper = mount(FridgeItemCardComp, {
      props: { product }
    })

    const checkBox = wrapper.find('#fridge-item-checkbox')
    await checkBox.trigger('change')
    expect(checkBox.attributes('false')).toBeFalsy()
  })
})
