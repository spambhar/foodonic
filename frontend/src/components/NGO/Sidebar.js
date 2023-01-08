import React from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{ display: 'flex', height: '100rem', overflow: 'scroll initial' , fontSize: '150%'}}>
      <CDBSidebar textColor="#ffffff" backgroundColor="#607877">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
            Welcome, {localStorage.getItem('username')}
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/home" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="columns">Dashboard</CDBSidebarMenuItem>
            </NavLink>
            {/* <NavLink exact to="/admin/verified-ngo" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="user-check">Verified NGO</CDBSidebarMenuItem>
            </NavLink> */}
            <NavLink exact to="/ngo/accepted-request" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="user-clock">Accepted Requests</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/ngo/past-drives" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="users">Past Food Donations</CDBSidebarMenuItem>
            </NavLink>

            <NavLink exact to="/ngo/profile" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="user-shield">Profile page</CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: 'center' }}>
          <div
            style={{
              padding: '20px 5px',
            }}
          >
            {/* Sidebar Footer */}
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;