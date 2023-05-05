import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginFormComp from '../../../src/components/LoginFormComp.vue'
import { createPinia } from 'pinia'

const pinia = createPinia()
const mockStore = {
  someGetter: 'mockValue'
}
let wrapper

beforeEach(() => {
  wrapper = mount(LoginFormComp, {
    global: {
      plugins: [pinia],
      mocks: {
        $pinia: pinia,
        $store: mockStore
      }
    }
  })
})

describe('Login form validation', () => {
  it('renders correctly', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('can write into email input', async () => {
    const emailInput = wrapper.find('.input-box input[type="email"]')
    await emailInput.setValue('Test')
    expect(emailInput.element.value).toEqual('Test')
  })

  it('should show an error message if email field is empty', async () => {
    const emailInput = wrapper.find('.input-box input[type="email"]')
    const passwordInput = wrapper.find('.input-box input[type="password"]')
    const updateMessage = wrapper.find('.update-message h4')

    await emailInput.setValue('')
    await passwordInput.setValue('testpassword')
    await wrapper.find('.login-form form').trigger('submit')

    expect(updateMessage.text()).toEqual('Vennligst fyll alle felt.')
  })

  it('should show an error message if email field is invalid', async () => {
    const emailInput = wrapper.find('.input-box input[type="email"]')
    const passwordInput = wrapper.find('.input-box input[type="password"]')
    const updateMessage = wrapper.find('.update-message h4')

    await emailInput.setValue('invalidemail')
    await passwordInput.setValue('testpassword')
    await wrapper.find('.login-form form').trigger('submit')

    expect(updateMessage.text()).toEqual('Ugyldig e-post.')
  })

  it('should show an error message if email is too long', async () => {
    const emailInput = wrapper.find('.input-box input[type="email"]')
    const passwordInput = wrapper.find('.input-box input[type="password"]')
    const updateMessage = wrapper.find('.update-message h4')

    await emailInput.setValue('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com')
    await passwordInput.setValue('testpassword')
    await wrapper.find('.login-form form').trigger('submit')

    expect(updateMessage.text()).toEqual('E-post er for lang.')
  })

  it('should show an error message if password is too long', async () => {
    const emailInput = wrapper.find('.input-box input[type="email"]')
    const passwordInput = wrapper.find('.input-box input[type="password"]')
    const updateMessage = wrapper.find('.update-message h4')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('a'.repeat(201))
    await wrapper.find('.login-form form').trigger('submit')

    expect(updateMessage.text()).toEqual('Passord er for lang.')
  })

  it('should show an error message if password is too short', async () => {
    const emailInput = wrapper.find('.input-box input[type="email"]')
    const passwordInput = wrapper.find('.input-box input[type="password"]')
    const updateMessage = wrapper.find('.update-message h4')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('a'.repeat(3))
    await wrapper.find('.login-form form').trigger('submit')

    expect(updateMessage.text()).toEqual('Passord må være minst 8 karakterer langt.')
  })
})
