import React, { useRef, useState, useLayoutEffect } from 'react';
import { getParentDimensions, scale } from './util';


/**
 * props:
 * onResize - function to execute when the window is resized
 * onLoad - function to execute to initialize app
 * dimensions - specify dimensions { width, height } 
 * styles - accepts custom styles for canvas container
 * refreshRate - time (in ms) in which to execute specified redraw function on resize. Default is 50ms.
 */

const Canvas = props => {
    const canvas = useRef();
    const [size, setSize] = useState(getParentDimensions(canvas.current));

    useLayoutEffect(() => {
        function hydrate(callback) {
            setSize(getParentDimensions(canvas.current));
            setTimeout(() => {
                const { width: bitmapWidth, height: bitmapHeight } = canvas.current;
                const ctx = canvas.current.getContext("2d");
                callback({ ctx, width: bitmapWidth, height: bitmapHeight })
            }, props.refreshRate || 50);
        }

        const _componentWillMount = () => hydrate(props.onMount);
        const _dimensionsWillCange = () => window.addEventListener("resize", () => hydrate(props.onResize));
        const _componentWillUnmount = () => window.removeEventListener("resize", hydrate)

        _componentWillMount()
        _dimensionsWillCange()

        return _componentWillUnmount();

    }, [props.refreshRate, props.onResize, props.onMount]);

    const { width: elementWidth, height: elementHeight } = size;
    return (
        <div style={props.style}>
            <canvas
                ref={canvas}
                width={elementWidth * scale()}
                height={elementHeight * scale()}
                style={{ width: elementWidth, height: elementHeight }}
            />
        </div>
    )
}

export { Canvas };