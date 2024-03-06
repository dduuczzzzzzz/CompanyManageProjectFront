import * as yup from 'yup'
export const validationSchema = yup.object().shape({
  name: yup.string().required('Vui lòng nhập tên.'),
  email: yup
    .string()
    .email('Vui lòng nhập địa chỉ email hợp lệ.')
    .required('Vui lòng nhập email.'),
  password: yup.string().nullable().min(6, 'Mật khẩu phải có ít nhất 6 kí tự'),
  password_confirmation: yup
    .string()
    .nullable()
    .min(6, 'Mật khẩu phải có ít nhất 6 kí tự'),
  dob: yup
    .date()
    .nullable()
    .max(new Date(), 'Ngày sinh phải trước ngày hiện tại.'),
  avatar: yup
    .mixed()
    .test('fileFormat', 'Định dạng tệp không hợp lệ.', (value: any) => {
      if (!value) return true // Bỏ qua validation nếu không có giá trị avatar
      const supportedFormats = ['jpeg', 'png', 'jpg', 'gif', 'svg']
      const fileExtension = value.name.split('.').pop().toLowerCase()
      return supportedFormats.includes(fileExtension)
    })
    .nullable()
    .test(
      'fileSize',
      'Kích thước tệp không được vượt quá 4MB.',
      (value: any) => {
        if (!value) return true // Bỏ qua validation nếu không có giá trị avatar
        return value.size <= 4096 // 4096KB = 4MB
      },
    ),
})
