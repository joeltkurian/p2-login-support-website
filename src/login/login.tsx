import { useMsal } from "@azure/msal-react";
import { useRef, useState } from "react";
import { HashLoader } from 'react-spinners';
import './login.css'
import { css } from '@emotion/react';
import { InteractionRequiredAuthError } from "@azure/msal-common";

export default function LoginPage() {

    const client = useMsal();
    const username = useRef(null);
    // const password = useRef(null);
    const [loadingFetch, setLoading] = useState(false);

    async function getAccount() {
        const silentRequest = {
            scopes: ["User.Read", "Mail.Read"],
            loginHint: username.current.value,
        };
        // client.instance.loginPopup(); // Will create a popup to login
        // client.instance.loginRedirect(loginRequest);
        try {
            await client.instance.ssoSilent(silentRequest);
        } catch (err) {
            if (err instanceof InteractionRequiredAuthError) {
                await client.instance.loginPopup(silentRequest).catch(error => {
                    alert("Incorrect username, please try again");
                    setLoading(false);
                });
            } else {
                alert("Could not login, please try again");
                setLoading(false);
            }
        }
    }

    async function login() {
        setLoading(true);
        await getAccount();
    };

    return (
        <div className='total'>
            <div className='container'>
                <label className='usernameLabel'>username</label>
                <input ref={username} type="text" className='usernameInput' placeholder='' />
                {/* <label className='passwordLabel'>password</label>
                <input ref={password} type="password" className='passwordInput' placeholder='' /> */}
                {loadingFetch ? <div className='loader'><HashLoader color='white' css={override} size={50} /><HashLoader color='white' css={override} size={50} /><HashLoader color='white' css={override} size={50} /><HashLoader color='white' css={override} size={50} /><HashLoader color='white' css={override} size={50} /></div> :
                    <button className="loginBtn" onClick={login}>Login</button>
                }
            </div>
        </div>
    );
}
export const override = css`
margin: auto auto;
display:inline-block;
margin-left:10px;
opacity: 0.5;
`;
