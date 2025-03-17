import { useConfig } from "@context/Config";
import EventFilter from "./EventFilter";
import EventTemplate from "./EventTemplate";
import Search from "./Search";
import React, { useMemo } from "react";
import SearchDynamicDropdown from "./SearchDynamicDropdown";

const SideMenuComponents: FC = () => {
    const config = useConfig()!;

    // filters
    const sortedFilters = useMemo(() => {
        return [...(config.eventFilters || [])]
            .filter(f => !f.hidden)
            .map((f, i) => {
                f._initialIndex = i;
                return f;
            })
            .sort((a, b) => (a.sort || Infinity) - (b.sort || Infinity));
    }, [config.eventFilters]);

    const mappedFilterAreas = useMemo<(JAC.Area & { filters: JAC.EventFilter[] })[]|null>(() => {
        if (!config.eventFilterAreas?.length || !sortedFilters?.length || config.eventFiltersHidden) return null;

        const filteredAreas = config.eventFilterAreas.filter(area => area.hidden !== true);

        return filteredAreas.map(area => {
            return {...area,
            filters: sortedFilters.filter(f => f.areaName === area.name && f.hidden !== true)};
        }).filter(area => !!area.filters?.length);
    }, [config.eventFilterAreas, sortedFilters]);

    // templates
    const sortedTemplates = useMemo(() => {
        if (!config.eventTemplates) return null;

        return [...(config.eventTemplates)]
            .sort((a, b) => (a.sort || Infinity) - (b.sort || Infinity));
    }, [config.eventFilters]);
    
    const filteredTemplateAreas = useMemo<(JAC.Area & { templates: JAC.EventTemplate[] })[]|null>(() => {
        if (!sortedTemplates?.length) return null;    
        
        return config?.eventTemplateAreas?.filter(area => area.hidden !== true).map(area => ({
                ...area,
                templates: sortedTemplates?.filter(template => template.areaName === area.name && template.hidden !== true)
        })).filter(area =>!!area?.templates?.length) || [{ name: 'default', title: 'Templates', templates: sortedTemplates }];
    }, [config?.eventTemplateAreas, sortedTemplates]);

    const components = useMemo(() => {
        const compArray = [] as { component: JSX.Element, sort: number }[];

        if (mappedFilterAreas?.length) {
            mappedFilterAreas.forEach((area, index) => {
                compArray.push({
                    component: <EventFilter key={`filter-${index}`} index={index} name={area.name} title={area.title} open={area.open} filters={area.filters} />,
                    sort: area.sort || 0
                });
            });
        } else if (sortedFilters.length) {
            compArray.push({
                component: <EventFilter key="default-filter" index={0} name="default" title="Filters" filters={sortedFilters} />,
                sort: 0
            });
        }

        if (filteredTemplateAreas?.length && filteredTemplateAreas.some(area => Boolean(area?.templates?.length))) {
            filteredTemplateAreas.forEach((area, index) => {
                compArray.push({
                    component: <EventTemplate key={`template-${index}`} index={index} area={area} />,
                    sort: area.sort || 0
                });
            });
        }

        if (config.searchFields && !config.searchFieldsHidden) {
            config.searchFields.forEach((searchField, index) => {
                if (searchField.hidden) return;
                compArray.push({
                    component: searchField.dynamicDropdown 
                        ? <SearchDynamicDropdown key={`search-${index}`} searchField={searchField} index={index} /> 
                        : <Search key={`search-${index}`} searchField={searchField} index={index} />,
                    sort: searchField.sort || 0
                });
            });
        }

        return compArray.sort((a, b) => a.sort - b.sort);
    }, [mappedFilterAreas, filteredTemplateAreas, config.searchFields, sortedFilters, config]);

    const sortedComponents = components.sort((a, b) => a.sort - b.sort);

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