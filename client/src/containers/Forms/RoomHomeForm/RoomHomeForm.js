import React, {Component} from 'react';
import axios from 'axios';
import textContent from '../../../assets/text.json';
import Form from '../../../components/UI/Form/Form';

import classes from './RoomHomeForm.module.css';

const getStateOptions = () => {
    const stateOptions = {};
    stateOptions.CA = [
        { value: 'CA-AB', displayValue: 'Alberta' },
        { value: 'CA-BC', displayValue: 'British Columbia' },
        { value: 'CA-MB', displayValue: 'Manitoba' },
        { value: 'CA-NB', displayValue: 'New Brunswick' },
        { value: 'CA-NL', displayValue: 'Newfoundland and Labrador' },
        { value: 'CA-NT', displayValue: 'Northwest Territories' },
        { value: 'CA-NS', displayValue: 'Nova Scotia' },
        { value: 'CA-NU', displayValue: 'Nunavut' },
        { value: 'CA-ON', displayValue: 'Ontario' },
        { value: 'CA-PE', displayValue: 'Prince Edward Island' },
        { value: 'CA-QC', displayValue: 'Quebec' },
        { value: 'CA-SK', displayValue: 'Saskatchewan' },
        { value: 'CA-YT', displayValue: 'Yukon' }
    ];
    stateOptions.AU = [
        { value: 'AU-NSW', displayValue: 'New South Wales' },
        { value: 'AU-QLD', displayValue: 'Queensland' },
        { value: 'AU-SA', displayValue: 'South Australia' },
        { value: 'AU-TAS', displayValue: 'Tasmania' },
        { value: 'AU-VIC', displayValue: 'Victoria' },
        { value: 'AU-WA', displayValue: 'Western Australia' },
        { value: 'AU-ACT', displayValue: 'Australian Capital Territory' },
        { value: 'AU-NT', displayValue: 'Northern Territory' }
    ];
    stateOptions.NZ = [
        { value: 'NZ-AUK', displayValue: 'Auckland' },
        { value: 'NZ-BOP', displayValue: 'Bay of Plenty' },
        { value: 'NZ-CAN', displayValue: 'Canterbury' },
        { value: 'NZ-HKB', displayValue: "Hawke's Bay" },
        { value: 'NZ-MWT', displayValue: 'Manawatu-Wanganui' },
        { value: 'NZ-NTL', displayValue: 'Northland' },
        { value: 'NZ-OTA', displayValue: 'Otago' },
        { value: 'NZ-STL', displayValue: 'Southland' },
        { value: 'NZ-TKI', displayValue: 'Taranaki' },
        { value: 'NZ-WKO', displayValue: 'Waikato' },
        { value: 'NZ-WGN', displayValue: 'Wellington' },
        { value: 'NZ-WTC', displayValue: 'West Coast' },
        { value: 'NZ-GIS', displayValue: 'Gisborne District' },
        { value: 'NZ-MBH', displayValue: 'Marlborough District' },
        { value: 'NZ-NSN', displayValue: 'Nelson City' },
        { value: 'NZ-TAS', displayValue: 'Tasman District' },
        { value: 'NZ-CIT', displayValue: 'Chatham Islands Territory' }
    ];
    stateOptions.US = [
        { value: 'US-AL', displayValue: 'Alabama' },
        { value: 'US-AK', displayValue: 'Alaska' },
        { value: 'US-AZ', displayValue: 'Arizona' },
        { value: 'US-AR', displayValue: 'Arkansas' },
        { value: 'US-CA', displayValue: 'California' },
        { value: 'US-CO', displayValue: 'Colorado' },
        { value: 'US-CT', displayValue: 'Connecticut' },
        { value: 'US-DE', displayValue: 'Delaware' },
        { value: 'US-DC', displayValue: 'District of Columbia' },
        { value: 'US-FL', displayValue: 'Florida' },
        { value: 'US-GA', displayValue: 'Georgia' },
        { value: 'US-GU', displayValue: 'Guam' },
        { value: 'US-HI', displayValue: 'Hawaii' },
        { value: 'US-ID', displayValue: 'Idaho' },
        { value: 'US-IL', displayValue: 'Illinois' },
        { value: 'US-IN', displayValue: 'Indiana' },
        { value: 'US-IA', displayValue: 'Iowa' },
        { value: 'US-KS', displayValue: 'Kansas' },
        { value: 'US-KY', displayValue: 'Kentucky' },
        { value: 'US-LA', displayValue: 'Louisiana' },
        { value: 'US-ME', displayValue: 'Maine' },
        { value: 'US-MD', displayValue: 'Maryland' },
        { value: 'US-MA', displayValue: 'Massachusetts' },
        { value: 'US-MI', displayValue: 'Michigan' },
        { value: 'US-MN', displayValue: 'Minnesota' },
        { value: 'US-MS', displayValue: 'Mississippi' },
        { value: 'US-MO', displayValue: 'Missouri' },
        { value: 'US-MT', displayValue: 'Montana' },
        { value: 'US-NE', displayValue: 'Nebraska' },
        { value: 'US-NV', displayValue: 'Nevada' },
        { value: 'US-NH', displayValue: 'New Hampshire' },
        { value: 'US-NJ', displayValue: 'New Jersey' },
        { value: 'US-NM', displayValue: 'New Mexico' },
        { value: 'US-NY', displayValue: 'New York' },
        { value: 'US-NC', displayValue: 'North Carolina' },
        { value: 'US-ND', displayValue: 'North Dakota' },
        { value: 'US-OH', displayValue: 'Ohio' },
        { value: 'US-OK', displayValue: 'Oklahoma' },
        { value: 'US-OR', displayValue: 'Oregon' },
        { value: 'US-PA', displayValue: 'Pennsylvania' },
        { value: 'US-PR', displayValue: 'Puerto Rico' },
        { value: 'US-RI', displayValue: 'Rhode Island' },
        { value: 'US-SC', displayValue: 'South Carolina' },
        { value: 'US-SD', displayValue: 'South Dakota' },
        { value: 'US-TN', displayValue: 'Tennessee' },
        { value: 'US-TX', displayValue: 'Texas' },
        { value: 'US-VI', displayValue: 'US Virgin Islands' },
        { value: 'US-UT', displayValue: 'Utah' },
        { value: 'US-VT', displayValue: 'Vermont' },
        { value: 'US-VA', displayValue: 'Virginia' },
        { value: 'US-WA', displayValue: 'Washington' },
        { value: 'US-WV', displayValue: 'West Virginia' },
        { value: 'US-WI', displayValue: 'Wisconsin' },
        { value: 'US-WY', displayValue: 'Wyoming' }  
    ];
    return stateOptions;
}


