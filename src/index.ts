import ObjectParser from './ObjectParser';
import InputObjectParser from './InputObjectParser';

const composeWithJson = ObjectParser.createTC.bind(ObjectParser);
const composeInputWithJson = InputObjectParser.createITC.bind(InputObjectParser);

export default composeWithJson;
export { composeWithJson, composeInputWithJson };
