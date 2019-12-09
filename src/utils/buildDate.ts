import preval from "preval.macro";

const buildDate = preval`module.exports = Date.now()` as number;

export default buildDate;
