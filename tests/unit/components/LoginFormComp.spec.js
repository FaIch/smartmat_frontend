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

    expect(updateMessage.text()).toEqual('Please fill out all fields.')
  })

  it('should show an error message if email field is invalid', async () => {
    const emailInput = wrapper.find('.input-box input[type="email"]')
    const passwordInput = wrapper.find('.input-box input[type="password"]')
    const updateMessage = wrapper.find('.update-message h4')

    await emailInput.setValue('invalidemail')
    await passwordInput.setValue('testpassword')
    await wrapper.find('.login-form form').trigger('submit')

    expect(updateMessage.text()).toEqual('Invalid email.')
  })

  it('should show an error message if email is too long', async () => {
    const emailInput = wrapper.find('.input-box input[type="email"]')
    const passwordInput = wrapper.find('.input-box input[type="password"]')
    const updateMessage = wrapper.find('.update-message h4')

    await emailInput.setValue('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com')
    await passwordInput.setValue('testpassword')
    await wrapper.find('.login-form form').trigger('submit')

    expect(updateMessage.text()).toEqual('Email is too long.')
  })

  it('should show an error message if password is too long', async () => {
    const emailInput = wrapper.find('.input-box input[type="email"]')
    const passwordInput = wrapper.find('.input-box input[type="password"]')
    const updateMessage = wrapper.find('.update-message h4')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('a'.repeat(201))
    await wrapper.find('.login-form form').trigger('submit')

    expect(updateMessage.text()).toEqual('Password is too long.')
  })

  it('should show an error message if password is too short', async () => {
    const emailInput = wrapper.find('.input-box input[type="email"]')
    const passwordInput = wrapper.find('.input-box input[type="password"]')
    const updateMessage = wrapper.find('.update-message h4')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('a'.repeat(3))
    await wrapper.find('.login-form form').trigger('submit')

    expect(updateMessage.text()).toEqual('Password must be at least 8 characters.')
  })
})
