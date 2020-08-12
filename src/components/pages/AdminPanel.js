import React, { Component } from 'react'
import { firestore } from '../../Fire';
import { timestampToDateTime } from '../../utils/misc';
import {buildingStatusUpdateSchema} from '../../utils/formSchemas'
import * as constant from "../../utils/constants.js";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Field, Form, Formik } from 'formik';
import { withAlert } from 'react-alert';

class AdminPanel extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            users: [],
            buildings: []
        }
    }
    
    componentDidMount(){
        // Listen for Firestore changes
        this.unsubscribeBuildings = firestore.collection("buildings").orderBy("timestamp", "desc")
            .onSnapshot((querySnapshot) => {
                var tempBuildings = []
                querySnapshot.forEach((doc) => {
                    var docWithMore = Object.assign({}, doc.data());
                    docWithMore.id = doc.id;
                    tempBuildings.push(docWithMore);
                });
                this.setState({
                    buildings: tempBuildings
                })
            });

        this.unsubscribeUsers = firestore.collection("users").orderBy("timestamp", "desc")
            .onSnapshot((querySnapshot) => {
                var tempUsers = []
                querySnapshot.forEach((doc) => {
                    var docWithMore = Object.assign({}, doc.data());
                    docWithMore.id = doc.id;
                    tempUsers.push(docWithMore);
                });
                this.setState({
                    users: tempUsers
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
                                        return (
                                            <tr key={index}>
                                                <td>...{user.id.slice(0, 8)}</td>
                                                <td>{user.firstName}</td>
                                                <td>{user.lastName}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phone}</td>
                                                <td>{user.solarReasons.join(", ")}</td>
                                                <td>{dateAndTime.fullDate} @ {dateAndTime.fullTime}</td>
                                                <td>{user.assignedTo || "unassigned"}</td>
                                                <td>delete | notes </td>
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
                                        return (
                                            <tr key={index}>
                                                <td>...{building.id.slice(0, 8)}</td>
                                                <td>...{building.clientId.slice(0, 8)}</td>
                                                <td>{building.buildingName}</td>
                                                <td>
                                                <Formik
                                                    initialValues={initialBuildingStatusState}
                                                    validationSchema={buildingStatusUpdateSchema}
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
                                                <td>delete | notes | </td>
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

// TODO: for edittable fields like assigned to, 
// {this.state.question.status !== constant.RESOLVED && this.state.question.currentTechnician.id === this.props.user.uid && (
//     <td>
//       
//             <span className="text-inline-field">
//               <Field
//                 className=""
//                 name="count"
//                 onChange={props.handleChange}
//                 value={props.values.count}
//                 type="number"
//                 placeholder={props.values.count || `0`}
//               />
//             </span> 
            // &nbsp;&nbsp;
            // <button
            //   type="submit"
            //   className="just-text-btn green text-hover"
            //   disabled={!props.dirty || props.isSubmitting}
            // >
            //   save
            // </button>
//             {props.errors.count && props.touched.count ? (
//                 <div className="red">{props.errors.count}</div>
//               ) : (
//                 ""
//               )}

//     </td>
//   )}
