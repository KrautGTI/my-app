import React from "react";

import error404Pic from "../../assets/images/icons/404.png";

export const Page404 = () => (
    <div className="wrapper">
        <h1>Uh oh!</h1>
        <p>
            It doesn't look like this page exists. 
            Check the web address you entered in the URL bar above and try again. 
            {/*  TODO: update email, if maybe you want to direct the user to a custom email in case of a misdirect? */}
            {/*
            If you still are getting this message, contact 
            <a
                href="mailto:help@minute.tech"
                >

                &nbsp;help@minute.tech
            </a>. 
            */}
        </p>
        <img src={error404Pic} alt="error404" className="large responsive center" />
        
    </div>
  );