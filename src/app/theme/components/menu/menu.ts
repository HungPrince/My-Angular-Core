import { Menu } from './menu.model';

export const verticalMenuItems = [
    new Menu(1, 'Dashboard', '/pages/dashboard', null, 'tachometer', null, false, 0),
    new Menu(2, 'Users', '/pages/users', null, 'users', null, false, 0),
    new Menu(3, 'Roles', '/pages/roles', null, 'users', null, false, 0),
    new Menu(4, 'Functions', '/pages/functions', null, 'functions', null, false, 0),
    new Menu(45, 'Blank', '/pages/blank', null, 'file-o', null, false, 40),
    new Menu(46, 'Error', '/pagenotfound', null, 'exclamation-circle', null, false, 40),
]

export const horizontalMenuItems = [
    new Menu(1, 'Dashboard', '/pages/dashboard', null, 'tachometer', null, false, 0),
    new Menu(2, 'Users', '/pages/user', null, 'users', null, false, 0),
    new Menu(45, 'Blank', '/pages/blank', null, 'file-o', null, false, 40),
    new Menu(46, 'Error', '/pagenotfound', null, 'exclamation-circle', null, false, 40),
]