// Various React related shortcuts
declare global {
    namespace React {
        type FC<Props = {}> = import('preact').FunctionComponent<Props & {
            children?: import('preact').ComponentChildren
        }>;

        /**
         * Custom state shortcut. Provides autocomplete for react states.
         * ```ts
         * const [state, setState] = props.unknownValue as React.State<boolean>;
         * ```
         */
        type State<T> = [T, import('preact/hooks').Dispatch<
            import('preact/hooks').StateUpdater<T>
        >];
    }
}

export {}