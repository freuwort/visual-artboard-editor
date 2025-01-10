<template>
    <div>c:</div>
</template>

<script lang="ts" setup>
    import { ref, onMounted } from 'vue'

    const props = defineProps({
        content: {
            required: true,
            type: Object,
        },
        width: {
            required: true,
            type: Number,
        },
        height: {
            required: true,
            type: Number,
        },
    })

    const content = ref<any[]>([])

    const utils = {
        uuid(): string {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = (Math.random() * 16) | 0
                const v = c === 'x' ? r : (r & 0x3) | 0x8
                return v.toString(16)
            })
        },
        newElement(type?: string): Object {
            return {
                elementId: this.uuid(),
                elementName: 'Element',
                elementType: type || 'div',
                position: 'fixed',
                zIndex: 1,
                top: '0px',
                left: '0px',
                width: '100%',
                height: '100%',
            }
        },
    }

    const validators = {
        int(value: any, min?: Number, max?: Number): Number {
            try {
                value = parseInt(value)
                if (min && value < min) throw new Error('Value too small')
                if (max && value > max) throw new Error('Value too big')
                return value
            } catch (error) {
                throw error
            }
        },
        float(value: any, min?: Number, max?: Number): Number {
            try {
                value = parseFloat(value)
                if (min && value < min) throw new Error('Value too small')
                if (max && value > max) throw new Error('Value too big')
                return value
            } catch (error) {
                throw error
            }
        },
        string(value: any, min?: Number, max?: Number): string {
            try {
                value = String(value)
                if (min && value.length < min) throw new Error('String too short')
                if (max && value.length > max) throw new Error('String too long')
                return value
            }
            catch (error) {
                throw error
            }
        },
        uuid(value: any): string {
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            if (typeof value === 'string' && uuidRegex.test(value)) return value
            throw new Error('Invalid UUID')
        },
        enum(value: any, values: any[]): any {
            if (values.includes(value)) return value
            throw new Error('Invalid value')
        },
        unit(value: any): string {
            try {
                value = String(value)
                const match = value.match(/^\s*(\d+(\.\d+)?)(px|em|rem|%|vh|vw|vmin|vmax)?\s*$/i)
                if (!match) throw new Error('Invalid unit value')
                let [_, numericPart, decimalPart, unit] = match
                if (!unit) throw new Error('Invalid unit value')
                return `${numericPart}${decimalPart || ''}${unit}`
            } catch (error) {
                throw new Error(`Invalid unit value: ${value}`)
            }
        },
    }

    const elementPropConfig = {
        // Required
        elementId: {
            type: 'systemProp',
            required: true,
            validator: validators.string,
            parameters: [],
            default(){ return utils.uuid() },
        },
        elementName: {
            type: 'systemProp',
            required: true,
            validator: validators.string,
            parameters: [],
            default(){ return 'Element' },
        },
        elementType: {
            type: 'systemProp',
            required: true,
            validator: validators.enum,
            parameters: [['div', 'span']],
            default(){ return 'div' },
        },
        position: {
            type: 'styleProp',
            required: true,
            validator: validators.enum,
            parameters: [['fixed', 'absolute']],
            default(){ return 'fixed' },
        },
        zIndex: {
            type: 'styleProp',
            required: true,
            validator: validators.int,
            parameters: [],
            default(){ return 1 },
        },
        top: {
            type: 'styleProp',
            required: true,
            validator: validators.unit,
            parameters: [],
            default(){ return '0px' },
        },
        left: {
            type: 'styleProp',
            required: true,
            validator: validators.unit,
            parameters: [],
            default(){ return '0px' },
        },
        width: {
            type: 'styleProp',
            required: true,
            validator: validators.unit,
            parameters: [],
            default(){ return '100px' },
        },
        height: {
            type: 'styleProp',
            required: true,
            validator: validators.unit,
            parameters: [],
            default(){ return '100px' },
        },

        // Optional
        innerText: {
            type: 'styleProp',
            required: false,
            validator: validators.string,
            parameters: [],
            default(){ return '' },
        },
        backgroundColor: {
            type: 'styleProp',
            required: false,
            validator: validators.string,
            parameters: [],
            default(){ return 'transparent' },
        },
        backgroundImage: {
            type: 'styleProp',
            required: false,
            validator: validators.string,
            parameters: [],
            default(){ return '' },
        },
        backgroundSize: {
            type: 'styleProp',
            required: false,
            validator: validators.string,
            parameters: [],
            default(){ return '' },
        },
        backgroundPosition: {
            type: 'styleProp',
            required: false,
            validator: validators.string,
            parameters: [],
            default(){ return '' },
        },
        backgroundRepeat: {
            type: 'styleProp',
            required: false,
            validator: validators.enum,
            parameters: [['repeat', 'repeat-x', 'repeat-y', 'no-repeat']],
            default(){ return 'repeat' },
        },
        color: {
            type: 'styleProp',
            required: false,
            validator: validators.string,
            parameters: [],
            default(){ return 'black' },
        },
        fontSize: {
            type: 'styleProp',
            required: false,
            validator: validators.unit,
            parameters: [],
            default(){ return '16px' },
        },
        fontFamily: {
            type: 'styleProp',
            required: false,
            validator: validators.string,
            parameters: [],
            default(){ return 'Arial, sans-serif' },
        },
        fontWeight: {
            type: 'styleProp',
            required: false,
            validator: validators.string,
            parameters: [],
            default(){ return '400' },
        },
        textAlign: {
            type: 'styleProp',
            required: false,
            validator: validators.enum,
            parameters: [['left', 'center', 'right', 'justify']],
            default(){ return 'left' },
        },
    }

    function ingest(c: any[]) {
        try {
            content.value = c.map(element => ingestElement(element))
        }
        catch (error) {
            throw error
        }
    }

    function ingestElement(element: any) {
        try {
            let result = {}
            const requiredProps = Object.keys(elementPropConfig).filter(prop => elementPropConfig[prop].required === true)

            for (const prop of requiredProps) {
                let config = elementPropConfig[prop]
                if (!config) continue
            }
        }
        catch (error) {
            throw error
        }
    }

    onMounted(() => {
        // get array of all parser props that are required
        const requiredParserProps = Object.keys(elementPropConfig).filter(key => elementPropConfig[key].required === true)
        
        console.log(requiredParserProps)
    })
</script>

<style lang="sass" scoped>
</style>