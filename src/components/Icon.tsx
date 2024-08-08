import { useConfig } from '@context/Config';
import combineClasses from '@utils/combineClasses';

const Icon: FC<{src: string}> = props => {
    const config = useConfig();

    const src = props.src.startsWith('<')? props.src: config?.icons?.find(icon => icon.name === props.src)?.html;
    return <div className={combineClasses('jac-icon', props.className)} dangerouslySetInnerHTML={{ __html: src ?? '' }} />
}

export default Icon;