import { mount } from '@vue/test-utils'
import { describe, expect, it, beforeEach } from 'vitest'
import SearchBarComp from '../../../src/components/SearchBarComp.vue'

let wrapper

beforeEach(() => {
  wrapper = mount(SearchBarComp, {
    props: {
      searchPlaceholder: 'Search...'
    }
  })
})

describe('SearchBarComp form', async () => {
  it('Renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
  })
})
