import { describe, it, expect, beforeEach } from 'vitest'
import LoginView from '../../../src/views/LoginView.vue'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'

const pinia = createPinia()
const mockStore = {
  someGetter: 'mockValue'
}
let wrapper

beforeEach(() => {
  wrapper = mount(LoginView, {
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

  it('can write into login input', async () => {
    const emailInput = wrapper.find('.login input[type="text"]')
    await emailInput.setValue('Test')
    expect(emailInput.element.value).toEqual('Test')
  })

  it('should show an error message if email field is empty', async () => {
    const emailInput = wrapper.find('.login input[type="text"]')
    const passwordInput = wrapper.find('.login input[type="password"]')
    const update = wrapper.find('.update')

    await emailInput.setValue('')
    await passwordInput.setValue('testpassword')
    await wrapper.find('.login form').trigger('submit')

    expect(update.text()).to.equal('Please fill out all fields.')
  })

  it('should show an error message if email field is invalid', async () => {
    const emailInput = wrapper.find('.login input[type="text"]')
    const passwordInput = wrapper.find('.login input[type="password"]')
    const update = wrapper.find('.update')

    await emailInput.setValue('invalidemail')
    await passwordInput.setValue('testpassword')
    await wrapper.find('.login form').trigger('submit')

    expect(update.text()).to.equal('Invalid email.')
  })

  it('should show an error message if email is too long', async () => {
    const emailInput = wrapper.find('.login input[type="text"]')
    const passwordInput = wrapper.find('.login input[type="password"]')
    const update = wrapper.find('.update')

    await emailInput.setValue('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com')
    await passwordInput.setValue('testpassword')
    await wrapper.find('.login form').trigger('submit')

    expect(update.text()).to.equal('Email is too long.')
  })

  it('should show an error message if password is too long', async () => {
    const emailInput = wrapper.find('.login input[type="text"]')
    const passwordInput = wrapper.find('.login input[type="password"]')
    const update = wrapper.find('.update')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('a'.repeat(201))
    await wrapper.find('.login form').trigger('submit')

    expect(update.text()).to.equal('Password is too long.')
  })
})

describe('Signup form validation', () => {
  it('should render confirmpassword input', async () => {
    const confirmPasswordInput = wrapper.find('#password2')
    await confirmPasswordInput.setValue('Test')
    expect(confirmPasswordInput.element.value).toEqual('Test')
  })

  it('should show an error message if email field is empty', async () => {
    const emailInput = wrapper.find('#signup1')
    const passwordInput = wrapper.find('#password1')
    const confirmPasswordInput = wrapper.find('#password2')
    const update = wrapper.find('.update')

    await emailInput.setValue('')
    await passwordInput.setValue('testpassword')
    await confirmPasswordInput.setValue('testpassword')
    await wrapper.find('.signup form').trigger('submit')

    expect(update.text()).to.equal('Please fill out all fields.')
  })

  it('should show an error message if email field is invalid', async () => {
    const emailInput = wrapper.find('#signup1')
    const passwordInput = wrapper.find('#password1')
    const confirmPasswordInput = wrapper.find('#password2')
    const update = wrapper.find('.update')

    await emailInput.setValue('invalidemail')
    await passwordInput.setValue('testpassword')
    await confirmPasswordInput.setValue('testpassword')
    await wrapper.find('.signup form').trigger('submit')

    expect(update.text()).to.equal('Invalid email.')
  })

  it('should show an error message if email is too long', async () => {
    const emailInput = wrapper.find('.signup input[type="text"]')
    const passwordInput = wrapper.find('#password1')
    const confirmPasswordInput = wrapper.find('#password2')
    const update = wrapper.find('.update')

    await emailInput.setValue('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com')
    await passwordInput.setValue('testpassword')
    await confirmPasswordInput.setValue('testpassword')
    await wrapper.find('.signup form').trigger('submit')

    expect(update.text()).to.equal('Email is too long.')
  })
  it('should show an error message if password are not the same', async () => {
    const emailInput = wrapper.find('.signup input[type="text"]')
    const passwordInput = wrapper.find('#password1')
    const confirmPasswordInput = wrapper.find('#password2')
    const update = wrapper.find('.update')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('testpassword1')
    await confirmPasswordInput.setValue('testpassword2')
    await wrapper.find('.signup form').trigger('submit')

    expect(update.text()).to.equal('Passwords are not the same.')
  })
  it('should show an error message if password is too long', async () => {
    const emailInput = wrapper.find('.signup input[type="text"]')
    const passwordInput = wrapper.find('#password1')
    const confirmPasswordInput = wrapper.find('#password2')
    const update = wrapper.find('.update')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('a'.repeat(201))
    await confirmPasswordInput.setValue('a'.repeat(201))
    await wrapper.find('.signup form').trigger('submit')

    expect(update.text()).to.equal('Password is too long.')
  })

  it('should show an error message if password is too short', async () => {
    const emailInput = wrapper.find('.signup input[type="text"]')
    const passwordInput = wrapper.find('#password1')
    const confirmPasswordInput = wrapper.find('#password2')
    const update = wrapper.find('.update')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('a'.repeat(2))
    await confirmPasswordInput.setValue('a'.repeat(2))
    await wrapper.find('.signup form').trigger('submit')

    expect(update.text()).to.equal('Password is too short.')
  })
})
