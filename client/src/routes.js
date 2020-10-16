import { Account, AccountMultiple } from 'mdi-material-ui';
import UserList from './containers/Users/UserList';
import Profile from './containers/Auth/Profile';

const routeCategories = [
  {
    id: 'manage',
    name: 'Manage',
    isHidden: false,
    routes: [
      {
        id: 'users',
        name: 'Users',
        path: '/dashboard/users',
        isHidden: false,
        component: UserList,
        permissions: ['userInsert', 'userRead', 'userModify'],
        requiresAnyPermissions: false,
        icon: AccountMultiple,
      },
    ],
  },
  {
    id: 'accountSettings',
    name: 'Account Settings',
    isHidden: true,
    routes: [
      {
        id: 'profile',
        name: 'Profile',
        path: '/dashboard/profile',
        component: Profile,
        icon: Account,
      },
    ],
  },
];

export default routeCategories;
