import moment from 'moment';

export const formatDateWithTimeZone = (date: string | null | undefined): string => {
    return date ? moment(date)
        .add(moment.duration(moment().format('Z')))
        .format('ddd MMM D, YYYY h:mmA') : 'n/a';
};
