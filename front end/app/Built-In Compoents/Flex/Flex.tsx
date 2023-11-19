import React, { CSSProperties } from 'react'

export default function Flex(props: FlexType) {
    return (
        <div className={props.className} style={{
            ...props.style,
            display: 'flex',
            ...props.properties
        }} >
            {props.children}
        </div>
    )
}

interface FlexType {
    style?: React.CSSProperties,
    children: React.ReactNode,
    properties?: {
        gap?: CSSProperties['gap'],
        justifyContent?: CSSProperties['justifyContent'],
        justifyItems?: CSSProperties['justifyItems'],
        alignItems?: CSSProperties['alignItems'],
        alignContent?: CSSProperties['alignContent'],
        flexDirection?: CSSProperties['flexDirection'],
        flexWrap?: CSSProperties['flexWrap'],
    },
    className?: string | undefined
}