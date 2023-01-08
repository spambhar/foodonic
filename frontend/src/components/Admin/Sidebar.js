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
            Admin Console
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/home" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="columns">Dashboard</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/admin/verified-ngo" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="user-check">Verified NGO</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/admin/pending-verification" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="user-clock">Pending verification</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/admin/donors" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="users">Donors</CDBSidebarMenuItem>
            </NavLink>

            <NavLink exact to="/admin/profile" activeClassName="activeClicked">
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