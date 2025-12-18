import React, {Component} from 'react';
import Input from '../../../components/UI/Input/Input';
import Button from '../../../components/UI/Button/Button';
import validator from 'validator';
import textContent from '../../../assets/text.json';
import axios from 'axios';

import classes from './RoomContactInfoForm.module.css';

let labels = {
    buyer1: textContent.contactInfoForm.buyer1,
    buyer2: textContent.contactInfoForm.buyer2,
    seller1: textContent.contactInfoForm.seller1,
    seller2: textContent.contactInfoForm.seller2,
    buyerAgent1: textContent.contactInfoForm.buyerAgent1,
    listingAgent1: textContent.contactInfoForm.listingAgent1
}

let getFormData = ({fieldData}) => {
    return {
        seller1: {
            name: {
                inputType: "input",
                inputConfig: {
                    type: "text",
                    id: "seller1_name",
                    label: 'name'
                },
                value: (fieldData.seller1 && fieldData.seller1.name) ? fieldData.seller1.name : '',
                validation: {
                },
                valid: true,
                touched: true
            },
            email: {
                inputType: "input",
                inputConfig: {
                    type: "text",
                    id: "seller1_email",
                    label: textContent.newContactForm.email
                },
                value: (fieldData.seller1 && fieldData.seller1.email) ? fieldData.seller1.email : '',
                validation: {
                    isEmail: true
                },
                valid: true,
                touched: true
            },
            cellPhone: {
                inputType: "input",
                inputConfig: {
                    type: "text",
                    id: "seller1_phone_number",
                    label: textContent.newContactForm.phone
                },
                value: (fieldData.seller1 && fieldData.seller1.cellPhone) ? fieldData.seller1.cellPhone : '',
                validation: {
                    isPhone: true
                },
                valid: true,
                touched: true
            }
        },
        seller2: {
            name: {
                inputType: "input",
                inputConfig: {
                    type: "text",
                    id: "seller2_name",
                    label: 'name'
                },
                value: (fieldData.seller2 && fieldData.seller2.name) ? fieldData.seller2.name : '',
                validation: {
                },
                valid: true,
                touched: true
            },
            email: {
                inputType: "input",
                inputConfig: {
                    type: "text",
                    id: "seller2_email",
                    label: textContent.newContactForm.email
                },
                value: (fieldData.seller2 && fieldData.seller2.email) ? fieldData.seller2.email : '',
                validation: {
                    isEmail: true
                },
                valid: true,
                touched: true
            },
            cellPhone: {
                inputType: "input",
                inputConfig: {
                    type: "text",
                    id: "seller2_phone_number",
                    label: textContent.newContactForm.phone
                },
                value: (fieldData.seller2 && fieldData.seller2.cellPhone) ? fieldData.seller2.cellPhone : '',
                validation: {
                    isPhone: true
                },
                valid: true,
                touched: true
            }
        },
        buyer1: {
            name: {
                inputType: "input",
                inputConfig: {
                    type: "text",
                    id: "buyer1_name",
                    label: 'name'
                },
                value: (fieldData.buyer1 && fieldData.buyer1.name) ? fieldData.buyer1.name : '',
                validation: {
                },
                valid: true,
                touched: true
            },
            email: {
                inputType: "input",
                inputConfig: {
                    type: "text",
                    id: "buyer1_email",
                    label: textContent.newContactForm.email
                },
                value: (fieldData.buyer1 && fieldData.buyer1.email) ? fieldData.buyer1.email : '',
                validation: {
                    isEmail: true
                },
                valid: true,
                touched: true
            },
            cellPhone: {
                inputType: "input",
                inputConfig: {
                    type: "text",
                    id: "buyer1_phone_number",
                    label: textContent.newContactForm.phone
                },
                value: (fieldData.buyer1 && fieldData.buyer1.cellPhone) ? fieldData.buyer1.cellPhone : '',
                validation: {
                    isPhone: true
                },
                valid: true,
                touched: true
            }
        },
        buyer2: {
            name: {
                inputType: "input",
                inputConfig: {
                    type: "text",
                    id: "buyer2_name",
                    label: 'name'
                },
                value: (fieldData.buyer2 && fieldData.buyer2.name) ? fieldData.buyer2.name : '',
                validation: {
                },
                valid: true,
                touched: true
            },
            email: {
                inputType: "input",
                inputConfig: {
                    type: "text",
                    id: "buyer2_email",
                    label: textContent.newContactForm.email
                },
                value: (fieldData.buyer2 && fieldData.buyer2.email) ? fieldData.buyer2.email : '',
                validation: {
                    isEmail: true
                },
                valid: true,
                touched: true
            },
            cellPhone: {
                inputType: "input",
                inputConfig: {
                    type: "text",
                    id: "buyer2_phone_number",
                    label: textContent.newContactForm.phone
                },
                value: (fieldData.buyer2 && fieldData.buyer2.cellPhone) ? fieldData.buyer2.cellPhone : '',
                validation: {
                    isPhone: true
                },
                valid: true,
                touched: true
            }
        },
        buyerAgent1: {
            name: {
                inputType: "input",
                inputConfig: {
                    type: "text",
                    id: "buyerAgent1_name",
                    label: 'name'
                },
                value: (fieldData.buyerAgent1 && fieldData.buyerAgent1.name) ? fieldData.buyerAgent1.name : '',
                validation: {
                },
                valid: true,
                touched: true
            },
            email: {
                inputType: "input",
                inputConfig: {
                    type: "text",
                    id: "buyerAgent1_email",
                    label: textContent.newContactForm.email
                },
                value: (fieldData.buyerAgent1 && fieldData.buyerAgent1.email) ? fieldData.buyerAgent1.email : '',
                validation: {
                    isEmail: true
                },
                valid: true,
                touched: true
            },
            cellPhone: {
                inputType: "input",
                inputConfig: {
                    type: "text",
                    id: "buyerAgent1_phone_number",
                    label: textContent.newContactForm.phone
                },
                value: (fieldData.buyerAgent1 && fieldData.buyerAgent1.cellPhone) ? fieldData.buyerAgent1.cellPhone : '',
                validation: {
                    isPhone: true
                },
                valid: true,
                touched: true
            }
        },
        listingAgent1: {
            name: {
                inputType: "input",
                inputConfig: {
                    type: "text",
                    id: "listingAgent1_name",
                    label: 'name'
                },
                value: (fieldData.listingAgent1 && fieldData.listingAgent1.name) ? fieldData.listingAgent1.name : '',
                validation: {
                },
                valid: true,
                touched: true
            },
            email: {
                inputType: "input",
                inputConfig: {
                    type: "text",
                    id: "listingAgent1_email",
                    label: textContent.newContactForm.email
                },
                value: (fieldData.listingAgent1 && fieldData.listingAgent1.email) ? fieldData.listingAgent1.email : '',
                validation: {
                    isEmail: true
                },
                valid: true,
                touched: true
            },
            cellPhone: {
                inputType: "input",
                inputConfig: {
                    type: "text",
                    id: "listingAgent1_phone_number",
                    label: textContent.newContactForm.phone
                },
                value: (fieldData.listingAgent1 && fieldData.listingAgent1.cellPhone) ? fieldData.listingAgent1.cellPhone : '',
                validation: {
                    isPhone: true
                },
                valid: true,
                touched: true
            }
        }
    }
}
        

