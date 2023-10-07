import { isField } from './utils';
import { Button } from './button';
/* import {
    CheckboxField,
    ColorField,
    DateField,
    DaterangeField,
    DatetimeField,
    EmailField,
    FileField,
    HiddenField,
    NumberField,
    PasswordField,
    RadioField,
    RangeField,
    RitchtextField,
    SelectField,
    TelField,
    TextField,
    TextareaField,
    TimeField,
    UrlField,
    WeekField,
    ListField,
    StaticField,
} from './fields';*/
import { Group } from './group';
import { Row } from './row';
//import { Tabs } from './tabs';
import { FormElementType } from './types';

/**
 * A list of field types used in the application forms.
 */
export const fields = [
  'text',
  'email',
  'tel',
  'password',
  'checkbox',
  'hidden',
  'radio',
  'url',
  'textarea',
  'color',
  'number',
  'range',
  'date',
  'week',
  'datetime',
  'time',
  'daterange',
  'ritchtext',
  'select',
  'file',
  'list',
  'static',
];

/**
 * A list of other form-related elements used in the application.
 */
export const otherElements = ['button', 'group', 'row', 'tabs'];

/**
 * A combined list of all form-related elements.
 */
export const formElements = [...fields, ...otherElements];

/**
 * A mapping of form element types to their constructor functions.
 */
export const elementConstructors: { [key in FormElementType]?: new (a: any, b: any, c: any) => any } = {
  /*  text: TextField,
    email: EmailField,
    tel: TelField,
    password: PasswordField,
    checkbox: CheckboxField,
    hidden: HiddenField,
    radio: RadioField,
    url: UrlField,
    textarea: TextareaField,
    color: ColorField,
    number: NumberField,
    range: RangeField,
    date: DateField,
    week: WeekField,
    datetime: DatetimeField,
    time: TimeField,
    daterange: DaterangeField,
    ritchtext: RitchtextField,
    select: SelectField,
    file: FileField,
    list: ListField,
    static: StaticField,
    button: Button,
    group: Group,
    row: Row,
    tabs: Tabs,*/
};

/**
 * License contants.
 */
export const OS_LICENSE_KEYS = ['GPL-My-Project-Is-Open-Source', 'CC-Attribution-NonCommercial-NoDerivatives'];

export const UPGRADE_WINDOW = 365 + 7;

export const LICENSE_STATE = {
  VALID: 1,
  OUTDATED: 2,
  INVALID: 3,
};

/**
 * Release date.
 */
export const RELEASE_DATE = '2023-09-23';

export const registerConstructor = (type: string, key: string, constructor: any, isField: boolean) => {
  if (isField && !fields.includes(type)) fields.push(type);
  else if (!otherElements.includes(type)) otherElements.push(type);
  elementConstructors[key] = constructor;
};
