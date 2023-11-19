'use client'
import React, { useState } from 'react'
import s from './login.module.css'
import Image from 'next/image'
import { User, useUser } from '../context'
import { saveUserToLocalStorage } from '@/app/Utils/utils'

export default function Login() {


    const emailRef = React.useRef<HTMLInputElement | null>(null)
    const passwordRef = React.useRef<HTMLInputElement | null>(null)
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)

    const { setUser, user } = useUser()

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!emailRef || !passwordRef) {
            return
        }

        setEmailError(emailRef.current?.value !== "hassan@gmail.com")
        setPasswordError(passwordRef.current?.value !== "12345")

        if (emailRef?.current?.value && passwordRef.current?.value) {
            const user: User = {
                username: emailRef.current?.value,
                password: passwordRef.current?.value
            }
            if (emailRef.current?.value == "hassan@gmail.com" && passwordRef.current?.value == "12345") {
                setUser(user)
                saveUserToLocalStorage('user',user)
            }
        }


    }
    return (
        <div className={s.login}>

            <div className={s['image-part']}>
                <Image className={s.logo} src={require("../../public/Logo/Logo.png")} alt={''} />
                <div className={s['man-woman']}>
                    <Image className={s.woman} src={require('../../public/Woman/Woman.png')} alt={''} />
                    <Image className={s.man} src={require('../../public/Man/Man.png')} alt={''} />
                </div>
            </div>

            <div className={s['form-part']}>
                <div className={s['form-section']}>
                    <form onSubmit={handleFormSubmit} className={s['form']} action="">
                        <div className={s['form-title']}>Time to Work! </div>
                        <label className={s.label} htmlFor="">Email</label>
                        <input ref={emailRef} type='email' className={`${s['email']}  ${emailError && s['input-error']}`} /> <br />
                        {emailError && <div className={s['email-error']}> invalid email</div>}

                        <label className={s.label} htmlFor="">Password</label>
                        <input ref={passwordRef} type='password' className={`${s['password']}  ${passwordError && s['input-error']}`} /> <br />
                        {passwordError && <div className={s['password-error']}> incorrect password</div>}
                        <button type='submit' className={s['submit']}> SIGN IN </button>
                    </form>
                </div>

            </div>

        </div>
    )
}
