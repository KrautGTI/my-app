import React, { Component } from 'react'
import { firestore, storage } from '../../Fire';
import { timestampToDateTime } from '../../utils/misc';
import { statusSchema, userAssignedToSchema, userNotesSchema, buildingNotesSchema } from '../../utils/formSchemas'
import * as constant from "../../utils/constants.js";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Field, Form, Formik } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Modal from 'react-modal';
import { Col, Grid, Row } from 'react-flexbox-grid';
import { genId } from '../../utils/misc';
import { Helmet } from 'react-helmet-async';
import { store } from 'react-notifications-component';

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
            showUploadProposalModal: [],
            numBuildingsLoaded: 0,
            numUsersLoaded: 0,
            numReferralsLoaded: 0,
            numMessagesLoaded: 0,
            usersTotal: 0,
            buildingsTotal: 0,
            referralsTotal: 0,
            messagesTotal: 0,
            myClientsShown: false,
            thisClientDataShown: "",
            filePath: null,
            fileUrl: "",
            fileProgress: 0,
            proposalSavedToDb: false,
            queryDirection: "desc",
            usersOrder: "timestamp",
            buildingsOrder: "timestamp",
            referralsOrder: "timestamp",
            messagesOrder: "timestamp",
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

        if(this.state.thisClientDataShown !== prevState.thisClientDataShown){
            this.loadMoreBuildings();
            this.loadMoreReferrals();
            this.loadMoreMessages();
        }

        if(this.state.queryDirection !== prevState.queryDirection || 
            this.state.usersOrder !== prevState.usersOrder || 
            this.state.buildingsOrder !== prevState.buildingsOrder || 
            this.state.referralsOrder !== prevState.referralsOrder || 
            this.state.messagesOrder !== prevState.messagesOrder){
            this.loadMoreUsers();
            this.loadMoreBuildings();
            this.loadMoreReferrals();
            this.loadMoreMessages();
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

    handleOpenUploadProposalModal = (index) => {
        var tempShowUploadProposalModal = this.state.showUploadProposalModal
        tempShowUploadProposalModal[index] = true
        this.setState({ showUploadProposalModal: tempShowUploadProposalModal });
    }

    handleCloseUploadProposalModal = (index) => {
        var choseToLeave = false;
        if(this.state.filePath && !this.state.fileUrl){
            const confirmFilePath = window.confirm("Looks like you've selected a file, but haven't uploaded it. Are you sure you want to close?");
            if(confirmFilePath){
                choseToLeave = true
            } else {
                console.log("User chose to stay.")
            }
        } else if(this.state.fileUrl && !this.state.proposalSavedToDb){
            const confirmFileUrl = window.confirm("Looks like you've uploaded a file, but haven't saved it to the database. Are you sure you want to close?");
            if(confirmFileUrl){
                choseToLeave = true
            } else {
                console.log("User chose to stay.")
            }
        } else {
            choseToLeave = true
        }

        if(choseToLeave){
            var tempShowUploadProposalModal = this.state.showUploadProposalModal
            tempShowUploadProposalModal[index] = false
            this.setState({ 
                showUploadProposalModal: tempShowUploadProposalModal,
                proposalSavedToDb: false
            });
        }
        
    }

    loadMoreUsers(){
        var newNumToLoad = this.state.numUsersLoaded;
        newNumToLoad = newNumToLoad+20
    
        this.setState({
            numUsersLoaded: newNumToLoad
        })

        if(this.state.myClientsShown){
            this.unsubscribeLoadMyUsers = firestore.collection("users").where("isAdmin", "==", false).where("assignedTo.userId", "==", this.props.user.uid).orderBy(this.state.usersOrder, this.state.queryDirection).limit(newNumToLoad)
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
            this.unsubscribeLoadUsers = firestore.collection("users").where("isAdmin", "==", false).orderBy(this.state.usersOrder, this.state.queryDirection).limit(newNumToLoad)
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
            this.unsubscribeLoadClientBuildings = firestore.collection("buildings").where("clientId", "==", this.state.thisClientDataShown).orderBy(this.state.buildingsOrder, this.state.queryDirection).limit(newNumToLoad)
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
            this.unsubscribeLoadBuildings = firestore.collection("buildings").orderBy(this.state.buildingsOrder, this.state.queryDirection).limit(newNumToLoad)
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
            this.unsubscribeLoadClientReferrals = firestore.collection("referrals").where("referrer.userId", "==", this.state.thisClientDataShown).orderBy(this.state.referralsOrder, this.state.queryDirection).limit(newNumToLoad)
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
            this.unsubscribeLoadReferrals = firestore.collection("referrals").orderBy(this.state.referralsOrder, this.state.queryDirection).limit(newNumToLoad)
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
            this.unsubscribeLoadClientMessages = firestore.collection("messages").where("userId", "==", this.state.thisClientDataShown).orderBy(this.state.messagesOrder, this.state.queryDirection).limit(newNumToLoad)
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
            this.unsubscribeLoadMessages = firestore.collection("messages").orderBy(this.state.messagesOrder, this.state.queryDirection).limit(newNumToLoad)
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
                store.addNotification({
                    title: "Success",
                    message: 'Successfully updated user assigned to field.',
                    type: "success",
                    insert: "top",
                    container: "top-center",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 5000,
                      onScreen: true
                    }
                  })
            }).catch((error) => {
                store.addNotification({
                    title: "Error",
                    message: `Error changing user assigned to field on database: ${error}`,
                    type: "danger",
                    insert: "top",
                    container: "top-center",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 5000,
                      onScreen: true
                    }
                  })
                console.error("Error changing user assignedTo on database: " + error);
            });
        } else {
            firestore.collection("users").doc(userId).set({
                assignedTo: { userId: "", firstName: "", lastName: "" },
            }, { merge: true }).then(() => {
                console.log("Successfully updated user assigned to.")
                store.addNotification({
                    title: "Success",
                    message: 'Successfully updated user assigned to field.',
                    type: "success",
                    insert: "top",
                    container: "top-center",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 5000,
                      onScreen: true
                    }
                  })
            }).catch((error) => {
                store.addNotification({
                    title: "Error",
                    message: `Error changing user assigned to field on database: ${error}`,
                    type: "danger",
                    insert: "top",
                    container: "top-center",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 5000,
                      onScreen: true
                    }
                  })
                console.error("Error changing user assignedTo on database: " + error);
            });
        }
    }

    updateBuildingStatus = (values, buildingId) => {
        firestore.collection("buildings").doc(buildingId).set({
            status: values.status
        }, { merge: true }).then(() => {
            console.log("Successfully updated building status.")
            store.addNotification({
                title: "Success",
                message: 'Successfully updated building status.',
                type: "success",
                insert: "top",
                container: "top-center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true
                }
              })
        }).catch((error) => {
            store.addNotification({
                title: "Error",
                message: `Error changing building status on database: ${error}`,
                type: "danger",
                insert: "top",
                container: "top-center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true
                }
              })
            console.error("Error changing building status on database: " + error);
        });
}

    updateReferralStatus = (values, referralId) => {
        firestore.collection("referrals").doc(referralId).set({
            status: values.status
        }, { merge: true }).then(() => {
            store.addNotification({
                title: "Success",
                message: 'Successfully updated referral status.',
                type: "success",
                insert: "top",
                container: "top-center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true
                }
              })
            console.log("Successfully updated referral status.")
        }).catch((error) => {
            store.addNotification({
                title: "Error",
                message: `Error changing referral status on database: ${error}`,
                type: "danger",
                insert: "top",
                container: "top-center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true
                }
              })
            console.error("Error changing referral status on database: " + error);
        });
    }

    updateMessageStatus = (values, messageId) => {
        firestore.collection("messages").doc(messageId).set({
            status: values.status
        }, { merge: true }).then(() => {
            console.log("Successfully updated message status.")
            store.addNotification({
                title: "Success",
                message: 'Successfully updated message status.',
                type: "success",
                insert: "top",
                container: "top-center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true
                }
              })
        }).catch((error) => {
            store.addNotification({
                title: "Error",
                message: `Error changing message status on database: ${error}`,
                type: "danger",
                insert: "top",
                container: "top-center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true
                }
              })
            console.error("Error changing message status on database: " + error);
        });
    }

    updateUserNotes = (values, userId) => {
        // See: https://github.com/zenoamaro/react-quill/issues/570
        var removedWeirdBr = values.notes.replace(/<p><br><\/p>/g, "")
        // Update firestore
        firestore.collection("users").doc(userId).set({
            notes: removedWeirdBr
        }, { merge: true }).then(() => {
            console.log("Successfully updated user notes.")
            store.addNotification({
                title: "Success",
                message: 'Successfully updated user notes.',
                type: "success",
                insert: "top",
                container: "top-center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true
                }
              })
        }).catch((error) => {
            store.addNotification({
                title: "Error",
                message: `Error changing user notes on database: ${error}`,
                type: "danger",
                insert: "top",
                container: "top-center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true
                }
              })
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
            store.addNotification({
                title: "Success",
                message: 'Successfully updated building notes.',
                type: "success",
                insert: "top",
                container: "top-center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true
                }
              })
        }).catch((error) => {
            store.addNotification({
                title: "Error",
                message: `Error changing building notes on database: ${error}`,
                type: "danger",
                insert: "top",
                container: "top-center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true
                }
              })
            console.error("Error changing building notes on database: " + error);
        });
    }

    handleFileChange = e => {
        if (e.target.files[0]) {
          const filePath = e.target.files[0];
          this.setState(() => ({ filePath }));
        }
    };

    handleFileUpload = (file) => {
        const randomId = genId(5)
        const uploadTask = storage.ref(`proposals/${randomId}-${file.name}`).put(file);
        uploadTask.on(
          "state_changed",
          snapshot => {
            // progress function ...
            const fileProgress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            this.setState({ fileProgress });
          },
          error => {
            // Error function ...
            console.log(error);
          },
          () => {
            // complete function ...
            storage
              .ref(`proposals/${randomId}-${file.name}`)
              .getDownloadURL()
              .then(fileUrl => {
                this.setState({ 
                    fileUrl
                 });
              });
          }
        );
    };

    uploadProposal = (buildingId) => {
        firestore.collection("buildings").doc(buildingId).set({
            proposalUrl: this.state.fileUrl,
            status: constant.READY
        }, { merge: true }).then(() => {
            this.setState({
                proposalSavedToDb: true,
                showUploadProposalModal: false
            })
            console.log("Successfully updated building proposal URL.")
            store.addNotification({
                title: "Success",
                message: "Successfully updated building proposal URL.",
                type: "success",
                insert: "top",
                container: "top-center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true
                }
              })
        }).catch((error) => {
            store.addNotification({
                title: "Error",
                message: `Error changing building proposal URL on database: ${error}`,
                type: "danger",
                insert: "top",
                container: "top-center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true
                }
              })
            console.error("Error changing building proposal URL on database: " + error);
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
            store.addNotification({
                title: "Success",
                message: `Showing only client "...${clientId.substring(clientId.length-8, clientId.length)}" data.`,
                type: "success",
                insert: "top",
                container: "top-center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true
                }
              })
            this.setState({
                thisClientDataShown: clientId
            });
        } else {
            store.addNotification({
                title: "Success",
                message: `Showing all data again.`,
                type: "success",
                insert: "top",
                container: "top-center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true
                }
              })
            this.setState({
                thisClientDataShown: ""
            });
        }
    }

    toggleQueryDirection = (e) => {
        e.preventDefault()
        if(this.state.queryDirection === "desc"){
            this.setState({
                queryDirection: "asc"
            });
        } else {
            this.setState({
                queryDirection: "desc"
            });
        }
    }

    orderUsers = (e, field) => {
        e.preventDefault()
        this.setState({
            usersOrder: field
        });
    }

    orderBuildings = (e, field) => {
        e.preventDefault()
        this.setState({
            buildingsOrder: field
        });
    }

    orderReferrals = (e, field) => {
        e.preventDefault()
        this.setState({
            referralsOrder: field
        });
    }

    orderMessages = (e, field) => {
        e.preventDefault()
        this.setState({
            messagesOrder: field
        });
    }

    render() {
        return (
            <>
            <Helmet>
                <title>Admin Panel | Prestige Power</title>
            </Helmet>
            <div className="xl-container s-padding-t-b">
                <h1>Admin Panel</h1>
                <Grid fluid className="s-margin-b">
                    <Row>
                        <Col sm={12} md={3} className="s-margin-b">
                            <a className="btn btn-sm animated-button victoria-one" href="# " onClick={(e) => this.toggleMyClients(e)}>
                                <button type="button" className="just-text-btn">{this.state.myClientsShown ? "Hide" : "Show only"} my clients</button>
                            </a>
                        </Col>
                        <Col sm={12} md={3} className="s-margin-b">
                            <a className="btn btn-sm animated-button victoria-one" href="# " onClick={(e) => this.toggleQueryDirection(e)}>
                                <button type="button" className="just-text-btn">
                                    Change direction to&nbsp;
                                    <span className="blue">
                                        {this.state.queryDirection === "desc" ? "descending" : "ascending"} 
                                        &nbsp;order&nbsp;
                                        {this.state.queryDirection === "desc" ? <i className="fas fa-chevron-down"/> : <i className="fas fa-chevron-up"/>}
                                    </span>
                                </button>
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
                                        <th><span className={this.state.usersOrder === "firstName" ? "green text-hover-yellow" : "text-hover-yellow"} onClick={(e) => this.orderUsers(e, "firstName")}>First Name</span></th>
                                        <th><span className={this.state.usersOrder === "lastName" ? "green text-hover-yellow" : "text-hover-yellow"} onClick={(e) => this.orderUsers(e, "lastName")}>Last Name</span></th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th><span className={this.state.usersOrder === "acquisition" ? "green text-hover-yellow" : "text-hover-yellow"} onClick={(e) => this.orderUsers(e, "acquisition")}>Acquisition</span></th>
                                        <th>Solar Reasons</th>
                                        <th><span className={this.state.usersOrder === "timestamp" ? "green text-hover-yellow" : "text-hover-yellow"} onClick={(e) => this.orderUsers(e, "timestamp")}>Timestamp</span></th>
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
                                                    <td>...{user.id.substring(user.id.length-8, user.id.length)}</td>
                                                    <td>{user.firstName}</td>
                                                    <td>{user.lastName}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.phone}</td>
                                                    <td>{user.acquisition}</td>
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
                                                        <span className="green text-hover-yellow" onClick={() => this.handleOpenUserNotesModal(index)}>notes</span> 
                                                        &nbsp;&nbsp;||&nbsp;&nbsp;
                                                        <span className="green text-hover-yellow" onClick={(e) => this.toggleFilterByClient(e, user.id)}>{this.state.thisClientDataShown === user.id ? "un-" : ""}filter by me</span> 
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
                                        <th><span className={this.state.buildingsOrder === "buildingName" ? "green text-hover-yellow" : "text-hover-yellow"} onClick={(e) => this.orderBuildings(e, "buildingName")}>Name</span></th>
                                        <th><span className={this.state.buildingsOrder === "status" ? "green text-hover-yellow" : "text-hover-yellow"} onClick={(e) => this.orderBuildings(e, "status")}>Status</span></th>
                                        <th><span className={this.state.buildingsOrder === "zip" ? "green text-hover-yellow" : "text-hover-yellow"} onClick={(e) => this.orderBuildings(e, "zip")}>ZIP</span></th>
                                        <th>Bill URL</th>
                                        <th>Proposal URL</th>
                                        <th>Proposal Preference</th>
                                        <th><span className={this.state.buildingsOrder === "isCommercial" ? "green text-hover-yellow" : "text-hover-yellow"} onClick={(e) => this.orderBuildings(e, "isCommercial")}>Commercial</span></th>
                                        <th><span className={this.state.buildingsOrder === "shaded" ? "green text-hover-yellow" : "text-hover-yellow"} onClick={(e) => this.orderBuildings(e, "shaded")}>Shaded</span></th>
                                        <th>Average Bill</th>
                                        <th><span className={this.state.buildingsOrder === "timestamp" ? "green text-hover-yellow" : "text-hover-yellow"} onClick={(e) => this.orderBuildings(e, "timestamp")}>Timestamp</span></th>
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
                                                    <td>...{building.id.substring(building.id.length-8, building.id.length)}</td>
                                                    <td>...{building.clientId.substring(building.clientId.length-8, building.clientId.length)}</td>
                                                    <td>{building.buildingName}</td>
                                                    <td>
                                                    <Formik
                                                        initialValues={initialBuildingStatusState}
                                                        validationSchema={statusSchema}
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
                                                    <td>{building.billUrl ? <a href={building.billUrl} target="_blank" rel="noopener noreferrer">View Bill</a> : "N/A"}</td>
                                                    <td>{building.proposalUrl ? <a href={building.proposalUrl} target="_blank" rel="noopener noreferrer">View Proposal</a> : "N/A"}</td>
                                                    <td>{building.proposalPref}</td>
                                                    <td>{building.isCommercial}</td>
                                                    <td>{building.shaded}</td>
                                                    <td>{building.averageBill}</td>
                                                    <td>{dateAndTime.fullDate} @ {dateAndTime.fullTime}</td>
                                                    <td>
                                                        <span className="green text-hover-yellow" onClick={() => this.handleOpenBuildingNotesModal(index)}>notes</span> 
                                                        {building.status === constant.PENDING && (
                                                            <>
                                                            &nbsp;&nbsp;||&nbsp;&nbsp;
                                                            <span className="green text-hover-yellow" onClick={() => this.handleOpenUploadProposalModal(index)}>upload proposal</span> 
                                                            </>
                                                        )}
                                                        
                                                        {/* Building notes */}
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
                                                        {/* Upload Proposal */}
                                                        <Modal
                                                            isOpen={this.state.showUploadProposalModal[index]}
                                                            className="l-container background-blue p-top-center"
                                                            contentLabel="Upload Client Proposal"
                                                            onRequestClose={() => this.handleCloseUploadProposalModal(index)}
                                                        >
                                                            <div className="white">
                                                                <h4 className="center-text">
                                                                    Update Client Proposal
                                                                    <i
                                                                        onClick={() => this.handleCloseUploadProposalModal(index)}
                                                                        className="fas fa-times right text-hover-red"
                                                                    />
                                                                </h4>
                                                                
                                                            </div>
                                                            <div className="l-container background-white">
                                                                <label className="no-margin">Upload the proposal:</label>
                                                                {!this.state.fileUrl && (
                                                                    <input type="file" onChange={this.handleFileChange} />
                                                                )}
                                                                <br/>
                                                                {this.state.fileProgress > 0 && ( 
                                                                    <div className="box-text-v-align">
                                                                        <progress value={this.state.fileProgress} max="100"/> <b className="s-padding-l">{this.state.fileProgress}%</b>
                                                                    </div>
                                                                )}
                                                                {this.state.filePath && !this.state.fileUrl && (
                                                                    <button type="button" onClick={() => this.handleFileUpload(this.state.filePath)}>
                                                                        Upload the file
                                                                    </button>
                                                                )}
                                                                {this.state.fileUrl && (
                                                                    <div>
                                                                        <b className="green">Uploaded successfully (<a rel="noopener noreferrer" href={this.state.fileUrl} target="_blank">click to view</a>), now save the URL to the database.</b>
                                                                    </div>
                                                                )}
                                                                <div className="center-text">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => this.uploadProposal(building.id)}
                                                                    >
                                                                        Save to database
                                                                    </button>
                                                                </div>
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
                                        <th><span className={this.state.referralsOrder === "referee.firstName" ? "green text-hover-yellow" : "text-hover-yellow"} onClick={(e) => this.orderReferrals(e, "referee.firstName")}>Referee First Name</span></th>
                                        <th><span className={this.state.referralsOrder === "referee.lastName" ? "green text-hover-yellow" : "text-hover-yellow"} onClick={(e) => this.orderReferrals(e, "referee.lastName")}>Referee Last Name</span></th>
                                        <th>Referee Email</th>
                                        <th>Referee Phone</th>
                                        <th>Last 8 Referrer ID</th>
                                        <th><span className={this.state.referralsOrder === "referrer.firstName" ? "green text-hover-yellow" : "text-hover-yellow"} onClick={(e) => this.orderReferrals(e, "referrer.firstName")}>Referrer First Name</span></th>
                                        <th><span className={this.state.referralsOrder === "referrer.lastName" ? "green text-hover-yellow" : "text-hover-yellow"} onClick={(e) => this.orderReferrals(e, "referrer.lastName")}>Referrer Last Name</span></th>
                                        <th>Referrer Email</th>
                                        <th>Referrer Phone</th>
                                        <th>Relation</th>
                                        <th><span className={this.state.referralsOrder === "salesRep" ? "green text-hover-yellow" : "text-hover-yellow"} onClick={(e) => this.orderReferrals(e, "salesRep")}>Sales Rep</span></th>
                                        <th><span className={this.state.referralsOrder === "status" ? "green text-hover-yellow" : "text-hover-yellow"} onClick={(e) => this.orderReferrals(e, "status")}>Status</span></th>
                                        <th><span className={this.state.referralsOrder === "timestamp" ? "green text-hover-yellow" : "text-hover-yellow"} onClick={(e) => this.orderReferrals(e, "timestamp")}>Timestamp</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { 
                                        this.state.referrals.map((ref, index) => {
                                            const dateAndTime = timestampToDateTime(ref.timestamp)
                                            const initialReferralStatusState = {
                                                status: ref.status
                                            }
                                            return (
                                                <tr key={index}>
                                                    <td>...{ref.id.substring(ref.id.length-8, ref.id.length)}</td>
                                                    <td>{ref.referee.firstName}</td>
                                                    <td>{ref.referee.lastName}</td>
                                                    <td>{ref.referee.email}</td>
                                                    <td>{ref.referee.phone}</td>
                                                    <td>{ref.referrer.userId ? `...${ref.referrer.userId.substring(ref.referrer.userId.length-8, ref.referrer.userId.length)}` : "N/A"}</td>
                                                    <td>{ref.referrer.firstName}</td>
                                                    <td>{ref.referrer.lastName}</td>
                                                    <td>{ref.referrer.email}</td>
                                                    <td>{ref.referrer.phone}</td>
                                                    <td>{ref.relation}</td>
                                                    <td>{ref.salesRep}</td>
                                                    <td>
                                                        <Formik
                                                            initialValues={initialReferralStatusState}
                                                            validationSchema={statusSchema}
                                                            enableReinitialize={true}
                                                            onSubmit={(values, actions) => {
                                                                this.updateReferralStatus(values, ref.id);
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
                                                                        <option value={constant.DONE}>Done</option>
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
                                                    <td>{dateAndTime.fullDate} @ {dateAndTime.fullTime}</td>
                                                </tr>
                                            )
                                        }) 
                                    } 
                                </tbody>
                            </table>
                            <div className="center-text l-text s-padding-t-b">
                                System total: {this.state.referralsTotal}  
                                {this.state.thisClientDataShown && (
                                    <>&nbsp;&nbsp;||&nbsp;&nbsp;Client's total: {this.state.referrals.length}</>
                                )}  
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
                                        <th>Last 8 User ID</th>
                                        <th><span className={this.state.messagesOrder === "name" ? "green text-hover-yellow" : "text-hover-yellow"} onClick={(e) => this.orderMessages(e, "name")}>Sender Name</span></th>
                                        <th>Sender Email</th>
                                        <th>Body</th>
                                        <th><span className={this.state.messagesOrder === "status" ? "green text-hover-yellow" : "text-hover-yellow"} onClick={(e) => this.orderMessages(e, "status")}>Status</span></th>
                                        <th><span className={this.state.messagesOrder === "timestamp" ? "green text-hover-yellow" : "text-hover-yellow"} onClick={(e) => this.orderMessages(e, "timestamp")}>Timestamp</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { 
                                        this.state.messages.map((message, index) => {
                                            const dateAndTime = timestampToDateTime(message.timestamp)
                                            const initialMessageStatusState = {
                                                status: message.status
                                            }
                                            return (
                                                <tr key={index}>
                                                    <td>...{message.id.substring(message.id.length-8, message.id.length)}</td>
                                                    <td>{message.userId ? `...${message.userId.substring(message.userId.length-8, message.userId.length)}` : "N/A"} </td>
                                                    <td>{message.name}</td>
                                                    <td>{message.email}</td>
                                                    <td>{message.message}</td>
                                                    <td>
                                                        <Formik
                                                            initialValues={initialMessageStatusState}
                                                            validationSchema={statusSchema}
                                                            enableReinitialize={true}
                                                            onSubmit={(values, actions) => {
                                                                this.updateMessageStatus(values, message.id);
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
                                                                        <option value={constant.DONE}>Done</option>
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
                                                    <td>{dateAndTime.fullDate} @ {dateAndTime.fullTime}</td>
                                                </tr>
                                            )
                                        }) 
                                    } 
                                </tbody>
                            </table>
                            <div className="center-text l-text s-padding-t-b">
                                System total: {this.state.messagesTotal}  
                                {this.state.thisClientDataShown && (
                                    <>&nbsp;&nbsp;||&nbsp;&nbsp;Client's total: {this.state.messages.length}</>
                                )}  
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

export default AdminPanel