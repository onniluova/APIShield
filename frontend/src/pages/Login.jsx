import { useState } from 'react';
import Button from '../components/Button';
import Header from '../components/Header';
import Input from '../components/Input';

const Login = () => {
    return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center">
            <Header className="text-xl">Welcome To APIShield</Header>
            <Header className="text-4xl">Login</Header>
        </div>

        <div className="flex flex-col p-4 gap-4">
            <Input 
                placeholder="Username"
            >
            </Input>
            <Input
                placeholder="Password"
            >
            </Input>
        </div>

        <div className="flex gap-3">
            <Button>Login</Button>
            <Button className="size">Register</Button>
        </div>
    </div>
    );
}
export default Login;