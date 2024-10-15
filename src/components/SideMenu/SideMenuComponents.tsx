import { useConfig } from "@context/Config";
import EventFilter from "./EventFilter";
import EventTemplate from "./EventTemplate";
import Search from "./Search";
import React, { useMemo } from "react";

const SideMenuComponents: FC = () => {
    const config = useConfig()!;

    const sortedFilters = useMemo(() => {
        return [...(config.eventFilters || [])]
            .map((f, i) => {
                f._initialIndex = i;
                return f;
            })
            .sort((a, b) => (a.sort || Infinity) - (b.sort || Infinity));
    }, [config.eventFilters]);

    const mappedFilterAreas = useMemo<(JAC.Area & { filters: JAC.EventFilter[] })[]|null>(() => {
        if (!config.eventFilterAreas?.length || !sortedFilters?.length) return null;

        return config.eventFilterAreas.map(area => ({
            ...area,
            filters: sortedFilters.filter(f => f.areaName === area.name)
        })).filter(area => !!area.filters?.length);
    }, [config.eventFilterAreas, sortedFilters]);

    const sortedTemplates = useMemo(() => {
        if (!config.eventTemplates) return null;

        return [...(config.eventTemplates)]
            .sort((a, b) => (a.sort || Infinity) - (b.sort || Infinity));
    }, [config.eventFilters]);
    
    const filteredTemplateAreas = useMemo<(JAC.Area & { templates: JAC.EventTemplate[] })[]>(() => config?.eventTemplateAreas?.map((area, i) => {
        const templates = sortedTemplates?.filter(template => template.areaName === area.name);

        return {
            ...area,
            templates: templates!
        };
    }).filter(area =>
        Boolean(area?.templates?.length)
    ) || [{ name: 'default', title: config?.translations?.eventTemplatesHeader ?? 'Templates', templates: sortedTemplates! }],
        [config?.eventTemplateAreas, sortedTemplates]
    );

    const components = [];

    if (config.searchFields) {
        config.searchFields.forEach((searchField, index) => {
            components.push({
                component: <Search key={`search-${index}`} searchField={searchField} index={index} />,
                order: searchField.order
            });
        });
    }

    if (mappedFilterAreas?.length) {
        mappedFilterAreas.forEach((area, i) => {
            components.push({
                component: <EventFilter key={`filter-${i}`} index={i} name={area.name} filters={area.filters} title={area.title || "Filter"} open={area.open} />,
                order: area.order
            });
        });
    } else if (sortedFilters.length) {
        components.push({
            component: <EventFilter key="default-filter" index={0} name="default" title={config!.translations?.eventFiltersHeader ?? "Filters"} filters={sortedFilters} />,
            order: 0
        });
    }

    if (filteredTemplateAreas.length && filteredTemplateAreas.some(area => Boolean(area?.templates?.length))) {
        filteredTemplateAreas.forEach((area, i) => {
            components.push({
                component: <EventTemplate key={`template-${i}`} index={i} area={area} />,
                order: area.order
            });
        });
    }

    const sortedComponents = components.sort((a, b) => a.order - b.order);

    return <>
        {sortedComponents.map((item, index) => (
            <div key={index}>
                {(index != 0 || !config!.datePickerDisabled) && <div className="divider" />}
                <React.Fragment>
                    {item.component}
                </React.Fragment>
            </div>
        ))}
    </>
}

export default SideMenuComponents;