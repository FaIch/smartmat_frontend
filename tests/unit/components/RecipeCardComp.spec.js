import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RecipeCardComp from '../../../src/components/RecipeCardComp.vue'
import VueTippy from 'vue-tippy'
import { createRouter, createMemoryHistory } from 'vue-router'

const recipe = {
  recipe: {
    id: 1,
    name: 'test',
    estimatedTime: '30 min',
    description: 'test',
    numberOfItems: 5,
    image: 'test.jpeg'
  },
  amountInFridge: 2,
  amountNearlyExpired: 1
}

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      component: { template: '<div>Home</div>' }
    }
  ]
})

const wrapper = mount(RecipeCardComp, {
  props: {
    recipe
  },
  global: {
    plugins: [router, VueTippy]
  }
})

describe('RecipeCardComp form', async () => {
  it('displays the name of the recipe', () => {
    expect(wrapper.text()).toContain('test')
  })

  it('displays the number of missing ingredients', async () => {
    const missingIngredients = wrapper.find('.recipe-missing')
    expect(missingIngredients.text()).toBe('Du mangler 3 ingredienser')
  })

  it('displays the amount of nearly expired ingredients', async () => {
    const nearlyExpired = wrapper.find('.recipe-warning')
    expect(nearlyExpired.text()).toBe('1')
  })
})
