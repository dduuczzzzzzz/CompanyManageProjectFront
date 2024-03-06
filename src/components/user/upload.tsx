import React, { useState, useEffect, useMemo } from 'react'
import { message, Button } from 'antd'
import { FileType } from '../../types/user'
import '../../styles/user/user.css'

const templateObj = {
  imgSrc: '',
  inputValue: '',
}
export const UploadPicture = ({
  selectedFile,
  setSelectedFile,
  avatar,
  setIsDeleteAvt,
}: {
  selectedFile: any
  setSelectedFile: any
  avatar: string
  setIsDeleteAvt: any
}) => {
  const [preview, setPreview] = useState<FileType>(templateObj)
  const [crImg, setCrImg] = useState<string>()
  const [display, setDisplay] = useState<string>()
  useEffect(() => {
    if (avatar) {
      setCrImg(process.env.REACT_APP_API_STORAGE_URL + avatar)
    }
  }, [avatar])
  useEffect(() => {
    if (!selectedFile) {
      setPreview((preview: any) => ({ ...preview, imgSrc: '', inputValue: '' }))
      return
    }
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview((preview: any) => ({ ...preview, imgSrc: objectUrl }))
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isJpgOrPng) {
      setSelectedFile(undefined)
      setPreview((preview: any) => ({ ...preview, inputValue: '' }))
      message.error('You can only upload JPG/PNG file!')
    } else if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
      setSelectedFile(undefined)
    } else {
      setSelectedFile(file)
      setIsDeleteAvt(undefined)
      setPreview((preview: any) => ({ ...preview, inputValue: file }))
    }
  }

  const onSelectFile = (e: any) => {
    setDisplay('')
    if (!e?.target?.files || e.target?.files?.length === 0) {
      setSelectedFile(undefined)
      return
    }
    beforeUpload(e?.target?.files[0])
  }

  const handleDeletePic = () => {
    setIsDeleteAvt(1)
    setSelectedFile(undefined)
    setCrImg('')
    setDisplay('hidden')
  }

  return (
    <>
      <div className={`show-image  ${display}`}>
        <button className="delete" type="button" onClick={handleDeletePic}>
          cancel
        </button>
        {selectedFile || avatar != null ? (
          <img
            onClick={handleDeletePic}
            src={preview.imgSrc || crImg}
            alt="avatar"
            className={`w-36 h-36 rounded-full picture-upload `}
          />
        ) : (
          ''
        )}
      </div>
      <div className={'inline'}>
        <input type="file" name="avatar-pic" onChange={onSelectFile} />
      </div>
    </>
  )
}
