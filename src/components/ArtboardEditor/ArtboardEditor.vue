<template>
    <div>
        <pre v-html="JSON.stringify(content, null, 2)"></pre>
    </div>
</template>

<script lang="ts" setup>
    import { ref, watch, type PropType } from 'vue'

    type StringKeyObject = {
        [key: string|number]: any
        slot?: any
        [key: `slot_${string}`]: StringKeyObject[] | undefined
    }



    const props = defineProps({
        content: {
            required: true,
            type: Array as PropType<any[]>,
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

    const elementPropConfig: StringKeyObject = {
        // Required
        elementId: {
            type: 'identifier',
            required: true,
            validator: validators.uuid,
            parameters: [],
            default(){ return utils.uuid() },
        },
        elementName: {
            type: 'displayName',
            required: true,
            validator: validators.string,
            parameters: [],
            default(){ return 'Element' },
        },
        elementType: {
            type: 'type', // the type 'type' is not editable
            required: true,
            validator: validators.enum,
            parameters: [['div', 'span']],
            default(){ return 'div' },
        },
        defaultSlot: {
            type: 'slot',
            required: false,
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

    function ingest(c: StringKeyObject[]): StringKeyObject[] {
        return c.map(element => ingestElement(element))
    }

    function ingestElement(element: StringKeyObject) {
        let sanitizedElement: StringKeyObject = {}
        
        for (const key in elementPropConfig) {
            let config = elementPropConfig[key]
            let value = element[key]

            // Not required and not set
            if (!config.required && value === undefined) {
                continue
            }
            // Required and not set
            else if (config.required && value === undefined) {
                value = config.default()
            }
            // Set
            else {
                try {
                    value = config.validator(value, ...config.parameters)
                }
                catch (error) {
                    value = config.default()
                }
            }

            sanitizedElement[key] = value
        }

        return sanitizedElement
    }



    function findElementPath( elements: StringKeyObject[], id: string, path: (string | number)[] = []): (string | number)[] | null {
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i]
            if (element.elementId === id) return [...path, i]

            // Suche in Slots
            for (const key in element) {
                if (key.startsWith('slot_') || key === 'slot') {
                    const slotElements = element[key]

                    if (Array.isArray(slotElements)) {
                        const result = findElementPath(slotElements, id, [...path, key])
                        if (result) return result
                    }
                }
            }
        }

        return null
    }



    function insertElement(
        element: StringKeyObject,
        position: 'first' | 'last' | 'before' | 'after',
        anchor?: StringKeyObject,
        slot: string = 'slot'
    ): void {
        // Pfad zu Anchor-Element finden, falls vorhanden
        let targetArray = content.value
        let anchorIndex = -1

        if (anchor) {
            const path = findElementPath(content.value, anchor.elementId)
            if (!path) throw new Error('Anchor element not found')

            // Navigiere zu Target-Array
            for (const key in path) {
                targetArray = targetArray[key] as StringKeyObject[]
            }

            anchorIndex = path[path.length - 1] as number

            if (position === 'first' || position === 'last') {
                targetArray = targetArray[slot]
                if (targetArray === undefined) throw new Error('Anchor element has no slot')
            }
        }

        // Element einfügen basierend auf der Position
        switch (position) {
            case 'first':
                targetArray.unshift(element);
                break;
            case 'last':
                targetArray.push(element);
                break;
            case 'before':
                if (anchorIndex === -1) throw new Error('Anchor required for position "before"');
                targetArray.splice(anchorIndex, 0, element);
                break;
            case 'after':
                if (anchorIndex === -1) throw new Error('Anchor required for position "after"');
                targetArray.splice(anchorIndex + 1, 0, element);
                break;
            default:
                throw new Error('Invalid position');
        }
    }

    watch(props, () => {content.value = ingest(props.content)}, {
        immediate: true,
        deep: true,
    })
</script>

<style lang="sass" scoped>
</style>