import { useCallback, useState } from 'preact/hooks';
import { useConfigState } from '@context/Config';

import fetchFromFileMaker from '@utils/fetchFromFileMaker';

const LoadMore: FC<{ perClick: number; }> = ({ perClick }) => {
    const [config, setConfig] = useConfigState();
    const [, setOffset] = useState<number>((config?.records?.length ?? 10) - perClick + 1);

    const [lastEmpty, setLastEmpty] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const onClick = useCallback(() => {
        setLoading(true);

        setOffset(prev => {
            const next = prev + perClick;
            fetchFromFileMaker<FM.DataAPIRecord<FM.ContactRecord>[]>('getContacts', { limit: perClick, offset: next })
                .then(res => {
                    if (!res?.length) return setLastEmpty(true);

                    setConfig(cfg => {
                        if (!cfg) return null;
    
                        const { records, ...config } = cfg;
    
                        return {
                            ...config,
                            records: [
                                ...records,
                                ...(res ?? []).map(r => r.fieldData)
                            ]
                        }
                    });

                    setLoading(false);
                }).catch(err => {
                    console.error(err);
                    setLoading(false);
                });

            return next;
        })
    }, [lastEmpty]);

    return <button
        className="load-more"
        onClick={onClick}
        disabled={loading || lastEmpty}>
            Load More
        </button>
}

export default LoadMore;