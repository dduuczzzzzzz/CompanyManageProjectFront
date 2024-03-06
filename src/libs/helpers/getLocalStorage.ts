import { User } from '../../types/user'

export const getUser = (): User => {
  let userStorage = localStorage.getItem('user_info')
  let userInfo = userStorage ? JSON.parse(userStorage) : null
  return userInfo
}

export const getPermissions = (): Array<string> | null => {
  let permissionsStorage = localStorage.getItem('permissions')
  let permissionsInfo = permissionsStorage
    ? JSON.parse(permissionsStorage)
    : null
  return permissionsInfo
}

type ParentItem = {
  key: string
  icon: JSX.Element
  label: string
  children: Array<ChildrenItem | null> | null
}
export const checkParentSidebar = (
  permissionList: string[],
  sidebar: ParentItem,
  permissionsInfo = getPermissions(),
) => {
  if (
    Array.isArray(sidebar.children) &&
    sidebar.children.every((child) => child === null)
  )
    return null
  const result =
    permissionsInfo &&
    permissionList.every((element: string) => permissionsInfo.includes(element))
      ? sidebar
      : null
  return result
}

type ChildrenItem = {
  label: string
  key: string
}
export const checkChildrenSidebar = (
  permissionList: string[],
  sidebar: ChildrenItem,
  permissionsInfo = getPermissions(),
) => {
  const result =
    permissionsInfo &&
    permissionList.every((element: string) => permissionsInfo.includes(element))
      ? sidebar
      : null
  return result
}
