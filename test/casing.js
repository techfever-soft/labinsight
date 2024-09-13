

class casing {

    MYFUNCTION(myParam, AnotherParam) { // `AnotherParam` ne respecte pas le camelCase
        return myParam;
    }

    myArrowFunc(my_param, correctParam) { // `my_param` ne respecte pas le camelCase
        return correctParam;
    };
}