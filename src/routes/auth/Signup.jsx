import React, { useEffect } from 'react'
import BottomNav from '../../components/BottomNav';
import { checkUser } from '../../utils/checkUser';
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router'
import supabase from '../../config/supabase'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock, User, Check, X } from 'lucide-react'
import useHomeStore from '../../context/store';

const Signup = () => {
  const { user, setUser } = useHomeStore()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = React.useState(false)
  const [passwordStrength, setPasswordStrength] = React.useState(0)
  const avatars = [
    '/profiles/1.jpg',
    '/profiles/2.jpg',
    '/profiles/3.jpg',
    '/profiles/4.jpg',
    '/profiles/5.jpg',
  ];
  const randomAvatar = getRandomAvatar();

  //random images
  function getRandomAvatar() {
    const num = Math.floor(Math.random() * 5) + 1; // generates 1 to 5
    return avatars[num];
  }


  //checking user
  useEffect(() => {
    checkUser(setUser).then((result) => {
      if (result.exist) {
        console.log("user existed")
        setUser(user)
        navigate("/profile")
      }
    })
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
    , reset
  } = useForm()

  const password = watch('password', '')

  // Password strength checker
  React.useEffect(() => {
    const calculateStrength = (pwd) => {
      let strength = 0
      if (pwd.length >= 8) strength++
      if (/[a-z]/.test(pwd)) strength++
      if (/[A-Z]/.test(pwd)) strength++
      if (/[0-9]/.test(pwd)) strength++
      if (/[^A-Za-z0-9]/.test(pwd)) strength++
      return strength
    }
    setPasswordStrength(calculateStrength(password))
  }, [password])

  const getStrengthColor = (strength) => {
    if (strength <= 1) return 'bg-red-500'
    if (strength <= 2) return 'bg-yellow-500'
    if (strength <= 3) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getStrengthText = (strength) => {
    if (strength <= 1) return 'Weak'
    if (strength <= 2) return 'Fair'
    if (strength <= 3) return 'Good'
    return 'Strong'
  }

  const onSubmit = async (formData) => {
    try {
      const { username, email, password } = formData
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            avatar: randomAvatar
          }
        }
      })

      if (error) {
        reset()
        toast.error(error.message)
      } else {
        toast.success("successully signup")
        //Creating the new row for board table
        const res = await supabase.from("board")
          .insert({ user_id: data.user.id, avatar: randomAvatar, username })
        console.log("added to board table", res)
        navigate('/profile')
      }


      // alert('Account created successfully!')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <main className="h-screen bg-bg flex flex-col items-center justify-center overflow-hidden">
   
      <div className="w-full max-w-md">
        {/* Main Form Container */}
        <div className="overflow-hidden">
          <div className="p-8">
           
            {/* Logo/Brand */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-primary
              bg-clip-text text-transparent mb-2">
                Learnsy
              </h1>
              <p className="text-gray-300 text-sm">Sign up to start your learning journey</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Username Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.username ? 'border-red-500' : 'border-gray-200'
                    }`}
                  {...register('username', {
                    required: 'Username is required',
                    minLength: {
                      value: 3,
                      message: 'Username must be at least 3 characters'
                    },
                    maxLength: {
                      value: 20,
                      message: 'Username must be less than 20 characters'
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: 'Username can only contain letters, numbers, and underscores'
                    }
                  })}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
                )}
              </div>

              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Please enter a valid email'
                    }
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Set Password"
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.password ? 'border-red-500' : 'border-gray-200'
                    }`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Password strength:</span>
                    <span className={`text-xs font-medium ${passwordStrength <= 1 ? 'text-red-500' :
                      passwordStrength <= 2 ? 'text-yellow-500' :
                        passwordStrength <= 3 ? 'text-blue-500' : 'text-green-500'
                      }`}>
                      {getStrengthText(passwordStrength)}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors duration-200 ${level <= passwordStrength ? getStrengthColor(passwordStrength) : 'bg-gray-200'
                          }`}
                      />
                    ))}
                  </div>

                  {/* Password Requirements */}
                  <div className="space-y-1 mt-2">
                    {[
                      { met: password.length >= 8, text: 'At least 8 characters' },
                    ].map((req, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {req.met ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <X className="h-3 w-3 text-red-400" />
                        )}
                        <span className={`text-xs ${req.met ? 'text-green-600' : 'text-gray-500'}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* Create Account Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 px-4 rounded-lg font-semibold text-sm hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white rounded-2xl text-gray-500">OR</span>
                </div>
              </div>

              {/* Social Login Options */}
              <div className="space-y-3">
                {/* Google Login */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.01]"
                  onClick={() => {
                    console.log('Google signup clicked')
                  }}
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign up with Google
                </button>
              </div>
            </form>

           {/* Sign In Link */}
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-300">
            Have an account?{' '}
            <button
              onClick={() => navigate('/signin')}
              className="text-indigo-600 font-semibold
               hover:text-indigo-800 transition-colors
                duration-200 underline underline-offset-2"
            >
              Log in
            </button>
          </p>
        </div>
         </div>
        </div>
      </div>


      <ToastContainer autoClose={100} />
      {/* Bottom Navigation */}
      <BottomNav />
    </main>

  )
}

export default Signup