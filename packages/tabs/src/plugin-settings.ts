import { Tabs } from "./tabs";
import { costructorTypes } from '../node_modules/formsjs/lib/constants';
import { PluginSettings } from '../node_modules/formsjs/lib/types'; 

export const pluginSettings:PluginSettings = {
    type: 'tabs',
    constructor: Tabs,
    constructorType: costructorTypes.group,
    licensed: true
}