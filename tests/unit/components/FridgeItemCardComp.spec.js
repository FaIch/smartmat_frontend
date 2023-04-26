import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FridgeItemCardComp from '../../../src/components/FridgeItemCardComp.vue'
import { createPinia } from 'pinia'

describe('FridgeItemCardComp', () => {
    it('Has a name and weight', async () => {
        const product = {
            item: {
                name: 'Eple',
                weight: '100',
            },
            expirationDate: '2023-04-30',
            quantity: 1,
        }

        const wrapper = mount(FridgeItemCardComp, {
            props: {
                product,
            },
        })

        expect(wrapper.text()).toContain('Eple')
        expect(wrapper.text()).toContain('100')

        //sjekk utløpsdato
        //sjekk kvantitet
    })
})

/*describe('FridgeItemCardComp functionality', () => {
    it('Can be chosen', async () => {
        
    })
    it('Can be edited', async () => {
        //sjekk at det kan redigeres
    })
}) */