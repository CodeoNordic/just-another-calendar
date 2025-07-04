import { useMemo } from 'react';

import { useConfig } from '@context/Config';
import combineClasses from '@utils/combineClasses';

import { warn } from '@utils/log';

const Icon: FC<{
    src: string;
    thickness?: string|number;
    width?: string|number;
    height?: string|number
}> = props => {
    const config = useConfig();
    const src = useMemo(() => {
        if (!props.src) return null;

        if (props.src.startsWith('<')) return props.src;
        if (props.src.startsWith('eval:')) {
            try {
                const func = eval(props.src.substring(5));
                if (typeof func === 'function') {
                    const result = func();

                    if (typeof result === 'string') {
                        if (result === '' || result.trim() === '') return null;
                        if (result.startsWith('<')) return result;
                        return config?.icons?.find(icon => icon.name === result);
                    }

                    if (![undefined, null].includes(result)) {
                        if (typeof result === 'object' && (typeof result.html === 'string')) return result.html;

                        console.error('Eval result was not a valid type', result);
                        return null;
                    }

                    return result;
                }
                
                console.error('Eval result was not a function', props.src);
                return null;
            } catch(err) {
                console.error('Failed to parse JS code', props.src);
                console.error(err);
                return null;
            }
        }

        const icon = config?.icons?.find(icon => icon.name === props.src)?.html ?? null;
        if (!icon) warn(`The icon '${props.src}' was not found in the config`);

        return icon;
    }, [config?.icons, props.src]);

    return <div
        className={combineClasses('jac-icon', props.className)}
        dangerouslySetInnerHTML={{ __html: src ?? '' }}
        style={{
            strokeWidth: typeof props.thickness === 'number' ? `${props.thickness}px` : props.thickness,
            stroke: props.thickness ? 'currentColor' : undefined,
            width: typeof props.width === 'number' ? `${props.width}px` : props.width,
            height: typeof props.height === 'number' ? `${props.height}px` : props.height,
            ...props.style
        }}
    />
}

export default Icon;