/*
    This component encapsulated the form used by the Leads container
    to create new rooms from a lead.
    Props:
        lead (Object): The lead this room is being created for
    author: David Kennedy 
*/

let getFormData = (props) => {
    return {
        // Forum inputs displayed in the modal
        address1: {
            inputType: "input",
            inputConfig: {
                id: "address1",
                type: "text",
                label: "Address:"
            },
            value: (props.fieldData.address1) ? props.fieldData.address1 : '',
            validation: {
                required: true,
                minLength: 1
            },
            valid: true,
            touched: true
        },
        address2: {
            inputType: "input",
            inputConfig: {
                id: "address2",
                type: "text",
                label: "Address cntd:"
            },
            value: (props.fieldData.address2) ? props.fieldData.address2 : '',
            validation: {
            },
            valid: true,
            touched: true
        },
        totalPurchasePrice: {
            inputType: "input",
            inputConfig: {
                id: "totalPurchasePrice",
                type: "text",
                label: "List Price: $"
            },
            value: (props.fieldData.totalPurchasePrice) ? props.fieldData.totalPurchasePrice : 0,
            validation: {
                isNumeric: true
            },
            valid: true,
            touched: true
        },
        underContract: {
            inputType: "dropdown",
            inputConfig: {
                id: "underContract",
                label: "UnderContract",
                options: [
                    {value: true, displayValue: 'Yes'}, 
                    {value: false, displayValue: 'No'},
                ]
            },
            value: (props.fieldData.underContract !== null) ? props.fieldData.underContract : '',
            validation: {
            },
            valid: true,
            touched: true
        },
        country: {
            inputType: "country",
            inputConfig: {
                id: "country",
                options: [
                    {value: "US", displayValue: "United States"}, 
                    {value: "CA", displayValue: "Canada"},
                    {value: "AU", displayValue: "Australia"}, 
                    {value: "NZ", displayValue: "New Zealand"},
                ],
                label: textContent.newRoomForm.country
            },
            value: props.fieldData.state.substring(0, 2),
            validation: {},
            touched: true,
            valid: true
        },
        state: {
            inputType: "state",
            inputConfig: {
                id: "state",
                options: getStateOptions(),
                label: textContent.newRoomForm.state
            },
            value: props.fieldData.state,
            validation: {},
            valid: true,       
            touched: true 
        },
        city: {
            inputType: "input",
            inputConfig: {
                type: "text",
                id: "city",
                label: "City"
            },
            value: (props.fieldData.city) ? props.fieldData.city : '',
            validation: {
                required: true,
                minLength: 1
            },
            valid: true,
            touched: true
        },
        zipcode: {
            inputType: "input",
            inputConfig: {
                id: "postalCode",
                type: "text",
                label: "Postal Code:"
            },
            validation: {
                required: true,
                minLength: 5,
                maxLength: 5,
                isNumeric: true
            },
            touched: true,
            value: (props.fieldData.postalCode) ? props.fieldData.postalCode : '',
            valid: true
        }
    }
};

class RoomHomeForm extends Component {
    state = {
        formValidated: true, // Form is not validated by default
        formData: getFormData(this.props),
        submitted: false
    }

    /*
        Method sent to children to update form element state
    */
    updateState = (updatedFormData, formIsValid) => {
        this.setState({formData: updatedFormData, formValidated: formIsValid});
    }

    /*
        Form submission Handler obtains data from that state and sends it
        to the backend. Once the RoomID of the created room is received,
        it sets the state of the Layout container to Room and selectedRoom
        to the ID.
    */
    formSubmissionHandler = async (event) => {

        // Prevent page refresh
        event.preventDefault();

        //Disable submit button
        this.setState({submitted: true})

        // Build the room data from the state
        let fieldData = {};
        for(const inputField in this.state.formData) {
            // this.state.formData[fieldData][inputField.inputConfig.id] = inputField.value;
            if(inputField === 'country') continue;
            // Convert amount to a number
            if(inputField === 'totalPurchasePrice') fieldData[this.state.formData[inputField].inputConfig.id] = parseInt(this.state.formData[inputField].value, 10);
            else fieldData[this.state.formData[inputField].inputConfig.id] = this.state.formData[inputField].value;
        }

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

    render() {
        return (
            <div className={classes.Layout}>
                <Form 
                formSubmissionHandler={this.formSubmissionHandler}
                formValidated={this.state.formValidated}
                update={this.updateState}
                format='twoColumns'
                formData={this.state.formData} 
                buttonDisabled={this.state.submitted}/>
            </div>
        )
    }
}

export default RoomHomeForm;

