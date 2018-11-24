// external imports
import { instantiate } from "ivy-bch";
import { createSelector } from "reselect";
import { getData, isValidInput } from "../inputs/data";
export const getTemplateState = (state) => {
    return state.templates;
};
export const getError = createSelector(getTemplateState, state => state.error);
export const getSourceMap = createSelector(getTemplateState, state => state.sourceMap);
export const getSource = createSelector(getTemplateState, state => state.source);
export const getSource2 = createSelector(getTemplateState, state => state.source2);
export const getTemplateIds = createSelector(getTemplateState, state => state.idList);
export const getTemplate = (id) => {
    return createSelector(getSourceMap, sourceMap => sourceMap[id]);
};
export const getInputMap = createSelector(getTemplateState, templateState => templateState.inputMap);
export const getInputMap2 = createSelector(getTemplateState, templateState => templateState.inputMap2);
export const getInputList = createSelector(getInputMap, inputMap => {
    if (inputMap === undefined) {
        return undefined;
    }
    const inputList = [];
    for (const id in inputMap) {
        if (inputMap.hasOwnProperty(id)) {
            inputList.push(inputMap[id]);
        }
    }
    return inputList;
});
export const getCompiled = createSelector(getTemplateState, state => state.compiled);
export const getCompiled2 = createSelector(getTemplateState, state => state.compiled2);
export const getContractParameters = createSelector(getCompiled, compiled => {
    return compiled && compiled.params;
});
export const getContractParameters2 = createSelector(getCompiled2, compiled2 => {
    return compiled2 && compiled2.params;
});
export const getOpcodes = createSelector(getCompiled, compiled => {
    return compiled && compiled.instructions;
});
export const getParameterIds = createSelector(getContractParameters, contractParameters => {
    return (contractParameters &&
        contractParameters.map(param => "contractParameters." + param.name));
});
export const getParameterIds2 = createSelector(getContractParameters2, contractParameters => {
    return (contractParameters &&
        contractParameters.map(param => "contractParameters." + param.name));
});
export const areInputsValid = createSelector(getInputMap, getParameterIds, (inputMap, parameterIds) => {
    if (parameterIds === undefined || inputMap === undefined) {
        return false;
    }
    try {
        parameterIds.filter(id => {
            getData(id, inputMap);
        });
        return true;
    }
    catch (e) {
        return false;
    }
});
export const areInputsValid2 = createSelector(getInputMap2, getParameterIds2, (inputMap, parameterIds) => {
    if (parameterIds === undefined || inputMap === undefined) {
        return false;
    }
    try {
        parameterIds.filter(id => {
            getData(id, inputMap);
        });
        return true;
    }
    catch (e) {
        return false;
    }
});
export const getShowLockInputErrors = createSelector(getTemplateState, (state) => state.showLockInputErrors);
export const getContractArgs = createSelector(getParameterIds, getInputMap, (parameterIds, inputMap) => {
    if (parameterIds === undefined || inputMap === undefined) {
        return undefined;
    }
    try {
        const contractArgs = [];
        for (const id of parameterIds) {
            if (inputMap[id].value === "valueInput" &&
                !isValidInput(id + ".valueInput", inputMap)) {
                // don't let invalid Values prevent compilation
                contractArgs.push(NaN);
            }
            else {
                contractArgs.push(getData(id, inputMap));
            }
        }
        return contractArgs;
    }
    catch (e) {
        return undefined;
    }
});
export const getContractArgs2 = createSelector(getParameterIds2, getInputMap2, (parameterIds, inputMap) => {
    if (parameterIds === undefined || inputMap === undefined) {
        return undefined;
    }
    try {
        const contractArgs = [];
        for (const id of parameterIds) {
            if (inputMap[id].value === "valueInput" &&
                !isValidInput(id + ".valueInput", inputMap)) {
                // don't let invalid Values prevent compilation
                contractArgs.push(NaN);
            }
            else {
                contractArgs.push(getData(id, inputMap));
            }
        }
        return contractArgs;
    }
    catch (e) {
        return undefined;
    }
});
export const getInstantiated = createSelector(getCompiled, getContractArgs, (template, contractArgs) => {
    if (template === undefined || contractArgs === undefined) {
        return undefined;
    }
    return instantiate(template, contractArgs);
});
export const getInstantiated2 = createSelector(getCompiled2, getContractArgs2, (template, contractArgs) => {
    if (template === undefined || contractArgs === undefined) {
        return undefined;
    }
    return instantiate(template, contractArgs);
});
export const getSelectedTemplate = createSelector(getCompiled, getSourceMap, (compiled, sourceMap) => {
    if (compiled === undefined || sourceMap[compiled.name] === undefined) {
        return "";
    }
    else {
        return compiled.name;
    }
});
export const getSaveability = createSelector(getCompiled, getSourceMap, getError, (compiled, sourceMap, error) => {
    if (compiled === undefined) {
        return {
            saveable: false,
            error: "Contract template has not been compiled."
        };
    }
    if (error !== undefined) {
        return {
            saveable: false,
            error: "Contract template is not valid Ivy."
        };
    }
    const name = compiled.name;
    if (sourceMap[name] !== undefined) {
        return {
            saveable: false,
            error: "There is already a contract template saved with that name."
        };
    }
    return {
        saveable: true,
        error: ""
    };
});
export const getCreateability = createSelector(getSource, getSourceMap, getCompiled, areInputsValid, getError, (source, sourceMap, compiled, inputsAreValid, error) => {
    if (compiled === undefined) {
        return {
            createable: false,
            error: "Contract template has not been compiled."
        };
    }
    if (error !== undefined) {
        return {
            createable: false,
            error: "Contract template is not valid Ivy."
        };
    }
    if (!inputsAreValid) {
        return {
            createable: false,
            error: "One or more arguments to the contract are invalid."
        };
    }
    const name = compiled.name;
    const savedSource = sourceMap[name];
    if (savedSource === undefined) {
        return {
            createable: false,
            error: "Contract template must be saved before it can be instantiated."
        };
    }
    if (savedSource !== source) {
        return {
            createable: false,
            error: "Contract template must be saved (under an unused name) before it can be instantiated."
        };
    }
    return {
        createable: true,
        error: ""
    };
});
export const getCreateability2 = createSelector(getSource2, getSourceMap, getCompiled2, areInputsValid2, getError, (source, sourceMap, compiled, inputsAreValid, error) => {
    if (compiled === undefined) {
        return {
            createable: false,
            error: "Contract template has not been compiled."
        };
    }
    if (error !== undefined) {
        return {
            createable: false,
            error: "Contract template is not valid Ivy."
        };
    }
    if (!inputsAreValid) {
        return {
            createable: false,
            error: "One or more arguments to the contract are invalid."
        };
    }
    const name = compiled.name;
    const savedSource = sourceMap[name];
    if (savedSource === undefined) {
        return {
            createable: false,
            error: "Contract template must be saved before it can be instantiated."
        };
    }
    if (savedSource !== source) {
        return {
            createable: false,
            error: "Contract template must be saved (under an unused name) before it can be instantiated."
        };
    }
    return {
        createable: true,
        error: ""
    };
});
