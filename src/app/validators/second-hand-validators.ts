import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class SecondHandValidators {

    static notOnlyWhiteSpace(control: FormControl) : ValidationErrors {
        
        //check if the passed control value is not null and it is not contain ONLY whitespace.

        if (control.value != null && control.value.trim().length === 0) {
            return {'notOnlyWhiteSpace' : true};
        } else {
            return null!;
        }
    }

    static atLeastTwoLettersWithNoWhiteSpace(control : FormControl) : ValidationErrors | null {
        if (control.value != null && control.value.trim().length < 2) {
            return {'minTwoCharacters' : true};
        } else {
            return null;
        }
    }

    static atLeastSomeLettersWithNoWhiteSpace(numberOfLetters: number) : ValidatorFn {
        return (control : AbstractControl) : ValidationErrors | null => {
            if (control.value != null && control.value.trim().length < numberOfLetters) {
                let result: ValidationErrors = {};
                const key: string = `min${numberOfLetters}Characters`;
                result[key] = true;
                return result;
            } else {
                return null;
            }
        }
    }
}
