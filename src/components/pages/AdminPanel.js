import React, { Component } from 'react'
import { firestore } from '../../Fire';
import { timestampToDateTime } from '../../utils/misc';
import { buildingStatusSchema, userAssignedToSchema, userNotesSchema, buildingNotesSchema } from '../../utils/formSchemas'
import * as constant from "../../utils/constants.js";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Field, Form, Formik } from 'formik';
import { withAlert } from 'react-alert';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Modal from 'react-modal';

class AdminPanel extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            users: [],
            buildings: [],
            admins: [],
            showUserNotesModal: [],
            showBuildingNotesModal: [],
        }

        this.modules = {
            toolbar: [
                [{'header': '2'}],
                [{size: []}],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}, 
                {'indent': '-1'}, {'indent': '+1'}],
                [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
                ['link', 'image'],
                ['clean']
            ],
            clipboard: {
              matchVisual: false,
            }
          }
        
        this.formats = [
            'header', 'size',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image', 'align'
        ]
    }
    
    componentDidMount(){
        // Listen for Firestore changes
        this.unsubscribeBuildings = firestore.collection("buildings").orderBy("timestamp", "desc")
            .onSnapshot((querySnapshot) => {
                var tempBuildings = []
                var tempShowBuildingModals = [];
                var count = 0;
                querySnapshot.forEach((doc) => {
                    var docWithMore = Object.assign({}, doc.data());
                    docWithMore.id = doc.id;
                    tempBuildings.push(docWithMore);
                    tempShowBuildingModals[count] = false;
                    count++
                });
                this.setState({
                    buildings: tempBuildings,
                    showBuildingNotesModal: tempShowBuildingModals
                })
            });

        this.unsubscribeUsers = firestore.collection("users").where("isAdmin", "==", false).orderBy("timestamp", "desc")
            .onSnapshot((querySnapshot) => {
                var tempUsers = [];
                var tempShowUserModals = [];
                var count = 0;
                querySnapshot.forEach((doc) => {
                    var docWithMore = Object.assign({}, doc.data());
                    docWithMore.id = doc.id;
                    tempUsers.push(docWithMore);
                    tempShowUserModals[count] = false;
                    count++
                });
                this.setState({
                    users: tempUsers,
                    showUserNotesModal: tempShowUserModals
                })
            });

        this.unsubscribeAdminUsers = firestore.collection("users").where("isAdmin", "==", true).orderBy("timestamp", "desc")
            .onSnapshot((querySnapshot) => {
                var tempAdmins = []
                querySnapshot.forEach((doc) => {
                    var docWithMore = Object.assign({}, doc.data());
                    docWithMore.id = doc.id;
                    tempAdmins.push(docWithMore);
                });
                this.setState({
                    admins: tempAdmins
                })
            });
    }

    componentWillUnmount() {
        if(this.unsubscribeUsers){
            this.unsubscribeUsers();
        }

        if(this.unsubscribeBuildings){
            this.unsubscribeBuildings();
        }

        if(this.unsubscribeAdminUsers){
            this.unsubscribeAdminUsers();
        }
    }   

    handleOpenUserNotesModal = (index) => {
        var tempShowUserModals = this.state.showUserNotesModal
        tempShowUserModals[index] = true
        this.setState({ showUserNotesModal: tempShowUserModals });
    }

    handleCloseUserNotesModal = (index) => {
        var tempShowUserModals = this.state.showUserNotesModal
        tempShowUserModals[index] = false
        this.setState({ showUserNotesModal: tempShowUserModals });
    }

    handleOpenBuildingNotesModal = (index) => {
        var tempShowBuildingModals = this.state.showBuildingNotesModal
        tempShowBuildingModals[index] = true
        this.setState({ showBuildingNotesModal: tempShowBuildingModals });
    }

    handleCloseBuildingNotesModal = (index) => {
        var tempShowBuildingModals = this.state.showUserNotesModal
        tempShowBuildingModals[index] = false
        this.setState({ showBuildingNotesModal: tempShowBuildingModals });
    }

    updateBuildingStatus = (values, buildingId) => {
            // Update firestore
            firestore.collection("buildings").doc(buildingId).set({
                status: values.status
            }, { merge: true }).then(() => {
                console.log("Successfully updated building status.")
                this.props.alert.success('Successfully updated building status.')
            }).catch((error) => {
                this.props.alert.error('Error changing building status on database: ' + error)
                console.error("Error changing building status on database: " + error);
            });
    }

    updateUserAssignedTo = (values, userId) => {
        if(values.assignedTo){
            console.log("Adding " + values.assignedTo + " to " + userId)
            const foundAdminInfo = this.state.admins.find(admin => admin.id === values.assignedTo)
            console.log("Found admin with name of: " + foundAdminInfo.firstName)
            // Update firestore
            firestore.collection("users").doc(userId).set({
                assignedTo: {
                    userId: values.assignedTo,
                    firstName: foundAdminInfo.firstName,
                    lastName: foundAdminInfo.lastName
                }
            }, { merge: true }).then(() => {
                console.log("Successfully updated user assigned to.")
                this.props.alert.success('Successfully updated user assignedTo.')
            }).catch((error) => {
                this.props.alert.error('Error changing user assignedTo on database: ' + error)
                console.error("Error changing user assignedTo on database: " + error);
            });
        } else {
            firestore.collection("users").doc(userId).set({
                assignedTo: {}
            }, { merge: true }).then(() => {
                console.log("Successfully updated user assigned to.")
                this.props.alert.success('Successfully updated user assignedTo.')
            }).catch((error) => {
                this.props.alert.error('Error changing user assignedTo on database: ' + error)
                console.error("Error changing user assignedTo on database: " + error);
            });
        }
        
    }

    updateUserNotes = (values, userId) => {
        // See: https://github.com/zenoamaro/react-quill/issues/570
        var removedWeirdBr = values.notes.replace(/<p><br><\/p>/g, "")
        // Update firestore
        firestore.collection("users").doc(userId).set({
            notes: removedWeirdBr
        }, { merge: true }).then(() => {
            console.log("Successfully updated user notes.")
            this.props.alert.success('Successfully updated user notes.')
        }).catch((error) => {
            this.props.alert.error('Error changing user notes on database: ' + error)
            console.error("Error changing user notes on database: " + error);
        });
    }

    updateBuildingNotes = (values, buildingId) => {
        // See: https://github.com/zenoamaro/react-quill/issues/570
        var removedWeirdBr = values.notes.replace(/<p><br><\/p>/g, "")
        // Update firestore
        firestore.collection("buildings").doc(buildingId).set({
            notes: removedWeirdBr
        }, { merge: true }).then(() => {
            console.log("Successfully updated building notes.")
            this.props.alert.success('Successfully updated building notes.')
        }).catch((error) => {
            this.props.alert.error('Error changing building notes on database: ' + error)
            console.error("Error changing building notes on database: " + error);
        });
    }

    render() {
        return (
            <>
            <div className="xl-container">
                <h1>Admin Panel</h1>
            </div>
            <Tabs className="xl-container no-padding">
                <TabList>
                    <Tab><b className="l-text">Users</b></Tab>
                    <Tab><b className="l-text">Buildings</b></Tab>
                </TabList>

                <TabPanel>
                    <div className="overflow-div s-margin-r-l">
                        <table>
                            <thead>
                                <tr>
                                    <th>Last 8 Client ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Solar Reasons</th>
                                    <th>Timestamp</th>
                                    <th>Assigned To</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                { 
                                    this.state.users.map((user, index) => {
                                        const dateAndTime = timestampToDateTime(user.timestamp)
                                        const initialUserAssignedToState = {
                                            assignedTo: user.assignedTo.userId
                                        }
                                        const initialUserNotesState = {
                                            notes: user.notes
                                        }
                                        return (
                                            <tr key={index}>
                                                <td>...{user.id.slice(0, 8)}</td>
                                                <td>{user.firstName}</td>
                                                <td>{user.lastName}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phone}</td>
                                                <td>{user.solarReasons.join(", ")}</td>
                                                <td>{dateAndTime.fullDate} @ {dateAndTime.fullTime}</td>
                                                <td>
                                                    <Formik
                                                        initialValues={initialUserAssignedToState}
                                                        validationSchema={userAssignedToSchema}
                                                        enableReinitialize={true}
                                                        onSubmit={(values, actions) => {
                                                            this.updateUserAssignedTo(values, user.id);
                                                        }}
                                                    >
                                                        {props => (
                                                            <Form onSubmit={props.handleSubmit}>
                                                                <Field
                                                                    component="select" 
                                                                    name="assignedTo" 
                                                                    className="table-select"
                                                                    value={props.values.assignedTo}
                                                                    onChange={props.handleChange}
                                                                    >
                                                                    <option defaultValue value="">N/A</option> 
                                                                    { this.state.admins.map((admin, index) => {return(<option key={index} value={admin.id}>{admin.firstName} {admin.lastName}</option>)}) }
                                                                </Field>
                                                                &nbsp;&nbsp;
                                                                <button
                                                                    type="submit"
                                                                    className="just-text-btn green text-hover"
                                                                    disabled={!props.dirty || props.isSubmitting}
                                                                >
                                                                    save
                                                                </button>
                                                            </Form>
                                                        )}
                                                    </Formik>
                                                </td>
                                                <td>
                                                    {/* TODO: always opening the last item in the users array because only one handleOpenUserNotesModal state var, maybe just make this into a drop down with no modal? no that would require a state var too...  */}
                                                    <span className="green text-hover-yellow" onClick={() => this.handleOpenUserNotesModal(index)}>notes</span> | delete |  
                                                    <Modal
                                                        isOpen={this.state.showUserNotesModal[index]}
                                                        className="l-container background-blue p-top-center overflow-scroll eighty-height"
                                                        contentLabel="Update User Notes"
                                                        onRequestClose={() => this.handleCloseUserNotesModal(index)}
                                                    >
                                                        <div className="white">
                                                            <h4 className="center-text">
                                                                Update User Notes
                                                                <i
                                                                    onClick={() => this.handleCloseUserNotesModal(index)}
                                                                    className="fas fa-times right text-hover-red"
                                                                />
                                                            </h4>
                                                            
                                                        </div>
                                                        <div className="l-container background-white">
                                                            <Formik
                                                                initialValues={initialUserNotesState}
                                                                validationSchema={userNotesSchema}
                                                                enableReinitialize={true}
                                                                onSubmit={(values, actions) => {
                                                                    this.updateUserNotes(values, user.id);
                                                                }}
                                                            >
                                                                {props => (
                                                                    <Form onSubmit={props.handleSubmit}>
                                                                        <Field name="notes">
                                                                            {({ field }) => 
                                                                                <ReactQuill 
                                                                                    value={field.value || ''} 
                                                                                    modules={this.modules}
                                                                                    formats={this.formats}
                                                                                    placeholder="This can be a simple or complex body of text with links to webpages, bolded text, headers, and more!"
                                                                                    onChange={field.onChange(field.name)} />
                                                                            }
                                                                        </Field>
                                                                        <br/>
                                                                        <div className="center-text">
                                                                            <button
                                                                                type="submit"
                                                                                disabled={!props.dirty || props.isSubmitting}
                                                                            >
                                                                                Save
                                                                            </button>
                                                                        </div>
                                                                    </Form>
                                                                )}
                                                            </Formik>
                                                        </div>
                                                    </Modal>
                                                </td>
                                            </tr>
                                        )
                                    }) 
                                } 
                            </tbody>
                        </table>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="overflow-div s-margin-r-l">
                        <table>
                            <thead>
                                <tr>
                                    <th>Last 8 Building ID</th>
                                    <th>Last 8 Client ID</th>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>ZIP</th>
                                    <th>Bill URL</th>
                                    <th>Shaded</th>
                                    <th>Average Bill</th>
                                    <th>Timestamp</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                { 
                                    this.state.buildings.map((building, index) => {
                                        const dateAndTime = timestampToDateTime(building.timestamp)
                                        const initialBuildingStatusState = {
                                            status: building.status
                                        }
                                        const initialBuildingNotesState = {
                                            notes: building.notes
                                        }
                                        return (
                                            <tr key={index}>
                                                <td>...{building.id.slice(0, 8)}</td>
                                                <td>...{building.clientId.slice(0, 8)}</td>
                                                <td>{building.buildingName}</td>
                                                <td>
                                                <Formik
                                                    initialValues={initialBuildingStatusState}
                                                    validationSchema={buildingStatusSchema}
                                                    enableReinitialize={true}
                                                    onSubmit={(values, actions) => {
                                                        this.updateBuildingStatus(values, building.id);
                                                    }}
                                                >
                                                    {props => (
                                                        <Form onSubmit={props.handleSubmit}>
                                                            <Field
                                                                component="select" 
                                                                name="status" 
                                                                className="table-select"
                                                                value={props.values.status}
                                                                onChange={props.handleChange}
                                                                >
                                                                <option defaultValue value="">N/A</option> 
                                                                <option value={constant.PENDING}>Pending</option>
                                                                <option value={constant.READY}>Ready</option>
                                                                <option value={constant.EXPIRED}>Expired</option>
                                                            </Field>
                                                            &nbsp;&nbsp;
                                                            <button
                                                                type="submit"
                                                                className="just-text-btn green text-hover"
                                                                disabled={!props.dirty || props.isSubmitting}
                                                            >
                                                                save
                                                            </button>
                                                        </Form>
                                                    )}
                                                </Formik>
                                                </td>
                                                <td>{building.zip}</td>
                                                <td>{building.billUrl ? <a href={building.billUrl} target="_blank" rel="noopener noreferrer">View Bill URL</a> : "Not provided"}</td>
                                                <td>{building.shaded}</td>
                                                <td>{building.averageBill}</td>
                                                <td>{dateAndTime.fullDate} @ {dateAndTime.fullTime}</td>
                                                <td>
                                                <span className="green text-hover-yellow" onClick={() => this.handleOpenBuildingNotesModal(index)}>notes</span> | delete |  
                                                    <Modal
                                                        isOpen={this.state.showBuildingNotesModal[index]}
                                                        className="l-container background-blue p-top-center"
                                                        contentLabel="Update Building Notes"
                                                        onRequestClose={() => this.handleCloseBuildingNotesModal(index)}
                                                    >
                                                        <div className="white">
                                                            <h4 className="center-text">
                                                                Update Building Notes
                                                                <i
                                                                    onClick={() => this.handleCloseBuildingNotesModal(index)}
                                                                    className="fas fa-times right text-hover-red"
                                                                />
                                                            </h4>
                                                            
                                                        </div>
                                                        <div className="l-container background-white">
                                                            <Formik
                                                                initialValues={initialBuildingNotesState}
                                                                validationSchema={buildingNotesSchema}
                                                                enableReinitialize={true}
                                                                onSubmit={(values, actions) => {
                                                                    this.updateBuildingNotes(values, building.id);
                                                                }}
                                                            >
                                                                {props => (
                                                                    <Form onSubmit={props.handleSubmit}>
                                                                        <Field name="notes">
                                                                            {({ field }) => 
                                                                                <ReactQuill 
                                                                                    value={field.value || ''} 
                                                                                    modules={this.modules}
                                                                                    formats={this.formats}
                                                                                    placeholder="This can be a simple or complex body of text with links to webpages, bolded text, headers, and more!"
                                                                                    onChange={field.onChange(field.name)} />
                                                                            }
                                                                        </Field>
                                                                        <br/>
                                                                        <div className="center-text">
                                                                            <button
                                                                                type="submit"
                                                                                disabled={!props.dirty || props.isSubmitting}
                                                                            >
                                                                                Save
                                                                            </button>
                                                                        </div>
                                                                    </Form>
                                                                )}
                                                            </Formik>
                                                        </div>
                                                    </Modal>
                                                </td>
                                            </tr>
                                        )
                                    }) 
                                } 
                            </tbody>
                        </table>
                    </div>
                </TabPanel>
            </Tabs>
            </>
        )
    }
}

export default withAlert()(AdminPanel)