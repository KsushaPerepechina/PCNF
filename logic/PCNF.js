var VARIABLES_SET = [];

function checkOnPCNF(inputFormula) {
    if (containsGroupNegations(inputFormula)){ return false; }
    VARIABLES_SET = getVariablesSetFromFormula(inputFormula);
}

function containsGroupNegations(inputFormula){
    const regNegation = /!\([^)]+\)/g;
    var hasNegations = inputFormula.match(regNegation);
    return hasNegations !== null;
}

function getVariablesSetFromFormula(inputFormula){
    const regVariable = /[A-Z]/g;
    const result = inputFormula.match(regVariable);
    var variablesSet = result.filter(
        function (symbol, index) {
            return result.indexOf(symbol) === index;
        });
    return variablesSet.sort();
}