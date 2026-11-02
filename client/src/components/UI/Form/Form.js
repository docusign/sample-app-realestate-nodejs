import React from 'react';
import Input from '../Input/Input';
import validator from 'validator';

import classes from './Form.module.css';

/*
    Custom form component
    Props:
        formSubmissionHandler (function) form submission handler
        formValidated (boolean) whether or not the form is validated yet
        formTitle (string) Heading at the top of the form
        subTitle (string) subtitle
        update: (function (updatedFormData, updatedFormIsValid)) Updates the state of the parent form
        format: (string) the layout of the inputs - defaults to linear
        formData: (object) Data of dynamically loaded input elements
            { 
                "input_element_name": {
                      inputType: (String) the type of input element
                    inputConfig (object): {
                        {id: id_of_element} i
                    },
                    value: (String) the current value stored in the input element,
                    validation (object) the validation rules for this input element: {
                        {Look at validationHelper Method for options}
                    },
                    valid: (Boolean) whether or not this input element is currently valid,
                    touched: (Boolean) whether or not the user has focused this input element before,
                    options (optional, only required for dropdown): 
                        [Object] -> Object in the form {value: display_name for dropdown option} 
                }
            }
  
    Author: David Kennedy
*/
const form = (props) => {
    const formInputs = [];
    let input = null;
    for(let inputKey in props.formData) {
        input = props.formData[inputKey]; 
        let changeHandler = (event) => inputChangedHandler(event, props, inputKey);
        formInputs.push(
            <Input 
                key={inputKey}
                inputtype={input.inputType}
                config={input.inputConfig}
                dropdownStyle={(props.format === 'twoColumns') ? 'full' : 'half'}
                value={input.value}
                touched={input.touched}
                valid={input.valid !== undefined && input.valid.toString()}
                selectedCountry={props.formData["country"] ? props.formData["country"].value : ''}
                changed={changeHandler}/>
        )
    }
    let layoutClass = (props.format === 'twoColumns') ? classes.TwoColumns : null;
    let submissionGroup = (props.format !== 'twoColumns') ? 
    (
        <React.Fragment>
            <div className={classes.Line}></div>
            <button type="submit" disabled={!props.formValidated || props.buttonDisabled}>Submit</button>
        </React.Fragment>
    ) : 
    (
        <button type="submit" disabled={!props.formValidated || props.buttonDisabled}>Submit</button>
    )
    return (
        <form className={classes.Form} onSubmit={props.formSubmissionHandler}> 
            <h1>{props.formTitle}</h1>
            <h3>{props.subTitle}</h3>
            <div className={layoutClass}>
                {formInputs}
            </div>
            {submissionGroup}
        </form>
    )
}


/*
    onChange handler that updates the state due to a change
    in an input element. After the change has been made, a 
    validation check is run to check if the value is 
    acceptable, setting the valid key. 
*/
const inputChangedHandler = (event, props, inputKey) => {
    const updatedRoomForm = {
    ...props.formData
    };
    const updatedFormElement = { 
        ...updatedRoomForm[inputKey]
    };
    //set the new value
    if(event.target.value === 'true') updatedFormElement.value = true;
    else if(event.target.value === 'false') updatedFormElement.value = false;
    else updatedFormElement.value = event.target.value;
    //check if the new value is valid and set it
    //force set '' before validation
    updatedFormElement.valid = 
        validateInput(updatedFormElement.value, updatedFormElement.validation);
    //set this input element as touched
    updatedFormElement.touched = true;
    updatedRoomForm[inputKey] = updatedFormElement;
    //update whether or not the entire form is valid
    let formIsValid = true;
    for (let key in updatedRoomForm) {
        formIsValid = updatedRoomForm[key].valid && formIsValid;
    }
    //update the parent form's state
    props.update(updatedRoomForm, formIsValid);
}



/*
    Helper method called by the onChange handler that checks if a
    specific input element's value is valid
*/
const validateInput = (value, rules) => {
    let isValid = true;
    if (!rules) {
        return true;
    }
    if(!rules.required && value === '') return true;
    
    if (rules.required) {
        isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid
    }

    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid
    }

    if (rules.isEmail) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isValid = pattern.test(value) && isValid
    }

    if (rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid
    }

    if (rules.isPhone) {
        isValid = validator.isMobilePhone(value);
    }

    return isValid;
}

export default form;