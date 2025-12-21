import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Input from "../components/Input";
import Header from "../components/Header";

const Home = () => {

    return (
        <div className="font-mono min-h-screen bg-gradient-to-br from-emerald-700 to-violet-700 flex flex-col p-4 gap-5">

            <div className="max-w-md">
                <Navbar>
                    <div className="flex gap-4">
                        <Button className="text-white lg:text-xl sm:text-xs m-1 bg-white/7 hover:bg-white/25">Profile</Button>
                        <Button className="text-white lg:text-xl sm:text-xs m-1 bg-white/7 hover:bg-white/25">Manage</Button>
                        <Button className="text-white lg:text-xl sm:text-xs m-1 bg-white/7 hover:bg-white/25">Logout</Button>
                    </div>
                </Navbar>
            </div>

            <div className="flex flex-grow flex-row justify-center items-center gap-2">
                <div className="flex flex-grow flex-col justify-center items-center gap-2">
                    <Header className="text-white sm:text-xs lg:text-xl">Analytics</Header>
                    <li className="text-white">
                        <ul>Status: </ul>
                    </li>
                    <Button className="text-white lg:text-xl sm:text-xs m-1 bg-white/7 hover:bg-white/25">Next</Button>
                </div>
                
                <div className="flex flex-grow flex-col justify-center items-center gap-2">
                    <Header className="text-white sm:text-xs lg:text-xl">Insert a link</Header>
                    <Input className="flex justify-center items-center max-w-md m-4"></Input>
                    <Button className="text-white lg:text-xl sm:text-xs m-1 bg-white/7 hover:bg-white/25">Next</Button>
                </div>
            </div>

            <div className="text-center bottom-6 text-white text-xs">
                © 2025 APIShield - Created by Onni Luova
            </div>
        </div>
    );
}

export default Home;