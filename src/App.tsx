import { Configuration, PublicClientApplication } from "@azure/msal-browser";
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate } from "@azure/msal-react";
import LoginPage from "./login/login";
import HomePage from "./homepage";

const config: Configuration = {
  auth: {
    clientId: "82e6d228-1dda-4fe8-afe2-fa9eddecc5ca",
    authority: "https://login.microsoftonline.com/a751704a-5b8b-4f54-8fb2-2a5c7fc1e759",
    redirectUri: "http://localhost:3000"
  },
  cache: {
    cacheLocation: 'sessionStorage'
  }
}

const client = new PublicClientApplication(config);

// Provider is just a context hook provider for client object
export default function App() {
  return (<>
    <MsalProvider instance={client}>
      <UnauthenticatedTemplate>
        <LoginPage />
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <HomePage />
      </AuthenticatedTemplate>
    </MsalProvider>
  </>);
}
