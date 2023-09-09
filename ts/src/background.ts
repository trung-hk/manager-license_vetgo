import Keycloak from 'keycloak-js';
const keycloak = new Keycloak({
    url: 'https://keycloak.phanmemvet.vn',
    realm: 'vetgo',
    clientId: 'frontend'
});
setTimeout(async () => {
    try {
        console.log("User is authenticated");
      const authenticated =  await keycloak.init({ onLoad: 'login-required' });
      if(authenticated) {
          console.log(keycloak);
          console.log(keycloak.token);
      }

        //     .then(function(authenticated) {
        //     if (authenticated) {
        //         console.log("User is authenticated");
        //     } else {
        //         console.log("User is not authenticated");
        //     }
        // }).catch(function() {
        //     console.log("Keycloak initialization failed");
        // });

        // const authenticated = await keycloak.init({ onLoad: 'check-sso'});
        // console.log(`User is ${authenticated ? 'authenticated' : 'not authenticated'}`);
        // if(!authenticated) {
        //
        // }

    } catch (error) {
        console.error('Failed to initialize adapter:', error);
    }
})


