const Rules = {
    nospace: v => (v || "").indexOf(" ") < 0 || "Spaces are not allowed",
    required: v => !!v || "Обязательное поле",
    idRequired: v => !!v?.id || "Object not selected",
    min: v => !!v && (v || "").length >= 8 || "Minimum 8 characters",
    max: v => !!v && (v || "").length <= 20 || "Max 20 symbols",
    email: v => !!v && v.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) !== null || 'Incorrect email',
    latAndNum: v => v && !!v.match(/^[a-zA-Z0-9-_@]*$/) || 'Only latin letters and numbers',
    numberWithPoint: v => /^[0-9]+(\.[0-9]+)?$/.test(v) || "Numbers only",
    number: v => /^[0-9]+$/.test(v) || "Numbers only",
    decimalNumbers: v => /^[0-9]+(\.[0-9]+)?$/.test(v) || "Numbers or decimal numbers only",
    requiredArray: value => !!value && value.length > 0 || "Required field",
    positiveValue: v => !!v && v > 0 || "Wrong format. Number must be positive",
    nonNegative: v => v !== null && v !== undefined && v >= 0 || "The number must be greater than or equal to zero",
    percent: v => v > 0 && v <= 100 || "number must be greater than 0 and less than or equal to 100",
    key: v => !!v && v.length === 64 || "invalid key length",
    dateBeforeAnother: (dateBefore, dateAfter, message) => !!dateBefore && !!dateAfter && (dateBefore < dateAfter) || message,
    dateAfterToday: (date, message) => !!date && (date > new Date() || date.toDateString() === new Date().toDateString())
        || (message || "Date must be greater than today"),
    dateBeforeToday: (date, message) => !!date && (date < new Date() || date.toDateString() === new Date().toDateString())
        || (message || "The date must refer to today or earlier"),
    login: value => !!value || "Enter login",
    password: v => v && !!v.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/) || "Weak password",
    maxNumber: (value, max, message) => !max || Number(value) <= Number(max)
        || message  || `УThe specified number exceeds the maximum allowable ${'(' + max + ')'}`,
    minNumber: (value, min, message) => !min || Number(value) >= Number(min)
        || message  || `Specified number is less than the minimum allowed ${'(' + min + ')'}`,
    minMaxLimit: (value, min, max) => (value <= max && value >= min) || "The value must be in the range from " + min + " to " + max,
    dateBetweenMontesFromAndTo: (dateFrom, date, monthFrom, monthTo) =>
        new Date(date).getTime() >= new Date(dateFrom).setMonth(new Date(dateFrom).getMonth() + monthFrom)
            && new Date(date).getTime() <= new Date(dateFrom).setMonth(new Date(dateFrom).getMonth() + monthTo)
            || "The value must be in the range from " + monthFrom + " to " + monthTo + " months from current date ",
};

export default Rules