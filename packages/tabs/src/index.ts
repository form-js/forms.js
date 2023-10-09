import { useLicensedFetures, registerConstructor, costructorTypes } from '../node_modules/formsjs/lib/index';
import { Tab } from './tab';
import { Tabs } from './tabs';

registerConstructor('tabs', Tabs, costructorTypes.group);
useLicensedFetures();

export { Tab, TabOptions } from './tab';
export { Tabs, TabsOptions } from './tabs';
