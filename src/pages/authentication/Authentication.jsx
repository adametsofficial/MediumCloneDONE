import React, { useState, useEffect, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import useLocalStorage from "../../hooks/useLocalStorage";
import { CurrentUserContext } from "../../contexts/currentUser";
import { BackendErrorMessages } from "../../components/BackendErrorMessages/BackendErrorMessages";
import { _baseUrl } from "../../components/_baseUrl";

const Authentication = props => {
  const isLogin = props.match.path === "/login";
  const pageTitle = isLogin ? "Sign In" : "Sign Up";
  const descriptionLink = isLogin ? "/register" : "/login";
  const descriptionText = isLogin ? "Need an account?" : "Have an account?";
  const apiUrl = isLogin ? "/users/login" : "/users";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [isSuccessfullSubmit, setIsSuccessfullSubmit] = useState(false);
  const [, dispatch] = useContext(CurrentUserContext);

  const [{ response, isLoading, error }, doFetch] = useFetch(_baseUrl, apiUrl);
  const [, setToken] = useLocalStorage("token");

  const handleSubmit = e => {
    e.preventDefault();

    const user = isLogin ? { email, password } : { email, password, username };
    doFetch({
      method: "post",
      data: {
        user
      }
    });
  };

  useEffect(() => {
    if (!response) {
      return;
    } else {
      setToken(response.data.user.token);
      setIsSuccessfullSubmit(true);
      dispatch({ type: "SET_AUTHORIZED", payload: response.data.user });
    }
  }, [response, dispatch, setToken]);

  if (isSuccessfullSubmit) {
    return <Redirect to="/" />;
  }
  
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">{pageTitle}</h1>
            <p className="text-xs-center">
              <Link to={descriptionLink}>{descriptionText}</Link>
            </p>
            <form onSubmit={handleSubmit}>
              {error && (
                <BackendErrorMessages
                  backendError={error.response.data.errors}
                />
              )}
              <fieldset>
                {!isLogin && (
                  <fieldset className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Username"
                      value={username}
                      onChange={e => {
                        setUsername(e.target.value);
                      }}
                    />
                  </fieldset>
                )}
                <fieldset className="form-group">
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Email"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                    }}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type={"password"}
                    className="form-control form-control-lg"
                    placeholder="Password"
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                    }}
                  />
                </fieldset>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row-reverse",
                    alignItems: "center"
                  }}
                >
                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                    disabled={isLoading}
                  >
                    {pageTitle}
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
