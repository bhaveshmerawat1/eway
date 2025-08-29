import React, { useState } from 'react'
import Button from '../Button/Button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Input from '../Inputs/Input';

interface SignInFormProps {
  onSubmit?: (e: React.FormEvent) => void;
  loading: boolean;
  errors: { userId?: string; password?: string };
  setErrors: React.Dispatch<
    React.SetStateAction<{ userId?: string; password?: string }>
  >;
  onClickCloseBtn?: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({
  onSubmit,
  loading,
  errors,
  setErrors,
  onClickCloseBtn
}) => {
  const [formState, setFormState] = useState({
    userId: "",
    password: "",
    saveUser: false,
    showPassword: false,
  });

  const handleChange = (key: string, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <>
      <div className="mb-2 flex justify-between border-b-1 border-gray-light px-4 pb-2">
        <p className='text-[16px] font-semibold'>Sign in</p>
        <Button
          type='button'
          arialabel='Close'
          children={'Close'}
          className='text-[12px] leading-[12px] p-1 font-bold'
          variant='textOnly'
          onButtonClick={onClickCloseBtn} />
      </div>

      <form onSubmit={onSubmit} className="px-4 py-2 w-72">
        {/* User ID */}
        <div className="mb-2">
          <Input
            type='number'
            name='userId'
            id='userId'
            value={formState.userId}
            onChange={(e) => {
              const value = e.target.value;
              handleChange("userId", value);
              // ✅ Clear error if previously set and input has value
              if (errors.userId && value.trim()) {
                setErrors((prev) => ({ ...prev, userId: undefined }));
              }
            }}
            inputLabel={true}
            inputLabelName='User ID'
            isErrors={!!errors.userId}
            isErrorMessage={errors.userId || ""}
            className={`w-full ${errors.userId ? 'border-red-500 bg-red-100' : 'border-gray-300 bg-white'}`}
            maxLength={10}
          />
        </div>
        {/* Password */}
        <div className="mb-2">
          <Input
            type={formState.showPassword ? "text" : "password"}
            name='password'
            id='password'
            value={formState.password}
            onChange={(e) => {
              const value = e.target.value;
              handleChange("password", value);
              // ✅ Clear error if previously set and input has value
              if (errors.password && value.trim()) {
                setErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            icon={formState.showPassword ? <FaEyeSlash /> : <FaEye />}
            iconPosition='right'
            onClickIcon={()=>handleChange("showPassword", !formState.showPassword)}
            inputLabel={true}
            inputLabelName='Password'
            isErrors={!!errors.password}
            isErrorMessage={errors.password || ""}
            className={`w-full ${errors.password ? 'border-red-500 bg-red-100' : 'border-gray-300 bg-white'}`}
            maxLength={10}
          />
        </div>

        {/* Save User */}
        <Input
          type='checkbox'
          name='saveUser'
          id='saveUser'
          value={formState.saveUser ? "on" : "off"}
          onChange={(e) => handleChange("saveUser", e.target.checked)}
          inputLabel={false}
          isInlineText='Save User ID'
          className="border-0 sm:bg-transparent sm:justify-start mb-2 sm:px-0"
          inputStyle="sm:w-4 h-4 mr-2 sm:justify-start accent-red-600"
        />

        {/* Submit */}
        <Button
          variant="secondary"
          className="m rounded-full hover:text-red-600 hover:bg-white sm:max-w-full hover:border-red-600 border-1 sm:py-2 text-sm" 
          type='submit'
          disabled={loading}
          loading={loading}
          children={"Sign In"}
        />

        <p className="text-xs mt-2">
          Forgot{" "}
          <span className="text-red-600 underline cursor-pointer">User ID</span>{" "}
          or{" "}
          <span className="text-red-600 underline cursor-pointer">Password</span>?
        </p>
      </form>
    </>
  )
}


export default SignInForm