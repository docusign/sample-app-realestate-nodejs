
import React, { Component } from 'react';
import localForage from 'localforage';
import Lead from '../../components/Lead/Lead';
import Modal from '../../components/UI/Modal/Modal';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
import NewRoomForm from '../Forms/NewRoomForm/NewRoomForm';
import NewContactForm from '../Forms/NewContactForm/NewContactForm';
import jsonLeads from '../../assets/localLeads.json';
import textContent from '../../assets/text.json';

import classes from './Leads.module.css';


/*
    Leads container that displays leads stored in local storage to the user. If the user
        does not have any leads in his local storage, the default leads are added.
    author: David Kennedy
*/


/*
    Gets leads from local storage, if none are there, inserts the leeads from localLeads.json
    and returns these leads.
*/
const getLeads = () => {
    //get leads from local storage, if there are none
    //load the leads from json file to local storage
    return localForage.getItem('leads')
        .then(async (leads) => {
            //if there are no leads in local storage, copy test leads
            if (leads === null) {
                leads = jsonLeads.leads;
                await localForage.setItem('leads', leads);
            }
            return leads;
        });
};

class Leads extends Component {
    state = {
        leads: [], //the leads loaded from json file and local storage
        selectedLead: null,  //stores the lead that is currently selected
        displayRoomForm: false, //controls whether or not the modal and backdrop is displayed
        displayContactForm: false, //controls whether or not the modal and backdrop is displayed
        displayInfo: false //controls whether or not the modal and backdrop is displayed
    };

    /*
        Modal toggle handler which controls
        whether or not the modal is displayed

        Parameters:
            form (String) either 'room' or 'contact' for which form is being 
    */
    modalToggleHandler = (form) => {
        if (form === 'room') {
            this.setState((prevState, props) => ({
                displayRoomForm: !prevState.displayRoomForm
            }))
        } else if (form === 'contact') {
            this.setState((prevState, props) => ({
                displayContactForm: !prevState.displayContactForm
            }))
        } else if (form === 'off') {
            this.setState((prevState, props) => ({
                displayRoomForm: false,
                displayContactForm: false,
                displayInfo: false
            }))
        } else if (form === 'info') {
            this.setState((prevState, props) => ({
                displayInfo: !prevState.displayInfo
            }))
        }
    }

    /*
    Modal toggle handler which controls
    whether or not the Create Room Form is displayed and sets
    the index of the selectedLead to the index parameter. 

    Parameters:
        index: (Integer) the index of the room in local storage
    */
    createRoomButtonHandler = (index) => {
        this.setState((prevState, props) => ({
            displayRoomForm: !prevState.displayRoomForm,
            selectedLead: index
        }))
    }

    /*
        Sub Handler that adds the new lead to local storage
        props:
            newLead: See Lead for data structure
    */
    createLeadFormSubHandler = (newLead) => {
        //get leads from local storage, if there are none
        //load the leads from json file to local storage
        localForage.getItem('leads')
            .then(leads => {
                // Add new lead to the leads array
                leads.unshift(newLead);
                //update the state with the new lead
                this.setState({
                    leads: leads,
                    displayContactForm: false
                });
                return localForage.setItem('leads', leads);
            });
    }

    async componentDidMount() {
        const leads = await getLeads();
        this.setState({
            leads: leads
        });
    }

    render() {
        let leadInfo = null;
        if (this.state.selectedLead !== null) {
            leadInfo = this.state.leads[this.state.selectedLead];
        }
        const leads = this.state.leads.map((lead, index) => {
            return (
                <Lead
                    key={index}
                    firstName={lead.firstName}
                    lastName={lead.lastName}
                    email={lead.email}
                    phoneNumber={lead.phoneNumber}
                    click={() => this.createRoomButtonHandler(index)}
                    infoToggle={this.modalToggleHandler.bind(this, 'info')}
                    room={lead.room}
                    renderLastCreatedRoom={this.props.renderSelectedRoom.bind(this, lead.room)}
                    showInfo={this.state.displayInfo}
                    viewRoomClickable={lead.roooms} />
            )
        });

        return (
            <React.Fragment>
                <Backdrop
                    show={this.state.displayRoomForm || this.state.displayContactForm || this.state.displayInfo}
                    click={this.modalToggleHandler.bind(this, 'off')} />
                <Modal show={this.state.displayRoomForm} click={this.modalToggleHandler.bind(this, 'room')} type="Form"><NewRoomForm lead={leadInfo} index={this.state.selectedLead} renderSelectedRoom={this.props.renderSelectedRoom} /></Modal>
                <Modal show={this.state.displayContactForm} click={this.modalToggleHandler.bind(this, 'contact')} type="Form"><NewContactForm sub={this.createLeadFormSubHandler} /></Modal>
                <div className={classes.Leads}>
                    <div className={classes.LeadContent}>
                        <div className={classes.TitleBar}>
                            <h1 className={classes.TitleHeader}>{textContent.leads.title}</h1>
                            <button className={classes.Button} onClick={this.modalToggleHandler.bind(this, 'contact')}>{textContent.leads.create}</button>
                        </div>
                        <div className={classes.LeadsBox}>{leads}</div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Leads;
