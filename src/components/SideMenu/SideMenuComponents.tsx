import { useConfig } from "@context/Config";
import EventFilter from "./EventFilter";
import EventTemplate from "./EventTemplate";
import Search from "./Search";
import React, { useMemo } from "react";

const SideMenuComponents: FC = () => {
    const config = useConfig()!;

    // filters
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

    

    // templates
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

    const components = useMemo(() => {
        const compArray = [];

        if (mappedFilterAreas?.length) {
            mappedFilterAreas.forEach((area, index) => {
                compArray.push({
                    component: <EventFilter key={`filter-${index}`} index={index} name={area.name} title={area.title} open={area.open} filters={area.filters} />,
                    order: area.order || 0
                });
            });
        } else if (sortedFilters.length) {
            compArray.push({
                component: <EventFilter key="default-filter" index={0} name="default" title={config!.translations?.eventFiltersHeader ?? "Filters"} filters={sortedFilters} />,
                order: 0
            });
        }

        if (filteredTemplateAreas.length && filteredTemplateAreas.some(area => Boolean(area?.templates?.length))) {
            filteredTemplateAreas.forEach((area, index) => {
                compArray.push({
                    component: <EventTemplate key={`template-${index}`} index={index} area={area} />,
                    order: area.order || 0
                });
            });
        }

        if (config.searchFields) {
            config.searchFields.forEach((searchField, index) => {
                compArray.push({
                    component: <Search key={`search-${index}`} searchField={searchField} index={index} />,
                    order: searchField.order || 0
                });
            });
        }

        return compArray.sort((a, b) => a.order - b.order);
    }, [mappedFilterAreas, filteredTemplateAreas, config.searchFields, sortedFilters, config]);

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