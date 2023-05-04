import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RecipeCardComp from '../../../src/components/RecipeCardComp.vue'

describe('RecipeCardComp form', async () => {
  it('displays the name of the recipe', () => {
    const recipe = {
      recipe: {
        name: 'Test'
      },
      amountInFridge: 2,
      amountNearlyExpired: 2
    }

    const wrapper = mount(RecipeCardComp, {
      props: {
        recipe
      }
    })
    expect(wrapper.text()).toContain('Test')
  })

  it('displays the number of missing ingredients', async () => {
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
      amountNearlyExpired: 2
    }

    const wrapper = mount(RecipeCardComp, {
      props: {
        recipe
      }
    })

    const missingIngredients = wrapper.find('.recipe-missing')
    expect(missingIngredients.text()).toBe('Du mangler 3 ingredienser')
  })
})
