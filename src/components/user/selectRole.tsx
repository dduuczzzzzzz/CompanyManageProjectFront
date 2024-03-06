import { Select } from 'antd'
export const SelectRole = ({ className, keyName, handle, defaultValue }: any) => {
  return (
    <>
      <Select
        onChange={(value) => handle(keyName, value)}
        className={className}
        value={defaultValue?.gender}
        options={[
          { value: '1', label: 'Admin' },
          { value: '0', label: 'User' },
        ]}
      />
    </>
  )
}
