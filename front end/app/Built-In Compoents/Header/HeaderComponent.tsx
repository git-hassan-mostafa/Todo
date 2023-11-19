import React from 'react'
import './Header.css'
export default function HeaderComponent(props: HeaderType) {
    // const direction = props.direction ==='ltr' ? '__header'
    return (
        <header style={{
            gap: props.gap,
            backgroundColor:props.backgroundColor,
            padding:props.padding
        }} className={`__header__ ${props.className} __header-${props.direction || 'ltr'}__ `}>
            <div style={{
                gap:props.iconBar.gap+'px',
                flex: props.navigantionAlignment === 'to-right' ? props.direction === 'ltr' ? 1 : 'none' : 'none'
            }} className={`__header-icon-bar__`}>
                {props.iconBar.elements}
                
            </div>
            <div style={{
                gap: props.navigationBar.gap,
                flex: props.navigantionAlignment === 'to-left' ? 1 : 'none'
            }} className="__header-navigation-bar__">
                {
                    props.navigationBar.elements
                }
            </div>
            <div style={{
                gap: props.featuresBar.gap,
                flex: props.navigantionAlignment === 'to-right' ? props.direction === 'rtl' ? 1 : 'none' : 'none'
            }} className="__header-features-bar__">
                {
                    props.featuresBar?.elements
                }
            </div>
        </header>
    )
}

interface HeaderType {
    backgroundColor?:string | undefined
    padding?:string |undefined
    gap?: number | undefined
    direction?: 'ltr' | 'rtl' | undefined
    navigantionAlignment?: 'to-left' | 'to-right' | 'center' | undefined;
    className?: string | undefined
    iconBar: {
        gap?:number | undefined
        elements: React.ReactNode | undefined
    }
    navigationBar: {
        gap?: number | undefined
        elements: React.ReactNode | undefined
    }
    featuresBar: {
        gap?: number | undefined,
        elements: React.ReactNode | undefined
    }
}