class RoomContactInfoForm extends Component {
    state = {
        formValidated: true, 
        submitted: false,
        formData: getFormData(this.props),
    }

    getContactGroup = (inputGroupKey) => {
        let groupFormInputs = [];
        for(let inputKey in this.state.formData[inputGroupKey]) {
            let changeHandler = (event) => this.inputChangedHandler(event, inputGroupKey, inputKey);
            let input = this.state.formData[inputGroupKey][inputKey];
            groupFormInputs.push(
                <Input 
                    key={inputKey}
                    inputtype={input.inputType}
                    config={input.inputConfig}
                    value={input.value}
                    touched={input.touched}
                    valid={input.valid !== undefined && input.valid.toString()}
                    changed={changeHandler}/>
            )
        }
        return (
            <div className={classes.ContactGroup}>
                <h3>{labels[inputGroupKey]}</h3>
                <div className={classes.ContactInfo}>
                    {groupFormInputs}
                </div>
            </div>
        )
    }

    /*
    onChange handler that updates the state due to a change
    in an input element. After the change has been made, a 
    validation check is run to check if the value is 
    acceptable, setting the valid key. 
    */
    inputChangedHandler = (event, inputGroupKey, inputKey) => {
        const updatedFormData = {
        ...this.state.formData
        };
        const updatedFormGroup = { 
            ...updatedFormData[inputGroupKey]
        };
        const updatedInput = {
            ...updatedFormGroup[inputKey]
        }
        // Set the new value
        updatedInput.value = event.target.value;
        // Check if the new value is valid and set it
        // Force set '' before validation
        updatedInput.valid = 
            this.validateInput(updatedInput.value, updatedInput.validation);
        // Set this input element as touched
        updatedInput.touched = true;
        updatedFormGroup[inputKey] = updatedInput;
        updatedFormData[inputGroupKey] = updatedFormGroup;

        // Update whether or not the entire form is valid
        let formIsValid = true;
        for(let inputGroupKey in this.state.formData) {
            for(let inputKey in this.state.formData[inputGroupKey]) {
                formIsValid = this.state.formData[inputGroupKey][inputKey].valid && formIsValid;
            } 
        }

        // Update the form's state
        this.setState((prevState, props) => ({
            formValidated: formIsValid, 
            formData: updatedFormData
        }));
    }

    subHandler = async (event) => {
        event.preventDefault();

        //disable the submit button
        this.setState({submitted: true});

        //form submission in componentDidUpdate
    }

    componentDidUpdate = async () => {
        if(this.state.submitted) {
            // Build the room data from the state
            let fieldData = {};
            for(let inputGroupKey in this.state.formData) {
                const contact = {};
                for(let inputKey in this.state.formData[inputGroupKey]) {
                    // Skip empty string values
                    contact[inputKey] =this.state.formData[inputGroupKey][inputKey].value;       
                } 
                fieldData[inputGroupKey] = contact;
            }
            console.log(fieldData);
            try{
                const apiUrl = process.env.REACT_APP_API_URL;
                await axios.patch(`${apiUrl}/rooms/${this.props.roomId}`, fieldData, {withCredentials: true});
                // Update parent state with new info 
                const updatedFieldData = {...this.props.fieldData };
                for(const key in fieldData) {
                    updatedFieldData[key] = fieldData[key]
                }
                this.props.update(updatedFieldData);      
            }
            catch(error) {
                console.log('Error updating field data');
            }
        }
    }    
    render() {
        let contactGroups = [];
        for(let inputGroupKey in this.state.formData) {
            contactGroups.push(this.getContactGroup(inputGroupKey));
        }
        return(
            <form className={classes.Form}>
                {contactGroups}
                <Button clickHandler={this.subHandler} disabled={!this.state.formValidated || this.state.submitted}>{textContent.contactInfoForm.submit}</Button>
            </form>
        );
    }
    /*
    Helper method called by the onChange handler that checks if a
    specific input element's value is valid
    */
    validateInput = (value, rules) => {
        let isValid = true;
        if (!rules || value === "") {
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
}

export default RoomContactInfoForm;