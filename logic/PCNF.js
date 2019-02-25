var VARIABLES_SET = [];

function checkOnPCNF(inputFormula) {
    if (containsGroupNegations(inputFormula)){ return false; }
    var disjunctions = inputFormula.split("&") || inputFormula;
    disjunctions.forEach(removeExtraBrackets);

    VARIABLES_SET = getVariablesSetFromFormula(inputFormula);
    var allAtomsUsage = disjunctions.every(containsEveryVariable);
    return allAtomsUsage && !hasDuplicates(disjunctions);
}

function containsGroupNegations(inputFormula){
    const regNegation = /!\([^)]+\)/g;
    var hasNegations = inputFormula.match(regNegation);
    return hasNegations !== null;
}

function removeExtraBrackets(element, index, inputArray){
    const openingBrackets = element.match(/\(/g);
    var openingBracketsCounter = (openingBrackets === null) ? 0 : openingBrackets.length;

    const closingBrackets = element.match(/\)/g);
    var closingBracketsCounter = (closingBrackets === null) ? 0 : closingBrackets.length;

    if (closingBracketsCounter === openingBracketsCounter) {
        return;
    }

    const difference = Math.abs(closingBracketsCounter - openingBracketsCounter);
    inputArray[index] = closingBracketsCounter > openingBracketsCounter ? element.slice(0, element.length - difference) : element.slice(difference);
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

function containsEveryVariable(element) {
    var elementVariables = getVariablesSetFromFormula(element);

    if (VARIABLES_SET.length !== elementVariables.length) {
        return false;
    }

    return VARIABLES_SET.every(function (v, i) {
        return v === elementVariables[i];
    })
}

function hasDuplicates(array) {
    var checked = Object.create(null);
    var check = false;

    array.forEach(
        function(element) {
            if (hasRepeating(element) || isAlreadyInArray(element, checked)){
                check = true;
                return;
            }
            checked[element] = true;
        });
    return check;
}

function hasRepeating(subFormula) {
    const regAtom = /[A-Z]|![A-Z]/g;
    var atomsVisited = Object.create(null);
    var atomsSet = subFormula.match(regAtom);
    var check = false;

    atomsSet.forEach(
        function(element) {
            if (element in atomsVisited) {
                check = true;
                return;
            }
            atomsVisited[element] = true;
        });
    return check;
}

function isAlreadyInArray(disjunction, checked) {
    const regOR = /\|/g;
    for (var value in checked) {
        var valueSplit = String(value).split(regOR);
        valueSplit.forEach(removeExtraBrackets);
        valueSplit.sort()

        var disjunctionSplit = disjunction.split(regOR);
        disjunctionSplit.forEach(removeExtraBrackets);
        disjunctionSplit.sort();

        var counter = 0;
        for (var element = 0; element < valueSplit.length; element++) {
            if (areAtomsEqual(valueSplit[element], disjunctionSplit[element])) {
                counter++;
            }
        }

        return counter === valueSplit.length;
    }
    return false;
}

function areAtomsEqual(firstAtom, secondAtom) {
    return extractAtom(firstAtom) === extractAtom(secondAtom);
}

function extractAtom(atom) {
    var matcher = atom.match(/\([A-Z]\)/g);
    if (matcher !== null) {
        return atom[1];
    } else return atom;
}