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
import { Col, Grid, Row } from 'react-flexbox-grid';

class AdminPanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            buildings: [],
            referrals: [],
            messages: [],
            admins: [],
            showUserNotesModal: [],
            showBuildingNotesModal: [],
            numBuildingsLoaded: 0,
            numUsersLoaded: 0,
            numReferralsLoaded: 0,
            numMessagesLoaded: 0,
            usersTotal: 0,
            buildingsTotal: 0,
            referralsTotal: 0,
            messagesTotal: 0,
            myClientsShown: false,
            thisClientDataShown: ""
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

        this.unsubscribeOther = firestore.collection("other").doc("stats")
            .onSnapshot((doc) => {
                this.setState({
                    usersTotal: doc.data().usersTotal,
                    buildingsTotal: doc.data().buildingsTotal,
                    referralsTotal: doc.data().referralsTotal,
                    messagesTotal: doc.data().messagesTotal,
                })
            });
        
        this.loadMoreBuildings();
        this.loadMoreUsers();
        this.loadMoreReferrals();
        this.loadMoreMessages();
        
    }

    componentWillUnmount() {
        if(this.unsubscribeAdminUsers){
            this.unsubscribeAdminUsers();
        }

        if(this.unsubscribeOther){
            this.unsubscribeOther();
        }

        if(this.unsubscribeLoadUsers){
            this.unsubscribeLoadUsers();
        }

        if(this.unsubscribeLoadBuildings){
            this.unsubscribeLoadBuildings();
        }

        if(this.unsubscribeLoadReferrals){
            this.unsubscribeLoadReferrals();
        }

        if(this.unsubscribeLoadMessages){
            this.unsubscribeLoadMessages();
        }

        if(this.unsubscribeLoadMyUsers){
            this.unsubscribeLoadMyUsers();
        }

        if(this.unsubscribeLoadClientBuildings){
            this.unsubscribeLoadClientBuildings();
        }

        if(this.unsubscribeLoadClientReferrals){
            this.unsubscribeLoadClientReferrals();
        }

        if(this.unsubscribeLoadClientMessages){
            this.unsubscribeLoadClientMessages();
        }
    }   

    componentDidUpdate(prevProps, prevState){
        if(this.state.myClientsShown !== prevState.myClientsShown){
            this.loadMoreUsers();
        }

        if(this.state.thisClientDataShown  !== prevState.thisClientDataShown){
            this.loadMoreBuildings();
            this.unsubscribeLoadReferrals();
            this.unsubscribeLoadMessages();
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

    loadMoreUsers(){
        var newNumToLoad = this.state.numUsersLoaded;
        newNumToLoad = newNumToLoad+20
    
        this.setState({
            numUsersLoaded: newNumToLoad
        })

        if(this.state.myClientsShown){
            this.unsubscribeLoadMyUsers = firestore.collection("users").where("isAdmin", "==", false).where("assignedTo.userId", "==", this.props.user.uid).orderBy("timestamp", "desc").limit(newNumToLoad)
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

            if(this.unsubscribeLoadUsers){
                this.unsubscribeLoadUsers();
            }
        } else {
            this.unsubscribeLoadUsers = firestore.collection("users").where("isAdmin", "==", false).orderBy("timestamp", "desc").limit(newNumToLoad)
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

            if(this.unsubscribeLoadMyUsers){
                this.unsubscribeLoadMyUsers();
            }
        }
    }

    loadMoreBuildings(){
        var newNumToLoad = this.state.numBuildingsLoaded;
        newNumToLoad = newNumToLoad+20
    
        this.setState({
            numBuildingsLoaded: newNumToLoad
        })

        if(this.state.thisClientDataShown){
            this.unsubscribeLoadClientBuildings = firestore.collection("buildings").where("clientId", "==", this.state.thisClientDataShown).orderBy("timestamp", "desc").limit(newNumToLoad)
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

            if(this.unsubscribeLoadBuildings){
                this.unsubscribeLoadBuildings();
            }
        
        } else {
            this.unsubscribeLoadBuildings = firestore.collection("buildings").orderBy("timestamp", "desc").limit(newNumToLoad)
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

            if(this.unsubscribeLoadClientBuildings){
                this.unsubscribeLoadClientBuildings();
            }
        }
    }

    loadMoreReferrals(){
        var newNumToLoad = this.state.numReferralsLoaded;
        newNumToLoad = newNumToLoad+20
    
        this.setState({
            numReferralsLoaded: newNumToLoad
        })

        if(this.state.thisClientDataShown){
            this.unsubscribeLoadClientReferrals = firestore.collection("referrals").where("userId", "==", this.state.thisClientDataShown).orderBy("timestamp", "desc").limit(newNumToLoad)
                .onSnapshot((querySnapshot) => {
                    var tempRefs = [];
                    querySnapshot.forEach((doc) => {
                        var docWithMore = Object.assign({}, doc.data());
                        docWithMore.id = doc.id;
                        tempRefs.push(docWithMore);
                    });
                    this.setState({
                        referrals: tempRefs
                    })
                });

            if(this.unsubscribeLoadReferrals){
                this.unsubscribeLoadReferrals();
            }
        
        } else {
            this.unsubscribeLoadReferrals = firestore.collection("referrals").orderBy("timestamp", "desc").limit(newNumToLoad)
                .onSnapshot((querySnapshot) => {
                    var tempRefs = [];
                    querySnapshot.forEach((doc) => {
                        var docWithMore = Object.assign({}, doc.data());
                        docWithMore.id = doc.id;
                        tempRefs.push(docWithMore);
                    });
                    this.setState({
                        referrals: tempRefs
                    })
                });

            if(this.unsubscribeLoadClientReferrals){
                this.unsubscribeLoadClientReferrals();
            }
        }
    }

    loadMoreMessages(){
        var newNumToLoad = this.state.numMessagesLoaded;
        newNumToLoad = newNumToLoad+20
    
        this.setState({
            numMessagesLoaded: newNumToLoad
        })

        if(this.state.thisClientDataShown){
            this.unsubscribeLoadClientMessages = firestore.collection("messages").where("userId", "==", this.state.thisClientDataShown).orderBy("timestamp", "desc").limit(newNumToLoad)
                .onSnapshot((querySnapshot) => {
                    var tempMessages = [];
                    querySnapshot.forEach((doc) => {
                        var docWithMore = Object.assign({}, doc.data());
                        docWithMore.id = doc.id;
                        tempMessages.push(docWithMore);
                    });
                    this.setState({
                        messages: tempMessages
                    })
                });

            if(this.unsubscribeLoadMessages){
                this.unsubscribeLoadMessages();
            }
        
        } else {
            this.unsubscribeLoadMessages = firestore.collection("messages").orderBy("timestamp", "desc").limit(newNumToLoad)
                .onSnapshot((querySnapshot) => {
                    var tempMessages = [];
                    querySnapshot.forEach((doc) => {
                        var docWithMore = Object.assign({}, doc.data());
                        docWithMore.id = doc.id;
                        tempMessages.push(docWithMore);
                    });
                    this.setState({
                        messages: tempMessages
                    })
                });

            if(this.unsubscribeLoadClientMessages){
                this.unsubscribeLoadClientMessages();
            }
        }
        
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
                assignedTo: { userId: "", firstName: "", lastName: "" },
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

    toggleMyClients = (e) => {
        e.preventDefault()
        this.setState({
            myClientsShown: !this.state.myClientsShown
        });
    }

    toggleFilterByClient = (e, clientId = "") => {
        e.preventDefault()
        if(clientId){
            this.props.alert.success(`Showing only client "...${clientId.slice(0, 8)}" data.`)
            this.setState({
                thisClientDataShown: clientId
            });
        } else {
            this.props.alert.success('Showing all data again.')
            this.setState({
                thisClientDataShown: ""
            });
        }
    }

    render() {
        return (
            <>
            <div className="xl-container s-padding-t-b">
                <h1>Admin Panel</h1>
                <Grid fluid className="s-margin-b">
                    <Row>
                        <Col sm={12} md={3} className="s-margin-b">
                            <a className="btn btn-sm animated-button victoria-one" href="# " onClick={(e) => this.toggleMyClients(e)}>
                                <button type="button" className="just-text-btn">{this.state.myClientsShown ? "Hide" : "Show only"} my clients</button>
                            </a>
                        </Col>
                        {this.state.thisClientDataShown && (
                            <Col sm={12} md={3} className="s-margin-b">
                                <a className="btn btn-sm animated-button thar-four" href="# " onClick={(e) => this.toggleFilterByClient(e)}>
                                    <button type="button" className="just-text-btn">Show all data again</button>
                                </a>
                            </Col>
                        )} 
                    </Row>
                </Grid>
                <Tabs>
                    <TabList>
                        <Tab><b className="l-text">Clients</b></Tab>
                        <Tab><b className="l-text">Buildings</b></Tab>
                        <Tab><b className="l-text">Referrals</b></Tab>
                        <Tab><b className="l-text">Messages</b></Tab>
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
                                                <tr key={index} className={this.state.thisClientDataShown === user.id ? "background-xlight-blue" : ""}>
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
                                                        <span className="green text-hover-yellow" onClick={() => this.handleOpenUserNotesModal(index)}>notes</span> || <span className="green text-hover-yellow" onClick={(e) => this.toggleFilterByClient(e, user.id)}>filter by me</span> 
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
                            <div className="center-text l-text s-padding-t-b">
                                System total: {this.state.usersTotal}  
                                {((this.state.users.length+1)%20 !== 0) && !(this.state.users.length < this.state.numUsersLoaded) && (
                                    <>&nbsp;&nbsp;||&nbsp;&nbsp;<span className="l-text blue text-hover-green underline-hover cursor-pointer" onClick={()=>this.loadMoreUsers()}>load more...</span> </>
                                )}
                            </div>
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
                                                                    <option value={constant.DONE}>Done</option>
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
                                                    <span className="green text-hover-yellow" onClick={() => this.handleOpenBuildingNotesModal(index)}>notes</span> 
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
                            <div className="center-text l-text s-padding-t-b">
                                System total: {this.state.buildingsTotal}
                                {this.state.thisClientDataShown && (
                                    <>&nbsp;&nbsp;||&nbsp;&nbsp;Client's total: {this.state.buildings.length}</>
                                )}  
                                {((this.state.buildings.length+1)%20 !== 0) && !(this.state.buildings.length < this.state.numBuildingsLoaded) && (
                                    <>&nbsp;&nbsp;||&nbsp;&nbsp;<span className="l-text blue text-hover-green underline-hover cursor-pointer" onClick={()=>this.loadMoreBuildings()}>load more...</span> </>
                                )}
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="overflow-div s-margin-r-l">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Last 8 Referral ID</th>
                                        <th>Referee First Name</th>
                                        <th>Referee Last Name</th>
                                        <th>Referee Email</th>
                                        <th>Referee Phone</th>
                                        <th>Referrer First Name</th>
                                        <th>Referrer Last Name</th>
                                        <th>Referrer Email</th>
                                        <th>Referrer Phone</th>
                                        <th>Relation</th>
                                        <th>Sales Rep</th>
                                        <th>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { 
                                        this.state.referrals.map((ref, index) => {
                                            const dateAndTime = timestampToDateTime(ref.timestamp)
                                            return (
                                                <tr key={index}>
                                                    <td>...{ref.id.slice(0, 8)}</td>
                                                    <td>{ref.referee.firstName}</td>
                                                    <td>{ref.referee.lastName}</td>
                                                    <td>{ref.referee.email}</td>
                                                    <td>{ref.referee.phone}</td>
                                                    <td>{ref.referrer.firstName}</td>
                                                    <td>{ref.referrer.lastName}</td>
                                                    <td>{ref.referrer.email}</td>
                                                    <td>{ref.referrer.phone}</td>
                                                    <td>{ref.relation}</td>
                                                    <td>{ref.salesRep}</td>
                                                    <td>{dateAndTime.fullDate} @ {dateAndTime.fullTime}</td>
                                                </tr>
                                            )
                                        }) 
                                    } 
                                </tbody>
                            </table>
                            <div className="center-text l-text s-padding-t-b">
                                System total: {this.state.referralsTotal}  
                                {((this.state.referrals.length+1)%20 !== 0) && !(this.state.referrals.length < this.state.numReferralsLoaded) && (
                                    <>&nbsp;&nbsp;||&nbsp;&nbsp;<span className="l-text blue text-hover-green underline-hover cursor-pointer" onClick={()=>this.loadMoreReferrals()}>load more...</span> </>
                                )}
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="overflow-div s-margin-r-l">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Last 8 Message ID</th>
                                        <th>Sender Name</th>
                                        <th>Sender Email</th>
                                        <th>Message Body</th>
                                        <th>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { 
                                        this.state.messages.map((message, index) => {
                                            const dateAndTime = timestampToDateTime(message.timestamp)
                                            return (
                                                <tr key={index}>
                                                    <td>...{message.id.slice(0, 8)}</td>
                                                    <td>{message.name}</td>
                                                    <td>{message.email}</td>
                                                    <td>{message.message}</td>
                                                    <td>{dateAndTime.fullDate} @ {dateAndTime.fullTime}</td>
                                                </tr>
                                            )
                                        }) 
                                    } 
                                </tbody>
                            </table>
                            <div className="center-text l-text s-padding-t-b">
                                System total: {this.state.messagesTotal}  
                                {((this.state.messages.length+1)%20 !== 0) && !(this.state.messages.length < this.state.numMessagesLoaded) && (
                                    <>&nbsp;&nbsp;||&nbsp;&nbsp;<span className="blue text-hover-green underline-hover cursor-pointer" onClick={()=>this.loadMoreMessages()}>load more...</span> </>
                                )}
                            </div>
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
            </>
        )
    }
}

export default withAlert()(AdminPanel)