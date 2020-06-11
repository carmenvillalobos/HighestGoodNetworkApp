import React from 'react';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock'
import { shallow, mount } from 'enzyme';
import UserManagement from '../components/UserManagement'
import UserSearchPanel from '../components/UserManagement/UserSearchPanel';
import UserTableHeader from '../components/UserManagement/UserTableHeader';
import UserTableData from '../components/UserManagement/UserTableData';
import UserTableSearchHeader from '../components/UserManagement/UserTableSearchHeader';
import UserTableFooter from '../components/UserManagement/UserTableFooter';

import { Provider } from 'react-redux';
jest.mock('../components/UserProfile');

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('User Management Component', () => {
  let userManagementComponent;

  const store = mockStore({
    allUserProfiles: {
      userProfiles: [{
        email: "onecommunityglobal@gmail.com",
        firstName: "Test",
        isActive: true,
        lastName: "Admin",
        role: "Administrator",
        weeklyComittedHours: 0,
        _id: "5c4cc2109487b0003924f1e3"
      },
      {
        email: "onecommunityglobal@gmail.com",
        firstName: "Test",
        isActive: false,
        lastName: "Volunteer",
        role: "Volunteer",
        weeklyComittedHours: 0,
        _id: "5c4cc2109487b0001000sdfs"
      }],
      fetching: false
    }
  })

  afterEach(() => {
    fetchMock.restore()
  })

  beforeEach(() => {
    userManagementComponent = mount(
      <Provider store={store}>
        <UserManagement />
      </Provider>
    );
  });

  describe("Structure", () => {
    it('verifying the usermanagement component is rendering properly', () => {
      expect(userManagementComponent).not.toBeNull();
      expect(userManagementComponent.find(UserManagement).length).toBe(1);
      expect(userManagementComponent.find('.container').length).toBe(1);
      expect(userManagementComponent.find('.usermanagement__tr').length).toBe(2);
      expect(userManagementComponent.find('#tr_user_0').length).toBe(1);
      expect(userManagementComponent.find('#tr_user_1').length).toBe(1);
    })

    it('verifying the search panel component structure', () => {
      let searchBar = shallow(<UserSearchPanel
        onNewUserClick={jest.fn()}
        onSearch={jest.fn()}
        onActiveFiter={jest.fn()} />)
      expect(searchBar).not.toBeNull();
      expect(searchBar.find('.btn').length).toBe(1);
      expect(searchBar.find('.form-control').length).toBe(1);
      expect(searchBar.find('.input-group-prepend').length).toBe(2);
    })

    it('verifying the table data component structure', () => {
      let component = shallow(<UserTableData index={1}
        firstName="New"
        lastName="Test"
        role="Administrator"
        email="infor@hgn.net"
        weeklyComittedHours={10}
        isActive={true} />)
      expect(component).not.toBeNull();
      expect(component.find('.usermanagement__tr').length).toBe(1);
      expect(component.find('td').length).toBe(7);
    })

    it('verifying the table footer component structure', () => {
      let component = shallow(<UserTableFooter
        onSelectPageSize={jest.fn()}
        onPageSelect={jest.fn()} selectedPage={1} datacount={25} pageSize={10}
      />)
      expect(component).not.toBeNull();
      expect(component.find('.btn-default').length).toBe(2);
    })

    it('verifying the table header component structure', () => {
      let component = shallow(<UserTableHeader />)
      expect(component).not.toBeNull();
      expect(component.find('th').length).toBe(7);
    })

    it('verifying the table search header component structure', () => {
      let component = shallow(<UserTableSearchHeader
        onFirstNameSearch={jest.fn()}
        onLastNameSearch={jest.fn()}
        onRoleSearch={jest.fn()}
        onEmailSearch={jest.fn()}
        onWeeklyHrsSearch={jest.fn()}
      />)
      expect(component).not.toBeNull();
      expect(component.find('td').length).toBe(7);
    })
  })

  describe("Behavior", () => {
    it('verifying the active filter', () => {
      const event = { target: { name: "active-filter-dropdown", value: "active" } };
      // verifying before changing the active filter - 2 rows
      expect(userManagementComponent.find('.usermanagement__tr').length).toBe(2);
      userManagementComponent.find('#active-filter-dropdown').simulate('change', event);
      //verifyung after applying the filter as actibe - 1 row
      expect(userManagementComponent.find('.usermanagement__tr').length).toBe(1);
      console.log(userManagementComponent.state)
    })

    it('verifying the wild card search', () => {
      const event = { target: { name: "user-profiles-wild-card-search", value: "Admin" } };
      // verifying before entering the search text - 2 rows
      expect(userManagementComponent.find('.usermanagement__tr').length).toBe(2);
      userManagementComponent.find('#user-profiles-wild-card-search').simulate('change', event);
      //verifyung after entering the search text- 1 row
      expect(userManagementComponent.find('.usermanagement__tr').length).toBe(1);
    })

    it('verifying the column filters', () => {
      const event = { target: { name: "search_email_search", value: "onecommunityglobal@gmail.com" } };
      // verifying before entering  email the search text , there should be  2 rows
      expect(userManagementComponent.find('.usermanagement__tr').length).toBe(2);
      userManagementComponent.find('#search_email_search').simulate('change', event);
      //verifyung after entering the email search text , there should be 2 rows 
      expect(userManagementComponent.find('.usermanagement__tr').length).toBe(2);

      const dropdownevent = { target: { name: "search_role_search", value: "Volunteer" } };
      userManagementComponent.find('#search_role_search').simulate('change', dropdownevent);
      //verifyung after choosing the role from the drop down , there should be only 1 row
      expect(userManagementComponent.find('.usermanagement__tr').length).toBe(1);

      const commitedhrsevent = { target: { name: "search_hrs_search", value: "10" } };
      userManagementComponent.find('#search_hrs_search').simulate('change', dropdownevent);
      //verifyung after entering the  weekly committed hours search text - 2 row
      expect(userManagementComponent.find('.usermanagement__tr').length).toBe(0);

    })
  })

})