import React, { Component } from "react";
import { CometChat } from "@cometchat-pro/chat";
import _ from "lodash";
import conversationIcon from "../../resources/images/recent/Icon 24px@2x.png";
import groupIcon from "../../resources/images/group/ic_people_outline@2x.png";

import Conversations from "./Conversations";
import Groups from "./Groups";

import ChatBody from "./ChatBody";

import {
  LISTENER_TYPING_INDICATOR,
  LISTENER_RT_PRESENCE,
  RT_GROUP_MEMBER_ACTIONS
} from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {

  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import GroupMembers from "./GroupMembers";
import Fade from "react-reveal/Fade";

class ChatBox extends Component {
  state = {
    activeConversation: [],
    activeSidebar: 3, //1 = contacts, 2 = groups, 3 = recent
    activeSubSidebar: false, // activeSidebar = 1 & true == blocked contacts, activeSidebar = 2 & true == group members,
    addNewGroupMember: false,
    typingIndicatorUIDs: [],
    showSidebarUtilitiesC: false,
    createGroupFormShow: false,
    showAskPasswordModal: false,
    protectedGroupAskPasswordGuid: 0,
    onlineUsers: 0,
    lastMessageId: 0,
    isMobile: window.innerWidth < 768
  };

  componentDidMount() {
    window.addEventListener("resize", this.updateWindowDimensions);

    let listenerId = LISTENER_TYPING_INDICATOR;

    CometChat.addMessageListener(
      listenerId,
      new CometChat.MessageListener({
        onTypingStarted: typingIndicator => {
          const typingUID = typingIndicator.sender.uid;

          let currentUIDs = this.state.typingIndicatorUIDs;

          let typingIndicatorUIDs = _.concat(currentUIDs, typingUID);

          this.setState({ typingIndicatorUIDs });
        },
        onTypingEnded: typingIndicator => {
          const typingUID = typingIndicator.sender.uid;

          let currentUIDs = this.state.typingIndicatorUIDs;

          let typingIndicatorUIDs = _.pull(currentUIDs, typingUID);

          this.setState({ typingIndicatorUIDs });
        }
      })
    );

    var listenerID5 = RT_GROUP_MEMBER_ACTIONS;

    CometChat.addGroupListener(
      listenerID5,
      new CometChat.GroupListener({
        onGroupMemberJoined: (message, joinedUser, joinedGroup) => {
          if (
            this.state.activeConversation.guid !== undefined &&
            joinedGroup.guid === this.state.activeConversation.guid
          ) {
            let activeConversation = joinedGroup;
            activeConversation.membersCount =
              this.state.activeConversation.membersCount + 1;
            this.setState({ activeConversation });
          }
        },
        onGroupMemberLeft: (message, leavingUser, group) => {
          if (
            this.state.activeConversation.guid !== undefined &&
            group.guid === this.state.activeConversation.guid
          ) {
            let activeConversation = group;
            activeConversation.membersCount =
              this.state.activeConversation.membersCount - 1;
            this.setState({ activeConversation });
          }
        }
      })
    );
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
    CometChat.removeMessageListener(LISTENER_TYPING_INDICATOR);
    CometChat.removeMessageListener(LISTENER_RT_PRESENCE);
    CometChat.removeMessageListener(RT_GROUP_MEMBER_ACTIONS);
  }

  handleOnRecentMessageSent = lastMessageId => {
    this.setState({ lastMessageId });
  };

  handleContactClick = uid => {
    if (this.state.activeConversation.uid !== uid) {
      CometChat.getUser(uid).then(
        user => {
          this.setState({ activeConversation: user });
        },
        error => {
          this.setState({ activeConversation: [] });
        }
      );
    }
  };

  handleConversationClick = (id, conversationType) => {
    console.log(id);
    if (conversationType === "user") {
      this.handleContactClick(id);
    } else {
      this.handleGroupClick(id);
    }
  };

  handleGroupClick = (guid, groupPassword = "") => {
    CometChat.getGroup(guid).then(
      group => {
        if (!group.hasJoined) {
          if (group.type === "password" && groupPassword === "") {
            this.setState({
              showAskPasswordModal: true,
              protectedGroupAskPasswordGuid: guid
            });
          } else {
            var GUID = guid;
            var password = groupPassword;
            var groupType = group.type;

            CometChat.joinGroup(GUID, groupType, password).then(
              group => {
                this.setState({
                  activeConversation: group,
                  showAskPasswordModal: false,
                  protectedGroupAskPasswordGuid: 0
                });
              },
              error => {
                this.setState({
                  activeConversation: [],
                  showAskPasswordModal: false,
                  protectedGroupAskPasswordGuid: 0
                });
              }
            );
          }
        } else {
          this.setState({ activeConversation: group });
        }
      },
      error => {
        this.setState({ activeConversation: [] });
      }
    );
  };

  handleTabClick = type => {
    if (this.state.activeSidebar !== type) {
      this.setState({
        activeSidebar: type,
        activeConversation: [],
        showSidebarUtilitiesC: false,
        activeSubSidebar: false,
        addNewGroupMember: false
      });
    }
  };

  showHideSidebarUtilites = e => {
    this.setState({ showSidebarUtilitiesC: !this.state.showSidebarUtilitiesC });
  };

  handleToggleSubSidebar = () => {
    this.setState({
      activeSubSidebar: true,
      addNewGroupMember: false,
      showSidebarUtilitiesC: false
    });
  };

  handleLeaveGroup = guid => {
    const GUID = guid; // guid of the group to join

    CometChat.leaveGroup(GUID).then(
      hasLeft => {
        this.setState({
          activeConversation: [],
          activeSubSidebar: false,
          addNewGroupMember: false
        });
      },

      error => {}
    );
  };

  refreshActiveConversation = GUID => {
    this.handleGroupClick(GUID);
  };

  updateWindowDimensions = () => {
    let isMobile = window.innerWidth < 768;
    this.setState({ isMobile: isMobile });
  };

  handleScreenChangesOnMobile = () => {
    if (this.state.activeSubSidebar)
      this.setState({ activeSubSidebar: false, addNewGroupMember: false });
    else if (!_.isEmpty(this.state.activeConversation))
      this.setState({ activeConversation: [] });
  };

  render() {
    let conversation_classes = "conversations px-4";
    let contact_classes = "contacts px-4";
    let group_member_classes = "contacts px-4";
    let group_classes = "groups px-4";
    let conversation_sidebar_classes = "py-3 flex-fill";
    let group_sidebar_classes = "py-3 flex-fill";
    let activeTabName;
    let utilities_sidebar_show;

    let createGroupOption;

    let showGroupMembers = false;
    if (this.state.activeSidebar === 2) {
      group_sidebar_classes += " active";
      utilities_sidebar_show = this.state.showSidebarUtilitiesC
        ? "contact-utilities-list bg-white"
        : "contact-utilities-list bg-white hidden";
      

      if (showGroupMembers) {
        group_member_classes += " active";
        activeTabName = "Group Members";
      } else {
        group_classes += " active";
        activeTabName = "Groups";
      }
    } else if (this.state.activeSidebar === 1) {
      
      utilities_sidebar_show = this.state.showSidebarUtilitiesC
        ? "contact-utilities-list bg-white"
        : "contact-utilities-list bg-white hidden";
    } else {
      conversation_sidebar_classes += " active";

      utilities_sidebar_show = this.state.showSidebarUtilitiesC
        ? "contact-utilities-list bg-white"
        : "contact-utilities-list bg-white hidden";

      conversation_classes += " active";
      activeTabName = "Conversations";
    }

    let chatSidebarVisiblity = "";
    let chatBodyVisiblity = "";
    if (this.state.isMobile) {
      if (this.state.activeSidebar === 1) {
        if (!_.isEmpty(this.state.activeConversation)) {
          chatSidebarVisiblity = "hidden";
        } else {
          chatBodyVisiblity = "hidden";
        }
      } else {
        //groups
        if (this.state.activeSubSidebar) {
          chatBodyVisiblity = "hidden";
        } else {
          if (!_.isEmpty(this.state.activeConversation)) {
            chatSidebarVisiblity = "hidden";
          } else {
            chatBodyVisiblity = "hidden";
          }
        }
      }
    }

    let chatSidebarClasses =
      "chat-sidebar col-md-5 col-xl-4 col-sm-12 col-xs-12 p-0 ";
    chatSidebarClasses += chatSidebarVisiblity;

    let navBtnSidebar;
    let sidebarUtlitiesIcoClasses = "sidebar-contact-utilities my-2 ml-4 ";

    if (this.state.activeSubSidebar) {
      // blocked contacts
      navBtnSidebar = (
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="ml-1 mr-2 back-arrow"
          onClick={() => this.handleScreenChangesOnMobile()}
        />
      );
      sidebarUtlitiesIcoClasses += " d-none";
    } else {
      sidebarUtlitiesIcoClasses += " d-inline-block";
    }
    return (
      <React.Fragment>
        <div className={chatSidebarClasses}>
          <div className="chat-sidebar-title px-4 py-3 m-0">
            <h3 className="d-inline-block">
              {navBtnSidebar}
              {activeTabName}
            </h3>
          </div>
          <div className={conversation_classes}  style={{height: "100%"}}>
            <Conversations
              handleConversationClick={this.handleConversationClick}
              activeID={
                this.state.activeConversation.uid !== undefined
                  ? this.state.activeConversation.uid
                  : this.state.activeConversation.guid !== undefined
                  ? this.state.activeConversation.guid
                  : ""
              }
              typingIndicatorUIDs={this.state.typingIndicatorUIDs}
              onlineUsers={this.state.onlineUsers}
              lastMessageId={this.state.lastMessageId}
            />
          </div>

          <div className={group_classes}  style={{height: "100%"}}>
            <Groups
              handleGroupClick={this.handleGroupClick}
              activeGUID={
                this.state.activeConversation.guid !== undefined
                  ? this.state.activeConversation.guid
                  : ""
              }
              showGroupMembers={showGroupMembers}
              createGroupFormShow={this.state.createGroupFormShow}
              showAskPasswordModal={this.state.showAskPasswordModal}
              protectedGroupAskPasswordGuid={
                this.state.protectedGroupAskPasswordGuid
              }
            />
          </div>

          <Fade right>
            <div className={group_member_classes}>
              <GroupMembers
                showGroupMembers={showGroupMembers}
                activeGUID={
                  this.state.activeConversation.guid !== undefined
                    ? this.state.activeConversation.guid
                    : ""
                }
                activeGUIDMemberCount={
                  this.state.activeConversation.membersCount
                }
                ownerRights={
                  (this.state.activeConversation.owner !== undefined &&
                    this.state.activeConversation.owner ===
                      this.props.user.uid) ||
                  this.state.activeConversation.scope === "admin"
                    ? true
                    : false
                }
                subjectUID={this.props.user.uid}
                refreshActiveConversation={this.refreshActiveConversation}
                handleScreenChangesOnMobile={this.handleScreenChangesOnMobile}
              />
            </div>
          </Fade>
          <div className="sidebar-tabs d-flex">
            <div
              id="conversation-sidebar"
              className={conversation_sidebar_classes}
              onClick={e => this.handleTabClick(3)}
            >
              <img src={conversationIcon} alt="conversationIcon" />
              <p className="m-0 text-font-grey">Conversations</p>
            </div>

            <div
              id="groups-sidebar"
              className={group_sidebar_classes}
              onClick={e => this.handleTabClick(2)}
            >
              <img src={groupIcon} alt="groupIcon" />
              <p className="m-0 text-font-grey">Groups</p>
            </div>
          </div>
        </div>
        <ChatBody
          activeConversation={this.state.activeConversation}
          subjectUID={this.props.user.uid}
          typingIndicatorUIDs={this.state.typingIndicatorUIDs}
          activeSidebar={this.state.activeSidebar}
          handleToggleSubSidebar={this.handleToggleSubSidebar}
          handleAddGroupMemberToggle={this.handleAddGroupMemberToggle}
          handleLeaveGroup={this.handleLeaveGroup}
          chatBodyVisiblity={chatBodyVisiblity}
          isMobile={this.state.isMobile}
          handleOnRecentMessageSent={this.handleOnRecentMessageSent}
          handleScreenChangesOnMobile={this.handleScreenChangesOnMobile}
          ownerRights={
            (this.state.activeConversation.owner !== undefined &&
              this.state.activeConversation.owner === this.props.user.uid) ||
            this.state.activeConversation.scope === "admin"
              ? true
              : false
          }
        />
      </React.Fragment>
    );
  }
}

export default ChatBox;
