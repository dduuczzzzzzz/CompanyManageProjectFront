import * as yup from 'yup'
export const validationSchema = yup.object().shape({
  name: yup.string().required('User name is required!.'),
  email: yup
    .string()
    .email('Email address is not valid!')
    .required('User email is required'),
  password: yup
    .string()
    .nullable()
    .min(6, 'Password must have at least 6 characters!'),
  password_confirmation: yup
    .string()
    .nullable()
    .min(6, 'Password must have at least 6 characters!'),
  dob: yup
    .date()
    .nullable()
    .max(new Date(), 'Date of birth must be before today!'),
  avatar: yup
    .mixed()
    .test('fileFormat', 'File not valid!', (value: any) => {
      if (!value) return true // Bỏ qua validation nếu không có giá trị avatar
      const supportedFormats = ['jpeg', 'png', 'jpg', 'gif', 'svg']
      const fileExtension = value.name.split('.').pop().toLowerCase()
      return supportedFormats.includes(fileExtension)
    })
    .nullable()
    .test('fileSize', 'File size exceed maximum allowed!', (value: any) => {
      if (!value) return true // Bỏ qua validation nếu không có giá trị avatar
      return value.size <= 4096 // 4096KB = 4MB
    }),
})
