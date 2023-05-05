import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SignUpFormComp from '../../../src/components/SignUpFormComp.vue'

describe('Signup form validation', () => {
  const wrapper = mount(SignUpFormComp)
  it('should render confirmpassword input', async () => {
    const confirmPasswordInput = wrapper.find('input[placeholder="Bekreft passord..."]')
    await confirmPasswordInput.setValue('Test')
    expect(confirmPasswordInput.element.value).toEqual('Test')
  })

  it('should show an error message if email field is empty', async () => {
    const emailInput = wrapper.find('input[placeholder="E-post..."]')
    const passwordInput = wrapper.find('input[placeholder="Passord..."]')
    const confirmPasswordInput = wrapper.find('input[placeholder="Bekreft passord..."]')
    const update = wrapper.find('.update-message h4')

    await emailInput.setValue('')
    await passwordInput.setValue('testpassword')
    await confirmPasswordInput.setValue('testpassword')
    await wrapper.find('.signup-form form').trigger('submit')

    expect(update.text()).to.equal('Vennligst fyll alle felt.')
  })

  it('should show an error message if email field is invalid', async () => {
    const emailInput = wrapper.find('input[placeholder="E-post..."]')
    const passwordInput = wrapper.find('input[placeholder="Passord..."]')
    const confirmPasswordInput = wrapper.find('input[placeholder="Bekreft passord..."]')
    const update = wrapper.find('.update-message h4')

    await emailInput.setValue('invalidemail')
    await passwordInput.setValue('testpassword')
    await confirmPasswordInput.setValue('testpassword')
    await wrapper.find('.signup-form form').trigger('submit')

    expect(update.text()).to.equal('Ugyldig e-post.')
  })

  it('should show an error message if email is too long', async () => {
    const emailInput = wrapper.find('input[placeholder="E-post..."]')
    const passwordInput = wrapper.find('input[placeholder="Passord..."]')
    const confirmPasswordInput = wrapper.find('input[placeholder="Bekreft passord..."]')
    const update = wrapper.find('.update-message h4')

    await emailInput.setValue('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com')
    await passwordInput.setValue('testpassword')
    await confirmPasswordInput.setValue('testpassword')
    await wrapper.find('.signup-form form').trigger('submit')

    expect(update.text()).to.equal('E-post er for lang.')
  })

  it('should show an error message if passwords are not the same', async () => {
    const emailInput = wrapper.find('input[placeholder="E-post..."]')
    const passwordInput = wrapper.find('input[placeholder="Passord..."]')
    const confirmPasswordInput = wrapper.find('input[placeholder="Bekreft passord..."]')
    const update = wrapper.find('.update-message h4')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('testpassword1')
    await confirmPasswordInput.setValue('testpassword2')
    await wrapper.find('.signup-form form').trigger('submit')

    expect(update.text()).to.equal('Passordene er ikke like.')
  })

  it('should show an error message if password is too long', async () => {
    const emailInput = wrapper.find('input[placeholder="E-post..."]')
    const passwordInput = wrapper.find('input[placeholder="Passord..."]')
    const confirmPasswordInput = wrapper.find('input[placeholder="Bekreft passord..."]')
    const update = wrapper.find('.update-message h4')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('a'.repeat(201))
    await confirmPasswordInput.setValue('a'.repeat(201))
    await wrapper.find('.signup-form form').trigger('submit')

    expect(update.text()).to.equal('Passord er for lang.')
  })

  it('should show an error message if password is too short', async () => {
    const emailInput = wrapper.find('input[placeholder="E-post..."]')
    const passwordInput = wrapper.find('input[placeholder="Passord..."]')
    const confirmPasswordInput = wrapper.find('input[placeholder="Bekreft passord..."]')
    const update = wrapper.find('.update-message h4')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('a'.repeat(2))
    await confirmPasswordInput.setValue('a'.repeat(2))
    await wrapper.find('.signup-form form').trigger('submit')

    expect(update.text()).to.equal('Passord må være minst 8 karakterer langt.')
  })
})
