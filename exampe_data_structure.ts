type Unit = `${number}${'px' | 'rem' | '%'}`
type Url = `url('${string}')`|`url(${string})`

type Element = {
    elementId: string
    elementName: string
    elementType: 'div' | 'span'

    position: 'fixed'
    zIndex: number
    top: Unit
    left: Unit
    width: Unit
    height: Unit

    innerText?: string

    backgroundColor?: string
    backgroundImage?: Url
    backgroundSize?: string
    backgroundPosition?: string
    backgroundRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'

    color?: string
    fontSize?: Unit
    fontFamily?: string
    fontWeight?: string
    textAlign?: 'left' | 'center' | 'right'

    opacity?: number
}

export const content: Element[] = [
    {
        elementId: '678451367',
        elementName: 'Element 1',
        elementType: 'div',
        position: 'fixed',
        zIndex: 1,
        top: '0px',
        left: '0px',
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
    }
]